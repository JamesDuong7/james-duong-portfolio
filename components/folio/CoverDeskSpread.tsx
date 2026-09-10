"use client";

import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
  type MouseEvent,
  type ReactNode,
} from "react";
import ScandinavianCarpet from "./ScandinavianCarpet";
import CorkCoaster from "./CorkCoaster";
import CoffeeCup from "./CoffeeCup";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./CoverDeskSpread.module.css";

interface CoverDeskSpreadProps {
  children: ReactNode;
}

type DeskMode = "overview" | "reading";

function subscribeMediaAndHash(callback: () => void) {
  window.addEventListener("hashchange", callback);
  const mql = window.matchMedia("(max-width: 900px)");
  mql.addEventListener("change", callback);
  return () => {
    window.removeEventListener("hashchange", callback);
    mql.removeEventListener("change", callback);
  };
}

function getInitialIsReading() {
  if (typeof window === "undefined") return false;
  const isNarrow = window.matchMedia("(max-width: 900px)").matches;
  const hash = window.location.hash;
  const isDeep = Boolean(hash && hash !== "#" && hash !== "#cover" && hash !== "#desk");
  return isNarrow || isDeep;
}

function getServerSnapshot() {
  return false;
}

/**
 * Spread 0 (Cover Spread) with an integrated photorealistic desk environment.
 * Renders the Scandinavian carpet, blonde wood table, closed magazine,
 * and cork coasters with coffee mug in a single unified DOM tree,
 * providing a 60fps camera pan and zoom transition between overview and reading.
 */
export default function CoverDeskSpread({ children }: CoverDeskSpreadProps) {
  const isReadingDefault = useSyncExternalStore(
    subscribeMediaAndHash,
    getInitialIsReading,
    getServerSnapshot,
  );

  const [overrideMode, setOverrideMode] = useState<DeskMode | null>(null);
  const isReduced = useReducedMotion();

  const mode: DeskMode =
    overrideMode ?? (isReadingDefault ? "reading" : "overview");

  const zoomToReading = useCallback(() => {
    setOverrideMode("reading");
  }, []);

  const zoomToOverview = useCallback(() => {
    setOverrideMode("overview");
  }, []);

  // Global custom event listeners
  useEffect(() => {
    const handleOverview = () => zoomToOverview();
    const handleZoom = () => zoomToReading();

    window.addEventListener("folio:deskoverview", handleOverview);
    window.addEventListener("folio:deskzoom", handleZoom);

    return () => {
      window.removeEventListener("folio:deskoverview", handleOverview);
      window.removeEventListener("folio:deskzoom", handleZoom);
    };
  }, [zoomToOverview, zoomToReading]);

  // Keyboard navigation on desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode === "overview") {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") {
          e.preventDefault();
          zoomToReading();
        }
      } else if (mode === "reading") {
        if (e.key === "Escape") {
          e.preventDefault();
          zoomToOverview();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, zoomToOverview, zoomToReading]);

  const handleArticleClick = (e: MouseEvent<HTMLElement>) => {
    // If clicking a button (like "Open the issue"), allow the button's action to proceed
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    if (mode === "overview") {
      zoomToReading();
    }
  };

  const isOverview = mode === "overview";

  return (
    <section
      className={styles.spread}
      data-folio-spread
      aria-label="Cover"
      data-desk-mode={isReduced ? "reading" : mode}
      tabIndex={-1}
    >
      {/* ── Slot 0 (Left Face): Blonde Wood Table Surface ── */}
      <div className={styles.tableHalf} aria-hidden="true">
        <div className={styles.tableSurface}>
          <div className={styles.tableGrain} />
          <div className={styles.tableLighting} />
          <div className={styles.coffeeRing} />
          <button
            type="button"
            className={styles.deskButton}
            onClick={zoomToOverview}
            aria-label="Zoom out to full desk overview"
            title="Zoom out to full desk overview"
          >
            <span aria-hidden="true">←</span>
            <span>Desk View</span>
          </button>
          <span className={styles.caption}>on the table</span>
        </div>
      </div>

      {/* ── Slot 1 (Right Face): Single Source of Truth Cover Page ── */}
      <div className={styles.magazineHalf}>
        <article
          id="cover"
          data-folio-page="cover"
          className={styles.magazinePage}
          aria-label="Cover"
          onClick={handleArticleClick}
        >
          {/* Stacked paper edge simulation on the right */}
          <div className={styles.paperEdge} />
          {/* Spine crease edge on the left */}
          <div className={styles.spineEdge} />

          {/* Real Cover Page contents (rendered only once) */}
          {children}
        </article>
      </div>

      {/* ── Slot 2 (Overlay Layer): Scandinavian Carpet & Coasters ── */}
      <div className={styles.carpetLayer} aria-hidden="true">
        <ScandinavianCarpet />
      </div>

      <div className={styles.coastersLayer} aria-hidden={!isOverview}>
        {/* Coaster 1: "← Click Me" guiding users to the magazine */}
        <div className={styles.coasterTop}>
          <CorkCoaster onClick={zoomToReading} />
        </div>

        {/* Coaster 2: Overhead ceramic coffee cup */}
        <div className={styles.coasterBottom}>
          <CoffeeCup />
        </div>
      </div>
    </section>
  );
}
