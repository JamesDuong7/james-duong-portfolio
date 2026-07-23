"use client";

import { useEffect, useState } from "react";
import { flipFolioTo } from "./FolioBook";
import styles from "./FolioTocNav.module.css";

/** Spreads where the "back to contents" pill would be redundant or unwanted. */
const HIDDEN_PAGE_IDS = new Set(["cover", "toc", "contents"]);

/** Pause after a spread settles so the pill does not compete with the turn. */
const REVEAL_DELAY_MS = 320;

/**
 * Fixed bottom-center control that jumps back to the Table of Contents,
 * mirroring the way you'd thumb back to a magazine's contents page.
 */
export default function FolioTocNav() {
  const [pages, setPages] = useState<string[]>(["cover"]);
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

    const shouldHide = (pageIds: string[]) =>
      pageIds.some((id) => HIDDEN_PAGE_IDS.has(id));

    const scheduleReveal = (pageIds: string[]) => {
      clearRevealTimer();
      if (shouldHide(pageIds)) {
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

  // On the stacked mobile layout the pages are a single scroll, so a
  // horizontal "flip to contents" affordance doesn't apply.
  if (
    narrow ||
    !revealed ||
    pages.some((id) => HIDDEN_PAGE_IDS.has(id))
  ) {
    return null;
  }

  return (
    <button
      type="button"
      className={styles.nav}
      onClick={() => flipFolioTo("contents")}
      aria-label="Back to table of contents"
    >
      <span className={styles.icon} aria-hidden>
        ☰
      </span>
      <span className={styles.label}>Back to Contents</span>
    </button>
  );
}
