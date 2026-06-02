import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Free Teacher Resources | ShortHand',
  description:
    'Free printable tools for teachers. Download the Parent Contact Documentation Log and more resources to save time on classroom paperwork.',
  alternates: { canonical: 'https://getshorthandapp.com/resources' },
  openGraph: {
    title: 'Free Teacher Resources | ShortHand',
    description: 'Free printable tools for teachers. No sign-up required.',
    url: 'https://getshorthandapp.com/resources',
    type: 'website',
    images: [
      {
        url: 'https://getshorthandapp.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Free Teacher Resources from ShortHand',
      },
    ],
  },
};

const resources = [
  {
    title: 'Parent Contact Documentation Log',
    description:
      'Never walk into a conference wondering when you last contacted home. Track calls, emails, outcomes, and follow-ups in one place.',
    file: '/Parent Contact Documentation Log.pdf',
    label: 'Download Free PDF',
    accent: '#0d9488',
    bg: '#f0fdfa',
    tag: 'Printable PDF',
  },
];

export default function ResourcesPage() {
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
            Free Teacher Resources
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', margin: 0 }}>
            Free printables to save you time. No sign-up, no email required.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '24px 16px 48px' }}>

        {resources.map((resource) => (
          <div key={resource.file} style={{ background: resource.bg, borderRadius: 16, padding: 24, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.3)', borderLeft: `4px solid ${resource.accent}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: resource.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{resource.tag}</span>
            </div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', margin: '0 0 8px', lineHeight: 1.3 }}>{resource.title}</h2>
            <p style={{ fontSize: 14, color: '#475569', margin: '0 0 16px', lineHeight: 1.6 }}>{resource.description}</p>
            <a
              href={resource.file}
              download
              style={{ display: 'inline-block', background: resource.accent, color: '#fff', fontWeight: 700, fontSize: 13, padding: '10px 20px', borderRadius: 10, textDecoration: 'none', letterSpacing: '0.01em' }}
            >
              {resource.label} →
            </a>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginTop: 12 }}>
              {['No sign-up required', 'Instant PDF download', 'Created by a classroom teacher'].map((signal) => (
                <span key={signal} style={{ fontSize: 12, color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ color: resource.accent, fontWeight: 700 }}>✓</span> {signal}
                </span>
              ))}
            </div>
          </div>
        ))}

        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 24, marginTop: 8, border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: '0 0 6px' }}>More free resources coming soon.</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Follow along at <span style={{ color: '#34d399' }}>@getshorthand_app</span> on Instagram.</p>
        </div>

        <div style={{ background: 'rgba(13,148,136,0.15)', borderRadius: 16, padding: 24, marginTop: 12, border: '1px solid rgba(13,148,136,0.3)', textAlign: 'center' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Want this built into your daily routine?</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', margin: '0 0 16px', lineHeight: 1.6 }}>
            ShortHand automatically logs parent contacts, behavior notes, and follow-ups in one searchable timeline. No binders. No spreadsheets. No trying to remember what happened three months ago.
          </p>
          <a
            href="https://app.getshorthandapp.com"
            style={{ display: 'inline-block', background: 'linear-gradient(135deg, #0d9488, #0891b2)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '12px 28px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 4px 14px rgba(13,148,136,0.4)' }}
          >
            Try ShortHand Free
          </a>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '10px 0 0' }}>No credit card. No setup. Works on your phone.</p>
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12 }}>Built by a teacher, for teachers.</p>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', fontWeight: 600, fontSize: 13, padding: '10px 20px', borderRadius: 10, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.12)' }}>
            Visit ShortHand →
          </Link>
        </div>
      </div>
    </div>
  );
}
