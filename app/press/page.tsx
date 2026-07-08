import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import AnimatedLogo from '../../components/AnimatedLogo';
import Footer from '../../components/Footer';

export const metadata: Metadata = {
  title: 'Press & Mentions | ShortHand',
  description: 'Where ShortHand has been featured and reviewed, including SaaS Browser, Capterra, Software Advice, and GetApp.',
  openGraph: {
    title: 'Press & Mentions | ShortHand',
    description: 'Where ShortHand has been featured and reviewed, including SaaS Browser, Capterra, Software Advice, and GetApp.',
    url: 'https://getshorthandapp.com/press',
    type: 'website',
    images: [{ url: 'https://getshorthandapp.com/og-image.png', width: 1200, height: 630, alt: 'ShortHand: Built by a teacher, for teachers.' }],
  },
  alternates: { canonical: 'https://getshorthandapp.com/press' },
};

const mentions = [
  {
    name: 'SaaS Browser',
    desc: 'Featured case study on how ShortHand helps K-12 teachers document behavior and communicate with parents.',
    href: 'https://saasbrowser.com/en/case-studies/1540632/shorthand',
    cta: 'Read the case study',
  },
  {
    name: 'Capterra',
    desc: 'ShortHand is listed and reviewed on Capterra, a software directory used by schools and districts evaluating ed-tech tools.',
    href: 'https://www.capterra.com/p/10049021/ShortHand/',
    cta: 'View listing',
  },
  {
    name: 'Software Advice',
    desc: 'ShortHand is listed and reviewed on Software Advice, a Gartner Digital Markets property.',
    href: 'https://www.softwareadvice.com/product/556571-ShortHand/',
    cta: 'View listing',
  },
  {
    name: 'GetApp',
    desc: 'ShortHand is listed and reviewed on GetApp, a Gartner Digital Markets property.',
    href: 'https://www.getapp.com/all-software/a/shorthand-1/',
    cta: 'View listing',
  },
];

export default function PressPage() {
  return (
    <>
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
            <Link href="/blog" className="nav-link">Blog</Link>
          </div>
          <Link href="https://app.getshorthandapp.com?demo=true" className="btn-primary">Get ShortHand</Link>
        </div>
      </nav>

      <article style={{ maxWidth: '780px', margin: '0 auto', padding: '6rem 1.5rem 5rem' }}>
        <Link href="/" style={{ fontSize: '0.9rem', color: 'var(--text-dim)', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
          ← Back to home
        </Link>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
          Press & Mentions
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.25rem' }}>
          Where ShortHand has been featured
        </h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '3rem', maxWidth: '620px' }}>
          A running list of case studies, reviews, and directory listings covering ShortHand.
        </p>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {mentions.map((m) => (
            <a
              key={m.name}
              href={m.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1.5rem',
                padding: '1.5rem 1.75rem',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
                textDecoration: 'none',
                color: 'inherit',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ maxWidth: '520px' }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)', marginBottom: '0.35rem' }}>
                  {m.name}
                </div>
                <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
                  {m.desc}
                </p>
              </div>
              <span style={{ fontSize: '0.9rem', color: 'var(--accent, #a78bfa)', whiteSpace: 'nowrap' }}>
                {m.cta} →
              </span>
            </a>
          ))}
        </div>

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Image
            src="/saas-browser-badge-14.svg"
            alt="Featured on SaaS Browser"
            width={171}
            height={60}
          />
        </div>
      </article>

      <Footer />
    </>
  );
}
