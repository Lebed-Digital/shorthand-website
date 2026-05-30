import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import AnimatedLogo from '../../components/AnimatedLogo';

export const metadata: Metadata = {
  title: 'About Gregory Lebed | ShortHand',
  description: 'Gregory Lebed is a 3rd grade teacher and former Registered Behavior Technician (RBT) who built ShortHand to solve the paperwork problem he lived every day.',
  openGraph: {
    title: 'About Gregory Lebed | ShortHand',
    description: 'Gregory Lebed is a 3rd grade teacher and former Registered Behavior Technician (RBT) who built ShortHand to solve the paperwork problem he lived every day.',
    url: 'https://getshorthandapp.com/about',
    type: 'profile',
    images: [{ url: 'https://getshorthandapp.com/og-image.png', width: 1200, height: 630, alt: 'ShortHand: Built by a teacher, for teachers.' }],
  },
  alternates: { canonical: 'https://getshorthandapp.com/about' },
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Gregory Lebed',
  jobTitle: '3rd Grade Teacher',
  description: 'K-8 classroom teacher, former Registered Behavior Technician (RBT), and creator of ShortHand, a behavior tracking and parent communication app built for teachers.',
  url: 'https://getshorthandapp.com/about',
  email: 'hello@getshorthandapp.com',
  worksFor: {
    '@type': 'Organization',
    name: 'ShortHand',
    url: 'https://getshorthandapp.com',
  },
  hasCredential: {
    '@type': 'EducationalOccupationalCredential',
    name: 'Registered Behavior Technician (RBT)',
    credentialCategory: 'Professional Certification',
    recognizedBy: {
      '@type': 'Organization',
      name: 'Behavior Analyst Certification Board (BACB)',
    },
  },
  knowsAbout: [
    'Classroom behavior tracking',
    'Applied behavior analysis',
    'K-12 education',
    'IEP documentation',
    'Parent communication',
    'Student progress reporting',
    'Special education',
  ],
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />

      <div className="glow-field" aria-hidden>
        <span className="g1" /><span className="g2" /><span className="g3" />
        <span className="g4" /><span className="g5" />
      </div>

      <nav>
        <div className="nav-inner">
          <div className="nav-left">
            <AnimatedLogo />
          </div>
          <div className="nav-links">
            <Link href="/#features" className="nav-link">Features</Link>
            <Link href="/how-it-works" className="nav-link">How It Works</Link>
            <Link href="/blog" className="nav-link">Blog</Link>
          </div>
          <Link href="/install" className="btn-primary">Get ShortHand</Link>
        </div>
      </nav>

      <article style={{ maxWidth: '720px', margin: '0 auto', padding: '6rem 1.5rem 5rem' }}>
        <Link href="/" style={{ fontSize: '0.9rem', color: 'var(--text-dim)', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
          ← Back to home
        </Link>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          <Image
            src="/creator.jpg"
            alt="Gregory Lebed, 3rd grade teacher and creator of ShortHand"
            width={160}
            height={210}
            style={{ borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }}
            priority
          />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
              About the Creator
            </div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1rem' }}>
              Gregory Lebed
            </h1>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {['20+ Years K–8 Experience', 'Certified RBT', 'Active 3rd Grade Teacher'].map(badge => (
                <span key={badge} style={{
                  background: 'rgba(167,139,250,0.12)',
                  border: '1px solid rgba(167,139,250,0.3)',
                  color: 'var(--accent, #a78bfa)',
                  borderRadius: '999px',
                  padding: '0.3rem 0.9rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}>
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ lineHeight: 1.75, color: 'var(--text)', fontSize: '1.05rem' }}>
          <p style={{ marginBottom: '1.25rem' }}>
            I&apos;ve been teaching K-8 for over twenty years. In that time I&apos;ve sat through more IEP meetings, written more parent emails, and filled out more behavior logs than I can count. And for most of that time, I did it the hard way: sticky notes, spreadsheets, mental gymnastics at the end of a long day trying to remember what happened with which student.
          </p>
          <p style={{ marginBottom: '1.25rem' }}>
            I&apos;m also a Registered Behavior Technician (RBT). That training changed how I see behavior. Not as something to punish, but as communication. It made me a better teacher, but it also made me more aware of how much data we lose when documentation is slow or painful. If logging a note takes two minutes, you stop doing it. And when you stop doing it, you lose the pattern. You lose the story.
          </p>
          <p style={{ marginBottom: '1.25rem' }}>
            I built ShortHand because I couldn&apos;t find a tool that worked the way a real classroom works. Every app I tried was either built for administrators or designed by people who hadn&apos;t been in front of 25 third-graders on a Tuesday afternoon. I needed something I could actually use while also teaching: fast, quiet, one-handed.
          </p>
          <p style={{ marginBottom: '2rem' }}>
            So I built it myself. ShortHand is the tool I wish I&apos;d had twenty years ago. I&apos;m still a full-time teacher. I still use it every day. Every feature in this app came from a real problem I or another teacher actually faced.
          </p>

          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '2rem',
          }}>
            <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-dim)', lineHeight: 1.6 }}>
              &ldquo;I didn&apos;t build this app to give you more work. I built it because I was tired of drowning in paperwork while trying to keep my head above water.&rdquo;
            </p>
          </div>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.75rem' }}>Why my perspective matters</h2>
          <p style={{ marginBottom: '1.25rem' }}>
            There&apos;s no shortage of ed-tech apps built by people who used to teach, or who talked to teachers, or who read research about teachers. ShortHand is different because I&apos;m still in the classroom. When I ship a feature, I test it the next morning with my actual students. When something doesn&apos;t work in the real world, I feel it immediately and fix it.
          </p>
          <p style={{ marginBottom: '2.5rem' }}>
            That&apos;s the only way I know how to build something worth using.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/install" className="btn-primary">Try ShortHand Free →</Link>
            <Link href="/blog" style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.65rem 1.4rem',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '999px',
              color: 'var(--text)',
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: 500,
            }}>
              Read the Blog
            </Link>
          </div>
        </div>
      </article>

      <footer>
        <div className="footer-logo">ShortHand</div>
        <div className="footer-tagline">Built by a teacher, for teachers.</div>
        <a href="mailto:hello@getshorthandapp.com" className="footer-email">hello@getshorthandapp.com</a>
        <div className="footer-copy">© 2026 ShortHand. All rights reserved. · <a href="/privacy" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Privacy Policy</a></div>
      </footer>
    </>
  );
}
