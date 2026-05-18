import Link from 'next/link';
import type { Metadata } from 'next';
import AnimatedLogo from '../../components/AnimatedLogo';
import TrackedLink from '../../components/TrackedLink';

export const metadata: Metadata = {
  title: 'ClassDojo Alternative for Middle & High School Teachers — ShortHand',
  description: 'Looking for a ClassDojo alternative? ShortHand is built for older students: private behavior notes, parent communication logs, and no public point systems.',
  alternates: { canonical: 'https://getshorthandapp.com/classdojo-alternative' },
  openGraph: {
    title: 'ClassDojo Alternative for Middle & High School Teachers — ShortHand',
    description: 'Looking for a ClassDojo alternative? ShortHand is built for older students: private behavior notes, parent communication logs, and no public point systems.',
    url: 'https://getshorthandapp.com/classdojo-alternative',
    type: 'website',
    images: [{ url: 'https://getshorthandapp.com/og-image.png', width: 1200, height: 630, alt: 'ShortHand: Built by a teacher, for teachers.' }],
  },
};

const rows = [
  { feature: 'Target grade level', dojo: 'K–5 (designed for young kids)', sh: 'Middle & high school' },
  { feature: 'Behavior visibility', dojo: 'Public points on a class display', sh: 'Private notes, never displayed to class' },
  { feature: 'Parent updates', dojo: 'Social-media style feed', sh: '2-click professional message, logged automatically' },
  { feature: 'Documentation', dojo: 'Basic activity log', sh: 'Timestamped notes, IEP flags, exportable history' },
  { feature: 'Mood tracking', dojo: 'None', sh: 'Daily student check-ins with trend view' },
  { feature: 'Admin-ready paper trail', dojo: 'No', sh: 'Yes. Every contact logged with date and outcome.' },
  { feature: 'AI summaries', dojo: 'No', sh: 'One-tap behavior summary per student' },
  { feature: 'Cost', dojo: 'Free (with ads/upsells)', sh: 'Free to start, no ads' },
];

export default function ClassDojoAlternativePage() {
  return (
    <>
      <div className="glow-field" aria-hidden>
        <span className="g1" /><span className="g2" /><span className="g3" />
        <span className="g4" />
        <span className="g5" />
      </div>

      <nav>
        <div className="nav-inner">
          <div className="nav-left">
            <AnimatedLogo />
          </div>
          <TrackedLink href="https://app.getshorthandapp.com" className="btn-primary" label="nav_try_free_classdojo-alternative">Get ShortHand</TrackedLink>
        </div>
      </nav>

      <Link href="/" className="detail-back">← Back to home</Link>

      <div className="detail-hero">
        <span className="detail-icon">🔄</span>
        <h1 className="detail-title">A ClassDojo <em>Alternative</em><br />Built for Older Students</h1>

        <p className="detail-desc">
          ClassDojo was designed for elementary school. Public monster avatars and point
          boards work fine for second graders. They do not work for a 15-year-old who
          gets embarrassed in front of their peers.
        </p>
        <p className="detail-desc">
          ShortHand is built for middle and high school teachers who need private
          documentation, real parent communication logs, and a paper trail that holds
          up in an IEP meeting or admin conversation.
        </p>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: 32, marginTop: 16 }}>
          Side-by-Side Comparison
        </h2>

        <div style={{ width: '100%', maxWidth: 700, marginBottom: 80, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
            <thead>
              <tr>
                <th style={thStyle('')}>Feature</th>
                <th style={thStyle('#1a1a2e')}>ClassDojo</th>
                <th style={thStyle('#1a1f1a')}>ShortHand ✓</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.feature} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
                  <td style={tdStyle('label')}>{row.feature}</td>
                  <td style={tdStyle('dojo')}>{row.dojo}</td>
                  <td style={tdStyle('sh')}>{row.sh}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: 24 }}>
          Why teachers switch
        </h2>

        <p className="detail-desc">
          The most common reason teachers reach out: they kept forgetting to follow up with
          parents. A note got written somewhere, a conversation happened in the hallway, and
          by Friday it was gone. ShortHand fixes that with a communication log that is
          timestamped, searchable, and always attached to the right student.
        </p>
        <p className="detail-desc">
          No public leaderboard. No gamification. Just a clean, professional tool that helps
          you document what happened, contact the right families, and walk into any difficult
          conversation prepared.
        </p>

        <Link href="/" className="detail-back" style={{ marginTop: '16px' }}>← Back to home</Link>
      </div>

      <div className="detail-cta-section">
        <h2 className="detail-cta-heading">Try ShortHand free</h2>
        <p className="detail-cta-sub">No credit card. Works on any device. Set up in under 2 minutes.</p>
        <TrackedLink href="https://app.getshorthandapp.com" className="btn-primary" label="cta_get_started_classdojo-alternative">Get Started Free →</TrackedLink>
      </div>

      <footer>
        <div className="footer-logo">ShortHand</div>
        <div className="footer-tagline">Built by a teacher, for teachers.</div>
        <a href="mailto:gregorylebed@gmail.com" className="footer-email">gregorylebed@gmail.com</a>
        <div className="footer-copy">© 2026 ShortHand. All rights reserved.</div>
      </footer>
    </>
  );
}

function thStyle(bg: string): React.CSSProperties {
  return {
    padding: '12px 16px',
    textAlign: 'left',
    fontWeight: 600,
    fontSize: '0.85rem',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: '#f0ebe2',
    background: bg || 'rgba(255,255,255,0.05)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  };
}

function tdStyle(col: 'label' | 'dojo' | 'sh'): React.CSSProperties {
  return {
    padding: '12px 16px',
    color: col === 'sh' ? '#86efac' : col === 'label' ? '#f0ebe2' : 'rgba(240,235,226,0.5)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    fontWeight: col === 'label' ? 500 : 300,
    lineHeight: 1.5,
  };
}
