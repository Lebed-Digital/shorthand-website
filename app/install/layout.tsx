import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Install ShortHand — Join the Beta',
  description: 'Install ShortHand on any device in seconds. No app store needed. Join the free beta and start logging student behavior, generating AI reports, and saving hours every week.',
  openGraph: {
    title: 'Install ShortHand — Join the Beta',
    description: 'Install ShortHand on any device in seconds. No app store needed. Join the free beta and start logging student behavior, generating AI reports, and saving hours every week.',
    url: 'https://getshorthandapp.com/install',
    type: 'website',
  },
  alternates: { canonical: 'https://getshorthandapp.com/install' },
};

export default function InstallLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
