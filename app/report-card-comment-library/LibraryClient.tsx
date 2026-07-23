'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  CATEGORIES_BY_SECTION,
  CATEGORY_LABELS,
  GRADE_BANDS,
  GRADE_BAND_LABELS,
  REPORT_CARD_COMMENTS,
  SECTION_LABELS,
  TONES,
  type Comment,
  type GradeBand,
  type Section,
  type Tone,
} from '../../lib/report-card-comments';

const SECTIONS = Object.keys(CATEGORIES_BY_SECTION) as Section[];
const SAMPLE_NAME = 'Jordan';

function personalize(text: string, name: string): string {
  const useName = name.trim() || SAMPLE_NAME;
  return text.split('[Student]').join(useName);
}

function finalizeForCopy(text: string, name: string): string {
  const trimmed = name.trim();
  if (trimmed) return text.split('[Student]').join(trimmed);
  return text.split('[Student]').join('the student');
}

function CommentCard({ comment, name }: { comment: Comment; name: string }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(() => personalize(comment.text, name));
  const [copied, setCopied] = useState(false);
  const [dirty, setDirty] = useState(false);

  const displayText = dirty ? draft : personalize(comment.text, name);

  function startEditing() {
    if (!dirty) setDraft(personalize(comment.text, name));
    setEditing(true);
  }

  async function copy() {
    const toCopy = dirty ? draft : finalizeForCopy(comment.text, name);
    await navigator.clipboard.writeText(toCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 14,
        padding: 18,
        marginBottom: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        border: '1px solid #e2e8f0',
      }}
    >
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
        <span style={badgeStyle(comment.tone === 'positive' ? '#0d9488' : '#d97706')}>
          {comment.tone === 'positive' ? 'Positive' : 'Growth'}
        </span>
        <span style={badgeStyle('#64748b')}>{CATEGORY_LABELS[comment.category]}</span>
        <span style={badgeStyle('#64748b')}>
          {comment.gradeBands.map((b) => GRADE_BAND_LABELS[b]).join(' / ')}
        </span>
      </div>

      {editing ? (
        <textarea
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setDirty(true);
          }}
          rows={4}
          style={{
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
          }}
        />
      ) : (
        <p
          onClick={startEditing}
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: '#1e293b',
            margin: '0 0 10px',
            cursor: 'text',
          }}
          title="Click to edit"
        >
          {displayText}
        </p>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={copy} style={primaryButtonStyle}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button onClick={() => (editing ? setEditing(false) : startEditing())} style={secondaryButtonStyle}>
          {editing ? 'Done' : 'Edit'}
        </button>
      </div>
    </div>
  );
}

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

const primaryButtonStyle: React.CSSProperties = {
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

const secondaryButtonStyle: React.CSSProperties = {
  padding: '9px 16px',
  borderRadius: 10,
  border: '1.5px solid #e2e8f0',
  background: '#f8fafc',
  color: '#64748b',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

export default function LibraryClient() {
  const [name, setName] = useState('');
  const [section, setSection] = useState<Section>('behavior');
  const [category, setCategory] = useState<string>('all');
  const [tone, setTone] = useState<Tone | 'all'>('all');
  const [gradeBand, setGradeBand] = useState<GradeBand | 'all'>('all');
  const [search, setSearch] = useState('');

  const categoriesForSection = CATEGORIES_BY_SECTION[section];

  function selectSection(next: Section) {
    setSection(next);
    setCategory('all');
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return REPORT_CARD_COMMENTS.filter((c) => {
      if (q) {
        const haystack = `${c.text} ${CATEGORY_LABELS[c.category]}`.toLowerCase();
        return haystack.includes(q);
      }
      if (c.section !== section) return false;
      if (category !== 'all' && c.category !== category) return false;
      if (tone !== 'all' && c.tone !== tone) return false;
      if (gradeBand !== 'all' && !c.gradeBands.includes(gradeBand)) return false;
      return true;
    });
  }, [search, section, category, tone, gradeBand]);

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '10px 20px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: 500 }}>
          <span style={{ fontSize: 16 }}>&larr;</span> Back to ShortHand
        </Link>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)', padding: '40px 24px 32px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 26, fontWeight: 600, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
            Report Card Comment Library
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', margin: 0 }}>
            Prototype preview. Search, browse by section, and personalize with a name.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px 48px' }}>
        <div style={{ background: '#f0f9ff', borderRadius: 16, padding: 20, marginBottom: 16, borderLeft: '4px solid #0ea5e9' }}>
          <label style={labelStyle}>
            Student name <span style={{ fontWeight: 400, textTransform: 'none', color: '#94a3b8' }}>(optional, defaults to a sample name)</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`e.g. Alex (previewing as "${SAMPLE_NAME}")`}
            style={inputStyle}
          />
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, border: '1px solid #e2e8f0' }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search all comments..."
            style={inputStyle}
          />
        </div>

        {!search.trim() && (
          <>
            <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
              {SECTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => selectSection(s)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 600,
                    border: '1.5px solid',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    borderColor: section === s ? '#0d9488' : '#e2e8f0',
                    background: section === s ? '#0d9488' : '#fff',
                    color: section === s ? '#fff' : '#475569',
                  }}
                >
                  {SECTION_LABELS[s]}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={selectStyle}>
                <option value="all">All categories</option>
                {categoriesForSection.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>

              <select value={tone} onChange={(e) => setTone(e.target.value as Tone | 'all')} style={selectStyle}>
                <option value="all">All tones</option>
                {TONES.map((t) => (
                  <option key={t} value={t}>
                    {t === 'positive' ? 'Positive' : 'Growth'}
                  </option>
                ))}
              </select>

              <select value={gradeBand} onChange={(e) => setGradeBand(e.target.value as GradeBand | 'all')} style={selectStyle}>
                <option value="all">All grade bands</option>
                {GRADE_BANDS.map((b) => (
                  <option key={b} value={b}>
                    {GRADE_BAND_LABELS[b]}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {filtered.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: 14, textAlign: 'center', padding: '24px 0' }}>
            No comments match. Try a different search or filter.
          </p>
        ) : (
          filtered.map((c) => <CommentCard key={c.id} comment={c} name={name} />)
        )}
      </div>
    </div>
  );
}

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

const selectStyle: React.CSSProperties = {
  flex: '1 1 140px',
  borderRadius: 10,
  border: '1.5px solid #e2e8f0',
  padding: '8px 10px',
  fontSize: 13,
  color: '#1e293b',
  outline: 'none',
  fontFamily: 'inherit',
  background: '#fff',
};
