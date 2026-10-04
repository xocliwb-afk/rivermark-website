import Link from "next/link";
import type { ReactNode } from "react";

import type { SiteHref } from "@/config/routes";

import styles from "./ActionLinks.module.css";

type ActionLinkProps = Readonly<{
  children: ReactNode;
  href: SiteHref;
  className?: string;
  ariaLabel?: string;
}>;

function classes(base: string, className?: string) {
  return [base, className].filter(Boolean).join(" ");
}

export function PrimaryActionLink({
  children,
  href,
  className,
  ariaLabel,
}: ActionLinkProps) {
  return (
    <Link
      aria-label={ariaLabel}
      className={classes(`${styles.action} ${styles.primary}`, className)}
      href={href}
    >
      {children}
    </Link>
  );
}

export function SecondaryActionLink({
  children,
  href,
  className,
  ariaLabel,
}: ActionLinkProps) {
  return (
    <Link
      aria-label={ariaLabel}
      className={classes(`${styles.action} ${styles.secondary}`, className)}
      href={href}
    >
      {children}
    </Link>
  );
}

type TextLinkProps = ActionLinkProps &
  Readonly<{
    inverse?: boolean;
  }>;

export function TextLink({
  children,
  href,
  className,
  ariaLabel,
  inverse = false,
}: TextLinkProps) {
  return (
    <Link
      aria-label={ariaLabel}
      className={classes(
        `${styles.textLink} ${inverse ? styles.inverse : ""}`,
        className,
      )}
      href={href}
    >
      {children}
    </Link>
  );
}
