import FolioFlip from "./FolioFlip";
import { FolioLinkButton } from "./FolioControls";
import type { Hobby } from "@/sanity/lib/types";
import styles from "./AboutMePage.module.css";

type AboutMePageProps = {
  page: string;
  about: string;
  hobbies: Hobby[];
  languages: string[];
  frameworks: string[];
  tools: string[];
  github?: string | null;
  linkedin?: string | null;
  resumeUrl?: string | null;
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
  hobbies,
  languages,
  frameworks,
  tools,
  github,
  linkedin,
  resumeUrl,
}: AboutMePageProps) {
  const hasSkills =
    languages.length > 0 || frameworks.length > 0 || tools.length > 0;

  return (
    <div className={styles.page} id="about">
      <header className={styles.masthead}>
        <span className={styles.mastPink}>{page} · ABOUT ME</span>
        <span className={styles.mastMuted}>Profile</span>
      </header>

      <div className={styles.scroll}>
        <h2 className={styles.title}>About</h2>
        {about && <p className={styles.copy}>{about}</p>}

        <section className={styles.hobbies} aria-label="Hobbies and activities">
          <h3 className={styles.subhead}>Hobbies &amp; Activities</h3>
          <ul className={styles.hobbyGrid}>
            {hobbies.map((hobby) => (
              <li key={hobby.title ?? ""} className={styles.hobby}>
                <span className={styles.hobbyName}>{hobby.title}</span>
                {hobby.description && (
                  <span className={styles.hobbyNote}>{hobby.description}</span>
                )}
              </li>
            ))}
          </ul>
        </section>

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

      <FolioFlip direction="forward" label="Flip → Featured Work" />
    </div>
  );
}
