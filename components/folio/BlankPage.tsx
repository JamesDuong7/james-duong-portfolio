import styles from "./BlankPage.module.css";

/** Filler leaf so odd page counts still form a facing spread. */
export default function BlankPage() {
  return (
    <div className={styles.page} aria-hidden>
      <span className={styles.mark}>THE FOLIO</span>
    </div>
  );
}
