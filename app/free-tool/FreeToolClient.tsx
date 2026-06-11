'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';

const SECTIONS = [
  {
    id: 'strengths',
    label: 'Academic strengths',
    color: 'teal',
    accent: '#0d9488',
    bg: '#f0fdfa',
    items: [
      { id: 's_math', label: 'Math' },
      { id: 's_ela', label: 'ELA' },
      { id: 's_reading', label: 'Reading' },
      { id: 's_writing', label: 'Writing' },
      { id: 's_science', label: 'Science' },
      { id: 's_social_studies', label: 'Social Studies' },
      { id: 's_phonics', label: 'Phonics' },
      { id: 's_problem_solving', label: 'Problem solving' },
      { id: 's_creativity', label: 'Creativity' },
      { id: 's_critical_thinking', label: 'Critical thinking' },
    ],
  },
  {
    id: 'struggles',
    label: 'Areas for growth',
    color: 'amber',
    accent: '#d97706',
    bg: '#fffbeb',
    items: [
      { id: 'g_math', label: 'Math' },
      { id: 'g_ela', label: 'ELA' },
      { id: 'g_reading', label: 'Reading' },
      { id: 'g_writing', label: 'Writing' },
      { id: 'g_science', label: 'Science' },
      { id: 'g_social_studies', label: 'Social Studies' },
      { id: 'g_phonics', label: 'Phonics' },
      { id: 'g_comprehension', label: 'Reading comprehension' },
      { id: 'g_number_sense', label: 'Number sense' },
      { id: 'g_fluency', label: 'Reading fluency' },
    ],
  },
  {
    id: 'behavior',
    label: 'Social & behavior',
    color: 'violet',
    accent: '#7c3aed',
    bg: '#f5f3ff',
    items: [
      { id: 'b_participates', label: 'Participates actively' },
      { id: 'b_kind', label: 'Kind to peers' },
      { id: 'b_focused', label: 'Stays focused' },
      { id: 'b_effort', label: 'Strong effort' },
      { id: 'b_leadership', label: 'Shows leadership' },
      { id: 'b_growth', label: 'Showing recent growth' },
      { id: 'b_disruptive', label: 'Can be disruptive' },
      { id: 'b_off_task', label: 'Struggles to stay on task' },
      { id: 'b_social', label: 'Working on social skills' },
      { id: 'b_independent', label: 'Works well independently' },
      { id: 'b_cooperative', label: 'Works well in groups' },
      { id: 'b_self_advocacy', label: 'Asks for help when needed' },
    ],
  },
];

const CHIP_COLORS: Record<string, { active: React.CSSProperties; inactive: React.CSSProperties }> = {
  teal: {
    active: { background: '#0d9488', color: '#fff', borderColor: '#0d9488' },
    inactive: { background: '#f0fdfa', color: '#134e4a', borderColor: '#99f6e4' },
  },
  amber: {
    active: { background: '#f59e0b', color: '#fff', borderColor: '#f59e0b' },
    inactive: { background: '#fffbeb', color: '#78350f', borderColor: '#fde68a' },
  },
  violet: {
    active: { background: '#7c3aed', color: '#fff', borderColor: '#7c3aed' },
    inactive: { background: '#f5f3ff', color: '#4c1d95', borderColor: '#ddd6fe' },
  },
};

const LENGTH_OPTIONS = [
  { id: 'short', label: 'Short', hint: '1–2 sentences' },
  { id: 'medium', label: 'Medium', hint: '3–4 sentences' },
  { id: 'long', label: 'Long', hint: '5–6 sentences' },
];

const LENGTH_INSTRUCTIONS: Record<string, string> = {
  short: 'Write exactly 1-2 sentences.',
  medium: 'Write exactly 3-4 sentences.',
  long: 'Write exactly 5-6 sentences.',
};

const TONE_INSTRUCTIONS: Record<string, string> = {
  casual:
    'Write in a warm, conversational tone, like a teacher talking directly to a family. Friendly, personal, and approachable. Use everyday language a parent would naturally use. Avoid formal or academic vocabulary like "aptitude," "demonstrate," or "consistently exhibits."',
  academic:
    'Write in a formal, professional tone suitable for official school records. Precise, measured, and objective.',
};

