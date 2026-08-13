import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Delete Your Account | ShortHand',
  description: 'How to delete your ShortHand account and all associated data, either from inside the app or by request.',
  alternates: { canonical: 'https://getshorthandapp.com/delete-account' },
};

export default function DeleteAccountPage() {
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
        <span className="detail-icon">🗑️</span>
        <h1 className="detail-title">Delete Your <em>Account</em></h1>
        <p className="detail-desc">
          This page explains how to delete your ShortHand account and all of the data
          stored with it. You can do this yourself inside the app, or request it by email
          if you cannot sign in.
        </p>
      </div>

      <div className="section-inner" style={{ maxWidth: 760, margin: '0 auto', padding: '0 1.5rem 5rem' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '1.75rem 2rem' }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '1rem' }}>The short version</div>
            <ul style={{ margin: 0, padding: '0 0 0 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
              <li>This page applies to <strong style={{ color: 'var(--text)' }}>ShortHand</strong>, the teacher documentation app at app.getshorthandapp.com.</li>
              <li><strong style={{ color: 'var(--text)' }}>You can delete your own account from inside the app</strong>, under Settings, in the Danger Zone section.</li>
              <li><strong style={{ color: 'var(--text)' }}>Deletion is permanent.</strong> Your account, your notes, and your student data are erased and cannot be recovered.</li>
              <li><strong style={{ color: 'var(--text)' }}>If you cannot sign in</strong>, you can email us to request deletion instead.</li>
            </ul>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">📱</div>
            <div className="privacy-title">Option 1: Delete From Inside the App</div>
            <div className="privacy-desc">
              This is the fastest way, and it takes effect immediately.<br /><br />
              1. Open ShortHand and sign in.<br />
              2. Go to the <strong style={{ color: 'var(--text)' }}>Settings</strong> tab.<br />
              3. Scroll down to <strong style={{ color: 'var(--text)' }}>Danger Zone</strong>.<br />
              4. Tap <strong style={{ color: 'var(--text)' }}>Delete My Account</strong>.<br />
              5. Confirm twice when asked. The second prompt is the last chance to stop.<br /><br />
              Your account and data are deleted right away, and you are signed out.<br /><br />
              If you want to erase your student data but keep your account, use{' '}
              <strong style={{ color: 'var(--text)' }}>Complete Factory Wipe</strong> in the same
              Danger Zone section instead. If you want a copy of your data before you delete it,
              use <strong style={{ color: 'var(--text)' }}>Export My Data</strong> under Your Data first.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">✉️</div>
            <div className="privacy-title">Option 2: Request Deletion by Email</div>
            <div className="privacy-desc">
              If you cannot access the app or sign in to your account, email us and we will
              delete your account for you.<br /><br />
              Send your request to:<br /><br />
              <a href="mailto:info@getshorthandapp.com?subject=Account%20deletion%20request" style={{ color: 'var(--accent)' }}>info@getshorthandapp.com</a>
              <br /><br />
              If that link does not open your mail app, you can copy the address directly:{' '}
              <strong style={{ color: 'var(--text)' }}>info@getshorthandapp.com</strong><br /><br />
              Please send your request from the email address associated with your ShortHand
              account, and use the subject line <strong style={{ color: 'var(--text)' }}>Account deletion request</strong>.
              For account security, we may ask you for additional verification before
              processing the deletion.<br /><br />
              We are a small team and we will respond personally.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">🗂️</div>
            <div className="privacy-title">What Gets Deleted</div>
            <div className="privacy-desc">
              Deleting your account permanently removes your ShortHand login and everything
              stored under it, including:<br /><br />
              Your student roster and classes<br />
              Your notes and behavior observations<br />
              Parent communications and communication types<br />
              Student goals and accommodations<br />
              Attendance records<br />
              Reports you have generated<br />
              Shoutouts<br />
              Classroom indicators<br />
              Calendar events and tasks<br />
              Your app settings and preferences<br />
              Your Google Classroom connection tokens, if you connected it<br /><br />
              This is a permanent deletion, not a deactivation. Once it is done, the data
              cannot be restored, so export anything you want to keep beforehand. Billing
              and subscription records are handled separately, see &ldquo;What May Be
              Retained&rdquo; below.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">📊</div>
            <div className="privacy-title">What May Be Retained</div>
            <div className="privacy-desc">
              Anonymous usage analytics may remain after deletion, but they are no longer
              connected to you. When your account is deleted, the user identifier is removed
              from those analytics records. These records never contained student names, notes,
              or parent communications.<br /><br />
              If you purchased a Pro subscription, Stripe processes your payments, and limited
              billing and subscription records may also be retained in our systems after
              deletion, where needed for accounting, dispute resolution, fraud prevention,
              legal compliance, or other legitimate business records. These records never
              contain student data.<br /><br />
              Other information may be retained only where required
              for security, fraud prevention, legal compliance, or legitimate business records.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">🔒</div>
            <div className="privacy-title">More About Your Data</div>
            <div className="privacy-desc">
              For the full picture of what ShortHand collects, how it is stored, and your other
              rights, see our{' '}
              <Link href="/privacy" style={{ color: 'var(--accent)' }}>Privacy Policy</Link>.<br /><br />
              Questions about deleting your account? Email{' '}
              <a href="mailto:info@getshorthandapp.com" style={{ color: 'var(--accent)' }}>info@getshorthandapp.com</a>.
            </div>
          </div>

        </div>
      </div>

      <footer>
        <div className="footer-logo">ShortHand</div>
        <div className="footer-tagline">Built by a teacher, for teachers.</div>
        <a href="mailto:info@getshorthandapp.com" className="footer-email">info@getshorthandapp.com</a>
        <div className="footer-copy">© 2026 ShortHand. All rights reserved. · <a href="https://simpleteacherai.com" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Simple Teacher AI</a></div>
      </footer>
    </>
  );
}
