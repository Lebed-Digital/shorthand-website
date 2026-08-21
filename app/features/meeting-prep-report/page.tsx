import Link from 'next/link';
import type { Metadata } from 'next';
import AnimatedLogo from '../../../components/AnimatedLogo';
import TrackedLink from '../../../components/TrackedLink';
import FeatureNav from '../../../components/FeatureNav';
import FeatureVideo from '../../../components/FeatureVideo';
import Footer from '../../../components/Footer';

export const metadata: Metadata = {
  title: 'Meeting Prep Report | ShortHand',
  description: 'Walk into any meeting with an organized summary of a student\'s notes, communications, goals, and accommodations, built from what you\'ve already logged. Pro feature.',
  alternates: { canonical: 'https://getshorthandapp.com/features/meeting-prep-report' },
  openGraph: {
    title: 'Meeting Prep Report | ShortHand',
    description: 'Walk into any meeting with an organized summary of a student\'s notes, communications, goals, and accommodations, built from what you\'ve already logged. Pro feature.',
    url: 'https://getshorthandapp.com/features/meeting-prep-report',
    type: 'website',
    images: [{ url: 'https://getshorthandapp.com/og-image.png', width: 1200, height: 630, alt: 'ShortHand: Built by a teacher, for teachers.' }],
  },
};

export default function MeetingPrepReportPage() {
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "ShortHand Meeting Prep Report Walkthrough",
    "description": "See how ShortHand builds a Meeting Prep Report from your logged notes, communications, goals, and accommodations before a conference or IEP meeting.",
    "thumbnailUrl": "https://getshorthandapp.com/og-image.png",
    "uploadDate": "2026-08-20T00:00:00+00:00",
    "embedUrl": "https://www.youtube-nocookie.com/embed/K5AZIYJGJ7U"
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }} />
      <nav>
        <div className="nav-inner">
          <div className="nav-left">
            <AnimatedLogo />
          </div>
          <TrackedLink href="https://app.getshorthandapp.com" className="btn-primary" label="nav_try_free_meeting-prep-report">Get ShortHand</TrackedLink>
        </div>
      </nav>

      <Link href="/" className="detail-back">← Back to home</Link>

      <div className="detail-hero">
        <h1 className="detail-title">Meeting Prep <em>Report</em></h1>
        <p className="detail-desc">
          Before a conference or IEP meeting, pick a student and a date range from the
          Reports tab and pull together everything you&apos;d otherwise have to gather by
          hand: an organized overview of your notes for that period, recent parent
          communication, current goals, and active accommodations, all on one page.
        </p>
        <p className="detail-desc">
          One section uses AI: a short written summary that groups your notes into
          themes, like a recurring behavior or a strength, based only on what you
          actually documented. It sticks to point-in-time observations from your
          notes. It doesn&apos;t diagnose, doesn&apos;t claim a trend from a single note, and
          doesn&apos;t add anything you didn&apos;t write down.
        </p>
        <p className="detail-desc">
          Export the whole thing as a PDF and bring it with you.
        </p>
        <p className="detail-desc">
          This is different from the Student Documentation Report, which is a plain,
          unsummarized export of your logged notes. Meeting Prep Report organizes and
          summarizes; the Documentation Report exports your notes exactly as written.
        </p>
        <p className="detail-desc">
          A Pro feature, included with your ShortHand subscription.
        </p>

        <FeatureVideo videoId="K5AZIYJGJ7U" title="Meeting Prep Report walkthrough" hideControls />

        <Link href="/" className="detail-back" style={{ marginTop: '16px' }}>← Back to home</Link>
      </div>

      <FeatureNav current="meeting-prep-report" />
      <div className="detail-cta-section">
        <h2 className="detail-cta-heading">Ready to try it?</h2>
        <p className="detail-cta-sub">Free to start. Works on any device.</p>
        <TrackedLink href="https://app.getshorthandapp.com" className="btn-primary" label="cta_get_started_meeting-prep-report">Get Started Free →</TrackedLink>
      </div>

      <Footer />
    </>
  );
}
