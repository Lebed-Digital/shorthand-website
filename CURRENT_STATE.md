# Current State: ShortHand Website

## Domain

Public site: getshorthandapp.com
App: app.getshorthandapp.com
Never use: getshorthand.app (abandoned, blocked by school filters)

## Funnel

Three app entry links, each opening a different first screen:

- `?demo=true`: live demo with sample students, no account (blog, homepage hero, most content pages)
- `?signup=1`: Create Account tab (body "Get Started Free" / "Create a free account" buttons)
- bare URL: Sign In tab (nav "Get ShortHand" on feature pages and `/classdojo-alternative`)

The demo is free play with seeded data (the guided tour was removed in 2026-10).

Full list of which page uses which link, and why: docs/funnel-decisions.md.

## Plans (what the site may say)

Checked against the app code 2026-11-22 (`pulse 2.0`):

- Free is permanent, not a trial. Notes, students, classes, parent communication log, goals and accommodations are free with no cap. AI parent notes (Quick Note Home, Detailed Report) are free.
- Pro is $4.99/month on the web. Eligible accounts get one 30-day Pro trial, no credit card. The iPhone app buys through Apple at Apple's price; a browser on any phone uses Stripe.
- Cancelling: web subscribers ask support (info@getshorthandapp.com), who cancel in the Stripe Dashboard; the app's Stripe webhook moves the account to Free when paid access ends (immediately, or at period end if scheduled) and notes stay. No self-service web cancel exists (Customer Portal only in an unmerged app draft). App Store purchases (iPhone app): Apple ID settings. The site promises no response time.
- Pricing page: /pricing (Free vs Pro). Wording rule: "Free plan with no time limit", never "free forever".
- Pro adds: the Reports tab (Student Documentation Report, Meeting Prep Report, Documentation Coverage), Ask ShortHand, Shoutouts, Class Summary, Class Note mode, bulk parent emails, Import Birthdays, Quick Grade Table, School Calendar and Rotation.
- Each teacher has their own account. No school, team or district accounts exist.
- ShortHand never sends messages itself. Drafts open in the teacher's mail app or Gmail.

Re-check the app before adding numbers or new Pro claims to the site.

## Experiments

None running. Both 2026 tests ended 2026-11-25 (results: `docs/experiments-review-2026-11-25.md`): the modern homepage won and is now `app/page.tsx` for everyone, and the blog CTA kept the original boxed card. Shipped in PR #196 (`c732d92`), production verified 2026-11-25. Feature flags are off. New experiments are time-boxed (AGENTS.md, "Experiments").

Re-read around 2026-12-25: homepage web-app opens per visitor (test: old 17.5%, modern 25.0%) and app signups with first-touch landing page `/` (baseline 4 in 30 days, 25 in 90). Note when reading: PR #197 (2026-11-25, same day) added a nav "Try the demo" button (GA4 `nav_get_shorthand`) plus quote, creator, pricing and privacy rows, so the re-read measures the modern homepage with those additions, not the exact test arm.

## Pages

/how-it-works redirects to /#walkthrough (a social shortlink in next.config.ts).
/features/class-insights is live but noindexed and left out of the sitemap on purpose (feature hidden 2026-08-05).
/for-schools is the page for principals and district IT (DPA, security, contact).

Design: the whole public site is light (PR #196, #197, #198, #199). The website design consistency project is complete (2026-11-25), done as 3 approved PRs, each production verified the same day: A homepage restore + organized shared footer (#197), B light theme for shared-stylesheet pages and `/tools` via `app/globals.css` tokens (#198), C the self-contained free tool pages (#199, `31e4ddc`: comment generator, comment library and its paywall/restore/success pages, welcome letter, Week at a Glance, ChatGPT freebies, seating chart prompt, resources, parent communication log screen colors; print layout unchanged). Tool pages use `var(--bg)` for the page, `var(--hero-bg)` for the top band, and keep their white and pastel cards; the selected length/tone option buttons stay navy `#0f172a` on purpose. Plan decisions: inner pages adopt the homepage typography, italic serif accents only on prominent headings; inner-page navs keep their structure, colors only; use shared tokens wherever practical, tool pages included.
Colors come from the `:root` tokens in `app/globals.css` (contrast for each noted there): `--accent` is a text color (filled controls pair it with white), buttons use `--cta-bg`/`--cta-text`, `--teal*` is the comment library and tool color, `--error` for form errors, `--input-border` for fields. The shared footer (`components/Footer.tsx`) reads only tokens. Privacy, terms, dpa and delete-account keep their own simple `<footer>`.
Fonts: every page renders the device's system UI font, the homepage included (`:root` `--font-body`/`--font-display` in globals.css). The only web font is Fredoka, the ShortHand wordmark, served from `app/fonts/fredoka-latin.woff2` by `next/font/local` (license `app/fonts/Fredoka-OFL.txt`). Since 2026-11-25 builds download nothing from Google Fonts: a failed Google Fonts download had failed a production build, so the unused Inter import was removed and Fredoka self-hosted (same file Google served, logo renders identically).

## SEO

Blog posts: 93 (as of 2026-11-22)
llms.txt exists at /llms.txt
FAQPage JSON-LD is emitted on blog posts with `faq` frontmatter, on purpose (AGENTS.md)
BlogPosting JSON-LD on every post page
SoftwareApplication + Organization schema in app/layout.tsx
Sitemap: blog posts carry real dates; static pages carry no lastmod (no fake "modified today")

## Notes

Reference docs/funnel-decisions.md for funnel implementation details.
Open audit items: Brain `Website Audit - 2026-11-15.md`, "Implementation Status".
Known issues (Brain Known Bugs.md): the PostHog privacy check flags the comment generator's "Frequently asked questions" heading, likely a false positive in the check script (same heading is on public `/chatgpt-teacher-freebies`); `TrackedLink` cancels Ctrl/Cmd-click on tracked CTAs (includes the homepage nav demo button since #197); the Playwright test `tests/report-card-generator.spec.ts` fails on main because a strict `getByRole('status')` matches two status regions on the page (test issue, seen 2026-11-25, not caused by the design PRs).

## Last reviewed

2026-11-25
