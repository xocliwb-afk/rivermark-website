import { pageMetadata } from "@/config/search";
import { PageStructuredData } from "@/components/PageStructuredData";
import { notFound } from "next/navigation";

import { OtherResidentialServicesPage } from "@/components/OtherResidentialServicesPage";
import { isSiteRoutePubliclyVisible } from "@/config/site";
import { otherResidentialServicesContent } from "@/content/other-residential-services";

export const metadata = pageMetadata("otherResidentialServices", otherResidentialServicesContent.metadata);

export default function OtherResidentialServicesRoute() {
  if (!isSiteRoutePubliclyVisible("otherResidentialServices")) {
    notFound();
  }

  return <><PageStructuredData route="otherResidentialServices" /><OtherResidentialServicesPage /></>;
}
