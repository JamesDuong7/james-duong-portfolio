import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      gap: '1.5rem',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '4rem', fontWeight: '800', lineHeight: 1 }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>Page Not Found</h2>
      <p style={{ color: 'var(--accent-muted)', maxWidth: '500px' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link 
        href="/" 
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1.5rem',
          border: '1px solid var(--surface-border)',
          borderRadius: '8px',
          fontWeight: 500,
          transition: 'all 0.2s',
          backgroundColor: 'var(--foreground)',
          color: 'var(--background)'
        }}
      >
        Return Home
      </Link>
    </div>
  );
}
