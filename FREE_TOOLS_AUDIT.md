# ShortHand Free Tools Reliability Audit

Read-only audit. Date: 2026-09-12. No code or production data was modified.

Scope: every publicly reachable tool, generator, and anonymous endpoint on getshorthandapp.com, plus the anonymous-facing parts of the paid Report Card Comment Library.

## Remediation status (updated 2026-09-13)

| Finding | Status | Shipped in |
|---|---|---|
| F1. `checkRateLimit()` fails closed on an Upstash outage | **Fixed** | PR #84 |
| F4. No analytics on generation at all | **Fixed** | PR #85 |
| F5. Raw OpenAI error messages forwarded to teachers | **Fixed** | PR #86, merge `c139d51` |
| F2. Welcome letter limit too tight for a school | Open | |
| F3. Refine has its own separate bucket | Open | |
| F6. A failed OpenAI call still consumes a rate-limit token | Open | |
| F7. Email capture writes to Supabase from the browser | Open | |

The three fixed items were the ones the audit recommended doing first, in that order. What remains is the tuning work (F2, F3, F6), which needs F4's data to settle, plus F7.

F4's instrumentation has been live since 2026-09-12 but had not accumulated meaningful data as of this update. Read it before deciding F2, per the audit's own reasoning: the limit question is unmeasurable without it.

## Executive Summary

The website exposes **two AI generators, one print-only tool, one email capture, and four paid-path endpoints**. The AI generators are the real subject here: they cost money per request and depend on two third parties (Upstash, OpenAI).

Three things are true at once, and they need to be held together:

**1. The Welcome Letter Generator's limit is genuinely too tight for a school.** 5 generations per hour, keyed on raw IP. Behind one school NAT that is 5 letters for the entire building, not 5 per teacher. Back-to-school is precisely when many teachers do this in the same week, on the same Wi-Fi, in the same prep period. The codebase already knows this: `lib/ratelimit.ts` carries three separate comment blocks explaining that school NAT makes IP-primary keying wrong, and those comments sit directly above limiters that avoid it. The free tools never got that treatment.

**2. The severity is lower than it looks right now, and that is the reason to fix it cheaply rather than urgently.** GA4 for the last 28 days shows `/back-to-school-toolkit` at 63 sessions / 53 users, and the report card generator does not appear in the top 40 pages at all. At that volume, six teachers colliding in one hour is uncommon. The blog posts that feed these tools are the traffic (the top three pages are all welcome-letter posts, 1,332 sessions combined), so the exposure grows exactly when a post starts converting. This is a trap that is currently unsprung, not a fire.

**3. There is one clear correctness bug, independent of tuning.** `checkRateLimit()` (the anonymous path) has **no try/catch**, while its two siblings `checkPurchaseRateLimit()` and `checkRestoreConfirmRateLimit()` both have one with a comment explaining why failing open matters. If Upstash is unreachable, the paid endpoints keep working and every free tool returns a generic 500. The free tools fail *closed* by accident, not by decision. That asymmetry is the single most defensible finding in this audit, because it does not require agreeing with me about what the right limit is.

Secondary but real: **there is no analytics on generation at all.** No event fires on generate, success, failure, or 429. There is no way to answer "is the limit actually blocking teachers" with data, which is why this audit had to reason from page sessions instead of from block counts. Whatever is decided about limits, the instrumentation gap is what makes the decision unmeasurable.

Also flagged: the optional email capture writes to Supabase **directly from the browser** with no rate limit and no server route in front of it.

## Tool Inventory

### Anonymous AI generators (cost money per request)

