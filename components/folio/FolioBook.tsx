"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import styles from "./FolioBook.module.css";

/**
 * Page-turn timing. A longer ease keeps the leaf readable; the spread swaps
 * while the leaf is edge-on, then a short skeleton veil covers the settle.
 */
const FLIP_DURATION_MS = 980;
const FLIP_SWAP_MS = 460;
const FLIP_REVEAL_MS = 280;

type FolioBookProps = {
  children: ReactNode;
};

type GoToSpreadOptions = {
  syncHash?: boolean;
  /** Smooth scroll between spreads. False for silent hash landings. */
  animate?: boolean;
};

/** The cover always sits first and keeps the URL hash clean. */
const COVER_INDEX = 0;

/** Legacy hash aliases so older links (/#work, /#profile) still resolve. */
const HASH_ALIASES: Record<string, string> = {
  work: "works",
  projects: "works",
  profile: "contents",
  about: "contents",
};

/** Section ids preferred when choosing a canonical hash for a spread. */
const SECTION_IDS = new Set([
  "cover",
  "contents",
  "featured",
  "works",
  "contact",
]);

function spreadEls(book: HTMLDivElement) {
  return [...book.querySelectorAll<HTMLElement>("[data-folio-spread]")];
}

function pageIdsInSpread(spread: HTMLElement) {
  return [...spread.querySelectorAll<HTMLElement>("[data-folio-page]")]
    .map((el) => el.dataset.folioPage || el.id)
    .filter(Boolean);
}

function currentSpreadIndex(book: HTMLDivElement) {
  return Math.round(book.scrollLeft / Math.max(book.clientWidth, 1));
}

function isNarrowViewport() {
  return window.matchMedia("(max-width: 900px)").matches;
}

/** Resolve a URL hash id (or alias) to a spread index, or null when unknown. */
function indexFromHash(book: HTMLDivElement, rawId: string) {
  if (!rawId) return null;
  const id = HASH_ALIASES[rawId] ?? rawId;

  const spreads = spreadEls(book);
  // Prefer an in-spread page id match so TOC items land on their leaf.
  const byPage = spreads.findIndex((spread) =>
    pageIdsInSpread(spread).includes(id),
  );
  if (byPage >= 0) return byPage;

  const bySpreadId = spreads.findIndex((spread) => spread.id === id);
  return bySpreadId >= 0 ? bySpreadId : null;
}

function canonicalHashId(spread: HTMLElement) {
  const ids = pageIdsInSpread(spread);
  for (const id of ids) {
    if (SECTION_IDS.has(id)) return id;
  }
  return ids[0] ?? spread.id ?? "";
}

