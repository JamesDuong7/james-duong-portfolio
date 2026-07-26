import { defineType, defineField } from "sanity";
import { parseYouTubeVideoId } from "../../lib/youtube";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "id",
      title: "Slug / URL ID",
      type: "slug",
      description:
        "Used in the URL: /projects/[slug]. Must be unique and lowercase with hyphens.",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Project Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      rows: 3,
      description: "One or two sentences shown on the card and in SEO meta tags.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tech",
      title: "Tech Stack",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "Add each technology as a tag (e.g. React, TypeScript).",
    }),
    defineField({
      name: "github",
      title: "GitHub URL",
      type: "url",
    }),
    defineField({
      name: "live",
      title: "Live Demo URL",
      type: "url",
    }),
    defineField({
      name: "demoVideoUrl",
      title: "Demo Video (YouTube)",
      type: "url",
      description:
        "Unlisted YouTube link of a screen recording (watch, youtu.be, or embed URL). Shown on the case study page.",
      validation: (rule) =>
        rule.uri({ scheme: ["https"] }).custom((value) => {
          if (!value) return true;
          return parseYouTubeVideoId(value)
            ? true
            : "Paste a valid YouTube URL (e.g. https://www.youtube.com/watch?v=… or https://youtu.be/…)";
        }),
    }),
    defineField({
      name: "featured",
      title: "Featured on Homepage",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "overview",
      title: "Overview",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "problem",
      title: "The Problem",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "role",
      title: "My Role",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "features",
      title: "Key Features",
      type: "array",
      of: [{ type: "string" }],
      description: "List each feature on its own line.",
    }),
    defineField({
      name: "implementationDetails",
      title: "Implementation Details",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "challenges",
      title: "Technical Challenges",
      type: "array",
      of: [{ type: "block" }],
      description: "Describe the hurdles you faced. You can use paragraphs or bullet points.",
    }),
    defineField({
      name: "learning",
      title: "Lessons Learned",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "future",
      title: "Future Improvements",
      type: "array",
      of: [{ type: "block" }],
      description: "What would you add next? You can use paragraphs or bullet points.",
    }),
    defineField({
      name: "screenshots",
      title: "Screenshots",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
              description: "Describe the screenshot for accessibility.",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first. Used to sort projects.",
      initialValue: 99,
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", featured: "featured" },
    prepare({ title, featured }) {
      return {
        title,
        subtitle: featured ? "⭐ Featured" : "Not featured",
      };
    },
  },
});