| | Report Card Comment Generator | Welcome Letter Generator | Welcome Letter Refine |
|---|---|---|---|
| **Page** | `/report-card-comment-generator` | `/back-to-school-toolkit` | same page, second action |
| **Route** | `POST /api/free-tool` | `POST /api/welcome-letter` | `POST /api/welcome-letter-refine` |
| **Purpose** | One report card comment from chips + optional context | Parent welcome letter from name/grade/subject/tone | Rewrite an existing letter from instructions |
| **Login required** | No | No | No |
| **Rate limit** | **60 / hour** | **5 / hour** | **10 / hour** |
| **Rate-limit key** | Raw IP (`x-forwarded-for[0]`) | Raw IP | Raw IP |
| **Failure behavior** | Fails **closed** on Upstash error (unhandled throw → 500) | Same | Same |
| **External deps** | Upstash Redis, OpenAI | Upstash Redis, OpenAI | Upstash Redis, OpenAI |
| **Model** | `gpt-5.6-luna`, reasoning `none`, temp 0.7, `max_completion_tokens: 200` | same model, temp 0.8, **600 tokens** | same model, temp 0.7, **600 tokens** |
| **Max request size** | `prompt` ≤ 1000 chars | name ≤ 100, subject ≤ 100, grade + tone from fixed allowlists | letter ≤ 3000, instructions ≤ 500 |
| **Abuse controls** | Length cap, rate limit, 30s timeout | Length caps, **enum validation on grade/tone**, rate limit, 30s timeout | Length caps, rate limit, 30s timeout |
| **Fail open / closed** | **Closed** (unintended) | **Closed** (unintended) | **Closed** (unintended) |
| **User-facing error** | 429: "You've reached the free generation limit. Try again in about an hour." Other: raw upstream message | same | same |
| **Analytics** | **None on generation.** Only `cta_click` on the two downstream CTAs | **None on generation.** Only `cta_click` | **None** |
| **Mobile behavior** | Works. Mic input via WebSpeech (Chrome/Android only, silently absent on iOS Safari). Result is an editable textarea, `navigator.clipboard` copy | Works. Same editable-textarea and clipboard pattern. No mic | n/a |

Note on the comment generator: the client sends a **fully client-constructed `prompt` string**, not structured fields. The server does no shape validation beyond `length <= 1000`. The welcome letter route is the better-built of the two, it validates grade and tone against allowlists and assembles the prompt server-side.

### Non-AI public tools

| Tool | Route | Notes |
|---|---|---|
| Parent Communication Log | `/tools/parent-communication-log` | **Entirely client-side.** Print-only (`window.print()`). No fetch, no storage, no backend, no cost, no abuse surface. Nothing to protect. |
| Tools hub | `/tools` | Static listing. Links to the two generators. |
| Resources hub | `/resources` | Static listing. |

### Anonymous surface on the paid path

| Endpoint | Limit | Key | Failure mode |
|---|---|---|---|
| `POST /api/report-card-checkout/create-session` | 10 / h | Raw IP | **Closed** (uses `checkRateLimit`) |
| `POST /api/report-card-access/restore` | 5 / h | Raw IP | **Closed** (uses `checkRateLimit`) |
| `POST /api/report-card-access/refresh` | 12 / h | **Hashed purchase id + hashed IP** | **Open**, deliberate, commented |
| `GET /report-card-comment-library/restore/confirm` | 8 / h per link **and** 60 / h per IP | **Hashed token + hashed IP** | **Open**, deliberate, commented |
| Optional email capture (component on both generators) | **None** | n/a | Direct browser → Supabase insert, no server route |

The bottom two rows are the well-designed ones and are worth reading as the template. The top two use the same naive IP keying as the free tools.

## School Network Simulation

Assume one school, one outbound NAT address, which is the normal case for K-8 districts.

### Scenario A: Six teachers, same Wi-Fi, during lunch

- **Welcome Letter: fails.** Teachers 1 through 5 get a letter. Teacher 6 gets "You've reached the free generation limit. Try again in about an hour." Teacher 6 has generated nothing. If any of the first five clicked Generate a second time to try a different tone, the wall arrives at teacher 3 or 4 instead.
- **Refine makes it worse, not better.** The refine limiter is a separate 10/hour bucket, so the building gets 5 letters but 10 refines. A teacher who generates once and refines twice has consumed 1 of 5 from the scarce bucket and 2 of 10 from the plentiful one. The budgets are allocated backwards relative to how the UI is actually used.
- **Report Card Comment: fine.** 60/hour across six teachers is roughly 10 comments each. Comfortable.

### Scenario B: Twenty teachers during PD

This is the realistic worst case, and it is exactly the context where someone demos a free tool to a staff.

- **Welcome Letter: fails hard.** 5 of 20 succeed. **15 teachers see a failure message on first contact with the product**, in a room, at the same moment, with the founder's name on the screen. The message tells them to come back in an hour, which after PD means never.
- **Report Card Comment: marginal.** 60/hour ÷ 20 teachers = 3 each. One generate plus two refines and a teacher is done. Plausible during a 45-minute session that a PD room exhausts this. Not currently a problem at observed traffic, but this is the limit that would break at the next tier of success.

