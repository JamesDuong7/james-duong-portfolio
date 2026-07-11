"use client";

import Link from "next/link";
import { flipFolioTo } from "./FolioBook";
import FolioFlip from "./FolioFlip";
import styles from "./TableOfContentsPage.module.css";

export type TocEntry = {
  label: string;
  href?: string;
};

export type TocSection = {
  id: string;
  page: string;
  title: string;
  items: TocEntry[];
};

type TableOfContentsPageProps = {
  sections: TocSection[];
};

export default function TableOfContentsPage({
  sections,
}: TableOfContentsPageProps) {
  return (
    <div className={styles.page}>
      <header className={styles.masthead}>
        <span className={styles.mastPink}>CONTENTS</span>
        <span className={styles.mastMuted}>Vol. 01</span>
      </header>

      <h2 className={styles.title}>In this issue</h2>

      <div className={styles.tableHead} aria-hidden>
        <span>Section</span>
        <span>Page</span>
      </div>

      <div className={styles.table}>
        {sections.map((section) => (
          <div key={section.id} className={styles.group}>
            <button
              type="button"
              className={styles.sectionRow}
              onClick={() => flipFolioTo(section.id)}
              aria-label={`Go to ${section.title}, page ${section.page}`}
            >
              <span className={styles.sectionTitle}>{section.title}</span>
              <span className={styles.leader} aria-hidden />
              <span className={styles.page}>{section.page}</span>
            </button>

            {section.items.map((item) => {
              const content = (
                <>
                  <span className={styles.itemTitle}>{item.label}</span>
                  <span className={styles.leader} aria-hidden />
                  <span className={styles.itemPage}>{section.page}</span>
                </>
              );

              return item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className={styles.itemRow}
                  aria-label={`${item.label}, page ${section.page}`}
                >
                  {content}
                </Link>
              ) : (
                <div key={item.label} className={styles.itemRow}>
                  {content}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <FolioFlip direction="back" label="← Back to cover" />
    </div>
  );
}
