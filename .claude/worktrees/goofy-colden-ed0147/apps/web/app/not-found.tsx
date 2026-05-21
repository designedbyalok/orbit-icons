import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ maxWidth: 600, margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem' }}>404</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Page not found</p>
      <Link
        href="/"
        style={{
          display: 'inline-block',
          padding: '0.5rem 1.25rem',
          background: 'var(--accent)',
          color: '#fff',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: 500,
          textDecoration: 'none',
        }}
      >
        Browse all icons
      </Link>
    </main>
  );
}
