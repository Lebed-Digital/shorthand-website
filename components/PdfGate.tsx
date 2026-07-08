'use client';

import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function PdfGate({
  source,
  href,
  linkText,
}: {
  source: string;
  href: string;
  linkText: string;
}) {
  const [unlocked, setUnlocked] = useState(false);
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

    setUnlocked(true);
  }

  if (unlocked) {
    return (
      <p>
        <a href={href}>{linkText}</a>
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ margin: '1.5rem 0', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 8 }}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@school.edu"
        required
        style={{ borderRadius: 10, border: '1.5px solid #e2e8f0', padding: '10px 12px', fontSize: 14, color: '#1e293b' }}
      />
      <button
        type="submit"
        disabled={submitting}
        style={{ background: submitting ? '#5eead4' : 'linear-gradient(135deg, #0d9488, #0891b2)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '10px 18px', borderRadius: 10, border: 'none', cursor: submitting ? 'not-allowed' : 'pointer' }}
      >
        {submitting ? 'Unlocking…' : 'Get the free PDF →'}
      </button>
      {error && <p style={{ color: '#ef4444', fontSize: 13, width: '100%', margin: 0 }}>{error}</p>}
    </form>
  );
}
