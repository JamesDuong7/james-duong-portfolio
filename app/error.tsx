'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import styles from './not-found.module.css';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" className={styles.page}>
      <p className={styles.code} aria-hidden="true">!</p>
      <h1 className={styles.title}>Something went wrong</h1>
      <p className={styles.description}>
        An unexpected error occurred. You can try again or return to the homepage.
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.retryBtn} onClick={reset}>
          Try Again
        </button>
        <Link href="/" className={styles.homeBtn}>
          Return Home
        </Link>
      </div>
    </main>
  );
}
