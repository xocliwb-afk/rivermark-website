/* eslint-disable @typescript-eslint/no-require-imports -- Existing no-network TypeScript test convention. */
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const Module=require('node:module');
const ts=require('typescript');
const root=path.resolve(__dirname,'..');
const originalLoad=Module._load;
Module._load=function(id,...args){
  if(id==='server-only')return {};
  if(id==='next/navigation')return {...originalLoad.call(this,id,...args),usePathname:()=>'/'};
  if(id.startsWith('@/'))id=path.join(root,'src',id.slice(2));
  return originalLoad.call(this,id,...args);
};
require.extensions['.css']=module=>{module.exports={};};
for(const extension of ['.ts','.tsx'])require.extensions[extension]=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{
  compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true},
}).outputText,filename);
const {createElement}=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
const {HomePage}=require('../src/components/HomePage.tsx');
const {serviceAreaMapDisplay}=require('../src/config/service-area-map.ts');
const guards=require('./helpers/map-guards.cjs');
const fixtureDir=path.join(__dirname,'fixtures/map-source');
const manifest=JSON.parse(fs.readFileSync(path.join(fixtureDir,'manifest.json'),'utf8'));
const render=(Component,props)=>renderToStaticMarkup(createElement(Component,props));
const scratch=fs.mkdtempSync(path.join(os.tmpdir(),'rivermark-map-negative-'));
process.on('exit',()=>fs.rmSync(scratch,{recursive:true,force:true}));
function fixture(name,value){
  const file=path.join(scratch,name);
  fs.writeFileSync(file,typeof value==='string'?value:JSON.stringify(value));
  return typeof value==='string'?fs.readFileSync(file,'utf8'):JSON.parse(fs.readFileSync(file,'utf8'));
}
function renderArtwork(entry){
  const name=path.basename(entry.component,'.tsx');
  return render(require(path.join(root,entry.component))[name],{idPrefix:'geometry-test',title:'Test map',description:'Test map description'});
}

test('A125 independent supplied SVG fixture hashes and all 133 geometric elements remain unchanged',()=>{
  let count=0;
  for(const entry of manifest.artworks){
    const svg=fs.readFileSync(path.join(fixtureDir,entry.file),'utf8');
    assert.equal(guards.digest(svg),entry.sha256,`${entry.file}: immutable pre-correction supplied source hash`);
    const actual=renderArtwork(entry);
    assert.equal(guards.geometryRecords(svg).length,entry.geometryElements);
    guards.assertGeometry(svg,actual);
    count+=entry.geometryElements;
  }
  assert.equal(count,133);
});

test('A125 geometry guard rejects a changed shape and an effective parent transform in scratch only',()=>{
  const entry=manifest.artworks[0],source=fs.readFileSync(path.join(fixtureDir,entry.file),'utf8'),actual=renderArtwork(entry);
  const changed=fixture('changed-shape.svg',actual.replace(/\bcx="([\d.]+)"/,(_,value)=>`cx="${Number(value)+1}"`));
  assert.throws(()=>guards.assertGeometry(source,changed),/Geometry attributes/);
  const moved=fixture('changed-parent-transform.svg',actual.replace(/<g\b(?=[^>]*\bid=)/, '<g transform="translate(1 0)"'));
  assert.throws(()=>guards.assertGeometry(source,moved),/Geometry attributes/);
  const changedRule=fixture('changed-fill-rule.svg',actual.replace(/<g\b(?=[^>]*\bid=)/, '<g fill-rule="evenodd"'));
  assert.throws(()=>guards.assertGeometry(source,changedRule),/Geometry attributes/);
  const computed=goodBrowserState();
  computed.figures[0].artworks[0].geometryCssTransforms[0].transform='matrix(0.707107, 0.707107, -0.707107, 0.707107, 0, 0)';
  guards.assertBrowserMaps(computed);
  const changedPattern=structuredClone(computed);
  changedPattern.figures[0].artworks[0].geometryCssTransforms[0].transform='rotate(46)';
  assert.throws(()=>guards.assertBrowserMaps(fixture('changed-computed-pattern.json',changedPattern)),/computed shape\/ancestor matrix/);
  const changedCss=structuredClone(computed);
  changedCss.figures[0].artworks[0].geometryCssTransforms.push({tag:'circle',id:'',transform:'translate(1 0)'});
  assert.throws(()=>guards.assertBrowserMaps(fixture('changed-computed-shape.json',changedCss)),/Computed shape\/ancestor transform count/);
});

