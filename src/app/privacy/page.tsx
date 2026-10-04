import { LegalAvailabilityPage } from "@/components/LegalAvailabilityPage";
import { pageMetadata } from "@/config/search";
import { legalCanBePublished } from "@/config/publication";

export const metadata = pageMetadata("privacy", {
  title: "Privacy Policy | Rivermark Home Inspections",
  description: legalCanBePublished()
    ? "How Rivermark Home Inspections handles website inquiries and information shared through its website and inspection platforms."
    : "Privacy working draft and current website information handling for Rivermark Home Inspections.",
});
export default function PrivacyPage() { return <LegalAvailabilityPage title="Privacy Policy" document="privacy" />; }
