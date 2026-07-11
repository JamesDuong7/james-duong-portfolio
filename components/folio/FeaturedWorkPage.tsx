import { stegaClean } from "@sanity/client/stega";
import type { FolioScreenshot } from "@/sanity/lib/types";
import FolioFigure from "./FolioFigure";
import FolioFlip from "./FolioFlip";
import { FolioPrimaryButton, FolioTechTag } from "./FolioControls";
import styles from "./FeaturedWorkPage.module.css";

type FeaturedWorkPageProps = {
  title: string;
  description: string;
  tech: string[];
  slug: string;
  index: number;
  total: number;
  screenshot?: FolioScreenshot | null;
  empty?: boolean;
};

export default function FeaturedWorkPage({
  title,
  description,
  tech,
  slug,
  index,
  total,
  screenshot,
  empty = false,
}: FeaturedWorkPageProps) {
  const cleanSlug = stegaClean(slug);
  const href = cleanSlug ? `/projects/${cleanSlug}` : undefined;

  return (
    <div className={styles.page}>
      <header className={styles.masthead}>
        <span className={styles.mastPink}>
          FEATURED · {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <span className={styles.mastMuted}>03</span>
      </header>

      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>

      {screenshot?.url ? (
        <FolioFigure
          screenshot={screenshot}
          caption={`FIG. ${String(index).padStart(2, "0")} — ${title}`}
        />
      ) : null}

      {tech.length > 0 && (
        <div className={styles.tags}>
          {tech.map((t) => (
            <FolioTechTag key={t} label={t} />
          ))}
        </div>
      )}

      <div className={styles.actions}>
        {href ? (
          <FolioPrimaryButton href={href} ariaLabel={`Read case study for ${title}`}>
            Read Case Study
          </FolioPrimaryButton>
        ) : empty ? (
          <FolioPrimaryButton disabled>Coming soon</FolioPrimaryButton>
        ) : (
          <FolioPrimaryButton disabled>Missing Project Slug</FolioPrimaryButton>
        )}
        <span className={styles.hint}>or pick from the index →</span>
      </div>

      <FolioFlip direction="back" label="← Flip back · Profile" to="profile" />
    </div>
  );
}
