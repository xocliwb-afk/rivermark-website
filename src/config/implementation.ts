import type { SiteRouteKey } from "./routes";

/**
 * Routes with concrete page implementations.
 *
 * This is deliberately separate from publication state: publication controls whether a
 * route may be exposed, while implementation controls whether an exposed route is served
 * by its own page or by the development placeholder catch-all.
 */
export const implementedRouteKeys = [
  "home",
  "radonTesting",
  "sewerScope",
  "thermalImaging",
  "sampleReport",
  "residentialHomeInspections",
  "pricing",
  "buyers",
  "agents",
  "services",
  "otherResidentialServices",
  "about",
  "serviceArea",
  "faq",
  "contact",
  "priceAvailability",
  "newConstructionInspections",
  "resources",
  "homeInspectionCostResource",
  "homeInspectionExpectationsResource",
  "homeInspectionReportResource",
  "privacy",
  "websiteTerms",
  "accessibility",
] as const satisfies readonly SiteRouteKey[];

const implementedRoutes: ReadonlySet<SiteRouteKey> = new Set(
  implementedRouteKeys,
);

export function isRouteImplemented(route: SiteRouteKey): boolean {
  return implementedRoutes.has(route);
}
