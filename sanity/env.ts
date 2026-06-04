/**
 * Sanity project env.
 * - Standalone Studio (`sanity dev`): use SANITY_STUDIO_* (injected into the browser bundle).
 * - Next.js (`npm run dev` → /studio): use NEXT_PUBLIC_*.
 */
export const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ??
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??
  "";

export const dataset =
  process.env.SANITY_STUDIO_DATASET ??
  process.env.NEXT_PUBLIC_SANITY_DATASET ??
  "production";

export function assertSanityEnv(): void {
  if (!projectId || !dataset) {
    throw new Error(
      "Missing Sanity env vars. Add SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET " +
        "(for `sanity dev`) and/or NEXT_PUBLIC_SANITY_* (for Next.js) to .env.local.",
    );
  }
}
