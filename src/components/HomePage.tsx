import Image from "next/image";

import { showIntroductoryPricing } from "@/config/publication";
import {
  PrimaryActionLink,
  SecondaryActionLink,
  TextLink,
} from "@/components/ActionLinks";
import { Container } from "@/components/Container";
import { DevelopmentMediaSlot } from "@/components/DevelopmentMediaSlot";
import { PricePair } from "@/components/PricePair";
import { Section } from "@/components/Section";
import { StickyBookingAction } from "@/components/StickyBookingAction";
import { homepageMedia } from "@/config/home";
import { siteRoutes, type SiteRouteKey } from "@/config/routes";
import { isSiteRoutePubliclyVisible } from "@/config/site";
import {
  homepageContent,
  type HomepageLink,
} from "@/content/home";
import { resolveContextualFaqs } from "@/content/faq-selection";
import { ProofPhrases } from "@/components/CorePagePatterns";
import { ServiceAreaMap } from "@/components/ServiceAreaMap";

import styles from "./HomePage.module.css";

function hrefFor(link: HomepageLink) {
  return siteRoutes[link.route];
}

function isRouteActive(route: SiteRouteKey) {
  return (
    isSiteRoutePubliclyVisible(route) && route !== "newConstructionInspections"
  );
}

type ParagraphsProps = Readonly<{
  paragraphs: readonly string[];
}>;

function Paragraphs({ paragraphs }: ParagraphsProps) {
  return paragraphs.map((paragraph, index) => (
    <p key={`${index}-${paragraph}`}>{paragraph}</p>
  ));
}

