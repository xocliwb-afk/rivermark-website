import { pageMetadata } from "@/config/search";
import { PageStructuredData } from "@/components/PageStructuredData";
import { notFound } from "next/navigation";

import { ServiceAreaPage } from "@/components/ServiceAreaPage";
import { isSiteRoutePubliclyVisible } from "@/config/site";
import { serviceAreaContent } from "@/content/service-area";

export const metadata = pageMetadata("serviceArea", serviceAreaContent.metadata);

export default function ServiceAreaRoute() {
  if (!isSiteRoutePubliclyVisible("serviceArea")) {
    notFound();
  }

  return <><PageStructuredData route="serviceArea" /><ServiceAreaPage /></>;
}
