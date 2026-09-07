# Free-Tool UX Diagnosis — 2026-09-07

**Type:** Research/code-reading only. No code was changed while producing this document.

**Scope:** `/free-tool`, `/report-card-comment-generator`, `/tools/parent-communication-log`, and related pages, investigated per the request to determine why GA4 shows visitors leaving almost immediately (`docs/gsc-ga4-cross-source-analysis-2026-09.md`, Section 3, item 7: `/free-tool` showed a 9-second average session duration in the last 90 days).

**Bottom line up front:** two of the three pages investigated have no meaningful UX problem. The third (`/report-card-comment-generator`) has a severe, provable, self-inflicted one: **the page's own SEO metadata and on-page copy promise "no sign-up required," while the actual tool is hidden behind a mandatory email-capture wall.** This single finding explains the majority of the traffic-without-action pattern flagged in the prior document.

**RESOLVED 2026-09-07.** PR #75 (squash-merged to `main` as `f67e376`, live in production) removed the `LeadGate` wrapper from `/report-card-comment-generator` and replaced it with the existing `OptionalEmailCapture` component (post-generation, optional), matching the Welcome Letter Generator's proven pattern. Git-history investigation (prompted directly by Greg, who recalled removing this gate previously) confirmed this was never actually removed before - it was a known, documented gap from 2026-08-30 that never got circled back to, not a regression. Full investigation of that question is its own record; see the Agent Handoff entry dated 2026-09-07 for the merge/verification summary. Section 5's Priority 1 fix below is now shipped; Priority 3 (the two wrong-destination CTAs on `/tools/parent-communication-log`) also shipped in the same PR. Section 5's Priority 4 (the `/free-tool` redirect artifact) required no fix and remains accurate as written.

**Separately found and NOT fixed as part of this PR, on explicit instruction:** `/tools/parent-communication-log` renders with essentially no Tailwind styling in production (inputs, buttons, spacing, and typography all look like raw browser defaults). Root cause: this project has no Tailwind CSS dependency, config, or build step at all despite this page (and likely others) using Tailwind utility `className`s since it was created 2026-04-27. This is a **pre-existing production bug unrelated to PR #75** - confirmed by checking that PR's diff (two `<a>`/`<Link>` elements swapped for `<TrackedLink>` with byte-identical `className` values) and its clean build logs. Not investigated further or fixed; flagged here for whenever it's prioritized separately.

**RESOLVED 2026-09-07 (separate session, PR #76, squash-merged to `main`, live in production).** Confirmed via repo-wide scan this was the only file in the project relying on uncompiled Tailwind utility classes; rewrote `ParentLogClient.tsx` to a scoped CSS Module (`ParentLogClient.module.css`) matching the `/tools`/`/resources` visual language. No Tailwind installed, no other pages touched. Same PR also added the missing third card for this tool to the `/tools` hub (see the orphan-page finding below and in `docs/gsc-site-opportunity-scan-2026-09.md`) - the page had existed since 2026-04-27 but was never added when `/tools` launched 2026-06-21.

During manual preview testing, Greg found `Print / Save as PDF` produced an effectively blank print preview. Root-caused to `app/globals.css`'s `body::after` (a decorative, fixed, full-viewport, `z-index:9999` noise-texture pseudo-element) having no `@media print` exclusion anywhere in the codebase - Chrome's print engine paints it over printed page content. Fixed with a print-only `display: none` on that selector. Also fixed a second bug found in the same pass: the page's own print CSS hid the title/subtitle along with the toolbar buttons they were grouped under; now only the back link and buttons are hidden. Reproduced by reverting the `body::after` fix and watching a new Playwright assertion fail, then restoring it. `tests/parent-communication-log.spec.ts` now asserts real print-mode content (title, subtitle, teacher/week fields, all 6 columns, a filled row's values) plus a direct computed-style check on `body::after`, not just toolbar/CTA visibility. Verified against production: card appears on `/tools`, tool page renders styled, a filled row survives into print output, and all non-print controls (back link, both Add Rows buttons, Print button, CTA card) are correctly hidden in print.

---

## 1. `/free-tool` is not a page - it's a redirect

**Finding:** `next.config.ts` (shorthand-website repo) contains:

```
{
  source: '/free-tool',
  destination: '/report-card-comment-generator',
  permanent: true,
},
```

`/free-tool` is a 308 permanent redirect straight to `/report-card-comment-generator`. It has no content, no component, nothing to diagnose as a UX problem in its own right.

**This fully explains the 9-second average session duration** flagged in the prior document: a visitor requesting `/free-tool` is redirected before any page content renders, so GA4 logs a near-instant session against the origin URL while the browser is already loading the destination. This is expected, correct redirect behavior, not a UX defect. The prior document's framing of `/free-tool`'s short session duration as "a likely product/UX issue, not a content issue" was a reasonable flag at the time but the actual mechanism is mundane: **the real diagnosis belongs entirely to `/report-card-comment-generator`, where every one of those visitors actually lands.**

No code change is needed here; this section exists only to correctly redirect the investigation itself.

---

