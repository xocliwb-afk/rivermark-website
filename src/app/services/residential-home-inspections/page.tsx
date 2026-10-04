import { pageMetadata } from "@/config/search";
import { PageStructuredData } from "@/components/PageStructuredData";
import { notFound } from "next/navigation";

import { ResidentialInspectionPage } from "@/components/ResidentialInspectionPage";
import { isSiteRoutePubliclyVisible } from "@/config/site";
import { residentialHomeInspectionContent } from "@/content/residential-home-inspections";

export const metadata = pageMetadata("residentialHomeInspections", residentialHomeInspectionContent.metadata);

export default function ResidentialHomeInspectionsRoute() {
  if (!isSiteRoutePubliclyVisible("residentialHomeInspections")) {
    notFound();
  }

  return <><PageStructuredData route="residentialHomeInspections" /><ResidentialInspectionPage /></>;
}
