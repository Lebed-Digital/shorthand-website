import { NextResponse, type NextRequest } from 'next/server';
import { HOME_EXPERIMENT_COOKIE, HOME_TEST_SHARE, homeVariantFromCookie } from './lib/posthog-events';
import { PRODUCTION_HOSTNAME } from './lib/posthog-privacy';

// The homepage experiment ('homepage-modern' in lib/posthog-events.ts). A
// visitor's first homepage request picks their variant and stores it in a
// cookie, so they see the same homepage on every visit and the page never
// swaps after it loads. 'test' is served the redesign from /modern-preview at
// the same '/' URL.
//
// Crawlers always get the current homepage and no cookie, so search results
// are unaffected. Everyone else is placed on their first request for '/',
// including the background prefetch a page makes for its links to '/', so a
// visitor arriving from a blog post sees the same variant they are counted in.
// Being placed is not taking part: PostHog only counts a visitor once they
// view '/' (the experiment's exposure event).
// On a preview deployment `?home=test` or `?home=control` forces a variant
// without a cookie, for checking both by hand.
const BOT = /bot|crawl|spider|slurp|facebookexternalhit|embedly|preview|lighthouse|headless|python|curl|wget/i;

export function proxy(request: NextRequest) {
  const forced = request.nextUrl.hostname === PRODUCTION_HOSTNAME ? null : request.nextUrl.searchParams.get('home');
  if (forced === 'test' || forced === 'control') return serve(request, forced);

  if (BOT.test(request.headers.get('user-agent') ?? '')) return NextResponse.next();
  const existing = homeVariantFromCookie(request.headers.get('cookie') ?? '');
  if (existing) return serve(request, existing);

  const variant = Math.random() < HOME_TEST_SHARE ? 'test' : 'control';
  const response = serve(request, variant);
  response.cookies.set(HOME_EXPERIMENT_COOKIE, variant, {
    path: '/',
    maxAge: 60 * 60 * 24 * 90,
    sameSite: 'lax',
    secure: request.nextUrl.protocol === 'https:',
  });
  return response;
}

function serve(request: NextRequest, variant: 'test' | 'control') {
  return variant === 'test' ? NextResponse.rewrite(new URL('/modern-preview', request.url)) : NextResponse.next();
}

export const config = { matcher: '/' };
