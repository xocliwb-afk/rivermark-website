import { pageMetadata } from "@/config/search";
import { PageStructuredData } from "@/components/PageStructuredData";
import { notFound } from "next/navigation";

import { PricingPage } from "@/components/PricingPage";
import { isSiteRoutePubliclyVisible } from "@/config/site";
import { pricingContent } from "@/content/pricing";

export const metadata = pageMetadata("pricing", pricingContent.metadata);

export default function PricingRoute() {
  if (!isSiteRoutePubliclyVisible("pricing")) {
    notFound();
  }

  return <><PageStructuredData route="pricing" /><PricingPage /></>;
}
