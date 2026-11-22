# Neon site audit: verified fixes plan

Status: IMPLEMENTED, PR C MERGED, PR A and B AWAITING GREG'S PREVIEW CHECK (2026-11-21). Codex plan review passed (2 passes). PR C #188 merged as `47bd68a` and live; PR A #186 (Codex clean) and PR B #187 (/code-review medium, preview verified) are open, Greg to decide on footer commit `97ef13e` at merge. Written 2026-11-20 against
`main` at `2dc7c07` (fetched, local = origin).
Source: Neon (gemini-4-neon) audit in the T3 "Website Feedback" thread, runs 1-2. Every finding below was re-checked
against the repo by Claude (Opus) before it went into this plan.

## Greg's decisions (2026-11-20)

1. Keep the `FAQPage` JSON-LD on blog posts. Correct AGENTS.md to record it as intentional (PR C).
2. `/classdojo-alternative`: keep the middle/high-school SEO targeting (title, meta description, body), but the
   comparison table row must say ShortHand supports K-12, including middle and high school, so elementary teachers
   are not turned away (PR B).
3. Homepage trust sections, navigation, performance and visual changes wait until `homepage-modern` concludes.
4. `homepage-modern` results are read from 2026-11-16 onward.
5. Scope stays focused: no refactors or cleanup beyond the items below.

## Hard constraint: both live experiments stay untouched

- `homepage-modern` (PostHog 573008, proxy.ts cookie split, read from 2026-11-16).
- `blog-cta-presentation` (behavior emails post, review ~2026-12-01).

No change in this plan touches `app/page.tsx`, `app/modern-preview/**`, `proxy.ts`, `lib/posthog-events.ts`,
`lib/posthog-privacy.ts`, `instrumentation-client.ts`, `BlogCtaExperiment`, `WORKFLOW_BRIDGES`, or the
`WORKFLOWBRIDGEMARKER` line. No PostHog event, property or flag changes. Where a shared file renders inside an
experiment (QuickGridDemo on both homepage arms, the blog post template on both CTA arms), the change is identical
for both arms and does not touch what the experiment measures (see each item).

## Finding-by-finding verdict

