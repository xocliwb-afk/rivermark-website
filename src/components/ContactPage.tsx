import Link from "next/link";
import { publicContact } from "@/config/publication";
import { businessEmail } from "@/config/inquiries";
import { siteRoutes } from "@/config/routes";
import { contactContent } from "@/content/contact";
import { Container } from "./Container";
import { InquiryForm } from "./InquiryForm";
import { Section } from "./Section";
import styles from "./ContactPage.module.css";

export function ContactPage() {
  const content = contactContent;
  return <div className={styles.page}>
    <Section className={styles.hero} labelledBy="contact-page-heading" surface="canvas">
      <Container>
        <div className={styles.heroGrid} id="contact-page-hero">
          <div><p className={styles.eyebrow}>{content.hero.eyebrow}</p><h1 id="contact-page-heading">{content.hero.title}</h1></div>
          <div className={styles.heroBody}>
            <p>{content.hero.introduction}</p>
            <address className={styles.contactDetails}>
              {publicContact.phone?.approved && <a href={publicContact.phone.href}>Call {publicContact.phone.display}</a>}
              <a href={`mailto:${businessEmail}`}>{businessEmail}</a>
            </address>
          </div>
        </div>
      </Container>
    </Section>
    <Section labelledBy="contact-form-heading" surface="surface">
      <Container>
        <div className={styles.formGrid} id="contact-form">
          <span className={styles.anchor} id="manual-review" aria-hidden="true" />
          <div className={styles.formHeader}>
            <h2 id="contact-form-heading">{content.form.title}</h2>
            <p>{content.form.introduction}</p>
            <p>{content.form.pricing} <Link href={siteRoutes.priceAvailability}>See Price &amp; Availability</Link>.</p>
            <p className={styles.contextLink}>{content.form.newConstruction} <Link href={`${siteRoutes.newConstructionInspections}#express-interest`}>{content.form.newConstructionLink}</Link>.</p>
          </div>
          <div>
            <InquiryForm type="contact" />
            <aside className={styles.emergency} aria-labelledby="contact-emergency-heading">
              <h3 id="contact-emergency-heading">{content.emergency.title}</h3>
              <p>{content.emergency.description}</p>
            </aside>
          </div>
        </div>
      </Container>
    </Section>
  </div>;
}
