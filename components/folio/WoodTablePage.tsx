"use client";

import styles from "./WoodTablePage.module.css";

interface WoodTablePageProps {
  onBackToDesk?: () => void;
}

/**
 * Blonde birch/maple wooden table page for the left half of the cover spread.
 * Provides seamless continuity from the desk scene and offers an affordance
 * to zoom back out to the full table overview.
 */
export default function WoodTablePage({ onBackToDesk }: WoodTablePageProps) {
  const handleClickDesk = () => {
    if (onBackToDesk) {
      onBackToDesk();
    } else {
      window.dispatchEvent(new CustomEvent("folio:deskoverview"));
    }
  };

  return (
    <div className={styles.table} aria-hidden="true">
      <div className={styles.grain} />
      <div className={styles.coffeeRing} />
      <button
        type="button"
        className={styles.deskButton}
        onClick={handleClickDesk}
        aria-label="Zoom out to desk overview"
        title="Zoom out to desk overview"
      >
        <span aria-hidden="true">←</span>
        <span>Desk View</span>
      </button>
      <span className={styles.caption}>on the table</span>
    </div>
  );
}
