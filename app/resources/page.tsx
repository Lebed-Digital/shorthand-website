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
        url: 'https://getshorthandapp.com/og-image-v2.png',
        width: 1200,
        height: 630,
        alt: 'Free Teacher Resources from ShortHand',
      },
    ],
  },
};

const resources = [
  {
    title: 'Free MTSS Tier 2 Intervention Tracking Sheet',
    description:
      'A printable tracking sheet for documenting Tier 2 interventions, student responses, and MTSS team data without creating more paperwork.',
    href: '/mtss-tier-2-intervention-tracking-sheet.pdf',
    download: true,
    label: 'Download PDF',
    accent: '#0f766e',
    bg: '#f8fafc',
    tag: 'Printable PDF',
    signals: ['No sign-up required', 'Instant PDF download', 'Created by a classroom teacher'],
  },
  {
    title: 'Parent Contact Documentation Log',
    description:
      'Never walk into a conference wondering when you last contacted home. Track calls, emails, outcomes, and follow-ups in one place.',
    href: '/parent-contact-documentation-log.pdf',
    download: true,
    label: 'Download Free PDF',
    accent: 'var(--teal)',
    bg: '#f0fdfa',
    tag: 'Printable PDF',
    signals: ['No sign-up required', 'Instant PDF download', 'Created by a classroom teacher'],
  },
  {
    title: 'Classroom Behavior Documentation Log',
    description:
      'Keep a clear record of behavior incidents, interventions, and outcomes. Everything you need when a parent asks "Why didn\'t anyone tell me?"',
    href: '/classroom-behavior-documentation-log.pdf',
    download: true,
    label: 'Download Free PDF',
    accent: '#7c3aed',
    bg: '#f5f3ff',
    tag: 'Printable PDF',
    signals: ['No sign-up required', 'Instant PDF download', 'Created by a classroom teacher'],
  },
  {
    title: 'Student Behavior Pattern Tracker',
    description:
      'By Friday you\'ve forgotten what Monday looked like. This weekly grid helps you spot patterns before the meeting, not during it.',
    href: '/student-behavior-pattern-tracker.pdf',
    download: true,
    label: 'Download Free PDF',
    accent: '#b45309',
    bg: '#fffbeb',
    tag: 'Printable PDF',
    signals: ['No sign-up required', 'Instant PDF download', 'Created by a classroom teacher'],
  },
  {
    // Links to the post, not the PDF: the post's ResourceOffer download fires
    // the GA4 resource_download event (source abc-data-examples-post).
    title: 'ABC Behavior Data Collection Sheet',
    description:
      'Free printable ABC behavior data sheet, plus eight completed classroom examples to help you get started.',
    href: '/blog/abc-data-examples',
    download: false,
    label: 'Get the Free Sheet',
    accent: '#c2410c',
    bg: '#fff7ed',
    tag: 'Printable PDF',
    signals: ['No sign-up required', '8 filled-in examples', 'Created by a classroom teacher'],
  },
  {
    // Same as the ABC card: links to the post so downloads go through its
    // ResourceOffer and fire GA4 resource_download (source anecdotal-records-post).
    title: 'Anecdotal Records Template',
    description:
      'Free printable anecdotal records template, plus 10 filled-in classroom examples covering reading, math, writing, and behavior.',
    href: '/blog/anecdotal-records-examples',
    download: false,
    label: 'Get the Free Template',
    accent: '#15803d',
    bg: '#f0fdf4',
    tag: 'Printable PDF',
    signals: ['No sign-up required', '10 filled-in examples', 'Created by a classroom teacher'],
  },
  {
    title: 'Parent-Teacher Conference Notes',
    description:
      'Walk into every conference prepared. Walk out with a clear record of what was said, agreed to, and what happens next.',
    href: '/parent-teacher-conference-notes.pdf',
    download: true,
    label: 'Download Free PDF',
    accent: '#0369a1',
    bg: '#f0f9ff',
    tag: 'Printable PDF',
    signals: ['No sign-up required', 'Instant PDF download', 'Created by a classroom teacher'],
  },
];

