import type { Metadata } from 'next';
import LibraryClient from './LibraryClient';
import PaywallClient from './PaywallClient';
import AccessRefresher from './AccessRefresher';
import RestoreSuccessAnalytics from './RestoreSuccessAnalytics';
import { evaluateAccess } from '@/lib/report-card-gate';
import { getFreeSliceData, getFullLibrary } from '@/lib/report-card-teaser';

// Link-preview metadata only. Without it this page inherits the homepage's
// title, description, og:url and canonical from app/layout.tsx, so a link to
// the library shared on social previews as the ShortHand homepage. Still
// noindex: whether this page should be indexed is a separate decision.
const LIBRARY_URL = 'https://getshorthandapp.com/report-card-comment-library';
const LIBRARY_TITLE = 'Report Card Comment Library | ShortHand';
const LIBRARY_DESCRIPTION =
  "Ready-to-use report card comments for Pre-K through grade 5. Type a student's name once, search or filter, and copy. Try a free sample with no sign-up. The full library is a one-time $4.99.";

export const metadata: Metadata = {
  title: LIBRARY_TITLE,
  description: LIBRARY_DESCRIPTION,
  alternates: { canonical: LIBRARY_URL },
  openGraph: {
    title: LIBRARY_TITLE,
    description: LIBRARY_DESCRIPTION,
    url: LIBRARY_URL,
    type: 'website',
    images: [
      {
        url: 'https://getshorthandapp.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Report Card Comment Library from ShortHand',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: LIBRARY_TITLE,
    description: LIBRARY_DESCRIPTION,
    images: ['https://getshorthandapp.com/og-image.png'],
  },
  robots: { index: false, follow: false },
};

// Reads cookies, so it must render per request. Never cache: a cached paid
// render served to an unauthenticated visitor would hand over the full dataset.
export const dynamic = 'force-dynamic';

export default async function ReportCardCommentLibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ restored?: string }>;
}) {
  const [decision, { restored }] = await Promise.all([evaluateAccess(), searchParams]);

  if (!decision.access) {
    // Only the free-slice payload crosses to the client here. The full library
    // is never read on this branch, so it cannot appear in the RSC payload.
    //
    // When the gate rejected an existing cookie (expired, tampered, or a
    // purchase that came back not_paid), also ping the refresh route so the
    // dead cookie is actually removed from the browser. Without this the
    // paywall would render correctly but the stale cookie would linger and
    // every later page load would repeat the Edge Function round trip.
    return (
      <>
        {decision.clearCookie ? <AccessRefresher /> : null}
        <PaywallClient slice={getFreeSliceData()} />
      </>
    );
  }

  return (
    <>
      {/* Persists a refreshed token, or clears a revoked one, via a Route
          Handler. Rendered whenever the gate touched revalidation. */}
      {decision.freshToken ? <AccessRefresher /> : null}
      {/* Only on the granted branch, so ?restored=1 cannot report a success
          for someone who does not actually have access. */}
      {restored === '1' ? <RestoreSuccessAnalytics /> : null}
      <LibraryClient comments={getFullLibrary()} />
    </>
  );
}
