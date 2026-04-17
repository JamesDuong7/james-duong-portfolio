/**
 * This layout opts the entire /studio segment out of static rendering.
 * Sanity Studio renders only in the browser, so we never want Next.js
 * to attempt to statically generate or SSR it.
 */
export const dynamic = "force-dynamic";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
