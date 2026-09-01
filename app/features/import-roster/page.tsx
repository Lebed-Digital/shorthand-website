import Link from 'next/link';
import type { Metadata } from 'next';
import AnimatedLogo from '../../../components/AnimatedLogo';
import TrackedLink from '../../../components/TrackedLink';
import FeatureNav from '../../../components/FeatureNav';
import FeatureVideo from '../../../components/FeatureVideo';
import Footer from '../../../components/Footer';

export const metadata: Metadata = {
  title: 'Import Your Class Roster | ShortHand',
  description: 'Paste student names, parent names, emails, and phone numbers straight from a spreadsheet. ShortHand organizes everything automatically, and you choose how much of each name gets stored.',
  alternates: { canonical: 'https://getshorthandapp.com/features/import-roster' },
  openGraph: {
    title: 'Import Your Class Roster | ShortHand',
    description: 'Paste student names, parent names, emails, and phone numbers straight from a spreadsheet. ShortHand organizes everything automatically, and you choose how much of each name gets stored.',
    url: 'https://getshorthandapp.com/features/import-roster',
    type: 'website',
    images: [{ url: 'https://getshorthandapp.com/og-image.png', width: 1200, height: 630, alt: 'ShortHand: Built by a teacher, for teachers.' }],
  },
};

export default function ImportRosterPage() {
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "ShortHand Import Your Class Roster Walkthrough",
    "description": "See how to paste an entire class roster, parent names, emails, and phone numbers included, into ShortHand in seconds.",
    "thumbnailUrl": "https://getshorthandapp.com/og-image.png",
    "uploadDate": "2026-08-31T00:00:00+00:00",
    "embedUrl": "https://www.youtube-nocookie.com/embed/KP8J5_kcHr0"
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }} />
      <nav>
        <div className="nav-inner">
          <div className="nav-left">
            <AnimatedLogo />
          </div>
          <TrackedLink href="https://app.getshorthandapp.com" className="btn-primary" label="nav_try_free_import-roster">Get ShortHand</TrackedLink>
        </div>
      </nav>

      <Link href="/" className="detail-back">← Back to home</Link>

      <div className="detail-hero">
        <h1 className="detail-title">Import Your Class <em>Roster</em></h1>
        <p className="detail-desc">
          Copy your class list straight out of a spreadsheet, student names, parent
          names, emails, and phone numbers, and paste it into ShortHand. It sorts
          everything into the right spots automatically. No template to fill out,
          no adding students one at a time.
        </p>
        <p className="detail-desc">
          You also choose how much of each student&apos;s name ShortHand keeps: initials
          only (recommended), first name and last initial, or full name. Pick whatever
          fits how much identifying information you&apos;re comfortable storing, and
          change it later if you want.
        </p>
        <p className="detail-desc">
          A whole class list, set up correctly, in the time it takes to copy and paste.
        </p>

        <FeatureVideo videoId="KP8J5_kcHr0" title="Import Your Class Roster walkthrough" hideControls />

        <Link href="/" className="detail-back" style={{ marginTop: '16px' }}>← Back to home</Link>
      </div>

      <FeatureNav current="import-roster" />
      <div className="detail-cta-section">
        <h2 className="detail-cta-heading">Ready to try it?</h2>
        <p className="detail-cta-sub">Free to start. Works on any device.</p>
        <TrackedLink href="https://app.getshorthandapp.com" className="btn-primary" label="cta_get_started_import-roster">Get Started Free →</TrackedLink>
      </div>

      <Footer />
    </>
  );
}
