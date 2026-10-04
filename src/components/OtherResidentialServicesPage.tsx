import { manualReviewHref } from "@/config/inquiries";
import { TextLink } from "./ActionLinks";
import { Container } from "./Container";
import {
  FAQList,
  FinalPageCTA,
  PageHero,
  PageSectionHeader,
  Paragraphs,
} from "./CorePagePatterns";
import { PricePair } from "./PricePair";
import { Section } from "./Section";
import { ServiceComparisonTable } from "./ServiceComparisonTable";
import { StickyBookingAction } from "./StickyBookingAction";
import { siteRoutes, type SiteRouteKey } from "@/config/routes";
import {
  areServiceCapabilitiesReady,
  copyForServiceReadiness,
} from "@/config/service-readiness";
import { isSiteRoutePubliclyVisible } from "@/config/site";
import {
  copyForWorkflow,
  isWorkflowReady,
} from "@/config/workflows";
import {
  otherResidentialServicesContent,
  type OtherServicesPageLink,
} from "@/content/other-residential-services";
import { resolveContextualFaqs } from "@/content/faq-selection";

import styles from "./OtherResidentialServicesPage.module.css";

function hrefFor(link: OtherServicesPageLink) {
  return siteRoutes[link.route];
}

function isRouteActive(route: SiteRouteKey) {
  return (
    isSiteRoutePubliclyVisible(route) && route !== "newConstructionInspections"
  );
}

function OtherServicesFAQs() {
  const content = otherResidentialServicesContent.faqs;
  const items = resolveContextualFaqs("other-residential-services");

  return (
    <Section labelledBy="other-services-faq-heading" surface="canvas">
      <Container>
        <PageSectionHeader
          eyebrow={content.eyebrow}
          headingId="other-services-faq-heading"
          title={content.title}
        />
        <FAQList containerId="other-services-faq-list" items={items} />
      </Container>
    </Section>
  );
}

