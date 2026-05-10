import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Data Processing Agreement — ShortHand',
  description: 'ShortHand Data Processing Agreement for schools and districts.',
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
          <Link href="/install" className="btn-primary">Try Free</Link>
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
          Last updated: March 2026
        </p>
      </div>

      <div className="section-inner" style={{ maxWidth: 760, margin: '0 auto', padding: '0 1.5rem 5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Download CTA */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)' }}>Need a signed DPA?</div>
            <p style={{ color: 'var(--text-dim)', lineHeight: 1.6, margin: 0 }}>
              Email us at <a href="mailto:gregorylebed@gmail.com" style={{ color: 'var(--accent)' }}>gregorylebed@gmail.com</a> with your district name and we'll
              return a countersigned copy within 2 business days. The full agreement terms are below.
            </p>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">1️⃣</div>
            <div className="privacy-title">Definitions</div>
            <div className="privacy-desc">
              <strong style={{ color: 'var(--text)' }}>"School" or "District"</strong> means the educational institution entering into this agreement.<br /><br />
              <strong style={{ color: 'var(--text)' }}>"ShortHand"</strong> means GetShortHand LLC, the operator of the ShortHand application.<br /><br />
              <strong style={{ color: 'var(--text)' }}>"Student Data"</strong> means any personally identifiable information (PII) related to students that is entered into ShortHand by school personnel, including but not limited to: student names, behavioral notes, parent contact information, and class assignments.<br /><br />
              <strong style={{ color: 'var(--text)' }}>"Authorized Users"</strong> means teachers and school staff who have been granted access to ShortHand by the School.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">2️⃣</div>
            <div className="privacy-title">Scope and Purpose</div>
            <div className="privacy-desc">
              ShortHand processes Student Data solely to provide the services described in the ShortHand application: classroom note-taking, behavior tracking, AI-assisted report generation, and related teacher productivity features.<br /><br />
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
              • <strong style={{ color: 'var(--text)' }}>Allow audit rights</strong> — provide documentation upon reasonable request to demonstrate compliance with this agreement.
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
              Teachers can permanently delete their account and all associated data (Settings → Danger Zone → Delete My Account).<br /><br />
              Upon written request from the School, ShortHand will delete all Student Data associated with the School's Authorized Users within 30 days.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">6️⃣</div>
            <div className="privacy-title">Subprocessors</div>
            <div className="privacy-desc">
              ShortHand uses the following subprocessors to deliver the service. Each has been evaluated for FERPA compliance:<br /><br />
              <strong style={{ color: 'var(--text)' }}>Supabase</strong> — database and authentication. Data stored in AWS us-east-1 (Virginia, USA). SOC 2 Type II certified. Schools in provinces with data residency requirements (such as British Columbia or Nova Scotia) should contact us to discuss options before signing up.<br /><br />
              <strong style={{ color: 'var(--text)' }}>Groq</strong> — AI language model processing for report generation. Groq does not use customer data to train models and offers a DPA. Data is not retained after the API response.<br /><br />
              <strong style={{ color: 'var(--text)' }}>Vercel</strong> — application hosting. SOC 2 Type II certified.<br /><br />
              <strong style={{ color: 'var(--text)' }}>Google</strong> — optional Google Classroom integration only. Used solely to import class rosters when the teacher explicitly connects their account.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">7️⃣</div>
            <div className="privacy-title">FERPA Compliance</div>
            <div className="privacy-desc">
              ShortHand acknowledges that Student Data shared by a School may be subject to FERPA (20 U.S.C. § 1232g).<br /><br />
              ShortHand agrees to use Student Data only for the purposes for which it was disclosed — providing classroom management services to Authorized Users — and for no other purpose.<br /><br />
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
              • <strong style={{ color: 'var(--text)' }}>AI processing:</strong> When AI features are used, notes are sent to Groq (a US-based provider) for processing and are not retained after the response is returned. No student PII is used to train AI models.<br /><br />
              • <strong style={{ color: 'var(--text)' }}>Data minimization:</strong> ShortHand collects only the information a teacher actively enters. Nothing is collected passively beyond what is necessary to operate the service.<br /><br />
              Questions about Canadian compliance? Email <a href="mailto:gregorylebed@gmail.com" style={{ color: 'var(--accent)' }}>gregorylebed@gmail.com</a>.
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">8️⃣</div>
            <div className="privacy-title">COPPA Compliance</div>
            <div className="privacy-desc">
              ShortHand is a teacher-facing tool. Teachers — not students — create accounts and enter data.<br /><br />
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
              <a href="mailto:gregorylebed@gmail.com" style={{ color: 'var(--accent)' }}>gregorylebed@gmail.com</a><br /><br />
              ShortHand / GetShortHand LLC
            </div>
          </div>

        </div>
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
