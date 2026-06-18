import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | ShortHand',
  description: 'Terms of Service for ShortHand, the teacher productivity app for classroom management, student progress tracking, and parent communication.',
  alternates: { canonical: 'https://getshorthandapp.com/terms' },
};

export default function TermsPage() {
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
          <Link href="https://app.getshorthandapp.com/onboarding" className="btn-primary">Try Free</Link>
        </div>
      </nav>

      <Link href="/" className="detail-back">← Back to home</Link>

      <div className="detail-hero">
        <div className="detail-label">Legal</div>
        <h1 className="detail-heading">Terms of Service</h1>
        <p className="detail-sub">Last updated: April 2, 2026</p>
      </div>

      <div className="detail-body" style={{ maxWidth: '720px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>

        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using ShortHand ("the App"), you agree to be bound by these Terms of Service. ShortHand is a teacher productivity application designed to support classroom management, student progress tracking, and parent communication. If you do not agree to these terms, please do not use the App.</p>

        <h2>2. Description of Service</h2>
        <p>ShortHand is an education technology tool built for K–12 teachers. It provides tools for:</p>
        <ul>
          <li>Classroom management and student observation logging</li>
          <li>Student progress tracking and behavior documentation</li>
          <li>Parent and guardian communication logs</li>
          <li>AI-assisted report generation based on teacher notes</li>
          <li>Social-Emotional Learning (SEL) support tools</li>
        </ul>
        <p>ShortHand is designed to support teacher productivity and pedagogy, not to replace professional educator judgment.</p>

        <h2>3. Eligibility</h2>
        <p>ShortHand is intended for use by educators, school staff, and authorized educational professionals. Users must be 18 years of age or older. The App is not intended for direct use by students.</p>

        <h2>4. Data and Privacy</h2>
        <p>Your use of the App is also governed by our <Link href="/privacy" style={{ color: 'var(--accent)' }}>Privacy Policy</Link>, which is incorporated into these Terms by reference. We take the privacy of student data seriously and comply with applicable education privacy laws including FERPA and COPPA.</p>

        <h2>5. User Responsibilities</h2>
        <p>You agree to:</p>
        <ul>
          <li>Use the App only for lawful educational purposes</li>
          <li>Not share your account credentials with unauthorized parties</li>
          <li>Ensure your use complies with your school or district's policies</li>
          <li>Not store personally identifiable student information beyond what is necessary for your professional duties</li>
        </ul>

        <h2>6. Intellectual Property</h2>
        <p>All content, features, and functionality of ShortHand (including but not limited to software, text, graphics, and design) are owned by Lebed Digital LLC and protected by applicable intellectual property laws.</p>

        <h2>7. Disclaimer of Warranties</h2>
        <p>ShortHand is provided "as is" without warranties of any kind, either express or implied. We do not warrant that the App will be error-free or uninterrupted.</p>

        <h2>8. Limitation of Liability</h2>
        <p>To the maximum extent permitted by law, Lebed Digital LLC shall not be liable for any indirect, incidental, or consequential damages arising from your use of the App.</p>

        <h2>9. Changes to Terms</h2>
        <p>We may update these Terms from time to time. Continued use of the App after changes are posted constitutes your acceptance of the revised Terms.</p>

        <h2>10. Contact</h2>
        <p>Questions about these Terms? Contact us at <a href="mailto:info@getshorthandapp.com" style={{ color: 'var(--accent)' }}>info@getshorthandapp.com</a>.</p>

      </div>

      <footer>
        <div className="footer-logo">ShortHand</div>
        <div className="footer-tagline">Built by a teacher, for teachers.</div>
        <a href="mailto:info@getshorthandapp.com" className="footer-email">info@getshorthandapp.com</a>
        <div className="footer-copy">© 2026 ShortHand. All rights reserved. · <a href="/privacy" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Privacy Policy</a> · <a href="/terms" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Terms of Service</a></div>
      </footer>
    </>
  );
}
