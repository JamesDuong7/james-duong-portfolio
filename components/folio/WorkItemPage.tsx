import Link from "next/link";
import { stegaClean } from "@sanity/client/stega";
import FolioFlip from "./FolioFlip";
import styles from "./WorkIndexPage.module.css";

type WorkItemPageProps = {
  page: string;
  slug: string;
  title: string;
  description: string;
  index: number;
  total: number;
  flipForward?: boolean;
  flipBack?: boolean;
};

export default function WorkItemPage({
  page,
  slug,
  title,
  description,
  index,
  total,
  flipForward = true,
  flipBack = false,
}: WorkItemPageProps) {
  const cleanSlug = stegaClean(slug);
  const ordinal = String(index).padStart(2, "0");

  const content = (
    <>
      <span className={styles.number}>{ordinal}</span>
      <span className={styles.copy}>
        <span className={styles.title}>{title}</span>
        <span className={styles.blurb}>{description}</span>
      </span>
      <span className={styles.arrow} aria-hidden>
        →
      </span>
    </>
  );

  return (
    <div className={styles.page}>
      <header className={styles.masthead}>
        <span className={styles.mastPink}>{page} · ALL WORKS</span>
        <span className={styles.mastMuted}>
          {ordinal} / {String(total).padStart(2, "0")}
        </span>
      </header>

      <p className={styles.hint}>Open the case study, or keep flipping.</p>

      <ul className={styles.list}>
        <li>
          {cleanSlug ? (
            <Link
              href={`/projects/${cleanSlug}`}
              className={styles.row}
              aria-label={`Open case study for ${title}`}
            >
              {content}
            </Link>
          ) : (
            <div className={styles.row} aria-disabled>
              {content}
            </div>
          )}
        </li>
      </ul>

      {flipBack && <FolioFlip direction="back" label="← Previous page" />}
      {flipForward && <FolioFlip direction="forward" label="Turn the page →" />}
    </div>
  );
}
