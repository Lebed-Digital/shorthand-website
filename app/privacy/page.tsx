import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | ShortHand',
  description: 'How ShortHand collects, uses, and protects your data.',
  alternates: { canonical: 'https://getshorthandapp.com/privacy' },
};

export default function PrivacyPage() {
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
          <Link href="/install" className="btn-primary">Try Free</Link>
        </div>
      </nav>

      <Link href="/" className="detail-back">← Back to home</Link>

      <div className="detail-hero">
        <span className="detail-icon">🔒</span>
        <h1 className="detail-title">Privacy <em>Policy</em></h1>
        <p className="detail-desc">
          ShortHand is built by a teacher who understands how sensitive student data is.
          This policy explains exactly what we collect, why, and how we protect it.
        </p>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          Last updated: June 2026
        </p>
      </div>

      <div className="section-inner" style={{ maxWidth: 760, margin: '0 auto', padding: '0 1.5rem 5rem' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Plain-language summary */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '1.75rem 2rem' }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '1rem' }}>The short version</div>
            <ul style={{ margin: 0, padding: '0 0 0 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
              <li><strong style={{ color: 'var(--text)' }}>We only collect what you put in.</strong> ShortHand doesn't gather browsing data, device fingerprints, or anything beyond what you actively type or import.</li>
              <li><strong style={{ color: 'var(--text)' }}>Your data is encrypted.</strong> Everything is stored with AES-256 encryption in a SOC 2 Type II certified data center. Data in transit is protected by HTTPS.</li>
              <li><strong style={{ color: 'var(--text)' }}>We never see student names.</strong> Student records are locked behind your login. Row-level security means only your account can access your students, not us, not other teachers.</li>
              <li><strong style={{ color: 'var(--text)' }}>We comply with the Student Privacy Pledge.</strong> We do not sell student data, use it for advertising, or share it with third parties beyond what's needed to run the app.</li>
            </ul>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">👤</div>
            <div className="privacy-title">Who This Applies To</div>
            <div className="privacy-desc">
              ShortHand is a classroom management tool for teachers. When you create an account,
              you are the user. Student data you enter (names, notes, parent communications) is entered
              by you, the teacher, and is stored under your account only.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">📋</div>
            <div className="privacy-title">What We Collect</div>
            <div className="privacy-desc">
              <strong style={{ color: 'var(--text)' }}>Your account:</strong> Your email address and password (managed securely by Supabase Auth).<br /><br />
              <strong style={{ color: 'var(--text)' }}>Student data you enter:</strong> Student names, class periods, behavioral notes, birthday info, parent contact details, and photo URLs, all entered or imported by you.<br /><br />
              <strong style={{ color: 'var(--text)' }}>Google Classroom (optional):</strong> If you connect Google Classroom, we access your course list and student names, emails, and profile photos to help you import your roster. We store a token to keep you connected. You can disconnect at any time.<br /><br />
              <strong style={{ color: 'var(--text)' }}>AI features:</strong> Some features use AI to turn your notes into polished text. See the &ldquo;How ShortHand Uses AI&rdquo; section below for full details.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">🤖</div>
            <div className="privacy-title">How ShortHand Uses AI</div>
            <div className="privacy-desc">
              Some features (like generating report comments and parent messages) use AI to turn your notes into polished text. For these, ShortHand sends note content using students&apos; first names only — last names are not included.<br /><br />
              Two features — roster import and birthday import — work by reading names and parent contact details (names, emails, phone numbers) from text you paste in, so those details are sent to our AI provider to be organized. This data is processed only by Groq, our primary AI provider, which is contractually prohibited from storing it, training on it, or using it for any purpose beyond providing the service. These sensitive features never fall back to any other provider; if Groq is unavailable, the import is processed on your device without sending anything to AI, or it simply pauses until Groq is back.<br /><br />
              We never send student or parent data to AI for advertising or model training, and we don&apos;t sell your data.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">🚫</div>
            <div className="privacy-title">What We Don't Do</div>
            <div className="privacy-desc">
              We do not sell your data or student data to anyone. Ever.<br /><br />
              We do not use student data for advertising.<br /><br />
              We do not share your data with third parties except the services required to run the app
              (Supabase for database and auth, Groq for AI features, Vercel for hosting, Upstash for rate limiting).<br /><br />
              We do not allow anyone other than you to access your students' information.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">🔐</div>
            <div className="privacy-title">How We Protect Your Data</div>
            <div className="privacy-desc">
              All student data is stored in a SOC 2 Type II compliant data center with AES-256 encryption.<br /><br />
              All data is stored with Row Level Security (RLS) enabled, meaning every query is scoped to your account only. No teacher can see another teacher's data.<br /><br />
              All communication between the app and our servers uses HTTPS encryption.<br /><br />
              API endpoints require authentication. Your session token is verified on every request.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">🗑️</div>
            <div className="privacy-title">Your Rights</div>
            <div className="privacy-desc">
              You can delete all your data at any time from within the app (Settings → Danger Zone → Factory Wipe).<br /><br />
              You can permanently delete your account and all associated data from within the app (Settings → Danger Zone → Delete My Account).<br /><br />
              You can export a copy of all your data at any time (Settings → Your Data → Export My Data).<br /><br />
              You can disconnect Google Classroom at any time, which removes your stored Google tokens.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">🌐</div>
            <div className="privacy-title">Third-Party Services</div>
            <div className="privacy-desc">
              ShortHand uses the following third-party services to operate:<br /><br />
              <strong style={{ color: 'var(--text)' }}>Supabase:</strong> database and authentication (<a href="https://supabase.com/privacy" style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">privacy policy</a>)<br />
              <strong style={{ color: 'var(--text)' }}>Groq:</strong> AI language model processing (<a href="https://groq.com/privacy-policy/" style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">privacy policy</a>)<br />
              <strong style={{ color: 'var(--text)' }}>Vercel:</strong> hosting and deployment (<a href="https://vercel.com/legal/privacy-policy" style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">privacy policy</a>)<br />
              <strong style={{ color: 'var(--text)' }}>Google:</strong> Google Classroom integration, optional (<a href="https://policies.google.com/privacy" style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">privacy policy</a>)
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">🎓</div>
            <div className="privacy-title">Student Privacy Pledge</div>
            <div className="privacy-desc">
              ShortHand follows the principles of the Student Privacy Pledge. This means:<br /><br />
              We will <strong style={{ color: 'var(--text)' }}>never sell student data</strong> to anyone, for any reason.<br /><br />
              We will <strong style={{ color: 'var(--text)' }}>never use student data for targeted advertising</strong>, not to students, parents, or anyone else.<br /><br />
              We will <strong style={{ color: 'var(--text)' }}>never share student data</strong> with third parties beyond the services required to operate the app.<br /><br />
              We will <strong style={{ color: 'var(--text)' }}>always allow teachers to delete</strong> their student data at any time.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">🏫</div>
            <div className="privacy-title">For Schools & Districts</div>
            <div className="privacy-desc">
              Need a Data Processing Agreement (DPA) for district approval?{' '}
              <Link href="/dpa" style={{ color: 'var(--accent)' }}>View our DPA →</Link><br /><br />
              <strong style={{ color: 'var(--text)' }}>Canadian teachers:</strong> Our DPA includes a section addressing PIPEDA and provincial privacy laws (BC FIPPA, Quebec Law 25). Data is stored on US servers. Schools with data residency requirements should <a href="mailto:info@getshorthandapp.com" style={{ color: 'var(--accent)' }}>contact us</a> before signing up.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">✉️</div>
            <div className="privacy-title">Contact</div>
            <div className="privacy-desc">
              Questions about this policy or your data? Reach out anytime:<br /><br />
              <a href="mailto:info@getshorthandapp.com" style={{ color: 'var(--accent)' }}>info@getshorthandapp.com</a><br /><br />
              We're a small team and we'll respond personally.
            </div>
          </div>

        </div>
      </div>

      <footer>
        <div className="footer-logo">ShortHand</div>
        <div className="footer-tagline">Built by a teacher, for teachers.</div>
        <a href="mailto:info@getshorthandapp.com" className="footer-email">info@getshorthandapp.com</a>
        <div className="footer-copy">© 2026 ShortHand. All rights reserved.</div>
      </footer>
    </>
  );
}
