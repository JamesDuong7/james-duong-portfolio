"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type AnimatedContentProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  container?: Element | string | null;
  distance?: number;
  direction?: "vertical" | "horizontal";
  reverse?: boolean;
  duration?: number;
  ease?: string;
  initialOpacity?: number;
  animateOpacity?: boolean;
  scale?: number;
  threshold?: number;
  delay?: number;
  onComplete?: () => void;
};

// React Bits Animated Content (TS + CSS), adapted for progressive enhancement:
// server-rendered and reduced-motion content stays visible without animation.
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function AnimatedContent({
  children,
  container,
  distance = 100,
  direction = "vertical",
  reverse = false,
  duration = 0.8,
  ease = "power3.out",
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.1,
  delay = 0,
  onComplete,
  className = "",
  style,
  ...props
}: AnimatedContentProps) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(element, { clearProps: "transform,opacity,visibility" });
      onComplete?.();
      return;
    }

    let scrollerTarget: Element | string | null =
      container || document.getElementById("snap-main-container") || null;

    if (typeof scrollerTarget === "string") {
      scrollerTarget = document.querySelector(scrollerTarget);
    }

    const axis = direction === "horizontal" ? "x" : "y";
    const offset = reverse ? -distance : distance;
    const startPercent = (1 - threshold) * 100;

    gsap.set(element, {
      [axis]: offset,
      scale,
      opacity: animateOpacity ? initialOpacity : 1,
      visibility: "visible",
    });

    const timeline = gsap.timeline({ paused: true, delay, onComplete });
    timeline.to(element, {
      [axis]: 0,
      scale: 1,
      opacity: 1,
      duration,
      ease,
      clearProps: "transform,opacity,visibility",
    });

    const scrollTrigger = ScrollTrigger.create({
      trigger: element,
      scroller: scrollerTarget || window,
      start: `top ${startPercent}%`,
      once: true,
      onEnter: () => timeline.play(),
    });

    return () => {
      scrollTrigger.kill();
      timeline.kill();
    };
  }, [
    animateOpacity,
    container,
    delay,
    direction,
    distance,
    duration,
    ease,
    initialOpacity,
    onComplete,
    reverse,
    scale,
    threshold,
  ]);

  return (
    <div ref={ref} className={className} style={style} {...props}>
      {children}
    </div>
  );
}
