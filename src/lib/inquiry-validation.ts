import { contactTopics, inquiryDefinitions, inquiryGroupsFor, inquiryTypes, propertyHelpGroup, propertyHelpTopic, type InquiryType } from "../config/inquiries";
export type InquiryValues = Record<string, string>;
export type ValidInquiry = { type: InquiryType; values: InquiryValues };
export type InquiryResult =
  | { status: "success" }
  | { status: "validation_error"; errors: Record<string, string> }
  | { status: "rate_limited"; retryAfter: number }
  | { status: "delivery_error" };
export function isInquiryType(value: unknown): value is InquiryType {
  return typeof value === "string" && (inquiryTypes as readonly string[]).includes(value);
}
const singleLineControl = /[\u0000-\u001f\u007f]/;
const textControl = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;
export function validEmail(value: string): boolean {
  if (value.length > 254 || singleLineControl.test(value)) return false;
  const parts = value.split("@");
  if (parts.length !== 2 || parts[0].length > 64 || !parts[0] || parts[0].startsWith(".") || parts[0].endsWith(".") || parts[0].includes("..")) return false;
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(parts[0]) && /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/.test(parts[1]);
}
/** Only active fields leave component memory. Unknown fields are still rejected server-side. */
export function inquiryPayload(type: InquiryType, values: InquiryValues, website = "") {
  const groups = inquiryGroupsFor(type, values.topic ?? "General question");
  return { type, website, values: Object.fromEntries(groups.flatMap(group => group.fields).map(field => [field.name, values[field.name] ?? field.defaultValue ?? (field.required ? "" : field.options?.[0] ?? "")])) };
}
export function initialInquiryValues(type: InquiryType): InquiryValues {
  return inquiryPayload(type, {}).values;
}
export function validateInquiry(input: unknown): { inquiry?: ValidInquiry; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  if (!input || typeof input !== "object" || Array.isArray(input)) return { errors: { form: "Please complete the form and try again." } };
  const data = input as Record<string, unknown>;
  if (!isInquiryType(data.type) || !data.values || typeof data.values !== "object" || Array.isArray(data.values)) return { errors: { form: "Please complete the form and try again." } };
  if (typeof data.website !== "string" || data.website !== "" || Object.keys(data).some(key => !["type", "values", "website"].includes(key))) return { errors: { form: "We could not accept this request. Please check the form and try again." } };
  const raw = data.values as Record<string, unknown>;
  const isContact = data.type !== "new-construction-interest";
  const topic = raw.topic === undefined ? "General question" : raw.topic;
  if (isContact && (typeof topic !== "string" || !(contactTopics as readonly string[]).includes(topic))) return { errors: { topic: "Choose one of the listed options." } };
  // A caller's type cannot select property routing: only the allowed topic can.
  const routedType: InquiryType = isContact ? (topic === propertyHelpTopic ? "manual-review" : "contact") : data.type;
  const fields = inquiryDefinitions[routedType].groups.flatMap(group => group.fields);
  const allowedFields = isContact ? [...fields, ...propertyHelpGroup.fields] : fields;
  if (Object.keys(raw).some(key => !allowedFields.some(field => field.name === key))) return { errors: { form: "Please reload the form and try again." } };
  const values: InquiryValues = {};
  for (const field of fields) {
    const supplied = raw[field.name] ?? field.defaultValue ?? "";
    if (typeof supplied !== "string") { errors[field.name] = "Enter a valid value."; continue; }
    const value = supplied.trim().replace(/\r\n?/g, "\n");
    values[field.name] = value;
    if (field.required && !value) errors[field.name] = field.kind === "checkbox" ? "Select this checkbox to give permission." : "Complete this field.";
    else if (value.length > (field.maxLength ?? 300)) errors[field.name] = `Use ${field.maxLength ?? 300} characters or fewer.`;
    else if (field.kind === "checkbox" && value !== "" && value !== "yes") errors[field.name] = "Please confirm your choice.";
    else if (field.kind === "textarea" ? textControl.test(value) : singleLineControl.test(supplied)) errors[field.name] = "Remove unsupported characters.";
    else if (value && field.kind === "email" && !validEmail(value)) errors[field.name] = "Enter a valid email address.";
    else if (value && field.kind === "tel" && (!/^[0-9+().\-\s]+$/.test(value) || value.replace(/\D/g, "").length < 7 || value.replace(/\D/g, "").length > 15)) errors[field.name] = "Enter a phone number with 7–15 digits, or leave it blank.";
    else if (value && field.options && !field.options.includes(value)) errors[field.name] = "Choose one of the listed options.";
    else if (value && field.kind === "number" && (!/^\d{1,7}$/.test(value) || Number(value) < (field.min ?? 0) || Number(value) > (field.max ?? 1000000))) errors[field.name] = `Enter a whole number from ${field.min} to ${field.max}, or leave it blank.`;
  }
  if (values.preferredResponse === "Phone" && !values.phone) errors.phone = "Enter a phone number for a phone response, or choose Email.";
  // Known, inactive property-only fields are discarded, never validated or emailed.
  return Object.keys(errors).length ? { errors } : { inquiry: { type: routedType, values }, errors };
}
