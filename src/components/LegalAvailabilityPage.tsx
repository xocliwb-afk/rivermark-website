import { notFound } from "next/navigation";
import { isSiteRouteAvailable } from "@/config/site";
import { legalPublication, legalCanBePublished } from "@/config/publication";
import { ApprovedDocument } from "./ApprovedDocument";
import { EditorialPage, RelatedPages } from "./EditorialPage";

export function LegalAvailabilityPage({ title, document }: Readonly<{ title: string; document: "privacy" | "website-terms" }>) {
  const route = document === "privacy" ? "privacy" : "websiteTerms";
  if (!isSiteRouteAvailable(route)) notFound();
  const approved = legalCanBePublished();
  return <EditorialPage title={title} eyebrow="Website policies" introduction="Rivermark Home Inspections">
    {approved && <p>Effective <time dateTime={legalPublication.effectiveOn!}>{legalPublication.effectiveOn}</time> · Reviewed <time dateTime={legalPublication.reviewedOn!}>{legalPublication.reviewedOn}</time></p>}
    <ApprovedDocument name={document} />
    <RelatedPages routes={["contact", "accessibility", route === "privacy" ? "websiteTerms" : "privacy"]} />
  </EditorialPage>;
}
