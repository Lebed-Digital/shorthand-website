# Micro-Product Payment Architecture Audit — 2026-09-09

**Type:** Investigation only. No code changed, no branch created, no Stripe or Supabase changes made.

**Question:** Can the payment architecture built for the Report Card Comment Library (RCCL) be generalized so that adding paid micro-product #2, #3, #4 at $2.99-$7.99 is mostly configuration plus the tool page, rather than repeating the Stripe/entitlement build each time?

**Short answer:** The architecture is unusually good and about 70% generic in *shape*, but it is single-product by construction in three specific places. A second product cannot be added by configuration today. However, the binding constraint is not architectural, it is demand: there are **zero real customer purchases** of product #1 to date. Recommendation is **C, with a qualification** (see Section 6).

---

## 1. Phase 1 — The existing flow, end to end

### 1.1 Route and file map

| Stage | File |
|---|---|
| Product/paywall page | `app/report-card-comment-library/page.tsx`, `PaywallClient.tsx` |
| Checkout session creation | `app/api/report-card-checkout/create-session/route.ts` |
| Stripe client (restricted key) | `lib/stripe.ts` |
| Success page | `app/report-card-comment-library/success/page.tsx`, `SuccessClient.tsx` |
| Success verification | `app/api/report-card-checkout/verify-session/route.ts` |
| Fulfillment (shared) | `supabase/functions/_shared/fulfillment.ts` |
| Fulfill endpoint | `supabase/functions/report-card-checkout-fulfill/index.ts` |
| Stripe webhook | `supabase/functions/report-card-checkout-webhook/index.ts` |
| Access revalidation | `supabase/functions/report-card-access-revalidate/index.ts` |
| Restore by email | `supabase/functions/report-card-access-restore/index.ts` |
| Token mint/verify (Deno) | `supabase/functions/_shared/access-token.ts` |
| Token verify (Node/Vercel) | `lib/report-card-access.ts` |
| Gate decision | `lib/report-card-gate.ts` |
| Edge Function client | `lib/report-card-functions.ts` |
| Cookie refresh | `app/api/report-card-access/refresh/route.ts` |
| Restore routes | `app/report-card-comment-library/restore/**` |
| Rate limiting | `lib/ratelimit.ts` |
| Schema | `supabase/migrations/20260728000000_report_card_purchases.sql` |

### 1.2 The flow

1. **Checkout.** `PaywallClient.startCheckout()` POSTs to `/api/report-card-checkout/create-session`. That route reads a single `STRIPE_PRICE_ID` env var, creates a Stripe Checkout Session (`mode: 'payment'`, `payment_method_types: ['card']`), stamps `metadata: { rccl_price_id: priceId }`, and returns `session.url`. The browser navigates there.

2. **Success redirect.** Stripe returns to `/report-card-comment-library/success?session_id={CHECKOUT_SESSION_ID}`. `SuccessClient` POSTs the session id to `/api/report-card-checkout/verify-session`.

3. **Fulfillment.** `verify-session` calls the `report-card-checkout-fulfill` Edge Function via `callReportCardFunction()`, authenticated with the shared bearer secret `REPORT_CARD_FUNCTIONS_SECRET`. The function delegates to `fulfillCheckoutSession()`, which retrieves the session from Stripe with `expand: ['line_items']` and verifies, in order: `status === 'complete'`, `payment_status === 'paid'`, exactly one line item, line item price ID equals the Supabase-side `STRIPE_PRICE_ID`, quantity 1, `amount_total === 499`, `currency === 'usd'`. Session metadata is explicitly *not* trusted as proof (it is logged as a consistency check only, `fulfillment.ts:116-122`), because our own route wrote it.

4. **Record.** An idempotent insert into `report_card_purchases` keyed on the unique `stripe_checkout_session_id`. A 23505 unique violation (webhook racing the success page) is caught and the winner's row read back (`fulfillment.ts:170-191`).

