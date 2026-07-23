import { usableScreenshots, type ProjectDetail } from "@/sanity/lib/types";
import FolioFigure from "./FolioFigure";
import FolioFlip from "./FolioFlip";
import { FolioLinkButton, FolioTechTag } from "./FolioControls";
import styles from "./FolioCaseStudy.module.css";

type CaseStudyInkPageProps = {
  page: string;
  project: ProjectDetail;
};

export default function CaseStudyInkPage({
  page,
  project,
}: CaseStudyInkPageProps) {
  const figures = usableScreenshots(project.screenshots);
  const tech = project.tech ?? [];

  return (
    <div className={styles.leaf}>
      <div className={`${styles.scroll} ${styles.scrollInk}`}>
        <div className={styles.inner}>
          <header className={styles.mastheadBar}>
            <span className={styles.mastPink}>{page} · PROJECT</span>
          </header>

          <h1 className={styles.title}>{project.title}</h1>
          {project.description && (
            <p className={styles.description}>{project.description}</p>
          )}

          {figures.length > 0 && (
            <div className={styles.figures}>
              {figures.map((shot, figIndex) => (
                <FolioFigure
                  key={shot.url}
                  screenshot={shot}
                  caption={`FIG. ${String(figIndex + 1).padStart(2, "0")} — ${project.title}`}
                  priority={figIndex === 0}
                  tone="ink"
                />
              ))}
            </div>
          )}

          <div className={styles.meta}>
            {project.role && (
              <div className={styles.metaBlock}>
                <span className={styles.metaLabel}>ROLE</span>
                <p className={styles.metaValue}>{project.role}</p>
              </div>
            )}

            {tech.length > 0 && (
              <div className={styles.metaBlock}>
                <span className={styles.metaLabel}>STACK</span>
                <div className={styles.tags}>
                  {tech.map((t) => (
                    <FolioTechTag key={t} label={t} onInk />
                  ))}
                </div>
              </div>
            )}

            {(project.github || project.live) && (
              <div className={styles.metaBlock}>
                <span className={styles.metaLabel}>LINKS</span>
                <div className={styles.metaLinks}>
                  {project.github && (
                    <FolioLinkButton
                      href={project.github}
                      onInk
                      ariaLabel={`${project.title} GitHub`}
                    >
                      GitHub
                    </FolioLinkButton>
                  )}
                  {project.live && (
                    <FolioLinkButton
                      href={project.live}
                      onInk
                      ariaLabel={`${project.title} Live Demo`}
                    >
                      Live Demo
                    </FolioLinkButton>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <FolioFlip direction="back" label="← Previous page" />
    </div>
  );
}
