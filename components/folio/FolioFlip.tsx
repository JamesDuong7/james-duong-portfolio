"use client";

import { flipFolio } from "./FolioBook";
import styles from "./FolioFlip.module.css";

type FolioFlipProps = {
  direction: "forward" | "back";
  label: string;
  to: "work" | "profile";
};

export default function FolioFlip({ direction, label, to }: FolioFlipProps) {
  return (
    <button
      type="button"
      className={`${styles.flip} ${direction === "forward" ? styles.forward : styles.back}`}
      onClick={() => flipFolio(to)}
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
