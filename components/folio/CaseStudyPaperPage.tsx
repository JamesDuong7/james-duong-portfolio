import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { ProjectDetail } from "@/sanity/lib/types";
import FolioFlip from "./FolioFlip";
import { FolioLinkButton, FolioPrimaryButton } from "./FolioControls";
import styles from "./FolioCaseStudy.module.css";

const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className={styles.featureList}>{children}</ul>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
  },
};

function RichSection({
  title,
  value,
}: {
  title: string;
  value: ProjectDetail["overview"];
}) {
  if (!value?.length) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.sectionBody}>
        <PortableText value={value} components={ptComponents} />
      </div>
    </section>
  );
}

type CaseStudyPaperPageProps = {
  page: string;
  project: ProjectDetail;
  nextTitle?: string | null;
};

export default function CaseStudyPaperPage({
  page,
  project,
  nextTitle,
}: CaseStudyPaperPageProps) {
  return (
    <div className={styles.leaf}>
      <div className={styles.scroll}>
        <div className={`${styles.inner} ${styles.innerPaper}`}>
          <header className={styles.mastheadBar}>
            <span className={styles.mastMuted}>{page} · ARTICLE</span>
          </header>

          <RichSection title="Overview" value={project.overview} />
          <RichSection title="The Problem" value={project.problem} />

          {project.features && project.features.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Key Features</h2>
              <ul className={styles.featureList}>
                {project.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </section>
          )}

          <RichSection title="Lessons Learned" value={project.learning} />
          <RichSection
            title="Implementation"
            value={project.implementationDetails}
          />
          <RichSection title="Challenges" value={project.challenges} />
          <RichSection title="Future" value={project.future} />

          <div className={styles.actions}>
            {project.github && (
              <FolioPrimaryButton
                href={project.github}
                external
                ariaLabel={`View ${project.title} source on GitHub`}
              >
                View Source on GitHub
              </FolioPrimaryButton>
            )}
            {project.live && (
              <FolioLinkButton
                href={project.live}
                arrow="↗"
                ariaLabel="Live demo"
              >
                Live Demo
              </FolioLinkButton>
            )}
          </div>
        </div>
      </div>

      <FolioFlip
        direction="forward"
        label={
          nextTitle ? `Flip page → ${nextTitle}` : "Flip page → Contact"
        }
      />
    </div>
  );
}
