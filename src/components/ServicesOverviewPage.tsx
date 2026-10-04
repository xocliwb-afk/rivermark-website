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
import { isSiteRoutePubliclyVisible } from "@/config/site";
import { copyForWorkflow } from "@/config/workflows";
import { resolveContextualFaqs } from "@/content/faq-selection";
import {
  servicesOverviewContent,
  type ServicesPageLink,
} from "@/content/services-overview";

import styles from "./ServicesOverviewPage.module.css";

function hrefFor(link: ServicesPageLink) {
  return siteRoutes[link.route];
}

function isRouteActive(route: SiteRouteKey) {
  return (
    isSiteRoutePubliclyVisible(route) && route !== "newConstructionInspections"
  );
}

function ServicesCommonAdditions() {
  const content = servicesOverviewContent.commonAdditions;
  const activeItems = content.items.filter((item) =>
    isRouteActive(item.requiredRoute),
  );

  if (activeItems.length === 0) {
    return null;
  }

  return (
    <Section labelledBy="services-additions-heading" surface="muted">
      <Container>
        <PageSectionHeader
          eyebrow={content.eyebrow}
          headingId="services-additions-heading"
          title={content.title}
        />
        <div className={styles.conditionalGrid}>
          {activeItems.map((item) => (
            <article className={styles.conditionalItem} key={item.requiredRoute}>
              <h3>{item.title}</h3>
              <Paragraphs paragraphs={item.paragraphs} />
              <ul className={styles.priceLines}>
                {item.prices.map((price) => (
                  <li key={price}>{price}</li>
                ))}
              </ul>
              <TextLink className={styles.sectionLink} href={hrefFor(item.link)}>
                {item.link.label}
              </TextLink>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function ServicesThermalImaging() {
  const content = servicesOverviewContent.thermalImaging;

  if (!isRouteActive(content.requiredRoute)) {
    return null;
  }

  return (
    <Section labelledBy="services-thermal-heading" surface="surface">
      <Container width="reading">
        <PageSectionHeader
          eyebrow={content.eyebrow}
          headingId="services-thermal-heading"
          paragraphs={content.paragraphs}
          title={content.title}
        />
        <TextLink className={styles.sectionLink} href={hrefFor(content.link)}>
          {content.link.label}
        </TextLink>
      </Container>
    </Section>
  );
}

function ServicesFAQs() {
  const content = servicesOverviewContent.faqs;
  const items = resolveContextualFaqs("services");

  return (
    <Section labelledBy="services-faq-heading" surface="canvas">
      <Container>
        <PageSectionHeader
          headingId="services-faq-heading"
          title={content.title}
        />
        <FAQList containerId="services-faq-list" items={items} />
      </Container>
    </Section>
  );
}

export function ServicesOverviewPage() {
  const content = servicesOverviewContent;
  const newConstructionCopy = copyForWorkflow(
    content.newConstruction.workflow,
    content.newConstruction.paragraphs,
  );

  return (
    <div className={styles.page}>
      <PageHero
        eyebrow={content.hero.eyebrow}
        headingId="services-page-heading"
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
        triggerId="services-page-hero"
      />

      <Section labelledBy="services-core-heading" surface="surface">
        <Container>
          <div className={styles.coreGrid}>
            <div className={styles.coreCopy}>
              <PageSectionHeader
                eyebrow={content.coreInspection.eyebrow}
                headingId="services-core-heading"
                paragraphs={content.coreInspection.paragraphs}
                title={content.coreInspection.title}
              />
              <div className={styles.coreActions}>
                <div className={styles.supportingLinks}>
                  {content.coreInspection.supportingActions.map((action) => (
                    <TextLink href={hrefFor(action)} key={action.label}>
                      {action.label}
                    </TextLink>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.corePrice}>
              <p className={styles.panelLabel}>Flagship service pricing</p>
              <PricePair
                introductory={content.coreInspection.price.introductory}
                standard={content.coreInspection.price.standard}
              />
            </div>
          </div>
        </Container>
      </Section>

      <ServicesCommonAdditions />

      <Section labelledBy="services-situations-heading" surface="muted">
        <Container>
          <PageSectionHeader
            eyebrow={content.situations.eyebrow}
            headingId="services-situations-heading"
            title={content.situations.title}
          />
          <ServiceComparisonTable {...content.situations.table} />
          <TextLink className={styles.sectionLink} href={hrefFor(content.situations.link)}>
            {content.situations.link.label}
          </TextLink>
        </Container>
      </Section>

      <ServicesThermalImaging />

      <Section
        className={styles.newConstructionSection}
        labelledBy="services-new-construction-heading"
        surface="canvas"
      >
        <Container>
          <div className={styles.statusGrid}>
            <div>
              <p className={styles.eyebrow}>{content.newConstruction.eyebrow}</p>
              <h2 id="services-new-construction-heading">
                {content.newConstruction.title}
              </h2>
              <p className={styles.status}>{content.newConstruction.status}</p>
              <Paragraphs paragraphs={newConstructionCopy} />
              <TextLink
                className={styles.sectionLink}
                href={hrefFor(content.newConstruction.link)}
              >
                {content.newConstruction.link.label}
              </TextLink>
            </div>
            <div className={styles.stagePanel}>
              <p className={styles.panelLabel}>Planned future stages</p>
              <ul className={styles.stageList}>
                {content.newConstruction.stages.map((stage) => (
                  <li key={stage}>{stage}</li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section labelledBy="services-comparison-heading" surface="surface">
        <Container>
          <PageSectionHeader
            eyebrow={content.comparison.eyebrow}
            headingId="services-comparison-heading"
            title={content.comparison.title}
          />
          <ServiceComparisonTable {...content.comparison.table} />
          <div className={styles.comparisonClosing}>
            <Paragraphs paragraphs={content.comparison.paragraphs} />
          </div>
        </Container>
      </Section>

      <Section
        className={styles.specialistSection}
        labelledBy="services-specialist-heading"
      >
        <Container>
          <div className={styles.specialist} data-rm-surface="dark">
            <div>
              <p className={styles.inverseEyebrow}>{content.specialist.eyebrow}</p>
              <h2 id="services-specialist-heading">{content.specialist.title}</h2>
              <Paragraphs paragraphs={content.specialist.paragraphsBefore} />
            </div>
            <ul className={styles.specialistList}>
              {content.specialist.examples.map((example) => (
                <li key={example}>{example}</li>
              ))}
            </ul>
            <div className={styles.specialistClosing}>
              <Paragraphs paragraphs={content.specialist.paragraphsAfter} />
            </div>
          </div>
        </Container>
      </Section>

      <ServicesFAQs />

      <FinalPageCTA
        fallback={{
          ...content.finalConversion.fallback,
          action: {
            ...content.finalConversion.fallback.action,
            href: hrefFor(content.finalConversion.fallback.action),
          },
        }}
        headingId="services-final-heading"
        paragraphs={copyForWorkflow(
          "buyerTransaction",
          content.finalConversion.paragraphs,
        )}
        primaryAction={{
          ...content.finalConversion.primaryAction,
          href: hrefFor(content.finalConversion.primaryAction),
        }}
        secondaryAction={{
          ...content.finalConversion.secondaryAction,
          href: hrefFor(content.finalConversion.secondaryAction),
        }}
        suppressionId="services-final-conversion"
        title={content.finalConversion.title}
      />

      <StickyBookingAction
        suppressionId="services-final-conversion"
        triggerId="services-page-hero"
      />
    </div>
  );
}
