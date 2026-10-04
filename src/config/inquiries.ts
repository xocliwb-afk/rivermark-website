/** Public, owner-confirmed contact details and website-owned inquiry fields. */
import { publicContact } from "./publication";
export const businessEmail = publicContact.email;
export const inquiryEndpoint = "/api/inquiries/";
export const manualReviewHref = "/contact/#manual-review";
export const inquiryTypes = ["contact", "manual-review", "new-construction-interest"] as const;
export type InquiryType = (typeof inquiryTypes)[number];
export type InquiryField = Readonly<{
  name: string;
  label: string;
  summaryLabel?: string;
  kind?: "email" | "tel" | "textarea" | "select" | "checkbox" | "number";
  required?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  autoComplete?: string;
  options?: readonly string[];
  hint?: string;
  defaultValue?: string;
}>;
export type InquiryGroup = Readonly<{ legend: string; fields: readonly InquiryField[] }>;
export type InquiryDefinition = Readonly<{
  title: string;
  subject: string;
  source: string;
  submitLabel: string;
  success: string;
  boundary: string;
  groups: readonly InquiryGroup[];
}>;
const customer: InquiryGroup = {
  legend: "Your contact information",
  fields: [
    { name: "name", label: "Name", required: true, maxLength: 100, autoComplete: "name" },
    { name: "email", label: "Email", kind: "email", required: true, maxLength: 254, autoComplete: "email" },
    { name: "phone", label: "Phone", kind: "tel", maxLength: 40, autoComplete: "tel" },
    { name: "preferredResponse", label: "Preferred response method", kind: "select", required: true, options: ["Email", "Phone", "No preference"], hint: "A phone number is needed if you prefer a phone response. Text responses are not available." },
  ],
};
export const sensitiveInformationNotice = "Do not submit card or bank information, passwords, portal credentials, government identifiers, sensitive inspection-report or claim information, or a full inspection report. File uploads are not available.";
export const contactTopics = ["General question", "Help with a property or quote", "An existing inspection or report", "Agent or other inquiry"] as const;
export type ContactTopic = (typeof contactTopics)[number];
export const propertyHelpTopic: ContactTopic = "Help with a property or quote";
const contactCustomer: InquiryGroup = {
  ...customer,
  fields: customer.fields.map(field => field.name === "preferredResponse" ? { ...field, defaultValue: "Email" } : field),
};
const topicGroup: InquiryGroup = { legend: "How can we help?", fields: [
  { name: "topic", label: "What can we help with?", kind: "select", required: true, options: contactTopics, defaultValue: "General question", hint: "Scheduling and accessibility questions are welcome here too." },
] };
export const propertyHelpGroup: InquiryGroup = { legend: "Property details — optional", fields: [
  { name: "propertyAddress", label: "Property address", maxLength: 240, autoComplete: "street-address" },
  { name: "propertyType", label: "Property type", maxLength: 120, hint: "For example: house, condominium, multi-unit, or mixed-use property." },
  { name: "area", label: "Approximate inspected size (square feet)", kind: "number", min: 1, max: 1000000, hint: "Include finished and unfinished basement area. Leave blank if unknown." },
  { name: "year", label: "Approximate year built", kind: "number", min: 1500, max: 2200, hint: "Leave blank if unknown." },
  { name: "units", label: "Number of dwelling units", kind: "number", min: 1, max: 1000, hint: "Leave blank if unknown." },
  { name: "structures", label: "Additional buildings or detached dwellings", maxLength: 800 },
  { name: "service", label: "Requested services", maxLength: 300, hint: "It is fine if you are not sure which service fits." },
  { name: "details", label: "Useful access or timing information", kind: "textarea", maxLength: 2000, hint: "Include any known deadline, access limitation or other property detail. Leave blank if unknown." },
] };
const messageGroup: InquiryGroup = { legend: "Your message", fields: [
  { name: "message", label: "Message", kind: "textarea", required: true, maxLength: 4000 },
] };
const contactGroups = [contactCustomer, topicGroup, messageGroup];
const propertyHelpGroups = [contactCustomer, topicGroup, propertyHelpGroup, messageGroup];
export const inquiryDefinitions: Readonly<Record<InquiryType, InquiryDefinition>> = {
  contact: {
    title: "Contact Request", subject: "Rivermark Website — Contact Request", source: "/contact/#contact-form", submitLabel: "Send Message",
    success: "Thanks. Your message was sent to Rivermark. Rivermark will review the information and respond.",
    boundary: "Questions are welcome. Sending a message does not create an appointment.",
    groups: contactGroups,
  },
  "manual-review": {
    title: "Property Help / Manual Review", subject: "Rivermark Website — Property Help / Manual Review", source: manualReviewHref, submitLabel: "Send Message",
    success: "Thanks. Your property question was sent to Rivermark for review. This does not confirm a quote, accepted assignment or inspection appointment.",
    boundary: "Share what you know; property details are optional. Rivermark will review the scope, price and timing before accepting an assignment.",
    groups: propertyHelpGroups,
  },
  "new-construction-interest": {
    title: "New Construction Interest", subject: "Rivermark Website — New Construction Interest", source: "/services/new-construction-inspections/#express-interest", submitLabel: "Submit Interest",
    success: "Thanks. Your interest was sent to Rivermark. New Construction inspections are not currently scheduling. This submission does not reserve an appointment, establish a price, guarantee future availability, or promise an activation date.",
    boundary: "New Construction inspections are Not Currently Scheduling. Expressing interest does not create an appointment, price, reserved slot, launch-date commitment, or guarantee of acceptance.",
    groups: [customer, { legend: "Property and timing", fields: [
      { name: "propertyAddress", label: "Property address or community", maxLength: 240, autoComplete: "street-address" },
      { name: "builder", label: "Builder or development", maxLength: 200 },
      { name: "timing", label: "Expected completion or approximate timing", maxLength: 240 },
      { name: "stage", label: "Stage of interest", kind: "select", options: ["Not Sure", "Pre-Drywall", "Final", "11-Month"] },
      { name: "underway", label: "Is construction already underway?", kind: "select", options: ["Unknown", "Yes", "No"] },
      { name: "underContract", label: "Under contract?", kind: "select", options: ["Not sure", "Yes", "No"] },
      { name: "agent", label: "Agent information", maxLength: 300, hint: "Optional. Include only information you have permission to share." },
      { name: "notes", label: "Notes", kind: "textarea", maxLength: 3000 },
      { name: "consent", label: "I give Rivermark permission to contact me about my interest and future Rivermark availability.", summaryLabel: "Contact permission", kind: "checkbox", required: true },
    ] }],
  },
};

/** Contact has one interface; the validated topic determines its internal route. */
export function inquiryGroupsFor(type: InquiryType, topic?: string): readonly InquiryGroup[] {
  if (type === "new-construction-interest") return inquiryDefinitions[type].groups;
  return topic === propertyHelpTopic ? propertyHelpGroups : contactGroups;
}
export function contactTopicFromFragment(fragment: string): ContactTopic | undefined {
  if (fragment === "#manual-review") return propertyHelpTopic;
  if (fragment === "#contact-form") return "General question";
}
