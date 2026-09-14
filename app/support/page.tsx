import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Support | ShortHand',
  description: 'Get help with ShortHand: account access, app features, billing, and technical issues.',
  alternates: { canonical: 'https://getshorthandapp.com/support' },
};

export default function SupportPage() {
  return (
    <>
      <div className="glow-field" aria-hidden>
        <span className="g1" /><span className="g2" /><span className="g3" />
        <span className="g4" /><span className="g5" />
      </div>

      <nav>
        <div className="nav-inner">
          <div className="nav-left">
            <Link href="/" className="logo-link" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text)' }}>ShortHand</span>
            </Link>
          </div>
          <Link href="https://app.getshorthandapp.com?demo=true" className="btn-primary">Try Free</Link>
        </div>
      </nav>

      <Link href="/" className="detail-back">← Back to home</Link>

      <div className="detail-hero">
        <span className="detail-icon">💬</span>
        <h1 className="detail-title">ShortHand <em>Support</em></h1>
        <p className="detail-desc">
          Need help with ShortHand? Contact us at{' '}
          <a href="mailto:support@getshorthandapp.com" style={{ color: 'var(--accent)' }}>support@getshorthandapp.com</a>{' '}
          for help with account access, app features, billing, or technical issues.
        </p>
      </div>

      <div className="section-inner" style={{ maxWidth: 760, margin: '0 auto', padding: '0 1.5rem 5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          <div className="privacy-card">
            <div className="privacy-icon">✉️</div>
            <div className="privacy-title">Contact Support</div>
            <div className="privacy-desc">
              Email <a href="mailto:support@getshorthandapp.com" style={{ color: 'var(--accent)' }}>support@getshorthandapp.com</a> and
              we&apos;ll respond personally. We can help with:<br /><br />
              • Account access<br />
              • App features<br />
              • Billing<br />
              • Technical issues
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">📄</div>
            <div className="privacy-title">Policies</div>
            <div className="privacy-desc">
              <Link href="/privacy" style={{ color: 'var(--accent)' }}>Privacy Policy</Link><br /><br />
              <Link href="/terms" style={{ color: 'var(--accent)' }}>Terms of Service</Link>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}
