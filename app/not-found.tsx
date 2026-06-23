import Link from "next/link";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main id="main" className={styles.page}>
        <p className={styles.code} aria-hidden="true">404</p>
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.description}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className={styles.homeBtn}>
          Return Home
        </Link>
      </main>
      <Footer />
    </>
  );
}
