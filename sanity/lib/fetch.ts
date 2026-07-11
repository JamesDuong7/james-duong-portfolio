import { cache } from "react";
import { sanityFetch } from "./live";
import {
  ALL_PROJECT_SLUGS_QUERY,
  FEATURED_PROJECTS_QUERY,
  PERSONAL_INFO_QUERY,
  PROJECT_BY_SLUG_QUERY,
  PROJECTS_INDEX_QUERY,
} from "./queries";
import type {
  FeaturedProject,
  PersonalInfo,
  ProjectDetail,
  ProjectSlugRow,
} from "./types";

/** Typed wrappers — sanityFetch infers `{}` without Sanity typegen. */

export type ProjectIndexItem = {
  slug: string | null;
  title: string | null;
  description: string | null;
};

export const fetchPersonalInfo = cache(async () => {
  const { data } = await sanityFetch({ query: PERSONAL_INFO_QUERY });
  return (data ?? null) as PersonalInfo | null;
});

export async function fetchFeaturedProjects() {
  const { data } = await sanityFetch({ query: FEATURED_PROJECTS_QUERY });
  if (!Array.isArray(data)) return [];
  return data as FeaturedProject[];
}

export async function fetchAllProjectSlugs() {
  const { data } = await sanityFetch({
    query: ALL_PROJECT_SLUGS_QUERY,
    perspective: "published",
    stega: false,
  });
  if (!Array.isArray(data)) return [];
  return data as ProjectSlugRow[];
}

export async function fetchProjectsIndex() {
  const { data } = await sanityFetch({ query: PROJECTS_INDEX_QUERY });
  if (!Array.isArray(data)) return [];
  return data as ProjectIndexItem[];
}

export async function fetchProjectBySlug(
  slug: string,
  options?: { stega?: boolean },
) {
  const { data } = await sanityFetch({
    query: PROJECT_BY_SLUG_QUERY,
    params: { slug },
    ...options,
  });
  return (data ?? null) as ProjectDetail | null;
}
