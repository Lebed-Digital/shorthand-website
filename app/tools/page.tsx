import type { Metadata } from 'next';
import Link from 'next/link';
import { Fragment } from 'react';
import BlogNav from '../../components/BlogNav';
import Footer from '../../components/Footer';
import TrackedLink from '../../components/TrackedLink';

const DESCRIPTION =
  'Free teacher tools: report card comment and welcome letter generators, a printable parent communication log, and ChatGPT seating chart and weekly planning prompts.';

export const metadata: Metadata = {
  title: 'Free Tools for Teachers | ShortHand',
  description: DESCRIPTION,
  alternates: { canonical: 'https://getshorthandapp.com/tools' },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Tools for Teachers | ShortHand',
    description: DESCRIPTION,
    images: ['https://getshorthandapp.com/og-image-v2.png'],
  },
  openGraph: {
    title: 'Free Tools for Teachers | ShortHand',
    description: DESCRIPTION,
    url: 'https://getshorthandapp.com/tools',
    type: 'website',
    images: [
      {
        url: 'https://getshorthandapp.com/og-image-v2.png',
        width: 1200,
        height: 630,
        alt: 'Free Tools for Teachers from ShortHand',
      },
    ],
  },
};

const tools = [
  {
    title: 'Report Card Comment Generator',
    description:
      'Pick strengths, growth areas, and behavior observations. Get a polished comment in seconds. Editable before you copy.',
    href: '/report-card-comment-generator',
    label: 'Open Tool',
    accent: '#0d9488',
    bg: '#f0fdfa',
    tag: 'Free AI Tool',
    signals: ['Free to use', 'Works for any grade', 'Editable output'],
  },
  {
    title: 'Welcome Letter Generator',
    description:
      'Ready-to-send welcome letters for families. Pick your grade, pick your tone, done in 30 seconds.',
    href: '/back-to-school-toolkit',
    label: 'Open Tool',
    accent: '#16a34a',
    bg: '#f0fdf4',
    tag: 'Free AI Tool',
    signals: ['Free to use', 'Works for Pre-K through 8th grade', 'Editable output'],
  },
  {
    title: 'Parent Communication Log',
    description:
      'Track every call, email, and note home in one printable log. Fill it in online and print, or print blank and fill by hand.',
    href: '/tools/parent-communication-log',
    label: 'Open Tool',
    accent: '#7c3aed',
    bg: '#f5f3ff',
    tag: 'Free Printable',
    signals: ['Free to use', 'No sign-up required', 'Print-ready'],
  },
  {
    title: 'AI Seating Chart Prompt',
    description:
      'Snap a photo of your empty classroom, paste this prompt into ChatGPT, and get a clean seating chart to start from.',
    href: '/free-seating-chart-prompt',
    label: 'Get the Prompt',
    accent: '#0369a1',
    bg: '#f0f9ff',
    tag: 'Free ChatGPT Prompt',
    signals: ['Free to use', 'No sign-up required', 'Works with ChatGPT'],
  },
  {
    title: 'Week at a Glance Prompt',
    description:
      'Paste your lesson plans, specials, homework, and reminders into ChatGPT and get a one-page Monday to Friday overview to print.',
    href: '/week-at-a-glance',
    label: 'Get the Prompt',
    accent: '#b45309',
    bg: '#fffbeb',
    tag: 'Free ChatGPT Prompt',
    signals: ['Free to use', 'No sign-up required', 'Works with ChatGPT'],
  },
  {
    title: 'Teacher Freebie Finder Prompt',
    description:
      'Set up a daily ChatGPT task that searches for teacher discounts, free tools, and promotions, and only flags the ones worth your time.',
    href: '/chatgpt-teacher-freebies',
    label: 'Get the Prompt',
    accent: '#be123c',
    bg: '#fff1f2',
    tag: 'Free ChatGPT Prompt',
    signals: ['Free to use', 'No sign-up required', 'Works with ChatGPT'],
  },
];

