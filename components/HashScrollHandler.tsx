"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { flipFolio } from "@/components/folio/FolioBook";
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

      if (id === "work" || id === "projects") {
        flipFolio("work");
        return;
      }

      if (id === "profile" || id === "about" || id === "contact") {
        flipFolio("profile");
      }
    });
  }, [pathname]);

  return null;
}
