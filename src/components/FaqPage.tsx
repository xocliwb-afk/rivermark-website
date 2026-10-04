import { PrimaryActionLink, TextLink } from "./ActionLinks";
import { Container } from "./Container";
import {
  FAQList,
  PageHero,
  PageSectionHeader,
  Paragraphs,
} from "./CorePagePatterns";
import { FaqShowAllControl } from "./FaqShowAllControl";
import { Section } from "./Section";
import { StickyBookingAction } from "./StickyBookingAction";
import { siteRoutes } from "@/config/routes";
import { faqPageContent, type FaqPageLink } from "@/content/faq";
import { resolveMasterFaqCategories } from "@/content/faq-selection";

import styles from "./FaqPage.module.css";

const faqCollectionId = "master-faq-collection";

function hrefFor(link: FaqPageLink) {
  return siteRoutes[link.route];
}

export function FaqPage() {
  const content = faqPageContent;
  const categories = resolveMasterFaqCategories();

  return (
    <div className={styles.page}>
      <PageHero
        eyebrow={content.hero.eyebrow}
        headingId="faq-page-heading"
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
        triggerId="faq-hero"
      />

      <Section labelledBy="faq-category-navigation-heading" surface="muted">
        <Container width="reading">
          <nav
            aria-labelledby="faq-category-navigation-heading"
            className={styles.categoryNavigation}
          >
            <h2 id="faq-category-navigation-heading">
              {content.categoryNavigationLabel}
            </h2>
            <ul>
              {categories.map((category) => (
                <li key={category.id}>
                  <a href={`#${category.id}`}>{category.title}</a>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </Section>

      <div className={styles.faqCollection} id={faqCollectionId}>
        <div className={styles.controlRow}>
          <Container>
            <FaqShowAllControl targetId={faqCollectionId} />
          </Container>
        </div>
        {categories.map((category, index) => (
          <Section
            className={styles.category}
            key={category.id}
            labelledBy={category.id}
            surface={index % 2 === 0 ? "canvas" : "surface"}
          >
            <Container>
              <PageSectionHeader
                className={styles.categoryHeader}
                headingId={category.id}
                title={category.title}
              />
              <FAQList
                containerId={`${category.id}-items`}
                items={category.items}
                openFirst={false}
              />
            </Container>
          </Section>
        ))}
      </div>

      <div id="faq-final-conversion">
        <Section
          className={styles.final}
          labelledBy="faq-final-heading"
          surface="muted"
        >
          <Container width="reading">
            <p className={styles.eyebrow}>{content.final.eyebrow}</p>
            <h2 id="faq-final-heading">{content.final.title}</h2>
            <Paragraphs paragraphs={content.final.paragraphs} />
            <div className={styles.finalActions}>
              <PrimaryActionLink href={hrefFor(content.final.primaryAction)}>
                {content.final.primaryAction.label}
              </PrimaryActionLink>
              {content.final.supportingActions.map((action) => (
                <TextLink href={hrefFor(action)} key={action.route}>
                  {action.label}
                </TextLink>
              ))}
            </div>
          </Container>
        </Section>
      </div>

      <StickyBookingAction
        suppressionId="faq-final-conversion"
        triggerId="faq-hero"
      />
    </div>
  );
}
