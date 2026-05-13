import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { Space_Grotesk, Inter, Fredoka } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
});

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-fredoka',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://getshorthandapp.com'),
  title: 'ShortHand App — Behavior Tracking & Parent Communication for K-12 Teachers',
  description: 'ShortHand helps K-12 teachers log student behavior, generate AI progress reports, and send parent messages — built by a former RBT and classroom teacher, for teachers.',
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    siteName: 'ShortHand',
    title: 'ShortHand — K-12 Teacher Productivity App',
    description: 'Tap a student. Type a note. Done in 5 seconds. Classroom management, behavior tracking, AI reports, and parent communication — built by a teacher, for teachers.',
    url: 'https://getshorthandapp.com',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'ShortHand — Built by a teacher, for teachers.' }],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShortHand — K-12 Teacher Productivity App',
    description: 'Tap a student. Type a note. Done in 5 seconds. Built by a teacher, for teachers.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://getshorthandapp.com',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${fredoka.variable}`}>
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-Y954JF2V55"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-Y954JF2V55');
        `}} />
        {/* JSON-LD Schema — SoftwareApplication */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "ShortHand",
          "url": "https://getshorthandapp.com",
          "applicationCategory": "EducationApplication",
          "operatingSystem": "Web, iOS, Android",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "description": "ShortHand is a behavior tracking app that helps K-12 teachers generate AI progress reports, manage classroom data, and send parent communication in seconds.",
          "creator": {
            "@type": "Person",
            "name": "Gregory Lebed",
            "jobTitle": "3rd Grade Teacher & Former Registered Behavior Technician (RBT)"
          },
          "audience": {
            "@type": "EducationalAudience",
            "educationalRole": "teacher"
          }
        })}} />
        {/* JSON-LD Schema — Organization */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "ShortHand",
          "url": "https://getshorthandapp.com",
          "logo": "https://getshorthandapp.com/icon.png",
          "email": "gregorylebed@gmail.com",
          "sameAs": [
            "https://www.tiktok.com/@shorthandapp",
            "https://www.instagram.com/getshorthand_app/"
          ],
          "founder": {
            "@type": "Person",
            "name": "Gregory Lebed",
            "jobTitle": "3rd Grade Teacher & Former Registered Behavior Technician (RBT)"
          }
        })}} />
        {/* Metricool */}
        <script defer dangerouslySetInnerHTML={{ __html: `function loadScript(a){var b=document.getElementsByTagName("head")[0],c=document.createElement("script");c.type="text/javascript",c.src="https://tracker.metricool.com/resources/be.js",c.onreadystatechange=a,c.onload=a,b.appendChild(c)}loadScript(function(){beTracker.t({hash:"70e9d586aaa068ee70b5eb8c25ffa853"})});` }} />
      </head>
      <body>{children}<Analytics /></body>
    </html>
  );
}
