import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Restore link problem',
  robots: { index: false, follow: false },
};

// Generic failure page for restore-confirm.
//
// It deliberately exposes NO internal reason. The confirm route collapses
// every failure into exactly two buckets before redirecting here:
//
//   e=busy  transient (database lookup failed, function unreachable, timeout,
//           rate limited, token/secret drift). Worth retrying.
//   e=link  definitive (expired link, bad signature, malformed token, refunded
//           or revoked purchase, no such purchase). Retrying will not help.
//
// Nothing else is accepted, and anything unrecognised is treated as 'link'.
// A visitor cannot use this page to learn whether a given purchase exists, was
// refunded, or was revoked; those all look identical from here.

export const dynamic = 'force-dynamic';

export default async function RestoreFailedPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  const { e } = await searchParams;
  const transient = e === 'busy';

  const heading = transient ? 'Something went wrong on our end' : 'This link did not work';

  const body = transient
    ? 'We could not confirm your access just now. This is usually temporary. Please try your link again in a few minutes.'
    : 'Restore links expire 30 minutes after they are sent, so this one may simply be too old. Request a fresh link and it will work.';

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
          {heading}
        </h1>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: '#475569', margin: '0 0 18px' }}>
          {body}
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: '#475569', margin: '0 0 18px' }}>
          If it keeps happening, email{' '}
          <a href="mailto:info@getshorthandapp.com" style={{ color: '#0d9488', fontWeight: 600 }}>
            info@getshorthandapp.com
          </a>{' '}
          with the address you used at checkout and we will sort it out for you.
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
