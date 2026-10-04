import { siteRoutes, type SiteHref, type SiteRouteKey } from "@/config/routes";
import "server-only";
import { manualReviewHref } from "@/config/inquiries";
import { showIntroductoryPricing } from "@/config/publication";

import { isGeographyReady } from "@/config/geography-readiness";
import { areServiceCapabilitiesReady } from "@/config/service-readiness";
import { isSiteRoutePubliclyVisible } from "@/config/site";
import { isWorkflowReady } from "@/config/workflows";
import {
  faqCatalog,
  faqCategoryDefinitions,
  type FaqAnswer,
  type FaqCatalogEntry,
  type FaqContext,
  type FaqId,
  type FaqParagraph,
  type FaqReadinessRequirement,
  type FaqVariant,
} from "@/content/faq-catalog";

export type ResolvedFaqItem = Readonly<{
  id: `faq-${FaqId}`;
  question: string;
  answer: readonly string[];
  action?: Readonly<{ label: string; href: SiteHref }>;
}>;

export type ResolvedFaqCategory = Readonly<{
  id: `faq-category-${(typeof faqCategoryDefinitions)[number]["id"]}`;
  title: string;
  items: readonly ResolvedFaqItem[];
}>;

export const contextualFaqIds = {
  home: [
    "inspection-price",
    "inspection-attendance",
    "inspection-duration",
    "main-building-square-footage",
    "manual-review",
    "report-timing",
    "repair-estimates-negotiation",
  ],
  residential: [
    "residential-inspection-inclusions",
    "inspection-duration",
    "inspection-attendance",
    "roof-walking",
    "inaccessible-area",
    "professional-scope-boundary",
    "condominium-townhome",
    "report-timing",
    "manual-review",
  ],
  pricing: [
    "introductory-price-duration",
    "automatic-age-surcharge",
    "main-building-square-footage",
    "unknown-property-detail",
    "online-quote-pricing-page",
    "accepted-price-revision",
  ],
  buyers: [
    "inspection-attendance",
    "inspection-duration",
    "walkthrough-arrival",
    "buyer-unable-to-attend",
    "agent-attendance",
    "purchase-decision",
    "repair-estimates-negotiation",
    "inaccessible-area",
    "professional-scope-boundary",
    "radon-sewer-boundary",
    "report-authorization",
    "report-timing",
  ],
  agents: [
    "agent-start",
    "agreement-signer",
    "payment-responsibility",
    "report-authorization",
    "inspection-attendance",
    "agent-walkthrough-attendance",
    "manual-review",
    "repair-estimates-negotiation",
    "repair-request-boundary",
    "same-day-report",
    "listing-agent-findings",
    "share-price-availability",
  ],
  services: [
    "homebuyer-service-selection",
    "condominium-townhome",
    "full-inspection-consultation",
    "radon-sewer-boundary",
    "multi-unit-property",
    "detached-structures",
    "new-construction-availability",
    "repair-estimates-negotiation",
    "uncertain-service-fit",
  ],
  "other-residential-services": [
    "prelisting-vs-buyer",
    "seller-report-candor",
    "maintenance-inspection",
    "multi-unit-property",
    "condominium-townhome",
    "preoffer-consultation-scope",
    "consultation-upgrade",
    "repair-follow-up-boundary",
    "detached-structures",
    "radon-sewer-boundary",
    "manual-review",
  ],
  "service-area": [
    "west-michigan-coverage",
    "grand-rapids-anchor",
    "service-area-zone",
    "travel-charge-display",
    "multi-visit-travel",
    "outer-area-acceptance",
    "outer-area-reservation",
  ],
} as const satisfies Record<FaqContext, readonly FaqId[]>;

function routeRequirementsPass(
  routes: readonly (SiteRouteKey)[],
  match: "all" | "any" = "all",
): boolean {
  const routeIsActive = (route: SiteRouteKey) =>
    isSiteRoutePubliclyVisible(route) && route !== "newConstructionInspections";

  return match === "any"
    ? routes.some(routeIsActive)
    : routes.every(routeIsActive);
}

