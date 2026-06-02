import Link from 'next/link';
import type { Metadata } from 'next';
import AnimatedLogo from '../../../components/AnimatedLogo';
import TrackedLink from '../../../components/TrackedLink';
import FeatureNav from '../../../components/FeatureNav';

export const metadata: Metadata = {
  title: 'Parent Communication | ShortHand',
  description: 'Log every parent call, email, and meeting. One tap exports the full communication history for IEP meetings. ShortHand drafts parent messages from your notes in seconds.',
  alternates: { canonical: 'https://getshorthandapp.com/features/parent-emails' },
  openGraph: {
    title: 'Parent Communication | ShortHand',
    description: 'Log every parent call, email, and meeting. One tap exports the full communication history for IEP meetings. ShortHand drafts parent messages from your notes in seconds.',
    url: 'https://getshorthandapp.com/features/parent-emails',
    type: 'website',
    images: [{ url: 'https://getshorthandapp.com/og-image.png', width: 1200, height: 630, alt: 'ShortHand: Built by a teacher, for teachers.' }],
  },
};

export default function ParentCommunicationPage() {
  return (
    <>
      <nav>
        <div className="nav-inner">
          <div className="nav-left">
            <AnimatedLogo />
          </div>
          <TrackedLink href="https://app.getshorthandapp.com" className="btn-primary" label="nav_try_free_parent-emails">Get ShortHand</TrackedLink>
        </div>
      </nav>

      <Link href="/" className="detail-back">← Back to home</Link>

      <div className="detail-hero">
        <h1 className="detail-title">Parent <em>Communication</em></h1>
        <p className="detail-desc">
          Every phone call, email, meeting, and ParentSquare message logged in one place,
          timestamped, and organized by student. No more searching through sent emails or
          trying to remember when you last reached out.
        </p>
        <p className="detail-desc">
          If admin ever questions whether you contacted a family, you pull up the log and
          show them exactly what happened, when it happened, and what was discussed.
          Your paper trail is always ready.
        </p>
        <p className="detail-desc">
          Mark entries as IEP-related or urgent. Set follow-up reminders with overdue
          warnings. When an IEP meeting comes up, hit <strong>IEP Copy</strong> and the app
          exports the full communication history, formatted and ready to paste into official
          documents. No scrambling. No &quot;I think I emailed them in October.&quot;
        </p>
        <p className="detail-desc">
          Need to reach out but don&apos;t know how to start? ShortHand drafts a clear,
          professional message directly from your notes. You review it, adjust the tone,
          and send.
        </p>

        <div className="video-frame-wrap" style={{ maxWidth: 360, marginBottom: 80 }}>
          <iframe
            src="https://www.youtube-nocookie.com/embed/gu48yZX-res?enablejsapi=1"
            title="Parent Communication walkthrough"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <Link href="/" className="detail-back" style={{ marginTop: '16px' }}>← Back to home</Link>
      </div>

      <FeatureNav current="parent-emails" />
      <div className="detail-cta-section">
        <h2 className="detail-cta-heading">Ready to try it?</h2>
        <p className="detail-cta-sub">Free to start. Works on any device.</p>
        <TrackedLink href="https://app.getshorthandapp.com" className="btn-primary" label="cta_get_started_parent-emails">Get Started Free →</TrackedLink>
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
