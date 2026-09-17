# ShortHand Website Audit

**Date:** 2026-09-12
**Scope:** getshorthandapp.com (read-only diagnosis, no changes made)
**Data windows:** GSC + GA4 + Supabase `analytics_events`, 2026-08-15 → 2026-09-12

---

## The one-paragraph version

The website is in better shape than the analytics suggest. **You had 51 real signups in the last 28 days.** GA4 says 0. `analytics_events` says 20. The only place showing the true number is the Founder Dashboard, which reads `welcome_emails` + `auth.users` — the source of truth confirmed when that dashboard shipped on 2026-09-10. So the funnel is not broken, the measurement of it is, and **any judgment made from GA4 right now understates reality by a factor of infinity, and from `analytics_events` by about 2.5x.** The underlying signup-tracking gap is known and deliberately deferred since 2026-08-07; what is new is that the GA4 half has gone from partial undercount to total loss. Separately, and this is the genuine new conversion finding, **97% of your search traffic lands on blog posts, and the ~85 in-body "Try ShortHand free" links across 74 posts are completely untracked and carry no attribution.** Below, in priority order.

> **Note on prior work.** Findings 1 and 2 overlap existing records and are partly re-confirmations; findings 3-7 are new. Each is labelled inline, and there is a full coverage table in **"Prior-work check: what was already known"** near the end. Sources swept: `Brain/Known Bugs.md`, `GSD.md`, `Decisions Log.md`, ~3 weeks of `Agent Handoff.md`, and all 13 docs in `docs/`.

---

## 1. GA4 is blind to the entire product funnel (highest priority)

> ### ⚠️ What's new vs. what was already known
>
> **Already known and documented, do not re-investigate:**
> - GA4 undercounts signups. Diagnosed 2026-08-07, confirmed by ChatGPT the same day, **deliberately deferred** so it wouldn't be fixed mid-experiment. `Brain/Known Bugs.md`, still OPEN.
> - The two causes then: `signup_completed` is gated behind `mode === 'signup'` so anonymous→real conversions miss it, and Google OAuth signups never fire it at all. Together ≈50% undercount.
> - The `await`-chain race condition in `trackEvent()`. Found 2026-08-19, **RESOLVED** in PR #40 (`ac4e8ec`) for the Supabase insert.
> - `demo_started` loss. Open item in `demo-conversion-flow.md` since 2026-07-31.
> - **The agreed fix approach already exists**: one `signup_completed` event with a `signup_method` parameter (`demo_conversion` | `email` | `google`), gated on an **idempotent durable milestone** rather than sniffing `onAuthStateChange`. Do not re-derive this, and do not implement the original `created_at ≈ last_sign_in_at` approach, which was reviewed and rejected.
>
> **What is new in this audit:**
> 1. **The undercount is no longer ~50%. In GA4 it is now 100%** for `signup_completed`, `demo_started` and `trial_started` — zero rows in 28 days, including the direct email/password path that the 2026-08-07 entry explicitly confirmed was working.
> 2. **The split between the two data stores is new information.** Supabase is recording all of it correctly (64/20/6). So this is no longer "signups aren't tracked," it is "**the gtag half of `trackEvent` is failing while the Supabase half succeeds.**" The August entries predate that distinction; the interim measurement rule there ("GA4 baseline 5, known-incomplete") now reads as optimistic.
> 3. **A second mechanism the prior work does not name:** PR #40 fixed the `await` chain for the *Supabase* insert, but `gtag` is still called **after** `await insertEvent(...)` at `analytics.ts:299-306`, and `initAnalytics()` is deliberately deferred until auth resolves (`App.tsx:1796`). `demo_started` fires in the same tick that resolves auth, so `window.gtag` frequently isn't a function yet and the call silently no-ops. That ordering was not part of the PR #40 fix.
> 4. `trial_started` is affected too. It didn't exist at the time of the August investigation.
> 5. **`analytics_events` is not a safe fallback for signups either** (20 vs the real 51). The correct source is `welcome_emails` + `auth.users`, which is what the Founder Dashboard's "Recent real signups" table already uses (PR #91, 2026-09-10). Worth stating explicitly because "just use Supabase instead of GA4" is the intuitive conclusion and it is wrong by 2.5x.

