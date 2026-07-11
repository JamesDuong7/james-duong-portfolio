import FolioContactForm from "./FolioContactForm";
import FolioFlip from "./FolioFlip";
import { FolioLinkButton } from "./FolioControls";
import styles from "./AboutContactPage.module.css";

type AboutContactPageProps = {
  about: string;
  email?: string | null;
  github?: string | null;
  linkedin?: string | null;
  resumeUrl?: string | null;
  languages: string[];
  frameworks: string[];
  tools: string[];
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

export default function AboutContactPage({
  about,
  email,
  github,
  linkedin,
  resumeUrl,
  languages,
  frameworks,
  tools,
}: AboutContactPageProps) {
  return (
    <div className={styles.page} id="about">
      <header className={styles.masthead}>
        <span className={styles.mastPink}>PROFILE</span>
        <span className={styles.mastMuted}>02</span>
      </header>

      <div className={styles.split}>
        <section className={styles.aboutHalf} aria-label="About">
          <h2 className={styles.title}>About</h2>
          {about && <p className={styles.copy}>{about}</p>}

          <div className={styles.skills}>
            <SkillLine label="Languages" values={languages} />
            <SkillLine label="Frameworks" values={frameworks} />
            <SkillLine label="Tools" values={tools} />
          </div>

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
        </section>

        <div className={styles.divider} aria-hidden>
          <span className={styles.dividerAccent} />
          <hr className={styles.dividerRule} />
        </div>

        <section className={styles.contactHalf} id="contact" aria-label="Contact">
          <h2 className={styles.title}>Say hello</h2>

          {email && (
            <p className={styles.emailAlt}>
              Prefer email?
              <a href={`mailto:${email}`} className={styles.emailLink}>
                {email}
              </a>
            </p>
          )}

          <FolioContactForm />
        </section>
      </div>

      <FolioFlip direction="forward" label="Flip page → Work" to="work" />
    </div>
  );
}
