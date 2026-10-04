"use client";

import { useEffect, useState } from "react";

import styles from "./FaqShowAllControl.module.css";

type FaqShowAllControlProps = Readonly<{
  targetId: string;
}>;

export function FaqShowAllControl({ targetId }: FaqShowAllControlProps) {
  const [allOpen, setAllOpen] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    const details = target
      ? Array.from(target.querySelectorAll<HTMLDetailsElement>("details"))
      : [];
    const updateState = () => {
      setAllOpen(
        details.length > 0 && details.every((disclosure) => disclosure.open),
      );
    };

    details.forEach((disclosure) =>
      disclosure.addEventListener("toggle", updateState),
    );

    return () => {
      details.forEach((disclosure) =>
        disclosure.removeEventListener("toggle", updateState),
      );
    };
  }, [targetId]);

  function toggleAll() {
    const target = document.getElementById(targetId);
    const details = target
      ? Array.from(target.querySelectorAll<HTMLDetailsElement>("details"))
      : [];
    const nextOpen = !allOpen;

    details.forEach((disclosure) => {
      disclosure.open = nextOpen;
    });
    setAllOpen(nextOpen);
  }

  return (
    <button
      aria-controls={targetId}
      aria-expanded={allOpen}
      className={styles.control}
      onClick={toggleAll}
      type="button"
    >
      {allOpen ? "Close All Answers" : "Show All Answers"}
    </button>
  );
}
