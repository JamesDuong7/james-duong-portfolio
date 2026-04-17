import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId) throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
if (!dataset) throw new Error("Missing NEXT_PUBLIC_SANITY_DATASET");

export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-04-16",
  useCdn: true,
  stega: {
    // Point to the embedded Studio when in production
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ?? "/studio",
  },
});