### Scenario C: One teacher retrying because the result was not what they wanted

This is normal, expected, healthy behavior. The UI actively invites it: a Refine box, a "New" button, three tone buttons that produce deliberately different letters.

- **Welcome Letter: the UI promises more than the limit allows.** Three tone options exist. Trying all three costs 3 of 5. Trying all three for two grade levels is impossible. A teacher exploring the tool exactly as designed hits the wall alone, on their own home Wi-Fi, with no one else involved.
- **Report Card Comment: fine.** 60/hour absorbs heavy iteration on one student.

### Scenario H: District NAT, many legitimate users

Worse than Scenario B, and it does not require anyone to be in the same room. A district-level NAT can put hundreds of schools behind a handful of addresses. Under that, 5/hour is effectively 5 per district and the tool is broken for everyone downstream of it, permanently, at random, with no pattern the user can perceive. There is no signal in the current system that would reveal this is happening, because nothing counts 429s.

An important second-order effect: **corporate/district NAT addresses are shared and long-lived**. One bad actor or one broken script behind a district NAT poisons the bucket for every teacher in that district for the following hour, and nothing distinguishes them.

## Abuse Scenarios

### Scenario D: A bot hammers the endpoint

- **Detection: none.** No analytics, no alerting, no counters. `console.log` lines go to Vercel logs, which nobody is watching in real time. Discovery would be via an OpenAI bill.
- **Bound per IP holds.** A single-IP bot gets 60 comments/hour + 5 letters/hour + 10 refines/hour. Cost is bounded and small.
- **The bound is trivially defeated by rotating IPs.** IP is the only identity. There is no proof-of-work, no CAPTCHA, no origin check, no bot signal. A rotating-proxy attacker is limited only by proxy count, and each IP re-earns a fresh 60+5+10.
- **The refine route is the most expensive per call.** It accepts 3000 chars of input and produces up to 600 output tokens, and unlike the other two it is happy to be fed 3000 chars of arbitrary attacker text. It is a general-purpose "rewrite this text" endpoint at 10/hour/IP with no content constraint. That is the best free LLM proxy on the site.
- **Comment generator accepts an arbitrary prompt.** `body.prompt` is passed to the model with only a 1000-char cap. The system prompt constrains output toward report card comments, but the route is closer to an open text endpoint than the welcome letter route is. Output is capped at 200 tokens, which limits its usefulness as a stolen LLM.
- **Cost ceiling is genuinely low.** With `reasoning_effort: none` and 200/600-token output caps on a small model, even sustained single-IP abuse is cents per hour. **Cost is not the pressing risk. Reliability for real teachers is.**

### Scenario G: A teacher double-submits

Handled, but by luck rather than design. Both clients set `loading` and disable the Generate button while a request is in flight, so a fast double-click does not fire twice. There is no idempotency key and no server-side dedupe, so a genuine double-submit (two tabs, or a mobile browser retrying a request) would consume two tokens from the bucket. At a 60/hour limit that is noise. At a 5/hour limit that is 40% of a school's hourly budget.

## Dependency Failure Behavior

### Scenario E: Upstash is unavailable

**This is the bug.** `lib/ratelimit.ts:178-193`:

```ts
export async function checkRateLimit(req, tool) {
  const ip = getIP(req);
  const identifier = `${ip}`;
  const { success } = await limiters[tool].limit(identifier);   // ← no try/catch
  ...
}
```

`limiters[tool].limit()` throws when Redis is unreachable. Nothing catches it in `checkRateLimit`. In each route the call sits **outside** the route's own try/catch (which only wraps the OpenAI fetch), so the throw escapes to the Next.js runtime and the user gets a generic 500 or a framework error page, not even the tool's own error UI.

Consequence: **an Upstash outage takes down all three free generators plus checkout-session creation plus restore-request, while the paid library keeps working.** Checkout creation going down during an Upstash blip is its own revenue-affecting side effect that probably nobody has considered, `create-session` uses `checkRateLimit` too.

The contrast is what makes this a bug rather than a stance. The same file, ~40 lines earlier:

```ts
} catch (e) {
  // Redis unreachable. Fail open on the limiter itself: this guard exists to
  // bound cost, not to enforce access ...
  // Failing closed here would turn an Upstash blip into a site-wide lockout
  // of paying customers.
  return { blocked: false };
}
```

