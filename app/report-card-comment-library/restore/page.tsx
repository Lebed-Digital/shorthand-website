import type { Metadata } from 'next';
import RestoreRequestClient from './RestoreRequestClient';

export const metadata: Metadata = {
  title: 'Restore your access',
  robots: { index: false, follow: false },
};

// Restore-request page. The form itself lives in the client component; this
// stays a server component so the noindex metadata above is emitted normally.
//
// This page replaced a placeholder that told people to email us manually. That
// placeholder existed because restore email delivery was blocked on Resend
// (handoff §14.13, §15.10). The relay route and form are now built, but Resend
// is still unconfigured at the time of writing, and while it is, submitting
// this form does nothing visible: the Edge Function logs the missing key and
// still answers { ok: true }, so the user sees the same "check your inbox"
// message either way (§17.5).
//
// The info@getshorthandapp.com fallback is therefore load-bearing, not
// decorative, and must stay on this page even after Resend is live.
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
      <RestoreRequestClient />
    </div>
  );
}
