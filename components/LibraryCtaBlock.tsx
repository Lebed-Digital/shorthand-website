'use client';

import { fireCtaClick } from '../lib/gtag';

interface LibraryCtaBlockProps {
  sourceSlug: string;
  placement: string;
  totalCount: number;
  intro: string;
}

// Renders a visually distinct, non-heading CTA box inside a blog post body.
// Spliced into contentHtml via a marker string, same pattern as PdfGate.
export default function LibraryCtaBlock({ sourceSlug, placement, totalCount, intro }: LibraryCtaBlockProps) {
  function trackAndGo(destination: string, href: string) {
    return (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      fireCtaClick({
        cta_source: sourceSlug,
        cta_destination: destination,
        link_url: href,
        event_callback: () => { window.location.href = href; },
      });
      setTimeout(() => { window.location.href = href; }, 300);
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
          href="/report-card-comment-library"
          onClick={trackAndGo(placement, '/report-card-comment-library')}
          style={{ fontWeight: 700 }}
        >
          Report Card Comment Library
        </a>{' '}
        has {totalCount} comments organized by section and category, built to browse and copy. One-time $4.99.
      </p>
      <p style={{ margin: '0.6rem 0 0', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
        Just need one custom comment right now? The{' '}
        <a
          href="/report-card-comment-generator"
          onClick={trackAndGo(`${placement}-generator`, '/report-card-comment-generator')}
        >
          free generator
        </a>{' '}
        still does that, no payment needed.
      </p>
    </div>
  );
}
