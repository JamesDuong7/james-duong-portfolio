import { MetadataRoute } from "next";
import { fetchAllProjectSlugs } from "@/sanity/lib/fetch";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://jamesduong.dev";

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  const slugs = await fetchAllProjectSlugs();
  const projectRoutes: MetadataRoute.Sitemap = slugs
    .map((row) => row.slug)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({
      url: `${baseUrl}/projects/${slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.8,
    }));

  return [...routes, ...projectRoutes];
}
