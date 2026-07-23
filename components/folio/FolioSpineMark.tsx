"use client";

import { useEffect, useState } from "react";
import { flipFolioTo } from "./FolioBook";
import styles from "./FolioSpineMark.module.css";

/** Pause after a spread settles so the mark does not compete with the turn. */
const REVEAL_DELAY_MS = 320;

function isCaseStudySpread(pageIds: string[]) {
  return pageIds.some((id) => id.startsWith("project-"));
}

/**
 * Fixed top-center JD. mark on case study spreads.
 * Reveals after the page turn settles, same timing as Back to Contents.
 */
export default function FolioSpineMark() {
  const [pages, setPages] = useState<string[]>([]);
  const [narrow, setNarrow] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    let revealTimer: number | null = null;

    const clearRevealTimer = () => {
      if (revealTimer !== null) {
        window.clearTimeout(revealTimer);
        revealTimer = null;
      }
    };

    const scheduleReveal = (pageIds: string[]) => {
      clearRevealTimer();
      if (!isCaseStudySpread(pageIds)) {
        setRevealed(false);
        return;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduceMotion) {
        setRevealed(true);
        return;
      }

      setRevealed(false);
      revealTimer = window.setTimeout(() => {
        setRevealed(true);
        revealTimer = null;
      }, REVEAL_DELAY_MS);
    };

    const onSpreadChange = (event: Event) => {
      const detail = (event as CustomEvent<{ id: string; pages?: string[] }>)
        .detail;
      if (!detail) return;
      const nextPages =
        detail.pages && detail.pages.length > 0
          ? detail.pages
          : detail.id
            ? [detail.id]
            : [];
      setPages(nextPages);
      scheduleReveal(nextPages);
    };

    const onFlip = (event: Event) => {
      const detail = (event as CustomEvent<{ animate?: boolean }>).detail;
      if (detail && detail.animate === false) return;
      clearRevealTimer();
      setRevealed(false);
    };

    const mql = window.matchMedia("(max-width: 900px)");
    const onMedia = () => setNarrow(mql.matches);
    onMedia();

    window.addEventListener("folio:spreadchange", onSpreadChange);
    window.addEventListener("folio:flip", onFlip);
    mql.addEventListener("change", onMedia);
    return () => {
      clearRevealTimer();
      window.removeEventListener("folio:spreadchange", onSpreadChange);
      window.removeEventListener("folio:flip", onFlip);
      mql.removeEventListener("change", onMedia);
    };
  }, []);

  if (narrow || !revealed || !isCaseStudySpread(pages)) {
    return null;
  }

  return (
    <button
      type="button"
      className={styles.mark}
      onClick={() => flipFolioTo("cover")}
      aria-label="Return to portfolio cover"
    >
      JD.
    </button>
  );
}
