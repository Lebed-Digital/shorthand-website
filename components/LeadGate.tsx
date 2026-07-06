'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

function storageKey(source: string) {
  return `shorthand_lead_unlocked_${source}`;
}

export default function LeadGate({
  source,
  children,
}: {
  source: string;
  children: React.ReactNode;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [checkedStorage, setCheckedStorage] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const alreadyUnlocked = window.localStorage.getItem(storageKey(source)) === 'true';
    setUnlocked(alreadyUnlocked);
    setCheckedStorage(true);
  }, [source]);

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
    setUnlocked(true);
  }

  if (!checkedStorage) return null;
  if (unlocked) return <>{children}</>;

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 420, width: '100%', background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 1px 3px rgba(0,0,0,0.3)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
          Get instant access
        </h2>
        <p style={{ fontSize: 14, color: '#475569', margin: '0 0 24px', lineHeight: 1.6 }}>
          Enter your email to unlock this free tool. We occasionally send new free teacher resources. Unsubscribe anytime.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@school.edu"
            required
            style={{ width: '100%', borderRadius: 10, border: '1.5px solid #e2e8f0', padding: '12px 14px', fontSize: 14, color: '#1e293b', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 12 }}
            onFocus={(e) => (e.target.style.borderColor = '#0d9488')}
            onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
          />
          {error && <p style={{ color: '#ef4444', fontSize: 13, margin: '0 0 12px' }}>{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            style={{ width: '100%', background: submitting ? '#5eead4' : 'linear-gradient(135deg, #0d9488, #0891b2)', color: '#fff', fontWeight: 700, fontSize: 15, padding: '14px', borderRadius: 14, border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(13,148,136,0.4)', letterSpacing: '0.01em' }}
          >
            {submitting ? 'Unlocking…' : 'Unlock free tool →'}
          </button>
        </form>
      </div>
    </div>
  );
}
