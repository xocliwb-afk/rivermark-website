import { ConditionalServicePage } from "@/components/ConditionalServicePage";
import { conditionalPages } from "@/content/conditional-pages";
import { pageMetadata } from "@/config/search";

const content = conditionalPages.sewerScope;
export const metadata = pageMetadata("sewerScope", content.metadata);
export default function Page() { return <ConditionalServicePage content={content} />; }
