import { publicContact } from "@/config/publication";
import Link from "next/link";

import {
  footerNavigationGroups,
  getAvailableNavigationItems,
  type SiteNavigationItem,
} from "@/config/site";
import { Container } from "./Container";
import { ResponsiveLogo } from "./ResponsiveLogo";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  const groups = footerNavigationGroups.map((group) => ({
    ...group,
    items: getAvailableNavigationItems<SiteNavigationItem>(group.items),
  }));

  return (
    <footer className={styles.footer} data-rm-surface="dark">
      <Container className={styles.grid}>
        <div className={styles.brand}>
          <ResponsiveLogo placement="footer" />
          <p className={styles.developmentNote}>
            Clear information for informed property decisions.
          </p>
          {publicContact.phone?.approved && <a className={styles.link} href={publicContact.phone.href}>Call {publicContact.phone.display}</a>}
        </div>

        {groups.map((group) => (
          <nav
            aria-labelledby={`footer-${group.label.toLowerCase()}-heading`}
            className={styles.group}
            key={group.label}
          >
            <h2
              className={styles.groupHeading}
              id={`footer-${group.label.toLowerCase()}-heading`}
            >
              {group.label}
            </h2>
            <ul className={styles.linkList} role="list">
              {group.items.map((item) => (
                <li key={item.route}>
                  <Link className={styles.link} href={item.href}>
                    <span>{item.label}</span>
                    {"statusLabel" in item.publication ? (
                      <span className={styles.status}>
                        {item.publication.statusLabel}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>
    </footer>
  );
}
