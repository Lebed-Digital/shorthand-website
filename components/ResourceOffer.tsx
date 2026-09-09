'use client';

import React, { useId, useState } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Direct-download resource offer. No email is ever required to get the file.
 *
 * This is the ungated counterpart to PdfGate, matching the "No sign-up required"
 * promise already made on /resources and the OptionalEmailCapture pattern proven
 * on /report-card-comment-generator (PR #75). The email field only appears after
 * the download has already been started, and skipping it costs the reader nothing.
 *
 * Every download fires `resource_download` with the source page and asset, so
 * article/resource pairings can be compared against each other in GA4 rather
 * than collapsing into one undifferentiated file_download total.
 */
export default function ResourceOffer({
  source,
  href,
  linkText,
  blurb,
  buttonLabel = 'Download the free PDF',
}: {
  /** Stable per-placement id, e.g. 'positive-email-post'. Sent to GA4 and Supabase. */
  source: string;
  href: string;
  linkText: string;
  /** One line on what the file is, specific to the page it sits on. */
  blurb: string;
  buttonLabel?: string;
}) {
  const [downloaded, setDownloaded] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const inputId = useId();

  function handleDownload() {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'resource_download', {
        resource_source: source,
        resource_asset: href,
        resource_page: window.location.pathname,
      });
    }
    setDownloaded(true);
  }

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

    // 23505 is a duplicate address, which is a success from the reader's side.
    if (insertError && insertError.code !== '23505') {
      setError('Something went wrong. Please try again.');
      return;
    }

    setSubmitted(true);
  }

  return (
    <div
      style={{
        margin: '1.75rem 0',
        padding: '20px 22px',
        borderRadius: 14,
        border: '1.5px solid #e2e8f0',
        background: '#f8fafc',
      }}
    >
      <p style={{ fontSize: 15, color: '#334155', margin: '0 0 14px', lineHeight: 1.6 }}>{blurb}</p>

      <a
        href={href}
        download
        onClick={handleDownload}
        style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #0d9488, #0891b2)',
          color: '#fff',
          fontWeight: 700,
          fontSize: 14,
          padding: '11px 20px',
          borderRadius: 10,
          textDecoration: 'none',
        }}
      >
        {buttonLabel} &rarr;
      </a>

      <p style={{ fontSize: 13, color: '#64748b', margin: '10px 0 0' }}>
        {linkText}. No sign-up required.
      </p>

      {downloaded && (
        <div style={{ marginTop: 18, borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 8,
            }}
          >
            Optional
          </div>
          {submitted ? (
            <p role="status" style={{ fontSize: 14, color: '#0f766e', margin: 0, lineHeight: 1.6 }}>
              You&apos;re on the list for future teacher tools and resources.
            </p>
          ) : (
            <>
              <p style={{ fontSize: 14, color: '#475569', margin: '0 0 12px', lineHeight: 1.6 }}>
                Want future teacher resources by email? Leave your address here. Your download has
                already started.
              </p>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
                  <label
                    htmlFor={inputId}
                    style={{
                      position: 'absolute',
                      width: 1,
                      height: 1,
                      padding: 0,
                      margin: -1,
                      overflow: 'hidden',
                      clip: 'rect(0, 0, 0, 0)',
                      whiteSpace: 'nowrap',
                      border: 0,
                    }}
                  >
                    Email address
                  </label>
                  <input
                    id={inputId}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@school.edu"
                    autoComplete="email"
                    required
                    style={{
                      flex: 1,
                      minWidth: 0,
                      borderRadius: 10,
                      border: '1.5px solid #e2e8f0',
                      padding: '10px 12px',
                      fontSize: 14,
                      color: '#1e293b',
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      flexShrink: 0,
                      background: '#f8fafc',
                      color: '#334155',
                      fontWeight: 600,
                      fontSize: 13,
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1.5px solid #cbd5e1',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {submitting ? 'Saving...' : 'Keep me posted'}
                  </button>
                </div>
                {error && (
                  <p role="alert" style={{ color: '#ef4444', fontSize: 13, margin: '8px 0 0' }}>
                    {error}
                  </p>
                )}
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
