import { defineType, defineField } from "sanity";

export const personalInfo = defineType({
  name: "personalInfo",
  title: "Personal Info",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      description:
        'Short tagline shown under your name (e.g. "Computer Science Student & Software Engineer")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Introduction",
      type: "array",
      of: [{ type: "block" }],
      description: "The paragraph shown in the Hero section. Allows for bold text or links.",
    }),
    defineField({
      name: "aboutMe",
      title: "About Me",
      type: "array",
      of: [{ type: "block" }],
      description: "The multi-paragraph text shown in the About section. Supports paragraphs, bold, and lists.",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "github",
      title: "GitHub URL",
      type: "url",
    }),
    defineField({
      name: "linkedin",
      title: "LinkedIn URL",
      type: "url",
    }),
    defineField({
      name: "resumeUrl",
      title: "Resume URL",
      type: "string",
      description:
        'Path to the resume file (e.g. "/James_Duong_CS_Resume_2026.pdf") or an external link.',
    }),
    defineField({
      name: "skills",
      title: "Skills",
      type: "object",
      fields: [
        defineField({
          name: "languages",
          title: "Programming Languages",
          type: "array",
          of: [{ type: "string" }],
          options: { layout: "tags" },
        }),
        defineField({
          name: "frameworks",
          title: "Frameworks & Libraries",
          type: "array",
          of: [{ type: "string" }],
          options: { layout: "tags" },
        }),
        defineField({
          name: "tools",
          title: "Tools",
          type: "array",
          of: [{ type: "string" }],
          options: { layout: "tags" },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "headline" },
  },
});
