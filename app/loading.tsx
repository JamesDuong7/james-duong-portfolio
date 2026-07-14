import loadingStyles from "@/app/projects/[slug]/loading.module.css";
import styles from "./loading.module.css";

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
    <main id="main" aria-busy="true" aria-label="Loading magazine">
      <div className={styles.book}>
        <section className={styles.spread} aria-hidden>
          <article className={styles.pageInk}>
            <div className={styles.wood} />
          </article>
          <article className={styles.pageInkInner}>
            <Bone tone="ink" className={styles.mast} />
            <Bone tone="ink" className={styles.kicker} />
            <Bone tone="ink" className={styles.title} />
            <Bone tone="ink" className={styles.subtitle} />
            <div className={styles.footer}>
              <Bone tone="ink" className={styles.line} />
              <Bone tone="ink" className={styles.line} />
              <Bone tone="ink" className={styles.lineShort} />
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