export default function ResourcesPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '6px 20px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', fontFamily: 'var(--font-fredoka, sans-serif)', fontWeight: 700, fontSize: 22, letterSpacing: '0.02em' }}>
          <span style={{ color: 'var(--text-dim)', fontSize: 14, fontFamily: 'sans-serif', fontWeight: 400 }}>←</span>
          {['S','h','o','r','t','H','a','n','d'].map((letter, i) => (
            <span key={i} style={{ color: ['#E5484D','#0E9A60','#C27A00','#3B82F6','#A855F7','#E5484D','#0E9A60','#C27A00','#3B82F6'][i] }}>{letter}</span>
          ))}
        </Link>
      </div>

      <div style={{ background: 'var(--hero-bg)', padding: '48px 24px 40px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: 24, textDecoration: 'none', fontFamily: 'var(--font-fredoka, sans-serif)', fontWeight: 700, fontSize: 48, letterSpacing: '0.02em' }}>
            {['S','h','o','r','t','H','a','n','d'].map((letter, i) => (
              <span key={i} style={{ color: ['#E5484D','#0E9A60','#C27A00','#3B82F6','#A855F7','#E5484D','#0E9A60','#C27A00','#3B82F6'][i] }}>{letter}</span>
            ))}
          </Link>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: 'var(--text)', margin: '0 0 10px', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
            Free Teacher Resources
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-dim)', margin: 0 }}>
            Free printables to save you time. No sign-up, no email required.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '24px 16px 48px' }}>

        {resources.map((resource) => (
          <div key={resource.href} style={{ background: resource.bg, borderRadius: 16, padding: 24, marginBottom: 12, boxShadow: '0 1px 3px rgba(23,45,41,0.12)', borderLeft: `4px solid ${resource.accent}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: resource.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{resource.tag}</span>
            </div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', margin: '0 0 8px', lineHeight: 1.3 }}>{resource.title}</h2>
            <p style={{ fontSize: 14, color: '#475569', margin: '0 0 16px', lineHeight: 1.6 }}>{resource.description}</p>
            {resource.download ? (
              <a
                href={resource.href}
                download
                style={{ display: 'inline-block', background: resource.accent, color: '#fff', fontWeight: 700, fontSize: 13, padding: '10px 20px', borderRadius: 10, textDecoration: 'none', letterSpacing: '0.01em' }}
              >
                {resource.label} →
              </a>
            ) : (
              <Link
                href={resource.href}
                style={{ display: 'inline-block', background: resource.accent, color: '#fff', fontWeight: 700, fontSize: 13, padding: '10px 20px', borderRadius: 10, textDecoration: 'none', letterSpacing: '0.01em' }}
              >
                {resource.label} →
              </Link>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginTop: 12 }}>
              {resource.signals.map((signal) => (
                <span key={signal} style={{ fontSize: 12, color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ color: resource.accent, fontWeight: 700 }}>✓</span> {signal}
                </span>
              ))}
            </div>
          </div>
        ))}

        <div style={{ background: 'var(--surface)', borderRadius: 16, padding: 24, marginTop: 8, border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: 'var(--text-dim)', margin: '0 0 6px' }}>More free resources coming soon.</p>
          <p style={{ fontSize: 13, color: 'var(--text-fine)', margin: 0 }}>Follow along at <a href="https://www.instagram.com/getshorthand_app" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--green)', textDecoration: 'underline' }}>@getshorthand_app</a> on Instagram.</p>
        </div>

        <div style={{ background: 'var(--teal-dim)', borderRadius: 16, padding: 24, marginTop: 12, border: '1px solid var(--teal-border)', textAlign: 'center' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: '0 0 8px' }}>Want this built into your daily routine?</h2>
          <p style={{ fontSize: 14, color: 'var(--text-dim)', margin: '0 0 16px', lineHeight: 1.6 }}>
            ShortHand automatically logs parent contacts, behavior notes, and follow-ups in one searchable timeline. No binders. No spreadsheets. No trying to remember what happened three months ago.
          </p>
          <a
            href="https://app.getshorthandapp.com/?signup=1"
            style={{ display: 'inline-block', background: 'var(--teal)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '12px 28px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 4px 14px rgba(15,118,110,0.25)' }}
          >
            Try ShortHand Free
          </a>
          <p style={{ fontSize: 12, color: 'var(--text-fine)', margin: '10px 0 0' }}>No credit card. No setup. Works on your phone.</p>
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <p style={{ fontSize: 13, color: 'var(--text-faint)', marginBottom: 12 }}>Built by a teacher, for teachers.</p>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 2, background: 'var(--surface)', padding: '10px 20px', borderRadius: 10, textDecoration: 'none', border: '1px solid var(--border)', fontFamily: 'var(--font-fredoka, sans-serif)', fontWeight: 700, fontSize: 22, letterSpacing: '0.02em' }}>
            {['S','h','o','r','t','H','a','n','d'].map((letter, i) => (
              <span key={i} style={{ color: ['#E5484D','#0E9A60','#C27A00','#3B82F6','#A855F7','#E5484D','#0E9A60','#C27A00','#3B82F6'][i] }}>{letter}</span>
            ))}
            <span style={{ color: 'var(--text-dim)', fontSize: 14, fontFamily: 'sans-serif', fontWeight: 400, marginLeft: 6 }}>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
