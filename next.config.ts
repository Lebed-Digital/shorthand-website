import type { NextConfig } from "next";

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/blog/5-behavior-management-apps-for-teachers',
        destination: '/blog/best-behavior-management-apps-for-teachers-2026',
        permanent: true,
      },
      {
        source: '/blog/how-to-write-honest-behavior-comments',
        destination: '/blog/report-card-comments-for-behavior',
        permanent: true,
      },
      {
        source: '/blog/how-to-write-behavior-comments-on-report-card',
        destination: '/blog/report-card-comments-for-behavior',
        permanent: true,
      },
      {
        source: '/blog/behavior-comments-for-report-cards',
        destination: '/blog/report-card-comments-for-behavior',
        permanent: true,
      },
      {
        source: '/blog/report-card-comments-for-students-with-behavior-problems',
        destination: '/blog/report-card-comments-for-behavior',
        permanent: true,
      },
      {
        source: '/blog/classroom-behavior-tracking-apps',
        destination: '/blog/best-behavior-tracking-apps-for-teachers-2026',
        permanent: true,
      },
      {
        source: '/free-tool',
        destination: '/report-card-comment-generator',
        permanent: true,
      },
      {
        source: '/blog/what-teachers-mean-vs-what-parents-hear',
        destination: '/blog/turn-behavior-notes-into-parent-messages',
        permanent: true,
      },
      {
        source: '/features/attendance',
        destination: '/',
        permanent: true,
      },
      {
        source: '/ig',
        destination: 'https://app.getshorthandapp.com?demo=true&utm_source=instagram&utm_medium=organic_social&utm_campaign=guided_demo',
        permanent: false,
      },
      {
        source: '/tt',
        destination: 'https://app.getshorthandapp.com?demo=true&utm_source=tiktok&utm_medium=organic_social&utm_campaign=guided_demo',
        permanent: false,
      },
      {
        source: '/yt',
        destination: 'https://app.getshorthandapp.com?demo=true&utm_source=youtube&utm_medium=organic_social&utm_campaign=guided_demo',
        permanent: false,
      },
      {
        source: '/fb',
        destination: 'https://app.getshorthandapp.com?demo=true&utm_source=facebook&utm_medium=organic_social&utm_campaign=guided_demo',
        permanent: false,
      },
      {
        source: '/how-it-works',
        destination: '/',
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      { source: '/(.*)', headers: securityHeaders },
    ];
  },
};

export default nextConfig;
