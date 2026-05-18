'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AnimatedLogo from '../../components/AnimatedLogo';

const btnHover = { scale: 1.04, y: -2 };
const btnTap   = { scale: 0.96 };

export default function HowItWorksPage() {
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
          <motion.a
            href="/install"
            className="btn-primary"
            whileHover={btnHover}
            whileTap={btnTap}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            Get ShortHand
          </motion.a>
        </div>
      </nav>

      <Link href="/" className="detail-back">← Back to home</Link>

      <div className="install-hero">
        <div className="section-label">See It In Action</div>
        <h1 className="install-title">How ShortHand<br /><em>Works</em></h1>
        <p className="install-sub">
          Watch these quick walkthroughs to see ShortHand in action. Setup to first note in under 2 minutes.
        </p>
      </div>

      <div className="section-inner" style={{ maxWidth: 860, margin: '0 auto', padding: '0 1.5rem 4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ position: 'relative', width: '100%', paddingBottom: '177.78%', borderRadius: '1rem', overflow: 'hidden', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <iframe
                src="https://www.youtube.com/embed/dRkj1wg2LT8"
                title="Create an account, add students, and log behavior notes"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              />
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '1rem', marginBottom: '0.3rem' }}>Getting Started</div>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>Create your account, add your students, and start logging behavior notes, all in a couple of minutes.</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ position: 'relative', width: '100%', paddingBottom: '177.78%', borderRadius: '1rem', overflow: 'hidden', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <iframe
                src="https://www.youtube.com/embed/VsuP_59xxT0"
                title="Create a quick note home and email it to the family"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              />
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '1rem', marginBottom: '0.3rem' }}>Sending a Note Home</div>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>Write a quick note to a family and send it as an email, directly from the app, in seconds.</p>
            </div>
          </div>

        </div>
      </div>

      <div className="detail-cta-section" style={{ paddingTop: '1rem' }}>
        <h2 className="detail-cta-heading">Try it yourself.</h2>
        <p className="detail-cta-sub">Free to use. Works on any device. No app store needed.</p>
        <motion.a
          href="/install"
          className="btn-primary"
          whileHover={btnHover}
          whileTap={btnTap}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          Get ShortHand →
        </motion.a>
        <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
          Related: <Link href="/blog/why-teachers-are-switching-from-classdojo-to-shorthand" style={{ color: 'var(--accent, #a78bfa)' }}>Why teachers are switching from ClassDojo in 2026</Link> · <Link href="/blog/free-parent-email-templates-for-teachers" style={{ color: 'var(--accent, #a78bfa)' }}>Free parent email templates</Link>
        </div>
      </div>

      <footer>
        <div className="footer-logo">ShortHand</div>
        <div className="footer-tagline">Built by a teacher, for teachers.</div>
        <a href="mailto:gregorylebed@gmail.com" className="footer-email">gregorylebed@gmail.com</a>
        <div className="footer-copy">© 2026 ShortHand. All rights reserved. · <a href="/privacy" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Privacy Policy</a></div>
      </footer>
    </>
  );
}