**Evidence.** Same 28-day window, two sources:

**The actual signup count for the last 28 days is 51.** Neither analytics store knows that:

| Source | 28-day signups | Status |
|---|---|---|
| `auth.users` (real, non-test) | **51** | ✅ **source of truth** |
| `welcome_emails` rows | **51** | ✅ matches exactly |
| Supabase `analytics_events.signup_completed` | 20 | ⚠️ ~61% undercount |
| GA4 `signup_completed` | **0** | ❌ total loss |

Other events, Supabase vs GA4:

| Event | Supabase `analytics_events` | GA4 |
|---|---|---|
| `demo_started` | 64 | **0** |
| `trial_started` | 6 | **0** |
| `student_added` | 869 | 67 |
| `note_logged` | 394 | 6 |

GA4 recorded only **6 sessions** on `app.getshorthandapp.com` against 95 website `cta_click` events.

**Two separate defects, not one.** The 20-vs-51 gap is the *known, still-open* 2026-08-07 design gap (`signup_completed` never wired up for anonymous→real conversions or Google OAuth). The 20-vs-0 gap is the GA4 delivery problem. Fixing either one alone still leaves you with a wrong number.

**Mechanism.** In `pulse 2.0/src/lib/analytics.ts`, `trackEvent()` `await`s the Supabase insert *before* it calls `gtag`. Two consequences:

1. If the insert is slow, hangs, or rejects, the gtag call is delayed or never runs. supabase-js resolves with an `{ error }` object rather than throwing, so the surrounding `try/catch` cannot see a rejected insert.
2. `initAnalytics()` is deliberately called only *after* auth resolves (`App.tsx:1796`), so GA4 is often not loaded yet at the moment the earliest and most important events fire. `demo_started` fires immediately inside the `signInAnonymously().then()` callback, which is the same tick that resolves auth. `trackEvent` checks `typeof window.gtag === 'function'` and silently no-ops when it isn't.

