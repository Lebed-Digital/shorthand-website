# Current State — ShortHand Website

## Domain

Public site: getshorthandapp.com
App: app.getshorthandapp.com
Never use: getshorthand.app (abandoned, blocked by school filters)

## Funnel

Current public CTA destination:
https://app.getshorthandapp.com?demo=true

Current strategy:
Guided demo first, signup second. `?demo=true` bypasses signup and drops users directly into a live demo with pre-loaded student data.

Reference: docs/funnel-decisions.md for full implementation history.

## Pages

/how-it-works retired and redirected to /
Page file retained at app/how-it-works/page.tsx for future rebuild.

## SEO

Blog posts: 82 (as of 2026-06-26)
llms.txt exists at /llms.txt
FAQPage schema removed (restricted to gov/health sites — was invalid)
BlogPosting JSON-LD on every post page
SoftwareApplication + Organization schema in app/layout.tsx

## Notes

Reference docs/funnel-decisions.md for funnel implementation details.

## Last reviewed

2026-06-26
