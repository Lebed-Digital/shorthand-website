import Link from 'next/link';
import type { Metadata } from 'next';
import AnimatedLogo from '../../../components/AnimatedLogo';
import TrackedLink from '../../../components/TrackedLink';
import FeatureNav from '../../../components/FeatureNav';
import FeatureVideo from '../../../components/FeatureVideo';
import Footer from '../../../components/Footer';
import { FeatureExample, FeatureFaq } from '../../../components/FeatureExtras';

export const metadata: Metadata = {
  title: 'Ready-to-Send Parent Emails | ShortHand',
  description: 'Turn behavior notes into parent-ready emails in seconds. ShortHand writes the message, fills in the subject line, and even adds the parent email address. You just hit send.',
  alternates: { canonical: 'https://getshorthandapp.com/features/parent-emails' },
  openGraph: {
    title: 'Ready-to-Send Parent Emails | ShortHand',
    description: 'Turn behavior notes into parent-ready emails in seconds. ShortHand writes the message, fills in the subject line, and even adds the parent email address. You just hit send.',
    url: 'https://getshorthandapp.com/features/parent-emails',
    type: 'website',
    images: [{ url: 'https://getshorthandapp.com/og-image-v2.png', width: 1200, height: 630, alt: 'ShortHand: Built by a teacher, for teachers.' }],
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
      <main>

      <Link href="/" className="detail-back">← Back to home</Link>

      <div className="detail-hero">
        <h1 className="detail-title">Parent Emails, <em>Ready to Send</em></h1>
        <p style={{ margin: '0 0 40px' }}>
          <TrackedLink href="https://app.getshorthandapp.com/?demo=true" className="btn-ghost" label="demo_top_parent-emails" ctaSource="features_parent-emails">Try the demo, no account needed →</TrackedLink>
        </p>
        <p className="detail-desc">
          Turn behavior notes into parent-ready messages in seconds.
        </p>
        <p className="detail-desc">
          Log what happened during the day. ShortHand turns those notes into a professional parent email that&apos;s ready to review and send. Parent email address, subject line, and message body: all filled in automatically.
        </p>
        <p className="detail-desc">
          Need something more formal? Generate a detailed behavior report from the same notes in one click.
        </p>

        <FeatureVideo videoId="-Ek-vL61bKc" title="AI parent email generation walkthrough" hideControls />

        <FeatureExample title="a Quick Note Home draft">
          Dear Family,<br />
          J. stayed focused through our whole reading block today and helped a classmate find the right page during
          partner work. J. also finished the worksheet before the timer ended.<br />
          I am very proud and thought you would be too!
        </FeatureExample>

        <FeatureFaq
          items={[
            { q: 'Are parent emails free?', a: 'Yes. On the free plan you can draft a Quick Note Home or a Detailed Report for one student at a time. Preparing emails for several students at once is part of Pro.' },
            { q: 'Does ShortHand send the email for me?', a: "No. The draft opens in your mail app or in Gmail with a subject and the parent's address (if you saved one) filled in. You read it, change anything you want, and send it yourself." },
          ]}
        />

        <Link href="/" className="detail-back" style={{ marginTop: '16px' }}>← Back to home</Link>
      </div>

      <FeatureNav current="parent-emails" />
      <div className="detail-cta-section">
        <h2 className="detail-cta-heading">Ready to try it?</h2>
        <p className="detail-cta-sub">Free plan with no time limit. Use it in your browser or the app.</p>
        <TrackedLink href="https://app.getshorthandapp.com/?signup=1" className="btn-primary" label="cta_get_started_parent-emails">Get Started Free →</TrackedLink>
      </div>

      </main>
      <Footer />
    </>
  );
}
