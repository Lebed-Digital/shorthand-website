import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works — ShortHand',
  description: 'See how ShortHand helps K-12 teachers log student notes in under 5 seconds, generate AI reports, and communicate with parents, all from any device.',
  openGraph: {
    title: 'How It Works — ShortHand',
    description: 'See how ShortHand helps K-12 teachers log student notes in under 5 seconds, generate AI reports, and communicate with parents, all from any device.',
    url: 'https://getshorthandapp.com/how-it-works',
    type: 'website',
  },
  alternates: { canonical: 'https://getshorthandapp.com/how-it-works' },
};

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
