import Image from "next/image";
import Link from "next/link";

import { siteRoutes } from "@/config/routes";

import styles from "./ResponsiveLogo.module.css";

type ResponsiveLogoProps = Readonly<{
  className?: string;
  placement?: "header" | "footer";
}>;

function classNames(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ResponsiveLogo({
  className,
  placement = "header",
}: ResponsiveLogoProps) {
  const isFooter = placement === "footer";

  return (
    <Link
      aria-label="Rivermark Home Inspections, home"
      className={classNames(
        styles.logoLink,
        isFooter ? styles.footerLogoLink : undefined,
        className,
      )}
      href={siteRoutes.home}
    >
      {isFooter ? (
        <Image
          aria-hidden="true"
          alt=""
          className={styles.footerLogo}
          height={80}
          src="/brand/logo-horizontal-reversed.svg"
          width={360}
        />
      ) : (
        <>
          <Image
            aria-hidden="true"
            alt=""
            className={classNames(styles.headerLogo, styles.desktopLogo)}
            height={80}
            priority
            src="/brand/logo-horizontal.svg"
            width={360}
          />
          <Image
            aria-hidden="true"
            alt=""
            className={classNames(styles.headerLogo, styles.mobileLogo)}
            height={64}
            priority
            src="/brand/logo-compact.svg"
            width={230}
          />
        </>
      )}
    </Link>
  );
}
