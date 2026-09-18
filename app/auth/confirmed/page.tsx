import type { Metadata } from 'next';
import ConfirmationClient from './ConfirmationClient';

export const metadata: Metadata = {
  title: 'Email verified | ShortHand',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function ConfirmedPage() {
  return <ConfirmationClient />;
}
