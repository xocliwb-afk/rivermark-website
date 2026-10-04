import type { ReactNode } from "react";

import styles from "./LayoutPrimitives.module.css";

type ContainerProps = Readonly<{
  children: ReactNode;
  className?: string;
  width?: "content" | "reading" | "page";
}>;

export function Container({
  children,
  className,
  width = "content",
}: ContainerProps) {
  const classes = [styles.container, styles[width], className]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}
