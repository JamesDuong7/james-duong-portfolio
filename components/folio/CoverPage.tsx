import Image from "next/image";
import FolioFlip from "./FolioFlip";
import styles from "./CoverPage.module.css";

export type CoverProject = {
  title: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
};

type CoverPageProps = {
  name: string;
  headline: string;
  location?: string | null;
  issue?: string;
  hasHobbies?: boolean;
  projects?: CoverProject[];
};

export default function CoverPage({
  name,
  headline,
  location,
  issue = "VOL. 01",
  hasHobbies = false,
  projects = [],
}: CoverPageProps) {
  const [firstName = name, ...lastNameParts] = name.trim().split(/\s+/);
  const lastName = lastNameParts.join(" ");

  return (
    <div className={styles.cover}>
      <div className={styles.spine} aria-hidden />
      <div className={styles.printTexture} aria-hidden />

      <header className={styles.masthead}>
        <div className={styles.brandLockup}>
          <span className={styles.brand}>THE FOLIO</span>
          <span className={styles.edition}>Independent software magazine</span>
        </div>
        <div className={styles.issueLockup}>
          <span>{issue}</span>
          <span>2026</span>
        </div>
      </header>

      <div className={styles.coverRule} aria-hidden>
        <span>Design</span>
        <span>Engineering</span>
        <span>Field notes</span>
      </div>

      <div className={styles.hero}>
        <h1 className={styles.nameLockup} aria-label={name}>
          <span>{firstName}</span>
          {lastName && <span>{lastName}</span>}
        </h1>

        <div className={styles.collage} aria-label="Portrait and selected work collage">
          <figure className={styles.portraitCard}>
            <div className={styles.portraitPlaceholder} aria-hidden>
              <span>JD</span>
              <i />
            </div>
            <figcaption>Portrait study · asset pending</figcaption>
          </figure>

          {projects.slice(0, 2).map((project, index) => (
            <figure
              key={`${project.title}-${index}`}
              className={`${styles.projectCard} ${index === 0 ? styles.projectCardPrimary : styles.projectCardSecondary}`}
            >
              <div className={styles.projectMedia}>
                {project.imageUrl ? (
                  <Image
                    src={project.imageUrl}
                    alt={project.imageAlt || `${project.title} project interface`}
                    fill
                    sizes="(max-width: 900px) 58vw, 28vw"
                    className={styles.projectImage}
                    priority
                  />
                ) : (
                  <div className={styles.projectPlaceholder} aria-hidden>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <i>{project.title}</i>
                  </div>
                )}
              </div>
              <figcaption>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {project.title}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Portfolio · Field Notes</p>
          <p className={styles.headline}>{headline}</p>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.coverlines}>
          <span className={styles.coverlineLead}>Inside this issue</span>
          <ol>
            <li>{hasHobbies ? "About, skills & off-hours" : "About & technical practice"}</li>
            <li>Selected systems and product work</li>
            <li>Full project index and contact</li>
          </ol>
        </div>

        <div className={styles.meta}>
          {location && <span className={styles.location}>{location}</span>}
          <span className={styles.price}>ISSUE 001 · OPEN EDITION</span>
          <span className={styles.barcode} aria-hidden />
        </div>
      </footer>

      <FolioFlip direction="forward" label="Open the issue →" target="toc" />
    </div>
  );
}
