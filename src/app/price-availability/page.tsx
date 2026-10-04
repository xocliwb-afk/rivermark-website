import { pageMetadata } from "@/config/search";
import { PageStructuredData } from "@/components/PageStructuredData";
import { notFound } from "next/navigation";

import { PriceAvailabilityPage } from "@/components/PriceAvailabilityPage";
import { isSiteRoutePubliclyVisible } from "@/config/site";
import { priceAvailabilityContent } from "@/content/price-availability";

// Read transaction configuration at runtime, including in `next start`.
// Mode changes need a server restart/configuration update, not a source rebuild.
export const dynamic = "force-dynamic";

export const metadata = pageMetadata("priceAvailability", priceAvailabilityContent.metadata);

export default function PriceAvailabilityRoute() {
  if (!isSiteRoutePubliclyVisible("priceAvailability")) {
    notFound();
  }

  return <><PageStructuredData route="priceAvailability" /><PriceAvailabilityPage /></>;
}
