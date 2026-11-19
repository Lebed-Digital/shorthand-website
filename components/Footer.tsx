'use client';
import Link from 'next/link';
import { features } from './FeatureNav';

export default function Footer() {
  return (
    <footer>
      <div className="footer-logo">ShortHand</div>
      <div className="footer-tagline">Built by a teacher, for teachers.</div>
      <a href="mailto:info@getshorthandapp.com" className="footer-email">
        info@getshorthandapp.com
      </a>
      <div className="footer-copy">
        Features:{' '}
        {features.map((f, i) => (
          <span key={f.slug}>
            {i > 0 && ' · '}
            <Link href={`/features/${f.slug}`} style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>
              {f.label}
            </Link>
          </span>
        ))}
      </div>
      <div className="footer-copy">
        ShortHand is a product of Lebed Digital LLC.
      </div>
      <div className="footer-copy">
        © 2026 Lebed Digital LLC. All rights reserved. ·{' '}
        <Link href="/tools" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>
          Free Tools
        </Link>{' '}
        ·{' '}
        <Link href="/resources" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>
          Resources
        </Link>{' '}
        ·{' '}
        <Link href="/privacy" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>
          Privacy Policy
        </Link>{' '}
        ·{' '}
        <Link href="/terms" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>
          Terms of Service
        </Link>{' '}
        ·{' '}
        <Link href="/for-schools" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>
          For Schools
        </Link>{' '}
        ·{' '}
        <Link href="/support" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>
          Support
        </Link>{' '}
        ·{' '}
        <Link href="/install" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>
          Get the App
        </Link>{' '}
        ·{' '}
        <Link href="/press" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>
          Press & Mentions
        </Link>{' '}
        ·{' '}
        <a href="https://pulseacademic.com" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>
          Pulse Academic
        </a>{' '}
        ·{' '}
        <a href="https://simpleteacherai.com" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>
          Simple Teacher AI
        </a>
      </div>
    </footer>
  );
}
