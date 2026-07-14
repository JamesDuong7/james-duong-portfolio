import FolioFlip from "./FolioFlip";
import { FolioLinkButton } from "./FolioControls";
import styles from "./AboutMePage.module.css";

type AboutMePageProps = {
  page: string;
  about: string;
  languages: string[];
  frameworks: string[];
  tools: string[];
  github?: string | null;
  linkedin?: string | null;
  resumeUrl?: string | null;
  flipForward?: boolean;
};

function SkillLine({ label, values }: { label: string; values: string[] }) {
  if (values.length === 0) return null;
  return (
    <p className={styles.skillLine}>
      <span className={styles.skillLabel}>{label}</span>
      <span className={styles.skillList}>{values.join(" · ")}</span>
    </p>
  );
}

export default function AboutMePage({
  page,
  about,
  languages,
  frameworks,
  tools,
  github,
  linkedin,
  resumeUrl,
  flipForward = true,
}: AboutMePageProps) {
  const hasSkills =
    languages.length > 0 || frameworks.length > 0 || tools.length > 0;

  return (
    <div className={styles.page}>
      <header className={styles.masthead}>
        <span className={styles.mastPink}>{page} · ABOUT ME</span>
        <span className={styles.mastMuted}>Profile</span>
      </header>

      <div className={styles.scroll}>
        <h2 className={styles.title}>About</h2>
        {about && <p className={styles.copy}>{about}</p>}

        {hasSkills && (
          <section className={styles.skills} aria-label="Skills">
            <h3 className={styles.subhead}>Toolkit</h3>
            <SkillLine label="Languages" values={languages} />
            <SkillLine label="Frameworks" values={frameworks} />
            <SkillLine label="Tools" values={tools} />
          </section>
        )}

        <div className={styles.links}>
          {github && (
            <FolioLinkButton href={github} ariaLabel="GitHub Profile">
              GitHub
            </FolioLinkButton>
          )}
          {linkedin && (
            <FolioLinkButton href={linkedin} ariaLabel="LinkedIn Profile">
              LinkedIn
            </FolioLinkButton>
          )}
          {resumeUrl && (
            <FolioLinkButton href={resumeUrl} arrow="→" ariaLabel="View Resume">
              Resume
            </FolioLinkButton>
          )}
        </div>
      </div>

      {flipForward && (
        <FolioFlip direction="forward" label="Turn the page → Hobbies" />
      )}
    </div>
  );
}
