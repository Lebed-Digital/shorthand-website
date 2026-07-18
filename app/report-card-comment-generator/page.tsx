import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import FreeToolClient from './FreeToolClient';

export const metadata: Metadata = {
  title: 'Free Report Card Comment Generator for Teachers',
  description:
    'Generate polished report card comments in 10 seconds. Pick strengths, struggles, and behavior, and get a personalized comment instantly. Free, no sign-up required.',
  alternates: { canonical: 'https://getshorthandapp.com/report-card-comment-generator' },
  openGraph: {
    title: 'Free Report Card Comment Generator for Teachers',
    description:
      'Generate polished report card comments in 10 seconds. Free, no sign-up required.',
    url: 'https://getshorthandapp.com/report-card-comment-generator',
    type: 'website',
    images: [
      {
        url: 'https://getshorthandapp.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'ShortHand Report Card Comment Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Report Card Comment Generator for Teachers',
    description: 'Generate polished report card comments in 10 seconds. Free, no sign-up required.',
    images: ['https://getshorthandapp.com/og-image.webp'],
  },
};

const h2Style: CSSProperties = {
  fontSize: 20,
  fontWeight: 600,
  color: '#f1f5f9',
  margin: '32px 0 12px',
  letterSpacing: '-0.01em',
};

const h3Style: CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  color: '#cbd5e1',
  margin: '20px 0 8px',
};

const pStyle: CSSProperties = {
  fontSize: 14,
  lineHeight: 1.7,
  color: '#94a3b8',
  margin: '0 0 14px',
};

const sampleStyle: CSSProperties = {
  fontSize: 14,
  lineHeight: 1.7,
  color: '#94a3b8',
  margin: '0 0 12px',
  paddingLeft: 14,
  borderLeft: '3px solid #134e4a',
};

const linkStyle: CSSProperties = {
  color: '#2dd4bf',
  textDecoration: 'underline',
};

export default function ReportCardCommentGeneratorPage() {
  return (
    <>
      <FreeToolClient />
      <section style={{ background: '#0f172a', padding: '8px 16px 64px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ ...h2Style, marginTop: 0 }}>How the report card comment generator works</h2>
          <p style={pStyle}>
            Pick what you actually observed: academic strengths, areas for growth, and social or
            behavior notes. Choose a length and a tone, add any extra context in your own words
            (or dictate it with the microphone), and hit generate. You get a polished comment in
            about 10 seconds. If it is not quite right, type a refinement like &quot;make it
            warmer&quot; or &quot;focus on the behavior part&quot; and it rewrites on the spot.
          </p>
          <p style={pStyle}>
            The generator only mentions what you select. It will not invent skills, incidents, or
            details you did not give it, which is exactly what you want in a comment a parent will
            read. Free, no account, works on your phone.
          </p>

          <h2 style={h2Style}>Sample generated comments</h2>
          <p style={pStyle}>These are typical of what the generator produces.</p>

          <h3 style={h3Style}>Strengths-focused</h3>
          <p style={sampleStyle}>
            &quot;Alex has had a strong term in reading and writing. He picks up new material
            quickly, participates actively in class discussions, and his written work shows real
            care. It has been a pleasure watching his confidence grow.&quot;
          </p>
          <p style={sampleStyle}>
            &quot;Maya is a natural problem solver. She approaches math tasks with persistence,
            tries multiple strategies before asking for help, and often explains her thinking to
            classmates. Her curiosity sets a wonderful tone in our room.&quot;
          </p>

          <h3 style={h3Style}>Growth-focused</h3>
          <p style={sampleStyle}>
            &quot;Jordan is making steady progress in reading fluency. He works hard during small
            group time and is beginning to read with more expression. Continued practice at home
            with familiar books would support the momentum he has built.&quot;
          </p>
          <p style={sampleStyle}>
            &quot;Sofia is developing her number sense and benefits from hands-on materials when
            tackling new concepts. She does not give up, and that persistence is starting to pay
            off in her independent work.&quot;
          </p>

          <h3 style={h3Style}>Behavior and social</h3>
          <p style={sampleStyle}>
            &quot;Ethan is kind to his classmates and works well in groups. We are working on
            staying focused during independent tasks, and he responds well to gentle reminders and
            a consistent routine.&quot;
          </p>
          <p style={sampleStyle}>
            &quot;Lily has shown real growth in self-advocacy this term. She asks for help when she
            needs it and has become a dependable partner during group work.&quot;
          </p>

          <h2 style={h2Style}>Frequently asked questions</h2>

          <h3 style={h3Style}>Is the report card comment generator really free?</h3>
          <p style={pStyle}>
            Yes. No account, no payment, no trial that expires. Pick your options, generate,
            refine, and copy as many comments as you need.
          </p>

          <h3 style={h3Style}>Can I use AI-generated comments on real report cards?</h3>
          <p style={pStyle}>
            Treat the output as a first draft. The generator only writes from what you selected,
            so the observations are yours; it just handles the phrasing. Read every comment before
            it goes home, adjust anything that does not sound like you, and write from scratch for
            students who need carefully individualized language, like IEP contexts.
          </p>

          <h3 style={h3Style}>How do I make the comments sound like me?</h3>
          <p style={pStyle}>
            Use the &quot;Anything else?&quot; box. One sentence of real context, like &quot;made
            big progress since January&quot; or &quot;loves soccer,&quot; changes the whole
            comment. Then use the refine box to nudge tone: warmer, more formal, shorter.
          </p>

          <h3 style={h3Style}>Does it work for preschool and kindergarten report cards?</h3>
          <p style={pStyle}>
            Yes. Choose the casual tone and keep comments short. For ready-made early childhood
            language, see our{' '}
            <Link href="/blog/preschool-report-card-comments" style={linkStyle}>
              preschool report card comments
            </Link>{' '}
            with 60+ examples by developmental domain.
          </p>

          <h2 style={h2Style}>Ready-to-copy comment banks</h2>
          <p style={pStyle}>
            If you would rather browse examples than generate them, these are our most-used
            collections:
          </p>
          <p style={pStyle}>
            <Link href="/blog/report-card-comments-for-behavior" style={linkStyle}>
              Report card comments for behavior
            </Link>
            {' '}covers 120+ examples, from strong behavior to the hardest-to-write cases.
          </p>
          <p style={pStyle}>
            <Link href="/blog/report-card-comments-for-students-with-adhd" style={linkStyle}>
              Comments for students with ADHD
            </Link>
            {' '}and{' '}
            <Link href="/blog/report-card-comments-for-struggling-students" style={linkStyle}>
              comments for struggling students
            </Link>
            {' '}handle the reports that need extra care.
          </p>
          <p style={pStyle}>
            <Link href="/blog/social-emotional-report-card-comments" style={linkStyle}>
              Social emotional report card comments
            </Link>
            {' '}covers SEL sections, and{' '}
            <Link href="/blog/free-report-card-comment-generator" style={linkStyle}>
              this guide to getting the most out of the generator
            </Link>
            {' '}explains when to use it and when to write from your own notes.
          </p>
        </div>
      </section>
    </>
  );
}