5. **Entitlement.** `signAccessToken()` mints an HMAC-SHA256 token over `{ purchaseId, exp, revalidateAfter }` using `RCCL_TOKEN_SECRET`. `verify-session` re-verifies the token locally before writing it to the `rccl_access` httpOnly cookie (30-day hard expiry, `sameSite: 'lax'` so the Stripe cross-site redirect works).

6. **Webhook.** Stripe calls the Supabase Edge Function URL *directly*, never through Vercel. It subscribes to `checkout.session.completed` only, verifies with `constructEventAsync` (the async variant is required under Deno), and calls the *same* `fulfillCheckoutSession()`, so the two paths cannot drift. Transient reasons (`db_error`, `session_lookup_failed`) return 500 so Stripe retries; everything else returns 200.

7. **Repeat visits.** `evaluateAccess()` in `lib/report-card-gate.ts` verifies the cookie's HMAC and hard expiry locally, with no network call, until `revalidateAfter` (24h) passes. Then it calls `report-card-access-revalidate`, which re-checks `status = 'paid'` in the database. The state table at `report-card-gate.ts:10-31` is binding, and its most important rule is that a fresh token is **never** minted after `lookup_failed`, so a Supabase outage cannot be used to renew access indefinitely.

8. **Restore.** `report-card-access-restore` handles `request` (emails a 30-minute signed link via Resend) and `confirm` (exchanges it for a real access token). `request` always returns `{ ok: true }` regardless of match, to prevent purchase enumeration.

### 1.3 Answers to the specific questions asked

- **Accounts required:** No. There is no Supabase Auth user, no login, no password.
- **Access key:** Entitlement is tied to a **purchase row id**, carried in a signed httpOnly cookie. So access is per-browser, with **email as the recovery channel** (restore-by-email re-mints a cookie on a new device).
- **Vercel holds no Supabase key at all** for this feature, not even the anon key. All privileged DB access is inside Edge Functions. Vercel's Stripe key is *restricted* to "Checkout Sessions: Write" only.
- **Analytics:** **None** *(at the time of this audit)*. `lib/gtag.ts` exposed only `fireCtaClick`. Grep confirmed no purchase, begin_checkout, or conversion event fired anywhere in the checkout or success path. **RESOLVED 2026-09-09 by PR #80**, see handoff §24.
- **Automated tests:** **None for the paid flow** *(at the time of this audit)*. `tests/` contained only `parent-communication-log`, `report-card-generator` (the free AI tool), `resource-offer`, and `welcome-letter`. All RCCL verification was manual (handoff §13.11, §16, §20). **RESOLVED 2026-09-09 by PR #80**: `tests/report-card-payment-path.spec.ts`, 16 tests.
- **Refunds:** Not automated. The webhook ignores `charge.refunded`. Schema and every read path already support `status in ('paid','refunded','revoked')`, but no writer for that transition was built. Manual SQL procedure documented at handoff §22.1.
- **Test vs production:** Now fully live. Handoff §20.3 records the production verification pass.

---

## 2. Phase 2 — Reusability classification

