"use client";

import { useEffect, useState } from "react";
import { flipFolioTo } from "./FolioBook";
import styles from "./FolioTocNav.module.css";

/** Spreads where the "back to contents" pill would be redundant or unwanted. */
const HIDDEN_ON = new Set(["cover", "contents"]);

/**
 * Fixed bottom-center control that jumps back to the Table of Contents,
 * mirroring the way you'd thumb back to a magazine's contents page.
 */
export default function FolioTocNav() {
  const [activeId, setActiveId] = useState("cover");
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const onSpreadChange = (event: Event) => {
      const detail = (event as CustomEvent<{ id: string }>).detail;
      if (detail?.id != null) setActiveId(detail.id);
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
  if (narrow || HIDDEN_ON.has(activeId)) return null;

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
      <span className={styles.label}>Contents</span>
    </button>
  );
}
