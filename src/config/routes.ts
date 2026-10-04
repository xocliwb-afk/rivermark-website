export const siteRoutes = {
  home: "/",
  services: "/services/",
  residentialHomeInspections: "/services/residential-home-inspections/",
  radonTesting: "/services/radon-testing/",
  sewerScope: "/services/sewer-scope/",
  otherResidentialServices: "/services/other-residential-services/",
  thermalImaging: "/services/thermal-imaging/",
  newConstructionInspections: "/services/new-construction-inspections/",
  pricing: "/pricing/",
  buyers: "/buyers/",
  agents: "/agents/",
  about: "/about/",
  serviceArea: "/service-area/",
  faq: "/faq/",
  contact: "/contact/",
  priceAvailability: "/price-availability/",
  sampleReport: "/sample-report/",
  resources: "/resources/",
  homeInspectionCostResource:
    "/resources/home-inspection-cost-grand-rapids/",
  homeInspectionExpectationsResource:
    "/resources/what-to-expect-home-inspection/",
  homeInspectionReportResource:
    "/resources/how-to-read-home-inspection-report/",
  privacy: "/privacy/",
  websiteTerms: "/website-terms/",
  accessibility: "/accessibility/",
} as const satisfies Record<string, `/${string}`>;

export type SiteRouteKey = keyof typeof siteRoutes;
export type SiteRoute = (typeof siteRoutes)[SiteRouteKey];

export type SiteHref = SiteRoute | `${SiteRoute}#${string}`;
