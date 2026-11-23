import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Set Up ShortHand in 2 Minutes: Free for Teachers',
  description: 'Get ShortHand from the App Store or Google Play, or add it to your home screen from the browser. Free behavior tracking, AI parent notes, and documentation for teachers.',
  openGraph: {
    title: 'Set Up ShortHand in 2 Minutes: Free for Teachers',
    description: 'Get ShortHand from the App Store or Google Play, or add it to your home screen from the browser. Free behavior tracking, AI parent notes, and documentation for teachers.',
    url: 'https://getshorthandapp.com/install',
    type: 'website',
    images: [{ url: 'https://getshorthandapp.com/og-image-v2.png', width: 1200, height: 630, alt: 'ShortHand: Built by a teacher, for teachers.' }],
  },
  alternates: { canonical: 'https://getshorthandapp.com/install' },
};

export default function InstallLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
