import { notFound } from "next/navigation";
import { isSiteRouteAvailable } from "@/config/site";
import Link from "next/link";
import { publicContact } from "@/config/publication";
import { businessEmail } from "@/config/inquiries";
import { EditorialPage, RelatedPages } from "@/components/EditorialPage";
import { PageStructuredData } from "@/components/PageStructuredData";
import { pageMetadata } from "@/config/search";
import { siteRoutes } from "@/config/routes";
import styles from "@/components/EditorialPage.module.css";

export const metadata = pageMetadata("accessibility", {
  title: "Accessibility | Rivermark Home Inspections",
  description: "Rivermark's website accessibility approach, current limitations, and information to include when reporting an accessibility problem.",
});

export default function AccessibilityPage() {
  if (!isSiteRouteAvailable("accessibility")) notFound();
  return <><PageStructuredData route="accessibility" />
    <EditorialPage title="Accessibility" eyebrow="Website access" introduction="Rivermark aims to make its information usable on ordinary phones, tablets, and computers, including for people who use a keyboard or assistive technology.">
      <h2>Our approach</h2><p>WCAG 2.2 Level AA is the website’s accessibility target. This is not a claim that every page, document, or third-party service fully conforms.</p>
      <ul><li>Logical headings, readable text, descriptive links, and meaningful image alternatives.</li><li>Keyboard navigation, a skip-to-content link, and visible focus indicators.</li><li>Labeled form fields, clear required-field guidance, and announced status messages.</li><li>Responsive layouts, readable pricing tables, and support for reduced-motion preferences.</li><li>Information conveyed in words as well as visual styling.</li></ul>
      <h2>Current limitations</h2>
      <p>The inquiry forms provide labeled controls, inline errors, a focusable error summary, and announced sending and delivery states.</p>
      <p>Some report documents and third-party interfaces may not work equally well with every assistive technology. Contact Rivermark if you encounter a barrier or need information in another format.</p>
      <h2>Third-party services</h2>
      <p>Spectora provides the quote experience embedded on Price & Availability and handles the inspection transaction, agreements, payments, portal, and reports. Its accessibility depends on the actual service and configuration.</p>
      <p>Spectora’s quote interface currently includes controls that cannot be reached using the Tab key, including Get Started. The full-page alternative uses the same interface, so it does not resolve that keyboard limitation.</p>
      <p>Use Continue in Spectora on Price & Availability for a full-page alternative to the embedded quote. Call, email, or use the Contact form if you need an alternative way to request assistance. No app download is needed to read this website.</p>
      <h2>Alternate assistance</h2>
      <p>Rivermark will make reasonable efforts to provide an alternate way to ask a question, review public pricing, request manual review, start scheduling, receive preparation information, or access an inspection-related document or report. Alternate assistance does not change scope, price, agreement, confirmation requirements, or availability.</p>
      <h2>Reporting a problem</h2>
      <p>Useful details include the page, what you were trying to do, the problem encountered, browser and device, any assistive technology used, and your preferred response method.</p>
      <div className={styles.notice}><p>Use the <Link href={siteRoutes.contact}>Contact page</Link> or email <a href={`mailto:${businessEmail}`}>{businessEmail}</a> to report a problem or request assistance. {publicContact.phone?.approved && <> You can also <a href={publicContact.phone.href}>call {publicContact.phone.display}</a>.</>} No response-time guarantee is offered.</p></div>
      <h2>Response and improvement</h2>
      <p>Barriers are reviewed based on severity, customer need, technical feasibility, third-party constraints, and available alternatives. This statement will be updated after material changes to the website, forms, Spectora integration, reports, or accessibility process.</p>
      <RelatedPages routes={["home", "privacy"]} />
    </EditorialPage>
  </>;
}
