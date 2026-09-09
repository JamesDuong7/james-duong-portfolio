"use client";

import Image from "next/image";
import FolioFlip from "./FolioFlip";
import { flipFolioTo } from "./FolioBook";
import styles from "./WorksCatalogPage.module.css";

export type WorksCatalogItem = {
  slug: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  tech?: string[];
};

type WorksCatalogPageProps = {
  page: string;
  featured: WorksCatalogItem[];
  rest: WorksCatalogItem[];
  firstProjectTarget?: string;
};

function ProjectVisual({
  item,
  number,
  priority = false,
}: {
  item: WorksCatalogItem;
  number: number;
  priority?: boolean;
}) {
  const ordinal = String(number).padStart(2, "0");

  return (
    <div className={styles.media}>
      {item.imageUrl ? (
        <Image
          src={item.imageUrl}
          alt={item.imageAlt || `${item.title} project interface`}
          fill
          sizes="(max-width: 900px) 100vw, 34vw"
          className={styles.image}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
        />
      ) : (
        <div className={styles.placeholder} aria-hidden>
          <span>{ordinal}</span>
          <strong>{item.title}</strong>
        </div>
      )}
      <span className={styles.cropTop} aria-hidden />
      <span className={styles.cropBottom} aria-hidden />
      <span className={styles.imageNumber} aria-hidden>
        {ordinal}
      </span>
    </div>
  );
}

function ProjectCopy({
  item,
  label,
}: {
  item: WorksCatalogItem;
  label: string;
}) {
  return (
    <div className={styles.copy}>
      <span className={styles.storyType}>{label}</span>
      <h3>{item.title}</h3>
      {item.description && <p>{item.description}</p>}
      {(item.tech?.length ?? 0) > 0 && (
        <span className={styles.stack}>
          {item.tech!.slice(0, 3).join(" · ")}
        </span>
      )}
      <span className={styles.cta} aria-hidden>
        Open case study ↗
      </span>
    </div>
  );
}

function ProjectButton({
  item,
  number,
  variant,
  priority = false,
}: {
  item: WorksCatalogItem;
  number: number;
  variant: "lead" | "support" | "contact";
  priority?: boolean;
}) {
  return (
    <button
      type="button"
      className={`${styles.project} ${styles[variant]}`}
      onClick={() => flipFolioTo(`project-${item.slug}`)}
      aria-label={`Flip to case study for ${item.title}`}
    >
      <ProjectVisual item={item} number={number} priority={priority} />
      <span className={styles.caption} aria-hidden>
        Fig. {String(number).padStart(2, "0")} / Product study
      </span>
      <ProjectCopy
        item={item}
        label={variant === "lead" ? "Lead feature" : variant === "support" ? "Featured" : "Index entry"}
      />
    </button>
  );
}

export default function WorksCatalogPage({
  page,
  featured,
  rest,
  firstProjectTarget,
}: WorksCatalogPageProps) {
  const ordered = [...featured, ...rest];
  const lead = ordered[0];
  const support = featured.length > 0 ? featured.slice(1) : ordered.slice(1, 3);
  const used = new Set([lead?.slug, ...support.map((item) => item.slug)]);
  const secondary = ordered.filter((item) => !used.has(item.slug));

  return (
    <div className={styles.page}>
      <header className={styles.masthead}>
        <span className={styles.mastPink}>{page} · Works</span>
        <span className={styles.mastMuted}>Selected systems / 2026</span>
      </header>

      <div className={styles.titleBlock}>
        <div>
          <p>Image-led project catalog</p>
          <h2>Work,<br />in the field.</h2>
        </div>
        <span>{String(ordered.length).padStart(2, "0")} builds<br />Select any story</span>
      </div>

      <div className={styles.scroll}>
        {lead ? (
          <>
            <section
              className={`${styles.featureLayout}${support.length === 0 ? ` ${styles.leadOnly}` : ""}`}
              aria-label="Featured work"
            >
              <ProjectButton item={lead} number={1} variant="lead" priority />

              {support.length > 0 && (
                <div className={styles.supportRail}>
                  {support.map((item, index) => (
                    <ProjectButton
                      key={item.slug}
                      item={item}
                      number={index + 2}
                      variant="support"
                      priority
                    />
                  ))}
                </div>
              )}
            </section>

            {secondary.length > 0 && (
              <section className={styles.contactSection} aria-label="Project index">
                <div className={styles.sectionRule}>
                  <span>Contact sheet</span>
                  <span>{String(secondary.length).padStart(2, "0")} additional stories</span>
                </div>
                <div className={styles.contactGrid}>
                  {secondary.map((item) => (
                    <ProjectButton
                      key={item.slug}
                      item={item}
                      number={ordered.findIndex((project) => project.slug === item.slug) + 1}
                      variant="contact"
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <div className={styles.empty}>
            <span>Archive pending</span>
            <p>Projects will appear here once published in Sanity.</p>
          </div>
        )}
      </div>

      <footer className={styles.folio} aria-hidden>
        <span>The Folio</span>
        <span>Works catalog</span>
        <span>{page}</span>
      </footer>

      <FolioFlip
        direction="forward"
        label="Flip → Case studies"
        target={firstProjectTarget}
      />
    </div>
  );
}
