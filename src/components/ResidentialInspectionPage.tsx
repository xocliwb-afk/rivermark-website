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
import { DevelopmentMediaSlot } from "./DevelopmentMediaSlot";
import { PricePair } from "./PricePair";
import { Section } from "./Section";
import { StickyBookingAction } from "./StickyBookingAction";
import { residentialFieldMedia } from "@/config/media";
import { siteRoutes, type SiteRouteKey } from "@/config/routes";
import { isSiteRoutePubliclyVisible } from "@/config/site";
import {
  residentialHomeInspectionContent,
  type ResidentialPageLink,
} from "@/content/residential-home-inspections";
import { resolveContextualFaqs } from "@/content/faq-selection";

import styles from "./ResidentialInspectionPage.module.css";

function hrefFor(link: ResidentialPageLink) {
  return siteRoutes[link.route];
}

function isRouteActive(route: SiteRouteKey) {
  return (
    isSiteRoutePubliclyVisible(route) && route !== "newConstructionInspections"
  );
}

function OptionalResidentialServices() {
  const content = residentialHomeInspectionContent.optionalServices;
  const activeItems = content.items.filter((item) => isRouteActive(item.route));

  if (activeItems.length === 0) {
    return null;
  }

  return (
    <Section labelledBy="residential-options-heading" surface="muted">
      <Container>
        <PageSectionHeader
          eyebrow="Optional services"
          headingId="residential-options-heading"
          title={content.title}
        />
        <div className={styles.groupGrid}>
          {activeItems.map((item) => (
            <article className={styles.group} key={item.route}>
              <h3>{item.title}</h3>
              <Paragraphs paragraphs={item.paragraphs} />
              <PricePair
                introductory={item.price.introductory}
                standard={item.price.standard}
              />
              <TextLink className={styles.routeLink} href={hrefFor(item.link)}>
                {item.link.label}
              </TextLink>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function ResidentialInspectionPage() {
  const content = residentialHomeInspectionContent;
  const faqs = resolveContextualFaqs("residential");

  return (
    <div className={styles.page}>
      <PageHero
        aside={
          <div className={styles.heroPrice}>
            <PricePair
              introductory={content.hero.price.introductory}
              standard={content.hero.price.standard}
            />
            <p>{content.hero.price.scope}</p>
          </div>
        }
        eyebrow={content.hero.eyebrow}
        headingId="residential-page-heading"
        paragraphs={content.hero.paragraphs}
        primaryAction={{
          ...content.hero.primaryAction,
          href: hrefFor(content.hero.primaryAction),
        }}
        proofLine={content.hero.proofLine}
        secondaryAction={{
          ...content.hero.secondaryAction,
          href: hrefFor(content.hero.secondaryAction),
        }}
        title={content.hero.title}
        triggerId="residential-page-hero"
      />

      <Section labelledBy="residential-audience-heading" surface="surface">
        <Container>
          <PageSectionHeader
            eyebrow="Who the inspection is for"
            headingId="residential-audience-heading"
            paragraphs={content.audience.introduction}
            title={content.audience.title}
          />
          <div className={styles.groupGrid}>
            {content.audience.groups.map((group) => (
              <article className={styles.group} key={group.title}>
                <h3>{group.title}</h3>
                <Paragraphs paragraphs={group.paragraphs} />
              </article>
            ))}
          </div>
          <TextLink className={styles.routeLink} href={hrefFor(content.audience.link)}>
            {content.audience.link.label}
          </TextLink>
        </Container>
      </Section>

      <Section labelledBy="residential-scope-heading" surface="muted">
        <Container>
          <PageSectionHeader
            eyebrow="What the inspection evaluates"
            headingId="residential-scope-heading"
            paragraphs={content.scope.introduction}
            title={content.scope.title}
          />
          <div className={styles.scopeGrid}>
            {content.scope.groups.map((group, index) => (
              <article className={styles.scopeGroup} key={group.title}>
                <span aria-hidden="true" className={styles.index}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{group.title}</h3>
                <Paragraphs paragraphs={group.paragraphs} />
              </article>
            ))}
          </div>
          <p className={styles.clarification}>{content.scope.clarification}</p>
        </Container>
      </Section>

      <Section labelledBy="residential-approach-heading" surface="canvas">
        <Container>
          <div className={styles.approachLead}>
            <PageSectionHeader
              eyebrow="Practical inspection approach"
              headingId="residential-approach-heading"
              paragraphs={content.approach.introduction}
              title={content.approach.title}
            />
            <DevelopmentMediaSlot
              className={styles.fieldMedia}
              slot={residentialFieldMedia}
            />
          </div>
          <div className={styles.approachGrid}>
            {content.approach.groups.map((group) => (
              <article className={styles.approachGroup} key={group.title}>
                <h3>{group.title}</h3>
                <Paragraphs paragraphs={group.paragraphs} />
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section className={styles.limitationsSection} labelledBy="limitations-heading">
        <Container>
          <div className={styles.limitations} data-rm-surface="dark">
            <div>
              <p className={styles.inverseEyebrow}>Important limitations</p>
              <h2 id="limitations-heading">{content.limitations.title}</h2>
              <p>{content.limitations.introduction}</p>
            </div>
            <ul className={styles.limitationsList}>
              {content.limitations.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className={styles.limitationsClosing}>
              <Paragraphs paragraphs={content.limitations.paragraphs} />
            </div>
          </div>
        </Container>
      </Section>

      <Section labelledBy="attendance-heading" surface="surface">
        <Container>
          <div className={styles.attendanceGrid}>
            <div>
              <PageSectionHeader
                eyebrow="Attendance and final walkthrough"
                headingId="attendance-heading"
                paragraphs={content.attendance.paragraphs}
                title={content.attendance.title}
              />
              <TextLink className={styles.routeLink} href={hrefFor(content.attendance.guideLink)}>
                {content.attendance.guideLink.label}
              </TextLink>
            </div>
            <article className={styles.walkthrough}>
              <h3>{content.attendance.walkthrough.title}</h3>
              <p>{content.attendance.walkthrough.introduction}</p>
              <ol>
                {content.attendance.walkthrough.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
              <Paragraphs paragraphs={content.attendance.walkthrough.paragraphs} />
            </article>
          </div>
        </Container>
      </Section>

      <Section labelledBy="report-support-heading" surface="muted">
        <Container>
          <PageSectionHeader
            eyebrow="Written report and follow-up support"
            headingId="report-support-heading"
            paragraphs={content.report.paragraphs}
            title={content.report.title}
          />
          <div className={styles.reportGrid}>
            <div className={styles.reportList}>
              <h3>{content.report.listIntroduction}</h3>
              <ul>
                {content.report.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className={styles.reportSupport}>
              <Paragraphs paragraphs={content.report.support} />
              <div className={styles.reportLinks}>
                <TextLink className={styles.routeLink} href={siteRoutes.sampleReport}>View Sample Report</TextLink>
                <TextLink className={styles.routeLink} href={hrefFor(content.report.guideLink)}>
                  {content.report.guideLink.label}
                </TextLink>
              </div>
            </div>
          </div>
          <div className={styles.ownershipGuide}>
            <h3>{content.report.ownership.title}</h3>
            <Paragraphs paragraphs={content.report.ownership.paragraphs} />
          </div>
        </Container>
      </Section>

      <Section labelledBy="residential-pricing-heading" surface="surface">
        <Container>
          <div className={styles.priceGrid}>
            <div>
              <PageSectionHeader
                eyebrow="Residential inspection pricing"
                headingId="residential-pricing-heading"
                title={content.pricing.title}
              />
              <p className={styles.priceClarification}>
                {content.pricing.clarification}
              </p>
              <div className={styles.priceActions}>
                <TextLink href={hrefFor(content.pricing.supportingAction)}>
                  {content.pricing.supportingAction.label}
                </TextLink>
              </div>
            </div>
            <div className={styles.pricePanel}>
              <PricePair
                introductory={content.pricing.price.introductory}
                standard={content.pricing.price.standard}
              />
              <div className={styles.priceBody}>
                <Paragraphs paragraphs={content.pricing.paragraphs} />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <OptionalResidentialServices />

      <Section labelledBy="property-types-heading" surface="canvas">
        <Container>
          <PageSectionHeader
            eyebrow="Property types and additional scope"
            headingId="property-types-heading"
            title={content.propertyTypes.title}
          />
          <div className={styles.propertyGrid}>
            {content.propertyTypes.groups.map((group) => (
              <article className={styles.propertyGroup} key={group.title}>
                <h3>{group.title}</h3>
                <Paragraphs paragraphs={group.paragraphs} />
              </article>
            ))}
          </div>
          <TextLink
            className={styles.routeLink}
            href={hrefFor(content.propertyTypes.link)}
          >
            {content.propertyTypes.link.label}
          </TextLink>
        </Container>
      </Section>

      <Section labelledBy="residential-process-heading" surface="muted">
        <Container>
          <PageSectionHeader
            eyebrow="How the process works"
            headingId="residential-process-heading"
            title={content.process.title}
          />
          <ol className={styles.processList}>
            {content.process.steps.map((step, index) => (
              <li className={styles.processStep} key={step.title}>
                <span aria-hidden="true" className={styles.stepIndex}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <Paragraphs paragraphs={step.paragraphs} />
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section labelledBy="residential-faq-heading" surface="canvas">
        <Container>
          <PageSectionHeader
            headingId="residential-faq-heading"
            title={content.faqs.title}
          />
          <FAQList containerId="residential-faq-list" items={faqs} />
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
        headingId="residential-final-heading"
        paragraphs={content.finalConversion.paragraphs}
        primaryAction={{
          ...content.finalConversion.primaryAction,
          href: hrefFor(content.finalConversion.primaryAction),
        }}
        secondaryAction={{
          ...content.finalConversion.secondaryAction,
          href: hrefFor(content.finalConversion.secondaryAction),
        }}
        suppressionId="residential-final-conversion"
        title={content.finalConversion.title}
      />

      <StickyBookingAction
        suppressionId="residential-final-conversion"
        triggerId="residential-page-hero"
      />
    </div>
  );
}
