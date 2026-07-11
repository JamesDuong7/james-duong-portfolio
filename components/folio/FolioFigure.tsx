import Image from "next/image";
import type { FolioScreenshot } from "@/sanity/lib/types";
import styles from "./FolioFigure.module.css";

type FolioFigureProps = {
  screenshot?: FolioScreenshot | null;
  caption: string;
  /** Case-study hero is an LCP candidate; featured work starts off-spread. */
  priority?: boolean;
  tone?: "paper" | "ink";
  emptyHint?: string;
};

export default function FolioFigure({
  screenshot,
  caption,
  priority = false,
  tone = "paper",
  emptyHint = "FIG. — awaiting print",
}: FolioFigureProps) {
  const url = screenshot?.url ?? null;
  const width = screenshot?.width || 1600;
  const height = screenshot?.height || 900;
  const alt = screenshot?.alt?.trim() || caption;

  return (
    <figure
      className={`${styles.figure} ${tone === "ink" ? styles.ink : styles.paper}`}
    >
      {url ? (
        <Image
          src={url}
          alt={alt}
          width={width}
          height={height}
          className={styles.image}
          sizes="(max-width: 900px) 100vw, 50vw"
          priority={priority}
          fetchPriority={priority ? "high" : "low"}
          placeholder={screenshot?.lqip ? "blur" : "empty"}
          blurDataURL={screenshot?.lqip ?? undefined}
        />
      ) : (
        <div className={styles.empty} aria-hidden>
          <span className={styles.emptyFrame} />
          <span className={styles.emptyHint}>{emptyHint}</span>
        </div>
      )}
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}
