import { fetchPersonalInfo } from '@/sanity/lib/fetch';
import ContactForm from './ContactForm';
import styles from './Contact.module.css';

export default async function Contact() {
  const info = await fetchPersonalInfo();
  const email = info?.email;

  return (
    <section className={styles.contact} id="contact" aria-label="Contact Section">
      <div className={styles.container}>
        <h2 className={styles.title}>Get in Touch</h2>

        {email && (
          <p className={styles.emailAlt}>
            Prefer email?{' '}
            <a href={`mailto:${email}`} className={styles.emailLink}>
              {email}
            </a>
          </p>
        )}

        <ContactForm />
      </div>
    </section>
  );
}
