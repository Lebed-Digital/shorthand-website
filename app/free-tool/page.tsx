import type { Metadata } from 'next';
import FreeToolClient from './FreeToolClient';

export const metadata: Metadata = {
  title: 'Free Report Card Comment Generator for Teachers',
  description:
    'Generate polished report card comments in 10 seconds. Pick strengths, struggles, and behavior, and get a personalized comment instantly. Free, no sign-up required.',
  alternates: { canonical: 'https://getshorthandapp.com/free-tool' },
  openGraph: {
    title: 'Free Report Card Comment Generator for Teachers',
    description:
      'Generate polished report card comments in 10 seconds. Free, no sign-up required.',
    url: 'https://getshorthandapp.com/free-tool',
    type: 'website',
    images: [
      {
        url: 'https://getshorthandapp.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ShortHand Report Card Comment Generator',
      },
    ],
  },
};

export default function FreeToolPage() {
  return <FreeToolClient />;
}
