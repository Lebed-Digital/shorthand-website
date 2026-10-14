import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import TrackedLink from '../../components/TrackedLink';
import { ChatGptLink, PromptBox } from './PromptClient';

const PAGE_URL = 'https://getshorthandapp.com/free-seating-chart-prompt';
const TITLE = 'Free AI Seating Chart Prompt for Teachers | ShortHand';
const DESCRIPTION =
  'A free ChatGPT seating chart prompt for teachers. Upload a photo or sketch of your empty classroom layout and get a clean, printable classroom seating chart to start from.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: 'Turn a photo of your empty classroom into a clean seating chart with ChatGPT. Free prompt, no sign-up.',
    url: PAGE_URL,
    type: 'website',
    images: [{ url: 'https://getshorthandapp.com/og-image.png', width: 1200, height: 630, alt: 'Free AI seating chart prompt for teachers' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: 'Turn a photo of your empty classroom into a clean seating chart with ChatGPT. Free prompt, no sign-up.',
    images: ['https://getshorthandapp.com/og-image.png'],
  },
};

const LETTER_COLORS = ['#e2725b', '#34d399', '#f59e0b', '#60a5fa', '#a78bfa', '#e2725b', '#34d399', '#f59e0b', '#60a5fa'];

const h2Style: CSSProperties = { fontSize: 20, fontWeight: 600, color: '#f1f5f9', margin: '36px 0 12px', letterSpacing: '-0.01em' };
const pStyle: CSSProperties = { fontSize: 15, lineHeight: 1.7, color: '#cbd5e1', margin: '0 0 12px' };
const linkStyle: CSSProperties = { color: '#2dd4bf', textDecoration: 'underline' };

export default function FreeSeatingChartPromptPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '6px 20px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', fontFamily: 'var(--font-fredoka, sans-serif)', fontWeight: 700, fontSize: 22, letterSpacing: '0.02em' }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: 'sans-serif', fontWeight: 400 }}>←</span>
          {'ShortHand'.split('').map((letter, i) => (
            <span key={i} style={{ color: LETTER_COLORS[i] }}>{letter}</span>
          ))}
        </Link>
      </div>

      <main style={{ maxWidth: 600, margin: '0 auto', padding: '24px 16px 56px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.01em', lineHeight: 1.25 }}>
          Turn Your Classroom Layout Into a Seating Chart With ChatGPT
        </h1>
        <p style={{ ...pStyle, marginBottom: 20 }}>
          Want a clean, digital version of your classroom seating arrangement? Upload a photo or sketch of your empty
          classroom layout to ChatGPT, paste this free prompt, and create a seating chart you can use as a starting point.
        </p>

        <PromptBox />

        <div role="note" style={{ marginTop: 16, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: 12, padding: '14px 16px' }}>
          <p style={{ ...pStyle, margin: 0, color: '#fde68a' }}>
            <strong style={{ color: '#fcd34d' }}>Protect student privacy:</strong>{' '}
            Upload only an empty classroom layout. Don&apos;t include student names, photographs, behavior notes,
            accommodations, or other identifying student information. Follow your school or district&apos;s AI and
            student-data policies.
          </p>
        </div>

        <h2 style={h2Style}>How to use it</h2>
        <ol style={{ ...pStyle, paddingLeft: 22, margin: '0 0 16px' }}>
          <li style={{ marginBottom: 8 }}>Take a photo or draw a simple sketch of your <strong style={{ color: '#f1f5f9' }}>empty</strong> classroom layout.</li>
          <li style={{ marginBottom: 8 }}>
            Open <ChatGptLink style={linkStyle}>ChatGPT</ChatGptLink>, attach your image, and paste the prompt.
          </li>
          <li>Review the generated chart, ask for changes if something is off, and save or print your finished layout.</li>
        </ol>
        <ChatGptLink
          style={{ display: 'inline-block', background: 'rgba(255,255,255,0.08)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '10px 18px', borderRadius: 10, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.18)' }}
        >
          Open ChatGPT ↗
        </ChatGptLink>

        <h2 style={h2Style}>What to expect</h2>
        <p style={pStyle}>
          ChatGPT gives you a picture, not an editable document. Treat it as a clean first draft.
        </p>
        <p style={pStyle}>
          It can miscount desks or shift things around, so check it against your room. If something is wrong, tell it
          exactly what to fix, like &quot;the back row has 6 desks, not 5&quot; or &quot;move the door to the left wall.&quot;
        </p>
        <p style={pStyle}>
          Spacing and measurements won&apos;t be exact. It&apos;s a seating chart, not a floor plan.
        </p>
        <p style={pStyle}>
          Add student names after you print it, by hand or in a tool your school approves, so names never go into ChatGPT.
        </p>

        <div style={{ background: 'rgba(13,148,136,0.15)', borderRadius: 16, padding: 24, marginTop: 40, border: '1px solid rgba(13,148,136,0.3)', textAlign: 'center' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Like simple tools that make teaching easier?</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: '0 0 16px', lineHeight: 1.6 }}>
            ShortHand is the app I built for my own classroom. Jot quick observations during the day, track how
            students are progressing over time, and have your notes ready when it&apos;s time to talk with families.
          </p>
          <TrackedLink
            href="https://app.getshorthandapp.com?demo=true"
            label="app"
            ctaSource="seating_chart_prompt"
            style={{ display: 'inline-block', background: 'linear-gradient(135deg, #0d9488, #0891b2)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '12px 28px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 4px 14px rgba(13,148,136,0.4)' }}
          >
            Try the ShortHand demo
          </TrackedLink>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: '10px 0 0' }}>No sign-up needed to look around.</p>
        </div>

        <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', marginTop: 28 }}>
          Built by a teacher, for teachers. <Link href="/tools" style={linkStyle}>More free tools</Link>
        </p>
      </main>
    </div>
  );
}
