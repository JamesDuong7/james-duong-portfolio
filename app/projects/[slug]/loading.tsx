import styles from "./Project.module.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

export default function Loading() {
  return (
    <>
      <Navigation />
      <main className={styles.page}>
        <div style={{ width: '150px', height: '20px', backgroundColor: 'var(--surface-border)', borderRadius: '4px', marginBottom: '3rem', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
        
        <header className={styles.header}>
          <div style={{ width: '70%', height: '48px', backgroundColor: 'var(--surface-border)', borderRadius: '8px', marginBottom: '1rem', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
          <div style={{ width: '100%', height: '80px', backgroundColor: 'var(--surface-border)', borderRadius: '8px', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
        </header>

        <div className={styles.imageGallery}>
           <div className={styles.imageWrapper} style={{ backgroundColor: 'var(--surface-border)', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
        </div>
      </main>
      <Footer />
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .5;
          }
        }
      `}} />
    </>
  );
}
