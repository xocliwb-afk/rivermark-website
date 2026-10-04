import { articleDates, promotionExplanation, promotionIsActive } from "@/config/publication";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { canonicalFor } from "@/config/search";
import { siteRoutes } from "@/config/routes";
import { pricingContent } from "@/content/pricing";
import { resourceAuthor, type Resource } from "@/content/resources";
import { EditorialPage, RelatedPages } from "./EditorialPage";
import { PricingTable } from "./PricingTable";
import { StructuredData, founderData, organizationData } from "./PageStructuredData";
import { ResourceInline } from "./ResourceInline";
import styles from "./EditorialPage.module.css";

function headingId(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Repository-owned paragraphs, h2/h3, flat lists, safe inline links and price includes.
 * No HTML, executable MDX, remote content or raw HTML injection.
 */
function articleBlocks(resource: Resource) {
  const source = readFileSync(join(process.cwd(), "src/content/resources", `${resource.slug}.md`), "utf8");
  const blocks = source.trim().split(/\n\s*\n/);
  for (const block of blocks) {
    if (/[<>]|^```|^\|/m.test(block)) throw new Error(`Unsupported resource markup in ${resource.slug}`);
  }
  return blocks;
}

export function houseAreaExamplePrice(introductory = promotionIsActive()): string {
  // This one teaching example references the existing approved tier, not a second quote engine.
  const tier = pricingContent.housePricing.table.rows.find(row => row.label === "3,001–3,500 sq. ft.");
  if (!tier) throw new Error("Update the 3,300-square-foot teaching example when the house grid changes.");
  return tier.values[introductory ? 0 : 1];
}

export function ResourceArticle({ resource }: Readonly<{ resource: Resource }>) {
  const blocks = articleBlocks(resource);
  const dates = articleDates(resource);
  const canonical = canonicalFor(resource.route);
  return <EditorialPage title={resource.title} eyebrow="Rivermark resources" introduction={resource.introduction} parent="resources">
    <p>By <a href={`${siteRoutes.about}#about-background-heading`}>{resourceAuthor}</a></p>
    {dates && <p className={styles.eyebrow}>Published <time dateTime={dates.datePublished}>{dates.datePublished}</time>
      {dates.dateModified && <> · Updated <time dateTime={dates.dateModified}>{dates.dateModified}</time></>}
    </p>}
    <StructuredData data={{
      "@type": "Article", headline: resource.title, description: resource.metadata.description,
      ...(canonical ? { "@id": `${canonical}#article`, url: canonical, mainEntityOfPage: canonical } : {}),
      author: founderData(), publisher: organizationData(),
      ...dates,
    }} />
    <article aria-label={resource.title}>
      <nav aria-label="In this guide" className={styles.contents}>
        <h2>In this guide</h2><ul>{blocks.filter((b) => b.startsWith("## ")).map((b) =>
          <li key={b}><a href={`#${headingId(b.slice(3))}`}>{b.slice(3)}</a></li>
        )}</ul>
      </nav>
      {blocks.map((block, index) => {
        if (block === "{{promotion-status}}") return <p key={index}>{promotionExplanation()}</p>;
        if (block === "{{house-pricing}}") return <PricingTable key={index} {...pricingContent.housePricing.table} />;
        if (block === "{{condo-pricing}}") return <PricingTable key={index} {...pricingContent.condominiumPricing.table} />;
        if (block === "{{house-area-example}}") return <p key={index}>For example, 2,400 sq. ft. above grade + 900 sq. ft. of basement = 3,300 sq. ft. of inspected main-building area. Under the current {promotionIsActive() ? "introductory" : "standard"} house grid, the base price is {houseAreaExamplePrice()} before other applicable adjustments. This is an illustration, not a quote for a particular property.</p>;
        if (block.startsWith("### ")) return <h3 key={index} id={headingId(block.slice(4))}>{block.slice(4)}</h3>;
        if (block.startsWith("## ")) return <h2 key={index} id={headingId(block.slice(3))}>{block.slice(3)}</h2>;
        if (block.startsWith("- ")) return <ul key={index}>{block.split("\n").map((line) => <li key={line}><ResourceInline text={line.slice(2)} /></li>)}</ul>;
        if (/^\d+\. /.test(block)) return <ol key={index}>{block.split("\n").map((line) => <li key={line}><ResourceInline text={line.replace(/^\d+\. /, "")} /></li>)}</ol>;
        if (block.includes("{{")) throw new Error(`Unknown resource include in ${resource.slug}`);
        return <p key={index}><ResourceInline text={block.replace(/\n/g, " ")} /></p>;
      })}
    </article>
    <RelatedPages routes={resource.related} />
  </EditorialPage>;
}
