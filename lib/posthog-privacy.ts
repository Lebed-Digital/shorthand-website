// Privacy rules for PostHog on the public website. Pure functions with no
// imports and no DOM access, so they run under `node --test` (see
// posthog-privacy.test.ts) and instrumentation-client.ts stays thin wiring.

export const PRODUCTION_HOSTNAME = 'getshorthandapp.com';

// The same gate GA4 uses in app/layout.tsx (production hostname, never on
// /auth/confirmed, never in an automated browser, never with the sh_dev flag),
// plus one more: no project token configured means no PostHog at all.
export function shouldInitPostHog(env: {
  token: string | undefined;
  hostname: string;
  pathname: string;
  webdriver: boolean;
  devFlag: string | null;
}): boolean {
  return (
    Boolean(env.token) &&
    env.hostname === PRODUCTION_HOSTNAME &&
    env.pathname !== '/auth/confirmed' &&
    !env.webdriver &&
    env.devFlag !== '1'
  );
}

// Pages where a teacher may type a student name or other details. Session
// Replay masks ALL on-screen text here, not just form fields, because typed
// data can come back as ordinary text: the comment library substitutes the
// typed student name into every comment it renders.
//
// `/tools` is a prefix on purpose, so a tool added under it later is masked
// without anyone remembering to list it. A new tool at a top-level path must
// be added here (and get the `ph-mask` class on its root element).
const SENSITIVE_PATH_PREFIXES = [
  '/report-card-comment-library',
  '/report-card-comment-generator',
  '/back-to-school-toolkit',
  '/tools',
];

export function isSensitivePath(pathname: string): boolean {
  return SENSITIVE_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

// Replaces every visible character and keeps whitespace, so a masked replay
// still shows where text sits on the page.
export function maskText(text: string): string {
  return text.replace(/\S/g, '*');
}

// Query parameters PostHog is allowed to see. Everything else is dropped, and
// so is the #fragment. This is an allowlist, not a blocklist, so a secret that
// lands in a URL later is removed without a code change. Known secrets today:
// the Stripe `session_id` on /report-card-comment-library/success, and the
// signup fragment on /auth/confirmed.
const ALLOWED_QUERY_PARAMS = new Set(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']);

export function sanitizeUrl(raw: string): string {
  const cut = raw.search(/[?#]/);
  if (cut === -1) return raw;
  const base = raw.slice(0, cut);
  const query = raw.slice(cut).split('#')[0].replace(/^\?/, '');
  const kept = query.split('&').filter((pair) => ALLOWED_QUERY_PARAMS.has(pair.split('=')[0]));
  return kept.length > 0 ? `${base}?${kept.join('&')}` : base;
}

// Only values that are clearly URLs or paths are rewritten. A page title such
// as "What is PBIS? | ShortHand" contains a "?" but must be left alone.
const LOOKS_LIKE_URL = /^(https?:\/\/|\/)/;

function sanitizeUrlValues(bag: Record<string, unknown> | undefined): void {
  if (!bag) return;
  for (const key of Object.keys(bag)) {
    const value = bag[key];
    if (typeof value === 'string' && LOOKS_LIKE_URL.test(value)) bag[key] = sanitizeUrl(value);
  }
}

// PostHog attaches the page URL to events under several names ($current_url,
// $referrer, $session_entry_url, $initial_referrer, and more). The referrer
// matters as much as the current URL: the purchase success page does a full
// page load into the library, so the library's referrer is the success URL
// with the Stripe session id still on it. Rather than list property names,
// every URL-shaped value on the event is sanitized.
export function sanitizeEventUrls<
  T extends {
    properties?: Record<string, unknown>;
    $set?: Record<string, unknown>;
    $set_once?: Record<string, unknown>;
  },
>(event: T): T {
  sanitizeUrlValues(event.properties);
  sanitizeUrlValues(event.$set);
  sanitizeUrlValues(event.$set_once);
  return event;
}
