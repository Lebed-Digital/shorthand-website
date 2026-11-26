'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { supabase } from '../lib/supabase';

function storageKey(source: string) {
  return `shorthand_lead_unlocked_${source}`;
}

const noSubscribe = () => () => {};

export default function LeadGate({
  source,
  children,
}: {
  source: string;
  children: React.ReactNode;
}) {
  // null on the server and during hydration (renders nothing), then the stored
  // flag on the client. Same timing as the old mount effect, without setState in it.
  const storedUnlocked = useSyncExternalStore(
    noSubscribe,
    () => window.localStorage.getItem(storageKey(source)) === 'true',
    () => null,
  );
  // Which source was unlocked by submitting here, so a source change re-gates.
  const [unlockedSource, setUnlockedSource] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setSubmitting(true);

    const { error: insertError } = await supabase
      .from('email_leads')
      .insert({ email: trimmed, source });

    setSubmitting(false);

    if (insertError && insertError.code !== '23505') {
      setError('Something went wrong. Please try again.');
      return;
    }

    window.localStorage.setItem(storageKey(source), 'true');
    setUnlockedSource(source);
  }

  if (storedUnlocked === null) return null;
  if (storedUnlocked || unlockedSource === source) return <>{children}</>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 420, width: '100%', background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 1px 3px rgba(23,45,41,0.12)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
          Get instant access
        </h2>
        <p style={{ fontSize: 14, color: '#475569', margin: '0 0 24px', lineHeight: 1.6 }}>
          Enter your email to unlock this free tool. We occasionally send teacher resources and ShortHand updates. Unsubscribe anytime.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@school.edu"
            required
            style={{ width: '100%', borderRadius: 10, border: '1.5px solid #e2e8f0', padding: '12px 14px', fontSize: 14, color: '#1e293b', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 12 }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--teal)')}
            onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
          />
          {error && <p style={{ color: 'var(--error)', fontSize: 13, margin: '0 0 12px' }}>{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            style={{ width: '100%', background: submitting ? 'var(--text-faint)' : 'var(--teal)', color: '#fff', fontWeight: 700, fontSize: 15, padding: '14px', borderRadius: 14, border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(15,118,110,0.25)', letterSpacing: '0.01em' }}
          >
            {submitting ? 'Unlocking…' : 'Unlock free tool →'}
          </button>
        </form>
      </div>
    </div>
  );
}