That reasoning applies verbatim to the free tools. The guard there also exists to bound cost, not to enforce access. Nobody wrote it down for the free path, so the free path does the opposite.

### Scenario F: OpenAI is slow or unavailable

Better handled, with one sharp edge.

- **Timeout: 30s** via `AbortSignal.timeout(30_000)` on all three routes. Reasonable, though 30 seconds is a long time to stare at "Writing your letter..." on a phone with no progress indication.
- **Non-OK upstream: the raw OpenAI error message is forwarded to the user.**
  ```ts
  { error: { message: err?.error?.message ?? 'AI request failed.' } }
  ```
  A teacher can be shown OpenAI's internal phrasing: rate limit messages naming an org, quota language, model identifiers. This is a small information leak and a bad UX, a teacher seeing "Rate limit reached for gpt-5.6-luna in organization org-..." has no idea what to do.
- **Timeout / network throw: `e.message` is returned directly,** so the user can see `"The operation was aborted due to timeout"`. Same problem, worse phrasing.
- **Upstream 429 passes through as a 429** with OpenAI's message, which will read to the user as if they personally hit a limit when the site's own limit was never reached.
- **A failed call still consumes the user's rate-limit token.** The limiter is checked and decremented before OpenAI is called. If OpenAI errors three times, the teacher has burned 3 of 5 and received nothing. On the welcome letter that is more than half the school's hourly budget spent on outages.

## Findings

Ranked by severity. Only actual issues.

---

### F1. `checkRateLimit()` fails closed on Upstash error, unlike every other limiter in the file
**Severity: High** · `lib/ratelimit.ts:178-193`

No try/catch. An Upstash outage becomes a 500 on `/api/free-tool`, `/api/welcome-letter`, `/api/welcome-letter-refine`, `/api/report-card-checkout/create-session`, and `/api/report-card-access/restore`. Because the call sits outside each route's try/catch, the user does not even get the tool's own error card.

This is the strongest finding because it does not depend on any opinion about correct limit values. The file's two other limiter helpers catch and fail open, with comments explaining that the guard bounds cost rather than enforcing access. The free path contradicts its own codebase. The checkout-session blast radius is the part most likely to be unintended.

---

### F2. Welcome Letter limit of 5/hour on a raw IP is below real school usage
**Severity: High (latent), Medium (today)** · `lib/ratelimit.ts:16-21`

5/hour per IP = 5 per school building, not 5 per teacher. Fails Scenario A (6 teachers), fails Scenario B (20 teachers) badly, fails Scenario H (district NAT) catastrophically, and constrains Scenario C (one teacher trying all three advertised tones twice) even with nobody else involved.

Held down to "Medium today" only because GA4 shows `/back-to-school-toolkit` at 53 users / 28 days, so collisions are currently uncommon. The exposure scales with the welcome-letter blog cluster, which is the site's top traffic (1,332 sessions across the top three posts). The fix should land before those posts convert better, not after.

The codebase already rejected IP-primary keying for this exact reason in three places, `report-card-restore-confirm`, `report-card-revalidate`, and `checkPurchaseRateLimit`, each with a comment naming school NAT. The free tools predate that understanding and never got it applied.

---

### F3. Refine is budgeted at 2x generate, which is backwards
**Severity: Medium** · `lib/ratelimit.ts:16-27`

Generate is 5/hour, Refine is 10/hour, in separate buckets. Refine costs the same model call with a **larger** input allowance (3000 chars vs ~200) and the same 600-token output. You cannot refine a letter you were never allowed to generate. The scarce resource is gated tighter than the expensive one that depends on it.

This also makes refine the most attractive endpoint for misuse: it is the loosest limit, the largest input, and the least constrained prompt on the site, effectively a general "rewrite this text" service.

---

### F4. No analytics on tool usage, success, failure, or rate-limiting
**Severity: Medium** · both generator clients

Not one event fires on generate, success, error, or 429. `fireCtaClick` covers only the downstream CTAs. There is a `fireEvent()` helper in `lib/gtag.ts` already built to no-op safely when gtag is blocked, so the plumbing exists and is unused here.

Consequences: nobody can tell whether F2 is currently hurting anyone; nobody would notice Scenario D; nobody would notice an OpenAI outage except by user complaint; and there is no conversion funnel from "generated a letter" to "clicked Try ShortHand," which is the entire commercial point of these tools. This audit had to substitute page sessions for the block data that should exist.

