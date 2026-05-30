import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Set Up ShortHand in 2 Minutes: Free for Teachers',
  description: 'Add ShortHand to your home screen in 2 minutes. No app store, no IT ticket. Free behavior tracking, AI parent notes, and documentation for teachers.',
  openGraph: {
    title: 'Set Up ShortHand in 2 Minutes: Free for Teachers',
    description: 'Add ShortHand to your home screen in 2 minutes. No app store, no IT ticket. Free behavior tracking, AI parent notes, and documentation for teachers.',
    url: 'https://getshorthandapp.com/install',
    type: 'website',
  },
  alternates: { canonical: 'https://getshorthandapp.com/install' },
};

export default function InstallLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
