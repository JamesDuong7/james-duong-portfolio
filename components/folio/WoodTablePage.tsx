import styles from "./WoodTablePage.module.css";

/**
 * Decorative left "page" for the cover spread — a brown wooden table so the
 * closed magazine reads as an object resting on a desk. Purely visual.
 */
export default function WoodTablePage() {
  return (
    <div className={styles.table} aria-hidden="true">
      <div className={styles.grain} />
      <div className={styles.coffeeRing} />
      <span className={styles.caption}>on the table</span>
    </div>
  );
}