---

### F5. Raw OpenAI error messages are forwarded to teachers
**Severity: Medium** · all three routes, `catch` blocks and the `!res.ok` branch

**FIXED 2026-09-13, PR #86, merge `c139d51`.** Verified in production by Greg.

`err?.error?.message` and `e?.message` reach the UI verbatim. Teachers can be shown OpenAI quota language, org identifiers, model names, or `"The operation was aborted due to timeout"`. Minor information disclosure, meaningful UX damage, and an upstream 429 will read as though the teacher hit the site's limit when they did not.

**What shipped:** both leak sites in all three routes now return one fixed body, `{"error":{"message":"Something went wrong generating that. Please try again in a moment."}}`, with status **502**. Upstream detail is logged server-side only, as `[generator] upstream failure | tool=... | status=...`, with no user content.

502 rather than mirroring `res.status` also closes the second half of this finding: an upstream 429 used to reach the browser indistinguishable from the site's own limit, which meant F4's new analytics counted it as `generation_blocked`. It now classifies as `generation_failed`. Anyone reading the F4 data for the F2 decision should know the blocked/failed split was only trustworthy from 2026-09-13 onward.

New helper `lib/api-errors.ts` holds the message, the status, and the logger. 21 regression tests in `lib/api-errors.test.ts` call the real route handlers with a stubbed provider, covering secret non-leakage, the 429 non-mirroring, unchanged success, unchanged own-429, and unchanged 400. Mutation-checked against all three. `lib/ratelimit.ts` and `lib/gtag.ts` were not touched.

---

### F6. A failed OpenAI call still consumes the user's rate-limit token
**Severity: Medium** · all three routes

The limiter decrements before the upstream call. Users pay for the site's outages out of their own quota. On the 5/hour welcome letter, three failed attempts leave a teacher with two and nothing to show.

---

### F7. Email capture writes to Supabase directly from the browser with no rate limit
**Severity: Medium** · `components/OptionalEmailCapture.tsx:24-27`

An unauthenticated client-side insert into `email_leads`, no server route, no limiter, no CAPTCHA, no validation beyond `includes('@')`. Anyone can script arbitrary volume into the leads table. Duplicate handling is present (`23505` swallowed), so the address column is unique, but junk addresses are unbounded. This pollutes the Founder Dashboard's Email Leads panel and the outreach tracker, which is the workflow that reads this table.

Not higher severity because the damage is table noise rather than cost or outage, and RLS presumably restricts this to insert-only. Worth confirming the RLS policy actually does restrict it to insert.

---

### F8. `/api/free-tool` accepts a fully client-constructed prompt
**Severity: Low** · `app/api/free-tool/route.ts:15-22`

Only `typeof string` and `length <= 1000`. The client builds the entire prompt. The sibling welcome-letter route does this correctly: it validates grade and tone against allowlists and assembles the prompt server-side.

Low because the system prompt is constraining, output is capped at 200 tokens, and the realistic worst case is someone getting a mediocre free haiku. Worth noting as a drift from the better pattern already in the repo, not as a live threat.

---

### F9. `x-forwarded-for` is trusted without validation
**Severity: Low** · `lib/ratelimit.ts:79-83`

Takes the first entry unconditionally. On Vercel this header is set by the platform and the leftmost value is trustworthy, so this is fine as deployed. It is worth knowing that the limits are only as strong as that assumption, and that `'unknown'` is a valid fallback identifier, meaning any request without the header shares one global bucket with all others.

---

### F10. 30-second timeout with no progress feedback on mobile
**Severity: Low** · both clients

The button reads "Writing your letter..." for up to 30 seconds. On school Wi-Fi that is a long silence, and the likely user response is a reload, which abandons a request that already consumed a rate-limit token.

---

## Recommended Rate-Limit Model

Conceptual only. No implementation, no code.

### The principle

Rate limits on a free teacher tool exist to **bound cost and stop automation**, not to ration a scarce good. The current welcome letter limit is shaped as if generations were scarce. They are not: at `reasoning_effort: none`, 600 output tokens on a small model, the marginal cost of a letter is negligible. What is expensive is a teacher's first impression, and the current design spends that to protect pennies.