## 2. `/report-card-comment-generator`: the actual, severe problem

### 2.1 The page promises "no sign-up required" in its own SEO copy

Direct quotes from `app/report-card-comment-generator/page.tsx`, the file that generates this page's `<title>`, meta description, Open Graph tags, and on-page FAQ:

- **Meta description** (line 10): *"Generate polished report card comments in 10 seconds. Pick strengths, struggles, and behavior, and get a personalized comment instantly. Free, no sign-up required."*
- **Open Graph description** (line 15): *"Generate polished report card comments in 10 seconds. Free, no sign-up required."*
- **On-page FAQ** (lines 131-135): *"Is the report card comment generator really free? Yes. No account, no payment, no trial that expires. Pick your options, generate, refine, and copy as many comments as you need."*

This is the exact text Google shows in search results and the exact text a visitor reads on the page before trying the tool.

### 2.2 The actual component requires an email address before rendering anything

`app/report-card-comment-generator/FreeToolClient.tsx`, line 170-172:

```tsx
<LeadGate source="report-card-generator">
  <FreeToolInner />
</LeadGate>
```

`components/LeadGate.tsx` renders a full-screen, unavoidable email-capture form (`"Get instant access... Enter your email to unlock this free tool"`) and does not render its `children` - meaning the entire generator UI - until an email is submitted and inserted into `email_leads` in Supabase. There is no way to see, preview, or try the generator without providing an email first.

### 2.3 This is a direct, provable contradiction, not a matter of interpretation

A visitor who searches "free report card comment generator," clicks a result whose own title and description say "no sign-up required," and lands on a page whose own FAQ says "no account, no payment" - and is then immediately shown an email-collection form blocking everything else - has been told two different, contradictory things by the same page within the same visit. This is very likely the majority explanation for both this page's own weak GSC/GA4 numbers (per the September opportunity scan: 0 GSC clicks, position 44-90 despite decent on-page content) and its near-zero engagement once visitors do arrive via `/free-tool`.

**Severity: high.** This is not a matter of taste or a minor friction point - it's a page actively contradicting its own stated value proposition to every single visitor, at the exact moment they're deciding whether to trust and use the tool.

### 2.4 Other findings on this page, lower severity

- **The `<LeadGate>` unlock state persists per-browser via `localStorage`** (`shorthand_lead_unlocked_report-card-generator`), not per-session. A returning visitor on the same device who already gave an email won't see the gate again - this is a reasonable, low-friction implementation *of the gate itself*; the problem is the gate contradicting the page's promise, not how the gate is built.
- **The generator UI itself, once unlocked, is well-built**: clear three-category chip selection (strengths/struggles/behavior), length/tone controls, a working refine loop, copy-to-clipboard, and a backend (`app/api/free-tool/route.ts`) that's properly rate-limited, edge-runtime, and has a sensible 30-second timeout. No functional or performance problem was found in the generator itself. This makes the lead-gate contradiction more frustrating, not less - the tool underneath genuinely works, but most visitors never see it.
- **Mobile:** the component uses inline styles with `maxWidth: 560` containers and flex-wrap chip layouts, which read as reasonably mobile-safe from the code, though this was not verified in an actual browser/viewport per this task's "no implementation changes, code-reading only" framing. Flagged as unverified, not as a finding either way.
- **Two CTAs on this page correctly point to `app.getshorthandapp.com`** (lines 204 and 374-385) and the second one correctly fires `fireCtaClick`/`withAttribution` before navigating - this page's funnel tracking is actually in good shape once a visitor gets past the gate, unlike some other pages found in this pass (Section 3.3).

---

## 3. `/tools/parent-communication-log`: no meaningful problem found

### 3.1 The page does exactly what it promises, with no gate

Reading `app/tools/parent-communication-log/ParentLogClient.tsx` in full: the printable log table renders immediately, is editable on-screen, has a working "Print / Save as PDF" button (`window.print()`), and a print-optimized stylesheet (`print:` Tailwind variants hiding screen-only chrome and switching table colors for print legibility). The page's own metadata promise ("free printable... no sign-up required") matches the actual experience exactly - no `LeadGate`, no blocking modal, nothing hidden.

### 3.2 One real, minor bug: both CTAs on this page link to the wrong destination

