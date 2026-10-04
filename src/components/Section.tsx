import type { ReactNode } from "react";

import styles from "./LayoutPrimitives.module.css";

type SectionProps = Readonly<{
  children: ReactNode;
  className?: string;
  labelledBy?: string;
  surface?: "canvas" | "surface" | "muted";
}>;

export function Section({
  children,
  className,
  labelledBy,
  surface = "canvas",
}: SectionProps) {
  const classes = [styles.section, styles[surface], className]
    .filter(Boolean)
    .join(" ");

  return (
    <section aria-labelledby={labelledBy} className={classes}>
      {children}
    </section>
  );
}
