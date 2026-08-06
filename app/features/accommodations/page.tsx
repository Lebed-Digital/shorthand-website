import Link from 'next/link';
import type { Metadata } from 'next';
import AnimatedLogo from '../../../components/AnimatedLogo';
import TrackedLink from '../../../components/TrackedLink';
import FeatureNav from '../../../components/FeatureNav';
import FeatureVideo from '../../../components/FeatureVideo';
import Footer from '../../../components/Footer';

export const metadata: Metadata = {
  title: 'Accommodations at a Glance | ShortHand',
  description: 'See every student\'s IEP, 504, and classroom accommodations in one place. Quickly review seating, extended time, and testing supports before you need them.',
  alternates: { canonical: 'https://getshorthandapp.com/features/accommodations' },
  openGraph: {
    title: 'Accommodations at a Glance | ShortHand',
    description: 'See every student\'s IEP, 504, and classroom accommodations in one place. Quickly review seating, extended time, and testing supports before you need them.',
    url: 'https://getshorthandapp.com/features/accommodations',
    type: 'website',
    images: [{ url: 'https://getshorthandapp.com/og-image.png', width: 1200, height: 630, alt: 'ShortHand: Built by a teacher, for teachers.' }],
  },
};

export default function AccommodationsPage() {
  return (
    <>
      <nav>
        <div className="nav-inner">
          <div className="nav-left">
            <AnimatedLogo />
          </div>
          <TrackedLink href="https://app.getshorthandapp.com" className="btn-primary" label="nav_try_free_accommodations">Get ShortHand</TrackedLink>
        </div>
      </nav>

      <Link href="/" className="detail-back">← Back to home</Link>

      <div className="detail-hero">
        <h1 className="detail-title">Accommodations <em>at a Glance</em></h1>
        <p className="detail-desc">
          No teacher can keep every student&apos;s IEP, 504, and classroom accommodations
          at the front of their mind all day. ShortHand keeps that information easy to
          find when you need it.
        </p>
        <p className="detail-desc">
          Open Class Accommodations to see every student&apos;s accommodations in one
          place. Quickly review seating needs, extended time, testing supports,
          communication considerations, and other classroom accommodations before
          making a decision.
        </p>
        <p className="detail-desc">
          Need to check one student? Open their profile to view their accommodations
          without searching through paperwork or another system.
        </p>
        <p className="detail-desc">
          Important information should not depend on memory. ShortHand keeps it within reach.
        </p>
        <Link href="/" className="detail-back" style={{ marginTop: '16px' }}>← Back to home</Link>

        <FeatureVideo videoId="pOQQpPixhL4" title="Accommodations at a Glance: ShortHand" hideControls />
      </div>

      <FeatureNav current="accommodations" />
      <div className="detail-cta-section">
        <h2 className="detail-cta-heading">Ready to try it?</h2>
        <p className="detail-cta-sub">Free to start. Works on any device.</p>
        <TrackedLink href="https://app.getshorthandapp.com" className="btn-primary" label="cta_get_started_accommodations">Get Started Free →</TrackedLink>
      </div>

      <Footer />
    </>
  );
}
