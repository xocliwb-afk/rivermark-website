import { ServiceAreaMap } from "./ServiceAreaMap";
import { serviceAreaMapDisplay } from "@/config/service-area-map";
import { publicContact } from "@/config/publication";
import { manualReviewHref } from "@/config/inquiries";
import { PrimaryActionLink, TextLink } from "./ActionLinks";
import { Container } from "./Container";
import {
  FAQList,
  FinalPageCTA,
  PageHero,
  PageSectionHeader,
  Paragraphs,
} from "./CorePagePatterns";
import { Section } from "./Section";
import { StickyBookingAction } from "./StickyBookingAction";
import {
  isGeographyReady,
} from "@/config/geography-readiness";
import { siteRoutes } from "@/config/routes";
import { isWorkflowReady, type WorkflowCopy } from "@/config/workflows";
import {
  serviceAreaContent,
  type ServiceAreaPageLink,
} from "@/content/service-area";
import { resolveContextualFaqs } from "@/content/faq-selection";

import styles from "./ServiceAreaPage.module.css";

function hrefFor(link: ServiceAreaPageLink) {
  return siteRoutes[link.route];
}

function qualificationCopy<T>(copy: WorkflowCopy<T>): T {
  return isGeographyReady("serviceArea") &&
    isWorkflowReady("buyerTransaction")
    ? copy.production
    : copy.development;
}

export function ServiceAreaPage() {
  const content = serviceAreaContent;
  const faqs = resolveContextualFaqs("service-area");

  return (
    <div className={styles.page}>
      <PageHero
        aside={
          <aside aria-label="Ask about your property" className={styles.heroPanel}>
            <h2>Have a property in mind?</h2>
            <p>Share the property&apos;s physical address so Rivermark can confirm coverage, travel and appointment fit.</p>
            <TextLink className={styles.contactLink} href={manualReviewHref}>Get Help With This Property</TextLink>
            {publicContact.phone?.approved && <a className={styles.contactLink} href={publicContact.phone.href}>Call {publicContact.phone.display}</a>}
          </aside>
        }
        eyebrow={content.hero.eyebrow}
        headingId="service-area-page-heading"
        paragraphs={qualificationCopy(content.hero.paragraphs)}
        primaryAction={{
          ...content.hero.primaryAction,
          href: hrefFor(content.hero.primaryAction),
        }}
        secondaryAction={{
          ...content.hero.secondaryAction,
          href: hrefFor(content.hero.secondaryAction),
        }}
        title={content.hero.title}
        triggerId="service-area-page-hero"
      />

      <Section labelledBy="service-area-zones-heading" surface="surface">
        <Container>
          <PageSectionHeader
            eyebrow={content.zones.eyebrow}
            headingId="service-area-zones-heading"
            paragraphs={content.zones.introduction}
            title={content.zones.title}
          />
          <div className={styles.zoneList}>
            {serviceAreaMapDisplay.zones.map(zone => (
              <article className={styles.zone} key={zone.id}>
                <h3><span aria-hidden="true" className={`${styles.swatch} ${styles[zone.id]}`} />{zone.name}</h3>
                <p className={styles.zoneTitle}>{zone.description}</p>
                <p className={styles.communityExamples}>Community examples: {zone.communities.join(", ")}.</p>
              </article>
            ))}
          </div>
          <p className={styles.availability}>{serviceAreaMapDisplay.availability}</p>
          <aside aria-labelledby="service-area-exception-heading" className={styles.pendingNote}>
            <h3 id="service-area-exception-heading">{content.mapException.title}</h3>
            <Paragraphs paragraphs={content.mapException.paragraphs} />
          </aside>
          <div className={styles.mapContainer}>
            <ServiceAreaMap variant="full" idPrefix="service-area" />
          </div>
        </Container>
      </Section>

      <Section labelledBy="service-area-address-heading" surface="muted">
        <Container>
          <div className={styles.addressGrid}>
            <PageSectionHeader
              eyebrow={content.addressCheck.eyebrow}
              headingId="service-area-address-heading"
              title={content.addressCheck.title}
            />
            <div className={styles.addressBody}>
              <Paragraphs
                paragraphs={qualificationCopy(
                  content.addressCheck.paragraphs,
                )}
              />
              <PrimaryActionLink
                className={styles.addressAction}
                href={hrefFor(content.addressCheck.primaryAction)}
              >
                {content.addressCheck.primaryAction.label}
              </PrimaryActionLink>
              <p className={styles.fallback}>
                {content.addressCheck.fallbackText}{" "}
                <TextLink href={manualReviewHref}>
                  {content.addressCheck.fallbackAction.label}
                </TextLink>
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section labelledBy="service-area-multivisit-heading" surface="muted">
        <Container width="reading">
          <PageSectionHeader
            eyebrow={content.multiVisit.eyebrow}
            headingId="service-area-multivisit-heading"
            paragraphs={content.multiVisit.paragraphs}
            title={content.multiVisit.title}
          />
        </Container>
      </Section>

      <Section labelledBy="service-area-faq-heading" surface="canvas">
        <Container>
          <PageSectionHeader
            eyebrow={content.faqs.eyebrow}
            headingId="service-area-faq-heading"
            title={content.faqs.title}
          />
          <FAQList containerId="service-area-faq-list" items={faqs} />
        </Container>
      </Section>

      <FinalPageCTA
        eyebrow={content.final.eyebrow}
        fallback={{
          text: content.final.fallback.text,
          action: {
            ...content.final.fallback.action,
            href: manualReviewHref,
          },
        }}
        headingId="service-area-final-heading"
        paragraphs={qualificationCopy(content.final.paragraphs)}
        primaryAction={{
          ...content.final.primaryAction,
          href: hrefFor(content.final.primaryAction),
        }}
        suppressionId="service-area-final-conversion"
        title={content.final.title}
      />

      <StickyBookingAction
        suppressionId="service-area-final-conversion"
        triggerId="service-area-page-hero"
      />
    </div>
  );
}
