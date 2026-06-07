import Link from 'next/link';
import type { Metadata } from 'next';
import AnimatedLogo from '../../../components/AnimatedLogo';
import TrackedLink from '../../../components/TrackedLink';
import FeatureNav from '../../../components/FeatureNav';
import Footer from '../../../components/Footer';

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
        <h1 className="detail-title">AI <em>Reports</em></h1>
        <p className="detail-desc">
          Report writing used to eat entire Sunday evenings. With ShortHand, your notes
          become the source material and ShortHand does the drafting. Select a student, pick a
          format (Quick Note or Detailed), and in seconds you have a polished,
          professional write-up ready to review and send.
        </p>
        <p className="detail-desc">
          It works only from what you actually logged. Your observations, your language,
          with just the hard part done for you. Not happy with the first draft? Tell it to adjust
          the tone, shorten it, or shift the focus. It rewrites on the spot until it sounds right.
        </p>
        <p className="detail-desc">
          Once the report looks right, you can log it directly to the parent communication
          record with one tap. So you have proof it was shared with the family, right
          alongside your notes and call history.
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

      <Footer />
    </>
  );
}
