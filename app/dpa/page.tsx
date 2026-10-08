import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Data Processing Agreement | ShortHand',
  description: 'ShortHand Data Processing Agreement for schools and districts.',
  alternates: { canonical: 'https://getshorthandapp.com/dpa' },
};

export default function DpaPage() {
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
        <span className="detail-icon">📄</span>
        <h1 className="detail-title">Data Processing <em>Agreement</em></h1>
        <p className="detail-desc">
          This agreement governs how ShortHand processes student data on behalf of schools and districts,
          in compliance with FERPA, COPPA, and applicable state privacy laws.
        </p>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          Last updated: October 2026
        </p>
      </div>

      <div className="section-inner" style={{ maxWidth: 760, margin: '0 auto', padding: '0 1.5rem 5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Plain-language summary for teachers, with the signed-DPA request */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '1.75rem 2rem' }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.35rem' }}>What Teachers Should Know</div>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 1rem' }}>A plain-language summary for teachers. It does not replace the agreement below. If the two ever differ, the agreement applies.</p>
            <ul style={{ margin: 0, padding: '0 0 0 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
              <li><strong style={{ color: 'var(--text)' }}>This agreement protects student information.</strong> It sets out how ShortHand must handle the student information teachers enter.</li>
              <li><strong style={{ color: 'var(--text)' }}>Used only to provide ShortHand.</strong> Student information is never sold and never used for advertising. It is shared only with the service providers needed to run ShortHand, including the AI providers listed in Section 6.</li>
              <li><strong style={{ color: 'var(--text)' }}>Stored securely.</strong> Stored information is encrypted, and access controls keep each teacher&apos;s records separate.</li>
              <li><strong style={{ color: 'var(--text)' }}>Deletable.</strong> Teachers can delete their data in Settings at any time, and a school can request deletion under this agreement.</li>
              <li><strong style={{ color: 'var(--text)' }}>Your school decides what&apos;s approved.</strong> This page does not replace your school or district&apos;s approval process. If your school needs a signed agreement, it can request one.</li>
            </ul>
            <p style={{ color: 'var(--text-dim)', lineHeight: 1.6, margin: '1rem 0 0' }}>
              <a href="mailto:info@getshorthandapp.com?subject=Signed%20DPA%20request" style={{ color: 'var(--accent)', fontWeight: 600 }}>Request a signed DPA →</a>{' '}
              Email <a href="mailto:info@getshorthandapp.com" style={{ color: 'var(--accent)' }}>info@getshorthandapp.com</a>{' '}with your district name and we&apos;ll return a countersigned copy within 2 business days. The full agreement terms are below.
            </p>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">1️⃣</div>
            <div className="privacy-title">Definitions</div>
            <div className="privacy-desc">
              <strong style={{ color: 'var(--text)' }}>"School" or "District"</strong> means the educational institution entering into this agreement.<br /><br />
              <strong style={{ color: 'var(--text)' }}>"ShortHand"</strong> means Lebed Digital LLC, the operator of the ShortHand application.<br /><br />
              <strong style={{ color: 'var(--text)' }}>"Student Data"</strong> means any personally identifiable information (PII) related to students that is entered into ShortHand by school personnel, including but not limited to: student names, behavioral notes, parent contact information, and class assignments.<br /><br />
              <strong style={{ color: 'var(--text)' }}>"Authorized Users"</strong> means teachers and school staff who have been granted access to ShortHand by the School.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">2️⃣</div>
            <div className="privacy-title">Scope and Purpose</div>
            <div className="privacy-desc">
              ShortHand processes Student Data solely to provide the services described in the ShortHand application: classroom note-taking, behavior tracking, AI-assisted features (automatic note tagging, report and message drafting, summaries, and roster and calendar imports), and related teacher productivity features.<br /><br />
              ShortHand acts as a "School Official" under FERPA with a legitimate educational interest, processing Student Data only on behalf of and under the instructions of the School.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">3️⃣</div>
            <div className="privacy-title">ShortHand's Obligations</div>
            <div className="privacy-desc">
              ShortHand agrees to:<br /><br />
              • <strong style={{ color: 'var(--text)' }}>Not sell Student Data</strong> to any third party for any purpose.<br /><br />
              • <strong style={{ color: 'var(--text)' }}>Not use Student Data for advertising</strong> or to build profiles on students outside the School's educational context.<br /><br />
              • <strong style={{ color: 'var(--text)' }}>Not share Student Data</strong> with third parties except subprocessors necessary to operate the service (listed in Section 6).<br /><br />
              • <strong style={{ color: 'var(--text)' }}>Implement appropriate security measures</strong> including encryption at rest (AES-256), encryption in transit (TLS), and row-level access controls.<br /><br />
              • <strong style={{ color: 'var(--text)' }}>Notify the School</strong> within 72 hours of becoming aware of a data breach affecting Student Data.<br /><br />
              • <strong style={{ color: 'var(--text)' }}>Delete or return Student Data</strong> upon request or termination of the agreement within 30 days.<br /><br />
              • <strong style={{ color: 'var(--text)' }}>Allow audit rights:</strong> provide documentation upon reasonable request to demonstrate compliance with this agreement.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">4️⃣</div>
            <div className="privacy-title">School's Obligations</div>
            <div className="privacy-desc">
              The School agrees to:<br /><br />
              • Ensure that Authorized Users have appropriate authorization to enter Student Data into ShortHand.<br /><br />
              • Obtain any consents required by applicable law before entering Student Data into the system.<br /><br />
              • Notify ShortHand promptly if it becomes aware of any unauthorized access to Student Data.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">5️⃣</div>
            <div className="privacy-title">Data Retention and Deletion</div>
            <div className="privacy-desc">
              Student Data is retained only as long as the Authorized User's account is active.<br /><br />
              Teachers can delete all Student Data at any time from within the app (Settings → Danger Zone → Factory Wipe).<br /><br />
              Teachers can permanently delete their account and all Student Data (Settings → Danger Zone → Delete My Account).<br /><br />
              Upon written request from the School, ShortHand will delete all Student Data associated with the School's Authorized Users within 30 days.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">6️⃣</div>
            <div className="privacy-title">Subprocessors</div>
            <div className="privacy-desc">
              ShortHand uses the following subprocessors to process Student Data:<br /><br />
              <strong style={{ color: 'var(--text)' }}>Supabase:</strong> database and authentication. Data stored in AWS us-east-1 (Virginia, USA). SOC 2 Type II certified. Schools in provinces with data residency requirements (such as British Columbia or Nova Scotia) should contact us to discuss options before signing up.<br /><br />
              <strong style={{ color: 'var(--text)' }}>OpenAI:</strong> primary AI language model processing for all AI features. This includes automatic tagging of saved notes, report and parent message drafting, summaries, questions a teacher asks about their notes, and roster, birthday, and calendar imports. Depending on the feature, OpenAI may receive note text, student first names, and, for imports, full student names and parent or guardian names, email addresses, and phone numbers as pasted by the teacher. ShortHand uses the OpenAI API under the OpenAI Services Agreement, which incorporates OpenAI&apos;s Data Processing Addendum. OpenAI does not use API data to train its models by default, and ShortHand has turned off all optional data sharing with OpenAI. Standard API inputs and outputs may be retained by OpenAI for up to 30 days under its published data controls, primarily for abuse monitoring.<br /><br />
              <strong style={{ color: 'var(--text)' }}>Groq:</strong> fallback AI language model processing. If an OpenAI request fails, is rate limited, or times out, the same request is sent to Groq instead, so Groq can receive the same categories of data as OpenAI. Groq does not use customer data to train models and offers a DPA. ShortHand configures Groq with Zero Data Retention, so student-derived inputs and outputs are not retained by Groq after processing.<br /><br />
              <strong style={{ color: 'var(--text)' }}>Vercel:</strong> application hosting. SOC 2 Type II certified.<br /><br />
              <strong style={{ color: 'var(--text)' }}>Google:</strong> optional Google Classroom integration only. Used solely to import class rosters when the teacher explicitly connects their account.<br /><br />
              <strong style={{ color: 'var(--text)' }}>Other service providers.</strong> ShortHand also uses Stripe (payments), Resend (transactional email to teachers), Upstash (rate limiting by IP address), Google Analytics and Vercel Analytics (usage analytics), PostHog (public website only), and Apple (Sign in with Apple). These support operating the service and are not used to store or process student records.<br /><br />
              <strong style={{ color: 'var(--text)' }}>Sentry:</strong> crash reporting for the web app. ShortHand does not send notes, reports, or other student records to Sentry. An error report includes a short technical log of recent activity in the app, and that log can incidentally contain a limited label or request detail, such as a student, parent, or class name. Sentry is not used in the native iOS app.<br /><br />
              These providers are also listed in our <Link href="/privacy" style={{ color: 'var(--accent)' }}>Privacy Policy</Link>.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">7️⃣</div>
            <div className="privacy-title">FERPA Compliance</div>
            <div className="privacy-desc">
              ShortHand acknowledges that Student Data shared by a School may be subject to FERPA (20 U.S.C. § 1232g).<br /><br />
              ShortHand agrees to use Student Data only for the purposes for which it was disclosed (providing classroom management services to Authorized Users) and for no other purpose.<br /><br />
              ShortHand will not re-disclose Student Data to any party other than the School or its Authorized Users without prior written consent from the School.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">🍁</div>
            <div className="privacy-title">Canadian Teachers (PIPEDA)</div>
            <div className="privacy-desc">
              ShortHand is used by teachers across Canada. Canadian privacy law (PIPEDA and provincial equivalents such as BC's FIPPA and Quebec's Law 25) imposes stricter requirements than US federal law in some areas.<br /><br />
              Key points for Canadian schools:<br /><br />
              • <strong style={{ color: 'var(--text)' }}>Data location:</strong> Student data is stored on US servers (AWS us-east-1). Schools in provinces with strict data residency rules should review this with their IT department before using ShortHand. Contact us to discuss options.<br /><br />
              • <strong style={{ color: 'var(--text)' }}>AI processing:</strong> Note text is sent to OpenAI (a US-based provider) when a note is saved without manually chosen tags, and when a teacher uses an AI feature such as a report, summary, or import. Imports can include full student names and parent or guardian contact details. Groq (also US-based) is an approved fallback if an OpenAI request fails. No student PII is used to train AI models.<br /><br />
              • <strong style={{ color: 'var(--text)' }}>Data minimization:</strong> ShortHand collects only the information a teacher actively enters. Nothing is collected passively beyond what is necessary to operate the service.<br /><br />
              Questions about Canadian compliance? Email <a href="mailto:info@getshorthandapp.com" style={{ color: 'var(--accent)' }}>info@getshorthandapp.com</a>.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">8️⃣</div>
            <div className="privacy-title">COPPA Compliance</div>
            <div className="privacy-desc">
              ShortHand is a teacher-facing tool. Teachers, not students, create accounts and enter data.<br /><br />
              Students do not create accounts, log in, or directly interact with ShortHand.<br /><br />
              ShortHand does not knowingly collect personal information directly from children under 13. Any student information in the system was entered by a teacher on behalf of the School.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">9️⃣</div>
            <div className="privacy-title">Term and Termination</div>
            <div className="privacy-desc">
              This agreement is effective upon the School's first use of ShortHand and remains in effect until terminated.<br /><br />
              Either party may terminate this agreement with 30 days written notice.<br /><br />
              Upon termination, ShortHand will delete all Student Data associated with the School's accounts within 30 days, unless retention is required by law.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">✉️</div>
            <div className="privacy-title">Contact</div>
            <div className="privacy-desc">
              To request a countersigned DPA, report a concern, or ask questions about this agreement:<br /><br />
              <a href="mailto:info@getshorthandapp.com" style={{ color: 'var(--accent)' }}>info@getshorthandapp.com</a><br /><br />
              ShortHand / Lebed Digital LLC
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
