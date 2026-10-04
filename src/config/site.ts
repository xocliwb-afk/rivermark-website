import {
  isPubliclyVisible,
  siteRelease, isConditionalRoute, conditionalRouteReleased, legalCanBePublished,
  type SiteRelease,
  publicationStates,
} from "./publication";
import {
  siteRoutes,
  type SiteRoute,
  type SiteRouteKey,
} from "./routes";
import { isRouteImplemented } from "./implementation";

export const publicStatusLabels = {
  notCurrentlyScheduling: "Not Currently Scheduling",
} as const;

export type RoutePublication =
  | Readonly<{
      state: typeof publicationStates.active;
    }>
  | Readonly<{
      state: typeof publicationStates.inactive;
      statusLabel: typeof publicStatusLabels.notCurrentlyScheduling;
    }>
  | Readonly<{
      state:
        | typeof publicationStates.conditional
        | typeof publicationStates.hidden;
    }>;

export type SiteRouteDefinition = Readonly<{
  label: string;
  publication: RoutePublication;
}>;

export const siteRouteDefinitions = {
  home: {
    label: "Home",
    publication: { state: publicationStates.active },
  },
  services: {
    label: "Services Overview",
    publication: { state: publicationStates.active },
  },
  residentialHomeInspections: {
    label: "Residential Home Inspections",
    publication: { state: publicationStates.active },
  },
  radonTesting: {
    label: "Radon Testing",
    publication: { state: publicationStates.conditional },
  },
  sewerScope: {
    label: "Sewer Scope",
    publication: { state: publicationStates.conditional },
  },
  otherResidentialServices: {
    label: "Other Residential Services",
    publication: { state: publicationStates.active },
  },
  thermalImaging: {
    label: "Thermal Imaging",
    publication: { state: publicationStates.conditional },
  },
  newConstructionInspections: {
    label: "New Construction Inspections",
    publication: {
      state: publicationStates.inactive,
      statusLabel: publicStatusLabels.notCurrentlyScheduling,
    },
  },
  pricing: {
    label: "Pricing",
    publication: { state: publicationStates.active },
  },
  buyers: {
    label: "For Buyers",
    publication: { state: publicationStates.active },
  },
  agents: {
    label: "For Real-Estate Agents",
    publication: { state: publicationStates.active },
  },
  about: {
    label: "About Rivermark",
    publication: { state: publicationStates.active },
  },
  serviceArea: {
    label: "Service Area",
    publication: { state: publicationStates.active },
  },
  faq: {
    label: "Frequently Asked Questions",
    publication: { state: publicationStates.active },
  },
  contact: {
    label: "Contact",
    publication: { state: publicationStates.active },
  },
  priceAvailability: {
    label: "See Price & Availability",
    publication: { state: publicationStates.active },
  },
  sampleReport: {
    label: "Sample Report",
    publication: { state: publicationStates.conditional },
  },
  resources: {
    label: "Resources",
    publication: { state: publicationStates.active },
  },
  homeInspectionCostResource: {
    label:
      "How Much Does a Home Inspection Cost in Grand Rapids and West Michigan?",
    publication: { state: publicationStates.active },
  },
  homeInspectionExpectationsResource: {
    label: "What to Expect at a Home Inspection",
    publication: { state: publicationStates.active },
  },
  homeInspectionReportResource: {
    label:
      "How to Read a Home Inspection Report Without Treating Every Finding the Same",
    publication: { state: publicationStates.active },
  },
  privacy: {
    label: "Privacy Policy",
    publication: { state: publicationStates.active },
  },
  websiteTerms: {
    label: "Website Terms",
    publication: { state: publicationStates.active },
  },
  accessibility: {
    label: "Accessibility",
    publication: { state: publicationStates.active },
  },
} as const satisfies Record<SiteRouteKey, SiteRouteDefinition>;

export type SiteNavigationItem = Readonly<{
  label: string;
  route: SiteRouteKey;
}>;

export type PrimaryNavigationItem = SiteNavigationItem &
  Readonly<{
    kind: "link" | "services-menu" | "action";
  }>;

export const primaryNavigationItems = [
  { label: "Services", route: "services", kind: "services-menu" },
  { label: "Pricing", route: "pricing", kind: "link" },
  { label: "Buyers", route: "buyers", kind: "link" },
  { label: "Agents", route: "agents", kind: "link" },
  { label: "About", route: "about", kind: "link" },
  {
    label: "See Price & Availability",
    route: "priceAvailability",
    kind: "action",
  },
] as const satisfies readonly PrimaryNavigationItem[];

