'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function OptionalEmailCapture({ source }: { source: string }) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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

    setSubmitted(true);
  }

  return (
    <div style={{ marginTop: 20, borderTop: '1px solid #e2e8f0', paddingTop: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
        Optional
      </div>
      {submitted ? (
        <p role="status" style={{ fontSize: 14, color: '#0f766e', margin: 0, lineHeight: 1.6 }}>
          You&apos;re on the list for future teacher tools and resources.
        </p>
      ) : (
        <>
          <p style={{ fontSize: 14, color: '#475569', margin: '0 0 12px', lineHeight: 1.6 }}>
            Want future teacher tools and resources by email? Leave your address here. Your letter is already ready to use.
          </p>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
              <label htmlFor="welcome-letter-email" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
                Email address
              </label>
              <input
                id="welcome-letter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@school.edu"
                autoComplete="email"
                required
                style={{ flex: 1, minWidth: 0, borderRadius: 10, border: '1.5px solid #e2e8f0', padding: '10px 12px', fontSize: 14, color: '#1e293b', outline: 'none', fontFamily: 'inherit' }}
                onFocus={(e) => (e.target.style.borderColor = '#0d9488')}
                onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
              />
              <button
                type="submit"
                disabled={submitting}
                style={{ flexShrink: 0, background: '#f8fafc', color: '#334155', fontWeight: 600, fontSize: 13, padding: '10px 14px', borderRadius: 10, border: '1.5px solid #cbd5e1', cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
              >
                {submitting ? 'Saving...' : 'Keep me posted'}
              </button>
            </div>
            {error && <p role="alert" style={{ color: '#ef4444', fontSize: 13, margin: '8px 0 0' }}>{error}</p>}
          </form>
        </>
      )}
    </div>
  );
}
