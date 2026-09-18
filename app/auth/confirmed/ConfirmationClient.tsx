'use client';

import { useLayoutEffect, useState } from 'react';
import { parseSignupFragment, diagnoseFragment, type ConfirmationResult, type FragmentDiagnostics } from '../../../lib/signup-confirmation';

const destination = 'https://app.getshorthandapp.com/auth/confirmed';

export default function ConfirmationClient() {
  const [result, setResult] = useState<ConfirmationResult | null>(null);
  // TEMPORARY: structural diagnostics shown only on the failure states, so a
  // real signup on a phone surfaces the callback shape without a debug flag or
  // a native app change. The success path is untouched. Never holds a token
  // value. Remove once the real Supabase callback shape is confirmed.
  const [diagnostics, setDiagnostics] = useState<FragmentDiagnostics | null>(null);

  useLayoutEffect(() => {
    const hash = window.location.hash;
    window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
    const parsed = parseSignupFragment(hash);
    const diags = parsed.status === 'valid' ? null : diagnoseFragment(hash);
    queueMicrotask(() => { setResult(parsed); setDiagnostics(diags); });
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
        {diagnostics && (
          <div
            data-testid="diagnostics"
            style={{ marginTop: 24, padding: 16, borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', textAlign: 'left', fontFamily: 'ui-monospace, monospace', fontSize: 13, lineHeight: 1.6, wordBreak: 'break-word' }}
          >
            <strong>Diagnostics (temporary)</strong>
            <div>status: {diagnostics.status}</div>
            <div>reasons: {diagnostics.reasons.join(', ') || '(none)'}</div>
            <div>keys: {diagnostics.keys.join(', ') || '(no fragment)'}</div>
            <div>access_token present: {String(diagnostics.hasAccessToken)}</div>
            <div>refresh_token present: {String(diagnostics.hasRefreshToken)}</div>
            <div>expires_in present: {String(diagnostics.hasExpiresIn)}</div>
            <div>expires_at present: {String(diagnostics.hasExpiresAt)}</div>
            <div>type: {diagnostics.type ?? '(absent)'}</div>
            <div>token_type: {diagnostics.tokenType ?? '(absent)'}</div>
            <p style={{ marginTop: 12, fontFamily: 'inherit', color: '#475569' }}>
              Temporary troubleshooting details. No login tokens are shown here or sent anywhere. Screenshot this and send it over.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
