import Link from 'next/link';
import type { Metadata } from 'next';
import AnimatedLogo from '../../../components/AnimatedLogo';
import TrackedLink from '../../../components/TrackedLink';
import FeatureNav from '../../../components/FeatureNav';
import FeatureVideo from '../../../components/FeatureVideo';
import Footer from '../../../components/Footer';
import { FeatureExample, FeatureFaq } from '../../../components/FeatureExtras';

export const metadata: Metadata = {
  title: 'See When You Last Noted Each Student | ShortHand',
  description: 'Color-coded check-in rings show how long it has been since you last noted each student, plus an 8-week activity view. Built for K-12 teachers.',
  alternates: { canonical: 'https://getshorthandapp.com/features/behavior-tracking' },
  openGraph: {
    title: 'See When You Last Noted Each Student | ShortHand',
    description: 'Color-coded check-in rings show how long it has been since you last noted each student, plus an 8-week activity view. Built for K-12 teachers.',
    url: 'https://getshorthandapp.com/features/behavior-tracking',
    type: 'website',
    images: [{ url: 'https://getshorthandapp.com/og-image-v2.png', width: 1200, height: 630, alt: 'ShortHand: Built by a teacher, for teachers.' }],
  },
};

export default function NeverMissPage() {
  return (
    <>
      <nav>
        <div className="nav-inner">
          <div className="nav-left">
            <AnimatedLogo />
          </div>
          <TrackedLink href="https://app.getshorthandapp.com" className="btn-primary" label="nav_try_free_behavior-tracking">Get ShortHand</TrackedLink>
        </div>
      </nav>
      <main>

      <Link href="/" className="detail-back">← Back to home</Link>

      <div className="detail-hero">
        <h1 className="detail-title">See When You Last Noted <em>Each Student</em></h1>
        <p style={{ margin: '0 0 40px' }}>
          <TrackedLink href="https://app.getshorthandapp.com/?demo=true" className="btn-ghost" label="demo_top_behavior-tracking" ctaSource="features_behavior-tracking">Try the demo, no account needed →</TrackedLink>
        </p>
        <p className="detail-desc">
          Never miss a student. Every teacher has a mental list of students they check in on regularly,
          and a few others who quietly go weeks without a real conversation.
          ShortHand makes that invisible problem visible.
        </p>
        <p className="detail-desc">
          Every student card on your roster glows <strong>Green</strong> if you&apos;ve logged in the last 8 days,{' '}
          <strong>Amber</strong> if it&apos;s been 9–15 days, and <strong>Red</strong> if it&apos;s been{' '}
          16 or more. A student you have never noted shows <strong>Grey</strong>. You see the rings every time you open your roster.
        </p>
        <p className="detail-desc">
          Open any student and you&apos;ll see their full note history, plus an 8-week
          activity view showing their recent documentation activity. It&apos;s a quick way
          to spot patterns before a conference or parent call.
        </p>
        <p className="detail-desc">
          You don&apos;t have to keep that list in your head. The rings show it.
        </p>
        <Link href="/" className="detail-back" style={{ marginTop: '16px' }}>← Back to home</Link>

        <FeatureVideo videoId="hFTAPTm_MEY" title="Never Miss a Student: ShortHand" hideControls />

        <FeatureExample title="a quick behavior note">
          <strong>S.K.</strong> · Tuesday, 10:42 AM · Tags: On Task, Kindness<br />
          &ldquo;Helped a partner find the page during reading groups, then finished the whole worksheet.&rdquo;<br />
          After you save it, S.K.&apos;s ring turns green and the note shows up in S.K.&apos;s 8-week activity view.
        </FeatureExample>

        <FeatureFaq
          items={[
            { q: 'Are the check-in rings free?', a: 'Yes. The rings, behavior notes, and the 8-week activity view are on the free plan, with no time limit. The Documentation Coverage report is part of Pro.' },
            { q: 'Do students or parents see the rings?', a: "No. Parents and students don't have ShortHand logins. The rings are for you, and you choose what to send or share." },
          ]}
        />
      </div>

      <FeatureNav current="behavior-tracking" />
      <div className="detail-cta-section">
        <h2 className="detail-cta-heading">Ready to try it?</h2>
        <p className="detail-cta-sub">Free plan with no time limit. Use it in your browser or the app.</p>
        <TrackedLink href="https://app.getshorthandapp.com/?signup=1" className="btn-primary" label="cta_get_started_behavior-tracking">Get Started Free →</TrackedLink>
      </div>

      </main>
      <Footer />
    </>
  );
}