export default function ToolsPage() {
  return (
    <>
      <BlogNav showLibraryCta={false} />
      <header className="detail-hero" style={{ paddingBottom: 32 }}>
        <h1 className="detail-title">Free Tools <em>for Teachers</em></h1>
        <p className="detail-desc">Write a report card comment, welcome a family, or keep a printable contact log.</p>
      </header>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 16px 48px' }}>

        {tools.map((tool, index) => (
          <Fragment key={tool.href}>
          {index === 3 && <h2 style={{ fontSize: '1.25rem', margin: '40px 0 16px' }}>Prompts to use with ChatGPT</h2>}
          <div style={{ background: tool.bg, borderRadius: 16, padding: 24, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.3)', borderLeft: `4px solid ${tool.accent}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: tool.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{tool.tag}</span>
            </div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', margin: '0 0 8px', lineHeight: 1.3 }}>{tool.title}</h2>
            <p style={{ fontSize: 14, color: '#334155', margin: '0 0 16px', lineHeight: 1.6 }}>{tool.description}</p>
            <Link
              href={tool.href}
              style={{ display: 'inline-block', background: tool.accent, color: '#fff', fontWeight: 700, fontSize: 13, padding: '10px 20px', borderRadius: 10, textDecoration: 'none', letterSpacing: '0.01em' }}
            >
              {tool.label} →
            </Link>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginTop: 12 }}>
              {tool.signals.map((signal) => (
                <span key={signal} style={{ fontSize: 12, color: '#334155', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ color: tool.accent, fontWeight: 700 }}>✓</span> {signal}
                </span>
              ))}
            </div>
          </div>
          </Fragment>
        ))}

        {/* Deliberately not in the `tools` array above: that list is the free
            tools, and this one is paid. Placed after them so the free tools stay
            the page's first answer. */}
        <div style={{ background: '#f0fdfa', borderRadius: 16, padding: 24, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.3)', borderLeft: '4px solid #0d9488' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#0d9488', textTransform: 'uppercase', letterSpacing: '0.08em' }}>$4.99 one-time</span>
          </div>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', margin: '0 0 8px', lineHeight: 1.3 }}>Report Card Comment Library</h2>
          <p style={{ fontSize: 14, color: '#334155', margin: '0 0 16px', lineHeight: 1.6 }}>
            The generator above writes one comment. If you have the rest of the class to write, this is
            374 comments you can search, filter, and copy with the student name already filled in.
          </p>
          <Link
            href="/report-card-comment-library"
            style={{ display: 'inline-block', background: '#0d9488', color: '#fff', fontWeight: 700, fontSize: 13, padding: '10px 20px', borderRadius: 10, textDecoration: 'none', letterSpacing: '0.01em' }}
          >
            See the library &rarr;
          </Link>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginTop: 12 }}>
            {['Try a free sample first', 'No sign-up to buy', 'One-time, no subscription'].map((signal) => (
              <span key={signal} style={{ fontSize: 12, color: '#334155', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: '#0d9488', fontWeight: 700 }}>&#10003;</span> {signal}
              </span>
            ))}
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 24, marginTop: 8, border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: '0 0 6px' }}>More tools coming soon.</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Follow along at <a href="https://www.instagram.com/getshorthand_app" target="_blank" rel="noopener noreferrer" style={{ color: '#34d399', textDecoration: 'none' }}>@getshorthand_app</a> on Instagram.</p>
        </div>

        <div style={{ background: 'rgba(13,148,136,0.15)', borderRadius: 16, padding: 24, marginTop: 12, border: '1px solid rgba(13,148,136,0.3)', textAlign: 'center' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Want this built into your daily routine?</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', margin: '0 0 16px', lineHeight: 1.6 }}>
            ShortHand automatically logs parent contacts, behavior notes, and follow-ups in one searchable timeline. No binders. No spreadsheets. No trying to remember what happened three months ago.
          </p>
          <TrackedLink
            href="https://app.getshorthandapp.com/?demo=true"
            label="tools_try_demo" ctaSource="tools"
            style={{ display: 'inline-block', background: 'linear-gradient(135deg, #0d9488, #0891b2)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '12px 28px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 4px 14px rgba(13,148,136,0.4)' }}
          >
            Try the Free Demo
          </TrackedLink>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '10px 0 0' }}>No credit card. No setup. Works on your phone.</p>
        </div>

      </div>
      <Footer />
    </>
  );
}
