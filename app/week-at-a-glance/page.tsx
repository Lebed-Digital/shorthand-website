import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import TrackedLink from '../../components/TrackedLink';
import { ChatGptLink, PrintButton, PromptBox } from './PromptClient';

const PAGE_URL = 'https://getshorthandapp.com/week-at-a-glance';
const TITLE = 'Free Week at a Glance Template + ChatGPT Prompt for Teachers | ShortHand';
const DESCRIPTION =
  'A free ChatGPT prompt that turns your weekly lesson plans, specials, homework, and reminders into a one-page Monday to Friday week at a glance you can print.';
const SOCIAL_DESCRIPTION = 'Turn your lesson plans into a one-page week at a glance with ChatGPT. Free prompt, no sign-up.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: SOCIAL_DESCRIPTION,
    url: PAGE_URL,
    type: 'website',
    images: [{ url: 'https://getshorthandapp.com/og-image.png', width: 1200, height: 630, alt: 'Free week at a glance prompt for teachers' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: SOCIAL_DESCRIPTION,
    images: ['https://getshorthandapp.com/og-image.png'],
  },
};

const LETTER_COLORS = ['#e2725b', '#34d399', '#f59e0b', '#60a5fa', '#a78bfa', '#e2725b', '#34d399', '#f59e0b', '#60a5fa'];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Fictional third grade week. Generic skills only, no curriculum titles.
const EXAMPLE_ROWS: [string, string[]][] = [
  ['Reading', ['Main idea: anchor chart + model', 'Main idea vs. details practice', 'Small groups: nonfiction text', 'Text features scavenger hunt', 'Main idea quick check']],
  ['Math', ['Arrays with counters', 'Arrays to multiplication sentences', 'Multiply by 2 and 5', 'Multiply by 10', 'Quiz: lessons 1 to 4']],
  ['Writing', ['Opinion writing: pick a topic', 'Reasons and examples', 'Draft paragraph 1', 'Draft paragraph 2', 'Partner share + revise']],
  ['Science', ['Life cycles: butterfly', 'Life cycle picture sort', 'No science (early dismissal)', 'Frog vs. butterfly chart', 'Life cycle exit ticket']],
  ['Specials', ['Art', 'PE', 'Music', 'Library', 'PE']],
  ['Homework', ['Spelling list 6', 'Math practice: arrays', 'Read 20 minutes', 'Math practice: x10', 'None']],
  ['Reminders', ['Picture day forms go home', 'Staff meeting 3:15', 'Early dismissal 1:00', 'Book orders due', 'Field trip forms due']],
];

// Printing the page prints only the example sheet, on one landscape page.
const PRINT_CSS = `
@media print {
  @page { size: landscape; margin: 0.4in; }
  body { background: #fff !important; }
  .wag-noprint { display: none !important; }
  body * { visibility: hidden; }
  #wag-sheet, #wag-sheet * { visibility: visible; }
  #wag-sheet { border: none !important; box-shadow: none !important; padding: 0 !important; }
  #wag-sheet .wag-scroll { overflow: visible !important; }
  #wag-sheet table { min-width: 0 !important; font-size: 12.5pt !important; }
  #wag-sheet th, #wag-sheet td { padding: 10pt 9pt !important; }
  #wag-sheet .wag-swipe { display: none !important; }
  #wag-sheet * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
@media (min-width: 800px) {
  #wag-sheet .wag-swipe { display: none; }
}
`;

const h2Style: CSSProperties = { fontSize: 20, fontWeight: 600, color: '#f1f5f9', margin: '36px 0 12px', letterSpacing: '-0.01em' };
const pStyle: CSSProperties = { fontSize: 15, lineHeight: 1.7, color: '#cbd5e1', margin: '0 0 12px' };
const linkStyle: CSSProperties = { color: '#2dd4bf', textDecoration: 'underline' };
const strongStyle: CSSProperties = { color: '#f1f5f9' };
const quoteStyle: CSSProperties = { marginBottom: 8, color: '#e2e8f0' };
const cellStyle: CSSProperties = { border: '1px solid #cbd5e1', padding: '8px 10px', verticalAlign: 'top', textAlign: 'left' };

