import Link from "next/link";
import AnchorLink from "@/components/ui/AnchorLink";
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
          <AnchorLink href="/#about" className={styles.link}>
            About
          </AnchorLink>
          <AnchorLink href="/#projects" className={styles.link}>
            Projects
          </AnchorLink>
          <AnchorLink href="/#contact" className={styles.link}>
            Contact
          </AnchorLink>
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
