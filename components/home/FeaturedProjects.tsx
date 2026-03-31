import styles from "./FeaturedProjects.module.css";
import ProjectCard from "@/components/ui/ProjectCard";
import { projects } from "@/lib/data";

export default function FeaturedProjects() {
  const featured = projects.filter((p) => p.featured);

  return (
    <section id="projects" className={styles.section} aria-label="Featured Projects">
      <h2 className={styles.title}>Featured Work</h2>
      <div className={styles.grid}>
        {featured.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            title={project.title}
            description={project.description}
            tech={project.tech}
            github={project.github}
            live={project.live}
          />
        ))}
      </div>
    </section>
  );
}
