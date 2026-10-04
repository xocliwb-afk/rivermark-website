import { publicContact } from "@/config/publication";
import Link from "next/link";

import {
  getAvailableNavigationItems,
  primaryNavigationItems,
  servicesNavigationItems,
} from "@/config/site";

import { siteRoutes } from "@/config/routes";
import { HeaderBookingAction } from "./HeaderBookingAction";
import { MobileMenu, type MobileNavigationItem } from "./MobileMenu";
import { ResponsiveLogo } from "./ResponsiveLogo";
import {
  ServicesMenu,
  type PublicServiceNavigationItem,
} from "./ServicesMenu";
import styles from "./SiteHeader.module.css";

function getStatusLabel(
  publication: ReturnType<
    typeof getAvailableNavigationItems<typeof servicesNavigationItems[number]>
  >[number]["publication"],
) {
  return "statusLabel" in publication
    ? publication.statusLabel
    : undefined;
}

export function SiteHeader() {
  const publicPrimaryItems = getAvailableNavigationItems(primaryNavigationItems);
  const publicServiceItems = getAvailableNavigationItems(servicesNavigationItems);

  const serviceItems: PublicServiceNavigationItem[] = publicServiceItems.map(
    (item) => ({
      href: item.href,
      label: item.label,
      statusLabel: getStatusLabel(item.publication),
    }),
  );

  const mobileNavigationItems: MobileNavigationItem[] = publicPrimaryItems.map(
    (item) => ({
      href: item.href,
      kind: item.kind,
      label: item.label,
    }),
  );

  const primaryAction = publicPrimaryItems.find(
    (item) => item.kind === "action",
  );

  return (
    <header className={styles.siteHeader}>
      <div className={styles.headerInner}>
        <div className={styles.logoSlot}>
          <ResponsiveLogo />
        </div>

        <nav aria-label="Primary navigation" className={styles.desktopNav}>
          {publicPrimaryItems.map((item) => {
            if (item.kind === "services-menu") {
              return <ServicesMenu items={serviceItems} key={item.route} />;
            }

            if (item.kind === "action") {
              return (
                <div className={styles.desktopUtilities} key={item.route}>
                  <div className={styles.contactUtilities}>
                  <Link className={styles.contactUtility} href={siteRoutes.contact}>Contact</Link>
                  {publicContact.phone?.approved && <a className={styles.phoneUtility} href={publicContact.phone.href}>Call {publicContact.phone.display}</a>}
                  </div>
                <HeaderBookingAction
                  className={styles.desktopAction}
                  href={item.href}
                >
                  {item.label}
                </HeaderBookingAction>
                </div>
              );
            }

            return (
              <Link
                className={styles.desktopLink}
                href={item.href}
                key={item.route}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.mobileControls}>
          {primaryAction ? (
            <HeaderBookingAction
              ariaLabel="See Price & Availability"
              className={styles.mobilePriceAction}
              href={primaryAction.href}
            >
              Price &amp; Availability
            </HeaderBookingAction>
          ) : null}
          <MobileMenu
            items={mobileNavigationItems}
            serviceItems={serviceItems}
          />
        </div>
      </div>
    </header>
  );
}
