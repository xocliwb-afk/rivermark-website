import { pageMetadata } from "@/config/search";
import { PageStructuredData } from "@/components/PageStructuredData";
import { notFound } from "next/navigation";

import { FaqPage } from "@/components/FaqPage";
import { isSiteRoutePubliclyVisible } from "@/config/site";
import { faqPageContent } from "@/content/faq";

export const metadata = pageMetadata("faq", faqPageContent.metadata);

export default function FaqRoute() {
  if (!isSiteRoutePubliclyVisible("faq")) {
    notFound();
  }

  return <><PageStructuredData route="faq" /><FaqPage /></>;
}
