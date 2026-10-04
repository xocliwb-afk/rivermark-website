import { pageMetadata } from "@/config/search";
import { PageStructuredData } from "@/components/PageStructuredData";
import { notFound } from "next/navigation";

import { AboutPage } from "@/components/AboutPage";
import { isSiteRoutePubliclyVisible } from "@/config/site";
import { aboutContent } from "@/content/about";

export const metadata = pageMetadata("about", aboutContent.metadata);

export default function AboutRoute() {
  if (!isSiteRoutePubliclyVisible("about")) {
    notFound();
  }

  return <><PageStructuredData route="about" /><AboutPage /></>;
}
