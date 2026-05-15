import Link from 'next/link';
import type { Metadata } from 'next';
import AnimatedLogo from '../../../components/AnimatedLogo';
import TrackedLink from '../../../components/TrackedLink';
import FeatureNav from '../../../components/FeatureNav';
import Footer from '../../../components/Footer';

export const metadata: Metadata = {
  title: 'Quick Note — ShortHand',
  description: 'Tap a student, speak or type a note, done in under 5 seconds. Voice-to-text, auto-tagging, and smart shortcuts built in.',
  alternates: { canonical: 'https://getshorthandapp.com/features/quick-note' },
  openGraph: {
    title: 'Quick Note — ShortHand',
    description: 'Tap a student, speak or type a note, done in under 5 seconds. Voice-to-text, auto-tagging, and smart shortcuts built in.',
    url: 'https://getshorthandapp.com/features/quick-note',
    type: 'website',
    images: [{ url: 'https://getshorthandapp.com/og-image.png', width: 1200, height: 630, alt: 'ShortHand: Built by a teacher, for teachers.' }],
  },
};

export default function QuickNotePage() {
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "ShortHand Quick Note Walkthrough",
    "description": "See how to log a student behavior note in under 5 seconds using ShortHand's Quick Note feature.",
    "thumbnailUrl": "https://getshorthandapp.com/og-image.png",
    "uploadDate": "2026-04-26T00:00:00+00:00",
    "embedUrl": "https://www.youtube-nocookie.com/embed/C2vBvjfRQ2U"
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }} />
      <div className="glow-field" aria-hidden>
        <span className="g1" /><span className="g2" /><span className="g3" />
        <span className="g4" />
        <span className="g5" />
      </div>

      <nav>
        <div className="nav-inner">
          <div className="nav-left">
            <AnimatedLogo />
            <span className="nav-badge">Built by a Teacher</span>
          </div>
          <TrackedLink href="https://app.getshorthandapp.com" className="btn-primary" label="nav_try_free_quick-note">Get ShortHand</TrackedLink>
        </div>
      </nav>

      <Link href="/" className="detail-back">← Back to home</Link>

      <div className="detail-hero">
        <span className="detail-icon">✏️</span>
        <h1 className="detail-title">Quick <em>Note</em></h1>
        <p className="detail-desc">
          Tap a student&apos;s name, speak or type what you observed, and you&apos;re done in
          under 5 seconds. No menus to navigate, no forms to fill out.
          Every note is timestamped and stored automatically, building a picture of
          each student over time.
        </p>
        <p className="detail-desc">
          Student photos appear right in the suggestions dropdown, so you&apos;re always sure you&apos;re logging the right kid, especially helpful in larger classes or when you&apos;re moving fast.
        </p>
        <p className="detail-desc">
          Voice-to-text lets you log hands-free while you&apos;re still moving around the room.
          Smart Shorthand lets you set custom abbreviations that expand instantly.
          So &quot;ss&quot; becomes &quot;Social Studies&quot; before you even finish typing.
          The AI reads your note and auto-tags it with behavior categories like
          Kindness, Participation, or Growth, with no manual sorting required.
        </p>
        <p className="detail-desc">
          The faster it is to log, the more you&apos;ll actually do it.
        </p>

        <div className="video-frame-wrap" style={{ maxWidth: 360, marginBottom: 80 }}>
          <iframe
            src="https://www.youtube-nocookie.com/embed/C2vBvjfRQ2U?enablejsapi=1"
            title="Quick Note walkthrough"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <Link href="/" className="detail-back" style={{ marginTop: '16px' }}>← Back to home</Link>
      </div>

      <FeatureNav current="quick-note" />
      <div className="detail-cta-section">
        <h2 className="detail-cta-heading">Ready to try it?</h2>
        <p className="detail-cta-sub">Free to start. Works on any device.</p>
        <TrackedLink href="https://app.getshorthandapp.com" className="btn-primary" label="cta_get_started_quick-note">Get Started Free →</TrackedLink>
      </div>

      <Footer />
    </>
  );
}
