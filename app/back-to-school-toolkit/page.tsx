import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import WelcomeLetterClient from './WelcomeLetterClient';

export const metadata: Metadata = {
  title: 'Free Welcome Letter Generator for Teachers | ShortHand',
  description: 'Create a personalized back-to-school welcome letter in seconds. Free for teachers, with no sign-up required.',
  alternates: { canonical: 'https://getshorthandapp.com/back-to-school-toolkit' },
  openGraph: {
    title: 'Free Welcome Letter Generator for Teachers',
    description: 'Create a personalized back-to-school welcome letter in seconds. Free for teachers.',
    url: 'https://getshorthandapp.com/back-to-school-toolkit',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'ShortHand Welcome Letter Generator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Welcome Letter Generator for Teachers',
    description: 'Create a personalized back-to-school welcome letter in seconds. Free for teachers.',
    images: ['/og-image.png'],
  },
};

const h2Style: CSSProperties = {
  fontSize: 20,
  fontWeight: 600,
  color: '#f1f5f9',
  margin: '0 0 12px',
  letterSpacing: '-0.01em',
};

const pStyle: CSSProperties = {
  fontSize: 14,
  lineHeight: 1.7,
  color: '#94a3b8',
  margin: '0 0 14px',
};

const linkStyle: CSSProperties = {
  color: '#2dd4bf',
  textDecoration: 'underline',
};

export default function BackToSchoolToolkitPage() {
  return (
    <>
      <WelcomeLetterClient />
      <section style={{ background: '#0f172a', padding: '8px 16px 64px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={h2Style}>How it works</h2>
          <p style={pStyle}>
            Enter your name, pick your grade level, add your subject if you teach one, and choose a
            tone: warm, funny, or professional. The generator writes a complete parent welcome
            letter for the start of the school year. If the first draft is not quite right, tell it
            what to change and it rewrites the letter on the spot. Copy it, paste it into your class
            app or email, and send.
          </p>
          <p style={pStyle}>
            It is free, works on your phone, and there is no account to create.
          </p>

          <h2 style={{ ...h2Style, marginTop: 32 }}>What a generated letter looks like</h2>
          <p style={pStyle}>
            Every letter covers the things families actually want from a back-to-school welcome:
            who you are, one human detail that makes you a person and not a job title, what parents
            can expect from your classroom this year, exactly how to reach you and how fast you
            reply, and an invitation for parents to share something about their child. Short enough
            to read at a kitchen table, warm enough to set the tone for the whole year.
          </p>

          <h2 style={{ ...h2Style, marginTop: 32 }}>Want to write it yourself?</h2>
          <p style={pStyle}>
            The generator gets you a solid letter in seconds, but if you would rather build your
            own, these guides cover every version of the first message home:
          </p>
          <p style={pStyle}>
            <Link href="/blog/welcome-letter-to-parents-from-teacher" style={linkStyle}>
              Welcome letter examples with notes on what makes each one work
            </Link>
            {' '}covers four real letters, including a fill-in-the-blank template.
          </p>
          <p style={pStyle}>
            <Link href="/blog/short-welcome-message-to-parents-from-teacher" style={linkStyle}>
              30 short welcome messages for class apps, texts, and WhatsApp
            </Link>
            {' '}is for the two-to-four sentence versions.
          </p>
          <p style={pStyle}>
            <Link href="/blog/teacher-introduction-letter-to-parents" style={linkStyle}>
              Teacher introduction letter examples
            </Link>
            {' '}is for new teachers, mid-year starts, and specialists introducing themselves for
            the first time.
          </p>
        </div>
      </section>
    </>
  );
}
