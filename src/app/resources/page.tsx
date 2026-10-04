import Link from "next/link";
import { notFound } from "next/navigation";
import { EditorialPage, RelatedPages } from "@/components/EditorialPage";
import { PageStructuredData } from "@/components/PageStructuredData";
import { pageMetadata } from "@/config/search";
import { isSiteRoutePubliclyVisible, resolveSiteRoute } from "@/config/site";
import { resources, resourcesMetadata } from "@/content/resources";
import styles from "@/components/EditorialPage.module.css";

export const metadata = pageMetadata("resources", resourcesMetadata);

export default function ResourcesPage() {
  if (!isSiteRoutePubliclyVisible("resources")) notFound();
  return <>
    <PageStructuredData route="resources" />
    <EditorialPage title="Practical Home Inspection Resources" eyebrow="Grand Rapids & West Michigan" introduction="Compare inspection prices, prepare for the visit, and understand your report. Start with the question that matters to you.">
      <ul className={styles.resources}>{resources.map((resource) => <li key={resource.slug}>
        <h2><Link href={resolveSiteRoute(resource.route).href}>{resource.title}</Link></h2>
        <p>{resource.introduction}</p>
      </li>)}</ul>
      <p className={styles.notice}>These guides provide general education. They do not replace a property-specific inspection, specialist evaluation, legal advice, or an accepted inspection agreement.</p>
      <RelatedPages routes={["sampleReport", "pricing", "residentialHomeInspections", "priceAvailability"]} />
    </EditorialPage>
  </>;
}
