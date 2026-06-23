import Link from "next/link";
import styles from "./Navigation.module.css";
import { fetchPersonalInfo } from "@/sanity/lib/fetch";
import MobileNav from "./MobileNav";

export default async function Navigation() {
  const info = await fetchPersonalInfo();
  const resumeUrl = info?.resumeUrl;

  return (
    <nav className={styles.navbar} aria-label="Main Navigation">
      <div className={styles.container}>
        <Link href="/" className={styles.logo} aria-label="Home page">
          JD.
        </Link>
        <div className={styles.links}>
          <Link href="/#about" className={styles.link}>
            About
          </Link>
          <Link href="/#projects" className={styles.link}>
            Projects
          </Link>
          <Link href="/#contact" className={styles.link}>
            Contact
          </Link>
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.resumeBtn}
              aria-label="View Resume (opens in new tab)"
            >
              Resume
            </a>
          )}
        </div>
        <MobileNav resumeUrl={resumeUrl} />
      </div>
    </nav>
  );
}
