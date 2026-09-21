import Link from 'next/link';
import type { Metadata } from 'next';
import AnimatedLogo from '../../../components/AnimatedLogo';
import TrackedLink from '../../../components/TrackedLink';
import FeatureNav from '../../../components/FeatureNav';
import FeatureVideo from '../../../components/FeatureVideo';
import Footer from '../../../components/Footer';

export const metadata: Metadata = {
  title: 'Quick Grid | ShortHand',
  description: 'Tap a student, tap what you saw, and save. ShortHand’s Quick Grid makes classroom behavior notes fast enough to log while you’re still teaching.',
  alternates: { canonical: 'https://getshorthandapp.com/features/quick-note' },
  openGraph: {
    title: 'Quick Grid | ShortHand',
    description: 'Tap a student, tap what you saw, and save. ShortHand’s Quick Grid makes classroom behavior notes fast enough to log while you’re still teaching.',
    url: 'https://getshorthandapp.com/features/quick-note',
    type: 'website',
    images: [{ url: 'https://getshorthandapp.com/og-image.png', width: 1200, height: 630, alt: 'ShortHand: Built by a teacher, for teachers.' }],
  },
};

export default function QuickNotePage() {
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "ShortHand Quick Grid Walkthrough",
    "description": "See how to log a student behavior note in seconds using ShortHand's Quick Grid.",
    "thumbnailUrl": "https://getshorthandapp.com/og-image.png",
    "uploadDate": "2026-04-26T00:00:00+00:00",
    "embedUrl": "https://www.youtube-nocookie.com/embed/7fQrX5eHAsc"
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }} />
      <nav>
        <div className="nav-inner">
          <div className="nav-left">
            <AnimatedLogo />
          </div>
          <TrackedLink href="https://app.getshorthandapp.com" className="btn-primary" label="nav_try_free_quick-note">Get ShortHand</TrackedLink>
        </div>
      </nav>

      <Link href="/" className="detail-back">← Back to home</Link>

      <div className="detail-hero">
        <h1 className="detail-title">Quick <em>Grid</em></h1>
        <p className="detail-desc">
          Open your class and see your students in a simple grid. Tap a student, tap the
          behavior you saw, and hit Save. Need more context? Add a quick note before saving.
          Your most-used indicators are right up front, with more just a swipe away.
        </p>
        <p className="detail-desc">
          Most notes take just a few taps, so you can document what happened and get right
          back to teaching. When you need more detail, open Full Note from the same screen
          and write as much as you need. Either way, every note is dated and saved to that
          student&apos;s record.
        </p>
        <p className="detail-desc">
          The faster it is to log, the more likely you are to actually do it. Over time,
          those quick notes give you a clearer picture of each student and better information
          for parent conversations, meetings, and reports.
        </p>

        <FeatureVideo videoId="7fQrX5eHAsc" title="Quick Grid walkthrough" hideControls />

        <Link href="/" className="detail-back" style={{ marginTop: '16px' }}>← Back to home</Link>
      </div>

      <FeatureNav current="quick-note" />
      <div className="detail-cta-section">
        <h2 className="detail-cta-heading">Ready to try it?</h2>
        <p className="detail-cta-sub">Free to start. Works on any device.</p>
        <TrackedLink href="https://app.getshorthandapp.com" className="btn-primary" label="cta_get_started_quick-note">Get Started Free →</TrackedLink>
      </div>

      <Footer />
    </>
  );
}
