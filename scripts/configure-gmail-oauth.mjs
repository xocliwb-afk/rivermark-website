#!/usr/bin/env node
// Local administration only. No permanent website OAuth endpoint and no secret output.
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { createServer } from 'node:http';
import { lstat, readdir, readFile, open, rename, unlink } from 'node:fs/promises';
import { homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

export const mailbox = 'brandon@rivermarkinspections.com';
export const scope = 'https://www.googleapis.com/auth/gmail.send';
const tokenEndpoint = 'https://oauth2.googleapis.com/token';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const safeValue = value => typeof value === 'string' && /^[A-Za-z0-9._~+/-]{1,4096}$/.test(value);

export function installedClient(document) {
  const c = document?.installed;
  if (!c || !safeValue(c.client_id) || !c.client_id.endsWith('.apps.googleusercontent.com') || !safeValue(c.client_secret) || typeof c.project_id !== 'string' || !/rivermark/i.test(c.project_id)) return null;
  if (!['https://accounts.google.com/o/oauth2/auth', 'https://accounts.google.com/o/oauth2/v2/auth'].includes(c.auth_uri) || c.token_uri !== tokenEndpoint) return null;
  if (!Array.isArray(c.redirect_uris) || !c.redirect_uris.length || !c.redirect_uris.every(uri => ['http://localhost', 'http://127.0.0.1', 'http://localhost/', 'http://127.0.0.1/'].includes(uri))) return null;
  return { clientId: c.client_id, clientSecret: c.client_secret };
}

export async function discoverClient(directory = path.join(homedir(), 'Downloads')) {
  const matches = [];
  for (const filename of await readdir(directory)) {
    if (!filename.endsWith('.json')) continue;
    const file = path.join(directory, filename);
    try {
      const stat = await lstat(file);
      if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 100000) continue;
      const client = installedClient(JSON.parse(await readFile(file, 'utf8')));
      if (client) matches.push(client);
    } catch { /* Nonmatching or malformed downloads are not displayed. */ }
  }
  if (matches.length !== 1) throw new Error(matches.length ? 'Multiple matching Rivermark Desktop credentials found. Owner must identify the correct file before authorization.' : 'No unique valid Rivermark Desktop credential found in Downloads.');
  return matches[0];
}

export function authorizationRequest(client, redirectUri) {
  const state = randomBytes(32).toString('base64url');
  const verifier = randomBytes(48).toString('base64url');
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.search = new URLSearchParams({
    client_id: client.clientId, redirect_uri: redirectUri, response_type: 'code',
    scope, state, code_challenge: createHash('sha256').update(verifier).digest('base64url'),
    code_challenge_method: 'S256', access_type: 'offline', prompt: 'consent',
    include_granted_scopes: 'false', login_hint: mailbox,
  }).toString();
  return { state, verifier, url: url.toString() };
}

