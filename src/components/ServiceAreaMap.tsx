import { useId } from "react";

import { serviceAreaMapDisplay } from "@/config/service-area-map";
import { TextLink } from "./ActionLinks";
import { FullCompactMap } from "./maps/FullCompactMap";
import { FullWideMap } from "./maps/FullWideMap";
import { HeroCompactMap } from "./maps/HeroCompactMap";
import { HeroWideMap } from "./maps/HeroWideMap";

import styles from "./ServiceAreaMap.module.css";

type ServiceAreaMapProps = Readonly<{
  variant: "hero" | "full";
  idPrefix: string;
}>;

export function ServiceAreaMap({ variant, idPrefix }: ServiceAreaMapProps) {
  // React's server-safe ID also protects repeated instances with the same prefix.
  const instanceId = useId();
  const artworkProps = {
    idPrefix: `${idPrefix}-${variant}-${instanceId}`,
    ...serviceAreaMapDisplay.accessibility[variant],
  };
  const isHero = variant === "hero";

  return (
    <figure
      className={`${styles.figure} ${isHero ? styles.hero : styles.full}`}
      data-service-area-map={variant}
    >
      <div className={styles.artwork}>
        {isHero ? (
          <>
            <HeroWideMap {...artworkProps} className={styles.wide} />
            <HeroCompactMap {...artworkProps} className={styles.compact} />
          </>
        ) : (
          <>
            <FullWideMap {...artworkProps} className={styles.wide} />
            <FullCompactMap {...artworkProps} className={styles.compact} />
          </>
        )}
      </div>
      <figcaption className={styles.caption}>
        <p>
          {isHero
            ? serviceAreaMapDisplay.heroCaption
            : serviceAreaMapDisplay.fullCaption}
        </p>
        {isHero && (
          <TextLink
            className={styles.quietLink}
            href={serviceAreaMapDisplay.heroLink.href}
          >
            {serviceAreaMapDisplay.heroLink.label}
          </TextLink>
        )}
      </figcaption>
    </figure>
  );
}
