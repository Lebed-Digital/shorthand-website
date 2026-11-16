'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import styles from './page.module.css';

// Phone-width menu for the test homepage. Same links as the desktop nav,
// modeled on the control homepage menu (app/page.tsx).
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
        aria-controls="modern-mobile-menu"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      {open && (
        <div id="modern-mobile-menu" className={styles.mobileMenu} onClick={() => setOpen(false)}>
          <a href="#features">Features</a>
          <a href="#walkthrough">Walkthrough</a>
          <Link href="/tools">Free tools</Link>
          <Link href="/blog">Blog</Link>
        </div>
      )}
    </>
  );
}
