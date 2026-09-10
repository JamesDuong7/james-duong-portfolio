"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
  type ReactNode,
} from "react";
import gsap from "gsap";
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

  const isOverview = mode === "overview";

  const coastersRef = useRef<HTMLDivElement>(null);
  const lightingRef = useRef<HTMLDivElement>(null);
  const magazineRef = useRef<HTMLElement>(null);

  const quickCoastersX = useRef<gsap.QuickToFunc | null>(null);
  const quickCoastersY = useRef<gsap.QuickToFunc | null>(null);
  const quickLightingX = useRef<gsap.QuickToFunc | null>(null);
  const quickLightingY = useRef<gsap.QuickToFunc | null>(null);
  const quickMagX = useRef<gsap.QuickToFunc | null>(null);
  const quickMagY = useRef<gsap.QuickToFunc | null>(null);

  // Subtle cursor-driven micro-parallax in desk overview mode
  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const isNarrow = window.matchMedia("(max-width: 900px)").matches;
    const coastersEl = coastersRef.current;
    const lightingEl = lightingRef.current;
    const magazineEl = magazineRef.current;

    if (isCoarse || isNarrow || isReduced || mode !== "overview") {
      if (coastersEl) gsap.to(coastersEl, { x: 0, y: 0, duration: 0.4 });
      if (lightingEl) gsap.to(lightingEl, { x: 0, y: 0, duration: 0.4 });
      if (magazineEl) gsap.to(magazineEl, { x: 0, y: 0, duration: 0.4 });
      return;
    }

    if (coastersEl) {
      quickCoastersX.current = gsap.quickTo(coastersEl, "x", {
        duration: 0.6,
        ease: "power2.out",
      });
      quickCoastersY.current = gsap.quickTo(coastersEl, "y", {
        duration: 0.6,
        ease: "power2.out",
      });
    }

    if (lightingEl) {
      quickLightingX.current = gsap.quickTo(lightingEl, "x", {
        duration: 0.8,
        ease: "power2.out",
      });
      quickLightingY.current = gsap.quickTo(lightingEl, "y", {
        duration: 0.8,
        ease: "power2.out",
      });
    }

    if (magazineEl) {
      quickMagX.current = gsap.quickTo(magazineEl, "x", {
        duration: 0.5,
        ease: "power2.out",
      });
      quickMagY.current = gsap.quickTo(magazineEl, "y", {
        duration: 0.5,
        ease: "power2.out",
      });
    }

    const handlePointerMove = (e: PointerEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const offsetX = (e.clientX / w - 0.5) * 2;
      const offsetY = (e.clientY / h - 0.5) * 2;

      quickCoastersX.current?.(offsetX * 8);
      quickCoastersY.current?.(offsetY * 6);
      quickLightingX.current?.(offsetX * 14);
      quickLightingY.current?.(offsetY * 10);
      quickMagX.current?.(offsetX * 4);
      quickMagY.current?.(offsetY * 3);
    };

    const handlePointerLeave = () => {
      quickCoastersX.current?.(0);
      quickCoastersY.current?.(0);
      quickLightingX.current?.(0);
      quickLightingY.current?.(0);
      quickMagX.current?.(0);
      quickMagY.current?.(0);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      if (coastersEl) gsap.killTweensOf(coastersEl);
      if (lightingEl) gsap.killTweensOf(lightingEl);
      if (magazineEl) gsap.killTweensOf(magazineEl);
    };
  }, [isReduced, mode]);

  const handleArticleClick = (e: MouseEvent<HTMLElement>) => {
    // If clicking a button (like "Open the issue"), allow the button's action to proceed
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    if (mode === "overview") {
      zoomToReading();
    }
  };

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
          <div ref={lightingRef} className={styles.tableLighting} />
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
          ref={magazineRef}
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

      <div
        ref={coastersRef}
        className={styles.coastersLayer}
        aria-hidden={!isOverview}
      >
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
