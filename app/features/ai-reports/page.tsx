import Link from 'next/link';
import type { Metadata } from 'next';
import AnimatedLogo from '../../../components/AnimatedLogo';
import TrackedLink from '../../../components/TrackedLink';
import FeatureNav from '../../../components/FeatureNav';

export const metadata: Metadata = {
  title: 'AI Reports | ShortHand',
  description: 'Turn months of raw classroom notes into polished, parent-ready progress reports in seconds. Your voice, your observations, with the hard part done for you.',
  alternates: { canonical: 'https://getshorthandapp.com/features/ai-reports' },
  openGraph: {
    title: 'AI Reports | ShortHand',
    description: 'Turn months of raw classroom notes into polished, parent-ready progress reports in seconds. Your voice, your observations, with the hard part done for you.',
    url: 'https://getshorthandapp.com/features/ai-reports',
    type: 'website',
    images: [{ url: 'https://getshorthandapp.com/og-image.png', width: 1200, height: 630, alt: 'ShortHand: Built by a teacher, for teachers.' }],
  },
};

export default function AIReportsPage() {
  return (
    <>
      <div className="glow-field" aria-hidden>
        <span className="g1" /><span className="g2" /><span className="g3" />
        <span className="g4" />
        <span className="g5" />
      </div>

      <nav>
        <div className="nav-inner">
          <div className="nav-left">
            <AnimatedLogo />
          </div>
          <TrackedLink href="https://app.getshorthandapp.com" className="btn-primary" label="nav_try_free_ai-reports">Get ShortHand</TrackedLink>
        </div>
      </nav>

      <Link href="/" className="detail-back">← Back to home</Link>

      <div className="detail-hero">
        <span className="detail-icon">📄</span>
        <h1 className="detail-title">AI <em>Reports</em></h1>
        <p className="detail-desc">
          Report writing used to eat entire Sunday evenings. With ShortHand, your notes
          become the source material and AI does the drafting. Select a student, pick a
          format (Quick Note, Standard, or Detailed), and in seconds you have a polished,
          professional write-up ready to review and send.
        </p>
        <p className="detail-desc">
          The AI works only from what you actually logged. Your observations, your language,
          with just the hard part done for you. Not happy with the first draft? Tell it to adjust
          the tone, shorten it, or shift the focus. It rewrites on the spot until it sounds right.
        </p>
        <p className="detail-desc">
          Your voice. Your observations. No more Sunday paperwork.
        </p>

        <div className="video-frame-wrap" style={{ maxWidth: 360, marginBottom: 80 }}>
          <iframe
            src="https://www.youtube-nocookie.com/embed/VsuP_59xxT0?enablejsapi=1&start=21"
            title="AI Reports walkthrough"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <Link href="/" className="detail-back" style={{ marginTop: '16px' }}>← Back to home</Link>
      </div>

      <FeatureNav current="ai-reports" />
      <div className="detail-cta-section">
        <h2 className="detail-cta-heading">Ready to try it?</h2>
        <p className="detail-cta-sub">Free to start. Works on any device.</p>
        <TrackedLink href="https://app.getshorthandapp.com" className="btn-primary" label="cta_get_started_ai-reports">Get Started Free →</TrackedLink>
      </div>

      <footer>
        <div className="footer-logo">ShortHand</div>
        <div className="footer-tagline">Built by a teacher, for teachers.</div>
        <a href="mailto:hello@getshorthandapp.com" className="footer-email">hello@getshorthandapp.com</a>
        <div className="footer-copy">© 2026 ShortHand. All rights reserved.</div>
      </footer>
    </>
  );
}
