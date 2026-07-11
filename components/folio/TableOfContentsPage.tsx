"use client";

import Link from "next/link";
import { flipFolioTo } from "./FolioBook";
import FolioFlip from "./FolioFlip";
import styles from "./TableOfContentsPage.module.css";

export type TocEntry = {
  label: string;
  /** External/route link (e.g. a case study). Takes priority over `target`. */
  href?: string;
  /** Spread id to flip to when there is no `href`. */
  target?: string;
  /** Running page number shown on the right. */
  page?: string;
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
              const itemPage = item.page ?? section.page;
              const content = (
                <>
                  <span className={styles.itemTitle}>{item.label}</span>
                  <span className={styles.leader} aria-hidden />
                  <span className={styles.itemPage}>{itemPage}</span>
                </>
              );

              if (item.href) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={styles.itemRow}
                    aria-label={`${item.label}, page ${itemPage}`}
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={item.label}
                  type="button"
                  className={styles.itemRow}
                  onClick={() => flipFolioTo(item.target ?? section.id)}
                  aria-label={`${item.label}, page ${itemPage}`}
                >
                  {content}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <FolioFlip direction="back" label="← Back to cover" />
    </div>
  );
}
