import type { ReactNode } from "react";
import styles from "./FolioBook.module.css";

type FolioSpreadProps = {
  /** Optional spread-level id; prefer page ids on FolioPage for hash targets. */
  id?: string;
  label: string;
  left: ReactNode;
  right: ReactNode;
  /** Optional chrome centered on the spine (e.g. JD. mark). */
  overlay?: ReactNode;
  /** Hide the center gutter shadow (e.g. cover + table is not an open book). */
  hideGutter?: boolean;
};

export default function FolioSpread({
  id,
  label,
  left,
  right,
  overlay,
  hideGutter = false,
}: FolioSpreadProps) {
  return (
    <section
      id={id}
      className={`${styles.spread} ${hideGutter ? styles.spreadNoGutter : ""}`}
      data-folio-spread
      aria-label={label}
      tabIndex={-1}
    >
      {left}
      {right}
      {overlay}
    </section>
  );
}

type FolioPageProps = {
  children: ReactNode;
  tone: "ink" | "paper";
  label?: string;
  /** Stable page id used for TOC jumps and URL hashes. */
  pageId?: string;
  /** Hide this leaf on the mobile vertical stack (e.g. blank filler pages). */
  hideOnNarrow?: boolean;
};

export function FolioPage({
  children,
  tone,
  label,
  pageId,
  hideOnNarrow = false,
}: FolioPageProps) {
  return (
    <article
      id={pageId}
      data-folio-page={pageId || undefined}
      className={`${styles.page} ${tone === "ink" ? styles.pageInk : styles.pagePaper}${hideOnNarrow ? ` ${styles.pageHideNarrow}` : ""}`}
      aria-label={label}
    >
      {children}
    </article>
  );
}
