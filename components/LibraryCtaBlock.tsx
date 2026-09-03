'use client';

import { fireCtaClick } from '../lib/gtag';
import { withAttribution } from '../lib/attribution';

interface LibraryCtaBlockProps {
  sourceSlug: string;
  placement: string;
  totalCount: number;
  intro: string;
}

const LIBRARY_HREF = '/report-card-comment-library';

// Renders a visually distinct, non-heading CTA box inside a blog post body.
// Spliced into contentHtml via a marker string, same pattern as PdfGate.
//
// Copy positioning (changed 2026-08-20): the offer leads with speed and
// findability, not library size. The previous version led with the comment
// count and closed with a free-generator off-ramp; it ran at roughly a 0.6%
// click rate with no sales. The count stays as supporting proof only, and the
// off-ramp is gone from inside the paid block (the free generator itself is
// untouched and still linked elsewhere on the site).
//
// Every capability named below is real in LibraryClient.tsx: keyword search
// across all comments, section tabs, category dropdown, tone (Positive /
// Growth), grade band, one-click copy, and name personalization.
export default function LibraryCtaBlock({ sourceSlug, placement, totalCount, intro }: LibraryCtaBlockProps) {
  function trackAndGo(destination: string, href: string) {
    return (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const target = withAttribution(href, window.location.pathname, window.location.search);
      fireCtaClick({
        cta_source: sourceSlug,
        cta_destination: destination,
        link_url: target,
        event_callback: () => { window.location.href = target; },
      });
      setTimeout(() => { window.location.href = target; }, 300);
    };
  }

  return (
    <div
      style={{
        margin: '2rem 0',
        padding: '1.5rem 1.75rem',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '14px',
      }}
    >
      <p style={{ margin: 0, lineHeight: 1.6 }}>
        {intro} The{' '}
        <a
          href={LIBRARY_HREF}
          onClick={trackAndGo(placement, LIBRARY_HREF)}
          style={{ fontWeight: 700 }}
        >
          Report Card Comment Library
        </a>{' '}
        is built to get you to the right comment in seconds instead of scrolling a long list. Search
        every comment by keyword, or filter by section, category, tone, and grade band to quickly find
        one that fits the student you&rsquo;re writing about.
      </p>
      <p style={{ margin: '0.6rem 0 0', lineHeight: 1.6 }}>
        Type the student&rsquo;s name once and it drops into every comment. Copy the one that fits,
        then move to the next student.
      </p>
      <p style={{ margin: '1rem 0 0' }}>
        <a
          href={LIBRARY_HREF}
          onClick={trackAndGo(`${placement}-button`, LIBRARY_HREF)}
          style={{
            display: 'inline-block',
            padding: '0.7rem 1.25rem',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0d9488, #0891b2)',
            color: '#fff',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          Find your comments faster
        </a>
      </p>
      <p style={{ margin: '0.6rem 0 0', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
        {totalCount} comments, organized by section and category. One-time $4.99, no subscription.
      </p>
    </div>
  );
}
