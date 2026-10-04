"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { siteRoutes } from "@/config/routes";
import { PrimaryActionLink } from "./ActionLinks";
import styles from "./StickyBookingAction.module.css";

const footerSelector = "footer";

type StickyBookingActionProps = Readonly<{
  triggerId: string;
  suppressionId: string;
}>;

type VisibilityState = Readonly<{
  pathname: string;
  visible: boolean;
}>;

function normalizePathname(pathname: string) {
  if (pathname === "/") {
    return pathname;
  }

  return pathname.replace(/\/+$/, "");
}

export function StickyBookingAction({
  triggerId,
  suppressionId,
}: StickyBookingActionProps) {
  const pathname = usePathname();
  const [visibility, setVisibility] = useState<VisibilityState>({
    pathname,
    visible: false,
  });
  const suppressedRoute = [siteRoutes.priceAvailability, siteRoutes.contact].some(
    (route) => normalizePathname(pathname) === normalizePathname(route),
  );

  useEffect(() => {
    if (suppressedRoute || !("IntersectionObserver" in window)) return;

    const hero = document.getElementById(triggerId);
    const finalConversion = document.getElementById(suppressionId);
    const footer = document.querySelector<HTMLElement>(footerSelector);
    if (!hero || !finalConversion || !footer) return;

    const collapsedNavigation = window.matchMedia("(max-width: 1023px)");
    const shortViewport = window.matchMedia("(max-height: 550px)");
    const equivalentActions = Array.from(document.querySelectorAll<HTMLAnchorElement>("main a[href]"))
      .filter((link) => !link.closest("[data-rm-sticky-booking-visible]") &&
        normalizePathname(link.pathname) === normalizePathname(siteRoutes.priceAvailability));
    const formRegions = Array.from(document.querySelectorAll("main form"));
    const targets = new Set<Element>([hero, finalConversion, footer, ...equivalentActions, ...formRegions]);
    const intersections = new Map<Element, boolean>();

    function updateVisibility() {
      const focused = document.activeElement;
      const focusedControl = focused instanceof HTMLElement &&
        (focused.matches("input, select, textarea") || Boolean(focused.closest("form")));
      const focusRect = focused instanceof HTMLElement && focused !== document.body
        ? focused.getBoundingClientRect() : null;
      const focusNearBar = Boolean(focusRect && focusRect.bottom > window.innerHeight - 100 &&
        !focused?.closest("[data-rm-sticky-booking-visible]"));
      const visible = collapsedNavigation.matches && !shortViewport.matches &&
        (window.visualViewport?.height ?? window.innerHeight) > 550 &&
        intersections.size === targets.size && ![...intersections.values()].some(Boolean) &&
        !focusedControl && !focusNearBar && !document.querySelector("dialog[open]");
      setVisibility((current) => current.pathname === pathname && current.visible === visible
        ? current : { pathname, visible });
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) intersections.set(entry.target, entry.isIntersecting);
      updateVisibility();
    });
    for (const target of targets) observer.observe(target);
    const handleFocus = () => window.requestAnimationFrame(updateVisibility);
    collapsedNavigation.addEventListener("change", updateVisibility);
    shortViewport.addEventListener("change", updateVisibility);
    window.visualViewport?.addEventListener("resize", updateVisibility);
    document.addEventListener("focusin", handleFocus);
    document.addEventListener("focusout", handleFocus);

    return () => {
      observer.disconnect();
      collapsedNavigation.removeEventListener("change", updateVisibility);
      shortViewport.removeEventListener("change", updateVisibility);
      window.visualViewport?.removeEventListener("resize", updateVisibility);
      document.removeEventListener("focusin", handleFocus);
      document.removeEventListener("focusout", handleFocus);
    };
  }, [suppressedRoute, pathname, suppressionId, triggerId]);

  if (suppressedRoute) return null;

  const isVisible =
    visibility.pathname === pathname && visibility.visible;

  return (
    <aside
      aria-hidden={!isVisible}
      aria-label="Booking action"
      className={`${styles.root} ${isVisible ? styles.visible : ""}`}
      data-rm-sticky-booking-visible={isVisible ? "true" : "false"}
      inert={!isVisible}
    >
      <PrimaryActionLink
        className={styles.action}
        href={siteRoutes.priceAvailability}
        ariaLabel="See Price & Availability"
      >
        See Price &amp; Availability
      </PrimaryActionLink>
    </aside>
  );
}