export default function FolioBook({ children }: FolioBookProps) {
  const bookRef = useRef<HTMLDivElement>(null);
  const [flip, setFlip] = useState<{ dir: "forward" | "back"; key: number } | null>(
    null,
  );
  const [revealing, setRevealing] = useState(false);
  const flipTimers = useRef<number[]>([]);
  const flippingRef = useRef(false);

  const clearFlipTimers = useCallback(() => {
    flipTimers.current.forEach((t) => window.clearTimeout(t));
    flipTimers.current = [];
  }, []);

  /** Play the page-turn leaf, swapping the underlying spread at the midpoint. */
  const playFlip = useCallback(
    (dir: "forward" | "back", onSwap: () => void) => {
      clearFlipTimers();
      flippingRef.current = true;
      setRevealing(false);
      setFlip({ dir, key: Date.now() });

      flipTimers.current.push(
        window.setTimeout(() => {
          onSwap();
          setRevealing(true);
        }, FLIP_SWAP_MS),
        window.setTimeout(() => {
          setFlip(null);
        }, FLIP_DURATION_MS),
        window.setTimeout(() => {
          setRevealing(false);
          flippingRef.current = false;
        }, FLIP_SWAP_MS + FLIP_REVEAL_MS),
      );
    },
    [clearFlipTimers],
  );

  useEffect(() => clearFlipTimers, [clearFlipTimers]);

  /** Desktop only: keep the off-spread out of tab order. Mobile stacks all. */
  const syncSpreadInteractivity = useCallback((activeIndex: number) => {
    const book = bookRef.current;
    if (!book) return;
    const narrow = isNarrowViewport();
    const spreads = spreadEls(book);
    spreads.forEach((spread, i) => {
      spread.inert = !narrow && i !== activeIndex;
    });

    const active = spreads[activeIndex];
    const pages = active ? pageIdsInSpread(active) : [];
    window.dispatchEvent(
      new CustomEvent("folio:spreadchange", {
        detail: {
          index: activeIndex,
          id: active ? canonicalHashId(active) : "",
          pages,
        },
      }),
    );
  }, []);

  const goToSpread = useCallback(
    (index: number, options: GoToSpreadOptions = {}) => {
      const { syncHash = true, animate = true } = options;
      const book = bookRef.current;
      if (!book) return;
      const spreads = spreadEls(book);
      const target = spreads[index];
      if (!target) return;

      const from = currentSpreadIndex(book);
      if (from !== index) {
        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        if (!animate || reduceMotion) {
          const previousBehavior = book.style.scrollBehavior;
          book.style.scrollBehavior = "auto";
          book.scrollLeft = target.offsetLeft;
          book.style.scrollBehavior = previousBehavior;
        } else {
          book.scrollLeft = target.offsetLeft;
        }
      }

      syncSpreadInteractivity(index);

      if (animate && document.activeElement && book.contains(document.activeElement)) {
        target.focus({ preventScroll: true });
      }

      if (syncHash) {
        const id = canonicalHashId(target);
        const nextHash = index === COVER_INDEX || !id || id === "cover" ? "" : `#${id}`;
        const currentHash = window.location.hash;
        if (currentHash !== nextHash) {
          const url =
            nextHash || `${window.location.pathname}${window.location.search}`;
          window.history.replaceState(null, "", url);
        }
      }
    },
    [syncSpreadInteractivity],
  );

  useEffect(() => {
    const book = bookRef.current;
    if (!book) return;

    const onFlip = (event: Event) => {
      const detail = (
        event as CustomEvent<{
          id?: string;
          dir?: "next" | "prev";
          animate?: boolean;
        }>
      ).detail;
      if (!detail) return;

      // Ignore stacked flip requests while a turn is in flight.
      if (flippingRef.current && (detail.animate ?? true)) return;

      const from = currentSpreadIndex(book);
      let target: number | null = null;
      if (typeof detail.id === "string") {
        target = indexFromHash(book, detail.id);
      } else if (detail.dir === "next") {
        target = Math.min(from + 1, spreadEls(book).length - 1);
      } else if (detail.dir === "prev") {
        target = Math.max(from - 1, 0);
      }

      if (target === null || target === from) return;

      const wantAnimate = detail.animate ?? true;
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (wantAnimate && !reduceMotion && !isNarrowViewport()) {
        playFlip(target > from ? "forward" : "back", () =>
          goToSpread(target, { animate: false }),
        );
      } else {
        goToSpread(target, { animate: wantAnimate });
      }
    };

    const syncFromHash = (animate: boolean) => {
      const id = window.location.hash.slice(1);
      const index = indexFromHash(book, id);
      if (index === null) {
        syncSpreadInteractivity(currentSpreadIndex(book));
        return;
      }
      goToSpread(index, { syncHash: false, animate });
    };

    const onHashChange = () => syncFromHash(true);

    let scrollSyncRaf = 0;
    const onScroll = () => {
      cancelAnimationFrame(scrollSyncRaf);
      scrollSyncRaf = requestAnimationFrame(() => {
        syncSpreadInteractivity(currentSpreadIndex(book));
      });
    };

    const onResize = () => {
      syncSpreadInteractivity(currentSpreadIndex(book));
    };

    window.addEventListener("folio:flip", onFlip);
    window.addEventListener("hashchange", onHashChange);
    book.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => syncFromHash(false)),
    );

    return () => {
      cancelAnimationFrame(scrollSyncRaf);
      window.removeEventListener("folio:flip", onFlip);
      window.removeEventListener("hashchange", onHashChange);
      book.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [goToSpread, syncSpreadInteractivity, playFlip]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    if (isNarrowViewport()) return;
    const book = bookRef.current;
    if (!book) return;
    const spreads = spreadEls(book);
    if (spreads.length < 2) return;

    const current = currentSpreadIndex(book);
    const forward = event.key === "ArrowRight";
    const next = forward
      ? Math.min(current + 1, spreads.length - 1)
      : Math.max(current - 1, 0);

    if (next === current) return;
    event.preventDefault();
    flipFolioStep(forward ? "next" : "prev");
  };

  return (
    <div
      ref={bookRef}
      className={`${styles.book} ${revealing ? styles.bookRevealing : ""}`}
      tabIndex={0}
      role="region"
      aria-label="Portfolio magazine"
      onKeyDown={onKeyDown}
    >
      {children}
      {flip && (
        <div className={styles.flipStage} aria-hidden>
          <div className={styles.flipDim} />
          <div
            key={flip.key}
            className={`${styles.leaf} ${
              flip.dir === "forward" ? styles.leafForward : styles.leafBack
            }`}
          >
            <span className={styles.leafFace}>
              <span className={styles.leafBone} />
              <span className={styles.leafBone} />
              <span className={styles.leafBoneWide} />
              <span className={styles.leafBone} />
            </span>
            <span className={styles.leafShade} />
            <span className={styles.leafEdge} />
          </div>
        </div>
      )}
      {revealing && (
        <div className={styles.revealVeil} aria-hidden>
          <div className={styles.revealSpread}>
            <div className={styles.revealPage}>
              <span className={styles.leafBone} />
              <span className={styles.leafBoneWide} />
              <span className={styles.leafBone} />
            </div>
            <div className={styles.revealPage}>
              <span className={styles.leafBone} />
              <span className={styles.leafBoneWide} />
              <span className={styles.leafBone} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Flip to a specific page/spread by its id (e.g. "contents", "featured-slug"). */
export function flipFolioTo(
  id: string,
  options: { animate?: boolean } = {},
) {
  window.dispatchEvent(
    new CustomEvent("folio:flip", {
      detail: { id, animate: options.animate ?? true },
    }),
  );
}

/** Flip one spread forward or backward, following the table of contents order. */
export function flipFolioStep(
  dir: "next" | "prev",
  options: { animate?: boolean } = {},
) {
  window.dispatchEvent(
    new CustomEvent("folio:flip", {
      detail: { dir, animate: options.animate ?? true },
    }),
  );
}
