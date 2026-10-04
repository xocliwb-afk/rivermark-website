import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "./Container";
import { resolveSiteRoute, isSiteRouteAvailable } from "@/config/site";
import type { SiteRouteKey } from "@/config/routes";
import styles from "./EditorialPage.module.css";

export function EditorialPage({ title, eyebrow, introduction, parent, children }: Readonly<{
  title: string; eyebrow: string; introduction: string;
  parent?: SiteRouteKey; children: ReactNode;
}>) {
  return <>
    <header className={styles.header}><Container width="reading">
      <nav aria-label="Breadcrumb" className={styles.breadcrumbs}><ol>
        <li><Link href="/">Home</Link></li>
        {parent && <li><Link href={resolveSiteRoute(parent).href}>{resolveSiteRoute(parent).label}</Link></li>}
      </ol></nav>
      <p className={styles.eyebrow}>{eyebrow}</p><h1>{title}</h1>
      <p className={styles.lead}>{introduction}</p>
    </Container></header>
    <div className={styles.body}><Container width="reading">{children}</Container></div>
  </>;
}

export function RelatedPages({ routes }: Readonly<{ routes: readonly SiteRouteKey[] }>) {
  return <nav aria-label="Related pages" className={styles.related}>
    <h2>Keep exploring</h2><ul>{routes.filter(route => isSiteRouteAvailable(route)).map((key) => {
      const route = resolveSiteRoute(key);
      return <li key={key}><Link href={route.href}>{route.label}</Link></li>;
    })}</ul>
  </nav>;
}
