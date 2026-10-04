import { LegalAvailabilityPage } from "@/components/LegalAvailabilityPage";
import { pageMetadata } from "@/config/search";
import { legalCanBePublished } from "@/config/publication";

export const metadata = pageMetadata("websiteTerms", {
  title: "Website Terms | Rivermark Home Inspections",
  description: legalCanBePublished()
    ? "Website-use terms, service boundaries, and third-party platform information for Rivermark Home Inspections."
    : "Website terms working draft, service boundaries, and third-party platform information for Rivermark Home Inspections.",
});
export default function WebsiteTermsPage() { return <LegalAvailabilityPage title="Website Terms and Disclaimer" document="website-terms" />; }