| Component | Class | Notes |
|---|---|---|
| `lib/report-card-access.ts` (token sign/verify, cookie opts) | **1. Generic** | Payload is `{ purchaseId, exp, revalidateAfter }`. Nothing product-specific except the cookie *name* constant and the env var *name*. |
| `supabase/functions/_shared/access-token.ts` | **1. Generic** | Same wire format, deliberately duplicated for Deno. |
| `supabase/functions/_shared/auth.ts` | **1. Generic** | Bearer-secret check and CORS. |
| `lib/report-card-gate.ts` (`evaluateAccess`) | **2. Small refactor** | The decision logic is fully generic; only the hardcoded function name `'report-card-access-revalidate'` and the single cookie name bind it. |
| `lib/report-card-functions.ts` | **2. Small refactor** | `ReportCardFunction` is a closed union of three literal names. Adding a product means widening the union or parameterizing. |
| `create-session/route.ts` | **2. Small refactor** | Structurally generic, but reads one global `STRIPE_PRICE_ID` and hardcodes both `success_url` and `cancel_url` to library paths. |
| `verify-session/route.ts` | **2. Small refactor** | Generic relay; hardcodes the fulfill function name and the single cookie. |
| `_shared/fulfillment.ts` | **3. Hard-coded** | `EXPECTED_AMOUNT_TOTAL = 499` is a module constant. Table name `report_card_purchases` is a string literal. Expected price comes from one env var. **This is the main blocker.** |
| Webhook function | **3. Hard-coded** | One endpoint, one signing secret, one price. Not per-product by design, but currently has no way to route by product. |
| `report_card_purchases` table | **3. Hard-coded** | No `product_key` column. One table per product is the only path without a migration. |
| Restore function | **3. Hard-coded** | Table literal, plus the email subject and body text name the library, plus `RCCL_SITE_URL` builds a library-specific confirm URL. |
| `lib/ratelimit.ts` limiters | **3. Hard-coded** | Five limiter keys are string literals prefixed `report-card-*`. |
| Env var naming (`RCCL_*`) | **3. Hard-coded** | Product-branded names for what is actually shared infrastructure. |
| Paywall/library/success/restore UI | **4. Product-specific** | Correctly so. Inline-styled, copy-specific. Should not be abstracted. |
| `lib/report-card-comments.ts`, `report-card-teaser.ts` | **4. Product-specific** | Content layer. |

**Verdict on "truly reusable or only looks reusable":** the *security model* is genuinely reusable and is the expensive, hard-won part (idempotency, race handling, the never-mint-after-`lookup_failed` rule, anti-enumeration, the two-key Stripe split). The *plumbing* is single-tenant. It looks more reusable than it is because the file organization already separates concerns cleanly, but every seam is bound to one product by a string literal or a scalar env var.

---

## 3. Phase 3 — Modeling product #2 ("Positive Parent Email Personalizer", $3.99)

Not built. This is what it would cost today, with no refactor.

| Item | What is needed |
|---|---|
| Stripe config | New Product + Price in live mode **and** test mode. No new restricted key needed (the existing one works for any price). Webhook: the existing endpoint already receives all `checkout.session.completed` events, so no new endpoint, **but** fulfillment would reject the new price as `product_mismatch`. |
| DB schema | New migration. Either a second table `parent_email_purchases`, or add `product_key text not null default 'report-card-comment-library'` to the existing table plus an index change. |
| Env vars | Today `STRIPE_PRICE_ID` is a scalar in **two** separate secret stores (Vercel and Supabase). A second product needs a second variable in both, or a JSON map. |
| Routes | New `create-session` and `verify-session` routes, or parameterize the existing ones. New success and cancel routes. |
| Entitlement | New cookie name (or a product-scoped cookie), and `evaluateAccess()` must learn which product it is gating. The amount check must stop being a module constant. |
| Edge Functions | `fulfillCheckoutSession` must take a product config rather than read one env var. Restore must know which table and which email copy. |
| Rate limiters | New limiter keys, or rename existing ones to be product-agnostic. |
| Checkout UI | New paywall component. Genuinely new work, correctly so. |
| Analytics | Does not exist for product #1 either. Would need building once. |
| Tests | Do not exist for product #1 either. |
| Email | Restore email subject and body hardcode the library name. Needs templating. |

**Burden estimate, no refactor first: MEDIUM-to-LARGE.** It is not LARGE in the sense of re-deriving the security model, that thinking is done and correct. It is LARGE in the sense that copy-pasting five files and four Edge Functions per product multiplies the surface where a `STRIPE_PRICE_ID`-style mismatch can silently eat a real payment. That already happened once (§19).

**Burden after the Section 4 refactor: SMALL.**

---

## 4. Phase 4 — The minimum generalization

The smallest safe change is *not* a rewrite. It is to introduce one product registry and thread a `productKey` through the existing paths, leaving every security decision exactly as written.

### 4.1 A shared product config

