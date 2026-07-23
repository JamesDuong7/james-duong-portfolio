"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { flipFolioTo } from "@/components/folio/FolioBook";
import { scrollToSection } from "@/lib/anchorNavigation";

/** Sync URL hashes with Folio spreads on desktop; scroll sections on mobile stack. */
export default function HashScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const id = window.location.hash.slice(1);
    if (!id) return;

    requestAnimationFrame(() => {
      const isNarrow = window.matchMedia("(max-width: 900px)").matches;
      if (isNarrow) {
        scrollToSection(id);
        return;
      }

      // Silent — FolioBook also syncs on mount. Animating here made
      // project → /#works look like a forward flip through the cover.
      flipFolioTo(id, { animate: false });
    });
  }, [pathname]);

  return null;
}
