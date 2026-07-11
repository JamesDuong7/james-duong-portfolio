import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { ProjectDetail } from "@/sanity/lib/types";
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

type FolioCaseStudyProps = {
  project: ProjectDetail;
  index: number;
  total: number;
  next?: { slug: string; title: string } | null;
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

export default function FolioCaseStudy({
  project,
  index,
  total,
  next,
}: FolioCaseStudyProps) {
  const stack = (project.tech ?? []).join(" · ");

  return (
    <div className={styles.spread} aria-label={`${project.title} case study`}>
      <article className={`${styles.page} ${styles.pageInk}`} aria-label="Case study summary">
        <div className={`${styles.scroll} ${styles.scrollInk}`}>
          <div className={styles.inner}>
            <p className={styles.masthead}>
              CASE STUDY · {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </p>

            <h1 className={styles.title}>{project.title}</h1>
            {project.description && (
              <p className={styles.description}>{project.description}</p>
            )}

            <div className={styles.meta}>
              {project.role && (
                <div className={styles.metaBlock}>
                  <span className={styles.metaLabel}>ROLE</span>
                  <p className={styles.metaValue}>{project.role}</p>
                </div>
              )}

              {stack && (
                <div className={styles.metaBlock}>
                  <span className={styles.metaLabel}>STACK</span>
                  <p className={styles.metaValue}>{stack}</p>
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

        <Link
          href="/#work"
          className={`${styles.flip} ${styles.flipBack}`}
          aria-label="Flip back to work index"
        >
          <span className={`${styles.curl} ${styles.curlBack}`} aria-hidden />
          <span className={styles.flipLabel}>← Flip back · Work</span>
        </Link>
      </article>

      <article className={`${styles.page} ${styles.pagePaper}`} aria-label="Case study article">
        <div className={styles.scroll}>
          <div className={`${styles.inner} ${styles.innerPaper}`}>
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
            <RichSection title="Implementation" value={project.implementationDetails} />
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
                <FolioLinkButton href={project.live} arrow="↗" ariaLabel="Live demo">
                  Live Demo
                </FolioLinkButton>
              )}
            </div>
          </div>
        </div>

        {next?.slug && (
          <Link
            href={`/projects/${next.slug}`}
            className={`${styles.flip} ${styles.flipNext}`}
            aria-label={`Flip to next case study: ${next.title}`}
          >
            <span className={styles.flipLabel}>Flip page → {next.title}</span>
            <span className={styles.curl} aria-hidden />
          </Link>
        )}
      </article>
    </div>
  );
}
