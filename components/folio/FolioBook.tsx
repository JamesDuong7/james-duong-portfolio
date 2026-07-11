"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import styles from "./FolioBook.module.css";

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

function spreadEls(book: HTMLDivElement) {
  return [...book.querySelectorAll<HTMLElement>("[data-folio-spread]")];
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
  const index = spreadEls(book).findIndex((spread) => spread.id === id);
  return index >= 0 ? index : null;
}

export default function FolioBook({ children }: FolioBookProps) {
  const bookRef = useRef<HTMLDivElement>(null);

  /** Desktop only: keep the off-spread out of tab order. Mobile stacks all. */
  const syncSpreadInteractivity = useCallback((activeIndex: number) => {
    const book = bookRef.current;
    if (!book) return;
    const narrow = isNarrowViewport();
    const spreads = spreadEls(book);
    spreads.forEach((spread, i) => {
      spread.inert = !narrow && i !== activeIndex;
    });
    // Let fixed chrome (the Contents nav) react to the active spread.
    window.dispatchEvent(
      new CustomEvent("folio:spreadchange", {
        detail: { index: activeIndex, id: spreads[activeIndex]?.id ?? "" },
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

      // Keep keyboard focus on the visible spread after a user-driven flip.
      if (animate && document.activeElement && book.contains(document.activeElement)) {
        target.focus({ preventScroll: true });
      }

      if (syncHash) {
        const id = spreads[index]?.id ?? "";
        const nextHash = index === COVER_INDEX || !id ? "" : `#${id}`;
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

      let target: number | null = null;
      if (typeof detail.id === "string") {
        target = indexFromHash(book, detail.id);
      } else if (detail.dir === "next") {
        target = Math.min(currentSpreadIndex(book) + 1, spreadEls(book).length - 1);
      } else if (detail.dir === "prev") {
        target = Math.max(currentSpreadIndex(book) - 1, 0);
      }

      if (target === null) return;
      goToSpread(target, { animate: detail.animate ?? true });
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
    // Silent land on hash so project → /#works doesn't animate through the cover.
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
  }, [goToSpread, syncSpreadInteractivity]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    if (isNarrowViewport()) return;
    const book = bookRef.current;
    if (!book) return;
    const spreads = spreadEls(book);
    if (spreads.length < 2) return;

    const current = currentSpreadIndex(book);
    const next =
      event.key === "ArrowRight"
        ? Math.min(current + 1, spreads.length - 1)
        : Math.max(current - 1, 0);

    if (next === current) return;
    event.preventDefault();
    goToSpread(next);
  };

  return (
    <div
      ref={bookRef}
      className={styles.book}
      tabIndex={0}
      role="region"
      aria-label="Portfolio magazine"
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
}

/** Flip to a specific spread by its id (e.g. "contents", "works"). */
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