Mechanism (2) is the part not covered by the existing notes. The 2026-08-19 fix (PR #40) made the internal `session_started` insert fire-and-forget, which unblocked the *Supabase* write — and it did work: `signup_completed` went from zero rows for two weeks to 20 in this window. But `gtag` still sits after `await insertEvent(...)`, and GA4 initialization is still deliberately deferred until auth resolves. So the fix restored the durable store and left the GA4 mirror broken. (The remaining 20-vs-51 shortfall is the separate, still-open August design gap, not this race.)

**Impact.** Any GA4-based funnel, conversion report, or "is the site working" judgment is currently misleading. `ga4_funnel` returns `demo_started: 0` and reads as catastrophic failure when the product is actually converting.

**Worth knowing: `analytics_events` is NOT the source of truth for signups either.** For signups specifically, use `welcome_emails` joined to `auth.users` (filtered `is_anonymous = false` and `NOT is_test_email(email)`) — the same source the **Founder Dashboard's "Recent real signups" table** already uses via `get_founder_outreach_queue()`, shipped 2026-09-10 (PR #91). That table has been showing the correct number all along. Both `analytics_events` and GA4 undercount it.

This matches the interim rule set on 2026-08-07 ("the app signup list is the source of truth") — that rule is still right, and the Founder Dashboard is now the operational version of it. `analytics_events` remains the right source for in-app behavior (`note_logged`, `ai_used`, `demo_started`), where no separate ground truth exists.

**Before fixing:** the deferral decision from 2026-08-07 was made to protect the posting experiment, which ended 2026-08-21. That reason has expired, so this is now fixable on its own schedule. Use the agreed `signup_method` + idempotent-milestone design in `Known Bugs.md`; the gtag ordering is a separate, smaller change that can ship independently and would restore GA4 visibility for all three events at once.

---

## 2. Blog CTAs are untracked and unattributed, and the blog is ~97% of your traffic

> ### ⚠️ Already known — this is a re-confirmation, not a discovery
>
> Documented in **two** places already:
> - `docs/funnel-decisions.md`, "Known limitation" (2026-09-03): *"only the click-tracked paths above carry attribution. The many static `<a href>` / `<Link href>` links... do not get `lp`/UTM appended — converting those was judged out of scope for this pass."* **This was a deliberate scope decision, not an oversight.**
> - `docs/gsc-ga4-cross-source-analysis-2026-09.md` §0.2 (2026-09-07) quantified it: blog = 6% of `cta_click` events despite driving most traffic.
>
> **What this audit adds:** the exact count (**85 links across 74 of 87 posts**, all pointing to the same `?demo=true` URL), and the downstream consequence now that first-touch attribution is live — 7 of 7 attributed signups say `landing_page = "/"`, so the blog cannot appear in attribution data even in principle. The earlier docs predicted the gap; this confirms it is now actively biasing the attribution table.
>
> **The open decision is the one `funnel-decisions.md` already framed:** add click handlers to those links, or accept `first_touch_landing_page` staying null for that share of signups.
>
> **Partially resolved, PR #93, shipped and deployed.** The 3 welcome/intro-letter posts now have real `cta_click` tracking on their relevant in-body links, and the blog footer's `ctaSource` uses the actual post slug instead of the hardcoded `"blog"` value described above. The Welcome Letter Generator handoff into the app now preserves `lp`/UTM attribution. This covers the highest-traffic cluster, not all 85 links across all 74 posts, so the broader gap described in this finding (and in `BLOG_FUNNEL_INVESTIGATION.md`'s instrumentation backlog, item I1-I5) remains open for the rest of the blog.

**Evidence.**

- GSC, 28 days: the homepage got **62 clicks out of ~2,000 sitewide (3%)**. The top 4 pages are all blog posts (346, 315, 255, 214 clicks).
- `posts/*.md` contains **85 in-body links to `https://app.getshorthandapp.com?demo=true` across 74 of 87 posts.**
- Those render through `dangerouslySetInnerHTML` in `app/blog/[slug]/page.tsx`, so they are plain `<a>` tags. No `fireCtaClick`, no `withAttribution`, no `lp` param.
- Only the one footer `TrackedLink` on each post is instrumented. GA4 confirms: `cta_source` for 28 days is homepage 84, blog 4.
- **`first_touch_attribution` table, all 8 rows since it went live 2026-09-04: 5 say `landing_page = "/"`, 2 null, 1 is the test row. Zero say `/blog/...`**

**Why this matters more than it looks.** Attribution capture itself is working: 7 real signups since it went live 2026-09-04, 7 captured (the 8th row is the test). So this is not a broken feature. It is that blog visitors *physically cannot* carry attribution, because the links they click don't add it. The result is a systematic bias: the homepage gets credit for everything, and the blog, which is doing nearly all the acquisition work, appears to contribute nothing. Any decision to invest less in the blog based on current data would be built on an artifact.

**Sample-size honesty.** 7 signups is small, and attribution has only been live 8 days. On its own that proves little. What makes it a real finding rather than noise is the *mechanism*: the links are verifiably untracked in source, so a blog-attributed signup is currently impossible to record, not merely unlikely. The data is consistent with the mechanism rather than evidence for it.

**Impact.** This is your single largest measurement blind spot, and it is a quiet one because the data looks plausible rather than empty.

---

## 3. Free tools are orphaned, especially on mobile

**Evidence.**

- `/tools` and `/resources` appear in the **desktop nav only**. They are absent from the mobile menu (`app/page.tsx:223-231`) and absent from `components/Footer.tsx` entirely.
- Mobile is **40% of users** (1,026 of 2,796).
- Zero of 87 blog posts link to `/tools` or `/resources`. They are true orphans.
- Pageviews, 28 days: `/tools` **8**, `/resources` **15**.
- Search visibility is effectively nil: `/back-to-school-toolkit` had **1 click / 24 impressions**; `/report-card-comment-generator` had **0 clicks / 6 impressions**. Their traffic is almost entirely internal referral.
- The funnel leak is visible: `/blog/welcome-letter-to-parents-from-teacher` got **506 pageviews**, and `/back-to-school-toolkit`, which it links to, got **59**.

On desktop the Tools link is styled green and bold, which reads as a deliberate bet on it being the lead magnet. On mobile, that bet is not placed at all.

---

## 4. The Welcome Letter Generator has a school-network rate limit problem

**Evidence.** `lib/ratelimit.ts`:

- `welcome-letter-generator`: **5 requests per hour, keyed on IP** (`checkRateLimit` uses `identifier = ip`).
- Compare `report-card-generator` at 60/hour.

The paid paths in the same file go to real lengths to avoid exactly this: `checkPurchaseRateLimit` and `checkRestoreConfirmRateLimit` are deliberately *not* IP-primary, with comments explaining that "teachers at one school share a single outbound NAT address" and an IP-only limit "would punish an entire staff for one noisy device."

**Why this is a gap rather than a decision, confirmed from git history:** the free-tool limiters were added **2026-06-21** (`63bf9c6`, and `72d8f11` restoring 5/hr after a test). The NAT-aware paid limiters arrived **2026-07-30** (`5babad2`). So the school-network reasoning was worked out *five weeks after* the free-tool limits were set, and was never back-applied. The 5/hour figure was deliberate at the time; it just predates the insight that makes it risky.

**Failure scenario.** A grade-level team, PD session, or staff meeting where teachers try the generator on school wifi. The 6th person gets *"You've reached the free generation limit. Try again in about an hour."* They have no account, so the message is unexplainable and reads as the product being broken or bait-and-switch. This is the tool fed by your #1 and #2 traffic pages.

**Secondary:** `checkRateLimit` (unlike the two purchase-path helpers) has **no `try/catch`**. If Upstash is unreachable, the promise rejects and the route 500s, taking the tool down. The paid paths deliberately fail open; the free ones fail closed.

---

## 5. `app.getshorthandapp.com` has no robots.txt and is being indexed

**Evidence.**

- `curl https://app.getshorthandapp.com/robots.txt` → **404 NOT_FOUND**.
- The served HTML is a bare SPA shell: no `noindex`, no canonical, `<title>ShortHand</title>`, description "Student observation and classroom management for teachers."
- GSC confirms it is indexed and competing: `app.getshorthandapp.com/` 48 impressions, `/?demo=true&source=forgetting` 13, `/?signup=1` 3. All 0 clicks, average position 40-54.

**Impact.** A content-free JS shell is in the index under your brand. It cannot rank usefully (nothing to crawl), it splits brand signals with the marketing site, and the UTM'd variants being indexed is untidy. Low urgency, easy fix, worth a decision.

---

## 6. Trust: the homepage overstates what the legal pages carefully say

**Evidence.** `app/page.tsx:648`, Privacy Promise card:

> **"You Own the Data"** — "you can delete your account and every single note **instantly**. We **don't keep a copy** of your notes or student information."

`app/privacy/page.tsx:123` and `/delete-account` say, correctly and carefully:

> "Billing and subscription records **may be retained** after deletion where needed for accounting, disputes, fraud prevention, or legal compliance" and email-based deletion requests "may ask you for additional verification before processing."

The legal pages are genuinely good: specific subprocessors, named certifications, honest about OpenAI's 30-day retention, honest about data residency for BC/Nova Scotia. That is better than most edtech at this stage.

**The problem is the mismatch.** An administrator or district privacy reviewer who reads both will see the marketing card claim something stronger than the policy. "Instantly" and "we don't keep a copy" are the two specific words doing it. This is the kind of inconsistency that costs credibility precisely with the audience most likely to check, and it's unnecessary, since the real policy is already defensible.

*Flagging as a question, not legal advice: is the homepage card's wording something you want to align with the policy language?*

---

## 7. Smaller real issues

**Dead dependencies.** ~~`components/SplineHero.tsx` no longer uses Spline at all...~~ **FIXED, PR #94.** The unused `@splinetool/react-spline` and `@splinetool/runtime` packages were removed.

**No `prefers-reduced-motion` anywhere.** ~~Zero matches across the codebase...~~ **FIXED, PR #94.** `prefers-reduced-motion` support is live and verified in production.

**Hero video is keyboard-inaccessible.** `app/page.tsx:305`: no `controls`, no `tabIndex`, no `onKeyDown`, no ARIA, no `<track>`. Click-to-play only, so keyboard and screen reader users cannot play it.

**`WelcomeLetterClient` CTA is the odd one out.** `app/back-to-school-toolkit/WelcomeLetterClient.tsx:299-303` fires `fireCtaClick` but never calls `withAttribution`, unlike every other tracked CTA on the site. It also uses `next/link` for an external URL and passes no `event_callback`, so navigation can race the analytics beacon. Consistent with GA showing only **1** `welcome_letter_toolkit` click in 28 days.

**Sitemap omissions.** ~~`/features/import-roster` is linked from the homepage and indexable but missing from `app/sitemap.ts`.~~ **FIXED, PR #94.** `/features/import-roster` is now in the sitemap and remains index, follow. `/features/class-insights` remains intentionally excluded from the sitemap (deliberately `noindex` — correct as-is, not a bug).

**`/report-card-comment-library` is `noindex, nofollow`.** Reasonable for a paid page, but `nofollow` also means the link equity it receives from `/tools` and two blog posts dies there. Worth a deliberate decision now that the paywall is a working free slice.

**`/free-tool` still ranks at position 65** with 60 impressions despite being a permanent redirect to `/report-card-comment-generator`. Cosmetic, will decay on its own.

**`/how-it-works`** has both a live page file and a redirect to `/`. This is intentional and documented in `CURRENT_STATE.md`, and the page is correctly out of the sitemap. Noting it only so it isn't rediscovered as a bug: the file is retained for a future rebuild, and the redirect wins in production.

---

## Prior-work check: what was already known

I swept `Brain/Known Bugs.md`, `Brain/GSD.md`, `Brain/Decisions Log.md`, the last ~3 weeks of `Brain/Agent Handoff.md`, and all 13 docs in `docs/` to separate new findings from re-confirmations. Result:

| Finding | Status |
|---|---|
| 1. GA4 funnel blindness | **Partly known.** Undercount diagnosed 2026-08-07, deferred. New: total loss in GA4, the Supabase/GA4 split, the gtag-ordering mechanism, and that `analytics_events` undercounts signups too (20 vs 51). |
| 2. Blog CTAs untracked | **Known twice** (`funnel-decisions.md` known-limitation, cross-source analysis §0.2). New: exact scope (85 links / 74 posts) and confirmation it is now biasing live attribution data. |
| 3. Tools/Resources orphaned on mobile | **New.** No doc mentions the mobile menu or footer. Related but distinct from the `/tools` hub orphan-card issue fixed in PR #76. |
| 4. Welcome-letter rate limit | **New.** Confirmed via git history that the NAT reasoning postdates these limits by five weeks. |
| 5. App subdomain has no robots.txt | **New.** No mention in any doc. |
| 6. Homepage privacy wording vs policy | **New.** |
| 7. Smaller items (dead Spline deps, reduced-motion, video a11y, sitemap, `WelcomeLetterClient` attribution) | **New.** |

**Already fixed, correctly absent from this audit** (verified still fixed, not regressed): the `LeadGate` contradiction on the report-card generator (PR #75), the Tailwind-without-Tailwind styling bug (PR #76, now a CSS Module, and it was the only affected file), the blank-print bug, the `/tools` missing third card, and the `/free-tool` 9-second-session artifact (a redirect, not a UX problem).

---

## What I checked that is genuinely fine

Worth saying explicitly so it doesn't get re-audited:

- **SEO fundamentals are solid.** Every page checked has exactly one `<h1>`, a self-canonical, a unique title and description, and OG tags. `robots.ts` correctly allows the AI crawlers and blocks CCBot. Sitemap has 111 URLs and the date handling has a guard comment keeping it in sync with `dateModified`.
- **Server performance is good.** TTFB 0.15-0.22s across key pages, HTML 30-77KB, 11 JS chunks on the homepage.
- **Content renders without JS.** GSAP sets `opacity: 0` at runtime, not in SSR output, so no flash-of-invisible-content or JS-failure blank page.
- **Alt text is consistently present** on every `<Image>`.
- **Unit tests pass** (5/5, `lib/attribution.test.ts`). Playwright e2e specs exist for all the payment and tool paths.
- **The paid checkout/restore path is carefully built.** Fail-open rate limiting, no PII in analytics, server-verified fulfillment, non-enumerable failure reasons. It's the most rigorous code in the repo.
- **Blog internal linking is genuinely strong.** Top posts link to each other and to hub pages naturally, with real editorial framing rather than keyword stuffing.

---

## Adversarial check: were our assumptions wrong?

**"The homepage is the problem."** Mostly wrong. The homepage converts *well* by the one metric available: 12.11% CTR in search, by far the best on the site, and 84 of 95 tracked CTA clicks. It is just not where people land. 3% of clicks.

**"Small traffic is the real issue."** Partly true but not the whole story. ~2,000 search clicks in 28 days is real traffic. The issue is that it arrives on template/letter posts, and the path from there into the product is both weakly instrumented and, on mobile, weakly signposted.

**"Messaging emphasizes documentation when another feature does more work."** Possible, flagging with caution given sample size. Over 28 days: `ai_used` had **66 distinct users**, `note_logged` had **61**. AI is at least as central as documentation in actual use. Meanwhile `parent_email_sent` had only **4 users**, despite parent communication being the headline promise in the `<title>`, H1 and OG description. Too small to act on alone, but worth watching, and it is cheap to check again in a month.

**"There is a technical problem we're reading as a marketing problem."** Yes, and this is the main conclusion. The product converts: **51 real signups in 28 days**, plus 64 demo starts and 6 trial starts. GA4 says zero signups. That gap is a measurement defect, not a market signal.

**"We already knew about the analytics gap, so finding 1 is old news."** Half right, and worth stating plainly since it was nearly missed in this audit. The *undercount* was known and deliberately deferred. What changed is that it went from partial to total on the GA4 side while Supabase quietly stayed correct, and the specific mechanism for that (gtag ordering surviving the PR #40 fix) is not in any existing note. The risk of treating it as fully-known is that the August notes tell you GA4 is "incomplete but usable, baseline 5," which would today lead you to read a real zero as a real zero.

---

## Suggested order for tomorrow

1. **Fix the GA4 event loss** (finding 1). Until this is done every other number is untrustworthy. **Read `Brain/Known Bugs.md` (2026-08-07 entry) first** — the design is already agreed and reviewed, don't re-litigate it. Two independent pieces: the `signup_method` + idempotent-milestone wiring (the known part), and moving the `gtag` call off the far side of the `await` plus initializing GA4 earlier (the new part). The second is smaller and fixes all three missing events at once. The reason for deferring in August was the posting experiment, which is over.
2. **Instrument blog CTAs** (finding 2). 85 links, 74 posts, currently invisible. This is the one that changes what you know about acquisition.
3. **Raise the welcome-letter rate limit and stop keying it on raw IP** (finding 4). Real teachers on school wifi are hitting a wall on your best lead magnet.
4. **Put Tools and Resources in the mobile menu and the footer** (finding 3). Cheapest fix on this list.
5. Then the smaller items: robots.txt on the app subdomain, homepage privacy wording, `prefers-reduced-motion`, sitemap entry, dead Spline deps.

Items 1 and 2 are the ones worth doing before making any decision based on current analytics.