| # | Neon finding | Verdict | Action |
|---|---|---|---|
| 1 | `grade` unbounded in `/api/welcome-letter` | **Confirmed.** `route.ts:24` checks only type; value is interpolated twice into the prompt (lines 57, 60) and used as a lookup key (61). Rate limit caps request count, not size, so one request can carry a very large prompt billed to our OpenAI key, or repurpose the endpoint as a general LLM proxy. Other API routes all cap length. | PR A |
| 2 | QuickGridDemo hardcodes `ctaSource="features_quick_note"` | **Confirmed, smaller than stated.** `QuickGridDemo.tsx:234,284`. Only GA4 `cta_click.cta_source` is wrong; `cta_page` is already the real path (`lib/gtag.ts:19`), and PostHog (the experiment) never sees `ctaSource`. | PR B |
| 3 | `FAQPage` JSON-LD "violates" AGENTS.md | **Mis-stated.** Added deliberately (`1fdb718`), on 53 posts. Already logged in `docs/seo-90-day-plan.md:165` as "deliberately unreconciled; investigate intent before changing either; when Greg asks". Not a bug: Google ignores it for rich results, it is valid schema. | Keep code. Correct the docs (PR C) |
| 4 | `/how-it-works` page shadowed by redirect | **Confirmed.** `next.config.ts:99-102` redirects to `/#walkthrough` (a social shortlink, keep it). `app/how-it-works/` is unreachable, not in sitemap, holds raw YouTube iframes. | PR B (delete dir) |
| 5 | Hardcoded legacy `<footer>` on many pages | **Confirmed, and the most meaningful site-wide item.** Blog post template (93 URLs, most organic landings) shows `© 2026 ShortHand`, no Terms link, no links to `/for-schools`, `/install`, `/tools`, features. `/classdojo-alternative` and `/install` footers have **no privacy link at all**. Shared `components/Footer.tsx` already exists and is a superset of every legacy footer's links. | PR B (5 non-legal pages) |
| 6 | `/install` metadata outdated, no OG image | **Confirmed, worse than stated.** `app/install/layout.tsx:5,8` says "No app store", while the page leads with App Store and Google Play badges. `openGraph` has no `images`, so shallow merge drops the share image. | PR B |
| 7 | Nav fragmentation, raw `<a>` on homepage | Confirmed, cosmetic. Homepage instances are inside the experiment. | Not doing (post-test) |
| 8 | Pastel cards on dark `/tools` | Confirmed, design taste. Resolves with the post-test palette decision. | Not doing (post-test) |
| 9 | `/classdojo-alternative` "Middle & high school" row | **Partly.** The middle/high positioning is deliberate (Decisions Log 2026-07-13: this page owns the grade-specific middle/high-school query shape; meta description says "built for older students") and stays. But the table row reads as "not for elementary", which is inaccurate. | PR B: table cell only (Greg decision 2) |
| 10 | ~22 pages lack `twitter` metadata | **Confirmed, but the per-page fix is the wrong shape.** Root `app/layout.tsx` sets a full `twitter` block, which every page without its own inherits whole (homepage title/description). Next 16.2.1 `postProcessMetadata` (`node_modules/next/dist/lib/metadata/resolve-metadata.js:619-655`) autofills twitter title/description/images from the page's own `openGraph` whenever they are absent. So trimming the root block to `{ card }` fixes every page at once. Separately, `/blog` and `/install` define `openGraph` without `images`: blank share cards on Facebook, iMessage, Slack. | PR B (root + 2 pages) |
| 11 | Control homepage LCP / client JS | Confirmed (`globals.css` hero `opacity: 0` + `fadeUp` up to 0.65s delay; framer-motion + gsap). It is the control arm. Note for reading results: the test arm had its hero fade removed in PR #167, so this is a known, accepted asymmetry. | Not doing (post-test) |
| 12 | No `<main>` landmark on most pages | Confirmed. Root layout renders `{children}` straight into `<body>`, and wrapping there would nest `<main>` on the 7 files that already render one. | PR B: blog post template only (93 URLs), since that file is already being edited |
| 13 | Two orphan posts | **Partly.** Both are linked from `/blog` and the sitemap, but nothing links to them in context. `why-im-building-shorthand` has natural sources. `special-education-paraprofessional-first-year` has none (only mention of "paraprofessional" elsewhere is a table cell in `behavior-intervention-plan-template.md:50`), and PR #132 set the precedent of not forcing links. | PR C (one link) |
| 14 | `llms.txt` behind the site | **Confirmed.** Missing vs `app/sitemap.ts`: `/for-schools`, `/tools`, `/report-card-comment-library`, `/back-to-school-toolkit`, `/features/import-roster`, `/free-seating-chart-prompt`, `/week-at-a-glance`, `/chatgpt-teacher-freebies`, `/press`, `/support`. (`/features/class-insights` is noindexed on purpose, stays out.) | PR B |
| - | A/B read (n=72) | Directional only. Demo start 5/22 vs 6/50 (Fisher exact p=0.29); app click 5/22 vs 10/50 (p=0.76). Not evidence of anything yet. Also confirm the data window starts 2026-11-16 (after PR #179), per the experiment notes. | No action |

## PR A: welcome-letter `grade` allowlist (Critical tier: `/codex-review`, high)

Branch `fix/welcome-letter-grade-allowlist`. Files: `app/api/welcome-letter/route.ts`, `lib/api-errors.test.ts`.

1. Move `gradeContext` from inside `POST` to module scope (`const GRADE_CONTEXT: Record<string, string>`), unchanged
   content. It must exist before the validation `try` block.
2. Replace line 24 with
   `if (typeof grade !== 'string' || !Object.keys(GRADE_CONTEXT).includes(grade)) throw new Error();`
   (`Object.keys().includes` rather than `in`, so `constructor`/`toString` are rejected; same style as the tone check.)
3. Line 61: `${GRADE_CONTEXT[grade]}`, drop the now-unreachable `?? 'Tailor the letter...'` fallback.
4. Test in the existing `lib/api-errors.test.ts` harness (it already mocks fetch and the rate limiter): an unknown
   grade (`'x'.repeat(5000)`) and `'constructor'` each return 400 and never call fetch. The existing `'3rd Grade'`
   case keeps passing.

Safe because the only caller, `app/back-to-school-toolkit/WelcomeLetterClient.tsx:34-37`, sends exactly these
10 strings from a `<select>`. No client change. Not touched: `/api/welcome-letter-refine` and `/api/free-tool`
already cap every field.

Existing protections, for the review to confirm are adequate once `grade` is closed (no change planned unless
the review finds a real gap):
- Rate limit `checkWelcomeLetterRateLimit` (`lib/ratelimit.ts:212-243`): 15/h per valid anonymous browser id
  (shared with refine) plus 120/h per hashed IP (`x-forwarded-for` first hop). A client that omits the anon id
  is bounded by the IP limit only. Fails open if Upstash is unreachable (documented choice: cost guard, not access).
- Per-call cost: after the fix every interpolated field is bounded (`teacherName` 100, `subject` 100, `grade`
  allowlist, `tone` allowlist), output capped at `max_completion_tokens: 600` (`route.ts:92`), upstream timeout.
- Request size: `req.json()` reads the whole body before validation; no app-level byte cap, so the platform's
  request-body limit is the only bound on bytes read (not on bytes sent to OpenAI, which the field caps bound).

## PR B: site consistency and share metadata (Medium tier: `/code-review medium`)

Branch `fix/site-footer-metadata-cleanup`. No copy changes to page bodies, headings or titles.

1. **QuickGridDemo attribution.** `components/QuickGridDemo.tsx`: accept optional `ctaSource?: string`, pass it to
   both `TrackedLink`s (undefined falls through to TrackedLink's existing `'homepage'` default).
   `app/features/quick-note/page.tsx:68`: `<QuickGridDemo ctaSource="features_quick_note" />`.
   Homepage files are not edited; both arms get `cta_source=homepage` in GA4. DOM, PostHog events
   (`quick_grid_demo_*`, `app_link_clicked`) unchanged. Historical GA4 rows stay mislabeled; `cta_page` separates them.
2. **Shared footer.** Replace the legacy `<footer>...</footer>` with `<Footer />` in:
   `app/blog/[slug]/page.tsx:497-502`, `app/blog/page.tsx:72-77`, `app/about/page.tsx:159-164`,
   `app/classdojo-alternative/page.tsx:122-127`, `app/install/page.tsx:142-147`.
   Blog CTA experiment: Footer contains no app link, so no `app_link_clicked` with any `cta_location` is added;
   identical on both arms.
3. **`<main>` on blog posts.** `app/blog/[slug]/page.tsx`: wrap the primary content (from the header/hero through
   `</article>`) in `<main>`, outside the nav and footer. No class or style change.
4. **Delete `app/how-it-works/`** (`page.tsx`, `layout.tsx`). Keep the redirect in `next.config.ts`. Leave the
   comment at `app/page.tsx:83` (it describes the redirect, which still exists).
5. **Root twitter block.** `app/layout.tsx`: `twitter: { card: 'summary_large_image' }`, removing title,
   description, images. Each page's twitter tags then autofill from its own `openGraph`. Expected side effect:
   `/` (both arms, identical) changes `twitter:description` to the root `og:description`; title and image identical.
6. **OG images.** Add `images: [{ url: '/og-image-v2.png', width: 1200, height: 630, alt: 'ShortHand: Built by a teacher, for teachers.' }]`
   to `openGraph` in `app/blog/page.tsx` and `app/install/layout.tsx`.
7. **`/install` description** (`layout.tsx`, both `description` and `openGraph.description`), title unchanged:
   "Get ShortHand from the App Store or Google Play, or add it to your home screen from the browser. Free behavior tracking, AI parent notes, and documentation for teachers."
8. **`public/llms.txt`.** Add the 10 missing URLs from the table, one line each in the existing format and section
   that fits, descriptions factual and taken from each page's own meta description.
9. **ClassDojo table row.** `app/classdojo-alternative/page.tsx:20`: `sh: 'Middle & high school'` becomes
   `sh: 'K-12, including middle and high school'`. Title, meta description, OG, headings and body unchanged.

Checks: `npm run lint`, `npm run test`, `npm run build`, then on `next start`:
- Every sitemap URL whose route defines its own `openGraph`: exactly one each of `twitter:card`
  (`summary_large_image`), `twitter:title`, `twitter:description`, `twitter:image`; `twitter:title` equals
  `og:title`; none carries the homepage title. `/blog` and `/install` have `og:image`.
- Known exceptions, unchanged in kind (they define no `openGraph`, so they inherit the root OG object and keep the
  homepage share title, as today): `/privacy`, `/terms`, `/dpa`, `/delete-account` (Critical tier, out of scope),
  `/support` (skipped). The check lists them explicitly and asserts: same homepage `twitter:title` and image as
  today; `twitter:description` changes from the short root twitter copy to the root `og:description` (still
  homepage copy, accepted).
- `/` with `?home=control` and `?home=test` (non-production host): rendered `<body>` markup with `<script>` tags
  stripped is identical to a `main` build for each arm. Head: compare parsed `<meta>`/`<link rel=canonical>` tags
  only (framework asset tags excluded); expected diff is `twitter:description` (now the root `og:description`)
  plus new `twitter:image:alt/width/height` from the root OG image descriptor.
- Blog post: footer links render, one `<main>`, CTA experiment markup identical to `main` on
  `sample-emails-to-parents-about-student-behavior` (both `?cta=` variants).
- `/how-it-works` still 307s to `/#walkthrough`.
- Built HTML grep for `</(a|strong)>[A-Za-z]` (JSX spacing bug) and for `—` in the diff.

## PR C: one contextual link + docs (Light, content/docs only, self-merge allowed)

Branch `content/link-and-faq-schema-docs`.
1. `posts/how-to-document-student-behavior-from-day-one.md:60`: turn "That is why I built ShortHand." into
   "That is [why I built ShortHand](/blog/why-im-building-shorthand)." No other frontmatter or text change,
   no `lastModified`.
2. `AGENTS.md:66`: replace "`FAQPage` schema is NOT used — restricted to government/health sites, invalid for this
   site" with: blog posts with `faq` frontmatter emit `FAQPage` JSON-LD on purpose (kept 2026-11-20, Greg); Google
   does not show FAQ rich results for this site, so expect none; do not add `FAQPage` to non-blog pages.
   (Wording deliberately avoids stating Google's current eligibility rule, which has changed more than once.)
3. `docs/seo-90-day-plan.md:165` (Parked row) and `:175`: mark the discrepancy resolved, pointing at AGENTS.md.
4. This plan file, with its review log.

## Review tiers and order

1. Codex reviews this plan (high effort, max two passes) before any code.
2. PR A: `/codex-review` on the diff, high effort (Critical: `app/api/**`), max two passes.
3. PR B: one `/code-review medium` pass (pages, components, `app/layout.tsx`). No Codex on it.
4. PR C: no independent review (Light).
5. Each PR: `npm run lint`, `npm run test`, `npm run build` locally, `Review:` line in the PR body, then push
   for the Vercel preview and check the preview. PR A's preview cannot exercise the route (preview deploys have no
   `OPENAI_API_KEY`, so the route returns 500 before validation); its runtime check is the unit test plus a local
   `next start` request with a dummy key (invalid grade must return 400 without reaching OpenAI).
6. Merge: PR C self-merged after its build passes: its diff is `posts/*.md`, `docs/*.md` and `plans/` (all in the
   global content self-merge exception) plus `AGENTS.md`, a non-user-facing doc that the global rules allow
   straight to `main`, whose content Greg decided explicitly on 2026-11-20. PR A and PR B wait for Greg's
   preview check.

## Not changed in PR A, flagged for Greg

Codex plan review (finding 1): every limiter in `lib/ratelimit.ts` fails open, including Upstash's default
5-second timeout (`reason: "timeout"`, `success: true`). During a Redis outage the welcome-letter routes are
bounded per call (field caps, 600 output tokens, upstream timeout) but not in aggregate. This is pre-existing and
documented in the code as a deliberate choice (cost guard, not access control); switching to fail-closed would
return errors to real teachers during an Upstash outage. Recommendation: no code change now. The aggregate
backstop has to be an enforced (hard) spend limit on the OpenAI project behind the production key, not an
alert-only budget. Greg to confirm in the OpenAI dashboard; until confirmed, outage spend is unbounded by the app.

## Footer swap and `homepage-modern` (Codex plan pass 2, finding 4)

Checked in PostHog (experiment 573008, read-only): exposure is a `$pageview` on `/`, but the primary metric
(`app_link_clicked`, `destination=web_app`) and secondary (`quick_grid_demo_started`) count after exposure
anywhere on the site, not only on `/`. The shared Footer has no app or store link, but it adds links to pages
that do (`/install`, feature pages, including `/features/quick-note` with the demo). Both arms get the same footer
on the same pages, so it adds no bias by design; it can shift both arms' baselines slightly, and the arms differ
only in how often their visitors reach those pages afterward. Expected effect over the test is a fraction of one
conversion. Handling: the footer swap is its own commit in PR B so it can be dropped before merge; the PR
description states this; Greg decides at merge. The read window stays 2026-11-16 onward (Greg decision 4).

## Docs and logs to update

- This plan (review log, implementation record).
- `AGENTS.md`, `docs/seo-90-day-plan.md` (PR C).
- Brain `Decisions Log.md`: one entry for the FAQPage keep and the ClassDojo table wording (Greg authorized).
- Claude memory: experiment read window unchanged (2026-11-16), FAQPage decision.

## Not doing, and why

- Legal pages' footers and metadata (`/privacy`, `/terms`, `/dpa`, `/delete-account`): AGENTS.md puts any edit
  there in the Critical tier; low traffic. Swap their footers next time those pages change for a real reason.
- `/support` inherits the homepage `og:url`/`og:title`: rare shares, skip.
- Homepage nav `<Link>` swap, LCP/JS weight, `/tools` palette, test-variant gaps (no nav demo CTA, no creator/RBT,
  testimonial, privacy promise, pricing, full footer): all inside or tied to `homepage-modern`. Decide after the test.
- Secondary-page nav standardization: cosmetic refactor, no measured cost.
- Paraprofessional post link: no natural source today.

## After `homepage-modern` ends (not in this plan)

Carry the creator/RBT block, testimonial, privacy promise, pricing and a nav demo CTA into the winner; then
homepage nav `<Link>`s, LCP/JS weight and the `/tools` palette.

## Codex review log

Command (both passes): `codex exec -m gpt-6.2-sol -s read-only -c model_reasoning_effort="high"`, plan plus three
owner questions (rate limits/request size, rendered root-metadata result, experiment safety).

### Plan pass 1 (2026-11-20)

| # | Finding (severity) | Verdict |
|---|---|---|
| 1 | Limiters fail open on Redis error/timeout (medium) | Needs Greg: pre-existing, documented design; flagged above |
| 2 | Pages without own `openGraph` keep homepage share title (medium) | Accept: check narrowed, exceptions listed |
| 3 | Byte-identical HTML check unreliable; new twitter image tags (low) | Accept: body-only, scripts stripped; tags expected |
| 4 | AGENTS.md wording restates FAQ eligibility rule (low) | Accept: neutral wording |
| 5 | PR C self-merge includes AGENTS.md (low) | Reject: AGENTS.md is a non-user-facing doc, allowed straight to `main` |

Q1: adequate in healthy operation, gap = fail-open. Q2: root trim works (traced through `postProcessMetadata`),
except pages with no own `openGraph`. Q3: CONFIRMED.

### Plan pass 2 (2026-11-20, verification, final)

| # | Finding (severity) | Verdict |
|---|---|---|
| 1 | Backstop must be an enforced spend limit, not alert-only (medium) | Accept: flag reworded |
| 2 | Exception pages' `twitter:description` changes (low) | Accept: recorded as expected |
| 3 | Head comparison includes asset tags (low) | Accept: parsed meta tags only |
| 4 | Homepage metric counts site-wide; footer adds paths (medium) | Accept as real: verified in PostHog; separate commit, Greg decides at merge (section above) |
| 5 | PR C self-merge (low, maintained) | Reject maintained: low-severity disagreement, does not block |
| 6 | `/install` listed as missing from `llms.txt` (low) | Reject: the plan's list never included `/install` |

Q1: adequate in healthy operation; outage backstop needs Greg's confirmation. Q2: CONFIRMED with exceptions as
listed. Q3: see section above. No third pass.

## Implementation record (2026-11-20)

- **PR A #186** `fix/welcome-letter-grade-allowlist` (`b2c0a2e`): as planned. lint, 113/113 tests, build pass.
  Local `next start` with a dummy key: 5,000-char grade 400, `constructor` 400, `3rd Grade` passes validation
  (502 from the dummy key). `/codex-review` high, pass 1: `NO_ACTIONABLE_FINDINGS`. Waits for Greg.
- **PR B #187** `fix/site-footer-metadata-cleanup`: commit 1 `8a04d19` (items 1, 3-9), commit 2 `97ef13e`
  (footer swap, separate so it can be reverted), commit 3 `57125c0` (comment fix from review). lint, 112/112
  tests, build pass (a stale `.next/dev/types` cache still listing `/how-it-works` broke the first local build;
  cleared, not a source issue). Before/after capture of all 128 sitemap pages plus both homepage arms and the CTA
  post: all plan checks pass, `/how-it-works` 307 to `/#walkthrough`. `/code-review medium`: 5 findings, 1 fixed
  (layout comment overstated the autofill), 2 rejected (test arm does render `id="walkthrough"`; FAQPage kept per
  Greg), 2 nits not taken (GA4 arm split would edit the frozen test variant; ClassDojo title/meta stay
  middle/high per Greg). Waits for Greg.
- **PR C** `content/link-and-faq-schema-docs`: items 1-4. Self-merged after its build.
