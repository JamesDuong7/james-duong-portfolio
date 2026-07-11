import type { PortableTextBlock } from "@portabletext/types";

/** GROQ result shape for PERSONAL_INFO_QUERY */
export type PersonalInfo = {
  name: string;
  headline: string;
  intro: PortableTextBlock[] | null;
  aboutMe: PortableTextBlock[] | null;
  email: string | null;
  location: string | null;
  github: string | null;
  linkedin: string | null;
  resumeUrl: string | null;
  skills: {
    languages: string[] | null;
    frameworks: string[] | null;
    tools: string[] | null;
  } | null;
};

/** GROQ row shape for FEATURED_PROJECTS_QUERY */
export type FeaturedProject = {
  id: string;
  title: string;
  description: string;
  tech: string[] | null;
  github: string | null;
  live: string | null;
  featured: boolean | null;
};

/** GROQ row shape for ALL_PROJECT_SLUGS_QUERY */
export type ProjectSlugRow = { slug: string | null };

/** GROQ result shape for PROJECT_BY_SLUG_QUERY */
export type ProjectDetail = {
  id: string;
  title: string;
  description: string;
  tech: string[] | null;
  github: string | null;
  live: string | null;
  featured: boolean | null;
  overview: PortableTextBlock[] | null;
  problem: PortableTextBlock[] | null;
  role: string | null;
  features: string[] | null;
  implementationDetails: PortableTextBlock[] | null;
  challenges: PortableTextBlock[] | null;
  learning: PortableTextBlock[] | null;
  future: PortableTextBlock[] | null;
};
