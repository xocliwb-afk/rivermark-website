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
  type WorkflowKey,
} from "@/config/workflows";
import {
  agentsContent,
  type AgentsPageLink,
} from "@/content/agents";
import { resolveContextualFaqs } from "@/content/faq-selection";

import styles from "./AgentsPage.module.css";

function hrefFor(link: AgentsPageLink) {
  return siteRoutes[link.route];
}

function isRouteActive(route: SiteRouteKey) {
  return (
    isSiteRoutePubliclyVisible(route) && route !== "newConstructionInspections"
  );
}

function workflowCopy<T>(workflow: WorkflowKey, copy: WorkflowCopy<T>): T {
  return copyForWorkflow(workflow, copy);
}

function AgentFAQs() {
  const items = resolveContextualFaqs("agents");

  return (
    <Section labelledBy="agents-faq-heading" surface="canvas">
      <Container>
        <PageSectionHeader
          eyebrow="Agent FAQs"
          headingId="agents-faq-heading"
          title="Clear roles and practical operating answers."
        />
        <FAQList containerId="agents-faq-list" items={items} />
      </Container>
    </Section>
  );
}

export function AgentsPage() {
  const content = agentsContent;
  const buyerWorkflowIsReady = isWorkflowReady("buyerTransaction");
  const resources = content.resources.items.filter(
    (item) =>
      !("requiredRoute" in item) || isRouteActive(item.requiredRoute),
  );
  const sampleReportIsActive = isRouteActive(content.report.sampleReport.route);

  return (
    <div className={styles.page}>
      <PageHero
        aside={
          <aside className={styles.heroPanel} aria-label="Agent process summary">
            <h2>{content.hero.aside.title}</h2>
            <ul>
              {content.hero.aside.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <TextLink
              className={styles.heroFallback}
              href={hrefFor(content.hero.fallbackAction)}
            >
              {content.hero.fallbackAction.label}
            </TextLink>
          </aside>
        }
        eyebrow={content.hero.eyebrow}
        headingId="agents-page-heading"
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
        triggerId="agents-page-hero"
      />

      <Section labelledBy="agents-expectations-heading" surface="muted">
        <Container>
          <PageSectionHeader
            eyebrow={content.expectations.eyebrow}
            headingId="agents-expectations-heading"
            title={content.expectations.title}
          />
          <div className={styles.expectationList}>
            {content.expectations.items.map((item, index) => (
              <article className={styles.expectation} key={item.title}>
                <span aria-hidden="true" className={styles.index}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <Paragraphs
                    paragraphs={workflowCopy<readonly string[]>(
                      "buyerTransaction",
                      item.paragraphs,
                    )}
                  />
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section labelledBy="agents-starting-heading" surface="surface">
        <Container>
          <PageSectionHeader
            eyebrow={content.starting.eyebrow}
            headingId="agents-starting-heading"
            title={
              buyerWorkflowIsReady
                ? content.starting.productionTitle
                : content.starting.developmentTitle
            }
          />
          <div className={styles.startGrid}>
            <article className={styles.startPanel}>
              <h3>{content.starting.share.title}</h3>
              <Paragraphs
                paragraphs={workflowCopy(
                  "buyerTransaction",
                  content.starting.share.paragraphs,
                )}
              />
              <TextLink
                className={styles.sectionLink}
                href={hrefFor(content.starting.share.action)}
              >
                {content.starting.share.action.label}
              </TextLink>
            </article>
            <article className={styles.startPanel}>
              <p className={styles.statusLine}>
                {content.starting.agentStart.status}
              </p>
              <h3>{content.starting.agentStart.title}</h3>
              <Paragraphs
                paragraphs={workflowCopy(
                  "agentStart",
                  content.starting.agentStart.paragraphs,
                )}
              />
            </article>
          </div>
        </Container>
      </Section>

      <Section labelledBy="agents-roles-heading" surface="muted">
        <Container>
          <PageSectionHeader
            eyebrow={content.roles.eyebrow}
            headingId="agents-roles-heading"
            title={content.roles.title}
          />
          <div className={styles.rolesGrid}>
            <article className={styles.rolePanel}>
              <h3>
                {workflowCopy(
                  "agreementPaymentRoles",
                  content.roles.clientIntroduction,
                )}
              </h3>
              <ul>
                {content.roles.clientItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <div className={styles.bodyPanel}>
              <Paragraphs
                paragraphs={workflowCopy(
                  "agreementPaymentRoles",
                  content.roles.paragraphs,
                )}
              />
            </div>
          </div>
        </Container>
      </Section>

      <Section labelledBy="agents-scheduling-heading" surface="canvas">
        <Container>
          <PageSectionHeader
            eyebrow={content.scheduling.eyebrow}
            headingId="agents-scheduling-heading"
            paragraphs={workflowCopy(
              "buyerTransaction",
              content.scheduling.introduction,
            )}
            title={content.scheduling.title}
          />
          <div className={styles.groupGrid}>
            {content.scheduling.groups.map((group) => (
              <article className={styles.group} key={group.title}>
                <h3>{group.title}</h3>
                <Paragraphs
                  paragraphs={workflowCopy<readonly string[]>(
                    "buyerTransaction",
                    group.paragraphs,
                  )}
                />
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section labelledBy="agents-preparation-heading" surface="surface">
        <Container>
          <PageSectionHeader
            eyebrow={content.preparation.eyebrow}
            headingId="agents-preparation-heading"
            paragraphs={[content.preparation.introduction]}
            title={content.preparation.title}
          />
          <div className={styles.preparationGrid}>
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
            <div className={styles.notePanel}>
              <Paragraphs paragraphs={content.preparation.paragraphs} />
            </div>
          </div>
        </Container>
      </Section>

      <Section labelledBy="agents-inspection-heading" surface="muted">
        <Container width="reading">
          <PageSectionHeader
            eyebrow={content.inspectionDay.eyebrow}
            headingId="agents-inspection-heading"
            paragraphs={content.inspectionDay.paragraphs}
            title={content.inspectionDay.title}
          />
        </Container>
      </Section>

      <Section labelledBy="agents-report-heading" surface="canvas">
        <Container>
          <PageSectionHeader
            eyebrow={content.report.eyebrow}
            headingId="agents-report-heading"
            paragraphs={content.report.paragraphs}
            title={content.report.title}
          />
          <div className={styles.boundaryGrid}>
            <article className={styles.boundaryPanel}>
              <h3>{content.report.mayExplainIntroduction}</h3>
              <ul>
                {content.report.mayExplain.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className={styles.boundaryPanel}>
              <h3>{content.report.doesNotIntroduction}</h3>
              <ul>
                {content.report.doesNot.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {sampleReportIsActive ? (
                <TextLink
                  className={styles.sectionLink}
                  href={hrefFor(content.report.sampleReport)}
                >
                  {content.report.sampleReport.label}
                </TextLink>
              ) : null}
            </article>
          </div>
        </Container>
      </Section>

      <Section className={styles.independenceSection} labelledBy="independence-heading">
        <Container>
          <div className={styles.independence} data-rm-surface="dark">
            <div>
              <p className={styles.inverseEyebrow}>
                {content.independence.eyebrow}
              </p>
              <h2 id="independence-heading">{content.independence.title}</h2>
              <p>{content.independence.introduction}</p>
            </div>
            <ul>
              {content.independence.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>{content.independence.closing}</p>
          </div>
        </Container>
      </Section>

      <Section labelledBy="agents-resources-heading" surface="surface">
        <Container>
          <PageSectionHeader
            eyebrow={content.resources.eyebrow}
            headingId="agents-resources-heading"
            title={content.resources.title}
          />
          <div className={styles.resourceGrid}>
            {resources.map((resource) => (
              <article className={styles.resource} key={resource.title}>
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
                <TextLink
                  className={styles.sectionLink}
                  href={hrefFor(resource.link)}
                >
                  {resource.link.label}
                </TextLink>
              </article>
            ))}
          </div>
          <p className={styles.resourcesClosing}>{content.resources.closing}</p>
        </Container>
      </Section>

      <AgentFAQs />

      <FinalPageCTA
        eyebrow={content.final.eyebrow}
        fallback={{
          text: content.final.fallback.text,
          action: {
            ...content.final.fallback.action,
            href: hrefFor(content.final.fallback.action),
          },
        }}
        headingId="agents-final-heading"
        paragraphs={workflowCopy(
          "buyerTransaction",
          content.final.paragraphs,
        )}
        primaryAction={{
          ...content.final.primaryAction,
          href: hrefFor(content.final.primaryAction),
        }}
        suppressionId="agents-final-conversion"
        title={content.final.title}
      />

      <StickyBookingAction
        suppressionId="agents-final-conversion"
        triggerId="agents-page-hero"
      />
    </div>
  );
}
