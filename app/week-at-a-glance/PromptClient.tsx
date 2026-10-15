'use client';

import { useRef, useState } from 'react';
import { fireCtaClick, fireWeekGlancePromptCopied } from '../../lib/gtag';

// Same copy box as /free-seating-chart-prompt, kept as its own copy so the
// live seating chart page is untouched.
const WEEK_GLANCE_PROMPT = `I'm a teacher. Turn the information below into a one-page "Week at a Glance" I can print and keep on my desk.

You can work from my full lesson plans or from short notes. Pull out only what I need to see at a glance: what I'm teaching each day, specials, homework, and reminders. Don't rewrite or improve my lessons.

Please follow these rules:

1. Use only the information I give you. Don't add lessons, activities, dates, times, or reminders that aren't in it.
2. If something is missing or unclear, leave the cell blank or write "?" and list your questions under the table. Don't guess.
3. Make a table with these columns: Monday, Tuesday, Wednesday, Thursday, Friday.
4. Make one row for each subject I teach, then rows for Specials, Homework, and Reminders.
5. If my homework is listed with a lesson, keep it with that lesson and leave out the Homework row. If I list homework separately, use the Homework row.
6. If I include a daily schedule, add the times to the subject rows. If I don't, leave times out.
7. Keep each cell short (about 3 to 10 words) so the whole table fits on one landscape page with text that is easy to read.

Week of: [DATE]

MY LESSON PLANS OR NOTES:
[Paste your weekly lesson plans as they are, or a short list of what you're teaching in each subject each day.]

SPECIALS:
[Example: Mon Art, Tue PE, Wed Music, Thu Library, Fri PE]

HOMEWORK (skip if it's already in your plans):
[Example: Mon spelling list, Tue math practice page]

REMINDERS AND ANNOUNCEMENTS:
[Example: Wed early dismissal 1:00, Fri field trip forms due. No student names.]

DAILY SCHEDULE (optional):
[Example: 9:00 Reading, 10:30 Math, 12:45 Writing]`;

const CHATGPT_URL = 'https://chatgpt.com/';

const buttonStyle: React.CSSProperties = {
  background: '#0d9488',
  color: '#fff',
  fontWeight: 700,
  fontSize: 15,
  padding: '12px 20px',
  borderRadius: 10,
  border: 'none',
  cursor: 'pointer',
};

export function PromptBox() {
  const preRef = useRef<HTMLPreElement>(null);
  const [status, setStatus] = useState<'idle' | 'copied' | 'manual'>('idle');

  async function copy() {
    try {
      await navigator.clipboard.writeText(WEEK_GLANCE_PROMPT);
      setStatus('copied');
      setTimeout(() => setStatus('idle'), 2500);
    } catch {
      // Some in-app browsers (Instagram, TikTok) block the clipboard. Select
      // the prompt so the teacher can copy it from the system menu instead.
      const pre = preRef.current;
      if (pre) window.getSelection()?.selectAllChildren(pre);
      setStatus('manual');
      return;
    }
    fireWeekGlancePromptCopied();
  }

  const label = status === 'copied' ? '✓ Copied! Now paste it into ChatGPT' : 'Copy Prompt';

  return (
    <div style={{ background: '#f8fafc', borderRadius: 16, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.3)', borderLeft: '4px solid #0d9488' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#0f766e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Free ChatGPT prompt</span>
        <button type="button" onClick={copy} style={{ ...buttonStyle, fontSize: 13, padding: '8px 14px' }}>
          {status === 'copied' ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre
        ref={preRef}
        style={{ margin: 0, maxHeight: 260, overflowY: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit', fontSize: 14, lineHeight: 1.6, color: '#1e293b', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 14, userSelect: 'text' }}
      >
        {WEEK_GLANCE_PROMPT}
      </pre>
      <button type="button" onClick={copy} style={{ ...buttonStyle, width: '100%', marginTop: 12 }}>
        {label}
      </button>
      <p role="status" aria-live="polite" style={{ fontSize: 13, color: '#475569', margin: status === 'manual' ? '10px 0 0' : 0, lineHeight: 1.5 }}>
        {status === 'manual' ? 'Your browser blocked automatic copying. The prompt is selected above: tap Copy in the menu, or press and hold the text to copy it.' : ''}
      </p>
    </div>
  );
}

export function ChatGptLink({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <a
      href={CHATGPT_URL}
      target="_blank"
      rel="noopener noreferrer"
      style={style}
      onClick={() => fireCtaClick({ cta_source: 'week_at_a_glance_prompt', cta_destination: 'chatgpt' })}
    >
      {children}
    </a>
  );
}

export function PrintButton({ style }: { style?: React.CSSProperties }) {
  return (
    <button type="button" onClick={() => window.print()} style={style}>
      Print this example
    </button>
  );
}
