'use client';
import { fireCtaClick } from '../lib/gtag';

// The homepage nav's Sign in link. A plain link, as on the previous homepage,
// so Ctrl/Cmd-click still opens a new tab (TrackedLink would cancel it).
// Sends the GA4 nav_sign_in click without holding up navigation.
export default function SignInLink() {
  const href = 'https://app.getshorthandapp.com';
  return <a href={href} onClick={() => fireCtaClick({ cta_source: 'homepage', cta_destination: 'nav_sign_in', link_url: href })}>Sign in ↗</a>;
}
