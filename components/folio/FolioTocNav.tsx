"use client";

import { useEffect, useState } from "react";
import { flipFolioTo } from "./FolioBook";
import styles from "./FolioTocNav.module.css";

/** Spreads where the "back to contents" pill would be redundant or unwanted. */
const HIDDEN_PAGE_IDS = new Set(["cover", "toc", "contents"]);

/**
 * Fixed bottom-center control that jumps back to the Table of Contents,
 * mirroring the way you'd thumb back to a magazine's contents page.
 */
export default function FolioTocNav() {
  const [pages, setPages] = useState<string[]>(["cover"]);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
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
    };

    const mql = window.matchMedia("(max-width: 900px)");
    const onMedia = () => setNarrow(mql.matches);
    onMedia();

    window.addEventListener("folio:spreadchange", onSpreadChange);
    mql.addEventListener("change", onMedia);
    return () => {
      window.removeEventListener("folio:spreadchange", onSpreadChange);
      mql.removeEventListener("change", onMedia);
    };
  }, []);

  // On the stacked mobile layout the pages are a single scroll, so a
  // horizontal "flip to contents" affordance doesn't apply.
  if (narrow || pages.some((id) => HIDDEN_PAGE_IDS.has(id))) return null;

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
