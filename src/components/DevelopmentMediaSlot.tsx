import {
  developmentMediaBuildMode,
  type DevelopmentMediaSlotConfig,
} from "@/config/media";

import styles from "./DevelopmentMediaSlot.module.css";

type DevelopmentMediaSlotProps = Readonly<{
  slot: DevelopmentMediaSlotConfig;
  className?: string;
}>;

export function DevelopmentMediaSlot({
  slot,
  className,
}: DevelopmentMediaSlotProps) {
  if (developmentMediaBuildMode !== "local-development") return null;

  const classes = [styles.root, styles[slot.composition], className]
    .filter(Boolean)
    .join(" ");
  const showAnnotation =
    developmentMediaBuildMode === "local-development" &&
    slot.state === "development-placeholder";

  return (
    <figure
      className={classes}
      data-development-media={slot.assetKey}
      style={{ aspectRatio: slot.aspectRatio }}
    >
      <div aria-hidden="true" className={styles.composition}>
        <span className={styles.planePrimary} />
        <span className={styles.planeSecondary} />
        <span className={styles.rule} />
      </div>
      {showAnnotation ? (
        <figcaption className={styles.caption}>
          <span className={styles.key}>{slot.assetKey}</span>
          <span className={styles.annotation}>{slot.annotation}</span>
        </figcaption>
      ) : null}
    </figure>
  );
}
