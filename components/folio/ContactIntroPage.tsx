import FolioFlip from "./FolioFlip";
import { FolioLinkButton } from "./FolioControls";
import styles from "./ContactPage.module.css";

type ContactIntroPageProps = {
  page: string;
  email?: string | null;
  location?: string | null;
  github?: string | null;
  linkedin?: string | null;
  resumeUrl?: string | null;
};

export default function ContactIntroPage({
  page,
  email,
  location,
  github,
  linkedin,
  resumeUrl,
}: ContactIntroPageProps) {
  return (
    <div className={`${styles.page} ${styles.ink}`}>
      <header className={styles.masthead}>
        <span className={styles.mastPink}>{page} · CONTACT</span>
        <span className={styles.mastMuted}>Last page</span>
      </header>

      <div className={styles.introBody}>
        <h2 className={styles.title}>Let&apos;s talk</h2>
        <p className={styles.lead}>
          Have a role, a project, or just want to say hi? Send a note using the
          form — or reach out directly through any of the channels below.
        </p>

        <div className={styles.contactList}>
          {email && (
            <div className={styles.contactRow}>
              <span className={styles.contactLabel}>Email</span>
              <span className={styles.contactValue}>
                <a href={`mailto:${email}`}>{email}</a>
              </span>
            </div>
          )}
          {location && (
            <div className={styles.contactRow}>
              <span className={styles.contactLabel}>Based in</span>
              <span className={styles.contactValue}>{location}</span>
            </div>
          )}
        </div>

        <div className={styles.links}>
          {github && (
            <FolioLinkButton href={github} onInk ariaLabel="GitHub Profile">
              GitHub
            </FolioLinkButton>
          )}
          {linkedin && (
            <FolioLinkButton href={linkedin} onInk ariaLabel="LinkedIn Profile">
              LinkedIn
            </FolioLinkButton>
          )}
          {resumeUrl && (
            <FolioLinkButton
              href={resumeUrl}
              onInk
              arrow="→"
              ariaLabel="View Resume"
            >
              Resume
            </FolioLinkButton>
          )}
        </div>
      </div>

      <FolioFlip direction="back" label="← Back to All Works" />
    </div>
  );
}
