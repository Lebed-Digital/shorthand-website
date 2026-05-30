import Link from 'next/link';
import type { Metadata } from 'next';
import AnimatedLogo from '../../../components/AnimatedLogo';
import TrackedLink from '../../../components/TrackedLink';

export const metadata: Metadata = {
  title: 'Attendance | ShortHand',
  description: 'Track student attendance fast. See patterns over time and catch chronic absenteeism before it becomes a bigger problem.',
  alternates: { canonical: 'https://getshorthandapp.com/features/attendance' },
  openGraph: {
    title: 'Attendance | ShortHand',
    description: 'Track student attendance fast. See patterns over time and catch chronic absenteeism before it becomes a bigger problem.',
    url: 'https://getshorthandapp.com/features/attendance',
    type: 'website',
    images: [{ url: 'https://getshorthandapp.com/og-image.png', width: 1200, height: 630, alt: 'ShortHand: Built by a teacher, for teachers.' }],
  },
};

export default function AttendancePage() {
  return (
    <>
      <div className="glow-field" aria-hidden>
        <span className="g1" /><span className="g2" /><span className="g3" />
        <span className="g4" />
        <span className="g5" />
      </div>

      <nav>
        <div className="nav-inner">
          <div className="nav-left">
            <AnimatedLogo />
          </div>
          <TrackedLink href="https://app.getshorthandapp.com" className="btn-primary" label="nav_try_free_attendance">Get ShortHand</TrackedLink>
        </div>
      </nav>

      <Link href="/" className="detail-back">← Back to home</Link>

      <div className="detail-hero">
        <span className="detail-icon">📅</span>
        <h1 className="detail-title">Attendance <em>Tracking</em></h1>
        <p className="detail-desc">
          Take attendance in seconds and build a running record for every student.
          No paper, no separate system. It lives right alongside your notes and
          communication logs in ShortHand.
        </p>
        <p className="detail-desc">
          See attendance patterns over time so you can spot chronic absenteeism early,
          have informed conversations with families, and back up every discussion
          with a clear record.
        </p>
        <p className="detail-desc">
          When it&apos;s all in one place, following up is easy and nothing falls
          through the cracks.
        </p>

        <div className="video-frame-wrap" style={{ maxWidth: 360, marginBottom: 80 }}>
          <iframe
            src="https://www.youtube-nocookie.com/embed/O7ungB3f0JI?enablejsapi=1"
            title="Attendance tracking walkthrough"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <Link href="/" className="detail-back" style={{ marginTop: '16px' }}>← Back to home</Link>
      </div>

      <div className="detail-cta-section">
        <h2 className="detail-cta-heading">Ready to try it?</h2>
        <p className="detail-cta-sub">Free to start. Works on any device.</p>
        <TrackedLink href="https://app.getshorthandapp.com" className="btn-primary" label="cta_get_started_attendance">Get Started Free →</TrackedLink>
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
