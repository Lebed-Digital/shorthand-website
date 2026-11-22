// Pure IndexNow helpers used by scripts/indexnow.mjs. No network here, so it is testable.

export const SITE = 'https://getshorthandapp.com';
export const KEY_FILE_RE = /^[a-f0-9]{32}\.txt$/;

const REDIRECT = new Set([301, 302, 303, 307, 308]);
const GONE = new Set([404, 410]);

// Accepts a full URL or a site path ("/blog/x"). Returns the normalized production URL,
// or null if it is not on the production host (previews, app subdomain, http, localhost).
export function normalize(input: string): string | null {
  let u: URL;
  try {
    u = new URL(input, SITE);
  } catch {
    return null;
  }
  if (u.protocol !== 'https:' || u.host !== 'getshorthandapp.com') return null;
  if (u.search || u.hash || u.username || u.password) return null;
  return u.href;
}

export function parseSitemap(xml: string): Set<string> {
  const urls = new Set<string>();
  for (const m of xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)) {
    const loc = m[1]
      .replace(/&apos;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
    const n = normalize(loc);
    if (n) urls.add(n);
  }
  return urls;
}

type Check = {
  deleted: boolean;
  status: number;
  inSitemapNow: boolean;
  inSitemapBefore: boolean | null; // null = no pre-merge snapshot was taken
};

// Returns null when the URL may be submitted, otherwise the reason it was dropped.
export function rejectReason(c: Check): string | null {
  if (!c.deleted) {
    if (!c.inSitemapNow) return 'not in the live sitemap (private, noindex, or not deployed)';
    if (c.status !== 200) return `live status ${c.status}, expected 200`;
    return null;
  }
  if (c.inSitemapBefore === null) return 'deleted URL needs a pre-merge sitemap snapshot';
  if (!c.inSitemapBefore) return 'was not in the pre-merge sitemap (never public)';
  if (c.inSitemapNow) return 'still in the live sitemap';
  if (!REDIRECT.has(c.status) && !GONE.has(c.status)) return `live status ${c.status}, expected 404/410/redirect`;
  return null;
}

export const accepted = (status: number) => status === 200 || status === 202;
