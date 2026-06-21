'use client';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

interface TrackedLinkProps {
  href: string;
  label: string;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export default function TrackedLink({ href, label, className, children, style }: TrackedLinkProps) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    window.gtag?.('event', 'cta_click', {
      cta_source: 'homepage',
      cta_destination: label,
      link_url: href,
      event_callback: () => { window.location.href = href; },
    });
    // Fallback in case event_callback never fires
    setTimeout(() => { window.location.href = href; }, 300);
  }

  return (
    <a href={href} className={className} style={style} onClick={handleClick}>
      {children}
    </a>
  );
}
