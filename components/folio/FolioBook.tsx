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

export default function FolioBook({ children }: FolioBookProps) {
  const bookRef = useRef<HTMLDivElement>(null);

  const goToSpread = useCallback((index: number) => {
    const book = bookRef.current;
    if (!book) return;
    const spreads = book.querySelectorAll<HTMLElement>("[data-folio-spread]");
    const target = spreads[index];
    if (!target) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    book.scrollTo({
      left: target.offsetLeft,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, []);

  useEffect(() => {
    const book = bookRef.current;
    if (!book) return;

    const onFlip = (event: Event) => {
      const detail = (event as CustomEvent<{ to: "work" | "profile" }>).detail;
      if (!detail) return;
      goToSpread(detail.to === "work" ? 1 : 0);
    };

    const syncFromHash = () => {
      const id = window.location.hash.slice(1);
      if (id === "work" || id === "projects") {
        goToSpread(1);
        return;
      }
      if (id === "profile" || id === "about" || id === "contact") {
        goToSpread(0);
      }
    };

    window.addEventListener("folio:flip", onFlip);
    window.addEventListener("hashchange", syncFromHash);
    requestAnimationFrame(syncFromHash);

    return () => {
      window.removeEventListener("folio:flip", onFlip);
      window.removeEventListener("hashchange", syncFromHash);
    };
  }, [goToSpread]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    const book = bookRef.current;
    if (!book) return;
    const spreads = [...book.querySelectorAll<HTMLElement>("[data-folio-spread]")];
    if (spreads.length < 2) return;

    const current = Math.round(book.scrollLeft / book.clientWidth);
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

export function flipFolio(to: "work" | "profile") {
  window.dispatchEvent(new CustomEvent("folio:flip", { detail: { to } }));
}
