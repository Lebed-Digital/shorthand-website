import Link from 'next/link';
import type { Metadata } from 'next';
import AnimatedLogo from '../../../components/AnimatedLogo';
import TrackedLink from '../../../components/TrackedLink';
import FeatureNav from '../../../components/FeatureNav';
import Footer from '../../../components/Footer';

export const metadata: Metadata = {
  title: 'Student Documentation Report | ShortHand',
  description: 'Export a clean PDF of a student\'s dated, logged notes for any date range. A direct export of your own documentation, not an AI summary. Pro feature.',
  alternates: { canonical: 'https://getshorthandapp.com/features/student-documentation-report' },
  openGraph: {
    title: 'Student Documentation Report | ShortHand',
    description: 'Export a clean PDF of a student\'s dated, logged notes for any date range. A direct export of your own documentation, not an AI summary. Pro feature.',
    url: 'https://getshorthandapp.com/features/student-documentation-report',
    type: 'website',
    images: [{ url: 'https://getshorthandapp.com/og-image.png', width: 1200, height: 630, alt: 'ShortHand: Built by a teacher, for teachers.' }],
  },
};

export default function StudentDocumentationReportPage() {
  return (
    <>
      <nav>
        <div className="nav-inner">
          <div className="nav-left">
            <AnimatedLogo />
          </div>
          <TrackedLink href="https://app.getshorthandapp.com" className="btn-primary" label="nav_try_free_student-documentation-report">Get ShortHand</TrackedLink>
        </div>
      </nav>

      <Link href="/" className="detail-back">← Back to home</Link>

      <div className="detail-hero">
        <h1 className="detail-title">Student Documentation <em>Report</em></h1>
        <p className="detail-desc">
          From the Reports tab, pick a student and a date range, a week, last week,
          a month, or any custom range, and export every note you&apos;ve logged for that
          student in that window as a clean, dated PDF.
        </p>
        <p className="detail-desc">
          It&apos;s a direct export of your own documentation. It does not summarize,
          interpret, score, rank, or draw conclusions about the student. Every entry
          shows the date, tags, and exactly what you wrote, in order, so the record
          speaks for itself.
        </p>
        <p className="detail-desc">
          Useful when documentation needs to be shared or reviewed: handing a clean
          record to an administrator, adding it to an IEP file, or reviewing a
          student&apos;s history yourself before a meeting.
        </p>
        <p className="detail-desc">
          This is different from Write Reports, which turns your notes into an
          AI-drafted, parent-ready narrative. The Student Documentation Report stays
          in your own words, unedited.
        </p>
        <p className="detail-desc">
          A Pro feature, included with your ShortHand subscription.
        </p>

        <Link href="/" className="detail-back" style={{ marginTop: '16px' }}>← Back to home</Link>
      </div>

      <FeatureNav current="student-documentation-report" />
      <div className="detail-cta-section">
        <h2 className="detail-cta-heading">Ready to try it?</h2>
        <p className="detail-cta-sub">Free to start. Works on any device.</p>
        <TrackedLink href="https://app.getshorthandapp.com" className="btn-primary" label="cta_get_started_student-documentation-report">Get Started Free →</TrackedLink>
      </div>

      <Footer />
    </>
  );
}
