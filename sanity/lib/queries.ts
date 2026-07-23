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
 * Featured projects for the Folio work spread, ordered by display order.
 */
export const FEATURED_PROJECTS_QUERY = defineQuery(
  `*[_type == "project" && featured == true] | order(order asc) {
    "id": id.current,
    title,
    description,
    tech,
    github,
    live,
    featured,
    screenshots[]{
      alt,
      "url": asset->url,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height,
      "lqip": asset->metadata.lqip
    }
  }`
);

/**
 * All projects for index / next-prev navigation, ordered for display.
 */
export const PROJECTS_INDEX_QUERY = defineQuery(
  `*[_type == "project" && defined(id.current)] | order(order asc) {
    "slug": id.current,
    title,
    description,
    featured
  }`
);

/**
 * Full project details for in-book case study spreads, ordered for display.
 */
export const ALL_PROJECTS_DETAIL_QUERY = defineQuery(
  `*[_type == "project" && defined(id.current)] | order(order asc) {
    "id": id.current,
    title,
    description,
    tech,
    github,
    live,
    featured,
    screenshots[]{
      alt,
      "url": asset->url,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height,
      "lqip": asset->metadata.lqip
    },
    overview,
    problem,
    role,
    features,
    implementationDetails,
    challenges,
    learning,
    future
  }`
);

/**
 * A single project by its slug.
 * Used for /projects/[slug] redirects and metadata.
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
    screenshots[]{
      alt,
      "url": asset->url,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height,
      "lqip": asset->metadata.lqip
    },
    overview,
    problem,
    role,
    features,
    implementationDetails,
    challenges,
    learning,
    future
  }`
);

// ─── Personal Info ──────────────────────────────────────────────────────────

/**
 * The singleton personalInfo document.
 * Used by Folio identity, about/contact, and site metadata.
 */
export const PERSONAL_INFO_QUERY = defineQuery(
  `*[_type == "personalInfo"][0] {
    name,
    headline,
    intro,
    aboutMe,
    email,
    location,
    github,
    linkedin,
    resumeUrl,
    hobbies[]{
      title,
      description
    },
    skills {
      languages,
      frameworks,
      tools
    }
  }`
);