Lines 182 and 202 both link to `https://getshorthandapp.com` (the bare marketing homepage) rather than `https://app.getshorthandapp.com` (the actual product/signup destination used by every comparable CTA elsewhere on the site, including the report-card generator's own CTA). Clicking "Try ShortHand Free" or "Try ShortHand" on this page just reloads the marketing homepage instead of taking the visitor to the app.

**Severity: low.** This does not block or confuse the visitor (the homepage itself has its own path forward), and it doesn't explain any traffic-without-action pattern on this specific page - `docs/gsc-ga4-cross-source-analysis-2026-09.md` didn't flag this page as a high-traffic/low-engagement outlier in the first place (it's a low-traffic page overall). It is, however, a real, fixable bug: it sends a warm click (someone who filled out the log and is ready to act) on an extra, avoidable hop with no `?demo=true` or attribution parameters attached, unlike every other CTA on the site that goes through `withAttribution()`/`fireCtaClick()`. Worth fixing whenever this page is next touched, low priority given its traffic level.

### 3.3 No mobile, load-speed, or duplicate-tool problems found

The table uses `overflow-x-auto` for the print-hidden view and a `print:overflow-visible` fallback, which is the correct pattern for a data table that also needs to print on paper (matches the site's own documented rule in `AGENTS.md` about wrapping blog tables in `overflow-x: auto`). No client-side data fetching, no external API calls, no heavy dependencies - this page should load fast. No second, competing "parent communication log" tool exists elsewhere on the site (the blog post `free-parent-communication-log-for-teachers` is an article, not a competing interactive tool, per the September opportunity scan's cluster mapping).

---

## 4. `/report-card-comment-library`: correctly excluded, not a UX bug

This page carries `robots: { index: false, follow: false }` deliberately (`app/report-card-comment-library/page.tsx`, line 10) - it's the paid product's checkout/access page, gated by a real entitlement check (`evaluateAccess()`) rather than a marketing lead-gate, and is intentionally not meant to rank or be found via cold organic search. Its near-zero GSC/GA4 footprint (established in the September opportunity scan) is by design, not a UX failure. Not investigated further here since it isn't a "free tool" in the sense the request was asking about.

---

## 5. Prioritized diagnosis and proposed fixes (no changes made)

### Priority 1 - `/report-card-comment-generator`'s lead-gate contradicts its own promise

**Diagnosis:** The single highest-confidence, highest-severity finding in this investigation. The page tells every visitor "no sign-up required" in its title, meta description, and on-page FAQ, then blocks the entire tool behind a mandatory email form. This is very likely the primary cause of the page's weak search performance and near-instant bounce pattern.

**Proposed fix (not implemented):** Pick one of two honest paths, rather than continuing to promise one thing and deliver another:
- **(a) Remove the lead gate** and let the tool work immediately, matching the existing copy. This is the more defensible option given the page's own FAQ already publicly commits to "no account, no payment" - removing the gate makes the page true. Email capture, if still wanted, could move to a soft, dismissible prompt shown *after* the visitor has already generated and copied a comment (when they've received value and are more likely to opt in willingly), rather than as a wall before any value is delivered.
- **(b) Keep the gate but rewrite the copy** to stop claiming "no sign-up required" everywhere it currently does. This is the worse option: it keeps the page's actual conversion-killing friction in place and only fixes the (comparatively minor) truth-in-advertising problem, not the underlying bounce-rate problem the request was actually asking about.

Recommend (a). This is a product decision, not purely technical, and should be confirmed with whoever owns the lead-gen strategy for `email_leads` before implementing.

### Priority 2 - Confirm whether `LeadGate` is used, or was ever used, elsewhere with the same contradiction

**Diagnosis:** Only one page currently uses `LeadGate` (confirmed by a repo-wide search), so this is not a wider pattern today. Flagged as a priority-2 check rather than priority-1 fix because it's a "verify this doesn't recur" item, not a currently-active second instance of the bug.

**Proposed action (not implemented):** No code change needed now; worth a quick check any time a new "free tool" page is added to make sure this specific promise/gate contradiction isn't repeated.

### Priority 3 - Fix the two wrong-destination CTAs on `/tools/parent-communication-log`

**Diagnosis:** Both "Try ShortHand" links on this page point to the marketing homepage instead of the app, and skip the site's own attribution-tracking helper that every comparable CTA elsewhere uses.

**Proposed fix (not implemented):** Change both `href="https://getshorthandapp.com"` instances to use the same `withAttribution('https://app.getshorthandapp.com', ...)` + `fireCtaClick(...)` pattern already used correctly on the report-card generator page (`FreeToolClient.tsx` lines 374-385), so this page's conversions are both correctly routed and correctly tracked. Low priority given this page's overall traffic volume, but a clean, low-risk, well-precedented fix whenever the page is next touched.

### Priority 4 (informational, not a defect) - `/free-tool`'s short session duration is a redirect artifact, not a UX bug

**Diagnosis:** No fix needed. The redirect is working as intended; the earlier document's flag on this specific URL was based on GA4 data that, once traced to its source, reflects normal redirect behavior rather than a broken landing experience. Recorded here so this investigation's conclusion on `/free-tool` specifically is on record and doesn't get re-investigated as a mystery later.

---

*Research/code-reading only. No implementation changes were made. Findings based on reading `next.config.ts`, `app/report-card-comment-generator/page.tsx`, `app/report-card-comment-generator/FreeToolClient.tsx`, `components/LeadGate.tsx`, `app/api/free-tool/route.ts`, `app/tools/parent-communication-log/page.tsx`, `app/tools/parent-communication-log/ParentLogClient.tsx`, and `app/report-card-comment-library/page.tsx` in the shorthand-website repo, cross-referenced against GA4/GSC findings in `docs/gsc-ga4-cross-source-analysis-2026-09.md` and `docs/gsc-site-opportunity-scan-2026-09.md`. 2026-09-07.*
