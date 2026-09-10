"use client";

import Link from "next/link";
import BlurFade from "@/components/magicui/BlurFade";
import TextRoll from "@/components/motion-primitives/TextRoll";
import { flipFolioTo } from "./FolioBook";
import FolioFlip from "./FolioFlip";
import styles from "./TableOfContentsPage.module.css";

export type TocEntry = {
  label: string;
  href?: string;
  target?: string;
  page?: string;
  featured?: boolean;
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

const sectionNotes: Record<string, string> = {
  contents: "Profile, toolkit and the interests behind the work.",
  works: "Selected systems, product experiments and shipped builds.",
  contact: "Availability, links and a direct line to say hello.",
};

export default function TableOfContentsPage({
  sections,
}: TableOfContentsPageProps) {
  const itemCount = sections.reduce(
    (total, section) => total + section.items.length,
    0,
  );

  return (
    <div className={styles.page}>
      <header className={styles.masthead}>
        <span className={styles.mastPink}>01 · Contents</span>
        <span className={styles.mastMuted}>The Folio / Vol. 01</span>
      </header>

      <div className={styles.titleBlock}>
        <p>Editor&apos;s index</p>
        <h2>
          Inside
          <br />
          the issue.
        </h2>
        <span>
          {String(sections.length).padStart(2, "0")} sections ·{" "}
          {String(itemCount).padStart(2, "0")} stories
        </span>
      </div>

      <nav className={styles.table} aria-label="Magazine contents">
        {sections.map((section, sectionIndex) => (
          <BlurFade
            key={section.id}
            as="section"
            className={styles.group}
            delay={0.08 * sectionIndex}
            duration={0.5}
          >
            <button
                type="button"
                className={styles.sectionRow}
                onClick={() => flipFolioTo(section.id)}
                aria-label={`Go to ${section.title}, page ${section.page}`}
              >
                <span className={styles.sectionOrdinal} aria-hidden>
                  {String(sectionIndex + 1).padStart(2, "0")}
                </span>
                <span className={styles.sectionCopy}>
                  <span className={styles.sectionTitle}>
                    <TextRoll>{section.title}</TextRoll>
                  </span>
                  <span className={styles.sectionNote}>
                    {sectionNotes[section.id] ?? "Open this section."}
                  </span>
                </span>
                <span className={styles.sectionPage}>{section.page}</span>
              </button>

            {section.items.length > 0 && (
              <ol className={styles.itemList}>
                {section.items.map((item) => {
                  const itemPage = item.page ?? section.page;
                  const content = (
                    <>
                      <span className={styles.itemMarker} aria-hidden>
                        {item.featured ? "Feature" : "Story"}
                      </span>
                      <span className={styles.itemTitle}>{item.label}</span>
                      <span className={styles.leader} aria-hidden />
                      <span className={styles.itemPage}>{itemPage}</span>
                    </>
                  );
                  const rowClass = `${styles.itemRow}${
                    item.featured ? ` ${styles.itemFeatured}` : ""
                  }`;

                  return (
                    <li key={`${section.id}-${item.label}`}>
                      {item.target ? (
                        <button
                          type="button"
                          className={rowClass}
                          onClick={() => flipFolioTo(item.target!)}
                          aria-label={`${item.label}, page ${itemPage}`}
                        >
                          {content}
                        </button>
                      ) : item.href ? (
                        <Link
                          href={item.href}
                          className={rowClass}
                          aria-label={`${item.label}, page ${itemPage}`}
                        >
                          {content}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          className={rowClass}
                          onClick={() => flipFolioTo(section.id)}
                          aria-label={`${item.label}, page ${itemPage}`}
                        >
                          {content}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}
          </BlurFade>
        ))}
      </nav>

      <footer className={styles.folio} aria-hidden>
        <span>Start anywhere</span>
        <span>The Folio</span>
        <span>01</span>
      </footer>

      <FolioFlip direction="back" label="← Back to cover" />
    </div>
  );
}
