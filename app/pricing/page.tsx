import type { Metadata } from 'next';
import Link from 'next/link';
import AnimatedLogo from '../../components/AnimatedLogo';
import TrackedLink from '../../components/TrackedLink';
import Footer from '../../components/Footer';

// Every claim on this page was checked against the app code (pulse 2.0) on 2026-11-22.
// See plans/audit-2026-11-15-phase2.md, "Facts the copy relies on". Re-check the app
// before changing a row, a price, or the trial and cancel answers.

const PAGE_URL = 'https://getshorthandapp.com/pricing';
const TITLE = 'ShortHand Pricing: Free Plan and Optional Pro';
const DESCRIPTION = 'ShortHand has a free plan with no time limit for documenting your own class. Pro adds reports and Ask ShortHand for $4.99/month on the web.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    type: 'website',
    images: [{ url: 'https://getshorthandapp.com/og-image-v2.png', width: 1200, height: 630, alt: 'ShortHand: Built by a teacher, for teachers.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image-v2.png'],
  },
};

const FREE_ROWS = [
  'Unlimited notes, students, and classes',
  'Check-in rings and the 8-week activity view',
  'Parent communication log with follow-ups',
  'AI parent drafts, one student at a time: Quick Note Home and Detailed Report',
  'Goals and accommodations for each student',
  'Roster import from Google Classroom or a pasted spreadsheet',
];

const PRO_ROWS = [
  'Everything in Free',
  'Student Documentation Report and Meeting Prep Report',
  'Ask ShortHand: ask questions of your own notes',
  'Prep parent emails for several students at once',
  'Class Summary, Shoutouts, Quick Grade Table, and school calendar and rotation tools',
];

const link: React.CSSProperties = { color: 'var(--accent, #a78bfa)' };

const FAQ: { q: string; a: React.ReactNode }[] = [
  {
    q: 'Is the free plan really free?',
    a: 'Yes. The free plan has no time limit and needs no credit card. It is not a trial. You can document your whole class on it for as long as you like.',
  },
  {
    q: 'What happens when a Pro trial ends?',
    a: 'Eligible accounts can start one 30-day Pro trial, with no credit card. If you do not subscribe, your account goes back to the free plan and your notes stay saved and usable. If you subscribe during the trial, billing starts right away.',
  },
  {
    q: 'How do I cancel Pro?',
    a: (
      <>
        If you subscribed through the App Store in the ShortHand iPhone app, cancel in your Apple ID subscription
        settings. If you subscribed anywhere else, including in a web browser on your phone, email{' '}
        <a href="mailto:info@getshorthandapp.com?subject=Cancel%20ShortHand%20Pro" style={link}>info@getshorthandapp.com</a>{' '}
        from the email address on your ShortHand account and ask to cancel. When your paid access ends, your account
        moves to the free plan and keeps your notes.
      </>
    ),
  },
  {
    q: 'Is there a school or district plan?',
    a: (
      <>
        Not right now. ShortHand uses individual teacher accounts, and there are no shared school accounts. If your
        school or district has questions about privacy or approval, see{' '}
        <Link href="/for-schools" style={link}>ShortHand for Schools</Link>.
      </>
    ),
  },
];

export default function PricingPage() {
  return (
    <>
      <nav>
        <div className="nav-inner">
          <div className="nav-left">
            <AnimatedLogo />
          </div>
          <TrackedLink href="https://app.getshorthandapp.com/?demo=true" className="btn-primary" label="nav_try_demo_pricing" ctaSource="pricing">Try the demo</TrackedLink>
        </div>
      </nav>
      <main>

      <Link href="/" className="detail-back">← Back to home</Link>

      <div className="detail-hero">
        <h1 className="detail-title">ShortHand <em>Pricing</em></h1>
        <p className="detail-desc">
          Free plan with no time limit. Pro is optional.
        </p>

        <div className="plans-grid plans-grid--two" style={{ width: '100%' }}>
          <section className="plan-card" aria-labelledby="plan-free">
            <div className="plan-card-kicker">No time limit</div>
            <h2 id="plan-free" className="plan-card-title">Free</h2>
            <ul className="plan-card-body plan-list">
              {FREE_ROWS.map((row) => <li key={row}>{row}</li>)}
            </ul>
          </section>
          <section className="plan-card plan-card--pro" aria-labelledby="plan-pro">
            <div className="plan-card-kicker">Optional</div>
            <h2 id="plan-pro" className="plan-card-title">Pro: $4.99/month on the web</h2>
            <ul className="plan-card-body plan-list">
              {PRO_ROWS.map((row) => <li key={row}>{row}</li>)}
            </ul>
          </section>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', margin: '16px 0 32px' }}>
          In the ShortHand iPhone app, Pro is bought through the App Store at Apple&apos;s listed price.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 56 }}>
          <TrackedLink href="https://app.getshorthandapp.com/?signup=1" className="btn-primary" label="cta_create_free_account_pricing" ctaSource="pricing">Create a free account</TrackedLink>
          <TrackedLink href="https://app.getshorthandapp.com/?demo=true" className="btn-ghost" label="cta_try_demo_pricing" ctaSource="pricing">Try the demo first</TrackedLink>
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: 16 }}>Questions</h2>
        <div style={{ width: '100%', maxWidth: 720 }}>
          {FAQ.map(({ q, a }) => (
            <div key={q} style={{ borderBottom: '1px solid var(--border)', padding: '1.1rem 0' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 0.5rem' }}>{q}</h3>
              <p style={{ color: 'var(--text-dim)', lineHeight: 1.7, fontSize: '0.97rem', margin: 0 }}>{a}</p>
            </div>
          ))}
        </div>
      </div>

      </main>
      <Footer />
    </>
  );
}