export async function saveCredentials(client, refreshToken, directory = root) {
  if (![client.clientId, client.clientSecret, refreshToken].every(safeValue)) throw new Error('Invalid credential response; nothing saved.');
  const target = path.join(directory, '.env.local');
  let existing = '';
  try {
    const stat = await lstat(target);
    if (!stat.isFile() || stat.isSymbolicLink()) throw new Error('Local environment must be a regular file.');
    existing = await readFile(target, 'utf8');
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
  const values = {
    GOOGLE_GMAIL_CLIENT_ID: client.clientId, GOOGLE_GMAIL_CLIENT_SECRET: client.clientSecret,
    GOOGLE_GMAIL_REFRESH_TOKEN: refreshToken, GOOGLE_GMAIL_FROM: mailbox, RIVERMARK_FORM_TO: mailbox,
  };
  const retired = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SMTP_USER', 'SMTP_PASSWORD', 'SMTP_FROM'];
  const replace = new RegExp(`^\\s*(?:export\\s+)?(?:${[...Object.keys(values), ...retired].join('|')})\\s*=`);
  const kept = existing.split(/\r?\n/).filter(line => !replace.test(line));
  // Both the target and atomic temporary filename match the snapshot/ignore exclusions.
  const temporary = path.join(directory, `.env.oauth-${randomBytes(12).toString('hex')}.local`);
  try {
    const file = await open(temporary, 'wx', 0o600);
    try { await file.writeFile([...kept, ...Object.entries(values).map(([key, value]) => `${key}=${value}`)].join('\n') + '\n'); await file.sync(); }
    finally { await file.close(); }
    await rename(temporary, target);
  } finally { await unlink(temporary).catch(() => {}); }
}

export async function startAuthorization(client, { directory = root, request = fetch, timeoutMs = 30 * 60 * 1000 } = {}) {
  let auth, redirectUri, timer, processing = false, finished = false;
  let resolveDone;
  const done = new Promise(resolve => { resolveDone = resolve; });
  function finish(ok) {
    if (finished) return;
    finished = true; clearTimeout(timer); server.close(); server.closeIdleConnections(); resolveDone(ok);
  }
  function page(response, status, message) {
    response.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer', 'Content-Security-Policy': "default-src 'none'; base-uri 'none'; frame-ancestors 'none'", 'X-Content-Type-Options': 'nosniff' });
    response.end(`<!doctype html><html lang="en"><meta charset="utf-8"><title>Rivermark Google authorization</title><h1>${message}</h1><p>You may close this tab and return to Codex. No email was sent by this setup.</p></html>`);
  }
  const server = createServer(async (req, res) => {
    if (req.method !== 'GET' || req.headers.host !== new URL(redirectUri).host) { page(res, 400, 'Invalid local request.'); return; }
    const url = new URL(req.url, redirectUri);
    if (url.pathname === '/start' && !processing) {
      res.writeHead(302, { Location: auth.url, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' }); res.end(); return;
    }
    if (url.pathname !== '/callback' || processing) { page(res, 404, 'Return to the authorization tab.'); return; }
    const state = Buffer.from(url.searchParams.get('state') ?? ''); const expected = Buffer.from(auth.state);
    if (state.length !== expected.length || !timingSafeEqual(state, expected)) { page(res, 400, 'Authorization state did not match. Nothing saved.'); return; }
    processing = true;
    let ok = false;
    try {
      const code = url.searchParams.get('code');
      const issuer = url.searchParams.get('iss');
      if (url.searchParams.has('error') || !code || (issuer && issuer !== 'https://accounts.google.com')) throw new Error('Authorization not granted.');
      const response = await request(tokenEndpoint, {
        method: 'POST', redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(20000),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ client_id: client.clientId, client_secret: client.clientSecret, code, code_verifier: auth.verifier, redirect_uri: redirectUri, grant_type: 'authorization_code' }),
      });
      if (!response.ok) throw new Error('Exchange not accepted.');
      const token = await response.json();
      if (token.scope?.trim() !== scope || token.token_type?.toLowerCase() !== 'bearer' || !safeValue(token.refresh_token)) throw new Error('Required send-only refresh authorization missing.');
      if (finished) throw new Error('Authorization expired.');
      await saveCredentials(client, token.refresh_token, directory);
      ok = true;
    } catch { /* Never expose Google response bodies, callback codes or credentials. */ }
    // Remove callback query/code from the visible address before showing the outcome.
    const completePath = `/complete-${randomBytes(12).toString('hex')}`;
    server.removeAllListeners('request');
    server.on('request', (next, response) => {
      if (next.method !== 'GET' || next.headers.host !== new URL(redirectUri).host || next.url !== completePath) { page(response, 404, 'Authorization has finished.'); return; }
      page(response, ok ? 200 : 400, ok ? 'Authorization complete — Gmail send-only access saved.' : 'Authorization not completed. Nothing saved. Return to Codex.');
      response.on('finish', () => finish(ok));
    });
    res.writeHead(303, { Location: completePath, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' }); res.end();
    // Finish even if the browser closes before following the redirect.
    clearTimeout(timer); timer = setTimeout(() => finish(ok), 10000);
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  redirectUri = `http://127.0.0.1:${server.address().port}/callback`;
  auth = authorizationRequest(client, redirectUri);
  timer = setTimeout(() => finish(false), timeoutMs);
  return { startUrl: new URL('/start', redirectUri).href, done, close: () => finish(false) };
}

async function main() {
  let client;
  try { client = await discoverClient(); }
  catch (error) { console.error(error.message.startsWith('Multiple matching') ? error.message : 'No unique valid Rivermark Desktop credential is available in Downloads. Nothing changed.'); process.exitCode = 1; return; }
  const flow = await startAuthorization(client);
  console.log('GOOGLE AUTHORIZATION REQUIRED. Choose brandon@rivermarkinspections.com and approve only Gmail send access.');
  console.log(`Local authorization entry: ${flow.startUrl}`);
  const browser = spawn('xdg-open', [flow.startUrl], { stdio: 'ignore' });
  // The owner's browser may stay open after consent; it must not keep this helper alive.
  browser.unref();
  browser.on('error', () => console.log('Open the local authorization entry above in your normal browser.'));
  process.once('SIGINT', flow.close); process.once('SIGTERM', flow.close);
  const ok = await flow.done;
  console.log(ok ? 'AUTHORIZATION COMPLETE. Server-only .env.local saved with mode 600. No message sent. Return to Codex to continue.' : 'AUTHORIZATION NOT COMPLETED. No send attempted. Return to Codex.');
  process.exitCode = ok ? 0 : 1;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(() => { console.error('Local Google authorization could not complete. No private details logged.'); process.exitCode = 1; });
}
