import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, stat, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { installedClient, discoverClient, authorizationRequest, saveCredentials, startAuthorization, scope } from '../scripts/configure-gmail-oauth.mjs';

// These deliberately fake strings are used only with local injected test responses.
const document = { installed: { project_id: 'rivermark-synthetic', client_id: 'synthetic-only.apps.googleusercontent.com', client_secret: 'synthetic-only-secret', auth_uri: 'https://accounts.google.com/o/oauth2/auth', token_uri: 'https://oauth2.googleapis.com/token', redirect_uris: ['http://localhost'] } };
const client = installedClient(document);

test('credential discovery requires a unique valid Rivermark Desktop file, never the first JSON', async()=>{
  const directory=await mkdtemp(path.join(tmpdir(),'rm-oauth-test-'));
  try {
    await writeFile(path.join(directory,'unrelated.json'),JSON.stringify({web:document.installed}));
    await writeFile(path.join(directory,'desktop.json'),JSON.stringify(document));
    assert.deepEqual(await discoverClient(directory),client);
    assert.equal(installedClient({installed:{...document.installed,token_uri:'https://other.example/token'}}),null);
    assert.equal(installedClient({installed:{...document.installed,redirect_uris:['https://other.example']}}),null);
    await writeFile(path.join(directory,'duplicate.json'),JSON.stringify(document));
    await assert.rejects(discoverClient(directory),/Multiple matching/);
  } finally {await rm(directory,{recursive:true,force:true});}
});

test('authorization uses send-only scope, random state, S256 PKCE, offline consent and owner login hint',()=>{
  const first=authorizationRequest(client,'http://127.0.0.1:54321/callback');
  const second=authorizationRequest(client,'http://127.0.0.1:54321/callback');
  assert.notEqual(first.state,second.state);assert.notEqual(first.verifier,second.verifier);
  const params=new URL(first.url).searchParams;
  assert.equal(params.get('scope'),scope);assert.equal(params.get('include_granted_scopes'),'false');
  assert.equal(params.get('access_type'),'offline');assert.equal(params.get('prompt'),'consent');
  assert.equal(params.get('code_challenge_method'),'S256');assert.equal(params.get('code_challenge'),createHash('sha256').update(first.verifier).digest('base64url'));
  assert.equal(params.get('login_hint'),'brandon@rivermarkinspections.com');
});

test('local callback rejects wrong state, exchanges with PKCE and saves only required secrets with mode 600',async()=>{
  const directory=await mkdtemp(path.join(tmpdir(),'rm-oauth-test-'));let flow;let exchanges=0;
  try {
    await writeFile(path.join(directory,'.env.local'),'UNRELATED=preserved\nSMTP_PASSWORD=synthetic-retired\n');
    flow=await startAuthorization(client,{directory,request:async(url,options)=>{
      exchanges++;assert.equal(url,'https://oauth2.googleapis.com/token');assert.equal(options.body.get('grant_type'),'authorization_code');assert.ok(options.body.get('code_verifier'));assert.equal(options.redirect,'error');
      return Response.json({access_token:'synthetic-only-access',refresh_token:'synthetic-only-refresh',token_type:'Bearer',scope});
    }});
    const redirect=await fetch(flow.startUrl,{redirect:'manual'});const authorization=new URL(redirect.headers.get('location'));const callback=new URL(authorization.searchParams.get('redirect_uri'));
    callback.search=new URLSearchParams({state:'wrong',code:'synthetic-only-code'});
    assert.equal((await fetch(callback)).status,400);assert.equal(exchanges,0);
    callback.search=new URLSearchParams({state:authorization.searchParams.get('state'),code:'synthetic-only-code'});
    const result=await fetch(callback);assert.equal(result.status,200);assert.match(await result.text(),/Authorization complete/);assert.equal(new URL(result.url).search,'');assert.equal(await flow.done,true);assert.equal(exchanges,1);
    const saved=await readFile(path.join(directory,'.env.local'),'utf8');assert.ok(saved.includes('UNRELATED=preserved'));assert.ok(saved.includes('GOOGLE_GMAIL_REFRESH_TOKEN=synthetic-only-refresh'));assert.ok(!saved.includes('SMTP_'));assert.ok(!saved.includes('synthetic-only-access'));assert.equal((await stat(path.join(directory,'.env.local'))).mode & 0o777,0o600);
  } finally {flow?.close();await rm(directory,{recursive:true,force:true});}
});

test('extra scopes or missing refresh token never save credentials; environment symlinks are refused',async()=>{
  const directory=await mkdtemp(path.join(tmpdir(),'rm-oauth-test-'));
  try {
    for(const token of [{refresh_token:'synthetic-only-refresh',scope:scope+' unexpected-scope'}, {scope}]){
      const flow=await startAuthorization(client,{directory,request:async()=>Response.json({...token,token_type:'Bearer'})});
      try {
        const start=await fetch(flow.startUrl,{redirect:'manual'});const auth=new URL(start.headers.get('location'));const callback=new URL(auth.searchParams.get('redirect_uri'));
        callback.search=new URLSearchParams({state:auth.searchParams.get('state'),code:'synthetic-only-code'});
        assert.equal((await fetch(callback)).status,400);assert.equal(await flow.done,false);await assert.rejects(stat(path.join(directory,'.env.local')),{code:'ENOENT'});
      } finally {flow.close();}
    }
    await writeFile(path.join(directory,'untouched'),'unchanged');await symlink(path.join(directory,'untouched'),path.join(directory,'.env.local'));
    await assert.rejects(saveCredentials(client,'synthetic-only-refresh',directory),/regular file/);assert.equal(await readFile(path.join(directory,'untouched'),'utf8'),'unchanged');
  } finally {await rm(directory,{recursive:true,force:true});}
});
