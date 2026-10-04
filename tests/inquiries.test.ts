import test from "node:test";
import assert from "node:assert/strict";
import nodemailer from "nodemailer";
import { businessEmail, contactTopicFromFragment, contactTopics, inquiryDefinitions, propertyHelpGroup, propertyHelpTopic, type InquiryType } from "../src/config/inquiries";
import { initialInquiryValues, inquiryPayload, validateInquiry } from "../src/lib/inquiry-validation";
import { createInquiryHandler } from "../src/server/inquiry-handler";
import { inquiryMessage, mailConfiguration, sendInquiryMail } from "../src/server/inquiry-mail";

const fixtures = (type: InquiryType = "contact") => ({ type, website: "", values: {
  name: "Rivermark Website QA", email: businessEmail, phone: "", preferredResponse: "Email",
  ...(type === "contact" ? {topic: "General question", message: "Synthetic website form delivery verification. No customer request."} : type === "manual-review" ? {topic: propertyHelpTopic, propertyAddress: "SYNTHETIC TEST — NOT A REAL PROPERTY", area: "6500", units: "2", structures: "Synthetic detached structure", service: "Residential", message: "Synthetic unusual scope", details: "Synthetic access, timing, territory and additional request details"} : {propertyAddress: "SYNTHETIC TEST — NOT A REAL PROPERTY", builder: "Synthetic builder", timing: "Synthetic timing", stage: "Pre-Drywall", underway: "Yes", underContract: "Not sure", agent: "Synthetic agent information", notes: "Synthetic interest", consent: "yes"}),
} });
function request(input: unknown, headers: Record<string,string> = {}) {
  return new Request("http://localhost:3031/api/inquiries/", {method:"POST",headers:{origin:"http://localhost:3031",host:"localhost:3031","content-type":"application/json",...headers},body:JSON.stringify(input)});
}

test("all three internal inquiry routes reach only the controlled mailbox with fixed subjects and complete plain text", async () => {
  for (const type of ["contact", "manual-review", "new-construction-interest"] as const) {
    const { inquiry, errors } = validateInquiry(fixtures(type)); assert.deepEqual(errors,{}); assert.ok(inquiry);
    const mail = inquiryMessage(inquiry, new Date("2026-09-30T12:00:00Z"));
    assert.equal(mail.subject,inquiryDefinitions[type].subject); assert.equal(mail.to,businessEmail); assert.equal(mail.from.address,businessEmail); assert.equal(mail.replyTo,businessEmail); assert.deepEqual(mail.envelope.to,[businessEmail]);
    for (const [key,value] of Object.entries(fixtures(type).values)) if(value) assert.ok(mail.text.includes(value),key);
    assert.ok(mail.text.includes(type)); assert.ok(mail.text.includes("2026-09-30T12:00:00.000Z"));
    let calls=0; const handler=createInquiryHandler(async submitted=>{calls++;assert.equal(submitted.type,type);});
    const response=await handler(request(fixtures(type))); assert.equal(response.status,200);assert.deepEqual(await response.json(),{status:"success"});assert.equal(calls,1);assert.equal(response.headers.get('cache-control'),'no-store');
  }
});

test("reduced forms retain useful detail and consent in delivered content without the two removed fields", async () => {
  for (const [type, removedName, removedLabel] of [
    ["manual-review", "notes", "Other notes"],
    ["new-construction-interest", "currentStage", "Current construction stage"],
  ] as const) {
    const input = fixtures(type);
    const { inquiry, errors } = validateInquiry(input);
    assert.deepEqual(errors, {});
    assert.ok(inquiry);
    assert.equal(removedName in inquiry.values, false);
    const mail = inquiryMessage(inquiry, new Date("2026-09-30T12:00:00Z"));
    assert.equal(mail.text.includes(removedLabel), false);
    if (type === "manual-review") {
      assert.ok(mail.text.includes("Useful access or timing information"));
      assert.ok(mail.text.includes("Synthetic access, timing, territory and additional request details"));
    } else {
      assert.ok(mail.text.includes("Stage of interest:\nPre-Drywall"));
      assert.ok(mail.text.includes("Is construction already underway?:\nYes"));
      assert.ok(mail.text.includes("future Rivermark availability.:\nyes"));
    }
    let sends = 0;
    const handler = createInquiryHandler(async submitted => {
      sends++;
      assert.deepEqual(submitted.values, inquiry.values);
    });
    assert.equal((await handler(request(input))).status, 200);
    assert.equal(sends, 1);
    const stale = { ...input, values: { ...input.values, [removedName]: "Stale form field" } };
    assert.equal((await handler(request(stale))).status, 400);
    assert.equal(sends, 1);
  }
});

