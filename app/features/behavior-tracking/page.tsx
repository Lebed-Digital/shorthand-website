import Link from 'next/link';
import type { Metadata } from 'next';
import AnimatedLogo from '../../../components/AnimatedLogo';
import TrackedLink from '../../../components/TrackedLink';
import FeatureNav from '../../../components/FeatureNav';

export const metadata: Metadata = {
  title: 'Never Miss a Student — ShortHand',
  description: 'Color-coded status rings and automatic alerts so no student quietly slips through the cracks. Built for K-12 teachers.',
  alternates: { canonical: 'https://getshorthandapp.com/features/behavior-tracking' },
  openGraph: {
    title: 'Never Miss a Student — ShortHand',
    description: 'Color-coded status rings and automatic alerts so no student quietly slips through the cracks. Built for K-12 teachers.',
    url: 'https://getshorthandapp.com/features/behavior-tracking',
    type: 'website',
    images: [{ url: 'https://getshorthandapp.com/og-image.png', width: 1200, height: 630, alt: 'ShortHand: Built by a teacher, for teachers.' }],
  },
};

export default function NeverMissPage() {
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
          <TrackedLink href="https://app.getshorthandapp.com" className="btn-primary" label="nav_try_free_behavior-tracking">Get ShortHand</TrackedLink>
        </div>
      </nav>

      <Link href="/" className="detail-back">← Back to home</Link>

      <div className="detail-hero">
        <span className="detail-icon">🔴</span>
        <h1 className="detail-title">Never Miss <em>a Student</em></h1>
        <p className="detail-desc">
          Every teacher has a mental list of students they check in on regularly,
          and a few others who quietly go weeks without a real conversation.
          ShortHand makes that invisible problem visible.
        </p>
        <p className="detail-desc">
          Every student card on your roster glows <strong>Green</strong> if you logged today,
          <strong> Amber</strong> if it&apos;s been 5–7 days, and <strong> Red</strong> if it&apos;s been
          8 or more. The dashboard flags anyone you haven&apos;t documented in over 5 days,
          automatically, every time you open the app.
        </p>
        <p className="detail-desc">
          You don&apos;t have to remember who needs attention. The app tells you.
        </p>
        <Link href="/" className="detail-back" style={{ marginTop: '16px' }}>← Back to home</Link>

        <div className="video-frame-wrap" style={{ maxWidth: 360, marginBottom: 80 }}>
          <iframe
            src="https://www.youtube-nocookie.com/embed/kYyhSYiQ4GY?enablejsapi=1"
            title="Never Miss a Student: ShortHand"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      <FeatureNav current="behavior-tracking" />
      <div className="detail-cta-section">
        <h2 className="detail-cta-heading">Ready to try it?</h2>
        <p className="detail-cta-sub">Free to start. Works on any device.</p>
        <TrackedLink href="https://app.getshorthandapp.com" className="btn-primary" label="cta_get_started_behavior-tracking">Get Started Free →</TrackedLink>
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
