"use client";

import { flipFolioTo } from "./FolioBook";
import FolioFlip from "./FolioFlip";
import styles from "./TableOfContentsPage.module.css";

export type TocSection = {
  id: string;
  number: string;
  title: string;
  items: string[];
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
      <p className={styles.hint}>Jump to a section, or flip the pages in order.</p>

      <ol className={styles.list}>
        {sections.map((section) => (
          <li key={section.id} className={styles.entry}>
            <button
              type="button"
              className={styles.entryButton}
              onClick={() => flipFolioTo(section.id)}
              aria-label={`Go to ${section.title}`}
            >
              <span className={styles.number}>{section.number}</span>
              <span className={styles.entryTitle}>{section.title}</span>
              <span className={styles.leader} aria-hidden />
              <span className={styles.arrow} aria-hidden>
                →
              </span>
            </button>
            {section.items.length > 0 && (
              <ul className={styles.subList}>
                {section.items.map((item) => (
                  <li key={item} className={styles.subItem}>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>

      <FolioFlip direction="back" label="← Back to cover" />
    </div>
  );
}
