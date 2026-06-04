import styles from "./FeaturedProjects.module.css";
import ProjectCard from "@/components/ui/ProjectCard";
import { fetchFeaturedProjects } from "@/sanity/lib/fetch";

export default async function FeaturedProjects() {
  const projects = await fetchFeaturedProjects();

  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" className={styles.section} aria-label="Featured Projects">
      <h2 className={styles.title}>Featured Work</h2>
      <div className={styles.grid}>
        {projects.map((project, idx) => (
          <ProjectCard
            key={project.id || `fallback-key-${idx}`}
            id={project.id ?? ""}
            title={project.title ?? ""}
            description={project.description ?? ""}
            tech={project.tech ?? []}
            github={project.github ?? ""}
            live={project.live ?? ""}
          />
        ))}
      </div>
    </section>
  );
}
