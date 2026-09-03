'use client';

import { fireCtaClick } from '../lib/gtag';
import { withAttribution } from '../lib/attribution';

interface TrackedLinkProps {
  href: string;
  label: string;
  ctaSource?: string;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export default function TrackedLink({ href, label, ctaSource = 'homepage', className, children, style }: TrackedLinkProps) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const destination = withAttribution(href, window.location.pathname, window.location.search);
    fireCtaClick({
      cta_source: ctaSource,
      cta_destination: label,
      link_url: destination,
      event_callback: () => { window.location.href = destination; },
    });
    // Fallback in case event_callback never fires
    setTimeout(() => { window.location.href = destination; }, 300);
  }

  return (
    <a href={href} className={className} style={style} onClick={handleClick}>
      {children}
    </a>
  );
}
