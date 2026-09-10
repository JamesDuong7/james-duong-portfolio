"use client";

import {
  useEffect,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import gsap from "gsap";

export interface MagneticProps {
  children: ReactNode;
  /** Strength of the magnetic pull (0.1 = subtle, 0.5 = strong). Defaults to 0.3. */
  intensity?: number;
  /** Spring return duration in seconds. Defaults to 0.7. */
  duration?: number;
  /** Spring return GSAP easing function. Defaults to elastic snap. */
  ease?: string;
  /** Optional class name for the wrapper. */
  className?: string;
  /** Disable the magnetic effect manually. */
  disabled?: boolean;
}

export default function Magnetic({
  children,
  intensity = 0.3,
  duration = 0.7,
  ease = "elastic.out(1.1, 0.4)",
  className,
  disabled = false,
}: MagneticProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);
  const isEnabledRef = useRef(false);

  useEffect(() => {
    // Disable on touch devices or if user prefers reduced motion
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const isReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    isEnabledRef.current = !isCoarse && !isReduced && !disabled;
    if (!isEnabledRef.current) return;

    const el = elementRef.current;
    if (!el) return;

    xTo.current = gsap.quickTo(el, "x", {
      duration: 0.38,
      ease: "power3.out",
    });
    yTo.current = gsap.quickTo(el, "y", {
      duration: 0.38,
      ease: "power3.out",
    });

    return () => {
      if (el) {
        gsap.killTweensOf(el);
      }
    };
  }, [disabled]);

  const handleMouseMove = (e: MouseEvent<HTMLSpanElement>) => {
    if (!isEnabledRef.current || !elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) * intensity;
    const distanceY = (e.clientY - centerY) * intensity;

    xTo.current?.(distanceX);
    yTo.current?.(distanceY);
  };

  const handleMouseLeave = () => {
    if (!isEnabledRef.current || !elementRef.current) return;

    gsap.to(elementRef.current, {
      x: 0,
      y: 0,
      duration,
      ease,
      overwrite: "auto",
    });
  };

  return (
    <span
      ref={elementRef}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "inherit",
        justifyContent: "inherit",
        width: "inherit",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </span>
  );
}
