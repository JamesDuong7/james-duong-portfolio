"use client";

import { useState, type CSSProperties } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface TextRollProps {
  children: string;
  className?: string;
  style?: CSSProperties;
  /** Transition duration per character in seconds. Defaults to 0.38s. */
  duration?: number;
  /** Stagger delay between characters in seconds. Defaults to 0.018s. */
  stagger?: number;
}

export default function TextRoll({
  children,
  className,
  style,
  duration = 0.38,
  stagger = 0.018,
}: TextRollProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isReduced = useReducedMotion();

  const chars = children.split("");

  return (
    <span
      className={className}
      style={{
        ...style,
        position: "relative",
        display: "inline-flex",
        overflow: "hidden",
        verticalAlign: "bottom",
        lineHeight: 1,
        cursor: "inherit",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {/* Accessible Name for Screen Readers & Test Locators */}
      <span
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {children}
      </span>

      {/* Visual Rolling Characters */}
      <span aria-hidden="true" style={{ display: "inline-flex" }}>
        {chars.map((char, index) => {
          if (char === " ") {
            return (
              <span key={index} style={{ width: "0.28em" }}>
                &nbsp;
              </span>
            );
          }

          const delay = isHovered
            ? `${index * stagger}s`
            : `${(chars.length - 1 - index) * (stagger * 0.6)}s`;

          return (
            <span
              key={index}
              style={{
                position: "relative",
                display: "inline-block",
                height: "1em",
                overflow: "hidden",
              }}
            >
              {/* Primary character sliding up */}
              <span
                style={{
                  display: "block",
                  transform:
                    isHovered && !isReduced
                      ? "translateY(-100%)"
                      : "translateY(0%)",
                  transition: isReduced
                    ? "none"
                    : `transform ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}`,
                }}
              >
                {char}
              </span>
              {/* Secondary character sliding in from bottom */}
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  display: "block",
                  transform:
                    isHovered && !isReduced
                      ? "translateY(0%)"
                      : "translateY(100%)",
                  transition: isReduced
                    ? "none"
                    : `transform ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}`,
                }}
              >
                {char}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
