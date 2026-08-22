'use client';
import Link from 'next/link';
import Image from 'next/image';
import AnimatedLogo from '../../components/AnimatedLogo';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.lebeddigital.shorthand';

const tabs = ['iPhone', 'Android', 'Desktop'] as const;
type Tab = typeof tabs[number];

const steps: Record<Tab, { icon: string; text: string }[]> = {
  iPhone: [
    { icon: '🌐', text: 'Tap the "Open App" button at the top of this page to open ShortHand in Safari' },
    { icon: '📤', text: 'Tap the Share button at the bottom of the screen (the box with an arrow pointing up)' },
    { icon: '➕', text: 'Scroll down and tap "Add to Home Screen"' },
    { icon: '✏️', text: 'Name it "ShortHand" and tap Add' },
    { icon: '🎉', text: 'ShortHand now appears on your home screen like any other app. Tap to open!' },
  ],
  Android: [
    { icon: '▶️', text: 'Tap the "Get it on Google Play" badge above to open the ShortHand listing' },
    { icon: '⬇️', text: 'Tap Install and wait for the download to finish' },
    { icon: '🎉', text: 'ShortHand appears in your app drawer and on your home screen. Tap to open!' },
  ],
  Desktop: [
    { icon: '🌐', text: 'Click the "Open App" button at the top of this page to open ShortHand in your browser' },
    { icon: '⬇️', text: 'Look for the install icon in the address bar (a computer with a down arrow), then click it' },
    { icon: '➕', text: 'Click "Install" in the prompt that appears' },
    { icon: '🎉', text: 'ShortHand opens as its own window and appears in your taskbar or dock. No browser needed!' },
  ],
};

const notes: Record<Tab, string> = {
  iPhone: 'Must use Safari. Chrome on iPhone does not support Add to Home Screen.',
  Android: 'Prefer not to use the Play Store? You can still install from the browser: open ShortHand in Chrome, tap the three-dot menu, then tap "Add to Home screen". Some devices show "Install app" instead.',
  Desktop: 'Works in Chrome and Edge. Firefox does not support PWA install.',
};

export default function InstallPage() {
  const [active, setActive] = useState<Tab>('iPhone');

  return (
    <>
      <div className="glow-field" aria-hidden>
        <span className="g1" /><span className="g2" /><span className="g3" />
        <span className="g4" /><span className="g5" />
      </div>

      <nav>
        <div className="nav-inner">
          <div className="nav-left">
            <AnimatedLogo />
          </div>
          <a href="https://app.getshorthandapp.com?demo=true" className="btn-primary">Open App →</a>
        </div>
      </nav>

      <Link href="/" className="detail-back">← Back to home</Link>

      <div className="install-hero">
        <div className="section-label">Works on Any Device · Free to Start</div>
        <h1 className="install-title">Add ShortHand<br />to Your <em>Home Screen</em></h1>
        <p className="install-sub">
          On Android, get ShortHand from Google Play. On iPhone and desktop, it installs
          straight from your browser. Follow the steps below for your device and it will
          live on your home screen just like a regular app.
        </p>
      </div>

      <div className="install-tabs-wrap">
        <div className="install-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`install-tab${active === tab ? ' install-tab--active' : ''}`}
              onClick={() => setActive(tab)}
            >
              {tab === 'iPhone' && '🍎 '}
              {tab === 'Android' && '🤖 '}
              {tab === 'Desktop' && '💻 '}
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="install-steps"
          >
            {active === 'Android' && (
              <a href={PLAY_STORE_URL} className="install-play-badge">
                <Image
                  src="/badges/google-play-badge.png"
                  alt="Get it on Google Play"
                  width={206}
                  height={80}
                  priority
                />
              </a>
            )}

            {steps[active].map((step, i) => (
              <div key={i} className="install-step">
                <div className="install-step-num">{i + 1}</div>
                <div className="install-step-icon">{step.icon}</div>
                <p className="install-step-text">{step.text}</p>
              </div>
            ))}

            <div className="install-note">
              <span className="install-note-label">Note:</span> {notes[active]}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="videos-section" style={{ paddingTop: '3rem' }}>
        <div className="section-inner">
          <div className="videos-header">
            <div className="section-label">Install Walkthrough</div>
            <h2 className="section-heading">Watch the Install</h2>
            <p className="section-sub">Step-by-step video for adding ShortHand to your iPhone home screen.</p>
          </div>
          <div className="videos-grid">
            {[
              // Android is not here on purpose: it installs from Google Play now,
              // so the badge above replaces the old home-screen walkthrough.
              { id: 'fef65Q9xlvk', title: 'Install on iPhone' },
            ].map((v) => (
              <div key={v.id} className="video-card">
                <div className="video-frame-wrap">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${v.id}?enablejsapi=1`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <div className="video-title">{v.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="detail-cta-section">
        <h2 className="detail-cta-heading">Ready to open the app?</h2>
        <p className="detail-cta-sub">Free to start. Works on any device.</p>
        <a href="https://app.getshorthandapp.com?demo=true" className="btn-primary">Open ShortHand →</a>
      </div>

      <footer>
        <div className="footer-logo">ShortHand</div>
        <div className="footer-tagline">Built by a teacher, for teachers.</div>
        <a href="mailto:info@getshorthandapp.com" className="footer-email">info@getshorthandapp.com</a>
        <div className="footer-copy">© 2026 ShortHand. All rights reserved. · <a href="https://simpleteacherai.com" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Simple Teacher AI</a></div>
      </footer>
    </>
  );
}
