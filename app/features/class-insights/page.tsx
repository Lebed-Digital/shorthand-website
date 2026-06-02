import Link from 'next/link';
import type { Metadata } from 'next';
import AnimatedLogo from '../../../components/AnimatedLogo';
import TrackedLink from '../../../components/TrackedLink';
import FeatureNav from '../../../components/FeatureNav';

export const metadata: Metadata = {
  title: 'Progress & Insights | ShortHand',
  description: 'View student behavior trends over 4 to 52 weeks. Smart trend badges show who\'s improving and who needs attention, at a glance.',
  alternates: { canonical: 'https://getshorthandapp.com/features/class-insights' },
  openGraph: {
    title: 'Progress & Insights | ShortHand',
    description: 'View student behavior trends over 4 to 52 weeks. Smart trend badges show who\'s improving and who needs attention, at a glance.',
    url: 'https://getshorthandapp.com/features/class-insights',
    type: 'website',
    images: [{ url: 'https://getshorthandapp.com/og-image.png', width: 1200, height: 630, alt: 'ShortHand: Built by a teacher, for teachers.' }],
  },
};

export default function ProgressInsightsPage() {
  return (
    <>
      <nav>
        <div className="nav-inner">
          <div className="nav-left">
            <AnimatedLogo />
          </div>
          <TrackedLink href="https://app.getshorthandapp.com" className="btn-primary" label="nav_try_free_class-insights">Get ShortHand</TrackedLink>
        </div>
      </nav>

      <Link href="/" className="detail-back">← Back to home</Link>

      <div className="detail-hero">
        <h1 className="detail-title">Progress <em>&amp; Insights</em></h1>
        <p className="detail-desc">
          A single bad day looks like a crisis. The same day inside 8 weeks of data
          looks like a blip. ShortHand gives you the long view.
        </p>
        <p className="detail-desc">
          Dynamic behavior charts let you zoom out to 4 weeks, 8 weeks, a semester, or
          the full year. Smart trend badges tell you at a glance whether a student is
          <strong>Trending Up</strong>, <strong>Needs Attention</strong>, or <strong>Stable</strong>,
          compared to the previous period, not just last week.
        </p>
        <p className="detail-desc">
          Walk into any meeting with a chart that tells the real story. Export as PNG
          or PDF in one tap, ready to paste into a report or share on the spot.
        </p>
        <Link href="/" className="detail-back" style={{ marginTop: '16px' }}>← Back to home</Link>

        <div className="video-frame-wrap" style={{ maxWidth: 360, marginBottom: 80 }}>
          <iframe
            src="https://www.youtube-nocookie.com/embed/LpHWRvwh31k?enablejsapi=1"
            title="Progress and Insights: ShortHand"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      <FeatureNav current="class-insights" />
      <div className="detail-cta-section">
        <h2 className="detail-cta-heading">Ready to try it?</h2>
        <p className="detail-cta-sub">Free to start. Works on any device.</p>
        <TrackedLink href="https://app.getshorthandapp.com" className="btn-primary" label="cta_get_started_class-insights">Get Started Free →</TrackedLink>
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
