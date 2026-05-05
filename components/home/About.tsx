import styles from "./About.module.css";
import { sanityFetch } from "@/sanity/lib/live";
import { PERSONAL_INFO_QUERY } from "@/sanity/lib/queries";
import { PortableText, PortableTextComponents } from "@portabletext/react";

// Custom components to ensure Portable Text matches your design
const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className={styles.list}>{children}</ul>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
  },
};

export default async function About() {
  const { data: info } = await sanityFetch({ query: PERSONAL_INFO_QUERY });

  const languages = info?.skills?.languages ?? [];
  const frameworks = info?.skills?.frameworks ?? [];
  const tools = info?.skills?.tools ?? [];
  
  const aboutMe = info?.aboutMe ?? [
    {
      _type: 'block',
      children: [{ _type: 'span', text: "I am a senior Computer Science student at San Diego State University, graduating in May 2026. My focus lies in building clean, performant, and accessible software. Whether it's crafting responsive frontend interfaces in React or architecting robust backend APIs in Django or Python, I strive for high-quality engineering." }]
    },
    {
      _type: 'block',
      children: [{ _type: 'span', text: "Currently, I'm working as a Capstone Software Engineer, where I have successfully led the development of an adaptive testing platform, integrating complex role-based access control and optimizing perceived UX performance." }]
    },
    {
      _type: 'block',
      children: [{ _type: 'span', text: "I enjoy transforming ambiguous problems into structural, user-centric solutions. When I'm not coding, I'm participating in AI and App Development clubs, staying up to date with the latest rendering patterns, and refining my system design knowledge." }]
    }
  ];

  return (
    <section id="about" className={styles.section} aria-label="About Me">
      <h2 className={styles.title}>About Me</h2>
      <div className={styles.content}>
        <div className={styles.textBlock}>
          <PortableText value={aboutMe} components={ptComponents} />
        </div>

        <div className={styles.skillsContainer}>
          {languages.length > 0 && (
            <>
              <h3 className={styles.categoryTitle}>Languages</h3>
              <div className={styles.skillCategory}>
                <div className={styles.skillList}>
                  {languages.map((s: string) => (
                    <span key={s} className={styles.skillItem}>{s}</span>
                  ))}
                </div>
              </div>
            </>
          )}

          {frameworks.length > 0 && (
            <>
              <h3 className={styles.categoryTitle}>Frameworks / Libraries</h3>
              <div className={styles.skillCategory}>
                <div className={styles.skillList}>
                  {frameworks.map((s: string) => (
                    <span key={s} className={styles.skillItem}>{s}</span>
                  ))}
                </div>
              </div>
            </>
          )}

          {tools.length > 0 && (
            <>
              <h3 className={styles.categoryTitle}>Tools</h3>
              <div className={styles.skillCategory}>
                <div className={styles.skillList}>
                  {tools.map((s: string) => (
                    <span key={s} className={styles.skillItem}>{s}</span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
