"use client";

import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

import { PrimaryActionLink } from "./ActionLinks";

/** Keep navigation useful without presenting the current quote page as an action. */
export function HeaderBookingAction(props: ComponentProps<typeof PrimaryActionLink>) {
  const pathname = usePathname();
  if (pathname.replace(/\/+$/, "") === props.href.replace(/\/+$/, "")) {
    return null;
  }
  return <PrimaryActionLink {...props} />;
}
