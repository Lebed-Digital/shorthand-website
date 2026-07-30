import type { Metadata } from 'next';
import LibraryClient from './LibraryClient';
import PaywallClient from './PaywallClient';
import AccessRefresher from './AccessRefresher';
import { evaluateAccess } from '@/lib/report-card-gate';
import { getFullLibrary, getTeaserData } from '@/lib/report-card-teaser';

export const metadata: Metadata = {
  title: 'Report Card Comment Library',
  robots: { index: false, follow: false },
};

// Reads cookies, so it must render per request. Never cache: a cached paid
// render served to an unauthenticated visitor would hand over the full dataset.
export const dynamic = 'force-dynamic';

export default async function ReportCardCommentLibraryPage() {
  const decision = await evaluateAccess();

  if (!decision.access) {
    // Only the teaser payload crosses to the client here. The full library is
    // never read on this branch, so it cannot appear in the RSC payload.
    //
    // When the gate rejected an existing cookie (expired, tampered, or a
    // purchase that came back not_paid), also ping the refresh route so the
    // dead cookie is actually removed from the browser. Without this the
    // paywall would render correctly but the stale cookie would linger and
    // every later page load would repeat the Edge Function round trip.
    return (
      <>
        {decision.clearCookie ? <AccessRefresher /> : null}
        <PaywallClient teaser={getTeaserData()} />
      </>
    );
  }

  return (
    <>
      {/* Persists a refreshed token, or clears a revoked one, via a Route
          Handler. Rendered whenever the gate touched revalidation. */}
      {decision.freshToken ? <AccessRefresher /> : null}
      <LibraryClient comments={getFullLibrary()} />
    </>
  );
}
