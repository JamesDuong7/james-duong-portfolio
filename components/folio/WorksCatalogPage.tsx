"use client";

import FolioFlip from "./FolioFlip";
import { flipFolioTo } from "./FolioBook";
import styles from "./WorksCatalogPage.module.css";

export type WorksCatalogItem = {
  slug: string;
  title: string;
  description: string;
};

type WorksCatalogPageProps = {
  page: string;
  featured: WorksCatalogItem[];
  rest: WorksCatalogItem[];
};

function IndexRow({
  item,
  index,
}: {
  item: WorksCatalogItem;
  index: number;
}) {
  return (
    <li>
      <button
        type="button"
        className={styles.row}
        onClick={() => flipFolioTo(`project-${item.slug}`)}
        aria-label={`Flip to case study for ${item.title}`}
      >
        <span className={styles.number}>
          {String(index).padStart(2, "0")}
        </span>
        <span className={styles.copy}>
          <span className={styles.title}>{item.title}</span>
          {item.description && (
            <span className={styles.blurb}>{item.description}</span>
          )}
        </span>
        <span className={styles.arrow} aria-hidden>
          →
        </span>
      </button>
    </li>
  );
}

export default function WorksCatalogPage({
  page,
  featured,
  rest,
}: WorksCatalogPageProps) {
  return (
    <div className={styles.page} id="works-catalog">
      <header className={styles.masthead}>
        <span className={styles.mastPink}>{page} · WORKS</span>
        <span className={styles.mastMuted}>Catalog</span>
      </header>

      <p className={styles.hint}>
        Click a project to flip to its case study spread inside the book.
      </p>

      <div className={styles.scroll}>
        {featured.length > 0 && (
          <section className={styles.section} aria-label="Featured work">
            <h3 className={styles.sectionLabel}>FEATURED</h3>
            <ul className={styles.list}>
              {featured.map((item, index) => (
                <IndexRow key={item.slug} item={item} index={index + 1} />
              ))}
            </ul>
          </section>
        )}

        {rest.length > 0 && (
          <section className={styles.section} aria-label="All other works">
            <h3 className={styles.sectionLabel}>ALL WORKS</h3>
            <ul className={styles.list}>
              {rest.map((item, index) => (
                <IndexRow key={item.slug} item={item} index={index + 1} />
              ))}
            </ul>
          </section>
        )}

        {featured.length === 0 && rest.length === 0 && (
          <p className={styles.empty}>
            Projects will appear here once published in Sanity.
          </p>
        )}
      </div>

      <FolioFlip direction="forward" label="Flip → Case studies" />
    </div>
  );
}
