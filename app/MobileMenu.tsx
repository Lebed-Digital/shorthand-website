'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import styles from './page.module.css';
import { fireCtaClick } from '../lib/gtag';
import SignInLink from './SignInLink';

// Phone-width menu for the homepage (app/page.tsx).
// Same links as the desktop nav, plus Sign in. The nav bar hides its own Sign
// in below 520px, so the menu always carries one (on tablets it shows in both).
export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className={styles.menuButton}
        onClick={() => setOpen(o => !o)}
        aria-label="Menu"
        aria-expanded={open}
        aria-controls="home-mobile-menu"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      {open && (
        <div id="home-mobile-menu" className={styles.mobileMenu} onClick={() => setOpen(false)}>
          <a href="#features">Features</a>
          <a href="#walkthrough" onClick={() => fireCtaClick({ cta_source: 'homepage', cta_destination: 'hero_see_how_it_works', link_url: '#walkthrough' })}>Walkthrough</a>
          <Link href="/tools">Free tools</Link>
          <Link href="/blog">Blog</Link>
          <SignInLink />
        </div>
      )}
    </>
  );
}
