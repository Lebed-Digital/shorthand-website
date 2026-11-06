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
// are unaffected. Prefetches (next/link on every page links to '/') do not
// assign either: a visitor is placed only when they actually ask for the page.
// On a preview deployment `?home=test` or `?home=control` forces a variant
// without a cookie, for checking both by hand.
const BOT = /bot|crawl|spider|slurp|facebookexternalhit|embedly|preview|lighthouse|headless|python|curl|wget/i;

export function proxy(request: NextRequest) {
  const forced = request.nextUrl.hostname === PRODUCTION_HOSTNAME ? null : request.nextUrl.searchParams.get('home');
  if (forced === 'test' || forced === 'control') return serve(request, forced);

  if (BOT.test(request.headers.get('user-agent') ?? '')) return NextResponse.next();
  const existing = homeVariantFromCookie(request.headers.get('cookie') ?? '');
  if (existing) return serve(request, existing);
  if (request.headers.get('next-router-prefetch') || request.headers.get('purpose') === 'prefetch') return NextResponse.next();

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
