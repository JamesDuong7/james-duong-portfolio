import Link from "next/link";
import { stegaClean } from "@sanity/client/stega";
import FolioFlip from "./FolioFlip";
import styles from "./WorkIndexPage.module.css";

export type WorkIndexItem = {
  slug: string;
  title: string;
  description: string;
};

type WorkIndexPageProps = {
  projects: WorkIndexItem[];
};

export default function WorkIndexPage({ projects }: WorkIndexPageProps) {
  return (
    <div className={styles.page} id="projects">
      <header className={styles.masthead}>
        <span className={styles.mastPink}>03 · ALL WORKS</span>
        <span className={styles.mastMuted}>Index</span>
      </header>

      <p className={styles.hint}>Click a project to open its case study.</p>

      <ul className={styles.list}>
        {projects.map((project, index) => {
          const slug = stegaClean(project.slug);
          const content = (
            <>
              <span className={styles.number}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className={styles.copy}>
                <span className={styles.title}>{project.title}</span>
                <span className={styles.blurb}>{project.description}</span>
              </span>
              <span className={styles.arrow} aria-hidden>
                →
              </span>
            </>
          );

          return (
            <li key={slug || project.title}>
              {slug ? (
                <Link
                  href={`/projects/${slug}`}
                  className={styles.row}
                  aria-label={`Open case study for ${project.title}`}
                >
                  {content}
                </Link>
              ) : (
                <div className={styles.row} aria-disabled>
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <FolioFlip direction="forward" label="Flip → Contact" />
    </div>
  );
}
