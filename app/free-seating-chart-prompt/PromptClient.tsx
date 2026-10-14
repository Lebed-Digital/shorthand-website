'use client';

import { useRef, useState } from 'react';
import { fireCtaClick, fireSeatingChartPromptCopied } from '../../lib/gtag';

const SEATING_CHART_PROMPT = `Look at the attached picture of my classroom layout and turn it into a clean, easy-to-read, top-down classroom seating chart.

Please follow these instructions:

1. Use my uploaded picture as the reference for the room layout.
2. Preserve the approximate position, shape, and number of student desks or tables.
3. Include important classroom features that are visible, such as the teacher's desk, whiteboard, classroom door, and small-group table.
4. Represent individual student seats clearly, with empty spaces where I can add names later.
5. Make the chart neat, professional, and simple enough to print on standard paper.
6. Use a clear visual style with readable labels and enough spacing between desks.
7. Keep the arrangement as close to my original layout as possible rather than redesigning my classroom.
8. Do not invent extra desks, seating groups, or classroom features.
9. If something in the picture is unclear, ask me a question rather than guessing.
10. Return the result as a clean, top-down seating chart image.

Important: My reference image should show an EMPTY classroom layout without student names, student photographs, or other identifying information.`;

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
      await navigator.clipboard.writeText(SEATING_CHART_PROMPT);
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
    fireSeatingChartPromptCopied();
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
        {SEATING_CHART_PROMPT}
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
      onClick={() => fireCtaClick({ cta_source: 'seating_chart_prompt', cta_destination: 'chatgpt' })}
    >
      {children}
    </a>
  );
}
