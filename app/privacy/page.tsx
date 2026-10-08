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
          Last updated: October 2026
        </p>
      </div>

      <div className="section-inner" style={{ maxWidth: 760, margin: '0 auto', padding: '0 1.5rem 5rem' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Plain-language summary */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '1.75rem 2rem' }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.35rem' }}>Privacy at a Glance</div>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 1rem' }}>A quick summary in plain language. The full policy below has the details.</p>
            <ul style={{ margin: 0, padding: '0 0 0 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
              <li><strong style={{ color: 'var(--text)' }}>You decide what goes in.</strong> Only you add student information. Students never create accounts or use ShortHand themselves. <a href="#applies-to" style={{ color: 'var(--accent)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Who this applies to</a></li>
              <li><strong style={{ color: 'var(--text)' }}>Other teachers can&apos;t see your students.</strong> Your records are tied to your account only. <a href="#protection" style={{ color: 'var(--accent)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>How we protect your data</a></li>
              <li><strong style={{ color: 'var(--text)' }}>AI features share information with AI providers.</strong> When you use an AI feature, or save a note without choosing tags, the text needed for that task goes to our approved AI providers (currently OpenAI, with Groq as a backup). That text can include student names. Both are set up so your data is not used to train their models. <a href="#ai" style={{ color: 'var(--accent)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>How ShortHand uses AI</a></li>
              <li><strong style={{ color: 'var(--text)' }}>No selling, no advertising.</strong> We never sell student information or use it for ads. The website and web app use analytics to operate and improve ShortHand, not to advertise. <a href="#dont-do" style={{ color: 'var(--accent)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>What we don&apos;t do</a></li>
              <li><strong style={{ color: 'var(--text)' }}>Encrypted and protected.</strong> Your records are encrypted in storage and whenever they travel between your device and our servers. <a href="#protection" style={{ color: 'var(--accent)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>How we protect your data</a></li>
              <li><strong style={{ color: 'var(--text)' }}>You can delete your data.</strong> Export it, erase your student records, or delete your account from Settings at any time. Some billing records may be kept where required. <a href="#your-rights" style={{ color: 'var(--accent)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Your rights</a></li>
            </ul>
          </div>

          {/* The ids below are the jump targets for "Privacy at a Glance".
              scrollMarginTop keeps the heading clear of the sticky nav. */}
          <div className="privacy-card" id="applies-to" style={{ scrollMarginTop: '5.5rem' }}>
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
              If you buy ShortHand Pro or another paid feature on the website, Stripe processes the payment. We do not store your card details ourselves. We store subscription or entitlement status and Stripe&apos;s reference IDs for your account. A native iOS app is awaiting Apple&apos;s approval and is not yet available. When it is released, it will offer ShortHand Pro as an optional subscription through Apple&apos;s in-app purchase system. Apple will process that payment, and we will not receive your card details. We use RevenueCat to confirm the status of an Apple subscription. RevenueCat receives your ShortHand account ID, details of the Apple purchase such as the product and its renewal date, and basic technical information about the app and device. We do not send RevenueCat student records, notes, or parent information. We store the resulting subscription status with your account. A Pro subscription bought on the web will also work in the iOS app.<br /><br />
              <strong style={{ color: 'var(--text)' }}>Student data you enter:</strong> Information you type or import about your students, which may include names, class periods, notes, behavior tags, goals, attendance, shoutouts, birthday information, calendar-related data, photo URLs, and parent communication logs.<br /><br />
              <strong style={{ color: 'var(--text)' }}>Parent and guardian contact data:</strong> Parent or guardian names, email addresses, and phone numbers, when you enter or import them so you can use parent-communication features.<br /><br />
              <strong style={{ color: 'var(--text)' }}>Disability-related and special-education information:</strong> If you enter IEP, 504, RTI, or other accommodation information, that is stored with the student record. This can include disability-related information you choose to record for your own teaching and documentation.<br /><br />
              <strong style={{ color: 'var(--text)' }}>Google Classroom (optional):</strong> If you connect Google Classroom, we access your course list and student names, emails, and profile photos to help you import your roster. We store a token to keep you connected. You can disconnect at any time.<br /><br />
              <strong style={{ color: 'var(--text)' }}>Optional website emails:</strong> If you leave your email on getshorthandapp.com to request a resource or restore a purchase, we store that email to send what you asked for.<br /><br />
              <strong style={{ color: 'var(--text)' }}>AI features:</strong>{' '}
              Some features use AI to help with tagging, drafting, summaries, import, and similar tasks. See the &ldquo;How ShortHand Uses AI&rdquo; section below for full details.
            </div>
          </div>

          <div className="privacy-card" id="ai" style={{ scrollMarginTop: '5.5rem' }}>
            <div className="privacy-icon">🤖</div>
            <div className="privacy-title">How ShortHand Uses AI</div>
            <div className="privacy-desc">
              Some ShortHand features can send the information needed for that request to third-party AI providers. ShortHand uses OpenAI as the primary provider. If an OpenAI request fails, is rate limited, or times out, the same request goes to Groq, an approved fallback. Both providers are configured so your data is not used to train their models.<br /><br />
              <strong style={{ color: 'var(--text)' }}>What may be sent depends on the feature you use.</strong> That can include notes, first names, and other content needed for the selected feature. Roster and birthday imports send the text you paste, which can include full student names and parent or guardian names, email addresses, and phone numbers. Anything you type into a note, including accommodation or goal details, is part of that note&apos;s text. ShortHand does not limit AI input to first names only.<br /><br />
              <strong style={{ color: 'var(--text)' }}>Automatic tagging.</strong> When you save a note without choosing tags yourself, ShortHand sends that note&apos;s text to the AI provider in the background so it can suggest tags. This happens for each such note unless you are offline.<br /><br />
              <strong style={{ color: 'var(--text)' }}>Voice dictation on the web.</strong> If you tap the microphone in the web app, your browser&apos;s built-in speech recognition turns your speech into text. Depending on your browser, the audio may be processed by the browser maker, such as Google or Apple, and not by ShortHand. ShortHand receives only the resulting text, which is then handled like a typed note.<br /><br />
              <strong style={{ color: 'var(--text)' }}>In the native iOS app, AI consent is explicit and fails closed.</strong> Before AI data is shared, ShortHand asks for your permission and names the providers. If you decline, that request is not sent. You can withdraw consent later in Settings, and no further AI requests are sent until you allow them again. If the approved providers are unavailable, the AI request is not sent to another unapproved provider.<br /><br />
              We never send student or parent data to AI for advertising, and we don&apos;t sell your data.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">📊</div>
            <div className="privacy-title">Web Analytics and Crash Reporting</div>
            <div className="privacy-desc">
              The ShortHand website and the web app at app.getshorthandapp.com use Google Analytics (GA4) and Vercel Analytics to understand how pages and features are used. The web app also uses Sentry for crash reporting, and first-party usage analytics and marketing attribution so we can see which features are used and how people found ShortHand. These tools may use cookies or similar identifiers. They are used to operate and improve the service, not to advertise to students or parents.<br /><br />
              <strong style={{ color: 'var(--text)' }}>PostHog, on the public website only.</strong> The public website at getshorthandapp.com also uses PostHog for website analytics and session replay. Session replay records how a visit to the website looks and moves (page layout, clicks, and scrolling) so we can find and fix confusing pages. PostHog is not used inside the ShortHand app at app.getshorthandapp.com or in the native iOS app, so it does not record your classroom records, student notes, or parent communications.<br /><br />
              Session replay is set up to hide what you enter. Anything typed into a form field is masked on every page of the website. On the free tool pages (the report card comment generator, the report card comment library, the back-to-school toolkit, and the tools pages such as the parent communication log), all on-screen text is masked as well, so a student name you type there is not readable in a recording. On other pages, the public page text is recorded as it appears. We do not send your name or email address to PostHog to identify you. PostHog does receive standard technical information such as your IP address, browser, device type, and the pages you view, and it stores an identifier in your browser to recognize a returning visit. PostHog also records when a visitor takes one of a few actions on the website: following a link to the ShortHand app or its app store listing, downloading a free PDF, finishing a free tool, copying a free tool&apos;s result, copying an example from a blog post, or pausing on a suggestion to try ShortHand inside a blog post. These records note which tool, file, link, or kind of example was involved, and never include anything that was typed, generated, or copied. We sometimes show two versions of part of a page to different visitors, chosen at random, to learn which one is clearer. When we do, PostHog records which version your browser was shown and whether it appeared on your screen, using the same browser identifier described above.<br /><br />
              These analytics and crash-reporting systems are web behavior. They are not used in the native iOS app. See the next section.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">📱</div>
            <div className="privacy-title">The Native iOS App (Pending Release)</div>
            <div className="privacy-desc">
              The native iOS app has been submitted to Apple for review and is not yet available on the App Store. Today, ShortHand is available as the web app at app.getshorthandapp.com. This section, and every mention of the iOS app in this policy, describes the submitted version and applies once it is released.<br /><br />
              The native iOS app stores the same classroom and account data you enter, but it is set up more tightly than the web app:<br /><br />
              Google Analytics, Vercel Analytics, Sentry, and first-party usage analytics and attribution are turned off.<br /><br />
              The app does not write presence records or AI token-usage records.<br /><br />
              The in-app voice dictation controls are hidden.<br /><br />
              There is no advertising SDK, no Identifier for Advertisers (IDFA) tracking, no location collection, no access to device contacts, and no access to the iOS photo library.<br /><br />
              The only in-app purchase is the optional ShortHand Pro subscription, sold through Apple&apos;s in-app purchase system. Subscription status from the web is also read, so Pro features you already have continue to work.<br /><br />
              ShortHand does not use data for advertising tracking on iOS or anywhere else.
            </div>
          </div>

          <div className="privacy-card" id="dont-do" style={{ scrollMarginTop: '5.5rem' }}>
            <div className="privacy-icon">🚫</div>
            <div className="privacy-title">What We Don&apos;t Do</div>
            <div className="privacy-desc">
              We do not sell your data or student data to anyone. Ever.<br /><br />
              We do not use student data for advertising.<br /><br />
              We do not use data for advertising tracking, including IDFA-based tracking.<br /><br />
              We only share data with service providers when needed to operate ShortHand, provide requested features, or maintain the service.<br /><br />
              No other teacher can access your students&apos; information. As the operator, I can access the database directly if needed for support, but I will never do so without your request.
            </div>
          </div>

          <div className="privacy-card" id="protection" style={{ scrollMarginTop: '5.5rem' }}>
            <div className="privacy-icon">🔐</div>
            <div className="privacy-title">How We Protect Your Data</div>
            <div className="privacy-desc">
              All student data is stored on Supabase, which is SOC 2 Type II certified and encrypts all data at rest with AES-256.<br /><br />
              All data is stored with Row Level Security (RLS) enabled, meaning every query is scoped to your account only: no other teacher can see your data. As the operator, I technically have access to the database, but I commit to never looking at your data unless you ask me to (for example, to help fix a problem).<br /><br />
              All communication between the app and our servers uses HTTPS encryption.<br /><br />
              API endpoints that read or write your account data require authentication. Your session token is verified on every request. The free public tools on getshorthandapp.com do not require an account and are rate limited instead.
            </div>
          </div>

          <div className="privacy-card" id="your-rights" style={{ scrollMarginTop: '5.5rem' }}>
            <div className="privacy-icon">🗑️</div>
            <div className="privacy-title">Your Rights</div>
            <div className="privacy-desc">
              You can delete all your data at any time from within the app (Settings → Danger Zone → Factory Wipe).<br /><br />
              You can permanently delete your account, your notes, and your student data from within the app (Settings → Danger Zone → Delete My Account). Billing and subscription records may be retained after deletion where needed for accounting, disputes, fraud prevention, or legal compliance; see our <Link href="/delete-account" style={{ color: 'var(--accent)' }}>account deletion page</Link> for details.<br /><br />
              An Apple subscription is managed by Apple. Deleting your ShortHand account does not cancel it. You can cancel in your Apple ID settings.<br /><br />
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
              <strong style={{ color: 'var(--text)' }}>Groq:</strong> fallback AI language model processing, used if an OpenAI request fails (<a href="https://groq.com/privacy-policy/" style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">privacy policy</a>)<br />
              <strong style={{ color: 'var(--text)' }}>Vercel:</strong> hosting, and web analytics on the website and web app (<a href="https://vercel.com/legal/privacy-policy" style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">privacy policy</a>)<br />
              <strong style={{ color: 'var(--text)' }}>Google:</strong> Google sign-in and optional Google Classroom integration (<a href="https://policies.google.com/privacy" style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">privacy policy</a>)<br />
              <strong style={{ color: 'var(--text)' }}>Apple:</strong> Sign in with Apple in the native iOS app, including Apple Private Email Relay when you hide your email, and payment processing for in-app subscriptions (<a href="https://www.apple.com/legal/privacy/" style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">privacy policy</a>)<br />
              <strong style={{ color: 'var(--text)' }}>RevenueCat:</strong> confirms Apple subscription status for the native iOS app. Receives your ShortHand account ID and Apple purchase details, not student records (<a href="https://www.revenuecat.com/privacy" style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">privacy policy</a>)<br />
              <strong style={{ color: 'var(--text)' }}>Google Analytics:</strong> website and web-app analytics. Not used in the native iOS app (<a href="https://policies.google.com/privacy" style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">privacy policy</a>)<br />
              <strong style={{ color: 'var(--text)' }}>PostHog:</strong> website analytics and session replay on the public website (getshorthandapp.com) only. Not used in the ShortHand app or the native iOS app (<a href="https://posthog.com/privacy" style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">privacy policy</a>)<br />
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
