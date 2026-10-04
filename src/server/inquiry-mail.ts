import "server-only";
import nodemailer from "nodemailer";
import { businessEmail, inquiryDefinitions } from "../config/inquiries";
import type { ValidInquiry } from "../lib/inquiry-validation";

export function mailConfiguration(env: Readonly<Record<string, string | undefined>> = process.env) {
  const clientId = env.GOOGLE_GMAIL_CLIENT_ID ?? "";
  const clientSecret = env.GOOGLE_GMAIL_CLIENT_SECRET ?? "";
  const refreshToken = env.GOOGLE_GMAIL_REFRESH_TOKEN ?? "";
  const from = env.GOOGLE_GMAIL_FROM ?? businessEmail;
  const to = env.RIVERMARK_FORM_TO ?? businessEmail;
  const tokenValue = (value: string) => /^[A-Za-z0-9._~+/-]{1,4096}$/.test(value);
  // Fail closed on missing credentials or different identities. Never echo configuration.
  if (!clientId.endsWith(".apps.googleusercontent.com") || ![clientId, clientSecret, refreshToken].every(tokenValue) || from !== businessEmail || to !== businessEmail) return null;
  return { clientId, clientSecret, refreshToken, from, to };
}
export function inquiryMessage(inquiry: ValidInquiry, submitted = new Date(), syntheticQa = false) {
  const definition = inquiryDefinitions[inquiry.type];
  const lines = [`RIVERMARK WEBSITE — ${definition.title.toUpperCase()}`, ""];
  for (const group of definition.groups) {
    lines.push(group.legend, "-".repeat(group.legend.length));
    for (const field of group.fields) lines.push(`${field.label}:\n${inquiry.values[field.name] || "Not provided"}\n`);
  }
  lines.push(`Submitted: ${submitted.toISOString()}`, `Form: ${inquiry.type}`, `Website source: ${definition.source}`, "", "Website inquiry only. No Spectora appointment or order was created.");
  return {
    from: { name: "Rivermark Website", address: businessEmail },
    to: businessEmail,
    replyTo: inquiry.values.email,
    envelope: { from: businessEmail, to: [businessEmail] },
    subject: syntheticQa ? "SYNTHETIC QA — RIVERMARK WEBSITE FORM TEST" : definition.subject,
    text: lines.join("\n"),
    disableFileAccess: true,
    disableUrlAccess: true,
  };
}
export async function sendInquiryMail(inquiry: ValidInquiry, syntheticQa = false): Promise<void> {
  const config = mailConfiguration();
  if (!config) throw new Error("Mail delivery unavailable");
  // Stream transport composes MIME locally. It never opens an SMTP connection.
  const transport = nodemailer.createTransport({
    streamTransport: true, buffer: true, newline: "windows",
    logger: false, debug: false, disableFileAccess: true, disableUrlAccess: true,
  });
  try {
    const info = await transport.sendMail(inquiryMessage(inquiry, new Date(), syntheticQa));
    if (!Buffer.isBuffer(info.message) || info.envelope.from !== config.from || info.envelope.to.length !== 1 || info.envelope.to[0] !== config.to) throw new Error("Mail delivery unavailable");
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST", redirect: "error", cache: "no-store", signal: AbortSignal.timeout(15000),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id: config.clientId, client_secret: config.clientSecret, refresh_token: config.refreshToken, grant_type: "refresh_token" }),
    });
    if (!tokenResponse.ok) throw new Error("Mail delivery unavailable");
    const token = await tokenResponse.json();
    if (typeof token.access_token !== "string" || !token.access_token || token.token_type?.toLowerCase() !== "bearer" || (token.scope !== undefined && token.scope.trim() !== "https://www.googleapis.com/auth/gmail.send")) throw new Error("Mail delivery unavailable");
    // Short-lived access token stays only in this call's memory; no token/message logging.
    const sent = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST", redirect: "error", cache: "no-store", signal: AbortSignal.timeout(20000),
      headers: { Authorization: `Bearer ${token.access_token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ raw: info.message.toString("base64url") }),
    });
    if (!sent.ok) throw new Error("Mail delivery unavailable");
    const accepted = await sent.json();
    if (typeof accepted.id !== "string" || !accepted.id) throw new Error("Mail delivery unavailable");
    // Message ID is neither logged nor persisted. Acceptance is not inbox verification.
  } catch {
    throw new Error("Mail delivery unavailable");
  } finally { transport.close(); }
}
