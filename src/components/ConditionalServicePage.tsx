import { notFound } from "next/navigation";
import { isSiteRouteAvailable } from "@/config/site";
import { siteRoutes } from "@/config/routes";
import { manualReviewHref } from "@/config/inquiries";
import type { ConditionalPageContent } from "@/content/conditional-pages";
import { ApprovedDocument, SampleReportDestination } from "./ApprovedDocument";
import { PrimaryActionLink, SecondaryActionLink, TextLink } from "./ActionLinks";
import { EditorialPage, RelatedPages } from "./EditorialPage";
import { SampleReportPreview } from "./SampleReportPreview";
import { PageStructuredData } from "./PageStructuredData";
import styles from "./EditorialPage.module.css";

export function ConditionalServicePage({ content }: Readonly<{ content: ConditionalPageContent }>) {
  if (!isSiteRouteAvailable(content.route)) notFound();
  const sample = content.route === "sampleReport";
  return <>
    <PageStructuredData route={content.route} />
    <EditorialPage title={content.title} eyebrow={content.eyebrow} introduction={content.introduction[0]} parent={sample ? undefined : "services"}>
      {content.introduction.slice(1).map(p => <p key={p}>{p}</p>)}
      {sample ? <SampleReportDestination /> : <div className={styles.actions}>
        <PrimaryActionLink href={siteRoutes.priceAvailability}>See Price & Availability</PrimaryActionLink>
        <SecondaryActionLink href={siteRoutes.pricing}>View Pricing</SecondaryActionLink>
      </div>}
      {sample && <SampleReportPreview />}
      <ApprovedDocument name={content.slug as "radon-testing" | "sewer-scope" | "thermal-imaging" | "sample-report"} />
      <RelatedPages routes={content.related} />
      <h2>{content.finalTitle}</h2>
      <div className={styles.actions}>
        <PrimaryActionLink href={siteRoutes.priceAvailability}>See Price & Availability</PrimaryActionLink>
        <TextLink href={siteRoutes.pricing}>View Pricing</TextLink>
        {!sample && <TextLink href={manualReviewHref}>Get Help With This Property</TextLink>}
      </div>
    </EditorialPage>
  </>;
}
