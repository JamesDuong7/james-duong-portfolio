import styles from "./About.module.css";
import { skills } from "@/lib/data";

export default function About() {
  return (
    <section id="about" className={styles.section} aria-label="About Me">
      <h2 className={styles.title}>About Me</h2>
      <div className={styles.content}>
        <div className={styles.textBlock}>
          <p>
            I am a senior Computer Science student at San Diego State University, graduating in May 2026. 
            My focus lies in building clean, performant, and accessible software. Whether it's crafting 
            responsive frontend interfaces in React or architecting robust backend APIs in Django or Python, 
            I strive for high-quality engineering.
          </p>
          <br />
          <p>
            Currently, I'm working as a Capstone Software Engineer, where I have successfully led the 
            development of an adaptive testing platform, integrating complex role-based access control and 
            optimizing perceived UX performance by 25%.
          </p>
          <br />
          <p>
            I enjoy transforming ambiguous problems into structural, user-centric solutions. When 
            I'm not coding, I'm participating in AI and App Development clubs, staying up to date with 
            the latest rendering patterns, and refining my system design knowledge.
          </p>
        </div>

        <div className={styles.skillsContainer}>
          <h3 className={styles.categoryTitle}>Languages</h3>
          <div className={styles.skillCategory}>
            <div className={styles.skillList}>
              {skills.languages.map((s) => (
                <span key={s} className={styles.skillItem}>{s}</span>
              ))}
            </div>
          </div>

          <h3 className={styles.categoryTitle}>Frameworks / Libraries</h3>
          <div className={styles.skillCategory}>
            <div className={styles.skillList}>
              {skills.frameworks.map((s) => (
                <span key={s} className={styles.skillItem}>{s}</span>
              ))}
            </div>
          </div>

          <h3 className={styles.categoryTitle}>Tools</h3>
          <div className={styles.skillCategory}>
            <div className={styles.skillList}>
              {skills.tools.map((s) => (
                <span key={s} className={styles.skillItem}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
