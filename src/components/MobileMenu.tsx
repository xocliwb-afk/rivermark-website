"use client";

import { publicContact } from "@/config/publication";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { siteRoutes, type SiteRoute } from "@/config/routes";

import { PrimaryActionLink } from "./ActionLinks";
import { ResponsiveLogo } from "./ResponsiveLogo";
import type { PublicServiceNavigationItem } from "./ServicesMenu";
import styles from "./SiteHeader.module.css";

export type MobileNavigationItem = Readonly<{
  href: SiteRoute;
  kind: "link" | "services-menu" | "action";
  label: string;
}>;

type MobileMenuProps = Readonly<{
  items: readonly MobileNavigationItem[];
  serviceItems: readonly PublicServiceNavigationItem[];
}>;

type PendingFocus = "first" | "last" | null;

export function MobileMenu({ items, serviceItems }: MobileMenuProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const dialogId = useId();
  const servicesId = useId();
  const servicesTriggerId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const servicesListRef = useRef<HTMLUListElement>(null);
  const pendingServicesFocusRef = useRef<PendingFocus>(null);
  const priorBodyOverflowRef = useRef<string | null>(null);
  const priorPathnameRef = useRef(pathname);

  const unlockBodyScroll = useCallback(() => {
    if (priorBodyOverflowRef.current === null) {
      return;
    }

    document.body.style.overflow = priorBodyOverflowRef.current;
    priorBodyOverflowRef.current = null;
  }, []);

  const closeMenu = useCallback(
    (restoreFocus: boolean) => {
      const dialog = dialogRef.current;

      if (dialog?.open) {
        dialog.close();
      }

      setIsOpen(false);
      setServicesOpen(false);
      pendingServicesFocusRef.current = null;
      unlockBodyScroll();

      if (restoreFocus) {
        window.requestAnimationFrame(() => triggerRef.current?.focus());
      }
    },
    [unlockBodyScroll],
  );

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 75rem)");

    function handleBreakpointChange(event: MediaQueryListEvent) {
      if (event.matches) {
        closeMenu(false);
      }
    }

    desktopQuery.addEventListener("change", handleBreakpointChange);

    return () => {
      desktopQuery.removeEventListener("change", handleBreakpointChange);
      unlockBodyScroll();
    };
  }, [closeMenu, unlockBodyScroll]);

  useEffect(() => {
    if (pathname === priorPathnameRef.current) {
      return;
    }

    priorPathnameRef.current = pathname;
    closeMenu(false);
  }, [closeMenu, pathname]);

  useEffect(() => {
    if (!servicesOpen || !pendingServicesFocusRef.current) {
      return;
    }

    const links = Array.from(
      servicesListRef.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ??
        [],
    );
    const nextLink =
      pendingServicesFocusRef.current === "last"
        ? links.at(-1)
        : links.at(0);

    pendingServicesFocusRef.current = null;
    nextLink?.focus();
  }, [servicesOpen]);

  function openMenu() {
    const dialog = dialogRef.current;

    if (!dialog || dialog.open) {
      return;
    }

    priorBodyOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setServicesOpen(false);
    dialog.showModal();
    setIsOpen(true);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());
  }

  function handleServicesTriggerKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
  ) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
      return;
    }

    event.preventDefault();
    const pendingFocus = event.key === "ArrowUp" ? "last" : "first";

    if (servicesOpen) {
      const links = Array.from(
        servicesListRef.current?.querySelectorAll<HTMLAnchorElement>(
          "a[href]",
        ) ?? [],
      );
      pendingServicesFocusRef.current = null;
      (pendingFocus === "last" ? links.at(-1) : links.at(0))?.focus();
      return;
    }

    pendingServicesFocusRef.current = pendingFocus;
    setServicesOpen(true);
  }

  function handleServicesKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (
      event.key !== "ArrowDown" &&
      event.key !== "ArrowUp" &&
      event.key !== "Home" &&
      event.key !== "End"
    ) {
      return;
    }

    const links = Array.from(
      servicesListRef.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ??
        [],
    );
    const currentIndex = links.indexOf(
      document.activeElement as HTMLAnchorElement,
    );

    if (currentIndex < 0 || links.length === 0) {
      return;
    }

    event.preventDefault();

    if (event.key === "Home") {
      links[0]?.focus();
      return;
    }

    if (event.key === "End") {
      links.at(-1)?.focus();
      return;
    }

    const direction = event.key === "ArrowDown" ? 1 : -1;
    const nextIndex = (currentIndex + direction + links.length) % links.length;
    links[nextIndex]?.focus();
  }

  function handleDialogKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") {
      return;
    }

    const dialog = dialogRef.current;
    const focusableElements = Array.from(
      dialog?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    ).filter((element) => element.getClientRects().length > 0);
    const firstElement = focusableElements.at(0);
    const lastElement = focusableElements.at(-1);

    if (!firstElement || !lastElement) {
      return;
    }

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  return (
    <>
      <button
        aria-controls={dialogId}
        aria-expanded={isOpen}
        className={styles.mobileMenuButton}
        onClick={openMenu}
        ref={triggerRef}
        type="button"
      >
        <span aria-hidden="true" className={styles.menuIcon}>
          <span className={styles.menuIconLine} />
          <span className={styles.menuIconLine} />
          <span className={styles.menuIconLine} />
        </span>
        <span className={styles.visuallyHidden}>Menu</span>
      </button>

      <dialog
        aria-label="Site navigation"
        aria-modal="true"
        className={styles.mobileDialog}
        id={dialogId}
        onClickCapture={(event) => {
          if (
            event.target instanceof Element &&
            event.target.closest("a[href]")
          ) {
            closeMenu(false);
          }
        }}
        onCancel={(event) => {
          event.preventDefault();
          closeMenu(true);
        }}
        onClose={() => {
          setIsOpen(false);
          unlockBodyScroll();
        }}
        onKeyDown={handleDialogKeyDown}
        ref={dialogRef}
      >
        <div className={styles.mobileDialogHeader}>
          <ResponsiveLogo />
          <button
            className={styles.mobileMenuClose}
            onClick={() => closeMenu(true)}
            ref={closeButtonRef}
            type="button"
          >
            <span aria-hidden="true">×</span>
            <span className={styles.visuallyHidden}>Close menu</span>
          </button>
        </div>

        <nav aria-label="Primary navigation" className={styles.mobileNav}>
          <ul className={styles.mobileNavigationList} role="list">
            <li><Link className={styles.mobileNavLink} href={siteRoutes.home}>Home</Link></li>
            {items.map((item) => {
              if (item.kind === "services-menu") {
                return (
                  <li key={item.href}>
                    <button
                      aria-controls={servicesId}
                      aria-expanded={servicesOpen}
                      className={styles.mobileServicesTrigger}
                      id={servicesTriggerId}
                      onClick={() =>
                        setServicesOpen((current) => !current)
                      }
                      onKeyDown={handleServicesTriggerKeyDown}
                      type="button"
                    >
                      Services
                      <span
                        aria-hidden="true"
                        className={`${styles.chevron} ${servicesOpen ? styles.chevronOpen : ""}`}
                      >
                        ▼
                      </span>
                    </button>
                    <ul
                      aria-labelledby={servicesTriggerId}
                      className={styles.mobileServicesList}
                      hidden={!servicesOpen}
                      id={servicesId}
                      onKeyDown={handleServicesKeyDown}
                      ref={servicesListRef}
                      role="list"
                    >
                      {serviceItems.map((serviceItem) => (
                        <li key={serviceItem.href}>
                          <Link
                            className={`${styles.mobileServiceLink} ${
                              serviceItem.statusLabel
                                ? styles.mobileServiceLinkWithStatus
                                : ""
                            }`}
                            href={serviceItem.href}
                            onClick={() => closeMenu(false)}
                          >
                            <span>{serviceItem.label}</span>
                            {serviceItem.statusLabel ? (
                              <span className={styles.statusLabel}>
                                {serviceItem.statusLabel}
                              </span>
                            ) : null}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }

              if (item.kind === "action") {
                return (
                  <li key={item.href}>
                    <Link className={styles.mobileUtilityLink} href={siteRoutes.contact}>Contact</Link>
                    {publicContact.phone?.approved && <a className={styles.mobileUtilityLink} href={publicContact.phone.href}>Call {publicContact.phone.display}</a>}
                    {pathname.replace(/\/+$/, "") !== item.href.replace(/\/+$/, "") && (
                    <PrimaryActionLink
                      className={styles.mobileDialogAction}
                      href={item.href}
                    >
                      {item.label}
                    </PrimaryActionLink>
                    )}
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <Link
                    className={styles.mobileNavLink}
                    href={item.href}
                    onClick={() => closeMenu(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </dialog>
    </>
  );
}
