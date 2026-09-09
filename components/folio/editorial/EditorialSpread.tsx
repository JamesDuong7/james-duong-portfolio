import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./EditorialSpread.module.css";

export type EditorialArchetype = "feature" | "index" | "profile" | "article";
export type EditorialCrop = "portrait" | "landscape" | "cinema" | "square";

const archetypeClasses: Record<EditorialArchetype, string> = {
  feature: styles.feature,
  index: styles.index,
  profile: styles.profile,
  article: styles.article,
};

const cropClasses: Record<EditorialCrop, string> = {
  portrait: styles.portrait,
  landscape: styles.landscape,
  cinema: styles.cinema,
  square: styles.square,
};

type EditorialSpreadProps = {
  archetype: EditorialArchetype;
  label: string;
  children: ReactNode;
  className?: string;
};

export function EditorialSpread({
  archetype,
  label,
  children,
  className = "",
}: EditorialSpreadProps) {
  return (
    <section
      className={`${styles.spread} ${archetypeClasses[archetype]} ${className}`}
      aria-label={label}
      data-editorial-archetype={archetype}
    >
      {children}
    </section>
  );
}

type EditorialMastheadProps = {
  section: string;
  page: string;
  note?: string;
  onInk?: boolean;
};

export function EditorialMasthead({
  section,
  page,
  note,
  onInk = false,
}: EditorialMastheadProps) {
  return (
    <header className={`${styles.masthead} ${onInk ? styles.mastheadInk : ""}`}>
      <span>{page}</span>
      <span className={styles.mastSection}>{section}</span>
      {note && <span className={styles.mastNote}>{note}</span>}
    </header>
  );
}

type EditorialMediaFrameProps = {
  src?: string | null;
  alt: string;
  caption: string;
  crop?: EditorialCrop;
  priority?: boolean;
};

export function EditorialMediaFrame({
  src,
  alt,
  caption,
  crop = "landscape",
  priority = false,
}: EditorialMediaFrameProps) {
  return (
    <figure className={styles.figure}>
      <div className={`${styles.media} ${cropClasses[crop]}`}>
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 900px) 100vw, 55vw"
            className={styles.image}
            priority={priority}
          />
        ) : (
          <div className={styles.placeholder} aria-hidden="true">
            <span>MEDIA</span>
            <span>FOR REVIEW</span>
          </div>
        )}
        <span className={styles.cropMarkTop} aria-hidden="true" />
        <span className={styles.cropMarkBottom} aria-hidden="true" />
      </div>
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}

export function EditorialRule({ label }: { label?: string }) {
  return (
    <div className={styles.rule} aria-hidden="true">
      {label && <span>{label}</span>}
    </div>
  );
}

export function EditorialPullQuote({ children }: { children: ReactNode }) {
  return <blockquote className={styles.pullQuote}>{children}</blockquote>;
}

export function EditorialFolio({
  page,
  issue = "VOL. 01",
}: {
  page: string;
  issue?: string;
}) {
  return (
    <footer className={styles.folio}>
      <span>THE FOLIO</span>
      <span>{issue}</span>
      <span>{page}</span>
    </footer>
  );
}