```
// lib/products.ts  (and a Deno twin, same duplication rationale as access-token.ts)
{
  key:            'report-card-comment-library',
  slug:           '/report-card-comment-library',
  name:           'Report Card Comment Library',
  priceEnvVar:    'STRIPE_PRICE_ID_RCCL',
  expectedAmount: 499,
  currency:       'usd',
  cookieName:     'rccl_access',
  successPath:    '/report-card-comment-library/success',
  cancelPath:     '/report-card-comment-library',
  restorePath:    '/report-card-comment-library/restore/confirm',
  emailSubject:   'Your Report Card Comment Library access',
  analyticsKey:   'report_card_comment_library',
}
```

Note one deviation from the shape suggested in the brief: **keep the price ID in an env var and the expected amount in code.** The current design deliberately hardcodes the amount so that a Stripe dashboard price edit cannot silently change what the app accepts (`fulfillment.ts:11-18`). That property is worth preserving. Moving the price ID itself into committed config would not be, since it differs between test and live mode.

### 4.2 The five changes

1. **Schema:** add `product_key text not null default 'report-card-comment-library'` to `report_card_purchases`. The existing row keeps working via the default. Index on `(lower(email), product_key)`.
2. **`fulfillment.ts`:** take `productKey`, look up config, replace the three module constants and the single env read. Everything else unchanged.
3. **Checkout and verify routes:** accept `productKey` in the body, validate it against the registry allowlist (never pass a raw client string into an env lookup), derive URLs from config.
4. **Gate:** `evaluateAccess(productKey, throttle?)`, cookie name from config.
5. **Rate limiters:** key by `${tool}:${productKey}`.

The webhook needs **no change**: it already resolves the session from Stripe and can look up the product by matching the line item price against the registry.

### 4.3 What this deliberately does not do

No abstract "PaymentProvider" interface, no per-product Edge Functions, no plugin system. The Edge Functions stay four in number regardless of how many products exist. That is the property that makes this cheap.

---

## 5. Phase 5 — Economics

### 5.1 The number that dominates every other consideration

Handoff §22.2: **"one real test purchase, fully refunded, zero real customer purchases to date."** Product #1 has been live since 2026-07-30. The blog CTA went live 2026-07-30 and had 0 clicks as of 2026-08-01.

And `docs/micro-product-opportunity-analysis-2026-09.md`, written today from GSC and GA4 data, concludes: *"Nothing scores STRONG. The single best candidate is MEDIUM, and the honest recommendation is to not build a new micro-product yet"* — and ranks the **already-built** Report Card Comment Library as the strongest candidate, noting it is effectively unlaunched.

Generalizing a payment system to sell products 2 through 4 when product 1 has sold zero units is optimizing the wrong constraint.

### 5.2 One-time costs, shareable across all future products (A)

- The security model: idempotent fulfillment, race handling, HMAC entitlement, revalidation state table, anti-enumeration. **Done and paid for.**
- Two-key Stripe split and the no-Supabase-key-in-Vercel posture. **Done.**
- Webhook endpoint. **One endpoint serves all products, already.**
- Resend integration. **Done.**
- The Section 4 refactor itself: SMALL, and it pays for itself at product #2.

### 5.3 Recurring per-product work (B)

- Stripe Product and Price in two modes: manual dashboard work, roughly ten minutes, unavoidable, fine.
- Two env vars (Vercel + Supabase). **This is the dangerous one.** The duplicated `STRIPE_PRICE_ID` across two secret stores already caused a real charged payment to silently fail fulfillment (§19). That risk scales linearly with product count and is the single strongest argument for the registry: a config map makes the mismatch a code review artifact rather than a dashboard oversight.
- The tool or page itself: genuinely per-product, correctly so.
- Post-launch support surface: refunds are manual SQL per refund. At $3.99 with meaningful volume this becomes annoying; at current volume it is free.

### 5.4 Things that would make $3.99 products unattractive

