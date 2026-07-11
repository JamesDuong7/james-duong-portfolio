import { FolioLinkButton } from "./FolioControls";
import styles from "./IdentityPage.module.css";

type IdentityPageProps = {
  name: string;
  headline: string;
  intro: string;
  location?: string | null;
  resumeUrl?: string | null;
};

export default function IdentityPage({
  name,
  headline,
  intro,
  location,
  resumeUrl,
}: IdentityPageProps) {
  return (
    <div className={styles.page}>
      <header className={styles.masthead}>
        <span className={styles.mastPink}>JD. / VOL. 01</span>
        <span className={styles.mastMuted}>01</span>
      </header>

      <div className={styles.heroBlock}>
        <h1 className={styles.name}>{name}</h1>
        <p className={styles.headline}>{headline}</p>
        <hr className={styles.rule} />
      </div>

      <footer className={styles.footer}>
        {intro && <p className={styles.intro}>{intro}</p>}
        <div className={styles.meta}>
          {location && <span className={styles.location}>{location}</span>}
          {resumeUrl && (
            <FolioLinkButton href={resumeUrl} onInk arrow="→" ariaLabel="View Resume">
              Resume
            </FolioLinkButton>
          )}
        </div>
      </footer>
    </div>
  );
}
