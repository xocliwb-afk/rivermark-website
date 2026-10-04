import type { MetadataRoute } from "next";
import { canonicalFor, indexableRoutes } from "@/config/search";

export default function sitemap(): MetadataRoute.Sitemap {
  // No invented last-modified timestamps or unapproved hostnames.
  return indexableRoutes().map((route) => ({ url: canonicalFor(route)! }));
}
