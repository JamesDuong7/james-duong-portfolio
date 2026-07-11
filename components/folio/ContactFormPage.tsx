import FolioContactForm from "./FolioContactForm";
import styles from "./ContactPage.module.css";

type ContactFormPageProps = {
  email?: string | null;
};

export default function ContactFormPage({ email }: ContactFormPageProps) {
  return (
    <div className={styles.page} id="contact">
      <header className={styles.masthead}>
        <span className={styles.mastPink}>SAY HELLO</span>
        <span className={styles.mastMuted}>The end</span>
      </header>

      <div className={styles.formIntro}>
        <h2 className={styles.formTitle}>Send a message</h2>
        {email && (
          <p className={styles.emailAlt}>
            Prefer email?
            <a href={`mailto:${email}`} className={styles.emailLink}>
              {email}
            </a>
          </p>
        )}

        <FolioContactForm />
      </div>
    </div>
  );
}
