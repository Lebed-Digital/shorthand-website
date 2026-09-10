'use client';

import { useEffect, useRef } from 'react';
import { fireRestoreSuccess } from '../../lib/gtag';

// Fires restore_purchase_success once, when the library was reached by
// following a restore link (restore-confirm redirects here with ?restored=1).
//
// Why a marker instead of firing from the confirm route: that route is a Route
// Handler that returns a 303 with the access cookie attached. No client code
// runs there, so it cannot call gtag. The query flag is the only thing that
// survives the redirect into a context where analytics can run.
//
// The flag is not an entitlement. The page above only renders this component
// on the branch where the server-side gate ALREADY granted access from the
// cookie, so someone hand-typing ?restored=1 while logged out sees the paywall
// and fires nothing. Worst case for a paying visitor who bookmarks the flagged
// URL is one extra restore_purchase_success, which is why the flag is stripped
// from the address bar below.
export default function RestoreSuccessAnalytics() {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    fireRestoreSuccess();

    // Drop the marker from the URL so a refresh or a bookmark does not count a
    // second restore. replaceState does not re-render or re-request the page.
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('restored');
      window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    } catch {
      // Cosmetic only; the ref guard already prevents a double fire this load.
    }
  }, []);

  return null;
}
