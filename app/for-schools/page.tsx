import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '../../components/Footer';
import CopyEmail from './CopyEmail';

const PAGE_URL = 'https://getshorthandapp.com/for-schools';
const TITLE = 'ShortHand for Schools: Privacy and IT Review';
const DESCRIPTION = 'How ShortHand handles student data, parent communication, and AI, for district IT and privacy review.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
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
  alternates: { canonical: PAGE_URL },
};

const listStyle: React.CSSProperties = { margin: 0, padding: '0 0 0 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' };
const strong: React.CSSProperties = { color: 'var(--text)' };
const link: React.CSSProperties = { color: 'var(--accent)' };
const code: React.CSSProperties = { overflowWrap: 'anywhere', color: 'var(--text)' };
const h2: React.CSSProperties = { marginTop: 0 };

export default function ForSchoolsPage() {
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
      <main>

      <Link href="/" className="detail-back">← Back to home</Link>

      <div className="detail-hero">
        <span className="detail-icon">🏫</span>
        <h1 className="detail-title">ShortHand for <em>Schools</em></h1>
        <p className="detail-desc">
          For district IT, privacy, and administrative staff reviewing ShortHand. Teachers:{' '}
          <a href="#approval-email" style={link}>skip to the approval request email</a>.
        </p>
      </div>

      <div className="section-inner" style={{ maxWidth: 760, margin: '0 auto', padding: '0 1.5rem 5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '1rem', padding: '1.75rem 2rem' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', margin: '0 0 1rem' }}>At a glance</h2>
            <ul style={{ ...listStyle, color: 'var(--text-dim)', lineHeight: 1.6 }}>
              <li>Built for educators and school staff. Students don&apos;t have accounts and never use ShortHand.</li>
              <li>ShortHand doesn&apos;t send messages to parents or students. It prepares drafts, and the educator decides whether and where to send them.</li>
              <li>Each teacher&apos;s stored records are separated from every other account by database access controls.</li>
              <li>Student information is never sold, never used for advertising, and not used to train AI models.</li>
              <li>Some features send note text to AI providers. <a href="#ai-features" style={link}>Details below</a>.</li>
              <li>Teachers can export or erase their data. Schools can request deletion under the DPA.</li>
            </ul>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">1️⃣</div>
            <h2 className="privacy-title" style={h2}>What ShortHand is</h2>
            <div className="privacy-desc">
              A classroom documentation app built by a third grade teacher. Teachers record short notes about student behavior, progress, and parent contact, then use them to prepare reports, meeting notes, and parent messages.<br /><br />
              It runs as a web app at app.getshorthandapp.com (the Android app on Google Play runs this same web app) and as a native iOS app.<br /><br />
              It is not a student information system, a learning platform, or a messaging service, and it doesn&apos;t replace your district&apos;s official records.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">2️⃣</div>
            <h2 className="privacy-title" style={h2}>How parent communication works</h2>
            <div className="privacy-desc">
              <ul style={listStyle}>
                <li>ShortHand can draft a parent email or text from the teacher&apos;s notes.</li>
                <li>On a phone or iPad, an email draft opens in the device&apos;s mail app. On a computer, it opens in Gmail in the browser, which passes the recipient, subject, and draft text to Gmail and may use whichever Google account was last active, personal or district.</li>
                <li>On supported mobile devices, the Text button opens the device&apos;s messaging app with the draft.</li>
                <li>The educator reviews, edits, and sends from their own account. <strong style={strong}>ShortHand&apos;s servers never email or text parents or students.</strong></li>
                <li>Where a Copy button is available, a teacher can paste the draft into a district-approved channel instead, without opening Gmail.</li>
                <li>There are no student accounts, logins, or student messaging.</li>
                <li>Educators remain responsible for using the communication channels their district approves.</li>
              </ul>
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">3️⃣</div>
            <h2 className="privacy-title" style={h2}>Student data</h2>
            <div className="privacy-desc">
              <ul style={listStyle}>
                <li><strong style={strong}>What&apos;s stored:</strong>{' '}what the educator enters, which can include student names, class periods, notes, behavior tags, goals, attendance, birthdays, accommodation information (IEP, 504, RTI), parent or guardian names and contact details, and a log of parent contacts. If a teacher connects Google Classroom, ShortHand reads the course list and student names, emails, and profile photos for roster import, and stores a connection token until the teacher disconnects. Teachers can enter first names or initials instead of full names.</li>
                <li><strong style={strong}>Where:</strong>{' '}Supabase database (AWS us-east-1, Virginia, USA). App hosted on Vercel. Notes waiting to sync are briefly queued in the browser on the teacher&apos;s device.</li>
                <li><strong style={strong}>Who can see it:</strong>{' '}stored records are tied to the teacher&apos;s account and separated by row-level security, so other teachers, schools, and parents can&apos;t see them. The operator (one person) can technically access the database and commits to doing so only at the teacher&apos;s request, for example to fix a problem.</li>
                <li><strong style={strong}>Leaving ShortHand:</strong>{' '}teachers can export their data, erase student records with Factory Wipe, or delete their account in Settings. Some billing records may be kept where required. Under the DPA, a school can request in writing that ShortHand delete the Student Data of its authorized users within 30 days.</li>
                <li><strong style={strong}>Service providers:</strong>{' '}the full list is in <Link href="/dpa" style={link}>DPA Section 6</Link>. Student information can reach Supabase and Vercel (storage and hosting), OpenAI and Groq (AI features), Google (only if the teacher connects Google Classroom or uses Gmail drafts), and Sentry (web crash reports can incidentally include a student, parent, or class name; not used in the iOS app). Web voice dictation uses the browser&apos;s own speech recognition, which may be processed by the browser maker.</li>
              </ul>
            </div>
          </div>

          <div className="privacy-card" id="ai-features">
            <div className="privacy-icon">4️⃣</div>
            <h2 className="privacy-title" style={h2}>AI features</h2>
            <div className="privacy-desc">
              <ul style={listStyle}>
                <li><strong style={strong}>Features:</strong>{' '}automatic note tagging, report and parent-message drafts, summaries, answers to questions about the teacher&apos;s own notes, and roster, birthday, and calendar imports.</li>
                <li>Requests go from ShortHand&apos;s servers, not the teacher&apos;s browser. Most features use OpenAI first and send the same request to Groq if OpenAI times out or returns certain errors. School calendar PDF scanning uses OpenAI only.</li>
                <li>When a note is saved without tags chosen by the teacher, its text is sent to the AI provider in the background to suggest tags. A provider receives whatever is in that text, which can include full names, accommodations, or goals. Imports can also send pasted parent contact details.</li>
                <li>Neither provider uses this data to train models. ShortHand has turned off optional data sharing with OpenAI. Under standard API data controls, OpenAI may retain inputs and outputs for up to 30 days, primarily for abuse monitoring. Groq is configured for Zero Data Retention.</li>
                <li>Teachers review drafts before using them and choose whether to add suggested goals. Automatic tagging can add tags to saved notes. Decisions about grades, placement, and discipline stay with educators.</li>
                <li>In the iOS app, AI features require the teacher&apos;s explicit consent and can be turned off.</li>
              </ul>
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">5️⃣</div>
            <h2 className="privacy-title" style={h2}>Security</h2>
            <div className="privacy-desc">
              <ul style={listStyle}>
                <li>Data stored in Supabase is encrypted at rest (AES-256). Traffic between the app and ShortHand&apos;s servers uses HTTPS.</li>
                <li>Supabase and Vercel are SOC 2 Type II certified providers.</li>
                <li>Row-level security on stored records. Account APIs verify the sign-in on every request.</li>
                <li>Sign-in: email and password, Google, or Sign in with Apple (iOS).</li>
                <li>Under the DPA, ShortHand notifies the school within 72 hours of becoming aware of a breach affecting Student Data.</li>
                <li>iOS app: no advertising SDK, no ad tracking, no Google Analytics, Vercel Analytics, or Sentry.</li>
              </ul>
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">6️⃣</div>
            <h2 className="privacy-title" style={h2}>District review and approval</h2>
            <div className="privacy-desc">
              <ul style={listStyle}>
                <li><strong style={strong}>Documents:</strong>{' '}<Link href="/privacy" style={link}>Privacy Policy</Link>,{' '}<Link href="/dpa" style={link}>Data Processing Agreement</Link>,{' '}<Link href="/terms" style={link}>Terms of Service</Link>,{' '}<Link href="/delete-account" style={link}>Account Deletion</Link>.</li>
                <li><strong style={strong}>Signed DPA:</strong>{' '}email <a href="mailto:info@getshorthandapp.com?subject=Signed%20DPA%20request" style={link}>info@getshorthandapp.com</a>{' '}with your district name for a countersigned copy of ShortHand&apos;s DPA, returned within 2 business days.</li>
                <li><strong style={strong}>District-specific agreements or review questions:</strong>{' '}email <a href="mailto:info@getshorthandapp.com" style={link}>info@getshorthandapp.com</a>. Any agreement is reviewed before it is signed.</li>
                <li>Under the DPA, schools decide who may enter Student Data and obtain any required consents.</li>
                <li>Whether ShortHand is approved is your district&apos;s decision.</li>
              </ul>
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">7️⃣</div>
            <h2 className="privacy-title" style={h2}>Technical information</h2>
            <div className="privacy-desc">
              <ul style={listStyle}>
                <li>Nothing to install on district devices, no browser extensions, nothing on student devices.</li>
                <li>
                  Common web app destinations (from the app&apos;s code, not a guaranteed complete allowlist):
                  <ul style={{ ...listStyle, marginTop: '0.6rem' }}>
                    <li><strong style={strong}>Core:</strong>{' '}<code style={code}>app.getshorthandapp.com</code>{' '}(app, its API, and Vercel Analytics),{' '}<code style={code}>muywwvbmpjotcffocyjb.supabase.co</code>{' '}(database and sign-in).</li>
                    <li><strong style={strong}>Optional features:</strong>{' '}<code style={code}>accounts.google.com</code>{' '}(Google sign-in, Google Classroom),{' '}<code style={code}>mail.google.com</code>{' '}(email drafts on a computer),{' '}<code style={code}>checkout.stripe.com</code>{' '}(buying Pro on the web),{' '}<code style={code}>fonts.googleapis.com</code>{' '}and{' '}<code style={code}>fonts.gstatic.com</code>{' '}(fonts).</li>
                    <li><strong style={strong}>Web analytics and crash reporting:</strong>{' '}<code style={code}>www.googletagmanager.com</code>,{' '}<code style={code}>*.google-analytics.com</code>,{' '}<code style={code}>*.ingest.us.sentry.io</code>.</li>
                    <li><strong style={strong}>Website:</strong>{' '}<code style={code}>getshorthandapp.com</code>.</li>
                  </ul>
                </li>
                <li>Please review these through your district&apos;s normal process. We don&apos;t recommend working around district filtering.</li>
              </ul>
            </div>
          </div>

          <div className="privacy-card" id="approval-email" style={{ scrollMarginTop: '1.5rem' }}>
            <div className="privacy-icon">8️⃣</div>
            <h2 className="privacy-title" style={h2}>Need approval from your district?</h2>
            <div className="privacy-desc">
              <p style={{ margin: '0 0 1rem' }}>Send this to your technology department. Copy it, paste it into a new email, and edit it however you like.</p>
              <CopyEmail />
              <p style={{ margin: '1rem 0 0' }}>Approval is your district&apos;s decision.</p>
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">✉️</div>
            <h2 className="privacy-title" style={h2}>Contact</h2>
            <div className="privacy-desc">
              <a href="mailto:info@getshorthandapp.com" style={link}>info@getshorthandapp.com</a><br /><br />
              ShortHand / Lebed Digital LLC
            </div>
          </div>

        </div>
      </div>

      </main>
      <Footer />
    </>
  );
}
