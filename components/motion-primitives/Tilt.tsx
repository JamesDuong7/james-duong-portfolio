"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import gsap from "gsap";

export interface TiltProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Maximum tilt angle in degrees. Defaults to 8. */
  maxRotation?: number;
  /** Perspective in pixels. Defaults to 1000. */
  perspective?: number;
  /** Scale on hover. Defaults to 1.02. */
  scale?: number;
  /** Show subtle specular glare reflection tracking the cursor. Defaults to true. */
  glare?: boolean;
  /** Disable tilt effect manually. */
  disabled?: boolean;
}

export default function Tilt({
  children,
  className,
  style,
  maxRotation = 8,
  perspective = 1000,
  scale = 1.02,
  glare = true,
  disabled = false,
}: TiltProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const rotateXTo = useRef<gsap.QuickToFunc | null>(null);
  const rotateYTo = useRef<gsap.QuickToFunc | null>(null);
  const scaleTo = useRef<gsap.QuickToFunc | null>(null);

  const isEnabledRef = useRef(false);
  const [showGlare, setShowGlare] = useState(false);

  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const isReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    isEnabledRef.current = !isCoarse && !isReduced && !disabled;
    if (!isEnabledRef.current) return;

    const card = cardRef.current;
    if (!card) return;

    rotateXTo.current = gsap.quickTo(card, "rotationX", {
      duration: 0.45,
      ease: "power2.out",
    });
    rotateYTo.current = gsap.quickTo(card, "rotationY", {
      duration: 0.45,
      ease: "power2.out",
    });
    scaleTo.current = gsap.quickTo(card, "scale", {
      duration: 0.45,
      ease: "power2.out",
    });

    return () => {
      if (card) gsap.killTweensOf(card);
    };
  }, [disabled]);

  const handleMouseEnter = () => {
    if (!isEnabledRef.current) return;
    scaleTo.current?.(scale);
    if (glare) setShowGlare(true);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isEnabledRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Center offset from -1 to 1
    const offsetX = (x - 0.5) * 2;
    const offsetY = (y - 0.5) * 2;

    rotateYTo.current?.(offsetX * maxRotation);
    rotateXTo.current?.(-offsetY * maxRotation);

    if (glare && glareRef.current) {
      glareRef.current.style.opacity = "0.45";
      glareRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255, 255, 255, 0.22) 0%, transparent 65%)`;
    }
  };

  const handleMouseLeave = () => {
    if (!isEnabledRef.current || !cardRef.current) return;

    rotateXTo.current?.(0);
    rotateYTo.current?.(0);
    scaleTo.current?.(1);

    if (glare && glareRef.current) {
      glareRef.current.style.opacity = "0";
    }
    setShowGlare(false);
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        ...style,
        perspective: `${perspective}px`,
        transformStyle: "preserve-3d",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {children}
        {glare && (
          <div
            ref={glareRef}
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              borderRadius: "inherit",
              opacity: showGlare ? 0.35 : 0,
              transition: "opacity 0.3s ease",
              mixBlendMode: "overlay",
              zIndex: 10,
            }}
          />
        )}
      </div>
    </div>
  );
}
