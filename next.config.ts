import type { NextConfig } from "next";

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: '/(.*)', headers: securityHeaders },
    ];
  },
  async redirects() {
    return [
      {
        source: '/blog/5-behavior-management-apps-for-teachers',
        destination: '/blog/best-behavior-management-apps-for-teachers-2026',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
