/**
 * This page embeds the Sanity Studio at /studio.
 * It is protected by Sanity's own authentication — only you can log in.
 *
 * To access it locally: http://localhost:3000/studio
 * In production: https://jamesduong.dev/studio
 */
import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export const dynamic = "force-dynamic";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
