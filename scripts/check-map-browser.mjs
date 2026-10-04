// Durable OP3 checks: run after `npm run check`, with that build served on a loopback origin.
// Defaults to 127.0.0.1:3031; use RIVERMARK_PREVIEW_ORIGIN for an isolated checkout's server.
// Requires an existing Chrome executable, a visible X11 DISPLAY and Node's native WebSocket.
// This intentionally fails (never skips) when those prerequisites are missing.
// Uses an isolated headed Chrome, viewport emulation and public local GETs only.
// Native browser zoom, real desktop window review and screenshots remain owner-review QA.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {createRequire} from 'node:module';
import {setTimeout as delay} from 'node:timers/promises';
const require=createRequire(import.meta.url);
const {collectMapBrowserState,assertBrowserMaps}=require('../tests/helpers/map-guards.cjs');
function parsePreviewOrigin(value) {
  const message='RIVERMARK_PREVIEW_ORIGIN must be a canonical HTTP origin on 127.0.0.1 or [::1], with no credentials, path, query or fragment';
  let url;
  try { url=new URL(value); } catch { assert.fail(message); }
  assert.ok(url.protocol==='http:' && ['127.0.0.1','[::1]'].includes(url.hostname)
    && !url.username && !url.password && value===url.origin,message);
  return url.origin;
}
const origin=parsePreviewOrigin(process.env.RIVERMARK_PREVIEW_ORIGIN ?? 'http://127.0.0.1:3031');
assert.ok(process.env.DISPLAY,'OP3 requires a clean HEADED browser: DISPLAY is unset');
assert.equal(typeof WebSocket,'function','OP3 requires Node with its native WebSocket');
const executable=process.env.RIVERMARK_CHROME || ['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser'].find(file=>require('node:fs').existsSync(file));
assert.ok(executable && require('node:fs').existsSync(executable),'OP3 requires an installed Chrome/Chromium; no browser is downloaded');
assert.equal((await fetch(origin,{signal:AbortSignal.timeout(10000)})).status,200,`Start this checkout's current production build on ${origin} first`);
const temp=await fs.mkdtemp(path.join(os.tmpdir(),'rivermark-map-browser-'));
const browser=spawn(executable,['--ozone-platform=x11','--remote-debugging-port=0',`--user-data-dir=${temp}`,'--no-first-run','--no-default-browser-check','--disable-background-networking','--disable-component-update','--disable-sync','--window-size=1440,1000','about:blank'],{stdio:['ignore','ignore','pipe']});
let stderr='';browser.stderr.on('data',chunk=>{stderr=(stderr+chunk).slice(-3000);});
class CDP {
  constructor(socket){this.socket=socket;this.id=0;this.pending=new Map();this.listeners=new Map();socket.addEventListener('message',event=>{
    const message=JSON.parse(event.data);
    if(message.id){const item=this.pending.get(message.id);if(!item)return;this.pending.delete(message.id);clearTimeout(item.timer);if(message.error)item.reject(Error(JSON.stringify(message.error)));else item.resolve(message.result);}
    else for(const handler of this.listeners.get(message.method)||[])handler(message.params);
  });}
  static async connect(url){const socket=new WebSocket(url);await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true});});return new CDP(socket);}
  send(method,params={}){const id=++this.id;return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{this.pending.delete(id);reject(Error(`CDP timeout: ${method}`));},15000);this.pending.set(id,{resolve,reject,timer});this.socket.send(JSON.stringify({id,method,params}));});}
  on(name,callback){this.listeners.set(name,[...(this.listeners.get(name)||[]),callback]);}
  close(){this.socket.close();}
}
let cdp,browserCdp;
const report={method:'Clean headed X11 Chrome; CSS viewport emulation; standard-library CDP; canvas actual ink metrics plus text halo and actual screen CTM; real AX tree. This runner does not claim native zoom, physical phone or human screen-reader testing.',origin,startedAt:new Date().toISOString(),cases:[],negativeChecks:[],blockedRequests:0};
try{
  let port;
  for(let i=0;i<100;i++){
    if(browser.exitCode!==null)throw Error(`Headed Chrome exited ${browser.exitCode}: ${stderr}`);
    try{port=Number((await fs.readFile(path.join(temp,'DevToolsActivePort'),'utf8')).split('\n')[0]);break;}catch{await delay(100);}
  }
  assert.ok(port,'Headed Chrome did not expose an ephemeral debugging port');
  const version=await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
  browserCdp=await CDP.connect(version.webSocketDebuggerUrl);
  report.browser=version.Browser;
  const targets=await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const target=targets.find(target=>target.type==='page');assert.ok(target,'Isolated browser page exists');
  cdp=await CDP.connect(target.webSocketDebuggerUrl);
  await cdp.send('Page.enable');await cdp.send('Runtime.enable');await cdp.send('Accessibility.enable');
  // Ordered protocol block rules avoid pausing local GET prefetches during navigation.
  // The sole application mutation endpoint lives under /api/ and is denied first.
  const blockPatterns=[
    {urlPattern:`${origin}/api/*`,block:true},
    {urlPattern:`${origin}/*`,block:false},
    ...['http','https','ws','wss'].map(scheme=>({urlPattern:`${scheme}://*:*/*`,block:true})),
  ];
  const networkRequests=new Map(), unexpectedMethods=[], unexpectedResponses=[];
  cdp.on('Network.requestWillBeSent',({requestId,request})=>{
    const url=new URL(request.url), allowed=url.origin===origin&&!url.pathname.startsWith('/api/');
    networkRequests.set(requestId,{method:request.method,path:url.pathname,origin:url.origin,allowed});
    if(request.method!=='GET')unexpectedMethods.push({method:request.method,path:url.pathname});
  });
  cdp.on('Network.loadingFailed',({requestId,canceled,errorText,blockedReason})=>{
    const request=networkRequests.get(requestId);
    if(request)Object.assign(request,{canceled:Boolean(canceled),errorText,blockedReason});
    if(blockedReason)report.blockedRequests++;
  });
  cdp.on('Network.responseReceived',({response})=>{
    const url=new URL(response.url);
    if(url.origin!==origin||url.pathname.startsWith('/api/'))unexpectedResponses.push({origin:url.origin,path:url.pathname,status:response.status});
  });
  await cdp.send('Network.enable');
  await cdp.send('Network.setBypassServiceWorker',{bypass:true});
  await cdp.send('Network.setBlockedURLs',{urlPatterns:blockPatterns});
  report.transport={method:'Ordered CDP Network block rules: deny local API endpoints, allow local static GET browsing, deny all other HTTP(S)/WS(S); actual methods audited. No Fetch interception.',blockPatterns};
  const evaluate=async expression=>{
    const result=await cdp.send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});
    if(result.exceptionDetails)throw Error(result.exceptionDetails.text+': '+(result.exceptionDetails.exception?.description||''));
    return result.result.value;
  };
  async function load(route,width,height=900){
    await cdp.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
    await cdp.send('Page.navigate',{url:origin+route});
    for(let i=0;i<100;i++){
      if(await evaluate(`location.pathname===${JSON.stringify(route)} && document.readyState==='complete' && !!document.querySelector('[data-service-area-map]')`))break;
      await delay(50);
    }
    await evaluate('document.fonts.ready.then(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))))');
    assert.equal(await evaluate("document.querySelectorAll('form').length"),0,'Read-only map runner must not enter a form page');
  }
  async function check(label){
    const state=await evaluate(`(${collectMapBrowserState.toString()})()`);
    const clearances=assertBrowserMaps(state);
    const tree=await cdp.send('Accessibility.getFullAXTree');
    const exposed=[];
    for(const figure of state.figures){
      const displayed=figure.artworks.find(a=>a.visible);
      const names=new Set(figure.artworks.map(a=>a.title));
      const maps=tree.nodes.filter(n=>!n.ignored&&n.role?.value==='image'&&names.has(n.name?.value));
      assert.equal(maps.length,1,`${label}: exactly one map image must be exposed in the actual AX tree`);
      assert.equal(maps[0].name.value,displayed.title,`${label}: AX name is title only`);
      assert.equal(maps[0].description?.value,displayed.description,`${label}: AX description is separate`);
      exposed.push({name:maps[0].name.value,description:maps[0].description.value});
    }
    const result={label,width:state.width,height:state.height,artworks:state.figures.map(f=>({variant:f.variant,componentWidth:f.width,visible:f.artworks.find(a=>a.visible).artwork})),clearances,accessibility:exposed};
    report.cases.push(result);
    return state;
  }
  for(const route of ['/','/service-area/']){
    for(const width of [320,375,390,768,1024,1039,1440]){
      await load(route,width,width<=390?844:900);
      await check(`${route} viewport ${width}`);
    }
    const thresholds=route==='/'?[365,490]:[350,390,800,960];
    await load(route,1440);
    for(const edge of thresholds){for(const width of [edge-1,edge]){
      await evaluate(`(()=>{const f=document.querySelector('[data-service-area-map]');f.style.width='${width}px';f.style.maxWidth='none';return new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));})()`);
      await check(`${route} component ${width}`);
    }}
  }
  // Deliberate failures use copied measured states in temporary scratch files only.
  await load('/service-area/',390);
  const measured=await check('measured negative-fixture baseline');
  async function rejects(name,mutate,pattern){
    const state=structuredClone(measured);mutate(state);
    const file=path.join(temp,`${name}.json`);await fs.writeFile(file,JSON.stringify(state));
    assert.throws(()=>assertBrowserMaps(JSON.parse(require('node:fs').readFileSync(file,'utf8'))),pattern);
    report.negativeChecks.push({name,result:'expected guard failure confirmed',source:'copy of actual browser measurements; scratch only'});
  }
  await rejects('colliding-label',state=>{const a=state.figures[0].artworks.find(a=>a.visible),m=a.markers.find(m=>m.city==='grand-rapids');a.labels.find(l=>l.city==='grand-rapids').paint={left:m.cx-2,right:m.cx+2,top:m.cy-2,bottom:m.cy+2};},/halo overlaps visible grand-rapids marker/);
  await rejects('both-variants-visible',state=>{state.figures[0].artworks.forEach(a=>{a.visible=true;});},/Exactly one artwork/);
  await rejects('orphan-point',state=>{state.figures[0].artworks.find(a=>a.visible).markers.push({city:'scratch-orphan',tier:'optional',visible:true,cx:0,cy:0,r:3});},/visibility mismatch \(orphan point\)/);
  await load('/',390);
  const focus=await evaluate(`(()=>{const link=document.querySelector('[data-service-area-map] figcaption a');link.focus();return {active:document.activeElement===link,name:link.textContent,href:link.getAttribute('href'),height:link.getBoundingClientRect().height};})()`);
  assert.equal(focus.active,true);assert.equal(focus.name,'View service area');assert.equal(focus.href,'/service-area/');assert.ok(focus.height>=44);
  report.captionLinkFocus=focus;
  report.transport.requests=networkRequests.size;
  report.transport.localGetRequests=[...networkRequests.values()].filter(request=>request.allowed&&request.method==='GET').length;
  report.transport.canceledRequests=[...networkRequests.values()].filter(request=>request.canceled||request.errorText==='net::ERR_ABORTED').length;
  report.transport.unexpectedMethods=unexpectedMethods;
  report.transport.unexpectedResponses=unexpectedResponses;
  assert.deepEqual(unexpectedMethods,[],'Read-only map review must make only GET requests');
  assert.deepEqual(unexpectedResponses,[],'Blocked API/external requests must never receive a response');
  for(const request of networkRequests.values())if(!request.allowed)assert.equal(request.blockedReason,'inspector','Non-local/API requests must be blocked by the browser protocol');
  report.status='PASS';report.completedAt=new Date().toISOString();
  console.log(`OP3 headed map browser checks PASS: ${report.cases.length} rendered cases, ${report.negativeChecks.length} measured negative fixtures; separate AX names/descriptions and caption link focus.`);
  console.log(`Full compact Grand Rapids minimum ring clearance: ${Math.min(...report.cases.flatMap(c=>c.clearances.map(m=>m.clearanceSvg))).toFixed(2)} SVG units (required >=2).`);
}catch(error){report.status='FAIL';report.error=error.stack;throw error;}
finally{
  if(cdp)cdp.close();
  if(browserCdp){await browserCdp.send('Browser.close').catch(()=>{});browserCdp.close();}
  // Only terminate the child owned by this runner; never other Chrome or server processes.
  for(let i=0;i<30&&browser.exitCode===null;i++)await delay(100);
  if(browser.exitCode===null)browser.kill('SIGTERM');
  await fs.rm(temp,{recursive:true,force:true,maxRetries:3,retryDelay:100});
  if(process.env.RIVERMARK_MAP_REPORT)await fs.writeFile(process.env.RIVERMARK_MAP_REPORT,JSON.stringify(report,null,2)+'\n');
}
