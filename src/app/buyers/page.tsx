import { pageMetadata } from "@/config/search";
import { PageStructuredData } from "@/components/PageStructuredData";
import { notFound } from "next/navigation";

import { BuyersPage } from "@/components/BuyersPage";
import { isSiteRoutePubliclyVisible } from "@/config/site";
import { buyersContent } from "@/content/buyers";

export const metadata = pageMetadata("buyers", buyersContent.metadata);

export default function BuyersRoute() {
  if (!isSiteRoutePubliclyVisible("buyers")) {
    notFound();
  }

  return <><PageStructuredData route="buyers" /><BuyersPage /></>;
}
