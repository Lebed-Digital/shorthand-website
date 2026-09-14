'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import AnimatedLogo from './AnimatedLogo';

export default function BlogNav({ showLibraryCta }: { showLibraryCta: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav>
      <div className="nav-inner">
        <div className="nav-left">
          <AnimatedLogo />
        </div>
        <div className="nav-links">
          <Link href="/#features" className="nav-link">Features</Link>
          <Link href="/blog" className="nav-link">Blog</Link>
          <Link href="/tools" className="nav-link" style={{ color: '#22c55e', fontWeight: 700 }}>Tools</Link>
          <Link href="/resources" className="nav-link">Resources</Link>
        </div>
        <div className="nav-right">
          {showLibraryCta ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link href="https://app.getshorthandapp.com?demo=true" className="nav-link">Get ShortHand</Link>
              <Link href="/report-card-comment-library" className="btn-primary">Comment library: $4.99</Link>
            </div>
          ) : (
            <Link href="https://app.getshorthandapp.com?demo=true" className="btn-primary">Get ShortHand</Link>
          )}
          <button className="nav-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="nav-mobile-menu" onClick={() => setMenuOpen(false)}>
          <Link href="/#features" className="nav-mobile-link">Features</Link>
          <Link href="/blog" className="nav-mobile-link">Blog</Link>
          <Link href="/tools" className="nav-mobile-link" style={{ color: '#22c55e', fontWeight: 700 }}>Tools</Link>
          <Link href="/resources" className="nav-mobile-link">Resources</Link>
          {showLibraryCta && (
            <Link href="/report-card-comment-library" className="nav-mobile-link">Comment library: $4.99</Link>
          )}
          <Link href="https://app.getshorthandapp.com?demo=true" className="nav-mobile-link nav-mobile-cta">Get ShortHand →</Link>
        </div>
      )}
    </nav>
  );
}