export const servicesNavigationItems = [
  { label: "Services Overview", route: "services" },
  {
    label: "Residential Home Inspections",
    route: "residentialHomeInspections",
  },
  { label: "Radon Testing", route: "radonTesting" },
  { label: "Sewer Scope", route: "sewerScope" },
  {
    label: "Other Residential Services",
    route: "otherResidentialServices",
  },
  { label: "Thermal Imaging", route: "thermalImaging" },
  {
    label: "New Construction Inspections",
    route: "newConstructionInspections",
  },
] as const satisfies readonly SiteNavigationItem[];

export type FooterNavigationGroup = Readonly<{
  label: "Services" | "Company" | "Support" | "Legal";
  items: readonly SiteNavigationItem[];
}>;

export const footerNavigationGroups = [
  {
    label: "Services",
    items: [
      {
        label: "Residential Home Inspections",
        route: "residentialHomeInspections",
      },
      { label: "Services Overview", route: "services" },
      { label: "Radon Testing", route: "radonTesting" },
      { label: "Sewer Scope", route: "sewerScope" },
      {
        label: "Other Residential Services",
        route: "otherResidentialServices",
      },
      { label: "Thermal Imaging", route: "thermalImaging" },
      {
        label: "New Construction",
        route: "newConstructionInspections",
      },
    ],
  },
  {
    label: "Company",
    items: [
      { label: "Home", route: "home" },
      { label: "Pricing", route: "pricing" },
      { label: "For Buyers", route: "buyers" },
      { label: "For Real-Estate Agents", route: "agents" },
      { label: "About Rivermark", route: "about" },
      { label: "Service Area", route: "serviceArea" },
    ],
  },
  {
    label: "Support",
    items: [
      { label: "FAQ", route: "faq" },
      { label: "Contact", route: "contact" },
      { label: "Sample Report", route: "sampleReport" },
      { label: "Resources", route: "resources" },
    ],
  },
  {
    label: "Legal",
    items: [
      { label: "Privacy Policy", route: "privacy" },
      { label: "Website Terms", route: "websiteTerms" },
      { label: "Accessibility", route: "accessibility" },
    ],
  },
] as const satisfies readonly FooterNavigationGroup[];

export type ResolvedSiteRoute = Readonly<{
  key: SiteRouteKey;
  href: SiteRoute;
  label: string;
  publication: RoutePublication;
}>;

export type ResolvedNavigationItem<
  Item extends SiteNavigationItem = SiteNavigationItem,
> = Item &
  Readonly<{
    href: SiteRoute;
    publication: RoutePublication;
  }>;

const siteRouteEntries = Object.entries(siteRoutes) as readonly Readonly<
  [SiteRouteKey, SiteRoute]
>[];

export function resolveSiteRoute(route: SiteRouteKey): ResolvedSiteRoute {
  const definition = siteRouteDefinitions[route];

  return {
    key: route,
    href: siteRoutes[route],
    label: definition.label,
    publication: definition.publication,
  };
}

export function findSiteRouteByPath(
  pathname: string,
): ResolvedSiteRoute | undefined {
  const entry = siteRouteEntries.find(([, path]) => path === pathname);

  return entry ? resolveSiteRoute(entry[0]) : undefined;
}

export function resolveNavigationItem<Item extends SiteNavigationItem>(
  item: Item,
): ResolvedNavigationItem<Item> {
  return {
    ...item,
    label: item.label,
    href: siteRoutes[item.route],
    publication: siteRouteDefinitions[item.route].publication,
  };
}

export function getAvailableNavigationItems<Item extends SiteNavigationItem>(
  items: readonly Item[],
): ResolvedNavigationItem<Item>[] {
  return items
    .filter((item) =>
      isSiteRouteAvailable(item.route),
    )
    .map(resolveNavigationItem);
}

export function isSiteRoutePubliclyVisible(route: SiteRouteKey, release: SiteRelease = siteRelease): boolean {
  if (isConditionalRoute(route)) return conditionalRouteReleased(route, release);
  if (["privacy", "websiteTerms", "accessibility"].includes(route)) return legalCanBePublished(release);
  return isPubliclyVisible(siteRouteDefinitions[route].publication.state);
}

export function isSiteRouteAvailable(route: SiteRouteKey, release: SiteRelease = siteRelease): boolean {
  if (release.stage === "prelaunch" && (siteRouteDefinitions[route] as SiteRouteDefinition).publication.state !== publicationStates.hidden) return true;
  return isSiteRoutePubliclyVisible(route, release);
}

export function getPublicDevelopmentRoutes(): ResolvedSiteRoute[] {
  return siteRouteEntries
    .map(([key]) => resolveSiteRoute(key))
    .filter(
      (route) =>
        !isRouteImplemented(route.key) &&
        isSiteRoutePubliclyVisible(route.key),
    );
}
