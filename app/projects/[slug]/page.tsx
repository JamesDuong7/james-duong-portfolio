import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import {
  fetchAllProjectSlugs,
  fetchProjectBySlug,
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

  const url = `https://jamesduong.dev/#project-${slug}`;

  return {
    title: `${project.title} | James Duong`,
    description: project.description ?? "",
    alternates: { canonical: `https://jamesduong.dev/projects/${slug}` },
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

/** Legacy case study routes redirect into the in-book spread. */
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await fetchProjectBySlug(slug, { stega: false });

  if (!project) {
    notFound();
  }

  redirect(`/#project-${slug}`);
}
