import FolioContactForm from "./FolioContactForm";
import styles from "./ContactPage.module.css";

type ContactFormPageProps = {
  email?: string | null;
};

export default function ContactFormPage({ email }: ContactFormPageProps) {
  return (
    <div className={`${styles.page} ${styles.responseCard}`}>
      <div className={styles.perforatedLine} aria-hidden>
        <span>✂</span>
        <span>TEAR ALONG PERFORATION · RESPONSE DISPATCH CARD</span>
      </div>

      <header className={styles.cardHeader}>
        <div className={styles.cardMeta}>
          <span className={styles.cardKicker}>BUSINESS REPLY · VOL. 01</span>
          <h2 className={styles.formTitle}>Send a message</h2>
        </div>
        <div className={styles.postalIndicia} aria-hidden>
          <span className={styles.indiciaTitle}>NO POSTAGE NECESSARY</span>
          <span className={styles.indiciaSub}>IF MAILED IN THE DIGITAL REALM</span>
          <span className={styles.indiciaPermit}>PERMIT NO. 2026 · SAN DIEGO CA</span>
        </div>
      </header>

      <div className={styles.formIntro}>
        {email && (
          <p className={styles.emailAlt}>
            Prefer direct email?
            <a href={`mailto:${email}`} className={styles.emailLink}>
              {email}
            </a>
          </p>
        )}

        <FolioContactForm />
      </div>

      <footer className={styles.cardFooter} aria-hidden>
        <span>FORM REF: FOLIO-2026-DISPATCH</span>
        <span>RETURN POSTAGE GUARANTEED</span>
      </footer>
    </div>
  );
}
