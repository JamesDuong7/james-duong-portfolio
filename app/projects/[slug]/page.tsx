import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./Project.module.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Metadata } from "next";
import { fetchAllProjectSlugs, fetchProjectBySlug } from "@/sanity/lib/fetch";
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

export async function generateStaticParams() {
  const slugs = await fetchAllProjectSlugs();
  return slugs
    .map((p) => p.slug)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  // stega: false keeps invisible characters out of <title> and <meta> tags
  const project = await fetchProjectBySlug(slug, { stega: false });

  if (!project) return { title: "Project Not Found" };

  const url = `https://jamesduong.dev/projects/${slug}`;

  return {
    title: `${project.title} | James Duong`,
    description: project.description ?? "",
    alternates: { canonical: url },
    openGraph: {
      title: `${project.title} | James Duong`,
      description: project.description ?? "",
      url,
      type: "article",
      siteName: "James Duong Portfolio",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title ?? "",
      description: project.description ?? "",
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await fetchProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.description,
    programmingLanguage: (project.tech ?? []).join(", "),
    creator: { "@type": "Person", name: "James Duong" },
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
      <main id="main" className={styles.page}>
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
            {project.role && (
              <div className={styles.metaBlock}>
                <h4>Role</h4>
                <p>{project.role}</p>
              </div>
            )}
            {project.tech && project.tech.length > 0 && (
              <div className={styles.metaBlock}>
                <h4>Tech Stack</h4>
                <div className={styles.techList}>
                  {project.tech.map((t: string) => (
                    <span key={t} className={styles.techBadge}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {project.screenshots && project.screenshots.length > 0 && (
          <div className={styles.imageGallery}>
            {project.screenshots.map((shot: { src?: string | null; alt?: string | null }, idx: number) => (
              shot?.src && (
                <div key={idx} className={styles.imageWrapper}>
                  <Image
                    src={shot.src}
                    alt={shot.alt ?? project.title ?? ""}
                    fill
                    className={styles.screenshot}
                    priority={idx === 0}
                    sizes="(max-width: 800px) 100vw, 800px"
                  />
                </div>
              )
            ))}
          </div>
        )}

        <article className={styles.content}>
          {project.overview && project.overview.length > 0 && (
            <section className={styles.section}>
              <h2>Overview</h2>
              <PortableText value={project.overview} components={ptComponents} />
            </section>
          )}

          {project.problem && project.problem.length > 0 && (
            <section className={styles.section}>
              <h2>The Problem</h2>
              <PortableText value={project.problem} components={ptComponents} />
            </section>
          )}

          {project.features && project.features.length > 0 && (
            <section className={styles.section}>
              <h2>Key Features</h2>
              <ul className={styles.list}>
                {project.features.map((feature: string, idx: number) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </section>
          )}

          {project.implementationDetails && project.implementationDetails.length > 0 && (
            <section className={styles.section}>
              <h2>Implementation Details</h2>
              <PortableText value={project.implementationDetails} components={ptComponents} />
            </section>
          )}

          {project.challenges && project.challenges.length > 0 && (
            <section className={styles.section}>
              <h2>Technical Challenges</h2>
              <PortableText value={project.challenges} components={ptComponents} />
            </section>
          )}

          {project.learning && project.learning.length > 0 && (
            <section className={styles.section}>
              <h2>Lessons Learned</h2>
              <PortableText value={project.learning} components={ptComponents} />
            </section>
          )}

          {project.future && project.future.length > 0 && (
            <section className={styles.section}>
              <h2>Future Improvements</h2>
              <PortableText value={project.future} components={ptComponents} />
            </section>
          )}
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
