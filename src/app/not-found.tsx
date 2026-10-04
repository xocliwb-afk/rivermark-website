import Link from "next/link";
import { EditorialPage } from "@/components/EditorialPage";

export default function NotFound() {
  return <EditorialPage title="Page not found" eyebrow="404" introduction="This page may have moved, may not be available yet, or the address may be incorrect.">
    <p><Link href="/">Return to the homepage</Link>, <Link href="/services/">explore services</Link>, or <Link href="/pricing/">view pricing</Link>.</p>
  </EditorialPage>;
}
