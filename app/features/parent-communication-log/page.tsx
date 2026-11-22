import Link from 'next/link';
import type { Metadata } from 'next';
import AnimatedLogo from '../../../components/AnimatedLogo';
import TrackedLink from '../../../components/TrackedLink';
import FeatureNav from '../../../components/FeatureNav';
import FeatureVideo from '../../../components/FeatureVideo';
import HowToClips from '../../../components/HowToClips';
import Footer from '../../../components/Footer';
import { FeatureExample, FeatureFaq } from '../../../components/FeatureExtras';

export const metadata: Metadata = {
  title: 'Parent Communication Log | ShortHand',
  description: 'Log every parent call, email, and meeting in seconds. Your full communication history is always ready, so if admin asks, you\'re covered.',
  alternates: { canonical: 'https://getshorthandapp.com/features/parent-communication-log' },
  openGraph: {
    title: 'Parent Communication Log | ShortHand',
    description: 'Log every parent call, email, and meeting in seconds. Your full communication history is always ready, so if admin asks, you\'re covered.',
    url: 'https://getshorthandapp.com/features/parent-communication-log',
    type: 'website',
    images: [{ url: 'https://getshorthandapp.com/og-image-v2.png', width: 1200, height: 630, alt: 'ShortHand: Built by a teacher, for teachers.' }],
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
      <main>

      <Link href="/" className="detail-back">← Back to home</Link>

      <div className="detail-hero">
        <h1 className="detail-title">Parent Communication <em>Log</em></h1>
        <p style={{ margin: '0 0 40px' }}>
          <TrackedLink href="https://app.getshorthandapp.com/?demo=true" className="btn-ghost" label="demo_top_parent-communication-log" ctaSource="features_parent-communication-log">Try the demo, no account needed →</TrackedLink>
        </p>
        <p className="detail-desc">
          Keep every phone call, email, and meeting organized by student, with the date,
          contact type, and a short summary all in one place. No more searching through
          sent emails or trying to remember when you last reached out.
        </p>
        <p className="detail-desc">
          When you need to review a family&apos;s communication history, everything is easy
          to find. You can quickly see what happened, when it happened, and what was
          discussed.
        </p>
        <p className="detail-desc">
          Mark entries as IEP-related or urgent, set follow-up reminders, and export a
          student&apos;s communication history when you need it for a meeting or school
          documentation.
        </p>

        <FeatureVideo videoId="y72XmJboR7k" title="Parent Communication Log walkthrough" hideControls />

        <HowToClips
          heading="See it in 20 seconds"
          clips={[
            { videoId: 'XKQ4KmaNTQs', title: 'Log a parent phone call', description: 'Pick the student, tap Call, type one sentence, and save. The parent name fills in for you.' },
          ]}
        />

        <FeatureExample title="a logged phone call">
          <strong>J.M.</strong> · Call · Outgoing · November 12, 3:20 PM<br />
          Parent: Ms. R.<br />
          Notes: Called about three missing reading logs. Ms. R. said evenings are busy this month. We agreed J. will
          finish the logs during morning work.<br />
          Follow-up: November 19, check the reading logs.
        </FeatureExample>

        <FeatureFaq
          items={[
            { q: 'Is the parent communication log free?', a: 'Yes. The log is on the free plan, with no time limit and no cap on entries.' },
            { q: 'Can I share a log with my principal or a team?', a: "Yes. Copy Full Log or Email Full Log gives you a student's communication history as plain text, ready to paste into an email, a meeting note, or your school's system." },
            { q: 'Can parents see the log?', a: "No. Parents and students don't have ShortHand logins. You choose what to send or share." },
          ]}
        />

        <Link href="/" className="detail-back" style={{ marginTop: '16px' }}>← Back to home</Link>
      </div>

      <FeatureNav current="parent-communication-log" />
      <div className="detail-cta-section">
        <h2 className="detail-cta-heading">Ready to try it?</h2>
        <p className="detail-cta-sub">Free plan with no time limit. Use it in your browser or the app.</p>
        <TrackedLink href="https://app.getshorthandapp.com/?signup=1" className="btn-primary" label="cta_get_started_parent-communication-log">Get Started Free →</TrackedLink>
      </div>

      </main>
      <Footer />
    </>
  );
}
