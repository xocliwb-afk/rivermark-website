import { pageMetadata } from "@/config/search";
import { PageStructuredData } from "@/components/PageStructuredData";
import { notFound } from "next/navigation";

import { AgentsPage } from "@/components/AgentsPage";
import { isSiteRoutePubliclyVisible } from "@/config/site";
import { agentsContent } from "@/content/agents";

export const metadata = pageMetadata("agents", agentsContent.metadata);

export default function AgentsRoute() {
  if (!isSiteRoutePubliclyVisible("agents")) {
    notFound();
  }

  return <><PageStructuredData route="agents" /><AgentsPage /></>;
}
