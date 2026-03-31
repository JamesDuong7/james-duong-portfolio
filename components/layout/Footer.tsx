import styles from "./Footer.module.css";
import { personalInfo } from "@/lib/data";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <h2 className={styles.title}>Let&apos;s Connect</h2>
        <div className={styles.links}>
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            GitHub
          </a>
          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            LinkedIn
          </a>
          <a href={`mailto:${personalInfo.email}`} className={styles.link}>
            Email
          </a>
        </div>
        <p className={styles.copyright}>
          &copy; {currentYear} {personalInfo.name}. Built with Next.js.
        </p>
      </div>
    </footer>
  );
}
