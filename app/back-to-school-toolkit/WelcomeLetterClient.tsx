'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { fireCtaClick } from '../../lib/gtag';

const GRADES = [
  'Pre-K', 'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade',
  '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade',
];

const TONES = [
  { id: 'Warm', label: 'Warm', hint: 'Friendly & welcoming' },
  { id: 'Funny', label: 'Funny', hint: 'Light humor' },
  { id: 'Professional', label: 'Professional', hint: 'Formal & polished' },
];

export default function WelcomeLetterClient() {
  const [teacherName, setTeacherName] = useState('');
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [tone, setTone] = useState('Warm');
  const [result, setResult] = useState('');
  const [refineInstructions, setRefineInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  async function generate() {
    if (!teacherName.trim()) { setError('Please enter your name.'); return; }
    if (!grade) { setError('Please select a grade level.'); return; }
    setError(''); setResult(''); setLoading(true);
    try {
      const res = await fetch('/api/welcome-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherName, grade, subject, tone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message ?? 'Something went wrong.');
      setResult(data.letter);
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function refine() {
    if (!result) return;
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/welcome-letter-refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ letter: result, instructions: refineInstructions }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message ?? 'Something went wrong.');
      setResult(data.letter);
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function reset() {
    setResult(''); setTeacherName(''); setGrade(''); setSubject('');
    setTone('Warm'); setRefineInstructions(''); setError('');
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    borderRadius: 10,
    border: '1.5px solid #e2e8f0',
    padding: '10px 14px',
    fontSize: 14,
    color: '#1e293b',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    background: '#fff',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 11,
    fontWeight: 700,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 8,
  };

  const cardStyle: React.CSSProperties = {
    background: '#f0f9ff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 12,
    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
    borderLeft: '4px solid #0ea5e9',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>

      <div style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '10px 20px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: 500 }}>
          <span style={{ fontSize: 16 }}>←</span> Back to ShortHand
        </Link>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)', padding: '48px 24px 40px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <Link href="/" style={{ display: 'block', marginBottom: 16, textDecoration: 'none', fontFamily: 'var(--font-fredoka, sans-serif)', fontWeight: 700, fontSize: 36, letterSpacing: '0.02em' }}>
            {['S','h','o','r','t','H','a','n','d'].map((letter, i) => (
              <span key={i} style={{ color: ['#e2725b','#34d399','#f59e0b','#60a5fa','#a78bfa','#e2725b','#34d399','#f59e0b','#60a5fa'][i] }}>{letter}</span>
            ))}
          </Link>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', borderRadius: 999, padding: '4px 14px', fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>
            Back-to-School Toolkit
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
            Welcome Letter Generator
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', margin: '0 0 10px' }}>
            Free · No sign-up · Ready in 10 seconds
          </p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: 0 }}>
            Fill in four fields. Get a ready-to-send letter for families.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '24px 16px 48px' }}>

        <div style={cardStyle}>
          <label style={labelStyle}>Your name</label>
          <input
            type="text"
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            placeholder="e.g. Ms. Johnson"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = '#0d9488')}
            onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
          />
        </div>

        <div style={{ ...cardStyle, background: '#f0fdf4', borderLeft: '4px solid #22c55e' }}>
          <label style={labelStyle}>Grade level</label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            style={{ ...inputStyle, appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%2364748b\' stroke-width=\'1.5\' fill=\'none\' stroke-linecap=\'round\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: 36 }}
          >
            <option value="">Select a grade...</option>
            {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div style={{ ...cardStyle, background: '#fff7ed', borderLeft: '4px solid #f97316' }}>
          <label style={labelStyle}>
            Subject <span style={{ fontWeight: 400, textTransform: 'none', color: '#94a3b8' }}>(optional)</span>
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Math, Science — leave blank if you teach all subjects"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = '#0d9488')}
            onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
          />
        </div>

        <div style={{ ...cardStyle, background: '#faf5ff', borderLeft: '4px solid #a855f7' }}>
          <label style={labelStyle}>Tone</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {TONES.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setTone(opt.id)}
                style={{
                  flex: 1,
                  padding: '10px 8px',
                  borderRadius: 10,
                  border: '1.5px solid',
                  borderColor: tone === opt.id ? '#0f172a' : '#e2e8f0',
                  background: tone === opt.id ? '#0f172a' : '#fff',
                  color: tone === opt.id ? '#fff' : '#475569',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}
              >
                <div>{opt.label}</div>
                <div style={{ fontSize: 11, fontWeight: 400, marginTop: 2, color: tone === opt.id ? '#94a3b8' : '#94a3b8' }}>{opt.hint}</div>
              </button>
            ))}
          </div>
        </div>

        {error && <p style={{ color: '#ef4444', fontSize: 13, margin: '0 0 12px' }}>{error}</p>}

        <button
          onClick={generate}
          disabled={loading}
          style={{
            width: '100%',
            background: loading ? '#5eead4' : 'linear-gradient(135deg, #0d9488, #0891b2)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 15,
            padding: '14px',
            borderRadius: 14,
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            boxShadow: '0 4px 14px rgba(13,148,136,0.4)',
            letterSpacing: '0.01em',
            transition: 'opacity 0.15s',
          }}
        >
          {loading ? 'Writing your letter...' : 'Generate letter →'}
        </button>

        {(teacherName || grade || subject) && !loading && (
          <button
            onClick={reset}
            style={{ width: '100%', marginTop: 8, background: 'transparent', color: '#94a3b8', fontWeight: 500, fontSize: 13, padding: '10px', borderRadius: 14, border: '1.5px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Clear
          </button>
        )}

        {result && (
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, marginTop: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.3)', borderTop: '4px solid #0d9488' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#0d9488', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Your welcome letter</div>
            <textarea
              value={result}
              onChange={(e) => setResult(e.target.value)}
              rows={14}
              style={{ width: '100%', fontSize: 14, color: '#1e293b', lineHeight: 1.8, marginBottom: 20, whiteSpace: 'pre-wrap', borderRadius: 10, border: '1.5px solid #e2e8f0', padding: '12px 14px', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              onFocus={(e) => (e.target.style.borderColor = '#0d9488')}
              onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
            />
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 16, marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                Refine <span style={{ fontWeight: 400, textTransform: 'none', color: '#94a3b8' }}>(tell AI what to change)</span>
              </label>
              <textarea
                value={refineInstructions}
                onChange={(e) => setRefineInstructions(e.target.value)}
                placeholder="e.g. we're a K-8 school, don't mention high school transition"
                rows={2}
                style={{ width: '100%', borderRadius: 10, border: '1.5px solid #e2e8f0', padding: '10px 14px', fontSize: 14, color: '#1e293b', resize: 'none', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                onFocus={(e) => (e.target.style.borderColor = '#0d9488')}
                onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
              />
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
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a78bfa', marginBottom: 8 }}>Want to stay organized all year?</div>
              <p style={{ fontSize: 14, color: '#e2e8f0', margin: '0 0 14px', lineHeight: 1.6 }}>
                ShortHand helps you log quick notes on students throughout the year and turn them into polished reports in one tap. No more starting from scratch each term.
              </p>
              <Link
                href="https://app.getshorthandapp.com?demo=true"
                style={{ display: 'inline-block', background: 'linear-gradient(135deg, #0d9488, #0891b2)', color: '#fff', fontWeight: 700, fontSize: 13, padding: '10px 20px', borderRadius: 10, textDecoration: 'none', boxShadow: '0 4px 14px rgba(13,148,136,0.35)' }}
                onClick={() => {
                  fireCtaClick({ cta_source: 'welcome_letter_toolkit', cta_destination: 'app' });
                }}
              >
                Try ShortHand free →
              </Link>
              <span style={{ display: 'inline-block', marginLeft: 12, fontSize: 12, color: '#64748b' }}>No app store. Opens instantly.</span>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 24, marginBottom: 8 }}>
          <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 6px' }}>
            Want examples before you generate?{' '}
            <Link href="/blog/welcome-letter-to-parents-from-teacher" style={{ color: '#0d9488', textDecoration: 'none', fontWeight: 600 }}>
              See 4 real welcome letters with notes on what works.
            </Link>
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>Built by a teacher, for teachers.</p>
        </div>
      </div>
    </div>
  );
}
