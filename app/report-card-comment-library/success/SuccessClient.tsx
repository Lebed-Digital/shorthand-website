'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

// Confirms the purchase server-side, then sends the buyer into the library.
//
// The session id in the URL is only ever a lookup key. It is posted to
// /api/report-card-checkout/verify-session, which relays it to the fulfill
// Edge Function; that function retrieves the session from Stripe and checks
// the real payment status, line item, amount, and currency before any token is
// minted. Nothing here treats the redirect itself as proof of purchase.

type State =
  | { kind: 'verifying' }
  | { kind: 'granted' }
  | { kind: 'retrying'; attempt: number }
  | { kind: 'failed'; reason: string };

const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 2000;

// Definitive rejections from the fulfill function. These mean "this session
// did not pay for this product" and must not be retried.
const TERMINAL_REASONS = new Set([
  'not_paid',
  'product_mismatch',
  'amount_mismatch',
  'currency_mismatch',
  'missing_email',
  'invalid_session_id',
  'invalid_request',
]);

function messageFor(reason: string): string {
  if (reason === 'not_paid') {
    return 'This checkout was not completed. If you were charged, use the restore link below and we will sort it out.';
  }
  if (TERMINAL_REASONS.has(reason)) {
    return 'We could not match this checkout to the Report Card Comment Library. If you were charged, use the restore link below.';
  }
  return 'We could not confirm your purchase just now. If you completed payment, your access is safe: use the restore link below, or reload this page in a minute.';
}

export default function SuccessClient({ sessionId }: { sessionId: string | null }) {
  const [state, setState] = useState<State>(
    sessionId ? { kind: 'verifying' } : { kind: 'failed', reason: 'invalid_request' }
  );
  const started = useRef(false);

  useEffect(() => {
    if (!sessionId || started.current) return;
    started.current = true;

    let cancelled = false;

    async function verify(attempt: number): Promise<void> {
      try {
        const res = await fetch('/api/report-card-checkout/verify-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json().catch(() => ({}));

        if (cancelled) return;

        if (res.ok && data?.granted === true) {
          setState({ kind: 'granted' });
          // Full reload, not a client navigation: the access cookie was just
          // set, and the gate reads it server-side on a fresh request.
          window.location.href = '/report-card-comment-library';
          return;
        }

        const reason = typeof data?.reason === 'string' ? data.reason : 'unknown';

        // Retry only transient outcomes. A brand-new payment can briefly race
        // the webhook, so give it a couple of tries before giving up.
        if (!TERMINAL_REASONS.has(reason) && attempt < MAX_ATTEMPTS) {
          setState({ kind: 'retrying', attempt });
          setTimeout(() => {
            if (!cancelled) verify(attempt + 1);
          }, RETRY_DELAY_MS);
          return;
        }

        setState({ kind: 'failed', reason });
      } catch {
        if (cancelled) return;
        if (attempt < MAX_ATTEMPTS) {
          setState({ kind: 'retrying', attempt });
          setTimeout(() => {
            if (!cancelled) verify(attempt + 1);
          }, RETRY_DELAY_MS);
          return;
        }
        setState({ kind: 'failed', reason: 'network' });
      }
    }

    verify(1);

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const verifying = state.kind === 'verifying' || state.kind === 'retrying';

  return (
    <div style={wrapStyle}>
      <div style={cardStyle}>
        {verifying && (
          <>
            <h1 style={headingStyle}>Confirming your purchase...</h1>
            <p style={bodyStyle}>This takes just a moment. Please do not close this tab.</p>
          </>
        )}

        {state.kind === 'granted' && (
          <>
            <h1 style={headingStyle}>You are in. Thank you!</h1>
            <p style={bodyStyle}>Taking you to the library...</p>
          </>
        )}

        {state.kind === 'failed' && (
          <>
            <h1 style={headingStyle}>We could not confirm this yet</h1>
            <p style={bodyStyle}>{messageFor(state.reason)}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
              <Link href="/report-card-comment-library/restore" style={primaryLinkStyle}>
                Restore my access
              </Link>
              <Link href="/report-card-comment-library" style={secondaryLinkStyle}>
                Back to the library
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const wrapStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: '#0f172a',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
};

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 16,
  padding: 32,
  maxWidth: 460,
  width: '100%',
  textAlign: 'center',
  border: '1px solid #e2e8f0',
};

const headingStyle: React.CSSProperties = {
  fontSize: 21,
  fontWeight: 600,
  color: '#0f172a',
  margin: '0 0 10px',
};

const bodyStyle: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.6,
  color: '#475569',
  margin: 0,
};

const primaryLinkStyle: React.CSSProperties = {
  display: 'block',
  background: 'linear-gradient(135deg, #0d9488, #0891b2)',
  color: '#fff',
  fontWeight: 700,
  fontSize: 14,
  padding: '12px',
  borderRadius: 10,
  textDecoration: 'none',
};

const secondaryLinkStyle: React.CSSProperties = {
  display: 'block',
  color: '#64748b',
  fontSize: 13,
  fontWeight: 600,
  textDecoration: 'none',
  padding: '8px',
};
