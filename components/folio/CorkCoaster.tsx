"use client";

import type { KeyboardEvent } from "react";
import Magnetic from "@/components/motion-primitives/Magnetic";
import styles from "./CorkCoaster.module.css";

interface CorkCoasterProps {
  onClick?: () => void;
  className?: string;
}

/**
 * Photorealistic circular cork coaster with an editorial graphic stamp
 * and directional arrow pointing left towards the magazine.
 */
export default function CorkCoaster({ onClick, className = "" }: CorkCoasterProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <Magnetic intensity={0.25} duration={0.6}>
      <button
        type="button"
        className={`${styles.coasterWrapper} ${className}`}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        aria-label="Inspect portfolio magazine"
        title="Inspect portfolio magazine"
      >
        <div className={styles.coasterDisk}>
          {/* Speckled natural cork flecks */}
          <div className={styles.corkGrain} />

          {/* Concentric editorial stamped seal rings */}
          <svg
            className={styles.stampSvg}
            viewBox="0 0 160 160"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer dashed rim stamp */}
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="#3a2211"
              strokeWidth="1.5"
              strokeDasharray="3 3.5"
              opacity="0.6"
            />
            {/* Inner solid rim stamp */}
            <circle
              cx="80"
              cy="80"
              r="64"
              fill="none"
              stroke="#3a2211"
              strokeWidth="1"
              opacity="0.45"
            />
            {/* Curved text along top */}
            <path
              id="corkTextTop"
              d="M 28 80 A 52 52 0 0 1 132 80"
              fill="none"
            />
            <text
              fill="#3a2211"
              fontSize="7.5"
              fontFamily="var(--folio-font-mono, monospace)"
              letterSpacing="0.22em"
              opacity="0.8"
            >
              <textPath href="#corkTextTop" startOffset="50%" textAnchor="middle">
                PORTFOLIO • ISSUE 01
              </textPath>
            </text>
            {/* Curved text along bottom */}
            <path
              id="corkTextBottom"
              d="M 132 80 A 52 52 0 0 1 28 80"
              fill="none"
            />
            <text
              fill="#3a2211"
              fontSize="7.5"
              fontFamily="var(--folio-font-mono, monospace)"
              letterSpacing="0.22em"
              opacity="0.8"
            >
              <textPath href="#corkTextBottom" startOffset="50%" textAnchor="middle">
                TAP TO INSPECT
              </textPath>
            </text>
          </svg>

          {/* Center callout label */}
          <div className={styles.stampCenter}>
            <span className={styles.stampArrow} aria-hidden="true">
              ←
            </span>
            <span className={styles.stampText}>Click Me</span>
            <span className={styles.stampSub}>Open Book</span>
          </div>
        </div>
      </button>
    </Magnetic>
  );
}
