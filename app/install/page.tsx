'use client';
import Link from 'next/link';
import AnimatedLogo from '../../components/AnimatedLogo';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    { icon: '🌐', text: 'Tap the "Open App" button at the top of this page to open ShortHand in Chrome' },
    { icon: '⋮', text: 'Tap the three-dot menu in the top-right corner' },
    { icon: '➕', text: 'Tap "Add to Home screen"' },
    { icon: '✏️', text: 'Name it "ShortHand" and tap Add' },
    { icon: '🎉', text: 'ShortHand now appears on your home screen like any other app. Tap to open!' },
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
  Android: 'Works best in Chrome. Some Android devices may show "Install app" instead of "Add to Home screen".',
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
            <span className="nav-badge">Built by a Teacher</span>
          </div>
          <a href="https://app.getshorthandapp.com" className="btn-primary">Open App →</a>
        </div>
      </nav>

      <Link href="/" className="detail-back">← Back to home</Link>

      <div className="install-hero">
        <div className="section-label">Free · No App Store · Any Device</div>
        <h1 className="install-title">Add ShortHand<br />to Your <em>Home Screen</em></h1>
        <p className="install-sub">
          ShortHand is a web app. Nothing to download. Follow the steps below
          for your device and it will live on your home screen just like a regular app.
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
            <p className="section-sub">Step-by-step video for iPhone and Android.</p>
          </div>
          <div className="videos-grid">
            {[
              { id: 'vxgDMU3qpn4', title: 'Install on iPhone' },
              { id: 'cJ-PlHk0diw', title: 'Install on Android' },
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
        <a href="https://app.getshorthandapp.com" className="btn-primary">Open ShortHand →</a>
      </div>

      <footer>
        <div className="footer-logo">ShortHand</div>
        <div className="footer-tagline">Built by a teacher, for teachers.</div>
        <a href="mailto:gregorylebed@gmail.com" className="footer-email">gregorylebed@gmail.com</a>
        <div className="footer-copy">© 2026 ShortHand. All rights reserved.</div>
      </footer>
    </>
  );
}
