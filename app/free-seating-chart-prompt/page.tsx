import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import FreeToolsCta from '../../components/FreeToolsCta';
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
    images: [{ url: 'https://getshorthandapp.com/og-image-v2.png', width: 1200, height: 630, alt: 'Free AI seating chart prompt for teachers' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: 'Turn a photo of your empty classroom into a clean seating chart with ChatGPT. Free prompt, no sign-up.',
    images: ['https://getshorthandapp.com/og-image-v2.png'],
  },
};

const LETTER_COLORS = ['#E5484D', '#0E9A60', '#C27A00', '#3B82F6', '#A855F7', '#E5484D', '#0E9A60', '#C27A00', '#3B82F6'];

const h2Style: CSSProperties = { fontSize: 20, fontWeight: 600, color: 'var(--text)', margin: '36px 0 12px', letterSpacing: '-0.01em' };
const pStyle: CSSProperties = { fontSize: 15, lineHeight: 1.7, color: 'var(--text-dim)', margin: '0 0 12px' };
const linkStyle: CSSProperties = { color: 'var(--teal)', textDecoration: 'underline' };

export default function FreeSeatingChartPromptPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '6px 20px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', fontFamily: 'var(--font-fredoka, sans-serif)', fontWeight: 700, fontSize: 22, letterSpacing: '0.02em' }}>
          <span style={{ color: 'var(--text-dim)', fontSize: 14, fontFamily: 'sans-serif', fontWeight: 400 }}>←</span>
          {'ShortHand'.split('').map((letter, i) => (
            <span key={i} style={{ color: LETTER_COLORS[i] }}>{letter}</span>
          ))}
        </Link>
      </div>

      <main style={{ maxWidth: 600, margin: '0 auto', padding: '24px 16px 56px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', margin: '0 0 10px', letterSpacing: '-0.01em', lineHeight: 1.25 }}>
          Turn Your Classroom Layout Into a Seating Chart With ChatGPT
        </h1>
        <p style={{ ...pStyle, marginBottom: 20 }}>
          Want a clean, digital version of your classroom seating arrangement? Upload a photo or sketch of your empty
          classroom layout to ChatGPT, paste this free prompt, and create a seating chart you can use as a starting point.
        </p>

        <PromptBox />

        <div role="note" style={{ marginTop: 16, background: '#fffbeb', border: '1px solid #f59e0b', borderRadius: 12, padding: '14px 16px' }}>
          <p style={{ ...pStyle, margin: 0, color: '#78350f' }}>
            <strong style={{ color: '#78350f' }}>Protect student privacy:</strong>{' '}
            Upload only an empty classroom layout. Don&apos;t include student names, photographs, behavior notes,
            accommodations, or other identifying student information. Follow your school or district&apos;s AI and
            student-data policies.
          </p>
        </div>

        <h2 style={h2Style}>How to use it</h2>
        <ol style={{ ...pStyle, paddingLeft: 22, margin: '0 0 16px' }}>
          <li style={{ marginBottom: 8 }}>Take a photo or draw a simple sketch of your <strong style={{ color: 'var(--text)' }}>empty</strong> classroom layout.</li>
          <li style={{ marginBottom: 8 }}>
            Open <ChatGptLink style={linkStyle}>ChatGPT</ChatGptLink>, attach your image, and paste the prompt.
          </li>
          <li>Review the generated chart, ask for changes if something is off, and save or print your finished layout.</li>
        </ol>
        <ChatGptLink
          style={{ display: 'inline-block', background: 'var(--surface)', color: 'var(--text)', fontWeight: 700, fontSize: 14, padding: '10px 18px', borderRadius: 10, textDecoration: 'none', border: '1px solid var(--border-bright)' }}
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

        <FreeToolsCta ctaSource="seating_chart_prompt" />
      </main>
    </div>
  );
}
