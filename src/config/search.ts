import type { Metadata } from "next";

import { implementedRouteKeys } from "./implementation";
import { siteRoutes, type SiteRouteKey } from "./routes";
import { isSiteRoutePubliclyVisible } from "./site";

import { siteRelease, legalCanBePublished, articleDates } from "./publication";
import { resources } from "@/content/resources";
export { siteRelease } from "./publication";

export function approvedOrigin(): string | undefined {
  if (!siteRelease.canonicalOrigin) return undefined;
  const url = new URL(siteRelease.canonicalOrigin);
  if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("The approved canonical must be an HTTPS origin without a path or credentials.");
  }
  return url.origin;
}

export function searchIsEnabled(): boolean {
  return siteRelease.stage === "published" && legalCanBePublished() && Boolean(approvedOrigin());
}

export function routeCanBeIndexed(route: SiteRouteKey): boolean {
  if (!searchIsEnabled() || !isSiteRoutePubliclyVisible(route) || route === "priceAvailability") return false;
  if (route === "resources" && !resources.every(resource => articleDates(resource))) return false;
  if (route.endsWith("Resource") && !resources.some(resource => resource.route === route && articleDates(resource))) return false;
  return true;
}

export function canonicalFor(route: SiteRouteKey): string | undefined {
  const origin = approvedOrigin();
  return origin ? `${origin}${siteRoutes[route]}` : undefined;
}

export function pageMetadata(route: SiteRouteKey, copy: Readonly<{
  title: string;
  description: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
}>): Metadata {
  const canonical = canonicalFor(route);
  const resource = resources.find(resource => resource.route === route);
  const dates = resource ? articleDates(resource) : undefined;
  return {
    title: copy.title,
    description: copy.description,
    alternates: canonical ? { canonical } : undefined,
    robots: { index: routeCanBeIndexed(route), follow: searchIsEnabled() },
    openGraph: {
      title: copy.openGraphTitle ?? copy.title,
      description: copy.openGraphDescription ?? copy.description,
      type: resource ? "article" : "website",
      siteName: "Rivermark Home Inspections",
      locale: "en_US",
      ...(canonical ? { url: canonical } : {}),
      ...(resource && canonicalFor("about") ? { authors: [canonicalFor("about")!] } : {}),
      ...(dates ? { publishedTime: dates.datePublished, ...(dates.dateModified ? { modifiedTime: dates.dateModified } : {}) } : {}),
    },
  };
}

export function indexableRoutes() {
  return implementedRouteKeys.filter(routeCanBeIndexed);
}
