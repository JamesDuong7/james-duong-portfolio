"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./BorderBeam.module.css";

export interface BorderBeamProps {
  className?: string;
  style?: CSSProperties;
  /** Size of the beam in pixels. Defaults to 160. */
  size?: number;
  /** Duration of a complete perimeter loop in seconds. Defaults to 12s. */
  duration?: number;
  /** Delay before animation starts in seconds. Defaults to 0. */
  delay?: number;
  /** Primary glow color. Defaults to folio pink. */
  colorFrom?: string;
  /** Secondary glow color. Defaults to transparent. */
  colorTo?: string;
  /** Border radius in pixels. Defaults to 4. */
  borderRadius?: number;
  /** Stroke width in pixels. Defaults to 1.5. */
  strokeWidth?: number;
}

export default function BorderBeam({
  className,
  style,
  duration = 12,
  delay = 0,
  colorFrom = "var(--folio-pink, #f2338c)",
  colorTo = "rgba(242, 51, 140, 0.05)",
  borderRadius = 4,
  strokeWidth = 1.5,
}: BorderBeamProps) {
  const isReduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDims({
          width: Math.round(entry.contentRect.width),
          height: Math.round(entry.contentRect.height),
        });
      }
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (isReduced) return null;

  const perimeter = 2 * (dims.width + dims.height);
  const beamLength = Math.max(perimeter * 0.22, 120);

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${className || ""}`}
      style={{
        ...style,
        borderRadius: `${borderRadius}px`,
      }}
      aria-hidden
    >
      {dims.width > 0 && dims.height > 0 && (
        <svg
          width="100%"
          height="100%"
          className={styles.svg}
        >
          <defs>
            <linearGradient
              id="folioBeamGrad"
              gradientUnits="userSpaceOnUse"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={colorFrom} stopOpacity="0.85" />
              <stop offset="60%" stopColor={colorTo} stopOpacity="0.25" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect
            className={styles.rect}
            x={strokeWidth / 2}
            y={strokeWidth / 2}
            width={Math.max(dims.width - strokeWidth, 0)}
            height={Math.max(dims.height - strokeWidth, 0)}
            rx={borderRadius}
            ry={borderRadius}
            fill="none"
            stroke="url(#folioBeamGrad)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${beamLength} ${Math.max(perimeter - beamLength, 0)}`}
            style={{
              ["--folio-beam-duration" as string]: `${duration}s`,
              ["--folio-beam-offset" as string]: `-${perimeter}px`,
              animationDelay: `-${delay}s`,
            }}
          />
        </svg>
      )}
    </div>
  );
}
