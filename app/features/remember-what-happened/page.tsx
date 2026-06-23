import Link from 'next/link';
import type { Metadata } from 'next';
import AnimatedLogo from '../../../components/AnimatedLogo';
import TrackedLink from '../../../components/TrackedLink';
import Footer from '../../../components/Footer';

export const metadata: Metadata = {
  title: 'Stop Relying on Memory | ShortHand for Teachers',
  description: 'Teachers lose critical student behavior details every day because there is no good time to write them down. ShortHand lets you log what happened in seconds, so you always have the full story when it counts.',
  alternates: { canonical: 'https://getshorthandapp.com/features/remember-what-happened' },
  openGraph: {
    title: 'Stop Relying on Memory | ShortHand for Teachers',
    description: 'Teachers lose critical student behavior details every day because there is no good time to write them down. ShortHand lets you log what happened in seconds, so you always have the full story when it counts.',
    url: 'https://getshorthandapp.com/features/remember-what-happened',
    type: 'website',
    images: [{ url: 'https://getshorthandapp.com/og-image.png', width: 1200, height: 630, alt: 'ShortHand: Built by a teacher, for teachers.' }],
  },
};

export default function RememberWhatHappenedPage() {
  return (
    <>
      <nav>
        <div className="nav-inner">
          <div className="nav-left">
            <AnimatedLogo />
          </div>
          <TrackedLink
            href="https://app.getshorthandapp.com?demo=true&source=remember-what-happened"
            className="btn-primary"
            label="nav_try_demo_remember-what-happened"
          >
            Try the Demo
          </TrackedLink>
        </div>
      </nav>

      <Link href="/" className="detail-back">← Back to home</Link>

      <div className="detail-hero">
        <h1 className="detail-title">You Know Something Happened.<br /><em>You Just Can&apos;t Remember What.</em></h1>
        <p className="detail-desc">
          It&apos;s 4pm. You&apos;re packing up. You know there was an incident with Marcus at lunch, something with the reading group, and a parent who called. But the details are already fuzzy. By Friday they&apos;ll be gone.
        </p>
        <p className="detail-desc">
          That&apos;s not a memory problem. That&apos;s a documentation problem. Teachers aren&apos;t forgetting because they don&apos;t care. They&apos;re forgetting because there is never a good moment to write things down.
        </p>

        <div style={{ margin: '3rem 0', display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '640px' }}>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '1.75rem', flexShrink: 0 }}>⚡</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)', marginBottom: '0.4rem' }}>Log it in 5 seconds, right when it happens</div>
              <p style={{ color: 'var(--text-dim)', lineHeight: 1.7, margin: 0 }}>
                Tap a student, speak or type what happened, and save. No forms, no formatting, no waiting until you have a free moment. Because that free moment never comes.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '1.75rem', flexShrink: 0 }}>📋</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)', marginBottom: '0.4rem' }}>Walk into any meeting with the full story</div>
              <p style={{ color: 'var(--text-dim)', lineHeight: 1.7, margin: 0 }}>
                Parent conference on Thursday? IEP next week? Admin asking questions? Every note you logged is searchable and sorted by date. You pull up a student and the whole picture is right there.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '1.75rem', flexShrink: 0 }}>✉️</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)', marginBottom: '0.4rem' }}>Turn your notes into parent emails in one click</div>
              <p style={{ color: 'var(--text-dim)', lineHeight: 1.7, margin: 0 }}>
                ShortHand reads the notes you logged and writes a professional parent message for you. You review it, adjust if needed, and send. No staring at a blank email trying to reconstruct what happened.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '1.75rem', flexShrink: 0 }}>📈</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)', marginBottom: '0.4rem' }}>Spot patterns before they become problems</div>
              <p style={{ color: 'var(--text-dim)', lineHeight: 1.7, margin: 0 }}>
                When every incident is logged instead of lost, patterns emerge. You stop being surprised at IEP meetings. You start having data that actually supports what you already know.
              </p>
            </div>
          </div>
        </div>

        <blockquote style={{
          borderLeft: '3px solid var(--accent, #a78bfa)',
          paddingLeft: '1.25rem',
          margin: '2.5rem 0',
          color: 'var(--text-dim)',
          fontStyle: 'italic',
          fontSize: '1.1rem',
          lineHeight: 1.7,
          maxWidth: '580px',
        }}>
          &ldquo;Good documentation shouldn&apos;t be a chore. It should be the thing that protects you, supports your students, and makes every hard conversation easier.&rdquo;
          <div style={{ marginTop: '0.75rem', fontStyle: 'normal', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>
            Gregory Lebed, 3rd Grade Teacher and creator of ShortHand
          </div>
        </blockquote>

        <Link href="/" className="detail-back" style={{ marginTop: '16px' }}>← Back to home</Link>
      </div>

      <div className="detail-cta-section">
        <h2 className="detail-cta-heading">See how it works.</h2>
        <p className="detail-cta-sub">No sign-up required. Try the demo with real students and real notes in under two minutes.</p>
        <TrackedLink
          href="https://app.getshorthandapp.com?demo=true&source=remember-what-happened"
          className="btn-primary"
          label="cta_try_demo_remember-what-happened"
        >
          Try the Demo →
        </TrackedLink>
      </div>

      <Footer />
    </>
  );
}
