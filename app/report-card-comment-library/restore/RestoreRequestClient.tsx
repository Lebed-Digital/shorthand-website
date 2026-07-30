'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Restore-request form.
//
// Submits an email to /api/report-card-access/restore, which relays it to the
// Edge Function that decides whether to send a link. This component never
// learns whether the address bought anything, and must never appear to: the
// submitted state is a single fixed message shown for every outcome except a
// rate-limit block and locally-invalid input.
//
// That means a network failure and a successful send look identical to the
// user. This is deliberate. Any "something went wrong" state that could only
// occur for real customers would turn the form into a purchase oracle.

type Status = 'idle' | 'submitting' | 'submitted' | 'limited';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 320;

export default function RestoreRequestClient() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [invalid, setInvalid] = useState(false);

  const submitting = status === 'submitting';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    const trimmed = email.trim();
    // Checked here purely so honest typos get an instant, quiet correction
    // instead of a round trip. The route re-validates identically; this is not
    // a security boundary.
    if (trimmed.length === 0 || trimmed.length > MAX_EMAIL_LENGTH || !EMAIL_RE.test(trimmed)) {
      setInvalid(true);
      return;
    }

    setInvalid(false);
    setStatus('submitting');

    try {
      const res = await fetch('/api/report-card-access/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });

      if (res.status === 429) {
        setStatus('limited');
        return;
      }

      // Every other outcome, including a 400 or a 500, lands on the same
      // terminal message. A well-formed address cannot produce a 400 (the
      // route's validation matches the check above), so nothing is being
      // hidden from the user that would help them.
      setStatus('submitted');
    } catch {
      setStatus('submitted');
    }
  }

  if (status === 'submitted') {
    return (
      <div style={cardStyle}>
        <h1 style={headingStyle}>Check your inbox</h1>
        <p style={bodyStyle} role="status">
          If that address was used to buy the library, a link is on its way. It expires in 30
          minutes, so open it soon. If nothing arrives within a few minutes, check your spam
          folder.
        </p>
        <p style={bodyStyle}>
          Still stuck? Email{' '}
          <a href="mailto:info@getshorthandapp.com" style={linkStyle}>
            info@getshorthandapp.com
          </a>{' '}
          with the address you used at checkout and we will restore it for you.
        </p>
        <Link href="/report-card-comment-library" style={backLinkStyle}>
          Back to the library
        </Link>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <h1 style={headingStyle}>Restore your access</h1>
      <p style={bodyStyle}>
        Enter the email address you used at checkout and we will send you a link that reopens the
        library.
      </p>

      <form onSubmit={handleSubmit} noValidate style={{ textAlign: 'left' }}>
        <label htmlFor="restore-email" style={labelStyle}>
          Email address
        </label>
        <input
          id="restore-email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (invalid) setInvalid(false);
          }}
          disabled={submitting}
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          maxLength={MAX_EMAIL_LENGTH}
          placeholder="you@school.edu"
          aria-invalid={invalid}
          aria-describedby={invalid ? 'restore-email-error' : undefined}
          style={inputStyle(invalid, submitting)}
        />
        {invalid && (
          <p id="restore-email-error" role="alert" style={errorStyle}>
            Please enter a valid email address.
          </p>
        )}

        <button type="submit" disabled={submitting} style={buttonStyle(submitting)}>
          {submitting ? 'Sending...' : 'Email me a link'}
        </button>
      </form>

      {status === 'limited' && (
        <p style={{ ...errorStyle, textAlign: 'center' }} role="alert">
          Too many requests from this connection. Please try again in a little while.
        </p>
      )}

      <p style={{ ...bodyStyle, fontSize: 13, margin: '18px 0 0' }}>
        Prefer to ask a human? Email{' '}
        <a href="mailto:info@getshorthandapp.com" style={linkStyle}>
          info@getshorthandapp.com
        </a>{' '}
        with the address you used at checkout.
      </p>

      <Link href="/report-card-comment-library" style={backLinkStyle}>
        Back to the library
      </Link>
    </div>
  );
}

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
  margin: '0 0 18px',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#334155',
  margin: '0 0 6px',
};

function inputStyle(invalid: boolean, disabled: boolean): React.CSSProperties {
  return {
    width: '100%',
    fontSize: 15,
    fontFamily: 'inherit',
    color: '#0f172a',
    background: disabled ? '#f8fafc' : '#fff',
    padding: '11px 12px',
    borderRadius: 10,
    border: `1px solid ${invalid ? '#dc2626' : '#cbd5e1'}`,
    boxSizing: 'border-box',
  };
}

function buttonStyle(disabled: boolean): React.CSSProperties {
  return {
    width: '100%',
    background: disabled ? '#94a3b8' : 'linear-gradient(135deg, #0d9488, #0891b2)',
    color: '#fff',
    fontWeight: 700,
    fontSize: 15,
    padding: '13px',
    borderRadius: 12,
    border: 'none',
    cursor: disabled ? 'default' : 'pointer',
    fontFamily: 'inherit',
    marginTop: 14,
  };
}

const errorStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#dc2626',
  margin: '8px 0 0',
};

const linkStyle: React.CSSProperties = {
  color: '#0d9488',
  fontWeight: 600,
};

const backLinkStyle: React.CSSProperties = {
  display: 'inline-block',
  color: '#64748b',
  fontSize: 13,
  fontWeight: 600,
  textDecoration: 'none',
  marginTop: 18,
};
