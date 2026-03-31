import Link from "next/link";
import styles from "./Navigation.module.css";
import { personalInfo } from "@/lib/data";

export default function Navigation() {
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
          <a
            href={personalInfo.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.resumeBtn}
            aria-label="View Resume (opens in new tab)"
          >
            Resume
          </a>
        </div>
      </div>
    </nav>
  );
}
