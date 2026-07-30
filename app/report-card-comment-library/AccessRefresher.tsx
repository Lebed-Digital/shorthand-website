'use client';

import { useEffect } from 'react';

// Fires once after the gated page renders, to persist a token the server-side
// gate already decided on.
//
// Why this exists: Next.js Server Components cannot set cookies during render,
// so the page can grant access but cannot write the refreshed cookie itself.
// This component pings a Route Handler that re-runs the same gate and writes
// the result.
//
// It carries no payload and no authority. The route ignores the request body
// entirely and re-derives everything from the incoming cookie, so this is a
// "flush the decision to the cookie jar" nudge, not a client-supplied claim.
// If it never runs (JS disabled, request fails), the only consequence is that
// revalidation happens again on the next render.

export default function AccessRefresher() {
  useEffect(() => {
    fetch('/api/report-card-access/refresh', { method: 'POST' }).catch(() => {
      // Non-fatal: the gate simply revalidates again next render.
    });
  }, []);

  return null;
}