test("required errors avoid repeated labels and keep contact permission mandatory", () => {
  for (const type of ["contact", "manual-review", "new-construction-interest"] as const) {
    const fields = inquiryDefinitions[type].groups.flatMap(group => group.fields);
    const { errors } = validateInquiry({ type, website: "", values: {} });
    for (const field of fields.filter(field => field.required)) {
      if (field.defaultValue) { assert.equal(errors[field.name], undefined); continue; }
      assert.equal(errors[field.name], field.kind === "checkbox" ? "Select this checkbox to give permission." : "Complete this field.");
      assert.equal(errors[field.name].includes(field.label), false);
    }
  }
  const fields = inquiryDefinitions["new-construction-interest"].groups.flatMap(group => group.fields);
  assert.equal(fields.find(field => field.name === "consent")?.summaryLabel, "Contact permission");
  const input = fixtures("new-construction-interest");
  assert.ok(validateInquiry({ ...input, values: { ...input.values, consent: "" } }).errors.consent);
  assert.ok(validateInquiry({ ...input, values: { ...input.values, consent: "no" } }).errors.consent);
});

test("server rejects missing fields, invalid email, consent, invalid options, oversized fields, header injection and honeypot", async () => {
  const invalid = [
    {...fixtures(),values:{...fixtures().values,name:""}},
    {...fixtures(),values:{...fixtures().values,email:"bad@example"}},
    {...fixtures(),values:{...fixtures().values,email:"owner@example.test\r\nBcc: third@example.test"}},
    {...fixtures(),values:{...fixtures().values,name:"QA\r\nInjected: header"}},
    {...fixtures(),values:{...fixtures().values,message:"x".repeat(4001)}},
    {...fixtures(),values:{...fixtures().values,topic:"unlisted"}},
    {...fixtures(),values:{...fixtures().values,preferredResponse:"Phone",phone:""}},
    {...fixtures(),values:{...fixtures().values,to:"third@example.test"}},
    {...fixtures("new-construction-interest"),values:{...fixtures("new-construction-interest").values,consent:""}},
    {...fixtures(),website:"bot.example"},
  ];
  for (const input of invalid) { let calls=0;const handler=createInquiryHandler(async()=>{calls++;});const response=await handler(request(input));assert.equal(response.status,400);assert.equal((await response.json()).status,"validation_error");assert.equal(calls,0); }
});

test("origin, JSON content type and streaming size checks reject before mail", async () => {
  let calls=0; const handler=createInquiryHandler(async()=>{calls++;});
  assert.equal((await handler(request(fixtures(),{origin:"https://outside.example"}))).status,403);
  assert.equal((await handler(request(fixtures(),{"content-type":"text/plain"}))).status,400);
  assert.equal((await handler(request({long:"x".repeat(33000)}))).status,413);
  assert.equal(calls,0);
});

test("five-attempt per-IP limiter ignores forged headers locally and expires; trusted proxy isolates clients",async()=>{
  let now=0; const handler=createInquiryHandler(async()=>{}, {now:()=>now});
  for(let i=0;i<5;i++) assert.equal((await handler(request(fixtures(),{"x-forwarded-for":`192.0.2.${i}`}))).status,200);
  const limit=await handler(request(fixtures(),{"x-forwarded-for":"192.0.2.99"}));assert.equal(limit.status,429);assert.equal(limit.headers.get("retry-after"),"900");now=900001;assert.equal((await handler(request(fixtures()))).status,200);
  const proxied=createInquiryHandler(async()=>{}, {trustProxy:true});
  for(let i=0;i<5;i++) await proxied(request(fixtures(),{"x-forwarded-for":"192.0.2.1"}));
  assert.equal((await proxied(request(fixtures(),{"x-forwarded-for":"192.0.2.99, 192.0.2.1"}))).status,429);
  assert.equal((await proxied(request(fixtures(),{"x-forwarded-for":"192.0.2.2"}))).status,200);
});

