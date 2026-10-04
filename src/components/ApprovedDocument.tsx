import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Fragment } from "react";
import { legalPublication, publicContact, safeArtifactUrl, siteRelease } from "@/config/publication";
import actionStyles from "./ActionLinks.module.css";
import { PricingTable } from "./PricingTable";
import { FAQList, type FAQItem } from "./CorePagePatterns";
import styles from "./EditorialPage.module.css";

type DocumentName = "radon-testing" | "sewer-scope" | "thermal-imaging" | "sample-report" | "privacy" | "website-terms";

function inline(text: string) {
  return text.split(/(\*\*.*?\*\*)/).map((part, i) => part.startsWith("**")
    ? <strong key={i}>{part.slice(2, -2)}</strong> : <Fragment key={i}>{part}</Fragment>);
}

export function PublicContactDetails() {
  const phone = publicContact.phone;
  return <p>Rivermark Home Inspections<br />
    <a href={`mailto:${publicContact.email}`}>{publicContact.email}</a>
    {phone?.approved && <><br /><a href={phone.href}>Call {phone.display}</a></>}
  </p>;
}

export function SampleReportDestination() {
  const artifact = siteRelease.sampleReport;
  const interactive = artifact.approved ? safeArtifactUrl(artifact.interactiveUrl) : undefined;
  const pdf = artifact.approved ? safeArtifactUrl(artifact.pdfUrl) : undefined;
  if (!interactive && !pdf) return null;
  return <div className={styles.actions}>
    {interactive && <a className={`${actionStyles.action} ${actionStyles.primary} ${styles.artifactAction}`} href={interactive}>Open Interactive Sample Report</a>}
    {pdf && <a className={`${actionStyles.action} ${actionStyles.primary} ${styles.artifactAction}`} href={pdf}>Open Sample Report PDF</a>}
  </div>;
}

/** Repository-owned editorial subset, following the existing Resources convention.
 * No executable Markdown, raw HTML, remote includes or arbitrary destinations.
 */
export function ApprovedDocument({ name }: Readonly<{ name: DocumentName }>) {
  const source = readFileSync(join(process.cwd(), "src/content/documents", `${name}.md`), "utf8");
  const [body, faqSource] = source.replaceAll("{{business-email}}", publicContact.email).split(/\n## (?:Radon|Sewer-Scope|Thermal-Imaging) FAQs\n/);
  const blocks = body.trim().split(/\n\s*\n/);
  const faqs: FAQItem[] = faqSource ? faqSource.trim().split(/(?:^|\n)### /).filter(Boolean).map((entry, index) => {
    if (/[<>]|\]\(|^```|\{\{/m.test(entry)) throw new Error(`Unsupported FAQ markup: ${name}`);
    const [question, ...answer] = entry.trim().split(/\n\s*\n/);
    return { id: `${name}-faq-${index + 1}`, question: question.trim(), answer: answer.map(paragraph => paragraph.replace(/\n/g, " ")) };
  }) : [];
  return <div className={styles.document}>{blocks.map((block, index) => {
    if (/[<>]|\]\(|^```/m.test(block)) throw new Error(`Unsupported document markup: ${name}`);
    const next = blocks[index + 1];
    if (block.startsWith("## ") && next?.startsWith("{{legal:")) {
      const provision = next.slice(8, -2) as "limitationOfLiability" | "indemnity" | "governingLaw";
      if (!legalPublication[provision]) return null;
    }
    if (block === "{{contact-details}}") return <PublicContactDetails key={index} />;
    if (block === "{{sample-report}}") return <SampleReportDestination key={index} />;
    if (block.startsWith("{{legal:")) {
      const key = block.slice(8, -2) as "limitationOfLiability" | "indemnity" | "governingLaw";
      const provision = legalPublication[key];
      return provision ? <p key={index}>{provision}</p> : null;
    }
    if (block.startsWith("### ")) return <h3 key={index}>{inline(block.slice(4))}</h3>;
    if (block.startsWith("## ")) return <h2 key={index}>{inline(block.slice(3))}</h2>;
    if (block.startsWith("- ")) return <ul key={index}>{block.split("\n").map((line, i) => <li key={i}>{inline(line.slice(2))}</li>)}</ul>;
    if (/^\d+\. /.test(block)) return <ol key={index}>{block.split("\n").map((line, i) => <li key={i}>{inline(line.replace(/^\d+\. /, ""))}</li>)}</ol>;
    if (block.startsWith("|")) {
      const rows = block.split("\n").map(line => line.split("|").slice(1, -1).map(cell => cell.trim()));
      return <PricingTable key={index} caption="Service pricing" firstColumnLabel={rows[0][0]}
        columns={rows[0].slice(1).map(label => ({ label, numeric: true }))}
        rows={rows.slice(2).map(([label, ...values]) => ({ label, values }))} />;
    }
    if (block.includes("{{")) throw new Error(`Unknown document include: ${name}`);
    return <p key={index}>{inline(block.replace(/\n/g, " "))}</p>;
  })}{faqs.length > 0 && <><h2>Frequently asked questions</h2><FAQList items={faqs} /></>}</div>;
}
