import { stegaClean } from "@sanity/client/stega";
import type { FeaturedProject } from "@/sanity/lib/types";
import { primaryScreenshot } from "@/sanity/lib/types";
import BlurFade from "@/components/magicui/BlurFade";
import Tilt from "@/components/motion-primitives/Tilt";
import FolioFigure from "./FolioFigure";
import FolioFlip from "./FolioFlip";
import { FolioPrimaryButton, FolioTechTag } from "./FolioControls";
import styles from "./FeaturedListPage.module.css";

type FeaturedListPageProps = {
  page: string;
  projects: FeaturedProject[];
};

export default function FeaturedListPage({
  page,
  projects,
}: FeaturedListPageProps) {
  return (
    <div className={styles.page} id="featured">
      <header className={styles.masthead}>
        <span className={styles.mastPink}>{page} · FEATURED WORK</span>
        <span className={styles.mastMuted}>Work</span>
      </header>

      <div className={styles.scroll}>
        {projects.length === 0 ? (
          <p className={styles.empty}>
            Featured work will appear here once projects are published in Sanity.
          </p>
        ) : (
          <ul className={styles.list}>
            {projects.map((project, index) => {
              const slug = stegaClean(project.id ?? "");
              const href = slug ? `/projects/${slug}` : undefined;
              const shot = primaryScreenshot(project.screenshots);
              return (
                <BlurFade
                  key={slug || project.title}
                  as="li"
                  className={styles.entry}
                  delay={0.06 * index}
                  duration={0.5}
                >
                  <span className={styles.number}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className={styles.entryBody}>
                    <h3 className={styles.title}>{project.title}</h3>
                    {project.description && (
                      <p className={styles.description}>{project.description}</p>
                    )}
                    {shot?.url && (
                      <Tilt maxRotation={5} perspective={1000} scale={1.01}>
                        <FolioFigure
                          screenshot={shot}
                          caption={`FIG. ${String(index + 1).padStart(2, "0")} — ${project.title}`}
                        />
                      </Tilt>
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
                </BlurFade>
              );
            })}
          </ul>
        )}
      </div>

      <FolioFlip direction="forward" label="Flip → All Works" />
    </div>
  );
}
