import { ConditionalServicePage } from "@/components/ConditionalServicePage";
import { conditionalPages } from "@/content/conditional-pages";
import { pageMetadata } from "@/config/search";

const content = conditionalPages.radonTesting;
export const metadata = pageMetadata("radonTesting", content.metadata);
export default function Page() { return <ConditionalServicePage content={content} />; }