function buildPrompt(name: string, selected: Set<string>, extra: string, length: string, tone: string) {
  const strengths = SECTIONS[0].items.filter((i) => selected.has(i.id)).map((i) => i.label);
  const struggles = SECTIONS[1].items.filter((i) => selected.has(i.id)).map((i) => i.label);
  const behavior = SECTIONS[2].items.filter((i) => selected.has(i.id)).map((i) => i.label);
  const parts = [
    `Write a report card comment${name.trim() ? ` for a student named ${name.trim()}` : ''}.`,
    LENGTH_INSTRUCTIONS[length],
    TONE_INSTRUCTIONS[tone],
    strengths.length ? `Academic strengths: ${strengths.join(', ')}.` : '',
    struggles.length ? `Areas for growth: ${struggles.join(', ')}.` : '',
    behavior.length ? `Social and behavior observations: ${behavior.join(', ')}.` : '',
    extra.trim() ? `Additional context from the teacher: ${extra.trim()}.` : '',
    'Only mention what is explicitly listed. Do not invent or assume specific skills, behaviors, or details that were not provided. If math is listed as a strength, say the student does well in math. Do not guess whether it is number sense, problem solving, or anything else. Never use em dashes under any circumstances.',
  ];
  return parts.filter(Boolean).join(' ');
}

function useSpeechToText(onResult: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const recRef = useRef<any>(null);
  function toggle() {
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!SR) return;
    if (listening) { recRef.current?.stop(); return; }
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e: any) => onResult(e.results[0][0].transcript);
    rec.onend = () => setListening(false);
    rec.start();
    recRef.current = rec;
    setListening(true);
  }
  return { listening, toggle };
}

