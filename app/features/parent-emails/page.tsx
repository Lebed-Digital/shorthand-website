import Link from 'next/link';
import type { Metadata } from 'next';
import AnimatedLogo from '../../../components/AnimatedLogo';
import TrackedLink from '../../../components/TrackedLink';
import FeatureNav from '../../../components/FeatureNav';

export const metadata: Metadata = {
  title: 'AI Parent Emails | ShortHand',
  description: 'Turn behavior notes into parent-ready emails in seconds. ShortHand drafts the message, fills in the subject line, and even adds the parent email address. You just hit send.',
  alternates: { canonical: 'https://getshorthandapp.com/features/parent-emails' },
  openGraph: {
    title: 'AI Parent Emails | ShortHand',
    description: 'Turn behavior notes into parent-ready emails in seconds. ShortHand drafts the message, fills in the subject line, and even adds the parent email address. You just hit send.',
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
        <h1 className="detail-title">Parent <em>Emails</em></h1>
        <p className="detail-desc">
          Turn behavior notes into parent-ready messages in seconds. Log what happened during the day, and ShortHand uses those notes to generate a quick note home or a detailed report, ready to email, copy, or print.
        </p>
        <p className="detail-desc">
          No staring at a blank email after a long day. ShortHand writes the message for you: clear, professional, and based on exactly what you observed. You review it, make any adjustments, and send.
        </p>
        <p className="detail-desc">
          ShortHand even fills in the parent email address, subject line, and body of the email automatically. All you have to do is hit send.
        </p>
        <p className="detail-desc">
          Need something more formal? Generate a full written report from the same notes, formatted and ready to attach to an IEP document or share with admin. No rewriting. No starting from scratch.
        </p>

        <div className="video-frame-wrap" style={{ maxWidth: 360, marginBottom: 80 }}>
          <iframe
            src="https://www.youtube-nocookie.com/embed/-XqwrCCw60M?enablejsapi=1"
            title="AI parent email generation walkthrough"
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
