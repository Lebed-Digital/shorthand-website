import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Restore your access',
  robots: { index: false, follow: false },
};

// Still a placeholder, deliberately.
//
// The confirm half of restoration is now built and tested: a valid link at
// /report-card-comment-library/restore/confirm exchanges itself for access.
// But the REQUEST half, the form that emails somebody that link, is not built,
// and cannot work yet regardless: restore email delivery is blocked on a
// Resend account and a verified sending domain that do not exist
// (docs/report-card-comment-library-handoff.md §13.12, §13.13 step 7).
//
// So this page must keep telling people to email us. It must not offer a
// "send me a link" form until a real test send has actually succeeded,
// because such a form would silently do nothing.
export default function RestoreAccessPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: 32,
          maxWidth: 460,
          width: '100%',
          textAlign: 'center',
          border: '1px solid #e2e8f0',
        }}
      >
        <h1 style={{ fontSize: 21, fontWeight: 600, color: '#0f172a', margin: '0 0 10px' }}>
          Restore your access
        </h1>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: '#475569', margin: '0 0 18px' }}>
          Email-based restoration is not switched on yet. If you have paid and lost access, email{' '}
          <a href="mailto:info@getshorthandapp.com" style={{ color: '#0d9488', fontWeight: 600 }}>
            info@getshorthandapp.com
          </a>{' '}
          with the address you used at checkout and we will restore it for you.
        </p>
        <Link
          href="/report-card-comment-library"
          style={{ color: '#64748b', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
        >
          Back to the library
        </Link>
      </div>
    </div>
  );
}
