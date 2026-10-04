import { TextLink } from "./ActionLinks";
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
import { siteRoutes, type SiteRouteKey } from "@/config/routes";
import { isSiteRoutePubliclyVisible } from "@/config/site";
import {
  copyForWorkflow,
  isWorkflowReady,
  type WorkflowCopy,
} from "@/config/workflows";
import {
  buyersContent,
  type BuyersPageLink,
} from "@/content/buyers";
import { resolveContextualFaqs } from "@/content/faq-selection";

import styles from "./BuyersPage.module.css";

function hrefFor(link: BuyersPageLink) {
  return siteRoutes[link.route];
}

function isRouteActive(route: SiteRouteKey) {
  return (
    isSiteRoutePubliclyVisible(route) && route !== "newConstructionInspections"
  );
}

function buyerCopy<T>(copy: WorkflowCopy<T>): T {
  return copyForWorkflow("buyerTransaction", copy);
}

function BuyersOptionalServices() {
  const content = buyersContent.optionalServices;
  const activeItems = content.items.filter((item) =>
    isRouteActive(item.requiredRoute),
  );

  if (activeItems.length === 0) {
    return null;
  }

  return (
    <Section labelledBy="buyers-options-heading" surface="muted">
      <Container>
        <PageSectionHeader
          eyebrow={content.eyebrow}
          headingId="buyers-options-heading"
          title={content.title}
        />
        <div className={styles.groupGrid}>
          {activeItems.map((item) => (
            <article className={styles.group} key={item.requiredRoute}>
              <h3>{item.title}</h3>
              <Paragraphs paragraphs={item.paragraphs} />
              <p className={styles.priceLine}>{item.price}</p>
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

function BuyersFAQs() {
  const items = resolveContextualFaqs("buyers");

  return (
    <Section labelledBy="buyers-faq-heading" surface="canvas">
      <Container>
        <PageSectionHeader
          eyebrow="Buyer FAQs"
          headingId="buyers-faq-heading"
          title="Practical answers before inspection day."
        />
        <FAQList containerId="buyers-faq-list" items={items} />
      </Container>
    </Section>
  );
}

export function BuyersPage() {
  const content = buyersContent;
  const sampleReportIsActive = isRouteActive(content.report.sampleReport.route);
  const workflowIsReady = isWorkflowReady("buyerTransaction");

  return (
    <div className={styles.page}>
      <PageHero
        eyebrow={content.hero.eyebrow}
        headingId="buyers-page-heading"
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
        triggerId="buyers-page-hero"
      />

      <Section labelledBy="buyers-process-heading" surface="muted">
        <Container>
          <PageSectionHeader
            eyebrow={content.process.eyebrow}
            headingId="buyers-process-heading"
            title={content.process.title}
          />
          <ol className={styles.processList}>
            {content.process.steps.map((step, index) => (
              <li className={styles.processStep} key={step.title}>
                <span aria-hidden="true" className={styles.index}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <Paragraphs
                    paragraphs={buyerCopy<readonly string[]>(step.paragraphs)}
                  />
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section labelledBy="buyers-schedule-heading" surface="surface">
        <Container>
          <div className={styles.twoColumnLead}>
            <PageSectionHeader
              eyebrow={content.scheduling.eyebrow}
              headingId="buyers-schedule-heading"
              title={content.scheduling.title}
            />
            <div className={styles.bodyPanel}>
              <Paragraphs paragraphs={buyerCopy(content.scheduling.paragraphs)} />
            </div>
          </div>
        </Container>
      </Section>

      <Section labelledBy="buyers-information-heading" surface="canvas">
        <Container>
          <PageSectionHeader
            eyebrow={content.bookingInformation.eyebrow}
            headingId="buyers-information-heading"
            title={content.bookingInformation.title}
          />
          <div className={styles.checklistGrid}>
            <div>
              <p className={styles.listIntroduction}>
                {content.bookingInformation.introduction}
              </p>
              <ul className={styles.checklist}>
                {content.bookingInformation.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className={styles.notePanel}>
              <Paragraphs
                paragraphs={buyerCopy(content.bookingInformation.closing)}
              />
            </div>
          </div>
        </Container>
      </Section>

      <Section labelledBy="buyers-preparation-heading" surface="muted">
        <Container>
          <PageSectionHeader
            eyebrow={content.preparation.eyebrow}
            headingId="buyers-preparation-heading"
            paragraphs={[content.preparation.opening]}
            title={content.preparation.title}
          />
          <p className={styles.listIntroduction}>
            {buyerCopy(content.preparation.listIntroduction)}
          </p>
          <ul className={styles.checklistColumns}>
            {content.preparation.items
              .filter(
                (item) =>
                  !("requiredRoute" in item) ||
                  isRouteActive(item.requiredRoute),
              )
              .map((item) => (
                <li key={item.text}>{item.text}</li>
              ))}
          </ul>
          <p className={styles.closingNote}>
            {buyerCopy(content.preparation.closing)}
          </p>
          <TextLink
            className={styles.sectionLink}
            href={hrefFor(content.preparation.resourceLink)}
          >
            {content.preparation.resourceLink.label}
          </TextLink>
        </Container>
      </Section>

      <Section labelledBy="buyers-during-heading" surface="surface">
        <Container width="reading">
          <PageSectionHeader
            eyebrow={content.during.eyebrow}
            headingId="buyers-during-heading"
            paragraphs={content.during.paragraphs}
            title={content.during.title}
          />
        </Container>
      </Section>

      <Section labelledBy="buyers-walkthrough-heading" surface="muted">
        <Container>
          <div className={styles.walkthroughGrid}>
            <div>
              <PageSectionHeader
                eyebrow={content.walkthrough.eyebrow}
                headingId="buyers-walkthrough-heading"
                paragraphs={content.walkthrough.paragraphsBefore}
                title={content.walkthrough.title}
              />
            </div>
            <ol className={styles.priorityList}>
              {content.walkthrough.items.map((item, index) => (
                <li key={item}>
                  <span aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
          <div className={styles.closingCopy}>
            <Paragraphs paragraphs={content.walkthrough.paragraphsAfter} />
          </div>
          <div className={styles.walkthroughQuestions}>
            <h3>{content.walkthrough.questionsTitle}</h3>
            <ul className={styles.checklist}>
              {content.walkthrough.questions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section labelledBy="buyers-report-heading" surface="canvas">
        <Container>
          <PageSectionHeader
            eyebrow={content.report.eyebrow}
            headingId="buyers-report-heading"
            paragraphs={[content.report.introduction]}
            title={content.report.title}
          />
          <div className={styles.reportGrid}>
            <ul className={styles.checklist}>
              {content.report.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className={styles.bodyPanel}>
              <Paragraphs paragraphs={content.report.paragraphs} />
              <div className={styles.reportLinks}>
                <TextLink
                  className={styles.sectionLink}
                  href={hrefFor(content.report.resourceLink)}
                >
                  {content.report.resourceLink.label}
                </TextLink>
                {sampleReportIsActive ? (
                  <TextLink
                    className={styles.sectionLink}
                    href={hrefFor(content.report.sampleReport)}
                  >
                    {content.report.sampleReport.label}
                  </TextLink>
                ) : null}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section labelledBy="buyers-support-heading" surface="surface">
        <Container>
          <PageSectionHeader
            eyebrow={content.support.eyebrow}
            headingId="buyers-support-heading"
            paragraphs={[content.support.introduction]}
            title={content.support.title}
          />
          <div className={styles.ownershipGuide}>
            <Paragraphs paragraphs={content.support.ownership} />
            <h3>{content.support.emailSupportTitle}</h3>
            <p>{content.support.emailSupportIntroduction}</p>
          </div>
          <div className={styles.boundaryGrid}>
            <article className={styles.boundaryPanel}>
              <h3>{content.support.mayHelpIntroduction}</h3>
              <ul>
                {content.support.mayHelp.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className={styles.boundaryPanel}>
              <h3>{content.support.doesNotIntroduction}</h3>
              <ul>
                {content.support.doesNot.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </Container>
      </Section>

      <Section labelledBy="buyers-roles-heading" surface="muted">
        <Container>
          <PageSectionHeader
            eyebrow={content.roles.eyebrow}
            headingId="buyers-roles-heading"
            paragraphs={[buyerCopy(content.roles.agentParagraph)]}
            title={content.roles.title}
          />
          <div className={styles.rolesGrid}>
            <div className={styles.rolePanel}>
              <h3>{buyerCopy(content.roles.clientIntroduction)}</h3>
              <ul>
                {content.roles.clientItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className={styles.bodyPanel}>
              <Paragraphs paragraphs={content.roles.paragraphs} />
            </div>
          </div>
        </Container>
      </Section>

      <BuyersOptionalServices />
      <BuyersFAQs />

      <FinalPageCTA
        eyebrow={content.final.eyebrow}
        fallback={{
          text: content.final.fallback.text,
          action: {
            ...content.final.fallback.action,
            href: hrefFor(content.final.fallback.action),
          },
        }}
        headingId="buyers-final-heading"
        paragraphs={buyerCopy(content.final.paragraphs)}
        primaryAction={{
          ...content.final.primaryAction,
          href: hrefFor(content.final.primaryAction),
        }}
        secondaryAction={{
          ...content.final.secondaryAction,
          href: hrefFor(content.final.secondaryAction),
        }}
        suppressionId="buyers-final-conversion"
        title={
          workflowIsReady
            ? content.final.productionTitle
            : content.final.developmentTitle
        }
      />

      <StickyBookingAction
        suppressionId="buyers-final-conversion"
        triggerId="buyers-page-hero"
      />
    </div>
  );
}
