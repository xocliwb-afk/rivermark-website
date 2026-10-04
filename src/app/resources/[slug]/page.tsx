import { notFound } from "next/navigation";
import { ResourceArticle } from "@/components/ResourceArticle";
import { PageStructuredData } from "@/components/PageStructuredData";
import { pageMetadata } from "@/config/search";
import { isSiteRoutePubliclyVisible } from "@/config/site";
import { resources } from "@/content/resources";

export const dynamicParams = false;
export function generateStaticParams() {
  return resources.filter((resource) => isSiteRoutePubliclyVisible(resource.route)).map(({ slug }) => ({ slug }));
}
type Props = Readonly<{ params: Promise<{ slug: string }> }>;
async function resourceFor({ params }: Props) {
  const { slug } = await params;
  const resource = resources.find((candidate) => candidate.slug === slug);
  if (!resource || !isSiteRoutePubliclyVisible(resource.route)) notFound();
  return resource;
}
export async function generateMetadata(props: Props) {
  const resource = await resourceFor(props);
  return pageMetadata(resource.route, resource.metadata);
}
export default async function ResourcePage(props: Props) {
  const resource = await resourceFor(props);
  return <><PageStructuredData route={resource.route} /><ResourceArticle resource={resource} /></>;
}
