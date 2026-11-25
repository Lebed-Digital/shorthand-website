'use client';
import Link from 'next/link';
import { features } from './FeatureNav';

// Shared site footer, organized into labeled columns. Colors come only from
// the global tokens (--text, --text-dim, --text-fine, --border), so the same
// markup works on the dark inner pages and on the light homepage, which sets
// light token values around it in app/page.module.css.
const COLUMNS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: 'Features',
    links: features.map(f => ({ href: `/features/${f.slug}`, label: f.label })),
  },
  {
    heading: 'Free for teachers',
    links: [
      { href: '/tools', label: 'Free Tools' },
      { href: '/resources', label: 'Resources' },
      { href: '/blog', label: 'Blog' },
    ],
  },
  {
    heading: 'ShortHand',
    links: [
      { href: '/pricing', label: 'Pricing' },
      { href: '/install', label: 'Get the App' },
      { href: '/for-schools', label: 'For Schools' },
      { href: '/about', label: 'About' },
      { href: '/press', label: 'Press & Mentions' },
      { href: '/support', label: 'Support' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <Link href="/" className="footer-logo">ShortHand</Link>
          <div className="footer-tagline">Built by a teacher, for teachers.</div>
          <a href="mailto:info@getshorthandapp.com" className="footer-email">
            info@getshorthandapp.com
          </a>
        </div>
        {/* role, not <nav>: the global nav rule would make it sticky. */}
        <div className="site-footer-columns" role="navigation" aria-label="Footer">
          {COLUMNS.map(col => (
            <div key={col.heading} className="site-footer-col">
              <h2 className="site-footer-heading">{col.heading}</h2>
              <ul>
                {col.links.map(l => (
                  <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="site-footer-bottom">
        <span>ShortHand is a product of Lebed Digital LLC. © 2026 Lebed Digital LLC. All rights reserved.</span>
        <span>
          <a href="https://pulseacademic.com">Pulse Academic</a>
          {' · '}
          <a href="https://www.simpleteacherai.com/">Simple Teacher AI</a>
        </span>
      </div>
    </footer>
  );
}
