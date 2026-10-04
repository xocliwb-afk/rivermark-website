import { canonicalFor } from "@/config/search";
import { resolveSiteRoute } from "@/config/site";
import type { SiteRouteKey } from "@/config/routes";
import { publicContact } from "@/config/publication";

type SchemaObject = Readonly<Record<string, unknown>>;

export function organizationData(): SchemaObject {
  const home = canonicalFor("home");
  const founder = canonicalFor("about");
  return {
    "@type": "Organization", name: "Rivermark Home Inspections",
    ...(home ? { "@id": `${home}#organization`, url: home, logo: `${home}brand/logo-horizontal.svg` } : {}),
    email: publicContact.email,
    ...(publicContact.phone?.approved ? { telephone: publicContact.phone.href.slice(4) } : {}),
    ...(founder ? { founder: { "@id": `${founder}#brandon-wilcox` } } : {}),
  };
}

export function founderData(): SchemaObject {
  const about = canonicalFor("about");
  const home = canonicalFor("home");
  return {
    "@type": "Person", name: "Brandon Wilcox", jobTitle: "Founder",
    ...(about ? { "@id": `${about}#brandon-wilcox`, url: about } : {}),
    worksFor: {
      "@type": "Organization", name: "Rivermark Home Inspections",
      ...(home ? { "@id": `${home}#organization` } : {}),
    },
  };
}

export function StructuredData({ data }: Readonly<{ data: SchemaObject }>) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{
    __html: JSON.stringify({ "@context": "https://schema.org", ...data }).replace(/</g, "\\u003c"),
  }} />;
}

export function PageStructuredData({ route }: Readonly<{ route: SiteRouteKey }>) {
  const canonical = canonicalFor(route);
  const parent: SiteRouteKey | undefined = route.endsWith("Resource") ? "resources"
    : resolveSiteRoute(route).href.startsWith("/services/") && route !== "services" ? "services" : undefined;
  const crumbs: SiteRouteKey[] = route === "home" ? ["home"] : ["home", ...(parent ? [parent] : []), route];
  return <>
    {(route === "home" || route === "about") && <StructuredData data={organizationData()} />}
    {route === "about" && <StructuredData data={founderData()} />}
    {canonical && route !== "home" && <StructuredData data={{
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((key, index) => ({
        "@type": "ListItem", position: index + 1, name: resolveSiteRoute(key).label, item: canonicalFor(key),
      })),
    }} />}
  </>;
}