| Risk | Present? |
|---|---|
| Per-product webhook complexity | No. One endpoint handles all. |
| Account requirement | No. Cookie plus email restore, no login. Good for micro-products. |
| Separate Supabase schema per product | Only if the refactor is skipped. |
| Duplicate checkout code | Yes, if skipped. This is the main cost. |
| Fulfillment emails | Not needed. Access is instant via cookie. |
| Refund and revocation | Manual, unautomated. Tolerable at low volume. |
| Support edge cases | Restore-by-email is the whole support surface. Well designed. |
| Test burden | **Zero automated tests existed at audit time.** Every product cost a full manual production test pass including a real charge and refund. **Partly resolved 2026-09-09 (PR #80)**: 16 website-side tests now cover the paid path, so a second product would inherit the harness rather than build one. Edge Function internals remain manual-only. |
| Tax | Stripe Tax not enabled. At $3.99 US-only this is a deferred concern, not a blocker. |
| Stripe fees | 2.9% + $0.30 on $3.99 is roughly 10.4%. On $2.99 it is roughly 12.9%. Real, but not disqualifying. |

---

## 6. Phase 6 — Recommendation

### **C. DO NOT GENERALIZE YET** — with one qualification.

The architecture is not a bad fit (not D). It is genuinely well built for exactly this class of product: no accounts, instant access, cheap recovery, one webhook, strong security posture. But it cannot be reused as-is (not A), and a refactor now would be abstraction ahead of demand (not B).

**Why C rather than B:**

1. Product #1 has sold **zero units** to real customers. The second product's payment plumbing is not the bottleneck; demand validation is.
2. Today's own opportunity analysis independently recommends not building a new micro-product yet, and names the existing unlaunched library as the strongest available candidate.
3. The refactor is SMALL and does not get harder by waiting. Nothing about the current code makes it more expensive to generalize in three months. There is no compounding cost to deferring.
4. Refactoring the live payment path of a product whose entire revenue history is one refunded test purchase carries strictly more downside than upside right now.

**The qualification:** the moment there is a *decision to build product #2*, do the Section 4 refactor **first**, as a separate PR, before writing product #2's page. Do not copy-paste the four Edge Functions. The §19 incident is the evidence: duplicated single-valued price config across two secret stores silently ate a real payment once already, and copy-paste would institutionalize that failure mode.

**The higher-value move right now** is the gap this audit found that is not about reuse at all: **there are no purchase analytics and no automated tests on a live payment path.** `fireCtaClick` is the only event in `lib/gtag.ts`, and nothing fires on begin_checkout, purchase, or restore. Product #1 could be converting at some non-zero rate and there would be no instrumented way to know, only the Supabase row count. That is worth fixing before any second product, and it is a prerequisite for judging whether a product #2 is warranted at all.

> **UPDATE 2026-09-09 — this recommendation was acted on the same day.** PR #80
> (squash-merged as `7d0f2a8`) added the six funnel events and 16 payment-path
> tests, deliberately WITHOUT generalizing the architecture: no product
> registry, no `product_key` column, no `STRIPE_PRICE_ID` change, no env
> renames. The Phase 6 recommendation below (**C, do not generalize yet**)
> therefore still stands unchanged, and its qualification is now the live
> instruction: when product #2 is actually decided on, do the Section 4
> refactor first, as its own PR. Full record in handoff §24.
>
> What this changes for a future product-#2 decision: the conversion data
> needed to judge whether one is warranted is now being collected, where before
> it was not. Give it a report-card season before reading anything into it.

---

## 7. Appendix — Design decisions worth preserving in any future refactor

1. **Never mint a fresh token after `lookup_failed`** (`report-card-gate.ts:25-31`). Prevents indefinite renewal via an induced or waited-out outage.
2. **`not_paid` and `lookup_failed` are distinct** and must never be collapsed. They were, until 2026-07-29, and it told paying customers their purchase did not exist.
3. **Line items, not metadata, prove the product** (`fulfillment.ts:81-94`). Our own route wrote the metadata, so it cannot be proof.
4. **`constructEventAsync`, not `constructEvent`**, under Deno.
5. **The two Stripe SDK major versions are intentional** (Deno pins 19.2.0, Vercel resolved to ~22.3.2). They exchange only a session id string. Do not align them casually.
6. **Restore always returns `{ ok: true }`** regardless of match. Anti-enumeration.
7. **Amount hardcoded in code, price ID in env.** A dashboard price edit must not silently change what the app accepts.
