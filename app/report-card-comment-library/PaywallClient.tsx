'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  CATEGORY_LABELS,
  GRADE_BAND_LABELS,
  SECTION_LABELS,
  type Comment,
  type Section,
  type Tone,
} from '../../lib/report-card-comments';
import type { FreeSliceData } from '../../lib/report-card-teaser';
import { SAMPLE_NAME, personalize, finalizeForCopy } from '../../lib/report-card-personalize';
import {
  fireBeginCheckout,
  fireCheckoutStartFailed,
  fireFilterUsed,
  fireFreeCommentCopied,
  fireLibraryPageView,
  fireLockedCommentClicked,
  fireNameEntered,
} from '../../lib/gtag';

// Unauthenticated view. Receives ONLY the free-slice payload built server-side:
// counts, section/category names, and the free comments. The other ~354 comment
// texts never reach this component, so they never reach the browser bundle or
// the streamed RSC payload.
//
// This is a working slice, not a preview image: the name field, search, and the
// section/tone chips all operate on the free comments for real, and every free
// comment is copyable and editable. The visitor finds out whether the product is
// faster than scrolling and rewriting before being asked for $4.99. Everything
// beyond the slice is a locked row that states what it is and opens checkout.

export default function PaywallClient({ slice }: { slice: FreeSliceData }) {
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [search, setSearch] = useState('');
  const [section, setSection] = useState<Section | 'all'>('all');
  const [tone, setTone] = useState<Tone | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  const buyRef = useRef<HTMLDivElement | null>(null);
  // One-shot guards: these events answer "did this visitor use the slice at
  // all", so they must not fire per keystroke or per chip click.
  const nameFired = useRef(false);
  const filtersFired = useRef<Set<string>>(new Set());

  useEffect(() => {
    fireLibraryPageView('free');
  }, []);

  function onNameChange(value: string) {
    setName(value);
    if (!nameFired.current && value.trim()) {
      nameFired.current = true;
      fireNameEntered();
    }
  }

  function trackFilter(which: string) {
    if (filtersFired.current.has(which)) return;
    filtersFired.current.add(which);
    fireFilterUsed(which);
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return slice.comments.filter((c) => {
      if (q) {
        const haystack = `${c.text} ${CATEGORY_LABELS[c.category]}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (section !== 'all' && c.section !== section) return false;
      if (tone !== 'all' && c.tone !== tone) return false;
      return true;
    });
  }, [slice.comments, search, section, tone]);

  // Locked remainder, respecting the same section filter so the count under a
  // filtered list is the count that filter actually leaves locked.
  const lockedCount = useMemo(() => {
    if (section === 'all') return slice.totalCount - slice.freeCount;
    const s = slice.sections.find((x) => x.id === section);
    return s ? s.totalCount - s.freeCount : 0;
  }, [slice, section]);

  function revealCheckout() {
    buyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function onCopied(comment: Comment) {
    setCopiedId(comment.id);
    setTimeout(() => setCopiedId((current) => (current === comment.id ? null : current)), 2000);
    fireFreeCommentCopied(comment.section);
    // The first successful copy is the moment the slice has proven itself, so
    // that is when the offer comes back, rather than on page load.
    if (!hasCopied) {
      setHasCopied(true);
      revealCheckout();
    }
  }

  function onLockedClick() {
    fireLockedCommentClicked(section === 'all' ? 'all' : section);
    revealCheckout();
  }

  // `source` identifies which buy button was used, so the CTAs can be compared
  // in GA4 instead of collapsing into one.
  async function startCheckout(source: string) {
    setStarting(true);
    setError(null);
    // Fired before the request, so it counts intent even if session creation
    // then fails. The drop is visible as begin_checkout without a matching
    // Stripe arrival, and checkout_start_failed below names the reason.
    fireBeginCheckout(source);
    try {
      const res = await fetch('/api/report-card-checkout/create-session', { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data?.url) {
        setError(data?.error?.message ?? 'Could not start checkout. Please try again.');
        setStarting(false);
        fireCheckoutStartFailed(res.status === 429 ? 'rate_limited' : 'session_create_failed');
        return;
      }
      window.location.href = data.url;
    } catch {
      setError('Could not start checkout. Please try again.');
      setStarting(false);
      fireCheckoutStartFailed('network');
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
          <p style={{ fontSize: 16, color: '#fff', fontWeight: 600, margin: '0 0 6px' }}>
            Finish report card comments faster, without starting from a blank page.
          </p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: '0 0 4px' }}>
            {slice.totalCount} ready-to-use comments for Pre-K and elementary (Pre-K to 5), across{' '}
            {slice.sections.length} sections.
          </p>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', margin: 0 }}>
            Try {slice.freeCount} of them right here. Type a name, filter, copy. No sign-up.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px 48px' }}>
        <div style={workspaceStyle}>
          <span style={freeBadgeStyle}>Free sample, fully working</span>

          <label htmlFor="student-name" style={labelStyle}>
            Student name{' '}
            <span style={{ fontWeight: 400, textTransform: 'none', color: '#94a3b8' }}>
              (optional, previews as a sample name)
            </span>
          </label>
          <input
            id="student-name"
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder={`e.g. Alex (previewing as "${SAMPLE_NAME}")`}
            style={inputStyle}
          />
          <p style={{ fontSize: 12, color: '#64748b', margin: '6px 0 14px' }}>
            The name fills into every comment below, and into all {slice.totalCount} after you buy.
          </p>

          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (e.target.value.trim()) trackFilter('search');
            }}
            placeholder="Search these comments..."
            aria-label="Search the free comments"
            style={inputStyle}
          />

          <div style={chipRowStyle}>
            <button
              onClick={() => {
                setSection('all');
                trackFilter('section');
              }}
              style={chipStyle(section === 'all')}
            >
              All sections
            </button>
            {slice.sections.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSection(s.id);
                  trackFilter('section');
                }}
                style={chipStyle(section === s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div style={chipRowStyle}>
            {(['all', 'positive', 'growth'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTone(t);
                  trackFilter('tone');
                }}
                style={chipStyle(tone === t)}
              >
                {t === 'all' ? 'All tones' : t === 'positive' ? 'Positive' : 'Growth'}
              </button>
            ))}
          </div>

          <p style={resultCountStyle}>
            {filtered.length} of {slice.freeCount} free comments
            {lockedCount > 0 ? `, ${lockedCount} more locked` : ''}
          </p>

          {filtered.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: 14, textAlign: 'center', padding: '20px 0' }}>
              Nothing in the free sample matches. The full library has {slice.totalCount} comments to search.
            </p>
          ) : (
            filtered.map((c) => (
              <FreeCommentCard
                key={c.id}
                comment={c}
                name={name}
                copied={copiedId === c.id}
                onCopied={onCopied}
              />
            ))
          )}

          {lockedCount > 0 && (
            <button onClick={onLockedClick} style={lockedRowStyle}>
              <span style={{ fontSize: 15 }} aria-hidden="true">
                &#128274;
              </span>
              <span>
                <strong style={{ color: '#0f172a' }}>{lockedCount} more comments</strong>
                {section === 'all' ? '' : ` in ${SECTION_LABELS[section]}`}, unlocked for $4.99
              </span>
            </button>
          )}
        </div>

        <div ref={buyRef} style={buyCardStyle}>
          {hasCopied && (
            <p style={afterCopyLineStyle}>
              That is one comment down. There are {slice.totalCount - slice.freeCount} more waiting.
            </p>
          )}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              flexWrap: 'wrap',
              marginBottom: 4,
            }}
          >
            <div style={{ fontSize: 32, fontWeight: 700, color: '#0f172a' }}>$4.99</div>
            <span style={introPriceBadgeStyle}>Introductory price</span>
          </div>
          <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px' }}>
            One-time payment. No subscription. Restore access on any device by email.
          </p>
          <button onClick={() => startCheckout('paywall-hero')} disabled={starting} style={buyButtonStyle(starting)}>
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

        <h2 style={sectionHeadingStyle}>What is inside</h2>

        {slice.sections.map((s) => (
          <div key={s.id} style={sectionCardStyle}>
            <div style={sectionHeadRowStyle}>
              <span style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{s.label}</span>
              <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>{s.totalCount} comments</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '0 18px 16px' }}>
              {s.categories.map((c) => (
                <span key={c.id} style={categoryPillStyle}>
                  {c.label} <strong style={{ color: '#0f172a' }}>{c.count}</strong>
                </span>
              ))}
            </div>
          </div>
        ))}

        <div style={{ ...buyCardStyle, marginTop: 24 }}>
          <p style={{ fontSize: 14, color: '#334155', margin: '0 0 14px', lineHeight: 1.6 }}>
            Written by a teacher, for report card season. Every comment is specific, parent-ready, and
            editable before you copy it.
          </p>
          <button onClick={() => startCheckout('paywall-bottom')} disabled={starting} style={buyButtonStyle(starting)}>
            {starting ? 'Starting checkout...' : `Get all ${slice.totalCount} comments for $4.99`}
          </button>
        </div>
      </div>
    </div>
  );
}

// One free comment. Editable before copying, same as the paid view, so the
// slice demonstrates the actual workflow rather than a read-only sample.
function FreeCommentCard({
  comment,
  name,
  copied,
  onCopied,
}: {
  comment: Comment;
  name: string;
  copied: boolean;
  onCopied: (comment: Comment) => void;
}) {
  // An edit belongs to the name it was written against, so the draft is stored
  // WITH that name rather than reset by a side effect. Any render for a
  // different name simply does not see this draft, which is what makes the
  // previous student's name impossible to display: there is no window between
  // the name changing and the edit being discarded, not even a single render,
  // and it holds while the textarea is open.
  //
  // Deliberately not a reset-in-render (`if (stale) setDirty(false)`) or an
  // effect: both leave one render showing text built from the old name.
  const [edit, setEdit] = useState<{ forName: string; text: string } | null>(null);
  const [editing, setEditing] = useState(false);

  const editForThisName = edit && edit.forName === name ? edit.text : null;
  const displayText = editForThisName ?? personalize(comment.text, name);

  async function copy() {
    const toCopy = editForThisName ?? finalizeForCopy(comment.text, name);
    await navigator.clipboard.writeText(toCopy);
    onCopied(comment);
  }

  return (
    <div style={commentCardStyle}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
        <span style={badgeStyle(comment.tone === 'positive' ? '#0d9488' : '#d97706')}>
          {comment.tone === 'positive' ? 'Positive' : 'Growth'}
        </span>
        <span style={badgeStyle('#64748b')}>{SECTION_LABELS[comment.section]}</span>
        <span style={badgeStyle('#64748b')}>{CATEGORY_LABELS[comment.category]}</span>
        <span style={badgeStyle('#64748b')}>
          {comment.gradeBands.map((b) => GRADE_BAND_LABELS[b]).join(' / ')}
        </span>
      </div>

      {editing ? (
        <textarea
          value={displayText}
          onChange={(e) => setEdit({ forName: name, text: e.target.value })}
          rows={4}
          aria-label="Edit this comment"
          style={editAreaStyle}
        />
      ) : (
        <p onClick={() => setEditing(true)} style={commentTextStyle} title="Click to edit">
          {displayText}
        </p>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={copy} style={copyPrimaryStyle}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button onClick={() => setEditing(!editing)} style={editButtonStyle}>
          {editing ? 'Done' : 'Edit'}
        </button>
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

const workspaceStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 16,
  padding: 20,
  border: '1px solid #e2e8f0',
  marginBottom: 16,
};

const freeBadgeStyle: React.CSSProperties = {
  display: 'inline-block',
  fontSize: 11,
  fontWeight: 700,
  color: '#0d9488',
  background: '#ccfbf1',
  borderRadius: 999,
  padding: '4px 10px',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 14,
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
};

const chipRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 6,
  flexWrap: 'wrap',
  margin: '12px 0 0',
};

function chipStyle(active: boolean): React.CSSProperties {
  return {
    padding: '7px 13px',
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    border: '1.5px solid',
    cursor: 'pointer',
    fontFamily: 'inherit',
    borderColor: active ? '#0d9488' : '#e2e8f0',
    background: active ? '#0d9488' : '#fff',
    color: active ? '#fff' : '#475569',
  };
}

const resultCountStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: '#64748b',
  margin: '16px 0 12px',
};

const commentCardStyle: React.CSSProperties = {
  background: '#f8fafc',
  borderRadius: 12,
  padding: 16,
  marginBottom: 10,
  border: '1px solid #e2e8f0',
};

const commentTextStyle: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.6,
  color: '#1e293b',
  margin: '0 0 10px',
  cursor: 'text',
};

const editAreaStyle: React.CSSProperties = {
  width: '100%',
  fontSize: 14,
  lineHeight: 1.6,
  color: '#1e293b',
  borderRadius: 10,
  border: '1.5px solid #0d9488',
  padding: '10px 12px',
  resize: 'vertical',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  marginBottom: 10,
};

const copyPrimaryStyle: React.CSSProperties = {
  flex: 1,
  background: 'linear-gradient(135deg, #0d9488, #0891b2)',
  color: '#fff',
  fontWeight: 700,
  fontSize: 13,
  padding: '9px',
  borderRadius: 10,
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const editButtonStyle: React.CSSProperties = {
  padding: '9px 16px',
  borderRadius: 10,
  border: '1.5px solid #e2e8f0',
  background: '#fff',
  color: '#64748b',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const lockedRowStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  textAlign: 'left',
  background: 'repeating-linear-gradient(45deg, #f8fafc, #f8fafc 10px, #f1f5f9 10px, #f1f5f9 20px)',
  border: '1.5px dashed #cbd5e1',
  borderRadius: 12,
  padding: '16px 18px',
  fontSize: 14,
  color: '#475569',
  cursor: 'pointer',
  fontFamily: 'inherit',
  marginTop: 4,
};

const buyCardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 16,
  padding: 24,
  border: '1px solid #e2e8f0',
  boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
  textAlign: 'center',
};

const afterCopyLineStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: '#0d9488',
  background: '#ccfbf1',
  borderRadius: 10,
  padding: '10px 14px',
  margin: '0 0 16px',
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

const sectionHeadRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 18px 12px',
  gap: 8,
};

const categoryPillStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#475569',
  background: '#f1f5f9',
  borderRadius: 999,
  padding: '4px 10px',
};

function badgeStyle(color: string): React.CSSProperties {
  return {
    fontSize: 11,
    fontWeight: 600,
    color,
    background: `${color}1a`,
    borderRadius: 999,
    padding: '3px 9px',
  };
}
