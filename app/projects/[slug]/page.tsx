import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { projects } from "@/lib/data";
import styles from "./Project.module.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Metadata } from "next";

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.id === slug);
  if (!project) return { title: "Project Not Found" };
  
  const url = `https://jamesduong.dev/projects/${slug}`;

  return {
    title: `${project.title} | James Duong`,
    description: project.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${project.title} | James Duong`,
      description: project.description,
      url,
      type: "article",
      siteName: "James Duong Portfolio",
      images: project.screenshots?.[0] ? [
        {
          url: project.screenshots[0].src,
          width: 1200,
          height: 630,
          alt: project.title,
        }
      ] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: project.screenshots?.[0] ? [project.screenshots[0].src] : [],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.id === slug);

  if (!project) {
    notFound();
  }

  // JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.description,
    programmingLanguage: project.tech.join(", "),
    creator: {
      "@type": "Person",
      name: "James Duong",
    },
    url: `https://jamesduong.dev/projects/${slug}`,
    codeRepository: project.github || undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      <main className={styles.page}>
        <Link href="/#projects" className={styles.backBtn} aria-label="Back to projects">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Projects
        </Link>

        <header className={styles.header}>
          <h1 className={styles.title}>{project.title}</h1>
          <p className={styles.description}>{project.description}</p>
          
          <div className={styles.headerMeta}>
            <div className={styles.metaBlock}>
              <h4>Role</h4>
              <p>{project.role}</p>
            </div>
            <div className={styles.metaBlock}>
              <h4>Tech Stack</h4>
              <p>{project.tech.join(", ")}</p>
            </div>
          </div>
        </header>

        {project.screenshots && project.screenshots.length > 0 && (
          <div className={styles.imageGallery}>
            {project.screenshots.map((shot, idx) => (
              <div key={idx} className={styles.imageWrapper}>
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  className={styles.screenshot}
                  priority={idx === 0}
                  sizes="(max-width: 800px) 100vw, 800px"
                />
              </div>
            ))}
          </div>
        )}

        <article className={styles.content}>
          <section className={styles.section}>
            <h2>Overview</h2>
            <p>{project.overview}</p>
          </section>

          <section className={styles.section}>
            <h2>The Problem</h2>
            <p>{project.problem}</p>
          </section>

          <section className={styles.section}>
            <h2>Key Features</h2>
            <ul className={styles.list}>
              {project.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </section>

          {project.implementationDetails && (
            <section className={styles.section}>
              <h2>Implementation Details</h2>
              <p>{project.implementationDetails}</p>
            </section>
          )}

          <section className={styles.section}>
            <h2>Technical Challenges</h2>
            <p>{project.challenges}</p>
          </section>

          <section className={styles.section}>
            <h2>Lessons Learned</h2>
            <p>{project.learning}</p>
          </section>

          <section className={styles.section}>
            <h2>Future Improvements</h2>
            <p>{project.future}</p>
          </section>
        </article>

        <div className={styles.ctas}>
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className={styles.btn}>
              View Source on GitHub
            </a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer" className={styles.btn}>
              Live Demo
            </a>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
