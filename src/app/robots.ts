import type { MetadataRoute } from "next";
import { approvedOrigin, searchIsEnabled } from "@/config/search";
import { siteRoutes, type SiteRouteKey } from "@/config/routes";
import { isSiteRoutePubliclyVisible } from "@/config/site";
import { conditionalRouteReleased, safeArtifactUrl, siteRelease } from "@/config/publication";

export default function robots(): MetadataRoute.Robots {
  // No named allow group exists until the actual release gate passes.
  if (!searchIsEnabled()) return { rules: { userAgent: "*", disallow: "/" } };

  const unreleased = (Object.keys(siteRoutes) as SiteRouteKey[])
    .filter(route => !isSiteRoutePubliclyVisible(route)).map(route => siteRoutes[route]);
  // /api/ exists here. Other paths are reserved against future private content;
  // current customer transactions/reports remain on Spectora, with its access controls.
  const disallow = ["/api/", "/admin/", "/customer/", "/portal/", "/reports/", ...unreleased];
  const allow = ["/"];
  const samplePdf = conditionalRouteReleased("sampleReport") ? safeArtifactUrl(siteRelease.sampleReport.pdfUrl) : undefined;
  if (samplePdf?.startsWith("/reports/")) allow.push(`${samplePdf}$`);

  return {
    rules: [
      { userAgent: ["*", "OAI-SearchBot"], allow, disallow },
      { userAgent: "GPTBot", disallow: "/" },
    ],
    sitemap: `${approvedOrigin()}/sitemap.xml`,
  };
}
