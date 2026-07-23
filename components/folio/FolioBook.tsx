"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import styles from "./FolioBook.module.css";

/** Two-sided page turn — completion comes from WAAPI, not timers. */
const FLIP_DURATION_MS = 760;
/** Soft crossfade after the leaf lands so teardown does not click. */
const FLIP_SETTLE_MS = 140;

type FlipPhase =
  | "idle"
  | "preparing"
  | "turning-forward"
  | "turning-back"
  | "settling";

type FlipDirection = "forward" | "back";

type FlipSession = {
  from: number;
  to: number;
  dir: FlipDirection;
  hashId?: string;
};

type FolioBookProps = {
  children: ReactNode;
};

type GoToSpreadOptions = {
  syncHash?: boolean;
  /** Smooth scroll between spreads. False for silent hash landings. */
  animate?: boolean;
  /** Prefer this page id in the URL when it exists on the target spread. */
  hashId?: string;
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

/** Left/right slots are FolioSpread's direct children (page or wood table). */
function spreadFaces(spread: HTMLElement) {
  const [left, right] = [...spread.children] as HTMLElement[];
  return { left, right };
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

function canonicalHashId(spread: HTMLElement, preferred?: string) {
  const ids = pageIdsInSpread(spread);
  // Keep deep links stable (e.g. /#works, /#featured-slug) when present.
  if (preferred && ids.includes(preferred)) return preferred;
  for (const id of ids) {
    if (SECTION_IDS.has(id)) return id;
  }
  return ids[0] ?? spread.id ?? "";
}

function syncHashForSpread(
  spread: HTMLElement,
  index: number,
  hashId?: string,
) {
  const id = canonicalHashId(spread, hashId);
  const nextHash =
    index === COVER_INDEX || !id || id === "cover" ? "" : `#${id}`;
  if (window.location.hash !== nextHash) {
    const url =
      nextHash || `${window.location.pathname}${window.location.search}`;
    window.history.replaceState(null, "", url);
  }
}

/** Visual-only clone for the turning leaf — no duplicate ids or controls. */
function clonePageFace(source: HTMLElement) {
  const clone = source.cloneNode(true) as HTMLElement;
  clone.removeAttribute("id");
  clone.removeAttribute("tabindex");
  clone.setAttribute("aria-hidden", "true");
  clone.querySelectorAll<HTMLElement>("[id]").forEach((el) => {
    el.removeAttribute("id");
  });
  clone
    .querySelectorAll<HTMLElement>("a, button, input, textarea, select")
    .forEach((el) => {
      el.setAttribute("tabindex", "-1");
      if (
        el instanceof HTMLButtonElement ||
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        el instanceof HTMLSelectElement
      ) {
        el.disabled = true;
      }
      if (el instanceof HTMLAnchorElement) {
        el.removeAttribute("href");
      }
    });
  clone.style.width = "100%";
  clone.style.height = "100%";
  clone.style.overflow = "hidden";
  clone.scrollTop = source.scrollTop;
  clone.scrollLeft = source.scrollLeft;
  return clone;
}

function clearFaceHost(host: HTMLElement | null) {
  if (!host) return;
  while (host.firstChild) host.removeChild(host.firstChild);
}

function scrollBookTo(
  book: HTMLDivElement,
  target: HTMLElement,
  index?: number,
) {
  const previousBehavior = book.style.scrollBehavior;
  book.style.scrollBehavior = "auto";
  const byOffset = target.offsetLeft;
  const byIndex =
    typeof index === "number" ? index * Math.max(book.clientWidth, 1) : 0;
  book.scrollLeft = byOffset || byIndex;
  book.style.scrollBehavior = previousBehavior;
}

export default function FolioBook({ children }: FolioBookProps) {
  const bookRef = useRef<HTMLDivElement>(null);
  /** Mounts the flip stage; phase machine lives in refs to avoid wiping clones. */
  const [flipDir, setFlipDir] = useState<FlipDirection | null>(null);
  const flipSessionRef = useRef<FlipSession | null>(null);
  const phaseRef = useRef<FlipPhase>("idle");
  const activeIndexRef = useRef(0);
  const flippingRef = useRef(false);
  const safetyTimerRef = useRef<number | null>(null);
  const flipRunIdRef = useRef(0);
  const finishFlipRef = useRef<() => void>(() => {});

  const flipStageRef = useRef<HTMLDivElement>(null);
  const staticLeftRef = useRef<HTMLDivElement>(null);
  const staticRightRef = useRef<HTMLDivElement>(null);
  const leafRef = useRef<HTMLDivElement>(null);
  const leafFrontRef = useRef<HTMLDivElement>(null);
  const leafBackRef = useRef<HTMLDivElement>(null);
  const flipDimRef = useRef<HTMLDivElement>(null);

  /** Desktop only: keep the off-spread out of tab order. Mobile stacks all. */
  const syncSpreadInteractivity = useCallback((activeIndex: number) => {
    const book = bookRef.current;
    if (!book) return;
    const narrow = isNarrowViewport();
    const spreads = spreadEls(book);
    spreads.forEach((spread, i) => {
      spread.inert = !narrow && i !== activeIndex;
    });

    activeIndexRef.current = activeIndex;

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

  const clearFlipHosts = useCallback(() => {
    clearFaceHost(staticLeftRef.current);
    clearFaceHost(staticRightRef.current);
    clearFaceHost(leafFrontRef.current);
    clearFaceHost(leafBackRef.current);
  }, []);

  const clearSafetyTimer = useCallback(() => {
    if (safetyTimerRef.current !== null) {
      window.clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }
  }, []);

  const finishFlip = useCallback(() => {
    if (phaseRef.current === "idle" || phaseRef.current === "settling") return;

    clearSafetyTimer();
    phaseRef.current = "settling";

    const session = flipSessionRef.current;
    const leaf = leafRef.current;
    const stage = flipStageRef.current;
    leaf?.classList.remove(styles.turningActive);
    flipDimRef.current?.removeAttribute("data-active");

    const commit = () => {
      clearFlipHosts();

      const book = bookRef.current;
      if (session && book) {
        const spreads = spreadEls(book);
        const dest = spreads[session.to];
        if (
          dest &&
          document.activeElement &&
          book.contains(document.activeElement)
        ) {
          dest.focus({ preventScroll: true });
        }
        syncSpreadInteractivity(session.to);
      }

      flipSessionRef.current = null;
      flippingRef.current = false;
      phaseRef.current = "idle";
      setFlipDir(null);
    };

    if (stage) {
      const settle = stage.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        {
          duration: FLIP_SETTLE_MS,
          easing: "ease-out",
          fill: "forwards",
        },
      );
      void settle.finished.then(commit).catch(commit);
    } else {
      commit();
    }
  }, [clearFlipHosts, clearSafetyTimer, syncSpreadInteractivity]);

  useEffect(() => {
    finishFlipRef.current = finishFlip;
  }, [finishFlip]);

  /**
   * Clone source/destination faces into the stage, park the destination
   * underneath, then start the CSS turn without a React re-render.
   */
  useLayoutEffect(() => {
    if (!flipDir) return;

    const book = bookRef.current;
    const session = flipSessionRef.current;
    const leaf = leafRef.current;
    if (!book || !session || !leaf || !flippingRef.current) return;

    phaseRef.current = "preparing";

    const spreads = spreadEls(book);
    const source = spreads[session.from];
    const dest = spreads[session.to];
    if (!source || !dest) {
      flippingRef.current = false;
      phaseRef.current = "idle";
      setFlipDir(null);
      return;
    }

    const sourceFaces = spreadFaces(source);
    const destFaces = spreadFaces(dest);
    if (
      !sourceFaces.left ||
      !sourceFaces.right ||
      !destFaces.left ||
      !destFaces.right
    ) {
      scrollBookTo(book, dest, session.to);
      syncSpreadInteractivity(session.to);
      flipSessionRef.current = null;
      flippingRef.current = false;
      phaseRef.current = "idle";
      setFlipDir(null);
      return;
    }

    clearFlipHosts();

    if (session.dir === "forward") {
      staticLeftRef.current?.setAttribute("data-visible", "");
      staticRightRef.current?.removeAttribute("data-visible");
      staticLeftRef.current?.appendChild(clonePageFace(sourceFaces.left));
      leafFrontRef.current?.appendChild(clonePageFace(sourceFaces.right));
      leafBackRef.current?.appendChild(clonePageFace(destFaces.left));
    } else {
      staticRightRef.current?.setAttribute("data-visible", "");
      staticLeftRef.current?.removeAttribute("data-visible");
      staticRightRef.current?.appendChild(clonePageFace(sourceFaces.right));
      leafFrontRef.current?.appendChild(clonePageFace(sourceFaces.left));
      leafBackRef.current?.appendChild(clonePageFace(destFaces.right));
    }

    spreads.forEach((spread) => {
      spread.inert = true;
    });
    scrollBookTo(book, dest, session.to);

    phaseRef.current =
      session.dir === "forward" ? "turning-forward" : "turning-back";

    const runId = ++flipRunIdRef.current;
    flipDimRef.current?.setAttribute("data-active", "");

    // Leaf rotate uses WAAPI so completion is not confused with child
    // animationend events or Strict Mode restarts.
    leaf.getAnimations().forEach((animation) => animation.cancel());
    leaf.classList.add(styles.turningActive);

    const turnKeyframes =
      session.dir === "forward"
        ? [
            { transform: "rotateY(0deg) scaleX(1)" },
            { transform: "rotateY(-90deg) scaleX(0.985)", offset: 0.45 },
            { transform: "rotateY(-180deg) scaleX(1)" },
          ]
        : [
            { transform: "rotateY(0deg) scaleX(1)" },
            { transform: "rotateY(90deg) scaleX(0.985)", offset: 0.45 },
            { transform: "rotateY(180deg) scaleX(1)" },
          ];

    const turn = leaf.animate(turnKeyframes, {
      duration: FLIP_DURATION_MS,
      easing: "cubic-bezier(0.45, 0.05, 0.2, 1)",
      fill: "forwards",
    });

    void turn.finished
      .then(() => {
        if (runId !== flipRunIdRef.current) return;
        finishFlipRef.current();
      })
      .catch(() => {
        /* cancelled during cleanup / remount */
      });

    clearSafetyTimer();
    safetyTimerRef.current = window.setTimeout(() => {
      if (runId !== flipRunIdRef.current) return;
      finishFlipRef.current();
    }, FLIP_DURATION_MS + FLIP_SETTLE_MS + 120);

    return () => {
      flipRunIdRef.current += 1;
      turn.cancel();
      leaf.classList.remove(styles.turningActive);
      clearSafetyTimer();
    };
  }, [flipDir, clearFlipHosts, clearSafetyTimer, syncSpreadInteractivity]);

  const playFlip = useCallback((session: FlipSession) => {
    flippingRef.current = true;
    phaseRef.current = "preparing";
    flipSessionRef.current = session;
    setFlipDir(session.dir);
  }, []);

  const goToSpread = useCallback(
    (index: number, options: GoToSpreadOptions = {}) => {
      const { syncHash = true, animate = true, hashId } = options;
      const book = bookRef.current;
      if (!book) return;
      const spreads = spreadEls(book);
      const target = spreads[index];
      if (!target) return;

      const from = flippingRef.current
        ? activeIndexRef.current
        : currentSpreadIndex(book);
      if (from !== index) {
        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        if (!animate || reduceMotion) {
          scrollBookTo(book, target);
        } else {
          book.scrollLeft = target.offsetLeft;
        }
      }

      syncSpreadInteractivity(index);

      if (
        animate &&
        document.activeElement &&
        book.contains(document.activeElement)
      ) {
        target.focus({ preventScroll: true });
      }

      if (syncHash) {
        syncHashForSpread(target, index, hashId);
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

      // Ignore ghost/hidden book instances (e.g. duplicate trees during nav).
      if (book.clientWidth < 2) return;

      // Ignore stacked flip requests while a turn is in flight.
      if (flippingRef.current && (detail.animate ?? true)) return;

      const from = flippingRef.current
        ? activeIndexRef.current
        : currentSpreadIndex(book);
      let target: number | null = null;
      let hashId: string | undefined;
      if (typeof detail.id === "string") {
        hashId = HASH_ALIASES[detail.id] ?? detail.id;
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
        const spreads = spreadEls(book);
        const dest = spreads[target];
        if (dest) syncHashForSpread(dest, target, hashId);
        playFlip({
          from,
          to: target,
          dir: target > from ? "forward" : "back",
          hashId,
        });
      } else {
        goToSpread(target, { animate: wantAnimate, hashId });
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

    const onHashChange = () => {
      if (flippingRef.current) return;
      syncFromHash(true);
    };

    let scrollSyncRaf = 0;
    const onScroll = () => {
      if (flippingRef.current) return;
      cancelAnimationFrame(scrollSyncRaf);
      scrollSyncRaf = requestAnimationFrame(() => {
        if (flippingRef.current) return;
        syncSpreadInteractivity(currentSpreadIndex(book));
      });
    };

    const onResize = () => {
      if (flippingRef.current) return;
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
      clearSafetyTimer();
      window.removeEventListener("folio:flip", onFlip);
      window.removeEventListener("hashchange", onHashChange);
      book.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [goToSpread, syncSpreadInteractivity, playFlip, clearSafetyTimer]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    if (isNarrowViewport()) return;
    if (flippingRef.current) return;
    const book = bookRef.current;
    if (!book) return;
    const spreads = spreadEls(book);
    if (spreads.length < 2) return;

    const current = activeIndexRef.current;
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
      className={styles.book}
      tabIndex={0}
      role="region"
      aria-label="Portfolio magazine"
      onKeyDown={onKeyDown}
    >
      {children}
      {flipDir && (
        <div
          ref={flipStageRef}
          className={styles.flipStage}
          aria-hidden
          style={{ ["--folio-flip-ms" as string]: `${FLIP_DURATION_MS}ms` }}
        >
          <div ref={flipDimRef} className={styles.flipDim} />
          <div
            ref={staticLeftRef}
            className={`${styles.stageStatic} ${styles.stageStaticLeft}`}
          />
          <div
            ref={staticRightRef}
            className={`${styles.stageStatic} ${styles.stageStaticRight}`}
          />
          <div
            ref={leafRef}
            className={`${styles.turningLeaf} ${
              flipDir === "forward"
                ? styles.turningForward
                : styles.turningBack
            }`}
          >
            <div ref={leafFrontRef} className={styles.leafFront} />
            <div ref={leafBackRef} className={styles.leafBack} />
            <span className={styles.leafShade} />
            <span className={styles.leafSpine} />
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
