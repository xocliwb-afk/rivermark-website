/* eslint-disable @typescript-eslint/no-require-imports -- Node CommonJS runner intentionally loads server TypeScript outside Next. */
/* Local validation / owner-authorized Gmail API smoke-test runner. Not an HTTP endpoint. */
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
// CLI runs server modules outside Next; preserve their server-only boundary in the app.
const originalLoad = Module._load;
Module._load = function (id, ...args) { return id === 'server-only' ? {} : originalLoad.call(this, id, ...args); };
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, filename);
const command = process.argv[2];
if (command === 'test') {
  require('../tests/inquiries.test.ts');
} else if (command === 'send-qa') {
  require('@next/env').loadEnvConfig(root);
  const { sendInquiryMail, mailConfiguration } = require('../src/server/inquiry-mail.ts');
  if (!mailConfiguration()) { console.error('OWNER ACTION REQUIRED: run npm run forms:authorize for Google OAuth consent. No message sent.'); process.exitCode = 1; }
  else {
    const { validateInquiry } = require('../src/lib/inquiry-validation.ts');
    const { businessEmail } = require('../src/config/inquiries.ts');
    const { inquiry } = validateInquiry({type:'contact',website:'',values:{name:'Rivermark Website QA',email:businessEmail,preferredResponse:'Email',topic:'General question',message:'Rivermark website Gmail API delivery verification. No customer request. No real property. No appointment created.'}});
    sendInquiryMail(inquiry, true).then(() => console.log('GMAIL API TRANSPORT — SEND ACCEPTED; OWNER INBOX CONFIRMATION REQUESTED')).catch(() => { console.error('GMAIL API SEND NOT CONFIRMED. No credentials or API details logged.'); process.exitCode = 1; });
  }
} else { console.error('Usage: node scripts/inquiries.cjs test | send-qa'); process.exitCode = 1; }
