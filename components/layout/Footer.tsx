import AnchorLink from "@/components/ui/AnchorLink";
import styles from "./Footer.module.css";
import { fetchPersonalInfo } from "@/sanity/lib/fetch";

export default async function Footer() {
  const info = await fetchPersonalInfo();
  const currentYear = new Date().getFullYear();

  const name = info?.name ?? "James Duong";
  const github = info?.github;
  const linkedin = info?.linkedin;
  const email = info?.email;

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <h2 className={styles.title}>Let&apos;s Connect</h2>
        <div className={styles.links}>
          <AnchorLink href="/#contact" className={styles.link}>
            Contact
          </AnchorLink>
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              GitHub
            </a>
          )}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              LinkedIn
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} className={styles.link}>
              {email}
            </a>
          )}
        </div>
        <p className={styles.copyright}>
          &copy; {currentYear} {name}. Built with Next.js.
        </p>
      </div>
    </footer>
  );
}