test('A127 Ferrysburg overlays independently match the pinned official Census polygon in all four original projections',()=>{
  for(const entry of manifest.artworks){
    const actual=renderArtwork(entry),original=guards.assertFerrysburgOverlay(actual);
    assert.equal(guards.geometryRecords(actual).length,entry.geometryElements+2);
    assert.equal(guards.geometryRecords(original).length,entry.geometryElements);
  }
});

test('A127 overlay guard rejects missing, altered, moved and concealed geometry using scratch fixtures',()=>{
  const actual=renderArtwork(manifest.artworks[0]);
  const changed=actual.replace(/(data-map-overlay="ferrysburg-extended">\s*<path d="M)([\d.]+)/,(_,start,x)=>start+(Number(x)+1));
  assert.throws(()=>guards.assertFerrysburgOverlay(fixture('shifted-overlay.svg',changed)),/overlay coordinates/);
  assert.throws(()=>guards.assertFerrysburgOverlay(fixture('missing-overlay.svg',actual.replace(/<g data-map-overlay="ferrysburg-extended">[\s\S]*?<\/g>/,''))),/Exactly one/);
  assert.throws(()=>guards.assertFerrysburgOverlay(fixture('transformed-overlay.svg',actual.replace('data-map-overlay="ferrysburg-extended"','data-map-overlay="ferrysburg-extended" transform="translate(1 0)"'))),/must not move/);
  assert.throws(()=>guards.assertFerrysburgOverlay(fixture('concealed-shape.svg',actual.replace('data-map-overlay="ferrysburg-extended">','data-map-overlay="ferrysburg-extended"><circle cx="1" cy="1" r="1"/>'))),/may not conceal/);
  const state=goodBrowserState();state.figures[0].artworks[0].overlayCssTransforms=[{tag:'g',transform:'translate(1 0)'}];
  assert.throws(()=>guards.assertBrowserMaps(fixture('overlay-css-transform.json',state)),/must not be moved/);
});

test('A125 actual hero contains exactly the two approved MAIN actions and separate quiet caption link',()=>{
  guards.assertHero(render(HomePage));
});

test('A125 extra main hero action negative fixture is rejected without changing live files',()=>{
  const html=render(HomePage).replace('What Your Inspection Includes</a>','What Your Inspection Includes</a><a href="/pricing/">View Pricing</a>');
  assert.throws(()=>guards.assertHero(fixture('extra-main-action.html',html)),/Exactly the two approved MAIN hero actions/);
});

test('A127 captions and zone examples preserve A124 with the authorized Extended additions',()=>{
  guards.assertDisplayData(serviceAreaMapDisplay);
});

test('A125 unauthorized Included community negative fixture is rejected',()=>{
  const data=structuredClone(serviceAreaMapDisplay);data.zones[0].communities.push('Unauthorized example');
  assert.throws(()=>guards.assertDisplayData(fixture('extra-included-community.json',data)),/Community examples must match/);
});

test('A125 all four artworks separate accessible names/descriptions with unique local references',()=>{
  const {ServiceAreaMap}=require('../src/components/ServiceAreaMap.tsx');
  const html=render('div',{children:['hero','full','hero'].map((variant,i)=>createElement(ServiceAreaMap,{key:i,variant,idPrefix:'same-prefix'}))});
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
  assert.equal(new Set(ids).size,ids.length);
  for(const [svg] of html.matchAll(/<svg\b[\s\S]*?<\/svg>/g)){
    guards.assertSvgSemantics(svg);
    const circles=[...svg.matchAll(/<circle\b[^>]*>/g)].map(x=>guards.attrs(x[0]));
    const labels=[...svg.matchAll(/<text\b[^>]*data-city="[^"]+"[^>]*>/g)].map(x=>guards.attrs(x[0]));
    for(const label of labels){
      const markers=circles.filter(c=>c['data-city']===label['data-city']);
      assert.equal(markers.length,label['data-city']==='grand-rapids'?2:1,`${label['data-city']}: explicit source correspondence`);
      assert.ok(markers.every(m=>m['data-city-tier']===label['data-city-tier']));
    }
    for(const circle of circles.filter(c=>c['data-city']))assert.equal(labels.filter(l=>l['data-city']===circle['data-city']).length,1);
  }
});

// This intentionally simple measured-state fixture exercises assertion failure paths.
// The headed runner separately supplies actual rendered paint metrics and AX nodes.
function goodBrowserState(){
  const labels=guards.ESSENTIAL.map((city,i)=>({city,tier:'essential',label:city,visible:true,effectiveFont:16,paint:{left:20+i*100,right:70+i*100,top:0,bottom:10}}));
  const markers=guards.ESSENTIAL.flatMap((city,i)=>[{city,tier:'essential',visible:true,cx:45+i*100,cy:30,r:city==='grand-rapids'?6.4:3},...(city==='grand-rapids'?[{city,tier:'essential',visible:true,cx:45,cy:30,r:2.6}]:[])]);
  const artwork={artwork:'full-compact',visible:true,scale:1,labels,markers,title:'Map',description:'Description',titleId:'title',descriptionId:'desc',labelledby:'title',describedby:'desc',focusable:0,unpairedCityPoints:0,overlaySvg:renderArtwork(manifest.artworks.find(entry=>entry.artwork==='full-compact')),overlayCssTransforms:[],geometryCssTransforms:guards.sourceComputedTransforms('full-compact').map(({tag,id,matrix})=>({tag,id,transform:`matrix(${matrix.join(', ')})`}))};
  return {width:390,height:800,overflow:false,ids:['title','desc'],figures:[{variant:'full',width:350,wrapperName:null,artworks:[artwork,{...structuredClone(artwork),artwork:'full-wide',visible:false}]}]};
}
test('A125 visible painted-label collision negative fixture is rejected',()=>{
  const state=goodBrowserState();guards.assertBrowserMaps(state);
  state.figures[0].artworks[0].labels[0].paint={left:40,right:65,top:20,bottom:35};
  assert.throws(()=>guards.assertBrowserMaps(fixture('colliding-label.json',state)),/halo overlaps visible grand-rapids marker/);
});
test('A125 both variants displayed negative fixture is rejected',()=>{
  const state=goodBrowserState();state.figures[0].artworks[1].visible=true;
  assert.throws(()=>guards.assertBrowserMaps(fixture('both-variants-visible.json',state)),/Exactly one artwork/);
});
test('A125 orphan point negative fixture is rejected by explicit city identity',()=>{
  const state=goodBrowserState();state.figures[0].artworks[0].markers.push({city:'orphan-city',tier:'optional',visible:true,cx:10,cy:10,r:3});
  assert.throws(()=>guards.assertBrowserMaps(fixture('orphan-point.json',state)),/visibility mismatch \(orphan point\)/);
});
test('A125 current local instructions agree on Home CTA, approved phone and authoritative Master directory',()=>{
  guards.assertInstructions(Object.fromEntries(['AGENTS.md','CLAUDE.md','docs/IMPLEMENTATION_BASELINE.md'].map(file=>[file,fs.readFileSync(path.join(root,file),'utf8')])));
});
