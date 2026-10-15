'use client';

import Link from 'next/link';
import TrackedLink from './TrackedLink';
import { fireCtaClick } from '../lib/gtag';

// Closing block for the free ChatGPT prompt pages. The free tools hub is the
// main next step; ShortHand is a quieter text link under it. Both fire GA4
// cta_click from the same cta_source, told apart by cta_destination
// ('tools_hub' vs 'app').
export default function FreeToolsCta({ ctaSource }: { ctaSource: string }) {
  return (
    <>
      <div style={{ background: 'rgba(13,148,136,0.15)', borderRadius: 16, padding: 24, marginTop: 40, border: '1px solid rgba(13,148,136,0.3)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Want more free classroom tools?</h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: '0 0 16px', lineHeight: 1.6 }}>
          A report card comment generator, a welcome letter generator, a printable parent communication log, and more
          ChatGPT prompts like this one.
        </p>
        <Link
          href="/tools"
          onClick={() => fireCtaClick({ cta_source: ctaSource, cta_destination: 'tools_hub' })}
          style={{ display: 'inline-block', background: 'linear-gradient(135deg, #0d9488, #0891b2)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '12px 28px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 4px 14px rgba(13,148,136,0.4)' }}
        >
          Explore more free teacher tools
        </Link>
      </div>

      <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', margin: '28px 0 0', lineHeight: 1.6 }}>
        Built by a teacher, for teachers. Looking for an easier way to keep classroom notes?{' '}
        <TrackedLink href="https://app.getshorthandapp.com?demo=true" label="app" ctaSource={ctaSource} style={{ color: '#2dd4bf', textDecoration: 'underline' }}>
          Try the ShortHand demo
        </TrackedLink>
      </p>
    </>
  );
}
