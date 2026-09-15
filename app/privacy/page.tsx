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
          <Link href="https://app.getshorthandapp.com?demo=true" className="btn-primary">Try Free</Link>
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
          Last updated: September 2026
        </p>
      </div>

      <div className="section-inner" style={{ maxWidth: 760, margin: '0 auto', padding: '0 1.5rem 5rem' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Plain-language summary */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '1.75rem 2rem' }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '1rem' }}>The short version</div>
            <ul style={{ margin: 0, padding: '0 0 0 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
              <li><strong style={{ color: 'var(--text)' }}>Classroom records come from you.</strong> You type or import student notes, parent contacts, accommodations, and related classroom information. We also store the account information needed to sign you in.</li>
              <li><strong style={{ color: 'var(--text)' }}>We do not use data for advertising tracking.</strong> ShortHand does not sell student data, does not use it to advertise, and does not use advertising identifiers to track you.</li>
              <li><strong style={{ color: 'var(--text)' }}>Web analytics stay on the web.</strong> The website and web app use analytics and crash-reporting tools described below. Those tools are turned off in the native iOS app.</li>
              <li><strong style={{ color: 'var(--text)' }}>Your data is encrypted.</strong> All data is stored on Supabase, which is SOC 2 Type II certified and encrypts data at rest with AES-256. Data in transit is protected by HTTPS.</li>
              <li><strong style={{ color: 'var(--text)' }}>Other teachers can&apos;t see your students.</strong> Row-level security means every query is scoped to your account only: no other teacher can access your data. As the operator, I technically have access to the database, but I commit to never looking at your data unless you ask me to (for example, to help fix a problem).</li>
            </ul>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">👤</div>
            <div className="privacy-title">Who This Applies To</div>
            <div className="privacy-desc">
              ShortHand is a documentation tool for teachers. When you create an account,
              you are the user. Student data, parent or guardian contact information, and any
              IEP, 504, RTI, or other accommodation information you enter is entered by you,
              the teacher, and is stored under your account only. Students do not create
              ShortHand accounts.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">📋</div>
            <div className="privacy-title">What We Collect</div>
            <div className="privacy-desc">
              <strong style={{ color: 'var(--text)' }}>Your account:</strong> Your email address and, if you use email sign-in, your password (managed securely by Supabase Auth). ShortHand also supports Google sign-in and Sign in with Apple. Sign in with Apple is available in the native iOS app and may provide an Apple Private Email Relay address instead of your personal email. We store your name when Google, Apple, or your profile provides it.<br /><br />
              <strong style={{ color: 'var(--text)' }}>Billing and subscription information:</strong>{' '}
              If you buy ShortHand Pro or another paid feature on the website, Stripe processes the payment. We do not store your card details ourselves. We store subscription or entitlement status and Stripe&apos;s reference IDs for your account. The native iOS app does not sell subscriptions or other in-app purchases. If you already have a Pro subscription or other entitlement from the web, the iOS app can still read that status and give you the matching features.<br /><br />
              <strong style={{ color: 'var(--text)' }}>Student data you enter:</strong> Information you type or import about your students, which may include names, class periods, notes, behavior tags, goals, attendance, shoutouts, birthday information, calendar-related data, photo URLs, and parent communication logs.<br /><br />
              <strong style={{ color: 'var(--text)' }}>Parent and guardian contact data:</strong> Parent or guardian names, email addresses, and phone numbers, when you enter or import them so you can use parent-communication features.<br /><br />
              <strong style={{ color: 'var(--text)' }}>Disability-related and special-education information:</strong> If you enter IEP, 504, RTI, or other accommodation information, that is stored with the student record. This can include disability-related information you choose to record for your own teaching and documentation.<br /><br />
              <strong style={{ color: 'var(--text)' }}>Google Classroom (optional):</strong> If you connect Google Classroom, we access your course list and student names, emails, and profile photos to help you import your roster. We store a token to keep you connected. You can disconnect at any time.<br /><br />
              <strong style={{ color: 'var(--text)' }}>Optional website emails:</strong> If you leave your email on getshorthandapp.com to request a resource or restore a purchase, we store that email to send what you asked for.<br /><br />
              <strong style={{ color: 'var(--text)' }}>AI features:</strong>{' '}
              Some features use AI to help with drafting, summaries, import, and similar tasks. See the &ldquo;How ShortHand Uses AI&rdquo; section below for full details.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">🤖</div>
            <div className="privacy-title">How ShortHand Uses AI</div>
            <div className="privacy-desc">
              Some ShortHand features can send the information needed for that request to third-party AI providers. ShortHand uses OpenAI as the primary provider, with Groq as an approved fallback if OpenAI is temporarily unavailable. Both providers are configured so your data is not used to train their models.<br /><br />
              <strong style={{ color: 'var(--text)' }}>What may be sent depends on the feature you use.</strong> That can include notes, first names, and other content needed for the selected feature. Some flows may also include parent or guardian information, accommodation information, goals, or birthday-matching data. ShortHand does not limit AI input to first names only.<br /><br />
              <strong style={{ color: 'var(--text)' }}>In the native iOS app, AI consent is explicit and fails closed.</strong> Before AI data is shared, ShortHand asks for your permission and names the providers. If you decline, that request is not sent. You can withdraw consent later in Settings, and no further AI requests are sent until you allow them again. If the approved providers are unavailable, the AI request is not sent to another unapproved provider.<br /><br />
              We never send student or parent data to AI for advertising, and we don&apos;t sell your data.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">📊</div>
            <div className="privacy-title">Web Analytics and Crash Reporting</div>
            <div className="privacy-desc">
              The ShortHand website and the web app at app.getshorthandapp.com use Google Analytics (GA4) and Vercel Analytics to understand how pages and features are used. The web app also uses Sentry for crash reporting, and first-party usage analytics and marketing attribution so we can see which features are used and how people found ShortHand. These tools may use cookies or similar identifiers. They are used to operate and improve the service, not to advertise to students or parents.<br /><br />
              These analytics and crash-reporting systems are web behavior. They are not used in the native iOS app. See the next section.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">📱</div>
            <div className="privacy-title">The Native iOS App</div>
            <div className="privacy-desc">
              The native iOS app stores the same classroom and account data you enter, but it is set up more tightly than the web app:<br /><br />
              Google Analytics, Vercel Analytics, Sentry, and first-party usage analytics and attribution are turned off.<br /><br />
              The app does not write presence records or AI token-usage records.<br /><br />
              The in-app voice dictation controls are hidden.<br /><br />
              There is no advertising SDK, no Identifier for Advertisers (IDFA) tracking, no location collection, no access to device contacts, and no access to the iOS photo library.<br /><br />
              There is no in-app purchase flow. Existing subscription or entitlement status from the web may still be read so Pro features you already have continue to work.<br /><br />
              ShortHand does not use data for advertising tracking on iOS or anywhere else.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">🚫</div>
            <div className="privacy-title">What We Don&apos;t Do</div>
            <div className="privacy-desc">
              We do not sell your data or student data to anyone. Ever.<br /><br />
              We do not use student data for advertising.<br /><br />
              We do not use data for advertising tracking, including IDFA-based tracking.<br /><br />
              We do not share your data with third parties except the services required to run ShortHand, listed in Third-Party Services below.<br /><br />
              No other teacher can access your students&apos; information. As the operator, I can access the database directly if needed for support, but I will never do so without your request.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">🔐</div>
            <div className="privacy-title">How We Protect Your Data</div>
            <div className="privacy-desc">
              All student data is stored on Supabase, which is SOC 2 Type II certified and encrypts all data at rest with AES-256.<br /><br />
              All data is stored with Row Level Security (RLS) enabled, meaning every query is scoped to your account only: no other teacher can see your data. As the operator, I technically have access to the database, but I commit to never looking at your data unless you ask me to (for example, to help fix a problem).<br /><br />
              All communication between the app and our servers uses HTTPS encryption.<br /><br />
              API endpoints require authentication. Your session token is verified on every request.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">🗑️</div>
            <div className="privacy-title">Your Rights</div>
            <div className="privacy-desc">
              You can delete all your data at any time from within the app (Settings → Danger Zone → Factory Wipe).<br /><br />
              You can permanently delete your account, your notes, and your student data from within the app (Settings → Danger Zone → Delete My Account). Billing and subscription records may be retained after deletion where needed for accounting, disputes, fraud prevention, or legal compliance; see our <Link href="/delete-account" style={{ color: 'var(--accent)' }}>account deletion page</Link> for details.<br /><br />
              You can export a copy of all your data at any time (Settings → Your Data → Export My Data).<br /><br />
              In the native iOS app, you can turn AI features off in Settings. After you turn them off, ShortHand does not send further AI requests until you allow them again.<br /><br />
              You can disconnect Google Classroom at any time, which removes your stored Google tokens.<br /><br />
              If you cannot sign in to the app, you can also request account deletion by emailing{' '}
              <a href="mailto:info@getshorthandapp.com?subject=Account%20deletion%20request" style={{ color: 'var(--accent)' }}>info@getshorthandapp.com</a>{' '}
              from the email address associated with your ShortHand account. For account security,
              we may ask you for additional verification before processing the deletion.{' '}
              <Link href="/delete-account" style={{ color: 'var(--accent)' }}>See all account deletion options →</Link>
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">🌐</div>
            <div className="privacy-title">Third-Party Services</div>
            <div className="privacy-desc">
              ShortHand uses the following third-party services to operate:<br /><br />
              <strong style={{ color: 'var(--text)' }}>Supabase:</strong> database and authentication (<a href="https://supabase.com/privacy" style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">privacy policy</a>)<br />
              <strong style={{ color: 'var(--text)' }}>Stripe:</strong> payment processing for web purchases and Pro subscriptions (<a href="https://stripe.com/privacy" style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">privacy policy</a>)<br />
              <strong style={{ color: 'var(--text)' }}>OpenAI:</strong> primary AI language model processing (<a href="https://openai.com/policies/us-privacy-policy/" style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">privacy policy</a>)<br />
              <strong style={{ color: 'var(--text)' }}>Groq:</strong> fallback AI language model processing, used if OpenAI is temporarily unavailable (<a href="https://groq.com/privacy-policy/" style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">privacy policy</a>)<br />
              <strong style={{ color: 'var(--text)' }}>Vercel:</strong> hosting, and web analytics on the website and web app (<a href="https://vercel.com/legal/privacy-policy" style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">privacy policy</a>)<br />
              <strong style={{ color: 'var(--text)' }}>Google:</strong> Google sign-in and optional Google Classroom integration (<a href="https://policies.google.com/privacy" style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">privacy policy</a>)<br />
              <strong style={{ color: 'var(--text)' }}>Apple:</strong> Sign in with Apple in the native iOS app, including Apple Private Email Relay when you hide your email (<a href="https://www.apple.com/legal/privacy/" style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">privacy policy</a>)<br />
              <strong style={{ color: 'var(--text)' }}>Google Analytics:</strong> website and web-app analytics. Not used in the native iOS app (<a href="https://policies.google.com/privacy" style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">privacy policy</a>)<br />
              <strong style={{ color: 'var(--text)' }}>Sentry:</strong> crash reporting for the web app. Not used in the native iOS app (<a href="https://sentry.io/privacy/" style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">privacy policy</a>)<br />
              <strong style={{ color: 'var(--text)' }}>Resend:</strong> transactional email, such as purchase-restore messages (<a href="https://resend.com/legal/privacy-policy" style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">privacy policy</a>)<br />
              <strong style={{ color: 'var(--text)' }}>Upstash:</strong> rate limiting for API routes (<a href="https://upstash.com/trust/privacy.pdf" style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">privacy policy</a>)
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">🎓</div>
            <div className="privacy-title">Student Privacy Pledge</div>
            <div className="privacy-desc">
              ShortHand follows the principles of the Student Privacy Pledge. This means:<br /><br />
              We will <strong style={{ color: 'var(--text)' }}>never sell student data</strong> to anyone, for any reason.<br /><br />
              We will <strong style={{ color: 'var(--text)' }}>never use student data for targeted advertising</strong>, not to students, parents, or anyone else. ShortHand does not use data for advertising tracking.<br /><br />
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
              We&apos;re a small team and we&apos;ll respond personally.
            </div>
          </div>

        </div>
      </div>

      <footer>
        <div className="footer-logo">ShortHand</div>
        <div className="footer-tagline">Built by a teacher, for teachers.</div>
        <a href="mailto:info@getshorthandapp.com" className="footer-email">info@getshorthandapp.com</a>
        <div className="footer-copy">ShortHand is a product of Lebed Digital LLC.</div>
        <div className="footer-copy">© 2026 ShortHand. All rights reserved. · <a href="https://simpleteacherai.com" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Simple Teacher AI</a></div>
      </footer>
    </>
  );
}
