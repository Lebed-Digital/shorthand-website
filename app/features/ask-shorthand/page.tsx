import Link from 'next/link';
import type { Metadata } from 'next';
import AnimatedLogo from '../../../components/AnimatedLogo';
import TrackedLink from '../../../components/TrackedLink';
import FeatureNav from '../../../components/FeatureNav';
import Footer from '../../../components/Footer';

export const metadata: Metadata = {
  title: 'Ask ShortHand | ShortHand',
  description: 'Ask a plain-language question and get an answer pulled straight from the notes you have already logged. Pro feature.',
  alternates: { canonical: 'https://getshorthandapp.com/features/ask-shorthand' },
  openGraph: {
    title: 'Ask ShortHand | ShortHand',
    description: 'Ask a plain-language question and get an answer pulled straight from the notes you have already logged. Pro feature.',
    url: 'https://getshorthandapp.com/features/ask-shorthand',
    type: 'website',
    images: [{ url: 'https://getshorthandapp.com/og-image.png', width: 1200, height: 630, alt: 'ShortHand: Built by a teacher, for teachers.' }],
  },
};

export default function AskShortHandPage() {
  return (
    <>
      <nav>
        <div className="nav-inner">
          <div className="nav-left">
            <AnimatedLogo />
          </div>
          <TrackedLink href="https://app.getshorthandapp.com" className="btn-primary" label="nav_try_free_ask-shorthand">Get ShortHand</TrackedLink>
        </div>
      </nav>

      <Link href="/" className="detail-back">← Back to home</Link>

      <div className="detail-hero">
        <h1 className="detail-title">Ask <em>ShortHand</em></h1>
        <p className="detail-desc">
          Instead of scrolling back through weeks of notes to answer a question, just ask it.
          Type something like &quot;Who has been struggling with transitions this month?&quot; or
          &quot;How many times have I contacted this family?&quot; and get an answer pulled directly
          from what you&apos;ve already logged.
        </p>
        <p className="detail-desc">
          It only knows what you&apos;ve documented. Ask ShortHand reads your own notes,
          not district records, not other teachers&apos; classes, and nothing you haven&apos;t
          written down. Each question gets one answer, it&apos;s not a back-and-forth
          conversation, so ask exactly what you want to know.
        </p>
        <p className="detail-desc">
          It&apos;s a faster way to review your own documentation before a conference, an
          IEP meeting, or a call home, not a replacement for reading a student&apos;s full
          record.
        </p>
        <p className="detail-desc">
          A Pro feature, included with your ShortHand subscription.
        </p>

        <Link href="/" className="detail-back" style={{ marginTop: '16px' }}>← Back to home</Link>
      </div>

      <FeatureNav current="ask-shorthand" />
      <div className="detail-cta-section">
        <h2 className="detail-cta-heading">Ready to try it?</h2>
        <p className="detail-cta-sub">Free to start. Works on any device.</p>
        <TrackedLink href="https://app.getshorthandapp.com" className="btn-primary" label="cta_get_started_ask-shorthand">Get Started Free →</TrackedLink>
      </div>

      <Footer />
    </>
  );
}
