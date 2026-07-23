"use client";

import { flipFolioStep, flipFolioTo } from "./FolioBook";
import styles from "./FolioFlip.module.css";

type FolioFlipProps = {
  /** "forward" flips to the next spread, "back" to the previous one. */
  direction: "forward" | "back";
  label: string;
  /** Flip to a specific page id instead of stepping prev/next. */
  target?: string;
};

export default function FolioFlip({ direction, label, target }: FolioFlipProps) {
  return (
    <button
      type="button"
      className={`${styles.flip} ${direction === "forward" ? styles.forward : styles.back}`}
      onClick={() =>
        target
          ? flipFolioTo(target)
          : flipFolioStep(direction === "forward" ? "next" : "prev")
      }
      aria-label={label}
    >
      {direction === "back" && (
        <span className={`${styles.curl} ${styles.curlBack}`} aria-hidden />
      )}
      <span className={styles.label}>{label}</span>
      {direction === "forward" && <span className={styles.curl} aria-hidden />}
    </button>
  );
}
