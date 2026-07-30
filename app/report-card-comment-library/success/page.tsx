import type { Metadata } from 'next';
import SuccessClient from './SuccessClient';

export const metadata: Metadata = {
  title: 'Purchase confirmed',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function ReportCardCheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const raw = params.session_id;
  const sessionId = typeof raw === 'string' && raw.length > 0 && raw.length <= 200 ? raw : null;

  return <SuccessClient sessionId={sessionId} />;
}
