import { defineType, defineField, defineArrayMember } from "sanity";

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
      description: "Short intro paragraph on the Folio identity page. Plain text is used in the magazine layout.",
    }),
    defineField({
      name: "aboutMe",
      title: "About Me",
      type: "array",
      of: [{ type: "block" }],
      description: "About copy on the Folio profile page. Plain text is used in the magazine layout.",
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
      name: "hobbies",
      title: "Hobbies & Activities",
      type: "array",
      description:
        "Personal hobbies, activities, and interests shown in the About Me section of the magazine.",
      of: [
        defineArrayMember({
          type: "object",
          name: "hobby",
          fields: [
            defineField({
              name: "title",
              title: "Name",
              type: "string",
              description: 'e.g. "Bouldering", "Film photography", "Cooking"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Short Note",
              type: "text",
              rows: 2,
              description: "Optional one-liner about this hobby or activity.",
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "description" },
          },
        }),
      ],
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