export default function FreeToolClient() {
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [extra, setExtra] = useState('');
  const [refineInstructions, setRefineInstructions] = useState('');
  const [length, setLength] = useState('medium');
  const [tone, setTone] = useState('casual');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const extraMic = useSpeechToText((text) => setExtra((prev) => (prev ? prev + ' ' : '') + text));
  const refineMic = useSpeechToText((text) => setRefineInstructions((prev) => (prev ? prev + ' ' : '') + text));

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function callApi(prompt: string) {
    const res = await fetch('/api/free-tool', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message ?? 'Something went wrong.');
    return data.comment as string;
  }

  async function generate() {
    if (selected.size === 0) { setError('Please select at least one option.'); return; }
    setError(''); setResult(''); setLoading(true);
    try { setResult(await callApi(buildPrompt(name, selected, extra, length, tone))); }
    catch (e: any) { setError(e.message ?? 'Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  }

  async function refine() {
    if (!result) return;
    setError(''); setLoading(true);
    try {
      const instructions = refineInstructions.trim()
        ? `Teacher instructions: ${refineInstructions.trim()}`
        : 'Make it sound more natural and human. Less generic.';
      const prompt = `Here is a report card comment: "${result}"\n\nRewrite it based on these instructions: ${instructions}\n\nKeep the same student name (if any) and same length. Never use em dashes under any circumstances.`;
      setResult(await callApi(prompt));
    } catch (e: any) { setError(e.message ?? 'Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  }

  async function copy() {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function reset() {
    setResult(''); setName(''); setSelected(new Set()); setExtra('');
    setRefineInstructions(''); setError(''); setTone('casual');
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>

      <div style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '10px 20px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: 500 }}>
          <span style={{ fontSize: 16 }}>←</span> Back to ShortHand
        </Link>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)', padding: '48px 24px 40px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: 24, textDecoration: 'none', fontFamily: 'var(--font-fredoka, sans-serif)', fontWeight: 700, fontSize: 36, letterSpacing: '0.02em' }}>
            {['S','h','o','r','t','H','a','n','d'].map((letter, i) => (
              <span key={i} style={{ color: ['#e2725b','#34d399','#f59e0b','#60a5fa','#a78bfa','#e2725b','#34d399','#f59e0b','#60a5fa'][i] }}>{letter}</span>
            ))}
          </Link>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
            Report Card Comment Generator
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', margin: '0 0 10px' }}>
            Free · No sign-up · Ready in 10 seconds
          </p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: 0 }}>
            Here from the videos? The jokes are fake. These comments are real.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '24px 16px 48px' }}>

        <div style={{ background: '#f0f9ff', borderRadius: 16, padding: 24, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.3)', borderLeft: '4px solid #0ea5e9' }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Student name <span style={{ fontWeight: 400, textTransform: 'none', color: '#94a3b8' }}>(optional)</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex"
            style={{ width: '100%', borderRadius: 10, border: '1.5px solid #e2e8f0', padding: '10px 14px', fontSize: 14, color: '#1e293b', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            onFocus={(e) => (e.target.style.borderColor = '#0d9488')}
            onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
          />
        </div>

        {SECTIONS.map((section) => {
          const colors = CHIP_COLORS[section.color];
          return (
            <div key={section.id} style={{ background: section.bg, borderRadius: 16, padding: 24, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.25)', borderLeft: `4px solid ${section.accent}` }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: section.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                {section.label} <span style={{ fontWeight: 400, textTransform: 'none', color: '#94a3b8' }}>(pick all that apply)</span>
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    style={{
                      fontFamily: 'inherit',
                      padding: '6px 12px',
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 600,
                      border: '1.5px solid',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      ...(selected.has(item.id) ? colors.active : colors.inactive),
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        <div style={{ background: '#fff7ed', borderRadius: 16, padding: 24, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.3)', borderLeft: '4px solid #f97316' }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Comment length</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {LENGTH_OPTIONS.map((opt) => (
              <button key={opt.id} onClick={() => setLength(opt.id)} style={{ flex: 1, padding: '10px 8px', borderRadius: 10, border: '1.5px solid', borderColor: length === opt.id ? '#0f172a' : '#e2e8f0', background: length === opt.id ? '#0f172a' : '#fff', color: length === opt.id ? '#fff' : '#475569', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                <div>{opt.label}</div>
                <div style={{ fontSize: 11, fontWeight: 400, marginTop: 2, color: '#94a3b8' }}>{opt.hint}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: '#f0fdf4', borderRadius: 16, padding: 24, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.3)', borderLeft: '4px solid #22c55e' }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Tone</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {[{ id: 'casual', label: 'Casual', hint: 'Warm & friendly' }, { id: 'academic', label: 'Academic', hint: 'Formal & precise' }].map((opt) => (
              <button key={opt.id} onClick={() => setTone(opt.id)} style={{ flex: 1, padding: '10px 8px', borderRadius: 10, border: '1.5px solid', borderColor: tone === opt.id ? '#0f172a' : '#e2e8f0', background: tone === opt.id ? '#0f172a' : '#fff', color: tone === opt.id ? '#fff' : '#475569', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                <div>{opt.label}</div>
                <div style={{ fontSize: 11, fontWeight: 400, marginTop: 2, color: '#94a3b8' }}>{opt.hint}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: '#faf5ff', borderRadius: 16, padding: 24, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.3)', borderLeft: '4px solid #a855f7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Anything else? <span style={{ fontWeight: 400, textTransform: 'none', color: '#94a3b8' }}>(optional)</span>
            </label>
            <button onClick={extraMic.toggle} style={{ background: extraMic.listening ? '#fee2e2' : 'transparent', border: 'none', cursor: 'pointer', fontSize: 16, padding: '4px 8px', borderRadius: 8 }}>🎤</button>
          </div>
          <textarea value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="e.g. loves soccer, recently moved schools, made big progress this term" rows={2} style={{ width: '100%', borderRadius: 10, border: '1.5px solid #e2e8f0', padding: '10px 14px', fontSize: 14, color: '#1e293b', resize: 'none', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} onFocus={(e) => (e.target.style.borderColor = '#0d9488')} onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')} />
        </div>

        {error && <p style={{ color: '#ef4444', fontSize: 13, margin: '0 0 12px' }}>{error}</p>}

        <button onClick={generate} disabled={loading} style={{ width: '100%', background: loading ? '#5eead4' : 'linear-gradient(135deg, #0d9488, #0891b2)', color: '#fff', fontWeight: 700, fontSize: 15, padding: '14px', borderRadius: 14, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(13,148,136,0.4)', letterSpacing: '0.01em', transition: 'opacity 0.15s' }}>
          {loading ? 'Generating…' : 'Generate comment →'}
        </button>

        {(name || selected.size > 0 || extra) && (
          <button onClick={reset} style={{ width: '100%', marginTop: 8, background: 'transparent', color: '#94a3b8', fontWeight: 500, fontSize: 13, padding: '10px', borderRadius: 14, border: '1.5px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontFamily: 'inherit' }}>
            Clear
          </button>
        )}

        {result && (
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, marginTop: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.3)', borderTop: '4px solid #0d9488' }}>
            <p style={{ fontSize: 15, color: '#1e293b', lineHeight: 1.7, margin: '0 0 20px' }}>{result}</p>
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 16, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Refine <span style={{ fontWeight: 400, textTransform: 'none', color: '#94a3b8' }}>(tell AI what to change)</span>
                </label>
                <button onClick={refineMic.toggle} style={{ background: refineMic.listening ? '#fee2e2' : 'transparent', border: 'none', cursor: 'pointer', fontSize: 16, padding: '4px 8px', borderRadius: 8 }}>🎤</button>
              </div>
              <textarea value={refineInstructions} onChange={(e) => setRefineInstructions(e.target.value)} placeholder="e.g. don't mention math, add something about her growth mindset" rows={2} style={{ width: '100%', borderRadius: 10, border: '1.5px solid #e2e8f0', padding: '10px 14px', fontSize: 14, color: '#1e293b', resize: 'none', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} onFocus={(e) => (e.target.style.borderColor = '#0d9488')} onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={copy} style={{ flex: 1, background: 'linear-gradient(135deg, #0d9488, #0891b2)', color: '#fff', fontWeight: 700, fontSize: 13, padding: '11px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
              <button onClick={refine} disabled={loading} style={{ flex: 1, background: '#f8fafc', color: '#334155', fontWeight: 600, fontSize: 13, padding: '11px', borderRadius: 10, border: '1.5px solid #e2e8f0', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                {loading ? 'Refining…' : 'Refine'}
              </button>
              <button onClick={reset} style={{ padding: '11px 16px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                New
              </button>
            </div>
            <div style={{ marginTop: 20, background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', borderRadius: 14, padding: '20px 20px 18px', border: '1px solid rgba(167,139,250,0.25)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a78bfa', marginBottom: 8 }}>Want this for every student, all year?</div>
              <p style={{ fontSize: 14, color: '#e2e8f0', margin: '0 0 14px', lineHeight: 1.6 }}>
                ShortHand lets you log quick notes on students throughout the year, then turn those notes into polished reports in one tap. No more starting from scratch each term.
              </p>
              <Link
                href="/install"
                style={{ display: 'inline-block', background: 'linear-gradient(135deg, #0d9488, #0891b2)', color: '#fff', fontWeight: 700, fontSize: 13, padding: '10px 20px', borderRadius: 10, textDecoration: 'none', boxShadow: '0 4px 14px rgba(13,148,136,0.35)' }}
              >
                Try ShortHand free →
              </Link>
              <span style={{ display: 'inline-block', marginLeft: 12, fontSize: 12, color: '#64748b' }}>No app store. Opens instantly.</span>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>Built by a teacher, for teachers.</p>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>Report cards are easier when you have been documenting all year.</p>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', fontWeight: 600, fontSize: 13, padding: '10px 20px', borderRadius: 10, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.12)' }}>
            See how ShortHand works →
          </Link>
        </div>
      </div>
    </div>
  );
}
