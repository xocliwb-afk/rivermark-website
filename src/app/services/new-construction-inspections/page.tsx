import Link from "next/link";
import { notFound } from "next/navigation";
import { EditorialPage, RelatedPages } from "@/components/EditorialPage";
import { FAQList } from "@/components/CorePagePatterns";
import { InquiryForm } from "@/components/InquiryForm";
import { manualReviewHref } from "@/config/inquiries";
import { PageStructuredData } from "@/components/PageStructuredData";
import { pageMetadata } from "@/config/search";
import { isSiteRoutePubliclyVisible, publicStatusLabels } from "@/config/site";
import { siteRoutes } from "@/config/routes";
import { newConstructionContent as content } from "@/content/new-construction";
import styles from "@/components/EditorialPage.module.css";

export const metadata = pageMetadata("newConstructionInspections", content.metadata);

export default function NewConstructionPage() {
  if (!isSiteRoutePubliclyVisible("newConstructionInspections")) notFound();
  return <>
    <PageStructuredData route="newConstructionInspections" />
    <EditorialPage title="New Construction Inspections" eyebrow={publicStatusLabels.notCurrentlyScheduling} parent="services" introduction="Rivermark is developing independent inspection services for pre-drywall, final new-construction, and first-year builder-warranty stages. These services are not active and cannot be booked today.">
      <div className={styles.actions}><a href="#express-interest">Express Interest</a><a href="#completed-home">Completed Home? Review the Options</a></div>
      <h2>Independent observation with a defined role</h2>
      <p>Builder quality control and independent client inspection serve different purposes. Rivermark’s planned approach is visual and noninvasive, focused on visible, safely accessible conditions within an agreed stage-specific scope.</p>
      <p>It would not replace builder supervision, municipal inspections, design professionals, engineering, code approval, or advice about contracts, warranties, and legal deadlines.</p>
      {content.stages.map((stage) => <section key={stage.id} aria-labelledby={stage.id}>
        <h2 id={stage.id}>{stage.title}</h2><p><strong>{publicStatusLabels.notCurrentlyScheduling}</strong></p>
        <p>{stage.timing}</p><h3>Planned areas of observation</h3><ul>{stage.observations.map((item) => <li key={item}>{item}</li>)}</ul><p>{stage.boundary}</p>
      </section>)}
      <h2>A defined scope for each planned stage</h2>
      <p>Each planned stage would have its own agreed scope, report, access, preparation, and pricing requirements. The aim is methodical observation, direct explanation, and honest limitations. Rivermark would not sell repairs, supervise builders, act as code authority, or promise to find every defect.</p>
      <h2>Access, timing, and builder coordination</h2>
      <p>Permission, site safety, utilities, and construction sequence determine whether a useful inspection can occur. Clients must confirm their own deadlines with the appropriate transaction or legal professionals.</p>
      <p>Rivermark would not enter an unauthorized site, direct subcontractors, delay construction, interpret the contract, force unsafe work, or promise an appointment before availability is confirmed.</p>
      <section aria-labelledby="express-interest"><h2 id="express-interest">Express Interest</h2><InquiryForm type="new-construction-interest" /></section>
      <section aria-labelledby="completed-home"><h2 id="completed-home">Is the home already completed?</h2>
        <p>A <Link href={siteRoutes.residentialHomeInspections}>Residential Home Inspection</Link> may fit a completed home after review of its address, completion status, access, utilities, and purpose. That review does not activate a construction-stage service.</p>
        <p>Use the <a href={manualReviewHref}>Help with a property or quote on Contact</a> to describe the property and the inspection you need. Submitting a request does not confirm an appointment.</p>
      </section>
      <h2>Common questions</h2><FAQList items={content.faqs} />
      <RelatedPages routes={["residentialHomeInspections", "services", "contact"]} />
    </EditorialPage>
  </>;
}