test("concurrent and repeated submissions send once; no success before acceptance",async()=>{
  let release!:()=>void;const gate=new Promise<void>(resolve=>{release=resolve;});let sends=0;
  const handler=createInquiryHandler(async()=>{sends++;await gate;});let resolved=false;
  const first=handler(request(fixtures())).then(r=>{resolved=true;return r;});const second=handler(request(fixtures()));
  await new Promise(resolve=>setTimeout(resolve,20));assert.equal(sends,1);assert.equal(resolved,false);release();
  assert.equal((await first).status,200);assert.equal((await second).status,200);assert.equal((await handler(request(fixtures()))).status,200);assert.equal(sends,1);
});

test("delivery failure has no private details or false success and allows a legitimate retry",async()=>{
  let sends=0;const handler=createInquiryHandler(async()=>{sends++;if(sends===1)throw new Error("private API diagnostic");});
  const failure=await handler(request(fixtures()));assert.equal(failure.status,503);assert.deepEqual(await failure.json(),{status:"delivery_error"});assert.equal((await handler(request(fixtures()))).status,200);assert.equal(sends,2);
});

const fakeEnv = { GOOGLE_GMAIL_CLIENT_ID: "synthetic-only.apps.googleusercontent.com", GOOGLE_GMAIL_CLIENT_SECRET: "synthetic-only-secret", GOOGLE_GMAIL_REFRESH_TOKEN: "synthetic-only-refresh" };

test("Gmail configuration requires OAuth credentials and fixed owner identities",()=>{
  assert.equal(mailConfiguration({}),null); assert.ok(mailConfiguration(fakeEnv));
  assert.equal(mailConfiguration({...fakeEnv,GOOGLE_GMAIL_FROM:"other@example.test"}),null);
  assert.equal(mailConfiguration({...fakeEnv,RIVERMARK_FORM_TO:"other@example.test"}),null);
  assert.equal(mailConfiguration({...fakeEnv,GOOGLE_GMAIL_REFRESH_TOKEN:""}),null);
  assert.equal(mailConfiguration({...fakeEnv,GOOGLE_GMAIL_CLIENT_SECRET:"injected\nvalue"}),null);
});

test("real MIME composer plus mocked Gmail API sends all three types with no SMTP, fixed recipient, no CC/BCC and no early success",async()=>{
  const previous=Object.fromEntries(Object.keys(fakeEnv).map(key=>[key,process.env[key]]));
  const originalFetch=globalThis.fetch; const originalTransport=nodemailer.createTransport;
  Object.assign(process.env,fakeEnv); let compositions=0;
  nodemailer.createTransport=((options: Record<string,unknown>)=>{
    assert.equal(options.streamTransport,true);assert.equal(options.buffer,true);assert.equal(options.host,undefined);assert.equal(options.auth,undefined);compositions++;
    return originalTransport(options);
  }) as typeof nodemailer.createTransport;
  try {
    for(const type of ["contact","manual-review","new-construction-interest"] as const){
      const {inquiry}=validateInquiry(fixtures(type));assert.ok(inquiry);let calls=0;let release!:()=>void;
      const gate=new Promise<void>(resolve=>{release=resolve;});let completed=false;let reached!:()=>void;const atSend=new Promise<void>(resolve=>{reached=resolve;});
      globalThis.fetch=(async(url,options)=>{
        calls++;assert.equal(options?.method,"POST");assert.equal(options?.redirect,"error");assert.equal(options?.cache,"no-store");
        if(calls===1){
          assert.equal(url,"https://oauth2.googleapis.com/token");const body=new URLSearchParams(String(options?.body));assert.equal(body.get("grant_type"),"refresh_token");assert.equal(body.get("refresh_token"),fakeEnv.GOOGLE_GMAIL_REFRESH_TOKEN);
          return Response.json({access_token:"synthetic-only-access",token_type:"Bearer",scope:"https://www.googleapis.com/auth/gmail.send"});
        }
        assert.equal(calls,2);assert.equal(url,"https://gmail.googleapis.com/gmail/v1/users/me/messages/send");assert.equal(new Headers(options?.headers).get("authorization"),"Bearer synthetic-only-access");
        const payload=JSON.parse(String(options?.body));assert.deepEqual(Object.keys(payload),["raw"]);assert.match(payload.raw,/^[A-Za-z0-9_-]+$/);
        const mime=Buffer.from(payload.raw,"base64url").toString("utf8");const headers=mime.split("\r\n\r\n")[0];
        assert.ok(headers.includes(`To: ${businessEmail}`));assert.ok(headers.includes(`From: Rivermark Website <${businessEmail}>`));assert.ok(headers.includes(`Reply-To: ${businessEmail}`));assert.doesNotMatch(headers,/^(?:Cc|Bcc|Content-Disposition):/im);
        const readable=mime.replace(/=\r\n/g,"").replace(/=([0-9A-F]{2})/g,(_,hex)=>String.fromCharCode(parseInt(hex,16)));
        assert.ok(readable.includes(`Form: ${type}`));assert.ok(readable.includes("Rivermark Website QA"));
        reached();await gate;return Response.json({id:"synthetic-only-id"});
      }) as typeof fetch;
      const send=sendInquiryMail(inquiry).then(()=>{completed=true;});await Promise.race([atSend,send]);assert.equal(calls,2);assert.equal(completed,false);release();await send;assert.equal(completed,true);
    }
    assert.equal(compositions,3);
  } finally {
    globalThis.fetch=originalFetch;nodemailer.createTransport=originalTransport;
    for(const [key,value] of Object.entries(previous)){if(value===undefined)delete process.env[key];else process.env[key]=value;}
  }
});

