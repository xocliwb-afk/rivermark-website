"use client";

import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from "react";

import type { SiteRoute } from "@/config/routes";

import styles from "./SiteHeader.module.css";

export type PublicServiceNavigationItem = Readonly<{
  href: SiteRoute;
  label: string;
  statusLabel?: string;
}>;

type ServicesMenuProps = Readonly<{
  items: readonly PublicServiceNavigationItem[];
}>;

type PendingFocus = "first" | "last" | null;

export function ServicesMenu({ items }: ServicesMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const triggerId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pendingFocusRef = useRef<PendingFocus>(null);

  function getPanelLinks() {
    return Array.from(
      panelRef.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? [],
    );
  }

  useEffect(() => {
    if (!isOpen || !pendingFocusRef.current) {
      return;
    }

    const links = getPanelLinks();
    const nextLink =
      pendingFocusRef.current === "last" ? links.at(-1) : links.at(0);

    pendingFocusRef.current = null;
    nextLink?.focus();
  }, [isOpen]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 64rem)");

    function handleBreakpointChange(event: MediaQueryListEvent) {
      if (!event.matches) {
        pendingFocusRef.current = null;
        setIsOpen(false);
      }
    }

    desktopQuery.addEventListener("change", handleBreakpointChange);

    return () => {
      desktopQuery.removeEventListener("change", handleBreakpointChange);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleOutsidePointer(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        pendingFocusRef.current = null;
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handleOutsidePointer);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointer);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  function handleRootBlur(event: FocusEvent<HTMLDivElement>) {
    if (
      event.relatedTarget instanceof Node &&
      !event.currentTarget.contains(event.relatedTarget)
    ) {
      setIsOpen(false);
    }
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
      return;
    }

    event.preventDefault();
    const pendingFocus = event.key === "ArrowUp" ? "last" : "first";

    if (isOpen) {
      const links = getPanelLinks();
      pendingFocusRef.current = null;
      (pendingFocus === "last" ? links.at(-1) : links.at(0))?.focus();
      return;
    }

    pendingFocusRef.current = pendingFocus;
    setIsOpen(true);
  }

  function handlePanelKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (
      event.key !== "ArrowDown" &&
      event.key !== "ArrowUp" &&
      event.key !== "Home" &&
      event.key !== "End"
    ) {
      return;
    }

    const links = getPanelLinks();
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

  return (
    <div className={styles.servicesRoot} onBlur={handleRootBlur} ref={rootRef}>
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        className={styles.servicesTrigger}
        id={triggerId}
        onClick={() => setIsOpen((current) => !current)}
        onKeyDown={handleTriggerKeyDown}
        ref={triggerRef}
        type="button"
      >
        Services
        <span
          aria-hidden="true"
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
        >
          ▼
        </span>
      </button>

      <div
        aria-labelledby={triggerId}
        className={styles.servicesPanel}
        hidden={!isOpen}
        id={panelId}
        onKeyDown={handlePanelKeyDown}
        ref={panelRef}
      >
        <div className={styles.servicesPanelInner}>
          <ul className={styles.servicesList} role="list">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  className={styles.serviceLink}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                >
                  <span>{item.label}</span>
                  {item.statusLabel ? (
                    <span className={styles.statusLabel}>
                      {item.statusLabel}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
