'use client';

import { useRef, useState } from 'react';

const APPROVAL_EMAIL = `Subject: Request to Review ShortHand Classroom Documentation Tool

Hello,

I'd like to request approval to use ShortHand, a classroom documentation app built by a practicing public school teacher.

It helps teachers organize student observations and prepare parent communications. It does not send emails or messages to parents on its own, and students do not use it or have accounts.

The developer has published information about student privacy, security, and data handling for district review:
https://getshorthandapp.com/for-schools

The Data Processing Agreement is available here:
https://getshorthandapp.com/dpa

Would your department be willing to review ShortHand and let me know whether it can be approved for classroom use?

Thank you!`;

export default function CopyEmail() {
  const preRef = useRef<HTMLPreElement>(null);
  const [status, setStatus] = useState<'idle' | 'copied' | 'manual'>('idle');

  async function copy() {
    try {
      await navigator.clipboard.writeText(APPROVAL_EMAIL);
      setStatus('copied');
      setTimeout(() => setStatus('idle'), 2500);
    } catch {
      // Clipboard blocked (some in-app browsers, locked-down district devices):
      // select the text so the teacher can copy it from the system menu.
      const pre = preRef.current;
      if (pre) window.getSelection()?.selectAllChildren(pre);
      setStatus('manual');
    }
  }

  return (
    <div>
      <pre
        ref={preRef}
        style={{ margin: 0, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', fontFamily: 'inherit', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, userSelect: 'text' }}
      >
        {APPROVAL_EMAIL}
      </pre>
      <button type="button" onClick={copy} className="btn-primary" style={{ width: '100%', marginTop: 12, border: 'none', cursor: 'pointer' }}>
        {status === 'copied' ? '✓ Copied. Paste it into a new email.' : 'Copy Email'}
      </button>
      <p role="status" aria-live="polite" style={{ fontSize: '0.85rem', color: 'var(--text-dim)', margin: status === 'manual' ? '10px 0 0' : 0, lineHeight: 1.5 }}>
        {status === 'manual' ? 'Your browser blocked automatic copying. The email is selected above: use Copy from the menu, or press and hold the text to copy it.' : ''}
      </p>
    </div>
  );
}
