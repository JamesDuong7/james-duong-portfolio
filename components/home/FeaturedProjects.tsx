import styles from "./FeaturedProjects.module.css";
import ProjectCard from "@/components/ui/ProjectCard";
import { sanityFetch } from "@/sanity/lib/live";
import { FEATURED_PROJECTS_QUERY } from "@/sanity/lib/queries";

export default async function FeaturedProjects() {
  const { data: projects } = await sanityFetch({ query: FEATURED_PROJECTS_QUERY });

  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" className={styles.section} aria-label="Featured Projects">
      <h2 className={styles.title}>Featured Work</h2>
      <div className={styles.grid}>
        {projects.map((project: NonNullable<typeof projects>[number], idx: number) => (
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
