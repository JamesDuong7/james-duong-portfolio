import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main id="main" className={styles.page}>
      <p className={styles.mast}>JD. / VOL. 01</p>
      <p className={styles.code} aria-hidden="true">
        404
      </p>
      <h1 className={styles.title}>Page Not Found</h1>
      <p className={styles.description}>
        This spread is missing from the folio — or the page has moved.
      </p>
      <Link href="/" className={styles.homeBtn}>
        Return Home
      </Link>
    </main>
  );
}
