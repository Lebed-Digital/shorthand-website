import type { ReactNode } from 'react';

// Small blocks for feature pages (website audit 2026-11-15, B5).
// Examples use initials only and must stay labeled "Example".
// FAQs are visible text only: do not add FAQPage JSON-LD to non-blog pages (AGENTS.md).

export function FeatureExample({ title, children }: { title: string; children: ReactNode }) {
  return (
    <figure
      style={{
        width: '100%',
        maxWidth: 600,
        margin: '0 0 48px',
        padding: '20px 22px',
        borderRadius: 16,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'left',
      }}
    >
      <figcaption
        style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--accent, #a78bfa)',
          marginBottom: 12,
        }}
      >
        Example: {title}
      </figcaption>
      <div style={{ color: 'var(--text-dim)', fontSize: '0.95rem', lineHeight: 1.7 }}>{children}</div>
    </figure>
  );
}

export function FeatureFaq({ items }: { items: { q: string; a: ReactNode }[] }) {
  return (
    <section aria-labelledby="feature-faq-heading" style={{ width: '100%', maxWidth: 600, margin: '0 0 48px', textAlign: 'left' }}>
      <h2 id="feature-faq-heading" style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: 8 }}>
        Questions
      </h2>
      {items.map(({ q, a }) => (
        <div key={q} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '1rem 0' }}>
          <h3 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 0.4rem' }}>{q}</h3>
          <p style={{ color: 'var(--text-dim)', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>{a}</p>
        </div>
      ))}
    </section>
  );
}
