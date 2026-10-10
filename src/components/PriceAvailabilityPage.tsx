import { publicContact } from "@/config/publication";
import { manualReviewHref } from "@/config/inquiries";
import { pricingContent } from "@/content/pricing";
import { TextLink } from "./ActionLinks";
import { Container } from "./Container";
import { PageSectionHeader, Paragraphs } from "./CorePagePatterns";
import { Section } from "./Section";
import { SpectoraEmbed } from "./SpectoraEmbed";
import { siteRoutes } from "@/config/routes";
import {
  resolveSpectoraTransactionConfig,
  spectoraTransactionModes,
  type SpectoraTransactionConfig,
} from "@/config/spectora-transaction";
import {
  priceAvailabilityContent,
  type PriceAvailabilityPageLink,
} from "@/content/price-availability";

import styles from "./PriceAvailabilityPage.module.css";

function hrefFor(link: PriceAvailabilityPageLink) {
  return siteRoutes[link.route];
}

function SecureExternalAction({
  href,
  label,
}: Readonly<{ href: string; label: string }>) {
  return (
    <a className={styles.primaryAction} href={href}>
      {label}
    </a>
  );
}

function QuoteHelp() {
  const content = priceAvailabilityContent.transaction.quoteHelp;

  return (
    <p>
      {content.beforeLink}{" "}
      <a href={content.link.href}>{content.link.label}</a>
      {content.afterLink}
    </p>
  );
}

function DisabledTransaction() {
  const content = priceAvailabilityContent.transaction.disabled;

  return (
    <div className={styles.transactionPanel} data-rm-transaction-state="disabled">
      <p className={styles.pendingStatus}>{content.status}</p>
      <h3>{content.title}</h3>
      <Paragraphs paragraphs={content.paragraphs} />
    </div>
  );
}

function HostedTransaction({
  config,
}: Readonly<{
  config: Extract<SpectoraTransactionConfig, { mode: "hosted" }>;
}>) {
  const content = priceAvailabilityContent.transaction.hosted;

  return (
    <div className={styles.transactionPanel} data-rm-transaction-state="hosted">
      <h3>{content.title}</h3>
      <Paragraphs paragraphs={content.paragraphs} />
      <QuoteHelp />
      <SecureExternalAction href={config.hostedUrl} label={content.actionLabel} />
    </div>
  );
}

function EmbeddedTransaction({
  config,
}: Readonly<{
  config: Extract<SpectoraTransactionConfig, { mode: "embed" }>;
}>) {
  const content = priceAvailabilityContent.transaction.embed;

  return (
    <div className={styles.transactionPanel} data-rm-transaction-state="embed">
      <Paragraphs paragraphs={content.paragraphs} />
      <QuoteHelp />
      <SecureExternalAction
        href={config.hostedUrl}
        label={content.fallbackLabel}
      />
      <SpectoraEmbed
        key={config.embed.src}
        failureStatus={content.failureStatus}
        loadingStatus={content.loadingStatus}
        src={config.embed.src}
        title={content.iframeTitle}
      />
      <p className={styles.embedFallback}>
        Having trouble completing this step?{" "}
        <a href={config.hostedUrl}>{content.fallbackLabel}</a>
      </p>
    </div>
  );
}

function TransactionSurface({
  config,
}: Readonly<{ config: SpectoraTransactionConfig }>) {
  if (config.mode === spectoraTransactionModes.hosted) {
    return <HostedTransaction config={config} />;
  }

  if (config.mode === spectoraTransactionModes.embed) {
    return <EmbeddedTransaction config={config} />;
  }

  return <DisabledTransaction />;
}

export function PriceAvailabilityPage() {
  const content = priceAvailabilityContent;
  const transactionConfig = resolveSpectoraTransactionConfig();

  return (
    <div className={styles.page}>
      <Section
        className={styles.hero}
        labelledBy="price-availability-heading"
        surface="canvas"
      >
        <Container>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>{content.hero.eyebrow}</p>
              <h1 id="price-availability-heading">{content.hero.title}</h1>
              <div className={styles.heroBody}>
                <p>
                  A Residential Home Inspection starts at the standard price of{" "}
                  <strong>{pricingContent.quickAnswer.house.standard.amount}</strong>.{" "}
                  {pricingContent.quickAnswer.house.scope} Include finished and unfinished basement area.
                </p>
                <Paragraphs
                  paragraphs={content.hero.paragraphsByMode[transactionConfig.mode]}
                />
                <p>The selected service and property details determine your quote in Spectora. An opening price shown by the widget is not a Residential quote.</p>
              </div>
            </div>
          </div>
          <nav aria-label="Price and availability supporting links">
            <ul className={styles.supportingLinks} role="list">
              {content.supportingLinks.map((link) => (
                <li key={link.route}>
                  <TextLink href={hrefFor(link)}>{link.label}</TextLink>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </Section>

      <Section className={styles.transactionSection} labelledBy="price-availability-transaction-heading" surface="surface">
        <Container>
          <PageSectionHeader
            headingId="price-availability-transaction-heading"
            title={content.transaction.title}
          />
          <TransactionSurface config={transactionConfig} />
        </Container>
      </Section>

      <Section labelledBy="price-availability-preparation-heading" surface="muted">
        <Container>
          <PageSectionHeader
            eyebrow={content.preparation.eyebrow}
            headingId="price-availability-preparation-heading"
            paragraphs={[content.preparation.introduction]}
            title={content.preparation.title}
          />
          <ol className={styles.preparationList}>
            {content.preparation.items.map((item, index) => (
              <li key={item}>
                <span aria-hidden="true" className={styles.itemNumber}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section labelledBy="price-availability-manual-review-heading" surface="canvas">
        <Container width="reading">
          <div className={styles.manualReview}>
            <p className={styles.eyebrow}>{content.manualReview.eyebrow}</p>
            <h2 id="price-availability-manual-review-heading">
              {content.manualReview.title}
            </h2>
            <Paragraphs paragraphs={content.manualReview.paragraphs} />
            <TextLink href={manualReviewHref}>
              {content.manualReview.contactLink.label}
            </TextLink>
            {publicContact.phone?.approved && <p>Prefer to talk? <a href={publicContact.phone.href}>Call {publicContact.phone.display}</a>.</p>}
          </div>
        </Container>
      </Section>
    </div>
  );
}
