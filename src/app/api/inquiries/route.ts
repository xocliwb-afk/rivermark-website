import { createInquiryHandler } from "@/server/inquiry-handler";
import { sendInquiryMail } from "@/server/inquiry-mail";

export const runtime = "nodejs";
// Set only behind a trusted reverse proxy that appends the actual client IP.
export const POST = createInquiryHandler(sendInquiryMail, {
  trustProxy: process.env.RIVERMARK_TRUST_PROXY === "true",
});
