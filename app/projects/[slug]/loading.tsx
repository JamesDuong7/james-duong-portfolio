import styles from "@/components/folio/FolioCaseStudy.module.css";
import loadingStyles from "./loading.module.css";

function Bone({
  tone,
  className,
}: {
  tone: "ink" | "paper";
  className: string;
}) {
  return (
    <div
      className={`${loadingStyles.bone} ${tone === "ink" ? loadingStyles.ink : loadingStyles.paper} ${className}`}
    />
  );
}

export default function Loading() {
  return (
    <main id="main" aria-busy="true" aria-label="Loading case study">
      <div className={styles.spread}>
        <article className={`${styles.page} ${styles.pageInk}`}>
          <div className={styles.inner}>
            <Bone tone="ink" className={loadingStyles.mast} />
            <Bone tone="ink" className={loadingStyles.title} />
            <Bone tone="ink" className={loadingStyles.desc} />
            <Bone tone="ink" className={loadingStyles.figure} />
            <div className={loadingStyles.metaStack}>
              <Bone tone="ink" className={loadingStyles.metaLabel} />
              <Bone tone="ink" className={loadingStyles.metaValue} />
              <Bone tone="ink" className={loadingStyles.metaLabel} />
              <Bone tone="ink" className={loadingStyles.metaValue} />
            </div>
          </div>
        </article>

        <article className={`${styles.page} ${styles.pagePaper}`}>
          <div className={`${styles.inner} ${styles.innerPaper}`}>
            <div className={loadingStyles.section}>
              <Bone tone="paper" className={loadingStyles.sectionTitle} />
              <Bone tone="paper" className={loadingStyles.sectionBody} />
            </div>
            <div className={loadingStyles.section}>
              <Bone tone="paper" className={loadingStyles.sectionTitle} />
              <Bone tone="paper" className={loadingStyles.sectionBody} />
            </div>
            <div className={loadingStyles.section}>
              <Bone tone="paper" className={loadingStyles.sectionTitle} />
              <Bone tone="paper" className={loadingStyles.sectionBodyShort} />
            </div>
            <Bone tone="paper" className={loadingStyles.button} />
          </div>
        </article>
      </div>
    </main>
  );
}
