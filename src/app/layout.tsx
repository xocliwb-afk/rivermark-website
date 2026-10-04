import type { Metadata } from "next";
import { IBM_Plex_Mono, Source_Sans_3 } from "next/font/google";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SkipLink } from "@/components/SkipLink";
import { searchIsEnabled } from "@/config/search";

import "@/styles/globals.css";

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  weight: "variable",
  style: "normal",
  display: "swap",
  variable: "--rm-font-source-sans",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: "normal",
  display: "swap",
  variable: "--rm-font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: "Rivermark Home Inspections | Grand Rapids & West Michigan",
  description: "Independent residential home inspections, clear pricing, and practical guidance for Grand Rapids and West Michigan.",
  robots: {
    index: searchIsEnabled(),
    follow: searchIsEnabled(),
  },
  icons: {
    icon: [
      {
        url: "/brand/favicon.ico",
        sizes: "16x16 32x32",
        type: "image/x-icon",
      },
      { url: "/brand/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/brand/icon-180.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${sourceSans3.variable} ${ibmPlexMono.variable}`}>
        <SkipLink />
        <SiteHeader />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
