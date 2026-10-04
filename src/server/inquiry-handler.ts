import "server-only";
import { createHmac, randomBytes } from "node:crypto";
import { isIP } from "node:net";
import { validateInquiry, type InquiryResult, type ValidInquiry } from "../lib/inquiry-validation";

const windowMs = 15 * 60 * 1000;
const duplicateMs = 10 * 60 * 1000;
const maxBodyBytes = 32 * 1024;
type Delivery = (inquiry: ValidInquiry) => Promise<void>;

/** One process-local limiter and short-lived duplicate cache; no submission database. */
export function createInquiryHandler(deliver: Delivery, options: { now?: () => number; trustProxy?: boolean } = {}) {
  const now = options.now ?? Date.now;
  const salt = randomBytes(32);
  const rates = new Map<string, { count: number; expires: number }>();
  const duplicates = new Map<string, { expires: number; result: Promise<InquiryResult> }>();
  const hash = (value: string) => createHmac("sha256", salt).update(value).digest("hex");
  const reply = (body: InquiryResult, status: number) => Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...(body.status === "rate_limited" ? { "Retry-After": String(body.retryAfter) } : {}) },
  });
  const invalid = (message = "Please reload the form and try again.", status = 400) => reply({ status: "validation_error", errors: { form: message } }, status);
  return async function POST(request: Request): Promise<Response> {
    const origin = request.headers.get("origin");
    const expectedHost = request.headers.get("host") ?? new URL(request.url).host;
    try {
      const parsed = new URL(origin ?? "");
      const local = ["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname);
      if (parsed.host !== expectedHost || parsed.username || parsed.password || (!local && parsed.protocol !== "https:") || !["http:", "https:"].includes(parsed.protocol) || request.headers.get("sec-fetch-site") === "cross-site") return invalid("Please submit this form from the Rivermark website.", 403);
    } catch { return invalid("Please submit this form from the Rivermark website.", 403); }
    if (request.method !== "POST" || request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") return invalid();
    const current = now();
    for (const [key, entry] of rates) if (entry.expires <= current) rates.delete(key);
    for (const [key, entry] of duplicates) if (entry.expires <= current) duplicates.delete(key);
    // Only trust the rightmost proxy-appended IP when the deployment explicitly opts in.
    // Local direct requests share a bucket, so forged forwarding headers cannot bypass limits.
    const forwarded = options.trustProxy ? request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() : undefined;
    const rateKey = hash(forwarded && isIP(forwarded) ? forwarded : "direct-or-unresolved");
    const rate = rates.get(rateKey) ?? { count: 0, expires: current + windowMs };
    if (rate.count >= 5 || (!rates.has(rateKey) && rates.size >= 1000)) return reply({ status: "rate_limited", retryAfter: Math.max(1, Math.ceil((rate.expires - current) / 1000)) }, 429);
    rate.count++; rates.set(rateKey, rate);
    if (Number(request.headers.get("content-length") ?? 0) > maxBodyBytes) return invalid("This request is too long. Please shorten the fields.", 413);
    let input: unknown;
    try {
      const reader = request.body?.getReader();
      if (!reader) return invalid();
      const chunks: Uint8Array[] = []; let length = 0;
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        length += value.byteLength;
        if (length > maxBodyBytes) { await reader.cancel(); return invalid("This request is too long. Please shorten the fields.", 413); }
        chunks.push(value);
      }
      input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch { return invalid(); }
    const validated = validateInquiry(input);
    if (!validated.inquiry) return reply({ status: "validation_error", errors: validated.errors }, 400);
    const inquiry = validated.inquiry;
    const fingerprint = hash(JSON.stringify(inquiry));
    const prior = duplicates.get(fingerprint);
    if (prior) {
      const result = await prior.result;
      return reply(result, result.status === "success" ? 200 : 503);
    }
    if (duplicates.size >= 1000) return reply({ status: "rate_limited", retryAfter: 60 }, 429);
    // Reserve the fingerprint before delivery starts. A double request shares one send.
    const result = Promise.resolve().then(async (): Promise<InquiryResult> => {
      try { await deliver(inquiry); return { status: "success" }; }
      catch { duplicates.delete(fingerprint); return { status: "delivery_error" }; }
    });
    duplicates.set(fingerprint, { expires: current + duplicateMs, result });
    const outcome = await result;
    return reply(outcome, outcome.status === "success" ? 200 : 503);
  };
}
