import { pageMetadata } from "@/config/search";
import { PageStructuredData } from "@/components/PageStructuredData";
import { notFound } from "next/navigation";

import { ContactPage } from "@/components/ContactPage";
import { isSiteRoutePubliclyVisible } from "@/config/site";
import { contactContent } from "@/content/contact";

export const metadata = pageMetadata("contact", contactContent.metadata);

export default function ContactRoute() {
  if (!isSiteRoutePubliclyVisible("contact")) {
    notFound();
  }

  return <><PageStructuredData route="contact" /><ContactPage /></>;
}
