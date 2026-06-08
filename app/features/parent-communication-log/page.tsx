import Link from 'next/link';
import type { Metadata } from 'next';
import AnimatedLogo from '../../../components/AnimatedLogo';
import TrackedLink from '../../../components/TrackedLink';
import FeatureNav from '../../../components/FeatureNav';
import FeatureVideo from '../../../components/FeatureVideo';
import Footer from '../../../components/Footer';

export const metadata: Metadata = {
  title: 'Parent Communication Log | ShortHand',
  description: 'Log every parent call, email, and meeting in seconds. Your full communication history is always ready, so if admin asks, you\'re covered.',
  alternates: { canonical: 'https://getshorthandapp.com/features/parent-communication-log' },
  openGraph: {
    title: 'Parent Communication Log | ShortHand',
    description: 'Log every parent call, email, and meeting in seconds. Your full communication history is always ready, so if admin asks, you\'re covered.',
    url: 'https://getshorthandapp.com/features/parent-communication-log',
    type: 'website',
    images: [{ url: 'https://getshorthandapp.com/og-image.png', width: 1200, height: 630, alt: 'ShortHand: Built by a teacher, for teachers.' }],
  },
};

export default function ParentCommunicationLogPage() {
  return (
    <>
      <nav>
        <div className="nav-inner">
          <div className="nav-left">
            <AnimatedLogo />
          </div>
          <TrackedLink href="https://app.getshorthandapp.com" className="btn-primary" label="nav_try_free_parent-communication-log">Get ShortHand</TrackedLink>
        </div>
      </nav>

      <Link href="/" className="detail-back">← Back to home</Link>

      <div className="detail-hero">
        <h1 className="detail-title">Parent Communication <em>Log</em></h1>
        <p className="detail-desc">
          Every phone call, email, and meeting logged in seconds, timestamped, and
          organized by student. No more searching through sent emails or trying to
          remember when you last reached out.
        </p>
        <p className="detail-desc">
          If admin ever questions whether you contacted a family, you pull up the log
          and show them exactly what happened, when it happened, and what was discussed.
          Your paper trail is always ready.
        </p>
        <p className="detail-desc">
          Mark entries as IEP-related or urgent. Set follow-up reminders with overdue
          warnings. When an IEP meeting comes up, export the full communication history
          formatted and ready to paste into official documents.
        </p>

        <FeatureVideo videoId="5pbtWJCKDjs" title="Parent Communication Log walkthrough" hideControls />

        <Link href="/" className="detail-back" style={{ marginTop: '16px' }}>← Back to home</Link>
      </div>

      <FeatureNav current="parent-communication-log" />
      <div className="detail-cta-section">
        <h2 className="detail-cta-heading">Ready to try it?</h2>
        <p className="detail-cta-sub">Free to start. Works on any device.</p>
        <TrackedLink href="https://app.getshorthandapp.com" className="btn-primary" label="cta_get_started_parent-communication-log">Get Started Free →</TrackedLink>
      </div>

      <Footer />
    </>
  );
}
