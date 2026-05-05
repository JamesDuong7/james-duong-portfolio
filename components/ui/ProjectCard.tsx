import Link from "next/link";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  tech: string[];
  github: string;
  live?: string;
}

export default function ProjectCard({ id, title, description, tech, github, live }: ProjectCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.links}>
          {github && (
            <a href={github} target="_blank" rel="noopener noreferrer" className={styles.iconLink} aria-label={`${title} GitHub Repository`}>
              <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
          )}
          {live && (
            <a href={live} target="_blank" rel="noopener noreferrer" className={styles.iconLink} aria-label={`${title} Live Demo`}>
              <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          )}
        </div>
      </div>
      <p className={styles.description}>{description}</p>
      {tech && tech.length > 0 && (
        <div className={styles.footer}>
          {tech.map((t) => (
            <span key={t} className={styles.techBadge}>
              {t}
            </span>
          ))}
        </div>
      )}
      {id ? (
        <Link href={`/projects/${id}`} className={styles.studyBtn} aria-label={`Read case study for ${title}`}>
          Read Case Study
        </Link>
      ) : (
        <span className={styles.studyBtn} style={{ opacity: 0.5, cursor: 'not-allowed' }}>
          Missing Project Slug
        </span>
      )}
    </div>
  );
}
