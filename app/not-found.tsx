import type { Metadata } from 'next';
import Link from 'next/link';
import AnimatedLogo from '../components/AnimatedLogo';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'Page not found | ShortHand',
};

const links = [
  { href: '/', label: 'Home' },
  { href: 'https://app.getshorthandapp.com/?demo=true', label: 'Try the free demo' },
  { href: '/tools', label: 'Free teacher tools' },
  { href: '/blog', label: 'Blog' },
];

export default function NotFound() {
  return (
    <>
      <nav>
        <div className="nav-inner">
          <div className="nav-left">
            <AnimatedLogo />
          </div>
          <div className="nav-links">
            <Link href="/#features" className="nav-link">Features</Link>
            <Link href="/blog" className="nav-link">Blog</Link>
          </div>
          <Link href="https://app.getshorthandapp.com/?demo=true" className="btn-primary">Get ShortHand</Link>
        </div>
      </nav>

      <main style={{ maxWidth: '780px', margin: '0 auto', padding: '6rem 1.5rem 5rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
          404
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.25rem' }}>
          Sorry, that page isn&apos;t here.
        </h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '620px' }}>
          The link may be old, or the address may have a typo. One of these should get you where you were going.
        </p>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                display: 'block',
                padding: '1.1rem 1.5rem',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
                color: 'var(--text)',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              {l.label} →
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
