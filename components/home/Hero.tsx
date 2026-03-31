import styles from "./Hero.module.css";
import { personalInfo } from "@/lib/data";
import Link from "next/link";

export default function Hero() {
  return (
    <section className={styles.hero} aria-label="Introduction">
      <div className={styles.container}>
        <p className={styles.greeting}>Hi, I&apos;m</p>
        <h1 className={styles.name}>{personalInfo.name}.</h1>
        <h2 className={styles.headline}>{personalInfo.headline}.</h2>
        <p className={styles.intro}>{personalInfo.intro}</p>
        <div className={styles.ctas}>
          <Link href="#projects" className={styles.primaryBtn} aria-label="View Projects">
            View Projects
          </Link>
          <a
            href={personalInfo.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondaryBtn}
            aria-label="View Resume (opens in PDF)"
          >
            Resume
          </a>
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondaryBtn}
            aria-label="GitHub Profile"
          >
            GitHub
          </a>
          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondaryBtn}
            aria-label="LinkedIn Profile"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
