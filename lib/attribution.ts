// Builds the query string appended to app.getshorthandapp.com links so the
// app can attach first-touch attribution at signup (see pulse 2.0
// src/lib/analytics.ts markAttribution / AuthScreen.tsx). Two sources, both
// read from the CURRENT page, not stored anywhere on the website side:
//   - `lp`: this page's own pathname, so organic body/nav CTAs (which carry no
//     UTM today) still tell the app what page sent the click.
//   - utm_source/utm_medium/utm_campaign: forwarded through if the visitor
//     arrived on THIS page via a UTM'd link (e.g. a social shortlink), so a
//     click deeper on the same visit doesn't lose it.
// UTM values already present on `href` itself (if a caller passes one) win
// over ones forwarded from the current page.
export function withAttribution(href: string, pathname: string, search: string): string {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return href;
  }
  if (url.hostname !== 'app.getshorthandapp.com') return href;

  if (!url.searchParams.has('lp')) {
    url.searchParams.set('lp', pathname);
  }

  const currentParams = new URLSearchParams(search);
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign']) {
    if (!url.searchParams.has(key) && currentParams.has(key)) {
      url.searchParams.set(key, currentParams.get(key)!);
    }
  }

  return url.toString();
}
