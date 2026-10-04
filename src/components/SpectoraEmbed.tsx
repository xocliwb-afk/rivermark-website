"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./PriceAvailabilityPage.module.css";

const embedLoadTimeoutMilliseconds = 12_000;

type EmbedState = "loading" | "loaded" | "failed";

type SpectoraEmbedProps = Readonly<{
  failureStatus: string;
  loadingStatus: string;
  src: string;
  title: string;
}>;

export function SpectoraEmbed({
  failureStatus,
  loadingStatus,
  src,
  title,
}: SpectoraEmbedProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [state, setState] = useState<EmbedState>("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const frame = frameRef.current;
    const markFailed = () => setState("failed");

    frame?.addEventListener("error", markFailed);

    const failureTimer = window.setTimeout(() => {
      setState((current) => (current === "loading" ? "failed" : current));
    }, embedLoadTimeoutMilliseconds);

    return () => {
      frame?.removeEventListener("error", markFailed);
      window.clearTimeout(failureTimer);
    };
  }, [src, attempt]);

  const markLoaded = () => setState("loaded");

  return (
    <div
      className={`${styles.embedFrame} ${state === "failed" ? styles.embedFrameFailed : ""}`}
      data-rm-spectora-embed-state={state}
    >
      {state === "loading" ? (
        <p aria-live="polite" className={styles.embedStatus} role="status">
          {loadingStatus}
        </p>
      ) : null}
      {state === "failed" ? (
        <div>
          <p aria-live="assertive" className={styles.embedFailure} role="alert">
            {failureStatus}
          </p>
          <button
            className={styles.retryAction}
            onClick={() => {
              setState("loading");
              setAttempt((current) => current + 1);
            }}
            type="button"
          >
            Retry loading the quote
          </button>
        </div>
      ) : null}
      {state !== "failed" ? (
        <iframe
          className={styles.embed}
          data-rm-spectora-embed
          key={`${src}-${attempt}`}
          loading="eager"
          onLoad={markLoaded}
          ref={frameRef}
          referrerPolicy="strict-origin-when-cross-origin"
          src={src}
          title={title}
        />
      ) : null}
    </div>
  );
}
