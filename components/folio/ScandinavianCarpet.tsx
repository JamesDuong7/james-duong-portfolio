import styles from "./ScandinavianCarpet.module.css";

/**
 * Scandinavian wavy tufted area rug recreating the organic floor curves
 * and warm color palette (Sand, Cream, Mustard Gold) from the reference image.
 */
export default function ScandinavianCarpet() {
  return (
    <div className={styles.carpetContainer} aria-hidden="true">
      <svg
        className={styles.carpetSvg}
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Base Sand Layer */}
        <rect width="1000" height="1000" fill="#c4b099" />

        {/* Soft Oatmeal Wave */}
        <path
          d="M 0,0 C 350,120 520,380 480,720 C 450,950 320,1000 0,1000 Z"
          fill="#dcd2c3"
        />

        {/* Soft Cream / Ecru Swath */}
        <path
          d="M 0,0 C 260,180 380,420 340,780 C 310,950 180,1000 0,1000 Z"
          fill="#f3ede2"
        />

        {/* Warm Mustard Gold / Ochre Accent Wave */}
        <path
          d="M 0,600 C 140,650 280,740 310,880 C 330,970 260,1000 0,1000 Z"
          fill="#c98f32"
        />

        {/* Subtle Dark Gold Contour Lip */}
        <path
          d="M 0,720 C 120,760 210,840 230,960 C 240,1000 120,1000 0,1000 Z"
          fill="#b37c26"
          opacity="0.35"
        />
      </svg>
      <div className={styles.carpetTexture} />
    </div>
  );
}
