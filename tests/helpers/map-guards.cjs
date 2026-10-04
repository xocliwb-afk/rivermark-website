/* eslint-disable @typescript-eslint/no-require-imports -- Standard-library test helper, shared by the headed browser runner. */
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');

const ESSENTIAL = ['grand-rapids', 'holland', 'grand-haven', 'spring-lake'];
const IDENTITY = [1, 0, 0, 1, 0, 0];
const SHAPES = new Set(['path', 'circle', 'ellipse', 'line', 'rect', 'polygon', 'polyline']);
const GEOMETRY = new Set(['d', 'points', 'x', 'y', 'x1', 'x2', 'y1', 'y2', 'cx', 'cy', 'r', 'rx', 'ry', 'width', 'height', 'pathLength']);
const decode = value => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, k, v]) => [k, decode(v)]));
const textOnly = html => decode(html.replace(/<[^>]+>/g, '')).trim();
const digest = value => createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
const multiply = (a, b) => [a[0]*b[0]+a[2]*b[1], a[1]*b[0]+a[3]*b[1], a[0]*b[2]+a[2]*b[3], a[1]*b[2]+a[3]*b[3], a[0]*b[4]+a[2]*b[5]+a[4], a[1]*b[4]+a[3]*b[5]+a[5]];
function transformMatrix(value = '') {
  let matrix = IDENTITY;
  for (const [, name, input] of value.matchAll(/([A-Za-z]+)\(([^)]*)\)/g)) {
    const n = input.trim().split(/[\s,]+/).map(Number);
    assert.ok(n.every(Number.isFinite), 'Geometry transform must be finite');
    let next;
    if (name === 'matrix' && n.length === 6) next = n;
    else if (name === 'translate') next = [1,0,0,1,n[0],n[1] ?? 0];
    else if (name === 'scale') next = [n[0],0,0,n[1] ?? n[0],0,0];
    else if (name === 'rotate') {
      const angle = n[0]*Math.PI/180; next = [Math.cos(angle),Math.sin(angle),-Math.sin(angle),Math.cos(angle),0,0];
      if (n.length === 3) next = multiply(multiply([1,0,0,1,n[1],n[2]],next),[1,0,0,1,-n[1],-n[2]]);
    } else if (name === 'skewX') next = [1,0,Math.tan(n[0]*Math.PI/180),1,0,0];
    else if (name === 'skewY') next = [1,Math.tan(n[0]*Math.PI/180),0,1,0,0];
    else assert.fail(`Unsupported geometric transform: ${name}`);
    matrix = multiply(matrix,next);
  }
  assert.ok(!value.replace(/[A-Za-z]+\([^)]*\)/g, '').trim(), 'Unparsed geometric transform');
  return matrix;
}
const normalizeNumbers = value => (value.match(/[A-Za-z]|[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?/g) ?? []).map(token => Number.isFinite(Number(token)) ? Number(token) : token);
function geometryRecords(svg) {
  const stack = [{ matrix: IDENTITY, context: [], fillRule: 'nonzero', clipRule: 'nonzero', clipping: [] }];
  const shapes = [];
  for (const match of svg.matchAll(/<\/?([\w:-]+)\b[^>]*>/g)) {
    const raw = match[0], tag = match[1];
    if (raw.startsWith('</')) { stack.pop(); continue; }
    const a = attrs(raw), parent = stack.at(-1);
    const matrix = multiply(parent.matrix,transformMatrix(a.transform));
    const inline = Object.fromEntries((a.style || '').split(';').filter(Boolean).map(part => part.split(':').map(value => value.trim())));
    if (!['text','tspan'].includes(tag)) assert.ok(!inline.transform, 'Geometric transforms must not be hidden in inline CSS');
    const fillRule = inline['fill-rule'] || a['fill-rule'] || parent.fillRule;
    const clipRule = inline['clip-rule'] || a['clip-rule'] || parent.clipRule;
    const clip = inline['clip-path'] || a['clip-path'];
    // Strip only the runtime instance prefix, retaining the supplied geometry target ID.
    const clipping = clip && clip !== 'none' ? [...parent.clipping, clip.replace(/url\(#(?:[^)]*-)?(rm-(?:hero|service-area)-map-[^)]+)\)/g, 'url(#$1)')] : parent.clipping;
    // Pattern coordinate systems affect their descendant geometry even though pattern is not a shape.
    const context = ['svg','pattern','clipPath'].includes(tag) ? [...parent.context, Object.fromEntries(Object.entries(a).filter(([key]) => ['viewBox','preserveAspectRatio','patternUnits','patternContentUnits','patternTransform','clipPathUnits','width','height','x','y'].includes(key)))] : parent.context;
    if (SHAPES.has(tag)) {
      assert.ok(!a.style || !/transform|[xy]:|width:|height:|\bd:/.test(a.style), 'Geometry must not be moved by inline CSS');
      shapes.push({ tag, attributes: Object.fromEntries(Object.entries(a).filter(([key]) => GEOMETRY.has(key)).sort(([a],[b])=>a.localeCompare(b)).map(([k,v]) => [k,normalizeNumbers(v)])), matrix: matrix.map(v => Math.round(v*1e10)/1e10), context, fillRule, clipRule, clipping });
    }
    if (!raw.endsWith('/>')) stack.push({ matrix, context, fillRule, clipRule, clipping });
  }
  return shapes.sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
}
// Chromium exposes SVG patternTransform through computed `transform`, including in defs.
// Derive its allowed matrix and source ID from hash-verified independent SVGs, never runtime code.
const computedTransformBaselines = new Map();
function sourceComputedTransforms(artwork) {
  if (computedTransformBaselines.has(artwork)) return computedTransformBaselines.get(artwork);
  const fs = require('node:fs'), path = require('node:path');
  const directory = path.join(__dirname, '../fixtures/map-source');
  const manifest = JSON.parse(fs.readFileSync(path.join(directory, 'manifest.json'), 'utf8'));
  const entry = manifest.artworks.find(entry => entry.artwork === artwork);
  assert.ok(entry, `Independent transform source must exist: ${artwork}`);
  const source = fs.readFileSync(path.join(directory, entry.file), 'utf8');
  assert.equal(digest(source), entry.sha256, 'Independent transform source hash must remain unchanged');
  const stack = [], records = [];
  for (const match of source.matchAll(/<\/?([\w:-]+)\b[^>]*>/g)) {
    const raw = match[0], tag = match[1];
    if (raw.startsWith('</')) { stack.pop(); continue; }
    const a = attrs(raw), value = a.transform || (tag === 'pattern' ? a.patternTransform : undefined);
    const node = value ? { tag, id: a.id || '', matrix: transformMatrix(value) } : null;
    if (SHAPES.has(tag)) records.push(...[...stack, node].reverse().filter(Boolean));
    if (!raw.endsWith('/>')) stack.push(node);
  }
  const sorted = records.sort((a,b) => `${a.tag}:${a.id}`.localeCompare(`${b.tag}:${b.id}`));
  computedTransformBaselines.set(artwork, sorted);
  return sorted;
}
function assertComputedTransforms(artwork, actual) {
  const expected = sourceComputedTransforms(artwork);
  const sorted = actual.map(record => ({ tag: record.tag, id: record.id, matrix: transformMatrix(record.transform) }))
    .sort((a,b) => `${a.tag}:${a.id}`.localeCompare(`${b.tag}:${b.id}`));
  assert.equal(sorted.length, expected.length, 'Computed shape/ancestor transform count must match independent supplied SVG');
  for (let i=0; i<expected.length; i++) {
    assert.equal(sorted[i].tag, expected[i].tag, 'Computed transform element must match supplied SVG');
    assert.equal(sorted[i].id, expected[i].id, 'Computed transform identity must match supplied SVG');
    // getComputedStyle serializes rotation matrices to six decimal places.
    assert.ok(sorted[i].matrix.every((value,j) => Math.abs(value-expected[i].matrix[j]) <= 0.000001),
      `${artwork}: computed shape/ancestor matrix must match independent supplied SVG`);
  }
}
// Independent A127 source: the cached, unmodified Census response is never generated
// from runtime artwork. Crop bounds and projection come from the supplied A124 handoff.
const FERRYSBURG_CROPS = {
  'hero-wide': { bbox: [-86.47,42.53,-85.01,43.405], width: 560, height: 459, prefix: 'rm-hero-map-desktop' },
  'hero-compact': { bbox: [-86.4,42.545,-85.04,43.385], width: 350, height: 295, prefix: 'rm-hero-map-phone' },
  'full-wide': { bbox: [-86.75,42.1,-84.35,43.85], width: 1000, height: 997, prefix: 'rm-service-area-map-desktop' },
  'full-compact': { bbox: [-86.56,42.22,-84.74,43.66], width: 390, height: 422, prefix: 'rm-service-area-map-phone' },
};
function ferrysburgPath(artwork) {
  const fs=require('node:fs'),path=require('node:path');
  const source=fs.readFileSync(path.join(__dirname,'../fixtures/map-source/ferrysburg-census-2026.geojson'),'utf8');
  assert.equal(digest(source),'0c211babc056b32a792033d8ab7c7fa65bf6989cd7d0592af877c6d05f2c8b40','Independent Census Ferrysburg response hash must remain unchanged');
  const data=JSON.parse(source),feature=data.features[0],crop=FERRYSBURG_CROPS[artwork];
  assert.equal(data.features.length,1);assert.equal(feature.properties.GEOID,'2627960');
  assert.equal(feature.geometry.type,'Polygon');assert.ok(crop,'Known original map crop required');
  const [west,south,east,north]=crop.bbox,cos=Math.cos((south+north)/2*Math.PI/180),k=crop.width/((east-west)*cos);
  const fmt=value=>Number(value.toFixed(1)).toString();
  return feature.geometry.coordinates.map(ring=>{
    assert.deepEqual(ring[0],ring.at(-1),'Official municipal polygon ring must be closed');
    return 'M'+ring.slice(0,-1).map(([lon,lat])=>`${fmt((lon-west)*cos*k)},${fmt((north-lat)*k)}`).join('L')+'Z';
  }).join('');
}
function assertFerrysburgOverlay(svg) {
  const root=attrs(svg.match(/<svg\b[^>]*>/)?.[0]??''),crop=FERRYSBURG_CROPS[root['data-map-artwork']];
  assert.ok(crop,'Ferrysburg overlay must use a known original artwork');
  assert.equal(root.viewBox,`0 0 ${crop.width} ${crop.height}`,'Ferrysburg overlay must use its original crop viewBox');
  const groups=[...svg.matchAll(/<g\b[^>]*\bdata-map-overlay="ferrysburg-extended"[^>]*>([\s\S]*?)<\/g>/g)];
  assert.equal(groups.length,1,'Exactly one authorized Ferrysburg overlay group is required');
  const [group,inner]=groups[0];
  assert.deepEqual(attrs(group.match(/^<g\b[^>]*>/)[0]),{'data-map-overlay':'ferrysburg-extended'},'Ferrysburg group must not move, clip or hide geometry');
  const paths=[...inner.matchAll(/<path\b[^>]*\/>|<path\b[^>]*><\/path>/g)].map(([path])=>attrs(path));
  assert.equal(paths.length,2,'Ferrysburg overlay must contain only two verified paths');
  assert.equal(inner.replace(/<path\b[^>]*\/>|<path\b[^>]*><\/path>/g,'').trim(),'','Ferrysburg overlay may not conceal other artwork');
  const d=ferrysburgPath(root['data-map-artwork']);
  const hatch=svg.match(new RegExp(`<pattern\\b[^>]*id="([^"]*${crop.prefix}-hatch)"`))?.[1];
  assert.ok(hatch,'Ferrysburg must use the existing Extended hatch');
  assert.deepEqual(paths,[{d,fill:'#F4F1EA'},{d,fill:`url(#${hatch})`,stroke:'#202421','stroke-width':'1.1','stroke-dasharray':'3 2','stroke-linejoin':'round'}],'Ferrysburg overlay coordinates and treatment must match the independent official source projection');
  const before=svg.slice(0,groups[0].index),after=svg.slice(groups[0].index+group.length);
  assert.ok(before.includes(`${crop.prefix}-zone-included`),'Ferrysburg must overpaint the Included fill');
  assert.ok(after.includes(`${crop.prefix}-roads`),'Ferrysburg must remain below existing roads, city markers and labels');
  return svg.replace(group,'');
}
function assertGeometry(sourceSvg, renderedSvg) {
  const originalArtwork=assertFerrysburgOverlay(renderedSvg);
  assert.deepEqual(geometryRecords(originalArtwork),geometryRecords(sourceSvg),'Geometry attributes and effective ancestor transforms must match independent supplied SVG');
  return digest(geometryRecords(sourceSvg));
}
function assertSvgSemantics(svg) {
  const root = attrs(svg.match(/<svg\b[^>]*>/)?.[0] ?? '');
  const title = svg.match(/<title\b([^>]*)>([\s\S]*?)<\/title>/);
  const desc = svg.match(/<desc\b([^>]*)>([\s\S]*?)<\/desc>/);
  assert.ok(title && desc, 'Artwork must have one title and description');
  assert.equal(root['aria-labelledby'],attrs(title[1]).id,'Accessible name must reference only its title');
  assert.equal(root['aria-describedby'],attrs(desc[1]).id,'Accessible description must reference only its description');
  const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
  assert.equal(new Set(ids).size,ids.length,'SVG IDs must be unique');
  const refs = [...svg.matchAll(/\baria-(?:labelledby|describedby)="([^"]+)"/g)].flatMap(x=>x[1].split(/\s+/));
  refs.push(...[...svg.matchAll(/url\(#([^)]+)\)|\b(?:href|xlink:href)="#([^"]+)"/g)].map(x=>x[1] || x[2]));
  for (const id of refs) assert.ok(ids.includes(id),`SVG reference must resolve: ${id}`);
  return { title: textOnly(title[2]), description: textOnly(desc[2]) };
}
function assertHero(html) {
  const hero = html.match(/<section\b[^>]*aria-labelledby="homepage-heading"[\s\S]*?<\/section>/)?.[0];
  assert.ok(hero,'Actual Home hero must exist');
  const withoutMap = hero.replace(/<figure\b[\s\S]*?<\/figure>/g,'');
  const links = [...withoutMap.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map(([,tag,label])=>({ href:attrs(tag).href.replace(/\/$/,''), label:textOnly(label) }));
  assert.deepEqual(links,[{href:'/price-availability',label:'See Price & Availability'},{href:'/services/residential-home-inspections',label:'What Your Inspection Includes'}],'Exactly the two approved MAIN hero actions are allowed');
  assert.doesNotMatch(hero,/<(?:input|table)\b|\$\s*\d/i,'Hero must not add inputs, tables or travel-dollar presentation');
  assert.ok(hero.includes('Travel included in Grand Rapids, Holland, Grand Haven and Spring Lake.'));
  const quiet = [...hero.matchAll(/<figcaption\b[\s\S]*?<\/figcaption>/g)].join('');
  assert.equal([...quiet.matchAll(/<a\b/g)].length,1,'One quiet caption link remains separate from MAIN actions');
  assert.match(quiet,/href="\/service-area\/?"[^>]*>View service area<\/a>/);
}
function assertDisplayData(display) {
  assert.equal(display.heroCaption,'Travel included in Grand Rapids, Holland, Grand Haven and Spring Lake.');
  assert.equal(display.fullCaption,'Approximate coverage; the property address determines travel.');
  assert.deepEqual(display.zones.map(({id,communities})=>({id,communities})),[
    {id:'included',communities:['Grand Rapids','Holland','Grand Haven','Spring Lake','Rockford','Ada','Lowell']},
    {id:'extended',communities:['West Olive','Macatawa','Ferrysburg','Muskegon','Allegan','Ionia']},
    {id:'by_arrangement',communities:['Kalamazoo','Lansing','Big Rapids','South Haven']},
  ],'Community examples must match the authorized A124 baseline plus A127 Extended additions exactly');
}
function assertInstructions(files) {
  for (const [name, text] of Object.entries(files)) {
    // These three local instruction files contain current instructions, not dated Decision Log history.
    const current = text.split(/^## .*Historical(?: — superseded)?/mi)[0];
    assert.ok(current.includes('/home/brandon/Home Inspections/Master Project Sources'),`${name}: canonical authority`);
    assert.ok(current.includes('What Your Inspection Includes'),`${name}: current hero secondary`);
    assert.ok(current.includes('616-308-5359'),`${name}: approved website phone`);
    assert.doesNotMatch(current,/Hero secondary CTA:\s*`View Pricing`|`View Pricing` as the homepage hero secondary|Final phone number, email|public (?:phone|contact) (?:is )?unset|`\.\.\/context\/project-sources\/[^`]+`/i,`${name}: stale current instruction`);
  }
}

// Self-contained: evaluate this function in the actual browser after document.fonts.ready.
// Canvas ink metrics avoid SVG getBBox's font line box. Halo is added in local SVG units;
// getScreenCTM includes actual CSS text offsets, text anchor, artwork scale and zoom.
function collectMapBrowserState() {
  const shown = el => {
    for (let n=el;n instanceof Element;n=n.parentElement) {
      const c=getComputedStyle(n);
      if(c.display==='none'||c.visibility==='hidden'||Number(c.opacity)===0||n.getAttribute('aria-hidden')==='true')return false;
    }
    return el.getBoundingClientRect().width>0 && el.getBoundingClientRect().height>0;
  };
  const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');
  const rectFrom = (el,left,top,right,bottom) => {
    const m=el.getScreenCTM();
    const p=[[left,top],[right,top],[right,bottom],[left,bottom]].map(([x,y])=>new DOMPoint(x,y).matrixTransform(m));
    return {left:Math.min(...p.map(p=>p.x)),top:Math.min(...p.map(p=>p.y)),right:Math.max(...p.map(p=>p.x)),bottom:Math.max(...p.map(p=>p.y))};
  };
  const figures=[...document.querySelectorAll('[data-service-area-map]')].map(figure=>({
    variant:figure.dataset.serviceAreaMap,width:figure.getBoundingClientRect().width,
    wrapperName:figure.getAttribute('aria-label')||figure.getAttribute('aria-labelledby'),
    artworks:[...figure.querySelectorAll('svg[data-map-artwork]')].map(svg=>{
      const visible=shown(svg); const svgMatrix=svg.getScreenCTM();
      const labels=[...svg.querySelectorAll('text[data-map-label]')].map(el=>{
        const c=getComputedStyle(el), visible=shown(el);
        const result={city:el.dataset.city||null,tier:el.dataset.cityTier||null,label:el.textContent,visible};
        if(!visible)return result;
        ctx.font=`${c.fontStyle} ${c.fontWeight} ${c.fontSize} ${c.fontFamily}`;
        ctx.textAlign='left';ctx.textBaseline='alphabetic';
        if('fontKerning' in ctx)ctx.fontKerning=c.fontKerning;
        const metric=ctx.measureText(el.textContent), x=el.x.baseVal[0].value,y=el.y.baseVal[0].value;
        const shift=c.textAnchor==='middle'?metric.width/2:c.textAnchor==='end'?metric.width:0;
        const halo=c.stroke==='none'?0:parseFloat(c.strokeWidth)/2;
        const m=el.getScreenCTM(),scale=Math.hypot(m.a,m.b);
        return {...result,font:c.fontFamily,fontSize:parseFloat(c.fontSize),effectiveFont:parseFloat(c.fontSize)*scale,halo,
          paint:rectFrom(el,x-shift-metric.actualBoundingBoxLeft-halo,y-metric.actualBoundingBoxAscent-halo,x-shift+metric.actualBoundingBoxRight+halo,y+metric.actualBoundingBoxDescent+halo)};
      });
      const markers=[...svg.querySelectorAll('circle[data-city]')].map(el=>{
        const c=getComputedStyle(el),m=el.getScreenCTM(),p=new DOMPoint(el.cx.baseVal.value,el.cy.baseVal.value).matrixTransform(m);
        return {city:el.dataset.city,tier:el.dataset.cityTier,visible:shown(el),cx:p.x,cy:p.y,r:(el.r.baseVal.value+(c.stroke==='none'?0:parseFloat(c.strokeWidth)/2))*Math.hypot(m.a,m.b)};
      });
      return {artwork:svg.dataset.mapArtwork,visible,scale:Math.hypot(svgMatrix.a,svgMatrix.b),labels,markers,
        title:svg.querySelector('title').textContent,description:svg.querySelector('desc').textContent,
        titleId:svg.querySelector('title').id,descriptionId:svg.querySelector('desc').id,
        labelledby:svg.getAttribute('aria-labelledby'),describedby:svg.getAttribute('aria-describedby'),
        focusable:svg.querySelectorAll('[tabindex]:not([tabindex="-1"]),a,input,button').length,
        overlaySvg:svg.outerHTML,
        overlayCssTransforms:[...svg.querySelectorAll('[data-map-overlay] path')].flatMap(shape=>{
          const changes=[];
          for(let node=shape;node&&node!==svg;node=node.parentElement){
            const transform=getComputedStyle(node).transform;
            if(transform!=='none')changes.push({tag:node.tagName,transform});
          }
          return changes;
        }),
        geometryCssTransforms:[...svg.querySelectorAll('path,circle,ellipse,line,rect,polygon,polyline')].filter(shape=>!shape.closest('[data-map-overlay]')).flatMap(shape=>{
          const changes=[];
          for(let node=shape;node&&node!==svg;node=node.parentElement){
            const transform=getComputedStyle(node).transform;
            if(transform!=='none')changes.push({tag:node.tagName,id:node.id.replace(/^.*?(?=rm-(?:hero|service-area)-map-)/,''),transform});
          }
          return changes;
        }),
        unpairedCityPoints:[...svg.querySelectorAll('g[id$="-places"] circle:not([data-city])')].filter(shown).length};
    })
  }));
  return {width:innerWidth,height:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth,
    ids:[...document.querySelectorAll('svg[data-map-artwork] [id]')].map(n=>n.id),figures};
}
const overlap = (a,b) => Math.min(a.right,b.right)>Math.max(a.left,b.left) && Math.min(a.bottom,b.bottom)>Math.max(a.top,b.top);
const markerGap = (box,p) => Math.hypot(Math.max(box.left-p.cx,0,p.cx-box.right),Math.max(box.top-p.cy,0,p.cy-box.bottom))-p.r;
function assertBrowserMaps(state) {
  assert.ok(state.figures.length,'Rendered map must exist');
  assert.equal(state.overflow,false,'Page must not overflow horizontally');
  assert.equal(new Set(state.ids).size,state.ids.length,'All artwork IDs must be unique across instances');
  const measurements=[];
  for(const figure of state.figures){
    assert.equal(figure.wrapperName,null,'Map wrapper must not duplicate SVG naming');
    assert.equal(figure.artworks.filter(a=>a.visible).length,1,'Exactly one artwork must be displayed');
    for(const a of figure.artworks){
      assert.equal(a.labelledby,a.titleId,'Accessible name must be title only');
      assert.equal(a.describedby,a.descriptionId,'Accessible description must be separate');
      assert.equal(a.focusable,0,'Informational city pins must not be focusable');
      if(!a.visible)continue;
      assert.equal(a.unpairedCityPoints,0,'Visible city points require explicit city identities');
      assertComputedTransforms(a.artwork,a.geometryCssTransforms);
      assertFerrysburgOverlay(a.overlaySvg);
      assert.deepEqual(a.overlayCssTransforms,[],'Ferrysburg overlay must not be moved by computed CSS transforms');
      for(const city of new Set([...a.markers,...a.labels.filter(x=>x.city)].map(x=>x.city))){
        const marks=a.markers.filter(m=>m.city===city), labels=a.labels.filter(l=>l.city===city);
        assert.ok(marks.length,`${a.artwork}: ${city} label needs a paired marker`);
        assert.ok(marks.every(m=>m.visible===Boolean(labels[0]?.visible)),`${a.artwork}: ${city} marker/label visibility mismatch (orphan point)`);
        if(labels.length)assert.ok(marks.every(m=>m.tier===labels[0].tier),`${city} tier mismatch`);
      }
      for(const city of ESSENTIAL){
        assert.equal(a.labels.filter(l=>l.city===city&&l.visible&&l.tier==='essential').length,1,`${a.artwork}: essential ${city} label`);
        assert.ok(a.labels.find(l=>l.city===city).effectiveFont>=14,`${a.artwork}: essential ${city} text must remain >=14 effective CSS px`);
        assert.equal(a.markers.filter(m=>m.city===city&&m.visible&&m.tier==='essential').length,city==='grand-rapids'?2:1,`${a.artwork}: essential ${city} marker/ring`);
      }
      const labels=a.labels.filter(l=>l.visible), markers=a.markers.filter(m=>m.visible);
      if(a.artwork==='hero-compact' && figure.width<365){
        const haven=labels.find(l=>l.city==='grand-haven').paint, rapids=labels.find(l=>l.city==='grand-rapids').paint;
        const distinctRows=Math.min(haven.bottom,rapids.bottom)<=Math.max(haven.top,rapids.top);
        const horizontalGap=Math.max(rapids.left-haven.right,haven.left-rapids.right);
        assert.ok(distinctRows || horizontalGap>=12,`Compact Home Grand Haven / Grand Rapids need distinct painted rows or >=12 CSS px separation, got ${horizontalGap.toFixed(2)}`);
      }
      for(let i=0;i<labels.length;i++){
        const l=labels[i];
        for(const other of labels.slice(i+1))assert.ok(!overlap(l.paint,other.paint),`${a.artwork}: painted labels collide: ${l.label} / ${other.label}`);
        for(const m of markers){
          const gap=markerGap(l.paint,m)/a.scale;
          assert.ok(gap>=-0.01,`${a.artwork}: ${l.label} halo overlaps visible ${m.city} marker (${gap.toFixed(2)} SVG units)`);
          if(a.artwork==='full-compact'&&l.city==='grand-rapids'&&m.city==='grand-rapids'){
            assert.ok(gap>=2,`Grand Rapids needs >=2 SVG units painted ring clearance, got ${gap.toFixed(2)}`);
            measurements.push({artwork:a.artwork,label:l.label,ringRadius:m.r/a.scale,clearanceSvg:gap,componentWidth:figure.width});
          }
        }
      }
    }
  }
  return measurements;
}
module.exports={ESSENTIAL,attrs,digest,geometryRecords,sourceComputedTransforms,assertComputedTransforms,assertGeometry,assertFerrysburgOverlay,assertSvgSemantics,assertHero,assertDisplayData,assertInstructions,collectMapBrowserState,assertBrowserMaps};
