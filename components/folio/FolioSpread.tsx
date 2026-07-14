import type { ReactNode } from "react";
import styles from "./FolioBook.module.css";

type FolioSpreadProps = {
  /** Optional spread-level id; prefer page ids on FolioPage for hash targets. */
  id?: string;
  label: string;
  left: ReactNode;
  right: ReactNode;
};

export default function FolioSpread({ id, label, left, right }: FolioSpreadProps) {
  return (
    <section
      id={id}
      className={styles.spread}
      data-folio-spread
      aria-label={label}
      tabIndex={-1}
    >
      {left}
      {right}
    </section>
  );
}

type FolioPageProps = {
  children: ReactNode;
  tone: "ink" | "paper";
  label?: string;
  /** Stable page id used for TOC jumps and URL hashes. */
  pageId?: string;
};

export function FolioPage({ children, tone, label, pageId }: FolioPageProps) {
  return (
    <article
      id={pageId}
      data-folio-page={pageId || undefined}
      className={`${styles.page} ${tone === "ink" ? styles.pageInk : styles.pagePaper}`}
      aria-label={label}
    >
      {children}
    </article>
  );
}