test("mocked Gmail API/auth failures become generic delivery_error and a legitimate retry succeeds",async()=>{
  const previous=Object.fromEntries(Object.keys(fakeEnv).map(key=>[key,process.env[key]])); const originalFetch=globalThis.fetch;Object.assign(process.env,fakeEnv);
  try {
    const handler=createInquiryHandler(sendInquiryMail);let fail=true;
    globalThis.fetch=(async(url)=>String(url).includes("oauth2") ? Response.json({access_token:"synthetic-only-access",token_type:"Bearer"}) : fail ? Response.json({error:"private upstream diagnostic"},{status:503}) : Response.json({id:"synthetic-only-id"})) as typeof fetch;
    const response=await handler(request(fixtures()));assert.equal(response.status,503);assert.deepEqual(await response.json(),{status:"delivery_error"});
    fail=false;assert.equal((await handler(request(fixtures()))).status,200);
    const {inquiry}=validateInquiry(fixtures());assert.ok(inquiry);
    for(const response of [Response.json({error:"private auth diagnostic"},{status:401}),Response.json({access_token:"synthetic-only-access",token_type:"Bearer",scope:"unexpected-scope"})]){
      globalThis.fetch=async()=>response;await assert.rejects(sendInquiryMail(inquiry),{message:"Mail delivery unavailable"});
    }
    globalThis.fetch=(async(url)=>String(url).includes("oauth2") ? Response.json({access_token:"synthetic-only-access",token_type:"Bearer"}) : Response.json({})) as typeof fetch;
    await assert.rejects(sendInquiryMail(inquiry),{message:"Mail delivery unavailable"});
    delete process.env.GOOGLE_GMAIL_REFRESH_TOKEN;let called=false;globalThis.fetch=async()=>{called=true;return Response.json({});};await assert.rejects(sendInquiryMail(inquiry));assert.equal(called,false);
  } finally {globalThis.fetch=originalFetch;for(const [key,value] of Object.entries(previous)){if(value===undefined)delete process.env[key];else process.env[key]=value;}}
});


test("contact defaults are general question and email, with common required fields and no required property details", () => {
  const defaults = initialInquiryValues("contact");
  assert.equal(defaults.topic, "General question");
  assert.equal(defaults.preferredResponse, "Email");
  assert.deepEqual(Object.keys(validateInquiry({ type: "contact", website: "", values: {} }).errors).sort(), ["email", "message", "name"]);
  for (const topic of contactTopics) {
    const payload = { type: "contact", website: "", values: { name: "Synthetic QA", email: businessEmail, message: "Synthetic question", topic } };
    const checked = validateInquiry(payload);
    assert.deepEqual(checked.errors, {});
    assert.equal(checked.inquiry?.type, topic === propertyHelpTopic ? "manual-review" : "contact");
    assert.equal(checked.inquiry?.values.preferredResponse, "Email");
  }
});

