/**
 * This page embeds the Sanity Studio at /studio.
 * It is protected by Sanity's own authentication — only you can log in.
 *
 * To access it locally: http://localhost:3000/studio
 * In production: https://jamesduong.dev/studio
 *
 * 'use client' is required because NextStudio uses React.createContext
 * and browser-only APIs that cannot run on the server.
 */
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
