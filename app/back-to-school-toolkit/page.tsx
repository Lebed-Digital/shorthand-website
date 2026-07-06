import type { Metadata } from 'next';
import WelcomeLetterClient from './WelcomeLetterClient';

export const metadata: Metadata = {
  title: 'Free Welcome Letter Generator for Teachers | ShortHand',
  description: 'Generate a ready-to-send parent welcome letter in seconds. Enter your name, grade, and tone, get a personalized letter instantly. Free for teachers.',
  alternates: { canonical: 'https://getshorthandapp.com/back-to-school-toolkit' },
  openGraph: {
    title: 'Free Welcome Letter Generator for Teachers',
    description: 'Generate a ready-to-send parent welcome letter in seconds. Free for teachers.',
    url: 'https://getshorthandapp.com/back-to-school-toolkit',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'ShortHand Welcome Letter Generator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Welcome Letter Generator for Teachers',
    description: 'Generate a ready-to-send parent welcome letter in seconds. Free for teachers.',
    images: ['/og-image.png'],
  },
};

export default function BackToSchoolToolkitPage() {
  return <WelcomeLetterClient />;
}
