import { pageMetadata } from "@/config/search";
import { PageStructuredData } from "@/components/PageStructuredData";
import { notFound } from "next/navigation";

import { ServicesOverviewPage } from "@/components/ServicesOverviewPage";
import { isSiteRoutePubliclyVisible } from "@/config/site";
import { servicesOverviewContent } from "@/content/services-overview";

export const metadata = pageMetadata("services", servicesOverviewContent.metadata);

export default function ServicesRoute() {
  if (!isSiteRoutePubliclyVisible("services")) {
    notFound();
  }

  return <><PageStructuredData route="services" /><ServicesOverviewPage /></>;
}
