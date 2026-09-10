"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface BlurFadeProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  duration?: number;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
  blur?: string;
  style?: CSSProperties;
}

export default function BlurFade({
  children,
  as: Component = "div",
  className,
  duration = 0.55,
  delay = 0,
  yOffset = 12,
  inView = true,
  blur = "8px",
  style,
}: BlurFadeProps) {
  const ref = useRef<HTMLElement>(null);
  const isReduced = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isReduced) {
      return;
    }

    if (!inView) {
      return;
    }

    const raf = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => cancelAnimationFrame(raf);
  }, [inView, isReduced]);

  const activeVisible = isReduced || isVisible;

  return (
    <Component
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: activeVisible ? 1 : 0,
        filter: activeVisible ? "blur(0px)" : `blur(${blur})`,
        transform: activeVisible
          ? "translateY(0px)"
          : `translateY(${yOffset}px)`,
        transition: isReduced
          ? "none"
          : `opacity ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, ` +
            `filter ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, ` +
            `transform ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
        willChange: activeVisible ? "auto" : "opacity, filter, transform",
      }}
    >
      {children}
    </Component>
  );
}
