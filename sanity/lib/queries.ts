import { defineQuery } from "next-sanity";

// ─── Projects ──────────────────────────────────────────────────────────────

/**
 * All project slugs — used in generateStaticParams.
 * Uses 'published' perspective so only live content generates pages.
 */
export const ALL_PROJECT_SLUGS_QUERY = defineQuery(
  `*[_type == "project" && defined(id.current)]{ "slug": id.current }`
);

/**
 * All featured projects, ordered by the display order field.
 * Used on the homepage FeaturedProjects section.
 */
export const FEATURED_PROJECTS_QUERY = defineQuery(
  `*[_type == "project" && featured == true] | order(order asc) {
    "id": id.current,
    title,
    description,
    tech,
    github,
    live,
    featured
  }`
);

/**
 * A single project by its slug.
 * Used on /projects/[slug] case study pages.
 */
export const PROJECT_BY_SLUG_QUERY = defineQuery(
  `*[_type == "project" && id.current == $slug][0] {
    "id": id.current,
    title,
    description,
    tech,
    github,
    live,
    featured,
    overview,
    problem,
    role,
    features,
    implementationDetails,
    challenges,
    learning,
    future,
    "screenshots": screenshots[] {
      "src": asset->url,
      alt
    }
  }`
);

// ─── Personal Info ──────────────────────────────────────────────────────────

/**
 * The singleton personalInfo document.
 * Used in Hero, About, Navigation.
 */
export const PERSONAL_INFO_QUERY = defineQuery(
  `*[_type == "personalInfo"][0] {
    name,
    headline,
    intro,
    email,
    location,
    github,
    linkedin,
    resumeUrl,
    skills {
      languages,
      frameworks,
      tools
    }
  }`
);
