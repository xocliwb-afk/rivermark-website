import { pageMetadata } from "@/config/search";
import { PageStructuredData } from "@/components/PageStructuredData";
import { notFound } from "next/navigation";

import { HomePage } from "@/components/HomePage";
import { isSiteRoutePubliclyVisible } from "@/config/site";
import { homepageContent } from "@/content/home";

export const metadata = pageMetadata("home", homepageContent.metadata);

export default function Home() {
  if (!isSiteRoutePubliclyVisible("home")) {
    notFound();
  }

  return <><PageStructuredData route="home" /><HomePage /></>;
}
