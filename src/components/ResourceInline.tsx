import { Fragment } from "react";
import { findSiteRouteByPath, isSiteRoutePubliclyVisible } from "@/config/site";

// Only actual editorial anchors used by the guides; no free-form IDs or query data.
const allowedFragments: Readonly<Record<string, readonly string[]>> = {
  "/services/other-residential-services/": ["other-services-full-heading", "other-services-condominium-heading", "other-services-pre-listing-heading", "other-services-maintenance-heading", "other-services-investment-heading", "other-services-pre-offer-heading", "other-services-investor-consultation-heading", "other-services-follow-up-heading", "other-services-scope-heading"],
  "/services/residential-home-inspections/": ["limitations-heading"],
  "/pricing/": ["manual-review-heading"],
  "/contact/": ["manual-review", "contact-form"],
};

export function resourceLinkHref(destination: string): string | undefined {
  if (!/^\/[a-z0-9/-]*(?:#[a-z][a-z0-9-]*)?$/.test(destination) || destination.includes("//")) {
    throw new Error("Resource links require a canonical internal destination without query data.");
  }
  const [pathname, fragment] = destination.split("#");
  const route = findSiteRouteByPath(pathname);
  if (!route || (fragment && !allowedFragments[pathname]?.includes(fragment))) {
    throw new Error("Unknown resource link destination or fragment.");
  }
  // Local previews must not make unapproved samples or services into editorial links.
  return isSiteRoutePubliclyVisible(route.key) ? destination : undefined;
}

/** Deliberately small inline subset: text and [text](/known-route/), never HTML/MDX. */
export function ResourceInline({ text }: Readonly<{ text: string }>) {
  if (/[<>]|!\[/.test(text)) throw new Error("HTML and embedded media are not supported in resource copy.");
  const parts = text.split(/(\[[^\[\]\n]+\]\([^\s()]+\))/g);
  return parts.map((part, index) => {
    const link = /^\[([^\[\]\n]+)\]\(([^\s()]+)\)$/.exec(part);
    if (!link) {
      if (/[\[\]]/.test(part)) throw new Error("Malformed resource editorial link.");
      return <Fragment key={index}>{part}</Fragment>;
    }
    if (!link[1].trim()) throw new Error("Resource link text must name its destination.");
    const href = resourceLinkHref(link[2]);
    return href ? <a key={index} href={href}>{link[1]}</a> : <Fragment key={index}>{link[1]}</Fragment>;
  });
}