test("validated topic controls internal routing regardless of tampered client routing type", async () => {
  for (const type of ["contact", "manual-review"] as const) {
    for (const topic of contactTopics) {
      const input = { ...fixtures(type), values: { ...fixtures(type).values, topic } };
      const expectedType = topic === propertyHelpTopic ? "manual-review" : "contact";
      let sends = 0;
      const handler = createInquiryHandler(async inquiry => {
        sends++;
        assert.equal(inquiry.type, expectedType);
        const mail = inquiryMessage(inquiry);
        assert.equal(mail.subject, inquiryDefinitions[expectedType].subject);
        assert.ok(mail.text.includes(`What can we help with?:\n${topic}`));
      });
      assert.equal((await handler(request(input))).status, 200);
      assert.equal(sends, 1);
    }
  }
  for (const topic of ["invalid", "", null, 12, {}, [propertyHelpTopic]]) {
    const result = validateInquiry({ ...fixtures(), values: { ...fixtures().values, topic } });
    assert.ok(result.errors.topic);
  }
});

test("inactive property values stay in component memory but are excluded from payload, validated data and email", async () => {
  const memory: Record<string, string> = { ...initialInquiryValues("contact"), ...fixtures("manual-review").values, topic: propertyHelpTopic };
  const propertyPayload = inquiryPayload("contact", memory);
  assert.equal(propertyPayload.values.propertyAddress, memory.propertyAddress);
  const generalMemory = { ...memory, topic: "General question" };
  const generalPayload = inquiryPayload("contact", generalMemory);
  for (const field of propertyHelpGroup.fields) {
    assert.equal(field.name in generalPayload.values, false);
  }
  assert.equal(inquiryPayload("contact", { ...generalMemory, topic: propertyHelpTopic }).values.propertyAddress, memory.propertyAddress);
  assert.equal(inquiryPayload("contact", { ...generalMemory, topic: propertyHelpTopic }).values.details, memory.details);
  // Even malformed inactive values are discarded, not allowed to block a general question.
  const tampered = { ...generalPayload, values: { ...generalPayload.values, propertyAddress: "SHOULD NEVER BE SENT", area: { invalid: true }, details: "SHOULD NEVER BE SENT" } };
  let delivered = 0;
  const handler = createInquiryHandler(async inquiry => {
    delivered++;
    for (const field of propertyHelpGroup.fields) assert.equal(field.name in inquiry.values, false);
    const mail = inquiryMessage(inquiry);
    assert.equal(mail.text.includes("SHOULD NEVER BE SENT"), false);
    assert.equal(mail.text.includes("Property details"), false);
  });
  assert.equal((await handler(request(tampered))).status, 200);
  assert.equal(delivered, 1);
  assert.ok(validateInquiry({ ...generalPayload, values: { ...generalPayload.values, unlisted: "not allowed" } }).errors.form);
  assert.ok(validateInquiry({ ...propertyPayload, values: { ...propertyPayload.values, area: "unknown" } }).errors.area);
});

test("response preference requires a valid phone only when Phone is chosen", () => {
  for (const topic of ["General question", propertyHelpTopic]) {
    const base = { ...fixtures(), values: { ...fixtures().values, topic } };
    for (const preferredResponse of ["Email", "No preference"]) assert.ok(validateInquiry({ ...base, values: { ...base.values, preferredResponse, phone: "" } }).inquiry);
    assert.ok(validateInquiry({ ...base, values: { ...base.values, preferredResponse: "Phone", phone: "" } }).errors.phone);
    assert.ok(validateInquiry({ ...base, values: { ...base.values, preferredResponse: "Phone", phone: "+1 202 555 0142" } }).inquiry);
    for (const phone of ["bad number", "123", "1234567890123456", "+1 202 555 0142\r\nInjected: header"]) assert.ok(validateInquiry({ ...base, values: { ...base.values, phone } }).errors.phone);
  }
});

test("legacy and general fragments identify entries into the same adaptive contact form", () => {
  assert.equal(contactTopicFromFragment("#manual-review"), propertyHelpTopic);
  assert.equal(contactTopicFromFragment("#contact-form"), "General question");
  assert.equal(contactTopicFromFragment("#contact-email"), undefined);
  assert.equal(contactTopicFromFragment("#manual-review?address=private"), undefined);
});
