'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer>
      <div className="footer-logo">ShortHand</div>
      <div className="footer-tagline">Built by a teacher, for teachers.</div>
      <a href="mailto:info@getshorthandapp.com" className="footer-email">
        info@getshorthandapp.com
      </a>
      <a
        href="https://saasbrowser.com/en/case-studies/1540632/shorthand"
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'inline-block', margin: '1.25rem 0 0.5rem' }}
        aria-label="Read the ShortHand case study on SaaS Browser"
      >
        <Image
          src="/saas-browser-badge-14.svg"
          alt="Featured on SaaS Browser"
          width={171}
          height={60}
        />
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