So the design goal is: **a bot should hit a wall quickly; a school should never hit one.** Those are separable, because they differ in shape, not just volume. A NAT'd school is many users behind one IP doing one or two things each, in bursts, with human pauses. A bot is one user doing thousands of identical things with no pauses.

### Three layers, in order of importance

**Layer 1: Stop keying solely on IP. Key on IP + a per-browser identifier.**

Adopt what the paid path already does. Its limiters key on a stable per-entity value (a purchase id, a link hash) with IP folded in as a secondary suffix, so one shared address cannot create one shared fate.

The free tools have no purchase id, but they do have a browser. A random identifier generated client-side and persisted in `localStorage`, sent as a header, gives per-teacher granularity. Six teachers on one school NAT are six distinct browsers and get six independent budgets.

The obvious objection is that this is trivially spoofable: clear storage, get a new bucket. That is correct and it is acceptable, because the **IP layer stays underneath it as the real bound**. The browser id makes honest users independent of each other; the IP cap stops the attacker who churns ids. Neither layer works alone; together they separate the two shapes. This is the same logic already written in the `checkPurchaseRateLimit` comment about a leaked token replayed from many machines.

**Layer 2: Two-tier limits, a tight per-browser bound under a wide per-IP bound.**

- **Per browser**, generous enough that a teacher exploring every tone never notices it, tight enough that one machine cannot loop. In the range of 10 to 15 generations per hour. Scenario C stops existing.
- **Per IP**, sized for a building rather than a person, in the range of 100 to 150 per hour. Twenty teachers in PD doing 3 to 5 each sits comfortably underneath. A single-IP bot still hits a ceiling within a minute.

This is what makes the shapes separable: no realistic school exceeds the IP tier, and no bot stays under the browser tier.

**Layer 3: One shared budget for generate and refine, not two.**

Refine is a generation. Counting it separately created F3's inversion, where the dependent operation got twice the budget of the thing it depends on. A single pool per tool, consumed by both actions, is simpler to reason about, simpler to explain to a user, and removes refine's standing as the loosest endpoint on the site.

### Supporting behavior changes

**Fail open when Upstash is down.** Match the paid path and its stated reasoning. The limiter bounds cost; it does not enforce access. An Upstash blip should not be a site-wide tool outage. The 30-second OpenAI timeout and the token caps remain as the cost bound during such a window, which is the point: there is a second line of defense, so the limiter can afford to yield.

**Do not consume a token for a failed generation.** Reserve on entry, release on upstream failure, or check the limit before the call and only record the hit after a successful response. Users should not pay for the site's outages.

**Make the 429 message honest and actionable.** "You've reached the free generation limit" is wrong when the truth is "someone else at your school did." If the per-IP tier is what tripped, say the tool is busy for this network and suggest trying shortly. If the per-browser tier tripped, the current message is accurate. Distinguishing them costs one field in the limiter result and turns a dead end into an explanation.

**Never forward upstream error text.** Map to two or three site-authored messages: busy, temporarily unavailable, something went wrong. Log the detail server-side.

**Instrument before and after.** Fire events on generate attempt, success, failure with a coarse reason, and rate-limit block with which tier tripped. Without this, the effect of any change here is unmeasurable, and Scenario D stays invisible. This is worth doing even if no limit changes at all, because it is the only way to learn whether F2 is currently costing real teachers.

### What stays as it is

Length caps, the grade/tone allowlists on the welcome letter, the 30-second timeout, the output token caps, and the deliberate fail-open design on the paid endpoints are all correct. The `report-card-restore-confirm` two-key design is the best rate-limiting in the repository and is the model the free tools should follow.

## Costs / Risks of Loosening Limits

Arguing against myself, because "raise the limits" is the easy recommendation and it has real costs.

**Cost exposure rises with the IP ceiling.** Moving the welcome letter from 5 to ~100 per IP per hour is a 20x increase in the worst-case bill from a single address. The absolute number stays small at current model pricing and token caps, but it is a real multiplier on a founder-funded product with no revenue attached to these tools. It should be a deliberate decision, not a side effect.

**A per-browser identifier is bypassable and should not be oversold.** Incognito, storage clearing, or a scripted client each mint a fresh bucket. It genuinely improves the honest-user case and genuinely does not stop a determined attacker. Its value is entirely in being paired with the IP ceiling, and describing it as an abuse control on its own would be wrong.