export function OtherResidentialServicesPage() {
  const content = otherResidentialServicesContent;
  const otherServicesReady = areServiceCapabilitiesReady(
    content.operationalCapabilities,
  );
  const transactionReady = isWorkflowReady(content.finalConversion.workflow);
  const finalParagraphs =
    otherServicesReady && transactionReady
      ? content.finalConversion.paragraphs.production
      : content.finalConversion.paragraphs.development;

  return (
    <div className={styles.page}>
      <PageHero
        aside={
          <div className={styles.distinctionPanel}>
            <p className={styles.panelLabel}>The distinction matters</p>
            <dl className={styles.distinctionList}>
              {content.hero.distinctions.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        }
        eyebrow={content.hero.eyebrow}
        headingId="other-services-page-heading"
        paragraphs={copyForServiceReadiness(
          content.operationalCapabilities,
          content.hero.paragraphs,
        )}
        primaryAction={{
          ...content.hero.primaryAction,
          href: hrefFor(content.hero.primaryAction),
        }}
        secondaryAction={{
          ...content.hero.secondaryAction,
          href: hrefFor(content.hero.secondaryAction),
        }}
        title={content.hero.title}
        triggerId="other-services-page-hero"
      />

      <Section labelledBy="other-services-situations-heading" surface="muted">
        <Container>
          <PageSectionHeader headingId="other-services-situations-heading" title={content.situations.title} />
          <Paragraphs paragraphs={content.situations.paragraphs} />
          <TextLink href={siteRoutes.services}>Compare services by situation</TextLink>
        </Container>
      </Section>

      <Section labelledBy="other-services-full-heading" surface="surface">
        <Container>
          <PageSectionHeader
            eyebrow={content.fullScope.eyebrow}
            headingId="other-services-full-heading"
            title={content.fullScope.title}
          />
          <div className={styles.serviceList}>
            {content.fullScope.items.map((item) => (
              <article className={styles.serviceGroup} key={item.title}>
                <div className={styles.serviceHeading}>
                  <p className={styles.groupLabel}>Full-scope inspection</p>
                  <h3 id={"headingId" in item ? item.headingId : undefined}>{item.title}</h3>
                </div>
                <div className={styles.serviceBody}>
                  <Paragraphs paragraphs={item.paragraphsBefore} />
                  {item.list.length > 0 ? (
                    <ul className={styles.detailList}>
                      {item.list.map((listItem) => (
                        <li key={listItem}>{listItem}</li>
                      ))}
                    </ul>
                  ) : null}
                  <Paragraphs paragraphs={item.paragraphsAfter} />
                  <div className={styles.pricePanel}>
                    <PricePair
                      introductory={item.price.introductory}
                      standard={item.price.standard}
                    />
                    {item.supplementaryPrice ? (
                      <p className={styles.supplementaryPrice}>
                        {item.supplementaryPrice}
                      </p>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section labelledBy="other-services-limited-heading" surface="muted">
        <Container>
          <PageSectionHeader
            eyebrow={content.limitedConsultations.eyebrow}
            headingId="other-services-limited-heading"
            title={content.limitedConsultations.title}
          />
          <div className={styles.consultationGrid}>
            {content.limitedConsultations.items.map((item) => (
              <article className={styles.consultation} key={item.title}>
                <p className={styles.groupLabel}>Limited consultation</p>
                <div className={styles.titlePrice}>
                  <h3 id={item.headingId}>{item.title}</h3>
                  <p className={styles.singlePrice}>{item.price}</p>
                </div>
                <Paragraphs paragraphs={item.paragraphsBefore} />
                <ul className={styles.detailList}>
                  {item.items.map((listItem) => (
                    <li key={listItem}>{listItem}</li>
                  ))}
                </ul>
                <Paragraphs paragraphs={item.paragraphsAfter} />
              </article>
            ))}
          </div>
          <aside className={styles.boundaryNote}>
            <h3>{content.limitedConsultations.boundaries.title}</h3>
            {content.limitedConsultations.boundaries.conditionalParagraph.requiredRoutes.some(
              (route) => isRouteActive(route),
            ) ? (
              <p>
                {content.limitedConsultations.boundaries.conditionalParagraph.text}
              </p>
            ) : null}
            <Paragraphs
              paragraphs={copyForWorkflow(
                "buyerTransaction",
                content.limitedConsultations.boundaries.upgradeParagraphs,
              )}
            />
          </aside>
        </Container>
      </Section>

      <Section labelledBy="other-services-follow-up-heading" surface="surface">
        <Container>
          <div className={styles.followUpGrid}>
            <div>
              <PageSectionHeader
                eyebrow={content.repairFollowUp.eyebrow}
                headingId="other-services-follow-up-heading"
                paragraphs={content.repairFollowUp.paragraphsBefore}
                title={content.repairFollowUp.title}
              />
              <ul className={styles.outcomeList}>
                {content.repairFollowUp.outcomes.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ul>
              <Paragraphs paragraphs={content.repairFollowUp.paragraphsAfter} />
            </div>
            <div className={styles.metricPanel}>
              <p className={styles.panelLabel}>Follow-up pricing</p>
              <dl className={styles.metricList}>
                {content.repairFollowUp.prices.map((price) => (
                  <div key={price.label}>
                    <dt>{price.label}</dt>
                    <dd>{price.amount}</dd>
                  </div>
                ))}
              </dl>
              <p className={styles.metricClosing}>
                {content.repairFollowUp.closing}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section labelledBy="other-services-scope-heading" surface="canvas">
        <Container>
          <PageSectionHeader
            eyebrow={content.additionalScope.eyebrow}
            headingId="other-services-scope-heading"
            title={content.additionalScope.title}
          />
          <Paragraphs paragraphs={content.additionalScope.paragraphs} />
          <TextLink href={`${siteRoutes.pricing}#pricing-adjustments-heading`}>View unit, dwelling, and structure adjustments</TextLink>
        </Container>
      </Section>

      <Section labelledBy="other-services-comparison-heading" surface="muted">
        <Container>
          <PageSectionHeader
            eyebrow={content.comparison.eyebrow}
            headingId="other-services-comparison-heading"
            title={content.comparison.title}
          />
          <ServiceComparisonTable {...content.comparison.table} />
          <div className={styles.comparisonClosing}>
            <Paragraphs paragraphs={content.comparison.paragraphs} />
          </div>
        </Container>
      </Section>

      <Section labelledBy="other-services-pricing-heading" surface="surface">
        <Container>
          <PageSectionHeader
            eyebrow={content.pricingSnapshot.eyebrow}
            headingId="other-services-pricing-heading"
            title={content.pricingSnapshot.title}
          />
          <Paragraphs paragraphs={content.pricingSnapshot.paragraphs} />
          <TextLink
            className={styles.sectionLink}
            href={hrefFor(content.pricingSnapshot.link)}
          >
            {content.pricingSnapshot.link.label}
          </TextLink>
        </Container>
      </Section>

      <OtherServicesFAQs />

      <FinalPageCTA
        fallback={{
          ...content.finalConversion.fallback,
          action: {
            ...content.finalConversion.fallback.action,
            href: manualReviewHref,
          },
        }}
        headingId="other-services-final-heading"
        paragraphs={finalParagraphs}
        primaryAction={{
          ...content.finalConversion.primaryAction,
          href: hrefFor(content.finalConversion.primaryAction),
        }}
        secondaryAction={{
          ...content.finalConversion.secondaryAction,
          href: hrefFor(content.finalConversion.secondaryAction),
        }}
        suppressionId="other-services-final-conversion"
        title={content.finalConversion.title}
      />

      <StickyBookingAction
        suppressionId="other-services-final-conversion"
        triggerId="other-services-page-hero"
      />
    </div>
  );
}
