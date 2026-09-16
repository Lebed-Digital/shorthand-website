# GA4 Cross-Domain Linker Audit — CLOSED, false positive

**Date:** 2026-09-16
**Status:** Closed. No code or GA4 console change made or needed.
**Origin:** Flagged as finding/backlog item B1 in `BLOG_FUNNEL_INVESTIGATION.md` (2026-09-12), which concluded a missing `linker`/`cookie_domain` config was severing session/client-id continuity between `getshorthandapp.com` and `app.getshorthandapp.com`.

---

## Original claim

Neither `app/layout.tsx`'s `gtag('config', ...)` call (website) nor `pulse 2.0/src/lib/analytics.ts`'s `gtag('config', ...)` call (app) passed a `linker` or `cookie_domain` argument. The investigation read 6 app-host sessions against 96 site `cta_click` events (a partial-month window) as evidence the client id was not surviving the domain hop, and recommended adding `linker: { domains: [...] }` to both `gtag('config')` calls plus adding each host to the other's GA4 referral exclusion list.

## What was actually true

`getshorthandapp.com` and `app.getshorthandapp.com` are apex and subdomain of the **same eTLD+1** (`getshorthandapp.com`), and both report into **one GA4 property under the identical measurement ID** `G-Y954JF2V55`. That is precisely the case GA4's default `cookie_domain: 'auto'` is built to handle: it writes the `_ga` cookie at the registrable-domain scope (`.getshorthandapp.com`), so the client id is already shared across the apex/subdomain boundary with **zero explicit configuration**. The `linker`/`_gl` URL-decoration mechanism is Google's documented solution for **separate root domains** (e.g. `site-a.com` → `site-b.com`), not an apex/subdomain pair sharing one property, and does not apply here.

Confirmed against current Google guidance (Analytics Help "[GA4] Set up cross-domain measurement", developers.google.com/gtagjs/devguide/linker) before concluding.

## Verification performed

**GA4 acquisition data, 90 days, cross-tabbed `hostName × sessionSource × sessionMedium`:**

| hostName | Sessions (90d) | `getshorthandapp.com / referral` row present? |
|---|---|---|
| `app.getshorthandapp.com` | 422 | **No.** Top sources: `google/organic` (160), `(direct)` (115), `accounts.google.com/referral` (17, real Google OAuth), `t.co/referral` (17, real Twitter/X), `students_screen` (30, in-app internal source) |
| `getshorthandapp.com` | ~6,350 | No `app.getshorthandapp.com/referral` row exists on this side either |

If the apex → subdomain hop were creating self-referral sessions, `getshorthandapp.com / referral` would appear as a source on `app.getshorthandapp.com`, and likely a large one, given the site sends thousands of organic sessions/month toward CTAs pointing there. It appears nowhere in 90 days of data. This is the direct, decisive signal: cross-domain measurement is working as GA4's default behavior describes, not broken.

## Conclusion

**Closed as not applicable.** No code change (no `linker`, no explicit `cookie_domain`). No GA4 console change (no unwanted-referral-list entries needed, since there is nothing to exclude). The original finding was a false positive caused by reading a partial-window, low-volume session count as evidence of a tracking defect, when it was actually a true low count reflecting the marketing-site → app funnel's real drop-off (see `BLOG_FUNNEL_INVESTIGATION.md` and the follow-on funnel drop-off investigation).

**Audit interpretation, corrected going forward:** absence of explicit `linker`/`cookie_domain` config is not itself a bug when both sides are apex + subdomain of the same eTLD+1 sharing one GA4 measurement ID. Do not re-open this without new evidence of an actual `X / referral` row appearing between these two specific hosts in GA4 data.

## What remains real and separate

`WEBSITE_AUDIT.md` finding 1, the `gtag`-ordering bug in `pulse 2.0/src/lib/analytics.ts` that causes `demo_started`/`signup_completed`/`trial_started` to be lost in GA4 (0 rows against real Supabase counts), is unrelated to this audit and is still open. It is a call-ordering/timing defect inside the app's own `trackEvent()`, not a cross-domain issue, and needs no linker work alongside its fix.
