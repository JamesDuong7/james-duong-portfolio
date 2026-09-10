"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";

type SplitTextProps = React.HTMLAttributes<HTMLSpanElement> & {
  text: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  ease?: string;
  className?: string;
  onComplete?: () => void;
};

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * SplitText — React Bits component adapted for the Folio editorial system.
 *
 * Splitting text by words with inline-block spans. Full text is declared via
 * `aria-label` so screen readers hear one continuous word or sentence rather
 * than disjointed tokens.
 *
 * Reduced-motion users receive static text immediately with zero animation delay.
 */
export default function SplitText({
  text,
  delay = 0,
  duration = 0.55,
  stagger = 0.04,
  ease = "power2.out",
  className = "",
  style,
  onComplete,
  ...props
}: SplitTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  const words = useMemo(() => {
    return text.split(/\s+/).filter(Boolean);
  }, [text]);

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onComplete?.();
      return;
    }

    const wordEls = container.querySelectorAll<HTMLElement>("[data-split-word]");
    if (wordEls.length === 0) return;

    gsap.set(wordEls, {
      opacity: 0,
      y: 14,
      display: "inline-block",
    });

    const ctx = gsap.context(() => {
      gsap.to(wordEls, {
        opacity: 1,
        y: 0,
        duration,
        stagger,
        delay,
        ease,
        clearProps: "transform,opacity",
        onComplete,
      });
    }, container);

    return () => ctx.revert();
  }, [words, delay, duration, stagger, ease, onComplete]);

  return (
    <span
      ref={containerRef}
      className={className}
      style={{ display: "inline-block", ...style }}
      aria-label={text}
      {...props}
    >
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          data-split-word
          style={{ display: "inline-block", marginRight: "0.28em" }}
          aria-hidden="true"
        >
          {word}
        </span>
      ))}
    </span>
  );
}