**Failing open is a real tradeoff, not a free win.** During an Upstash outage there is no rate limiting at all, and an attacker who notices gets an unmetered window. The justification is that the outage window is short, the token caps still bound per-call cost, and a self-inflicted total outage of the free tools is worse than a bounded window of unmetered access. That is the same tradeoff the paid path already accepted in writing. It is defensible but it should be accepted knowingly.

**A per-browser identifier has a privacy surface.** A random id in `localStorage` used for rate limiting is not tracking, but it is a persistent client identifier on a site whose audience is teachers acting on behalf of children, and the site publishes a DPA. It should be documented as functional, not analytic, and should not be joined to anything else.

**More storage operations means more Upstash usage.** Two-tier limiting doubles the limiter round trips per request. Immaterial at current traffic, worth knowing before it is not.

**Genuinely raising limits raises the floor for spam on the email capture too.** F7 is currently limited only by nobody bothering. Any attention brought to the tools raises that risk independently of the rate-limit work.

## What Looks Good

Substantial parts of this system are done well, and the good work is concentrated in the newest code.

- **The paid path's rate limiting is genuinely thoughtful.** `report-card-restore-confirm` uses a per-link key with a deliberately wide per-IP secondary, and the comment explains the school-NAT reasoning precisely. `checkPurchaseRateLimit` folds IP in as a suffix so a leaked token replayed from many machines gets separate buckets. This is better than most production code.
- **Identifiers are hashed before they touch Redis keys or logs**, with a comment explaining that it is to keep user-identifying values out of infrastructure even though the input is already server-verified. Truncation to 160 bits is justified in the comment.
- **The restore route's anti-enumeration design is excellent.** The response shape is identical across purchased, not purchased, and infrastructure-failure cases, byte for byte, and the comment explains why a helpful error message would itself be a purchase oracle.
- **The welcome letter route validates properly**, with allowlists on grade and tone and server-side prompt assembly.
- **Timeouts exist on every upstream call**, which is a step many codebases skip entirely.
- **Output token caps are tight** (200 and 600), which is the single most effective cost control present and does real work in every abuse scenario.
- **Both clients disable the submit button while in flight**, which handles the common double-submit case.
- **Generated output lands in an editable textarea**, so a teacher can fix a result by hand instead of burning a regeneration. This is quietly the best rate-limit mitigation on the site.
- **The Parent Communication Log being pure client-side print** is the right call: zero backend, zero cost, zero abuse surface, and it still delivers the tool.
- **`lib/gtag.ts` no-ops safely** when gtag is blocked, with a comment about ad blockers. The instrumentation gap in F4 is unused plumbing, not missing plumbing.
- **The em-dash prohibition and the anti-fabrication rules are enforced in the system prompts**, including instructions not to invent communication systems the teacher never mentioned.

## First Thing To Change

**Wrap `checkRateLimit()` in a try/catch that fails open, matching the two helpers directly above it in the same file.**

Why this one first:

1. **It is the only unambiguous bug.** Everything else in this document involves a judgment call about the right number. This one is a missing try/catch that makes the free tools behave opposite to the paid tools, with the correct reasoning already written in comments 40 lines away.
2. **Its blast radius is the largest.** An Upstash outage currently takes down both generators, refine, **checkout session creation**, and restore requests, simultaneously, with a bare 500. The checkout consequence alone is worth the fix.
3. **It is a few lines in one function, with no behavior change in the normal case.** No tuning decisions, no new identifiers, no client changes, nothing to measure first.
4. **It does not require agreeing with me about F2.** Whatever is decided about the welcome letter's limit, this fix is correct.

**Then, in order:** add the generate/success/failure/429 events (F4), because it is the only way to learn whether F2 is currently hurting real teachers rather than hypothetically; then raise the welcome letter limit and merge the refine bucket into it (F2, F3), which are the same change; then stop forwarding upstream error text (F5).

> **Update 2026-09-13:** F1, F4 and F5 are all shipped. F5 was pulled ahead of F2/F3 because it was small and self-contained, and because it turned out to be a prerequisite for reading F4 correctly: the upstream-429 mirroring was corrupting the blocked-vs-failed split that F2 depends on. The remaining order stands: let F4 data accumulate, then decide F2 and F3 together.

The per-browser identifier work is the largest piece and should come last, after F4's data shows whether it is needed at current traffic. Given 53 users per 28 days on that page, it probably is not needed yet, and the cheap fixes buy the runway to find out.
