import { defineLive } from "next-sanity/live";
import { client } from "./client";

export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({ apiVersion: "2025-04-16" }),
  // Server-only token — used to fetch draft content in Draft Mode.
  // Never exposed to the browser directly via defineLive.
  serverToken: process.env.SANITY_API_READ_TOKEN,
  // Viewer token shared with the browser during Draft Mode
  // for real-time content subscriptions.
  browserToken: process.env.SANITY_API_READ_TOKEN,
});
