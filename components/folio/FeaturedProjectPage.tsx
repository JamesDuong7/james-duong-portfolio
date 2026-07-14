import { stegaClean } from "@sanity/client/stega";
import type { FeaturedProject } from "@/sanity/lib/types";
import { primaryScreenshot } from "@/sanity/lib/types";
import FolioFigure from "./FolioFigure";
import FolioFlip from "./FolioFlip";
import { FolioPrimaryButton, FolioTechTag } from "./FolioControls";
import styles from "./FeaturedListPage.module.css";

type FeaturedProjectPageProps = {
  page: string;
  project: FeaturedProject;
  index: number;
  total: number;
  flipForward?: boolean;
  flipBack?: boolean;
};

export default function FeaturedProjectPage({
  page,
  project,
  index,
  total,
  flipForward = true,
  flipBack = false,
}: FeaturedProjectPageProps) {
  const slug = stegaClean(project.id ?? "");
  const href = slug ? `/projects/${slug}` : undefined;
  const shot = primaryScreenshot(project.screenshots);
  const ordinal = String(index).padStart(2, "0");

  return (
    <div className={styles.page}>
      <header className={styles.masthead}>
        <span className={styles.mastPink}>{page} · FEATURED WORK</span>
        <span className={styles.mastMuted}>
          {ordinal} / {String(total).padStart(2, "0")}
        </span>
      </header>

      <div className={styles.scroll}>
        <article className={styles.entry}>
          <span className={styles.number}>{ordinal}</span>
          <div className={styles.entryBody}>
            <h3 className={styles.title}>{project.title}</h3>
            {project.description && (
              <p className={styles.description}>{project.description}</p>
            )}
            {shot?.url && (
              <FolioFigure
                screenshot={shot}
                caption={`FIG. ${ordinal} — ${project.title}`}
              />
            )}
            {(project.tech?.length ?? 0) > 0 && (
              <div className={styles.tags}>
                {project.tech!.slice(0, 6).map((t) => (
                  <FolioTechTag key={t} label={t} />
                ))}
              </div>
            )}
            {href && (
              <div className={styles.actions}>
                <FolioPrimaryButton
                  href={href}
                  ariaLabel={`Read case study for ${project.title}`}
                >
                  Read Case Study
                </FolioPrimaryButton>
              </div>
            )}
          </div>
        </article>
      </div>

      {flipBack && <FolioFlip direction="back" label="← Previous page" />}
      {flipForward && <FolioFlip direction="forward" label="Turn the page →" />}
    </div>
  );
}
