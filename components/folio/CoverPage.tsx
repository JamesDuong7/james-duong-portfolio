import FolioFlip from "./FolioFlip";
import styles from "./CoverPage.module.css";

type CoverPageProps = {
  name: string;
  headline: string;
  location?: string | null;
  issue?: string;
};

export default function CoverPage({
  name,
  headline,
  location,
  issue = "VOL. 01",
}: CoverPageProps) {
  return (
    <div className={styles.cover}>
      <div className={styles.spine} aria-hidden />

      <header className={styles.masthead}>
        <span className={styles.brand}>THE FOLIO</span>
        <span className={styles.issue}>{issue}</span>
      </header>

      <div className={styles.hero}>
        <p className={styles.kicker}>Portfolio · Field Notes</p>
        <h1 className={styles.name}>{name}</h1>
        <p className={styles.headline}>{headline}</p>
      </div>

      <footer className={styles.footer}>
        <ul className={styles.coverlines}>
          <li>About &amp; hobbies</li>
          <li>Featured work</li>
          <li>Full project index</li>
        </ul>
        <div className={styles.meta}>
          {location && <span className={styles.location}>{location}</span>}
          <span className={styles.barcode} aria-hidden />
        </div>
      </footer>

      <FolioFlip direction="forward" label="Open the issue → Contents" />
    </div>
  );
}
