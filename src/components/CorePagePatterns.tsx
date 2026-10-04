import { Fragment, type ReactNode } from "react";

import type { SiteHref } from "@/config/routes";

import {
  PrimaryActionLink,
  SecondaryActionLink,
  TextLink,
} from "./ActionLinks";
import { Container } from "./Container";
import { Section } from "./Section";
import styles from "./CorePagePatterns.module.css";

export type PageAction = Readonly<{
  label: string;
  href: SiteHref;
}>;

type ParagraphsProps = Readonly<{
  paragraphs: readonly string[];
  className?: string;
}>;

export function Paragraphs({ paragraphs, className }: ParagraphsProps) {
  return paragraphs.map((paragraph) => (
    <p className={className} key={paragraph}>
      {paragraph}
    </p>
  ));
}

type PageHeroProps = Readonly<{
  headingId: string;
  triggerId: string;
  eyebrow: string;
  title: string;
  paragraphs: readonly string[];
  primaryAction: PageAction;
  secondaryAction?: PageAction;
  proofLine?: string;
  aside?: ReactNode;
}>;

export function ProofPhrases({ text }: Readonly<{ text: string }>) {
  return text.split(" · ").map((phrase, index, phrases) => (
    <Fragment key={phrase}>
      {index > 0 ? " " : null}
      <span className={styles.proofPhrase}>
        {phrase}{index < phrases.length - 1 ? " ·" : null}
      </span>
    </Fragment>
  ));
}

export function PageHero({
  headingId,
  triggerId,
  eyebrow,
  title,
  paragraphs,
  primaryAction,
  secondaryAction,
  proofLine,
  aside,
}: PageHeroProps) {
  return (
    <Section className={styles.hero} labelledBy={headingId} surface="canvas">
      <Container>
        <div className={styles.heroGrid} id={triggerId}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>{eyebrow}</p>
            <h1 id={headingId}>{title}</h1>
            <div className={styles.heroBody}>
              <Paragraphs paragraphs={paragraphs} />
            </div>
            <div className={styles.actions}>
              <PrimaryActionLink href={primaryAction.href}>
                {primaryAction.label}
              </PrimaryActionLink>
              {secondaryAction ? (
                <SecondaryActionLink href={secondaryAction.href}>
                  {secondaryAction.label}
                </SecondaryActionLink>
              ) : null}
            </div>
            {proofLine ? <p className={styles.proofLine}><ProofPhrases text={proofLine} /></p> : null}
          </div>
          {aside ? <div className={styles.heroAside}>{aside}</div> : null}
        </div>
      </Container>
    </Section>
  );
}

type PageSectionHeaderProps = Readonly<{
  headingId: string;
  title: string;
  eyebrow?: string;
  paragraphs?: readonly string[];
  className?: string;
}>;

export function PageSectionHeader({
  headingId,
  title,
  eyebrow,
  paragraphs = [],
  className,
}: PageSectionHeaderProps) {
  return (
    <header className={[styles.sectionHeader, className].filter(Boolean).join(" ")}>
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <h2 id={headingId}>{title}</h2>
      {paragraphs.length > 0 ? (
        <div className={styles.sectionLead}>
          <Paragraphs paragraphs={paragraphs} />
        </div>
      ) : null}
    </header>
  );
}

export type FAQItem = Readonly<{
  id: string;
  question: string;
  answer: readonly string[];
  action?: Readonly<{ label: string; href: SiteHref }>;
}>;

type FAQListProps = Readonly<{
  items: readonly FAQItem[];
  containerId?: string;
  openFirst?: boolean;
}>;

export function FAQList({
  items,
  containerId,
  openFirst = true,
}: FAQListProps) {
  return (
    <div className={styles.faqList} data-rm-faq-list id={containerId}>
      {items.map((item, index) => (
        <details
          className={styles.faqItem}
          id={item.id}
          key={item.id}
          open={openFirst && index === 0}
        >
          <summary className={styles.faqSummary}>{item.question}</summary>
          <div className={styles.faqAnswer}>
            <Paragraphs paragraphs={item.answer} />
            {item.action && <TextLink href={item.action.href}>{item.action.label}</TextLink>}
          </div>
        </details>
      ))}
    </div>
  );
}

type FinalPageCTAProps = Readonly<{
  suppressionId: string;
  headingId: string;
  eyebrow?: string;
  title: string;
  paragraphs: readonly string[];
  primaryAction: PageAction;
  secondaryAction?: PageAction;
  fallback?: Readonly<{
    text: string;
    action: PageAction;
  }>;
}>;

export function FinalPageCTA({
  suppressionId,
  headingId,
  eyebrow = "Your next step",
  title,
  paragraphs,
  primaryAction,
  secondaryAction,
  fallback,
}: FinalPageCTAProps) {
  return (
    <div id={suppressionId}>
      <Section
        className={styles.finalCta}
        labelledBy={headingId}
        surface="muted"
      >
        <Container width="reading">
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 id={headingId}>{title}</h2>
          <Paragraphs paragraphs={paragraphs} />
          <div className={styles.actions}>
            <PrimaryActionLink href={primaryAction.href}>
              {primaryAction.label}
            </PrimaryActionLink>
            {secondaryAction ? (
              <SecondaryActionLink href={secondaryAction.href}>
                {secondaryAction.label}
              </SecondaryActionLink>
            ) : null}
          </div>
          {fallback ? (
            <p className={styles.fallback}>
              {fallback.text}{" "}
              <TextLink href={fallback.action.href}>
                {fallback.action.label}
              </TextLink>
            </p>
          ) : null}
        </Container>
      </Section>
    </div>
  );
}
