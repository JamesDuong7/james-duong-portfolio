import { notFound } from "next/navigation";
import { Metadata } from "next";
import { stegaClean } from "@sanity/client/stega";
import FolioCaseStudy from "@/components/folio/FolioCaseStudy";
import {
  fetchAllProjectSlugs,
  fetchProjectBySlug,
  fetchProjectsIndex,
} from "@/sanity/lib/fetch";

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
  const [project, indexItems] = await Promise.all([
    fetchProjectBySlug(slug),
    fetchProjectsIndex(),
  ]);

  if (!project) {
    notFound();
  }

  const cleanedIndex = indexItems
    .map((item) => ({
      slug: item.slug ? stegaClean(item.slug) : "",
      title: item.title ?? "Untitled",
    }))
    .filter((item) => Boolean(item.slug));

  const currentIndex = cleanedIndex.findIndex((item) => item.slug === slug);
  const position = currentIndex >= 0 ? currentIndex + 1 : 1;
  const total = Math.max(cleanedIndex.length, 1);
  const nextItem =
    currentIndex >= 0 && currentIndex < cleanedIndex.length - 1
      ? cleanedIndex[currentIndex + 1]
      : null;

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
      <main id="main">
        <FolioCaseStudy
          project={project}
          index={position}
          total={total}
          next={nextItem}
        />
      </main>
    </>
  );
}
