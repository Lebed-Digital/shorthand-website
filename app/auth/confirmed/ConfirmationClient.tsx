'use client';

import { useLayoutEffect, useState } from 'react';
import { parseSignupFragment, type ConfirmationResult } from '../../../lib/signup-confirmation';

const destination = 'https://app.getshorthandapp.com/auth/confirmed';

export default function ConfirmationClient() {
  const [result, setResult] = useState<ConfirmationResult | null>(null);

  useLayoutEffect(() => {
    const hash = window.location.hash;
    window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
    const parsed = parseSignupFragment(hash);
    queueMicrotask(() => setResult(parsed));
  }, []);

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#f8fafc', color: '#16213b' }}>
      <div style={{ maxWidth: 440, textAlign: 'center' }}>
        {result?.status === 'valid' ? (
          <>
            <h1>Email verified</h1>
            <p>Your email is confirmed. Tap below to finish opening ShortHand.</p>
            <a
              href={destination}
              onClick={(event) => { event.currentTarget.href = destination + result.fragment; }}
              style={{ display: 'inline-block', marginTop: 16, padding: '12px 24px', borderRadius: 8, background: '#183b6b', color: '#fff', fontWeight: 600 }}
            >
              Open ShortHand
            </a>
          </>
        ) : result ? (
          <>
            <h1>Confirmation link unavailable</h1>
            <p>This link is missing, malformed, expired, or already used. Please request a new confirmation email in ShortHand.</p>
          </>
        ) : (
          <p>Checking your confirmation link…</p>
        )}
      </div>
    </main>
  );
}
