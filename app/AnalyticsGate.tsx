'use client';

import { Analytics } from '@vercel/analytics/react';
import { usePathname } from 'next/navigation';

export default function AnalyticsGate() {
  const pathname = usePathname();
  return pathname === '/auth/confirmed' ? null : <Analytics />;
}
