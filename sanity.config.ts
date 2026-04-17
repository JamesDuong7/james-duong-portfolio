import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool, defineLocations, type PresentationPluginOptions } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

export default defineConfig({
  name: "portfolio-studio",
  title: "James Duong Portfolio",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Singleton for personal info — only one document
            S.listItem()
              .title("Personal Info")
              .id("personalInfo")
              .child(
                S.document()
                  .schemaType("personalInfo")
                  .documentId("personalInfo")
              ),
            S.divider(),
            // Regular list of project documents
            S.documentTypeListItem("project").title("Projects"),
          ]),
    }),
    presentationTool({
      resolve: {
        locations: {
          project: defineLocations({
            select: { title: "title", slug: "id.current" },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title ?? "Untitled",
                  href: `/projects/${doc?.slug}`,
                },
                { title: "Homepage", href: "/" },
              ],
            }),
          }),
          personalInfo: defineLocations({
            select: {},
            resolve: () => ({
              locations: [{ title: "Homepage", href: "/" }],
            }),
          }),
        },
      } satisfies PresentationPluginOptions["resolve"],
      previewUrl: {
        origin:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : `https://${process.env.NEXT_PUBLIC_VERCEL_URL ?? "jamesduong.dev"}`,
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
