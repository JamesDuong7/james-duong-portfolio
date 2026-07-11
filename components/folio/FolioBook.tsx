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

function hashForSpread(index: number) {
  return index === 1 ? "work" : "profile";
}

function spreadIndexFromHash(hash: string) {
  if (hash === "work" || hash === "projects") return 1;
  if (hash === "profile" || hash === "about" || hash === "contact") return 0;
  return null;
}

function currentSpreadIndex(book: HTMLDivElement) {
  return Math.round(book.scrollLeft / Math.max(book.clientWidth, 1));
}

export default function FolioBook({ children }: FolioBookProps) {
  const bookRef = useRef<HTMLDivElement>(null);

  const goToSpread = useCallback((index: number, options: GoToSpreadOptions = {}) => {
    const { syncHash = true, animate = true } = options;
    const book = bookRef.current;
    if (!book) return;
    const spreads = book.querySelectorAll<HTMLElement>("[data-folio-spread]");
    const target = spreads[index];
    if (!target) return;

    const from = currentSpreadIndex(book);
    if (from === index) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!animate || reduceMotion) {
      const previousBehavior = book.style.scrollBehavior;
      book.style.scrollBehavior = "auto";
      book.scrollLeft = target.offsetLeft;
      book.style.scrollBehavior = previousBehavior;
    } else {
      book.scrollLeft = target.offsetLeft;
    }

    if (syncHash) {
      const nextHash = `#${hashForSpread(index)}`;
      if (window.location.hash !== nextHash) {
        window.history.replaceState(null, "", nextHash);
      }
    }
  }, []);

  useEffect(() => {
    const book = bookRef.current;
    if (!book) return;

    const onFlip = (event: Event) => {
      const detail = (
        event as CustomEvent<{
          to: "work" | "profile";
          animate?: boolean;
        }>
      ).detail;
      if (!detail) return;
      goToSpread(detail.to === "work" ? 1 : 0, {
        animate: detail.animate ?? true,
      });
    };

    const syncFromHash = (animate: boolean) => {
      const id = window.location.hash.slice(1);
      const index = spreadIndexFromHash(id);
      if (index === null) return;
      goToSpread(index, { syncHash: false, animate });
    };

    const onHashChange = () => syncFromHash(true);

    window.addEventListener("folio:flip", onFlip);
    window.addEventListener("hashchange", onHashChange);
    // Silent land on hash so project → /#work doesn't animate through Profile.
    requestAnimationFrame(() => requestAnimationFrame(() => syncFromHash(false)));

    return () => {
      window.removeEventListener("folio:flip", onFlip);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [goToSpread]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    const book = bookRef.current;
    if (!book) return;
    const spreads = [...book.querySelectorAll<HTMLElement>("[data-folio-spread]")];
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

export function flipFolio(
  to: "work" | "profile",
  options: { animate?: boolean } = {},
) {
  window.dispatchEvent(
    new CustomEvent("folio:flip", {
      detail: { to, animate: options.animate ?? true },
    }),
  );
}
