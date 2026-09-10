'use client';

import { useEffect, useRef } from 'react';
import { fireRestoreFailure } from '../../../../lib/gtag';

// Fires restore_purchase_failure once per mount.
//
// This page is a Server Component (it must be, it reads searchParams and
// renders no interactivity), and the restore-confirm route that lands here is
// a Route Handler issuing a 303, so neither can call gtag. This tiny client
// component is the only way to record the outcome.
//
// It reports ONLY the coarse bucket already present in the URL: 'busy'
// (transient) or 'link' (definitive). The server deliberately collapses every
// internal reason into those two before redirecting, which is what keeps the
// page from being usable to probe whether a purchase exists. Nothing finer is
// available here, and nothing finer should be.
//
// The ref guard makes React StrictMode's double-effect in development emit one
// event rather than two.
export default function RestoreFailureAnalytics({ reason }: { reason: 'busy' | 'link' }) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    fireRestoreFailure(reason);
  }, [reason]);

  return null;
}