function CommonAdditions() {
  const content = homepageContent.commonAdditions;
  const activeItems = content.items.filter((item) => isRouteActive(item.route));

  if (activeItems.length === 0) {
    return null;
  }

  return (
    <Section labelledBy="common-additions-heading" surface="surface">
      <Container>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Common additions</p>
          <h2 id="common-additions-heading">{content.title}</h2>
          <p className={styles.sectionLead}>{content.introduction}</p>
        </div>
        <div className={styles.additionGrid}>
          {activeItems.map((item) => (
            <article className={styles.addition} key={item.route}>
              <p className={styles.eyebrow}>{item.contextLabel}</p>
              <h3>{item.title}</h3>
              <Paragraphs paragraphs={item.paragraphs} />
              <PricePair
                introductory={item.price.introductory}
                standard={item.price.standard}
              />
              <TextLink
                className={styles.routeLink}
                href={hrefFor(item.link)}
              >
                {item.link.label}
              </TextLink>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function SampleReport() {
  const content = homepageContent.sampleReport;

  if (!isRouteActive(content.route)) {
    return null;
  }

  const supportingLinks = content.supportingLinks.filter((link) =>
    isRouteActive(link.route),
  );

  return (
    <Section
      className={styles.sampleReport}
      labelledBy="sample-report-heading"
      surface="surface"
    >
      <Container width="reading">
        <h2 id="sample-report-heading">{content.title}</h2>
        <Paragraphs paragraphs={content.paragraphs} />
        <div className={styles.actions}>
          <PrimaryActionLink href={hrefFor(content.primaryAction)}>
            {content.primaryAction.label}
          </PrimaryActionLink>
          {supportingLinks.map((link) => (
            <TextLink href={hrefFor(link)} key={link.route}>
              {link.label}
            </TextLink>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function HomePage() {
  const content = homepageContent;
  const faqs = resolveContextualFaqs("home");
  const activeHomeownerItems = [
    ...content.pathways.homeowner.items,
    ...content.pathways.homeowner.conditionalItems
      .filter((item) => isRouteActive(item.route))
      .map((item) => item.label),
  ];

  return (
    <div className={styles.homepage}>
      <Section
        className={styles.hero}
        labelledBy="homepage-heading"
        surface="canvas"
      >
        <Container>
          <div className={styles.heroGrid} id="homepage-hero">
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>{content.hero.eyebrow}</p>
              <h1 id="homepage-heading">{content.hero.title}</h1>
              <p className={styles.heroLead}>{content.hero.lead}</p>
              <div className={`${styles.actions} ${styles.heroActions}`}>
                <PrimaryActionLink href={hrefFor(content.hero.primaryAction)}>
                  {content.hero.primaryAction.label}
                </PrimaryActionLink>
                <SecondaryActionLink
                  href={hrefFor(content.hero.secondaryAction)}
                >
                  {content.hero.secondaryAction.label}
                </SecondaryActionLink>
              </div>
              <p className={styles.proofLine}><ProofPhrases text={content.hero.proofLine} /></p>
            </div>
            <div className={styles.heroMap}>
              <ServiceAreaMap variant="hero" idPrefix="home" />
            </div>
          </div>
        </Container>
      </Section>

      <Section
        className={styles.audience}
        labelledBy="audience-routes-heading"
        surface="surface"
      >
        <Container>
          <h2 className={styles.visuallyHidden} id="audience-routes-heading">
            Inspection pathways
          </h2>
          <nav aria-label="Inspection pathways">
            <ul className={styles.audienceGrid} role="list">
              {content.audienceRoutes.map((route) => (
                <li className={styles.audienceRoute} key={route.title}>
                  <h3>{route.title}</h3>
                  <Paragraphs paragraphs={route.paragraphs} />
                  <TextLink
                    className={styles.routeLink}
                    href={hrefFor(route.link)}
                  >
                    {route.link.label}
                  </TextLink>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </Section>

      <Section labelledBy="core-inspection-heading" surface="muted">
        <Container>
          <div className={`${styles.sectionHeader} ${styles.coreHeader}`}>
            <div>
              <p className={styles.eyebrow}>Residential home inspection</p>
              <h2 id="core-inspection-heading">{content.coreInspection.title}</h2>
            </div>
            <div className={styles.coreIntro}>
              <Paragraphs paragraphs={content.coreInspection.paragraphs} />
            </div>
          </div>

          <ol className={styles.benefitList} role="list">
            {content.coreInspection.benefits.map((benefit, index) => (
              <li className={styles.benefit} key={benefit.title}>
                <span aria-hidden="true" className={styles.benefitIndex}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{benefit.title}</h3>
                <Paragraphs paragraphs={benefit.paragraphs} />
              </li>
            ))}
          </ol>

          <div className={styles.corePanels}>
            <article
              className={styles.understandingPanel}
              data-rm-surface="dark"
            >
              <h3>{content.coreInspection.understanding.title}</h3>
              <p className={styles.understandingIntro}>
                {content.coreInspection.understanding.summary}
              </p>
              <ul className={styles.understandingList} role="list">
                {content.coreInspection.understanding.items.map((item) => (
                  <li className={styles.understandingItem} key={item}>
                    {item}
                  </li>
                ))}
              </ul>
              <p className={styles.understandingClarifier}>
                {content.coreInspection.understanding.clarification}
              </p>
            </article>

            <article className={styles.pricePanel}>
              <h3>{content.coreInspection.price.title}</h3>
              <PricePair
                introductory={content.coreInspection.price.pair.introductory}
                standard={content.coreInspection.price.pair.standard}
              />
              {showIntroductoryPricing() && <p className={styles.priceClarifier}>
                {content.coreInspection.price.sameScopeClarification}
              </p>}
              {content.coreInspection.price.scope.map((line) => (
                <p className={styles.priceScope} key={line}>
                  {line}
                </p>
              ))}
              <p className={styles.propertyPrice}>
                {content.coreInspection.price.propertyPriceClarification}
              </p>
              <div className={styles.priceLinks}>
                {content.coreInspection.price.supportingLinks.map((link) => (
                  <TextLink
                    className={styles.textAction}
                    href={hrefFor(link)}
                    key={link.route}
                  >
                    {link.label}
                  </TextLink>
                ))}
              </div>
            </article>
          </div>
        </Container>
      </Section>

      <CommonAdditions />

      <Section labelledBy="process-heading" surface="surface">
        <Container>
          <div className={`${styles.sectionHeader} ${styles.processHeader}`}>
            <div>
              <p className={styles.eyebrow}>How Rivermark works</p>
              <h2 id="process-heading">{content.process.title}</h2>
            </div>
          </div>
          <ol className={styles.processList}>
            {content.process.steps.map((step) => (
              <li className={styles.processStep} key={step.number}>
                <span aria-hidden="true" className={styles.stepNumber}>
                  {step.number.padStart(2, "0")}
                </span>
                <div className={styles.stepBody}>
                  <h3>{step.title}</h3>
                  <Paragraphs paragraphs={step.paragraphs} />
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section
        className={styles.trust}
        labelledBy="trust-heading"
        surface="canvas"
      >
        <Container>
          <div className={`${styles.sectionHeader} ${styles.trustHeader}`}>
            <div>
              <p className={styles.eyebrow}>Trust and independence</p>
              <h2 id="trust-heading">{content.trust.title}</h2>
            </div>
            <p className={styles.trustLead}>{content.trust.introduction}</p>
          </div>
          <div className={styles.trustGrid}>
            {content.trust.items.map((item, index) => (
              <article
                className={`${styles.trustItem} ${
                  index === content.trust.items.length - 1
                    ? styles.trustBoundary
                    : ""
                }`}
                key={item.title}
              >
                <h3>{item.title}</h3>
                <Paragraphs paragraphs={item.paragraphs} />
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <SampleReport />

      <Section labelledBy="founder-heading" surface="canvas">
        <Container>
          <div className={styles.founderGrid}>
            <div className={styles.founderCopy}>
              <p className={styles.eyebrow}>About Rivermark</p>
              <h2 id="founder-heading">{content.founder.title}</h2>
              <div className={styles.founderBody}>
                <Paragraphs paragraphs={content.founder.paragraphs} />
              </div>
              <div className={styles.founderMeaning}>
                <h3>{content.founder.customerMeaning.title}</h3>
                <ul className={styles.meaningList} role="list">
                  {content.founder.customerMeaning.items.map((item) => (
                    <li className={styles.meaningItem} key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <TextLink
                className={styles.routeLink}
                href={hrefFor(content.founder.link)}
              >
                {content.founder.link.label}
              </TextLink>
            </div>
            <DevelopmentMediaSlot
              className={styles.founderMediaSlot}
              slot={homepageMedia.founder}
            />
          </div>
        </Container>
      </Section>

      <Section labelledBy="pathways-heading" surface="muted">
        <Container>
          <div className={`${styles.sectionHeader} ${styles.pathwayHeader}`}>
            <p className={styles.eyebrow}>Clear roles and useful routes</p>
            <h2 id="pathways-heading">{content.pathways.title}</h2>
          </div>
          <div className={styles.pathwayGrid}>
            <article className={styles.pathway}>
              <h3>{content.pathways.agent.title}</h3>
              <p className={styles.pathwayIntro}>
                {content.pathways.agent.introduction}
              </p>
              <ul className={styles.pathwayList}>
                {content.pathways.agent.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div>
                {content.pathways.agent.paragraphs.map((paragraph) => (
                  <p className={styles.pathwayMeta} key={paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
              <TextLink
                className={`${styles.routeLink} ${styles.pathwayLink}`}
                href={hrefFor(content.pathways.agent.link)}
              >
                {content.pathways.agent.link.label}
              </TextLink>
            </article>

            <article className={styles.pathway}>
              <h3>{content.pathways.homeowner.title}</h3>
              <p className={styles.pathwayIntro}>
                {content.pathways.homeowner.introduction}
              </p>
              <ul className={styles.pathwayList}>
                {activeHomeownerItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className={styles.pathwayMeta}>
                {content.pathways.homeowner.closing}
              </p>
              <TextLink
                className={`${styles.routeLink} ${styles.pathwayLink}`}
                href={hrefFor(content.pathways.homeowner.link)}
              >
                {content.pathways.homeowner.link.label}
              </TextLink>
            </article>
          </div>
        </Container>
      </Section>

      <Section
        className={styles.serviceArea}
        labelledBy="service-area-heading"
        surface="surface"
      >
        <Container>
          <div className={styles.serviceAreaPanel}>
            <div className={styles.serviceAreaCopy}>
              <p className={styles.eyebrow}>Service area</p>
              <h2 id="service-area-heading">{content.serviceArea.title}</h2>
              <Paragraphs paragraphs={content.serviceArea.paragraphs} />
            </div>
            <div className={`${styles.actions} ${styles.serviceAreaActions}`}>
              <TextLink
                href={hrefFor(content.serviceArea.link)}
              >
                {content.serviceArea.link.label}
              </TextLink>
            </div>
          </div>
        </Container>
      </Section>

      <Section labelledBy="faq-heading" surface="canvas">
        <Container>
          <div className={`${styles.sectionHeader} ${styles.faqHeader}`}>
            <p className={styles.eyebrow}>Frequently asked questions</p>
            <h2 id="faq-heading">{content.faqs.title}</h2>
          </div>
          <div className={styles.faqList} id="homepage-faq-list">
            {faqs.map((faq, index) => (
              <details
                className={styles.faqItem}
                id={faq.id}
                key={faq.id}
                open={index === 0}
              >
                <summary className={styles.faqSummary}>{faq.question}</summary>
                <div className={styles.faqAnswer}>
                  <Paragraphs paragraphs={faq.answer} />
                </div>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      <div id="homepage-final-conversion">
        <Section
          className={styles.finalConversion}
          labelledBy="final-conversion-heading"
          surface="muted"
        >
          <Container>
            <div className={styles.finalGrid}>
              <div className={styles.finalCopy}>
                <p className={styles.eyebrow}>Your next step</p>
                <h2 id="final-conversion-heading">
                  {content.finalConversion.title}
                </h2>
                <Paragraphs paragraphs={content.finalConversion.paragraphs} />
                <div className={`${styles.actions} ${styles.finalActions}`}>
                  <PrimaryActionLink
                    href={hrefFor(content.finalConversion.primaryAction)}
                  >
                    {content.finalConversion.primaryAction.label}
                  </PrimaryActionLink>
                </div>
                <p className={styles.finalFallback}>
                  {content.finalConversion.humanFallback.text}{" "}
                  <TextLink
                    href={hrefFor(content.finalConversion.humanFallback.link)}
                  >
                    {content.finalConversion.humanFallback.link.label}
                  </TextLink>
                </p>
              </div>
              <div aria-hidden="true" className={styles.finalDevice}>
                <Image
                  alt=""
                  className={styles.finalSymbol}
                  height={380}
                  sizes="(min-width: 768px) 360px, 0px"
                  src="/brand/symbol.svg"
                  unoptimized
                  width={380}
                />
              </div>
            </div>
          </Container>
        </Section>
      </div>

      <StickyBookingAction
        suppressionId="homepage-final-conversion"
        triggerId="homepage-hero"
      />
    </div>
  );
}