function readinessRequirementPass(
  requirement: FaqReadinessRequirement,
): boolean {
  if (requirement.kind === "workflow") {
    return isWorkflowReady(requirement.key);
  }

  if (requirement.kind === "service") {
    return areServiceCapabilitiesReady(requirement.keys);
  }

  return isGeographyReady(requirement.key);
}

function answerParagraphs(answer: FaqAnswer): readonly FaqParagraph[] {
  if (!("production" in answer)) {
    return answer;
  }

  return answer.requirements.every(readinessRequirementPass)
    ? answer.production
    : answer.development;
}

function resolveParagraphs(answer: FaqAnswer): readonly string[] {
  return answerParagraphs(answer)
    .filter(
      (paragraph) =>
        typeof paragraph === "string" ||
        routeRequirementsPass(
          paragraph.requiredRoutes,
          paragraph.routeMatch ?? "all",
        ),
    )
    .map((paragraph) =>
      typeof paragraph === "string" ? paragraph : paragraph.text,
    );
}

const masterFaqOwnerLinks: Partial<Record<FaqId, Readonly<{ label: string; route: SiteRouteKey; fragment?: string }>>> = {
  "inspection-price": { label: "View complete pricing", route: "pricing" },
  "inspection-duration": { label: "Plan your inspection as a buyer", route: "buyers" },
  "written-report-controls": { label: "How to read your inspection report", route: "homeInspectionReportResource" },
  "condominium-townhome": { label: "Compare condominium and townhome scope", route: "otherResidentialServices", fragment: "other-services-condominium-heading" },
  "new-construction-availability": { label: "Read about the planned inspection stages", route: "newConstructionInspections" },
  "professional-scope-boundary": { label: "Read the residential inspection scope", route: "residentialHomeInspections" },
  "service-area-travel": { label: "Check service area and travel", route: "serviceArea" },
};

function resolveVariant(
  id: FaqId,
  variant: FaqVariant,
  includeOwnerLink = false,
): ResolvedFaqItem | undefined {
  if (id === "introductory-price-duration" && !showIntroductoryPricing()) {
    return undefined;
  }
  if (
    variant.requiredRoutes &&
    !routeRequirementsPass(
      variant.requiredRoutes,
      variant.routeMatch ?? "all",
    )
  ) {
    return undefined;
  }

  const answer = resolveParagraphs(variant.answer);

  if (answer.length === 0) {
    return undefined;
  }

  const ownerLink = includeOwnerLink ? masterFaqOwnerLinks[id] : undefined;
  const action: ResolvedFaqItem["action"] = ["manual-review", "outer-area-reservation"].includes(id)
    ? { label: "Get Help With This Property", href: manualReviewHref }
    : ownerLink && isSiteRoutePubliclyVisible(ownerLink.route)
      ? { label: ownerLink.label, href: ownerLink.fragment ? `${siteRoutes[ownerLink.route]}#${ownerLink.fragment}` : siteRoutes[ownerLink.route] }
      : undefined;

  return {
    id: `faq-${id}`,
    question: variant.question,
    answer,
    ...(action ? { action } : {}),
  };
}

export function resolveContextualFaqs(
  context: FaqContext,
  ids: readonly FaqId[] = contextualFaqIds[context],
): readonly ResolvedFaqItem[] {
  return ids.flatMap((id) => {
    const entry: FaqCatalogEntry = faqCatalog[id];
    const variant = entry.contexts?.[context] ?? entry.default;
    const resolved = resolveVariant(id, variant);

    return resolved ? [resolved] : [];
  });
}

export function resolveMasterFaqCategories(): readonly ResolvedFaqCategory[] {
  const entries = Object.entries(faqCatalog) as readonly [
    FaqId,
    FaqCatalogEntry,
  ][];

  return faqCategoryDefinitions.flatMap((category) => {
    const items = entries
      .filter(([, entry]) => entry.master?.category === category.id)
      .sort(([, left], [, right]) =>
        (left.master?.order ?? 0) - (right.master?.order ?? 0),
      )
      .flatMap(([id, entry]) => {
        const resolved = resolveVariant(id, entry.default, true);
        return resolved ? [resolved] : [];
      });

    if (items.length === 0) {
      return [];
    }

    return [
      {
        id: `faq-category-${category.id}` as const,
        title: category.title,
        items,
      },
    ];
  });
}
