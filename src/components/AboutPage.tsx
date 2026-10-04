import Image from "next/image";
import { professionalClaims, siteRelease } from "@/config/publication";
import {
  PrimaryActionLink,
  SecondaryActionLink,
  TextLink,
} from "./ActionLinks";
import { Container } from "./Container";
import {
  PageSectionHeader,
  Paragraphs,
} from "./CorePagePatterns";
import { Section } from "./Section";
import { StickyBookingAction } from "./StickyBookingAction";
import { isGeographyReady } from "@/config/geography-readiness";
import { siteRoutes } from "@/config/routes";
import { copyForWorkflow, isWorkflowReady } from "@/config/workflows";
import { aboutContent, type AboutPageLink } from "@/content/about";

import styles from "./AboutPage.module.css";

function hrefFor(link: AboutPageLink) {
  return siteRoutes[link.route];
}

function AboutFinalConversion() {
  const content = aboutContent.local;
  const readinessCopy = content.paragraphs;
  const paragraphs =
    isGeographyReady("serviceArea") &&
    isWorkflowReady("buyerTransaction")
      ? readinessCopy.production
      : readinessCopy.development;

  return (
    <div id="about-final-conversion">
      <Section
        className={styles.finalConversion}
        labelledBy="about-local-heading"
        surface="muted"
      >
        <Container width="reading">
          <p className={styles.eyebrow}>{content.eyebrow}</p>
          <h2 id="about-local-heading">{content.title}</h2>
          <Paragraphs paragraphs={paragraphs} />
          <div className={styles.finalActions}>
            <PrimaryActionLink href={hrefFor(content.primaryAction)}>
              {content.primaryAction.label}
            </PrimaryActionLink>
            <nav aria-label="More about Rivermark">
              <ul className={styles.finalLinks} role="list">
                {content.supportingLinks.map((link) => (
                  <li key={link.route}>
                    <TextLink href={hrefFor(link)}>{link.label}</TextLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </Container>
      </Section>
    </div>
  );
}

export function AboutPage() {
  const content = aboutContent;
  const founderNote = content.background.founderNote;
  const showFounderNote =
    founderNote.ownerWordingApproved || siteRelease.stage === "prelaunch";

  return (
    <div className={styles.page}>
      <Section
        className={styles.hero}
        labelledBy="about-page-heading"
        surface="canvas"
      >
        <Container>
          <div className={styles.heroGrid} id="about-page-hero">
            <div className={styles.heroIntro}>
              <p className={styles.eyebrow}>{content.hero.eyebrow}</p>
              <h1 id="about-page-heading">{content.hero.title}</h1>
              <p className={styles.heroSubheading}>
                {content.hero.displaySubheading}
              </p>
            </div>
            <div className={styles.heroBody}>
              <Paragraphs paragraphs={content.hero.paragraphs} />
              <div className={styles.heroActions}>
                <PrimaryActionLink href={hrefFor(content.hero.primaryAction)}>
                  {content.hero.primaryAction.label}
                </PrimaryActionLink>
                <SecondaryActionLink
                  href={hrefFor(content.hero.secondaryAction)}
                >
                  {content.hero.secondaryAction.label}
                </SecondaryActionLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section labelledBy="about-purpose-heading" surface="muted">
        <Container>
          <PageSectionHeader
            eyebrow={content.purpose.eyebrow}
            headingId="about-purpose-heading"
            title={content.purpose.title}
          />
          <div className={styles.purposeGrid}>
            <div className={styles.prose}>
              <Paragraphs paragraphs={content.purpose.introduction} />
            </div>
            <ol className={styles.priorityList}>
              {content.purpose.priorities.map((priority, index) => (
                <li key={priority}>
                  <span aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {priority}
                </li>
              ))}
            </ol>
          </div>
          <p className={styles.purposeClosing}>{content.purpose.closing}</p>
        </Container>
      </Section>

      <Section labelledBy="about-expectations-heading" surface="surface">
        <Container>
          <PageSectionHeader
            eyebrow={content.expectations.eyebrow}
            headingId="about-expectations-heading"
            title={content.expectations.title}
          />
          <div className={styles.expectationGrid}>
            {content.expectations.items.map((item) => {
              const paragraphs =
                "workflow" in item
                  ? copyForWorkflow<readonly string[]>(
                      item.workflow,
                      item.paragraphs,
                    )
                  : item.paragraphs;

              return (
                <article className={styles.expectation} key={item.title}>
                  <h3>{item.title}</h3>
                  <Paragraphs paragraphs={paragraphs} />
                </article>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section labelledBy="about-background-heading" surface="canvas">
        <Container>
          <div className={styles.backgroundGrid}>
            <div>
            <PageSectionHeader
              eyebrow={content.background.eyebrow}
              headingId="about-background-heading"
              title={content.background.title}
            />
            <Image className={styles.founderPhoto} src="/media/founder/brandon-wilcox.jpg" width={800} height={1000}
              loading="eager" sizes="(max-width: 390px) 85vw, 320px" alt="Brandon Wilcox, founder of Rivermark Home Inspections" />
            </div>
            <div className={styles.prose}>
              {showFounderNote ? (
                <div className={styles.founderNote}>
                  <h3>{founderNote.title}</h3>
                  {!founderNote.ownerWordingApproved ? (
                    <p className={styles.draftLabel}>{founderNote.reviewLabel}</p>
                  ) : null}
                  <p>{founderNote.paragraphs.join(" ")}</p>
                  <p className={styles.founderSignature}>{founderNote.signature}</p>
                </div>
              ) : (
                <Paragraphs paragraphs={content.background.paragraphs} />
              )}
              {Object.entries(professionalClaims).filter(([, claim]) => claim.approved && claim.text?.trim()).map(([key, claim]) => <p key={key}>{claim.text}</p>)}
            </div>
          </div>
        </Container>
      </Section>

      <Section labelledBy="about-boundary-heading" surface="muted">
        <Container>
          <PageSectionHeader
            eyebrow={content.backgroundBoundary.eyebrow}
            headingId="about-boundary-heading"
            title={content.backgroundBoundary.title}
          />
          <div className={styles.boundaryGrid}>
            <p className={styles.boundaryIntroduction}>
              {content.backgroundBoundary.introduction}
            </p>
            <ul className={styles.boundaryList}>
              {content.backgroundBoundary.exclusions.map((exclusion) => (
                <li key={exclusion}>{exclusion}</li>
              ))}
            </ul>
          </div>
          <p className={styles.boundaryClosing}>
            {content.backgroundBoundary.closing}
          </p>
        </Container>
      </Section>

      <Section
        className={styles.independenceSection}
        labelledBy="about-independence-heading"
      >
        <Container>
          <div className={styles.independence} data-rm-surface="dark">
            <div>
              <p className={styles.inverseEyebrow}>
                {content.independence.eyebrow}
              </p>
              <h2 id="about-independence-heading">
                {content.independence.title}
              </h2>
              <p>{content.independence.introduction}</p>
            </div>
            <div>
              <p className={styles.doesNot}>Rivermark does not:</p>
              <ul>
                {content.independence.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <p className={styles.independenceClosing}>
              {content.independence.closing}
            </p>
          </div>
        </Container>
      </Section>

      <Section labelledBy="about-owner-heading" surface="surface">
        <Container>
          <div className={styles.ownerGrid}>
            <PageSectionHeader
              eyebrow={content.ownerOperated.eyebrow}
              headingId="about-owner-heading"
              title={content.ownerOperated.title}
            />
            <div className={styles.prose}>
              <Paragraphs paragraphs={content.ownerOperated.paragraphs} />
            </div>
          </div>
        </Container>
      </Section>

      <AboutFinalConversion />

      <StickyBookingAction
        suppressionId="about-final-conversion"
        triggerId="about-page-hero"
      />
    </div>
  );
}
