import FolioFlip from "./FolioFlip";
import styles from "./SectionOpenerPage.module.css";

type SectionOpenerPageProps = {
  number: string;
  kicker: string;
  title: string;
  blurb: string;
  meta?: string;
  tone?: "paper" | "ink";
  backLabel?: string;
  forwardLabel?: string;
};

export default function SectionOpenerPage({
  number,
  kicker,
  title,
  blurb,
  meta,
  tone = "paper",
  backLabel,
  forwardLabel,
}: SectionOpenerPageProps) {
  return (
    <div className={`${styles.page} ${tone === "ink" ? styles.ink : ""}`}>
      <header className={styles.masthead}>
        <span className={styles.mastPink}>
          {number} · {kicker}
        </span>
        {meta && <span className={styles.mastMuted}>{meta}</span>}
      </header>

      <div className={styles.body}>
        <span className={styles.bigNumber} aria-hidden>
          {number}
        </span>
        <h2 className={styles.title}>{title}</h2>
        <hr className={styles.rule} />
        <p className={styles.blurb}>{blurb}</p>
      </div>

      {backLabel && <FolioFlip direction="back" label={backLabel} />}
      {forwardLabel && <FolioFlip direction="forward" label={forwardLabel} />}
    </div>
  );
}
