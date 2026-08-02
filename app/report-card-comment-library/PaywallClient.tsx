'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { TeaserData } from '../../lib/report-card-teaser';

// Unauthenticated view. Receives ONLY the teaser payload built server-side:
// counts, section/category names, and two sample comments per section. The
// other ~364 comment texts never reach this component, so they never reach the
// browser bundle or the streamed RSC payload.

export default function PaywallClient({ teaser }: { teaser: TeaserData }) {
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string>(teaser.sections[0]?.id ?? '');

  async function startCheckout() {
    setStarting(true);
    setError(null);
    try {
      const res = await fetch('/api/report-card-checkout/create-session', { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data?.url) {
        setError(data?.error?.message ?? 'Could not start checkout. Please try again.');
        setStarting(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError('Could not start checkout. Please try again.');
      setStarting(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      <div style={topBarStyle}>
        <Link href="/" style={backLinkStyle}>
          <span style={{ fontSize: 16 }}>&larr;</span> Back to ShortHand
        </Link>
      </div>

      <div style={heroStyle}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.01em' }}>
            Report Card Comment Library
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', margin: '0 0 4px' }}>
            {teaser.totalCount} ready-to-use comments across {teaser.sections.length} sections.
          </p>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
            Search, filter by grade band and tone, personalize with a student name, copy in one click.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px 48px' }}>
        <div style={buyCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#0f172a' }}>$4.99</div>
            <span style={introPriceBadgeStyle}>Introductory price</span>
          </div>
          <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px' }}>
            One-time payment, no additional cost later. Lifetime access on this device, restorable by email.
          </p>
          <button onClick={startCheckout} disabled={starting} style={buyButtonStyle(starting)}>
            {starting ? 'Starting checkout...' : 'Get the full library'}
          </button>
          {error && (
            <p style={{ fontSize: 13, color: '#dc2626', margin: '10px 0 0' }} role="alert">
              {error}
            </p>
          )}
          <p style={{ fontSize: 12, color: '#94a3b8', margin: '12px 0 0' }}>
            Already bought it?{' '}
            <Link href="/report-card-comment-library/restore" style={{ color: '#0d9488', fontWeight: 600 }}>
              Restore your access
            </Link>
          </p>
        </div>

        <p style={personalizeCalloutStyle}>
          Type a student&apos;s name once. It automatically appears in every comment you copy for that student, across every section and tone.
        </p>

        <h2 style={sectionHeadingStyle}>What is inside</h2>

        {teaser.sections.map((section) => {
          const open = openSection === section.id;
          return (
            <div key={section.id} style={sectionCardStyle}>
              <button
                onClick={() => setOpenSection(open ? '' : section.id)}
                style={sectionToggleStyle}
                aria-expanded={open}
              >
                <span style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{section.label}</span>
                <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>
                  {section.count} comments {open ? '−' : '+'}
                </span>
              </button>

              {open && (
                <div style={{ padding: '0 18px 18px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                    {section.categories.map((c) => (
                      <span key={c.id} style={categoryPillStyle}>
                        {c.label} <strong style={{ color: '#0f172a' }}>{c.count}</strong>
                      </span>
                    ))}
                  </div>

                  <p style={sampleLabelStyle}>Sample comments</p>
                  {section.samples.map((s) => (
                    <div key={s.id} style={sampleCardStyle}>
                      <span style={toneBadgeStyle(s.tone === 'positive' ? '#0d9488' : '#d97706')}>
                        {s.tone === 'positive' ? 'Positive' : 'Growth'}
                      </span>
                      <p style={{ fontSize: 14, lineHeight: 1.6, color: '#1e293b', margin: '8px 0 0' }}>
                        {s.text.split('[Student]').map((part, i, arr) => (
                          <React.Fragment key={i}>
                            {part}
                            {i < arr.length - 1 && <span style={nameHighlightStyle}>Jordan</span>}
                          </React.Fragment>
                        ))}
                      </p>
                      <p style={nameCaptionStyle}>&uarr; Student name automatically filled from the name field</p>
                    </div>
                  ))}

                  <p style={{ fontSize: 13, color: '#64748b', margin: '10px 0 0', fontStyle: 'italic' }}>
                    {Math.max(0, section.count - section.samples.length)} more in {section.label}, unlocked with purchase.
                  </p>
                </div>
              )}
            </div>
          );
        })}

        <div style={{ ...buyCardStyle, marginTop: 24, textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: '#334155', margin: '0 0 14px', lineHeight: 1.6 }}>
            Written by a teacher, for report card season. Every comment is specific, parent-ready, and
            editable before you copy it.
          </p>
          <button onClick={startCheckout} disabled={starting} style={buyButtonStyle(starting)}>
            {starting ? 'Starting checkout...' : 'Get all ' + teaser.totalCount + ' comments for $4.99'}
          </button>
        </div>
      </div>
    </div>
  );
}

const topBarStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
  padding: '10px 20px',
};

const backLinkStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  textDecoration: 'none',
  color: 'rgba(255,255,255,0.65)',
  fontSize: 13,
  fontWeight: 500,
};

const heroStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)',
  padding: '40px 24px 32px',
};

const buyCardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 16,
  padding: 24,
  border: '1px solid #e2e8f0',
  boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
  textAlign: 'center',
};

function buyButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    width: '100%',
    background: disabled ? '#94a3b8' : 'linear-gradient(135deg, #0d9488, #0891b2)',
    color: '#fff',
    fontWeight: 700,
    fontSize: 15,
    padding: '13px',
    borderRadius: 12,
    border: 'none',
    cursor: disabled ? 'default' : 'pointer',
    fontFamily: 'inherit',
  };
}

const introPriceBadgeStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: '#0d9488',
  background: '#ccfbf1',
  borderRadius: 999,
  padding: '3px 10px',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const personalizeCalloutStyle: React.CSSProperties = {
  fontSize: 13,
  color: 'rgba(255,255,255,0.85)',
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 10,
  padding: '10px 14px',
  margin: '12px 0 0',
  lineHeight: 1.5,
  textAlign: 'center',
};

const nameHighlightStyle: React.CSSProperties = {
  background: '#ccfbf1',
  color: '#0d9488',
  fontWeight: 700,
  borderRadius: 4,
  padding: '0 3px',
};

const nameCaptionStyle: React.CSSProperties = {
  fontSize: 11,
  color: '#0d9488',
  fontWeight: 600,
  margin: '6px 0 0',
};

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: 'rgba(255,255,255,0.55)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  margin: '28px 0 12px',
};

const sectionCardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 14,
  marginBottom: 10,
  border: '1px solid #e2e8f0',
  overflow: 'hidden',
};

const sectionToggleStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 18px',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
  textAlign: 'left',
};

const categoryPillStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#475569',
  background: '#f1f5f9',
  borderRadius: 999,
  padding: '4px 10px',
};

const sampleLabelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  margin: '0 0 8px',
};

const sampleCardStyle: React.CSSProperties = {
  background: '#f8fafc',
  borderRadius: 12,
  padding: 14,
  marginBottom: 8,
  border: '1px solid #e2e8f0',
};

function toneBadgeStyle(color: string): React.CSSProperties {
  return {
    fontSize: 11,
    fontWeight: 600,
    color,
    background: `${color}1a`,
    borderRadius: 999,
    padding: '3px 9px',
  };
}
