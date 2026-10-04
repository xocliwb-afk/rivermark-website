"use client";

import Link from "next/link";
import { EditorialPage } from "@/components/EditorialPage";
import styles from "@/components/InquiryForm.module.css";

export default function ErrorPage({ reset }: Readonly<{ reset: () => void }>) {
  return <EditorialPage title="This page could not be loaded" eyebrow="Something went wrong" introduction="Please try again. If the problem continues, return to the homepage.">
    <button className={styles.button} onClick={reset} type="button">Try Again</button>
    <p><Link href="/">Return to the homepage</Link></p>
  </EditorialPage>;
}
