'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="footer-logo">ShortHand</div>
      <div className="footer-tagline">Built by a teacher, for teachers.</div>
      <a href="mailto:hello@getshorthandapp.com" className="footer-email">
        hello@getshorthandapp.com
      </a>
      <div className="footer-copy">
        © 2026 Lebed Digital LLC. All rights reserved. ·{' '}
        <Link href="/privacy" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>
          Privacy Policy
        </Link>{' '}
        ·{' '}
        <Link href="/terms" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>
          Terms of Service
        </Link>{' '}
        ·{' '}
        <Link href="/install" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>
          Add to Home Screen
        </Link>{' '}
        ·{' '}
        <a href="https://pulseacademic.com" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>
          Pulse Academic
        </a>
      </div>
    </footer>
  );
}
