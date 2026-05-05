import styles from "./Hero.module.css";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { PERSONAL_INFO_QUERY } from "@/sanity/lib/queries";

import { PortableText } from "@portabletext/react";

export default async function Hero() {
  const { data: info } = await sanityFetch({ query: PERSONAL_INFO_QUERY });

  const name = info?.name ?? "James Duong";
  const headline = info?.headline ?? "Computer Science Student & Software Engineer";
  const intro = info?.intro ?? [];
  const resumeUrl = info?.resumeUrl;
  const github = info?.github;
  const linkedin = info?.linkedin;

  return (
    <section className={styles.hero} aria-label="Introduction">
      <div className={styles.container}>
        <p className={styles.greeting}>Hi, I&apos;m</p>
        <h1 className={styles.name}>{name}.</h1>
        <h2 className={styles.headline}>{headline}.</h2>
        <div className={styles.intro}>
          <PortableText value={intro} />
        </div>
        <div className={styles.ctas}>
          <Link href="#projects" className={styles.primaryBtn} aria-label="View Projects">
            View Projects
          </Link>
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryBtn}
              aria-label="View Resume (opens in PDF)"
            >
              Resume
            </a>
          )}
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryBtn}
              aria-label="GitHub Profile"
            >
              GitHub
            </a>
          )}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryBtn}
              aria-label="LinkedIn Profile"
            >
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
