declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function fireCtaClick(params: {
  cta_source: string;
  cta_destination: string;
  link_url?: string;
  event_callback?: () => void;
}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', 'cta_click', {
    ...params,
    cta_page: window.location.pathname,
  });
}
