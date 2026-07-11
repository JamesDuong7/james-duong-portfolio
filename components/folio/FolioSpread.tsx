import type { ReactNode } from "react";
import styles from "./FolioBook.module.css";

type FolioSpreadProps = {
  id: string;
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
};

export function FolioPage({ children, tone, label }: FolioPageProps) {
  return (
    <article
      className={`${styles.page} ${tone === "ink" ? styles.pageInk : styles.pagePaper}`}
      aria-label={label}
    >
      {children}
    </article>
  );
}
