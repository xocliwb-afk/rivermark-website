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
import { PricePair } from "./PricePair";
import { PricingTable } from "./PricingTable";
import { Section } from "./Section";
import { StickyBookingAction } from "./StickyBookingAction";
import { siteRoutes, type SiteRouteKey } from "@/config/routes";
import { isSiteRoutePubliclyVisible } from "@/config/site";
import { pricingContent, type PricingPageLink } from "@/content/pricing";
import { resolveContextualFaqs } from "@/content/faq-selection";

import styles from "./PricingPage.module.css";

function hrefFor(link: PricingPageLink) {
  return siteRoutes[link.route];
}

function routesAreActive(routes: readonly SiteRouteKey[]) {
  return routes.every(
    (route) =>
      isSiteRoutePubliclyVisible(route) && route !== "newConstructionInspections",
  );
}

function ConditionalServicePricing() {
  const content = pricingContent.conditionalPricing;
  const serviceRows = content.serviceAndCombinationTable.rows
    .filter((row) => routesAreActive(row.requiredRoutes))
    .map((row) => ({ label: row.label, values: row.values }));
  const thermalActive = routesAreActive(content.thermalTable.requiredRoutes);

  if (serviceRows.length === 0 && !thermalActive) {
    return null;
  }

  return (
    <Section labelledBy="conditional-pricing-heading" surface="canvas">
      <Container>
        <PageSectionHeader
          eyebrow="Optional additions"
          headingId="conditional-pricing-heading"
          title={content.title}
        />
        <div className={styles.adjustmentStack}>
          {serviceRows.length > 0 ? (
            <PricingTable
              caption={content.serviceAndCombinationTable.caption}
              columns={content.serviceAndCombinationTable.columns}
              firstColumnLabel={
                content.serviceAndCombinationTable.firstColumnLabel
              }
              rows={serviceRows}
            />
          ) : null}
          {thermalActive ? <PricingTable {...content.thermalTable} /> : null}
        </div>
      </Container>
    </Section>
  );
}