export default function WeekAtAGlancePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      <style>{PRINT_CSS}</style>
      <div className="wag-noprint" style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '6px 20px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', fontFamily: 'var(--font-fredoka, sans-serif)', fontWeight: 700, fontSize: 22, letterSpacing: '0.02em' }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: 'sans-serif', fontWeight: 400 }}>←</span>
          {'ShortHand'.split('').map((letter, i) => (
            <span key={i} style={{ color: LETTER_COLORS[i] }}>{letter}</span>
          ))}
        </Link>
      </div>

      <main>
      <div className="wag-noprint" style={{ maxWidth: 600, margin: '0 auto', padding: '24px 16px 0' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.01em', lineHeight: 1.25 }}>
          Turn Your Lesson Plans Into a One-Page Week at a Glance
        </h1>
        <p style={pStyle}>
          Your lesson plans are long. Specials, homework, and reminders live in emails and calendars. By Wednesday you&apos;re
          flipping through five places to answer &quot;what&apos;s next?&quot;
        </p>
        <p style={{ ...pStyle, marginBottom: 20 }}>
          Paste the plans you already have into ChatGPT with this free prompt. You get a one-page Monday to Friday table with
          what you&apos;re teaching, homework, specials, and reminders. Print it and keep it by your desk. ChatGPT only works
          with what you paste in: it can&apos;t see your calendar, email, or curriculum.
        </p>

        <PromptBox />

        <div role="note" style={{ marginTop: 16, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: 12, padding: '14px 16px' }}>
          <p style={{ ...pStyle, margin: 0, color: '#fde68a' }}>
            <strong style={{ color: '#fcd34d' }}>Protect student privacy:</strong>{' '}
            Don&apos;t paste student names, IEP or 504 details, behavior notes, or anything that identifies a student. Write
            &quot;IEP meeting 2:30,&quot; not whose. Follow your school or district&apos;s AI and student-data policies,
            including any rules about sharing curriculum materials.
          </p>
        </div>

        <h2 style={h2Style}>How to use it</h2>
        <ol style={{ ...pStyle, paddingLeft: 22, margin: '0 0 16px' }}>
          <li style={{ marginBottom: 8 }}>Gather this week&apos;s lesson plans (or a quick list), specials, homework, and reminders.</li>
          <li style={{ marginBottom: 8 }}>
            Open <ChatGptLink style={linkStyle}>ChatGPT</ChatGptLink>, paste the prompt, and replace the parts in [brackets]
            with your information. A regular chat works. You don&apos;t need a ChatGPT Project or a paid plan.
          </li>
          <li>Check the table against your plans, then ask for a printable version.</li>
        </ol>
        <ChatGptLink
          style={{ display: 'inline-block', background: 'rgba(255,255,255,0.08)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '10px 18px', borderRadius: 10, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.18)' }}
        >
          Open ChatGPT ↗
        </ChatGptLink>

        <h2 style={h2Style}>Here&apos;s what you get</h2>
        <p style={pStyle}>A made-up third grade week, the kind of one-pager the prompt is built to produce.</p>
      </div>

      <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 16px' }}>
        <div id="wag-sheet" style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>Week at a Glance</div>
            <div style={{ fontSize: 14, color: '#475569' }}>Week of ________ · 3rd Grade (example)</div>
          </div>
          <p className="wag-swipe" style={{ fontSize: 12, color: '#64748b', margin: '0 0 8px' }}>Swipe the table to see the whole week.</p>
          <div className="wag-scroll" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: 760, borderCollapse: 'collapse', tableLayout: 'fixed', fontSize: 13.5, lineHeight: 1.4, color: '#1e293b' }}>
              <thead>
                <tr>
                  <th style={{ ...cellStyle, width: '13%', background: '#0d9488', color: '#fff' }}></th>
                  {DAYS.map((day) => (
                    <th key={day} scope="col" style={{ ...cellStyle, background: '#0d9488', color: '#fff', fontWeight: 700 }}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {EXAMPLE_ROWS.map(([label, cells], i) => (
                  <tr key={label} style={{ background: i % 2 ? '#f8fafc' : '#fff' }}>
                    <th scope="row" style={{ ...cellStyle, background: '#f0fdfa', color: '#0f766e', fontWeight: 700 }}>{label}</th>
                    {cells.map((cell, j) => (
                      <td key={j} style={cellStyle}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 11, color: '#94a3b8', margin: '8px 0 0' }}>Example only. Free prompt at getshorthandapp.com/week-at-a-glance</p>
        </div>
        <div className="wag-noprint" style={{ textAlign: 'center', marginTop: 12 }}>
          <PrintButton
            style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '10px 18px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.18)', cursor: 'pointer' }}
          />
        </div>
      </div>

      <div className="wag-noprint" style={{ maxWidth: 600, margin: '0 auto', padding: '8px 16px 56px' }}>
        <h2 style={h2Style}>What to paste in</h2>
        <ul style={{ ...pStyle, paddingLeft: 22, margin: '0 0 16px' }}>
          <li style={{ marginBottom: 8 }}>
            <strong style={strongStyle}>Lesson plans or notes.</strong> Full weekly plans work. Paste them as they are and
            the prompt pulls out what fits on one page. A short list per subject works too.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong style={strongStyle}>Specials.</strong> Which special is on which day.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong style={strongStyle}>Homework.</strong> Put it under each lesson or list it separately, whichever you
            prefer. ChatGPT keeps it where you put it.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong style={strongStyle}>Reminders and announcements.</strong> Early dismissal, assemblies, forms due,
            meetings. No student names.
          </li>
          <li>
            <strong style={strongStyle}>Daily schedule (optional).</strong> Add it if you want times on the sheet. Leave it
            out and the times stay off.
          </li>
        </ul>

        <h2 style={h2Style}>Make it printable</h2>
        <p style={pStyle}>Once the table looks right, send a follow-up like one of these:</p>
        <ul style={{ ...pStyle, paddingLeft: 22, margin: '0 0 16px' }}>
          <li style={quoteStyle}>&quot;Make it fit on one landscape page with text big enough to read.&quot;</li>
          <li style={quoteStyle}>&quot;Shorten every cell to 6 words or less.&quot;</li>
          <li style={quoteStyle}>&quot;Put homework under each lesson instead of in its own row.&quot;</li>
          <li style={quoteStyle}>&quot;Make this a Word document I can print, in landscape.&quot;</li>
        </ul>
        <p style={pStyle}>
          If ChatGPT can&apos;t make a file for you, copy the table into Google Docs or Word, set the page to landscape, and
          print.
        </p>

        <h2 style={h2Style}>Check it before you print</h2>
        <p style={pStyle}>
          ChatGPT can drop a lesson, move something to the wrong day, or fill a gap with a guess, even when the prompt tells
          it not to. Take a minute to compare the table with your plans. If something is off, tell it exactly what to fix,
          like &quot;Thursday math is multiply by 10, not 5.&quot;
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
            ctaSource="week_at_a_glance_prompt"
            style={{ display: 'inline-block', background: 'linear-gradient(135deg, #0d9488, #0891b2)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '12px 28px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 4px 14px rgba(13,148,136,0.4)' }}
          >
            Try the ShortHand demo
          </TrackedLink>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: '10px 0 0' }}>No sign-up needed to look around.</p>
        </div>

        <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', marginTop: 28 }}>
          Built by a teacher, for teachers. <Link href="/tools" style={linkStyle}>More free tools</Link>
        </p>
      </div>
      </main>
    </div>
  );
}
