'use client';

import { fireCtaClick } from '../lib/gtag';
import { withAttribution } from '../lib/attribution';

interface TrackedBlogContentProps {
  html: string;
  className?: string;
}

// Delegated click tracking for in-body blog links opted in via
// data-cta-source/data-cta-destination (set in posts/*.md as raw HTML
// anchors). Scoped to one listener per contentHtml chunk so untouched posts
// and links are completely unaffected: a plain markdown `[text](url)` has
// neither attribute and this handler no-ops for it.
export default function TrackedBlogContent({ html, className }: TrackedBlogContentProps) {
  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const anchor = (e.target as HTMLElement).closest('a[data-cta-source]');
    if (!anchor || !(anchor instanceof HTMLAnchorElement)) return;

    const ctaSource = anchor.dataset.ctaSource;
    const ctaDestination = anchor.dataset.ctaDestination;
    if (!ctaSource || !ctaDestination) return;

    e.preventDefault();
    const destination = withAttribution(anchor.href, window.location.pathname, window.location.search);
    fireCtaClick({
      cta_source: ctaSource,
      cta_destination: ctaDestination,
      link_url: destination,
      event_callback: () => { window.location.href = destination; },
    });
    setTimeout(() => { window.location.href = destination; }, 300);
  }

  return (
    <div className={className} onClick={handleClick} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
