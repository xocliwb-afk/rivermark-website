export const publicationStates = {
  hidden: "hidden",
  inactive: "inactive",
  conditional: "conditional",
  active: "active",
} as const;

export type PublicationState =
  (typeof publicationStates)[keyof typeof publicationStates];

const publiclyVisibleStates = {
  [publicationStates.hidden]: false,
  [publicationStates.inactive]: true,
  [publicationStates.conditional]: false,
  [publicationStates.active]: true,
} as const satisfies Record<PublicationState, boolean>;

export type PubliclyVisibleState = {
  [State in PublicationState]: (typeof publiclyVisibleStates)[State] extends true
    ? State
    : never;
}[PublicationState];

export function isPubliclyVisible(
  state: PublicationState,
): state is PubliclyVisibleState {
  return publiclyVisibleStates[state] === true;
}

/** A122 approves the complete service/sample presentation in the actual local site.
 * Content approval does not certify operational readiness or authorize deployment.
 * The global prelaunch stage and separate legal/search controls remain in force.
 */
export type ConditionalRoute = "radonTesting" | "sewerScope" | "thermalImaging" | "sampleReport";
export type SiteRelease = Readonly<{
  stage: "prelaunch" | "published";
  canonicalOrigin: string | null;
  legalApproved: boolean;
  conditional: Readonly<Record<ConditionalRoute, boolean>>;
  sampleReport: Readonly<{ approved: boolean; interactiveUrl: string | null; pdfUrl: string | null }>;
}>;

export const siteRelease: SiteRelease = {
  stage: "prelaunch",
  canonicalOrigin: "https://rivermarkinspections.com",
  legalApproved: false,
  conditional: { radonTesting: true, sewerScope: true, thermalImaging: true, sampleReport: true },
  sampleReport: { approved: true, interactiveUrl: null, pdfUrl: "/reports/rivermark-residential-sample.pdf" },
};

export function isConditionalRoute(route: string): route is ConditionalRoute {
  return Object.hasOwn(siteRelease.conditional, route);
}

export function safeArtifactUrl(value: string | null): string | undefined {
  if (!value) return undefined;
  // Approved artifacts may be a hosted HTTPS report or a local public PDF.
  if (/^\/reports\/[a-z0-9][a-z0-9/_-]*\.pdf$/i.test(value)) return value;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url.href : undefined;
  } catch { return undefined; }
}

export function conditionalRouteReleased(route: ConditionalRoute, release: SiteRelease = siteRelease): boolean {
  if (!release.conditional[route]) return false;
  return route !== "sampleReport" || (release.sampleReport.approved &&
    Boolean(safeArtifactUrl(release.sampleReport.interactiveUrl) || safeArtifactUrl(release.sampleReport.pdfUrl)));
}

export type ApprovedClaim = Readonly<{ approved: boolean; text: string | null }>;
export const professionalClaims: Readonly<Record<"inspectionCredential" | "builderLicense" | "insurance", ApprovedClaim>> = {
  inspectionCredential: { approved: false, text: null },
  builderLicense: { approved: false, text: null },
  insurance: { approved: false, text: null },
};

export const publicContact: Readonly<{
  email: string;
  phone: { approved: boolean; display: string; href: `tel:${string}` } | null;
}> = { email: "brandon@rivermarkinspections.com", phone: { approved: true, display: "616-308-5359", href: "tel:+16163085359" } };

export type Promotion = Readonly<{
  enabled: boolean; startsOn: string | null; endsOn: string | null;
  residentialIntroPrice: number; residentialStandardPrice: number;
  treatment: string;
}>;
export const promotion: Promotion = {
  enabled: false, startsOn: null, endsOn: null,
  residentialIntroPrice: 400, residentialStandardPrice: 450,
  treatment: "Same full inspection. The introductory rate changes the price, not the inspection scope.",
};

function validDate(value: string | null): value is string {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value);
}

/** Dates belong to an individual article, and are never inferred from a build. */
export function articleDates(
  article: Readonly<{ publishedOn: string | null; updatedOn: string | null }>,
  stage: SiteRelease["stage"] = siteRelease.stage,
  now = new Date(),
): Readonly<{ datePublished: string; dateModified?: string }> | undefined {
  const today = now.toISOString().slice(0, 10);
  if (stage !== "published" || !validDate(article.publishedOn) || article.publishedOn > today) return undefined;
  const updated = article.updatedOn;
  return {
    datePublished: article.publishedOn,
    ...(validDate(updated) && updated > article.publishedOn && updated <= today ? { dateModified: updated } : {}),
  };
}

export function promotionIsActive(now = new Date(), offer: Promotion = promotion): boolean {
  if (!offer.enabled || !validDate(offer.startsOn) || !validDate(offer.endsOn) || offer.startsOn > offer.endsOn) return false;
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Detroit", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  return today >= offer.startsOn && today <= offer.endsOn;
}

export function showIntroductoryPricing(): boolean {
  return promotionIsActive();
}

export function introductoryPriceLabel(label: string): string {
  return promotionIsActive() ? label : `${label} (inactive preview)`;
}

export function promotionExplanation(): string {
  if (promotionIsActive()) return `The approved introductory residential starting price is $${promotion.residentialIntroPrice}, from ${promotion.startsOn} through ${promotion.endsOn}. ${promotion.treatment}`;
  return "Standard pricing applies.";
}

export const legalPublication: Readonly<{
  effectiveOn: string | null; reviewedOn: string | null;
  limitationOfLiability: string | null; indemnity: string | null; governingLaw: string | null;
}> = { effectiveOn: null, reviewedOn: null, limitationOfLiability: null, indemnity: null, governingLaw: null };

export function legalCanBePublished(release: SiteRelease = siteRelease): boolean {
  return release.legalApproved && validDate(legalPublication.effectiveOn) && validDate(legalPublication.reviewedOn) &&
    Boolean(legalPublication.limitationOfLiability?.trim() && legalPublication.governingLaw?.trim());
}
