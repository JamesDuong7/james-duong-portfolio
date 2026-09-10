import styles from "./CoffeeCup.module.css";

interface CoffeeCupProps {
  className?: string;
}

/**
 * Photorealistic top-down view of a ceramic coffee cup resting on a cork coaster,
 * complete with glazed porcelain rim highlight, espresso crema swirl, and handle.
 */
export default function CoffeeCup({ className = "" }: CoffeeCupProps) {
  return (
    <div className={`${styles.cupContainer} ${className}`} aria-hidden="true">
      {/* Base cork coaster */}
      <div className={styles.coasterBase}>
        <div className={styles.corkGrain} />
      </div>

      {/* Ceramic mug assembly */}
      <div className={styles.mugWrapper}>
        {/* Ceramic handle */}
        <div className={styles.mugHandle} />

        {/* Cup body & rim */}
        <div className={styles.mugBody}>
          <div className={styles.rimGlare} />

          {/* Liquid coffee with crema & latte art */}
          <div className={styles.coffeeSurface}>
            <svg
              className={styles.latteArtSvg}
              viewBox="0 0 80 80"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Warm crema gradients */}
              <radialGradient id="cremaGrad" cx="45%" cy="45%" r="55%">
                <stop offset="0%" stopColor="#7a461e" stopOpacity="0.9" />
                <stop offset="55%" stopColor="#532d13" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#2e1507" stopOpacity="0" />
              </radialGradient>
              <circle cx="40" cy="40" r="38" fill="url(#cremaGrad)" />

              {/* Latte Art Heart / Rosette */}
              {/* Outer soft foam ring */}
              <path
                d="M 40 18 C 30 18 22 28 26 38 C 28 43 35 52 40 58 C 45 52 52 43 54 38 C 58 28 50 18 40 18 Z"
                fill="#deb887"
                opacity="0.32"
                filter="blur(1.5px)"
              />
              {/* Inner velvety foam heart */}
              <path
                d="M 40 22 C 32 22 26 30 30 38 C 32 42 37 49 40 54 C 43 49 48 42 50 38 C 54 30 48 22 40 22 Z"
                fill="#eed9c4"
                opacity="0.82"
              />
              {/* Delicate center highlight feather */}
              <path
                d="M 40 25 C 36 25 32 30 35 36 C 37 39 40 46 40 48 C 40 46 43 39 45 36 C 48 30 44 25 40 25 Z"
                fill="#fff5ea"
                opacity="0.92"
              />
              {/* Stem drop line through center */}
              <path
                d="M 40 20 L 40 56"
                stroke="#c28b53"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.65"
              />
            </svg>
          </div>
        </div>

        {/* Gentle steam wisps */}
        <svg
          className={styles.steamWisp}
          viewBox="0 0 40 60"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 15 55 Q 8 38 22 22 T 18 5"
            fill="none"
            stroke="rgba(255, 255, 255, 0.45)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 25 55 Q 32 40 20 25 T 26 8"
            fill="none"
            stroke="rgba(255, 255, 255, 0.35)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
