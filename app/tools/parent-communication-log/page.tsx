import type { Metadata } from 'next';
import ParentLogClient from './ParentLogClient';

export const metadata: Metadata = {
  title: 'Free Parent Communication Log for Teachers (Printable)',
  description:
    'A free printable parent communication log for teachers. Track every call, email, and note home, one page per week or one page per student. Print-ready, no sign-up required.',
  alternates: { canonical: 'https://getshorthandapp.com/tools/parent-communication-log' },
  openGraph: {
    title: 'Free Parent Communication Log for Teachers (Printable)',
    description:
      'Track every parent call, email, and note home. Free printable log, no sign-up required.',
    url: 'https://getshorthandapp.com/tools/parent-communication-log',
    type: 'website',
    images: [
      {
        url: 'https://getshorthandapp.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Free Parent Communication Log for Teachers',
      },
    ],
  },
};

export default function ParentLogPage() {
  return <ParentLogClient />;
}
