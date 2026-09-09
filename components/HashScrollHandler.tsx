"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { flipFolioTo } from "@/components/folio/FolioBook";

/**
 * Replays a hash after an App Router navigation on desktop.
 *
 * FolioBook owns mobile positioning. Having both components call
 * scrollIntoView caused two competing smooth-scroll journeys through the
 * stacked magazine and could leave the reader on an unrelated leaf.
 */
export default function HashScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const id = window.location.hash.slice(1);
    if (!id) return;

    requestAnimationFrame(() => {
      const isNarrow = window.matchMedia("(max-width: 900px)").matches;
      if (isNarrow) return;

      // Silent — FolioBook also syncs on mount. Animating here made
      // project → /#works look like a forward flip through the cover.
      flipFolioTo(id, { animate: false });
    });
  }, [pathname]);

  return null;
}