export function PricingPage() {
  const content = pricingContent;
  const faqs = resolveContextualFaqs("pricing");

  return (
    <div className={styles.page}>
      <PageHero
        eyebrow={content.hero.eyebrow}
        headingId="pricing-page-heading"
        paragraphs={content.hero.paragraphs}
        primaryAction={{
          ...content.hero.primaryAction,
          href: hrefFor(content.hero.primaryAction),
        }}
        secondaryAction={{
          ...content.hero.secondaryAction,
          href: hrefFor(content.hero.secondaryAction),
        }}
        title={content.hero.title}
        triggerId="pricing-page-hero"
      />

      <Section labelledBy="quick-price-heading" surface="surface">
        <Container>
          <PageSectionHeader
            headingId="quick-price-heading"
            title={content.quickAnswer.title}
          />
          <div className={styles.quickGrid}>
            {[content.quickAnswer.house, content.quickAnswer.condominium].map(
              (answer) => (
                <article className={styles.quickCard} key={answer.title}>
                  <h3>{answer.title}</h3>
                  <PricePair
                    introductory={answer.introductory}
                    standard={answer.standard}
                  />
                  <p>{answer.scope}</p>
                </article>
              ),
            )}
          </div>
          <div className={styles.includedValue}>
            <h3>{content.quickAnswer.included.title}</h3>
            <ul>
              {content.quickAnswer.included.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>{content.quickAnswer.included.qualification}</p>
            <TextLink href={hrefFor(content.quickAnswer.guideLink)}>
              {content.quickAnswer.guideLink.label}
            </TextLink>
          </div>
          <PrimaryActionLink
            className={styles.quickAction}
            href={hrefFor(content.quickAnswer.action)}
          >
            {content.quickAnswer.action.label}
          </PrimaryActionLink>
        </Container>
      </Section>

      <Section labelledBy="price-calculation-heading" surface="muted">
        <Container>
          <PageSectionHeader
            eyebrow="How Rivermark calculates the price"
            headingId="price-calculation-heading"
            title={content.calculation.title}
          />
          <div className={styles.calculationGrid}>
            {content.calculation.groups.map((group, index) => (
              <article className={styles.calculationGroup} key={group.title}>
                <span aria-hidden="true" className={styles.index}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{group.title}</h3>
                <Paragraphs paragraphs={group.paragraphs} />
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section labelledBy="house-pricing-heading" surface="surface">
        <Container>
          <PageSectionHeader
            headingId="house-pricing-heading"
            paragraphs={content.housePricing.introduction}
            title={content.housePricing.title}
          />
          <div className={styles.tablePanel}>
            <PricingTable
              {...content.housePricing.table}
              testId="house"
            />
          </div>
          <div className={styles.tableNotes}>
            <Paragraphs paragraphs={content.housePricing.paragraphs} />
            <TextLink
              className={styles.routeLink}
              href={hrefFor(content.housePricing.link)}
            >
              {content.housePricing.link.label}
            </TextLink>
          </div>
        </Container>
      </Section>

      <Section labelledBy="condominium-pricing-heading" surface="canvas">
        <Container>
          <PageSectionHeader
            headingId="condominium-pricing-heading"
            paragraphs={content.condominiumPricing.introduction}
            title={content.condominiumPricing.title}
          />
          <div className={styles.tablePanel}>
            <PricingTable
              {...content.condominiumPricing.table}
              testId="condominium"
            />
          </div>
          <div className={styles.tableNotes}>
            <Paragraphs paragraphs={content.condominiumPricing.paragraphs} />
          </div>
        </Container>
      </Section>

      <ConditionalServicePricing />

      <Section labelledBy="limited-services-heading" surface="muted">
        <Container>
          <PageSectionHeader
            headingId="limited-services-heading"
            title={content.limitedServices.title}
          />
          <div className={styles.servicePriceGrid}>
            {content.limitedServices.items.map((item) => (
              <article className={styles.servicePrice} key={item.title}>
                <h3>{item.title}</h3>
                <p className={styles.standalonePrice}>{item.price}</p>
                <Paragraphs paragraphs={item.paragraphs} />
              </article>
            ))}
          </div>
          <p className={styles.clarification}>
            {content.limitedServices.clarification}
          </p>
          <TextLink
            className={styles.routeLink}
            href={hrefFor(content.limitedServices.link)}
          >
            {content.limitedServices.link.label}
          </TextLink>
        </Container>
      </Section>

      <Section labelledBy="pricing-adjustments-heading" surface="surface">
        <Container>
          <PageSectionHeader
            headingId="pricing-adjustments-heading"
            title={content.adjustments.title}
          />
          <div className={styles.adjustmentStack}>
            {content.adjustments.groups.map((group) => (
              <article className={styles.adjustmentGroup} key={group.title}>
                <h3>{group.title}</h3>
                <PricingTable {...group.table} />
                <div className={styles.tableNotes}>
                  <Paragraphs paragraphs={group.paragraphs} />
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section labelledBy="travel-heading" surface="canvas">
        <Container>
          <PageSectionHeader
            eyebrow="Travel"
            headingId="travel-heading"
            paragraphs={content.travel.introduction}
            title={content.travel.title}
          />
          <div className={styles.policyGrid}>
            {content.travel.groups.map((group) => (
              <article className={styles.policyGroup} key={group.title}>
                <h3>{group.title}</h3>
                <Paragraphs paragraphs={group.paragraphs} />
              </article>
            ))}
          </div>
          <TextLink className={styles.routeLink} href={hrefFor(content.travel.link)}>
            {content.travel.link.label}
          </TextLink>
        </Container>
      </Section>

      <Section labelledBy="other-charges-heading" surface="muted">
        <Container>
          <PageSectionHeader
            headingId="other-charges-heading"
            paragraphs={content.otherCharges.introduction}
            title={content.otherCharges.title}
          />
          <div className={styles.policyGrid}>
            {content.otherCharges.groups.map((group) => (
              <article className={styles.policyGroup} key={group.title}>
                <h3>{group.title}</h3>
                {group.items.length > 0 ? (
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                <Paragraphs paragraphs={group.paragraphs} />
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section className={styles.manualSection} labelledBy="manual-review-heading">
        <Container>
          <div className={styles.manualReview} data-rm-surface="dark">
            <div>
              <p className={styles.inverseEyebrow}>Nonstandard assignments</p>
              <h2 id="manual-review-heading">{content.manualReview.title}</h2>
              <p>{content.manualReview.introduction}</p>
            </div>
            <ul>
              {content.manualReview.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className={styles.manualClarification}>
              {content.manualReview.clarification}
            </p>
          </div>
        </Container>
      </Section>

      <Section labelledBy="pricing-faq-heading" surface="canvas">
        <Container>
          <PageSectionHeader
            headingId="pricing-faq-heading"
            title={content.faqs.title}
          />
          <FAQList containerId="pricing-faq-list" items={faqs} />
        </Container>
      </Section>

      <FinalPageCTA
        fallback={{
          ...content.finalConversion.fallback,
          action: {
            ...content.finalConversion.fallback.action,
            href: manualReviewHref,
          },
        }}
        headingId="pricing-final-heading"
        paragraphs={content.finalConversion.paragraphs}
        primaryAction={{
          ...content.finalConversion.primaryAction,
          href: hrefFor(content.finalConversion.primaryAction),
        }}
        suppressionId="pricing-final-conversion"
        title={content.finalConversion.title}
      />

      <StickyBookingAction
        suppressionId="pricing-final-conversion"
        triggerId="pricing-page-hero"
      />
    </div>
  );
}
