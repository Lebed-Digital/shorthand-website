# Website audit 2026-11-15, Phase 2: conversion and messaging

Status: REVISED after one Codex plan review (2026-11-22). Waiting on Greg's decisions. Nothing here is built yet.
Written 2026-11-22 on branch `fix/audit-2026-11-15-closeout` (base `main` `524ef05`).
Audit: Brain `Website Audit - 2026-11-15.md` (items B1, B3, B5, B8, B9, C2, plus the A1 nav question).

## Facts the copy relies on (from app code, `pulse 2.0` `main` `070a500`, 2026-11-18)

Every claim below must trace to one of these. Codex: please spot-check the citations.

| # | Fact | Source |
|---|---|---|
| F1 | Free has no time limit. Settings card: "Free forever, and genuinely useful". | `src/components/SettingsScreen.tsx:1640` |
| F2 | Free and unlimited: notes, students, classes, parent communication log, goals, accommodations ("no cap"). | `SettingsScreen.tsx:1651`, `src/components/ProUpsell.tsx:79,85` |
| F3 | AI parent notes (Quick Note Home, Detailed Report) are free. | `api/_aiOperations.ts:61-72` |
| F4 | The app shows "$4.99/month. Cancel anytime." for web Pro (live Stripe price not independently checked). iPhone shows Apple's price. | `ProUpsell.tsx:169`, `SettingsScreen.tsx:1614,1705`, `api/billing/create-checkout-session.ts:85` |
| F5 | 30-day Pro trial, teacher taps to start, no credit card. Subscribing during the trial bills at once. | `supabase/migrations/20260829_start_pro_trial.sql:71`, `ProUpsell.tsx:152-154`, `SettingsScreen.tsx:1614` |
| F6 | Pro-gated: Reports tab (Student Documentation Report, Meeting Prep Report, Documentation Coverage), Ask ShortHand, Shoutouts, Class Summary, Class Note mode, bulk "Save + Prep Parent Emails", Import Birthdays, Quick Grade Table, School Calendar and Rotation & Specials. | `src/App.tsx:1586-1595,1632-1637,1335`, `PulseScreen.tsx:2016-2046,2589-2597`, `StudentsScreen.tsx:941,1235`, `ImportScreen.tsx:890-918`, `SettingsScreen.tsx:1233-1243` |
| F7 | A trial-then-read-only mode is built but switched off (`legacy`, 0 accounts). | `.claude/docs/trial-to-paid-read-only.md:3-5,23-26` |
| F8 | One account per teacher. No school, team, seat or invite code. | agent search, no hits |
| F9 | No parent accounts. Drafts open in the teacher's mail app or Gmail (also copied); no automatic sending. | `StudentDetailView.tsx:1396-1413`, `BulkParentEmailPanel.tsx:4-6` |
| F10 | Parent log: types Email, Call, Text, Meeting, ParentSquare, Phone; in/outbound; subject, parent name, notes, date, time, follow-up date and done, Urgent, IEP-related. "Copy Full Log" / "Email Full Log" as plain text. | `src/components/ParentCommunicationLog.tsx:27-32,66,497-588,662-672,776-797` |
| F11 | Recency rings on the free Students screen: green within 8 days, amber within 15, red older, grey never. 8-week activity chart per student is free. | `src/utils/noteRecency.ts:18-19`, `StudentsScreen.tsx:637-650`, `StudentDetailView.tsx:173-195,250-252` |
| F12 | A Detailed Report can be logged to the parent log as an explicit, optional step, not automatically. | `StudentDetailView.tsx:508-527,3674` |
| F13 | Roster import (Google Classroom, pasted spreadsheet) is free; only birthday import is Pro. | `ImportScreen.tsx:559,727,881,1216` |
| F14 | When an opt-in trial expires, the account is Free again and its records stay saved and usable. | `src/context/PlanContext.tsx:94`, `SettingsScreen.tsx:1644` |
| F15 | No self-service web cancel. Account deletion cancels Stripe first. A Customer Portal exists only in an unmerged draft (`bd084ac`). | `supabase/functions/delete-account/handler.ts:76` |

Unconfirmed, so the site must not claim it: how a web subscriber cancels (no in-app cancel or Stripe portal found;
deleting the account cancels it, `SettingsScreen.tsx:1540`). Whether ClassDojo has AI summaries or an admin paper trail.

## Constraints

- `homepage-modern` and `blog-cta-presentation` stay untouched: no edits to `app/page.tsx`, `app/modern-preview/**`,
  `proxy.ts`, `lib/posthog-*`, `BlogCtaExperiment`, `WORKFLOW_BRIDGES`. No new PostHog events or properties. New app
  links are plain `TrackedLink`s, which the site's existing click listener (PostHog autocapture stays off) reports as `app_link_clicked`
  (`cta_location: 'page'`), so nothing new to allowlist.
- Greg's 2026-11-20 decisions stand: `/classdojo-alternative` keeps its middle/high-school title, meta and body;
  homepage trust, pricing and visual changes wait for the end of `homepage-modern`.
- No `FAQPage` JSON-LD on non-blog pages (AGENTS.md). Visible FAQs only.
- Open PR #187 edits `app/classdojo-alternative/page.tsx` (table row 20, footer) and `public/llms.txt`. Phase 2 should
  be rebased after #187 merges, or its ClassDojo edits must avoid those lines.
- Made-up examples use initials only (no realistic full names) and are labeled "Example".

## Proposals (revised after Codex plan review, see log below)

### A1. Nav "Get ShortHand" on 11 feature pages and `/classdojo-alternative`: no change recommended
`?signup=1` would work (Create Account, with a Sign in switch), but there is no evidence of who clicks these nav
buttons, and every body button on those pages already opens Create Account. Leave bare. Revisit only with click data.

### B1. A real `/pricing` page (needs Greg: cancel route, school-plan answer)
- New `app/pricing/page.tsx`, `/for-schools` layout (nav, `<main>`, shared `Footer`). Remove the `/pricing` redirect in
  `next.config.ts` in the same PR. Add to `app/sitemap.ts` (no lastModified). `public/llms.txt` line after #187 merges.
- Metadata: page-specific title, description, canonical, OG title/description with `/og-image-v2.png`, and a
  `summary_large_image` card.
- Lead line: "Free plan with no time limit. Pro is optional."
- Table:

  | Free (no time limit) | Pro on the web, $4.99/month |
  |---|---|
  | Unlimited notes, students and classes (F2) | Everything in Free |
  | Check-in rings and the 8-week activity view (F11) | Student Documentation Report and Meeting Prep Report (F6) |
  | Parent communication log with follow-ups (F10) | Ask ShortHand: ask questions of your notes (F6) |
  | AI parent drafts, one student at a time: Quick Note Home and Detailed Report (F3) | Prep parent emails for several students at once (F6) |
  | Goals and accommodations (F2) | Class Summary, Shoutouts, Quick Grade Table, school calendar and rotation (F6) |
  | Roster import from Google Classroom or a pasted spreadsheet (F13) | |

  Under the table: "On iPhone, Pro is bought through the App Store at Apple's listed price."
- Buttons: "Create a free account" (`?signup=1`), "Try the demo first" (`?demo=true`), both `TrackedLink` with
  `ctaSource="pricing"`.
- Visible FAQ:
  1. Is the free plan really free? No time limit, no credit card. It is not a trial. (F1, F2)
  2. What happens when a Pro trial ends? Eligible accounts can start one 30-day Pro trial without a card. If you do not
     subscribe, the account goes back to Free and your notes stay saved and usable. Subscribing during the trial starts
     billing right away. (F5, F14)
  3. How do I cancel Pro? NEEDS GREG. No self-service web cancel exists in the app (F15). iPhone: Apple ID
     subscriptions. The FAQ ships only with the route Greg confirms (for example "email info@getshorthandapp.com and
     it is cancelled within one business day").
  4. Is there a school or district plan? NEEDS GREG (F8 is an absence of evidence). If confirmed: "Not yet. Each teacher
     uses their own account. For district privacy review, see ShortHand for Schools."
- Links in: the "This is part of ShortHand Pro" line on the 3 Pro feature pages only. No footer link and no homepage
  link until `homepage-modern` ends (the control arm uses the shared Footer, the test arm does not, and the experiment
  counts app clicks site-wide). No 404 link this pass.

### B8. Say the permanent Free tier plainly
- 7 free-feature pages: CTA sub "Free to start. Works on any device." becomes "Free plan with no time limit. Use it in
  your browser or the app." (`class-insights` noindexed, left alone.)
- ClassDojo "Cost" row: "Free to start, no ads" becomes "Free plan with no time limit. Optional Pro."
- Wording is "no time limit", not "free forever": a read-only trial mode exists in the app code (F7), so a forever
  promise is harder to keep. Homepage hero checks deferred until `homepage-modern` ends.

### B3. ClassDojo page accuracy (title, H1, meta, middle/high body stay per Greg 2026-11-20)
- Delete the "Mood tracking" and "AI summaries" rows (mismatched, and ClassDojo documents AI summaries of a different
  kind).
- "Behavior visibility" ClassDojo cell: "Public points on a class display" becomes "Points, often shown to the class".
- "Parent updates" ClassDojo cell: "Social-media style feed" becomes "Class Story feed and direct messages". ShortHand
  cell: "A parent message drafted from your notes. You review it and send it from your own email." (F9)
- "Admin-ready paper trail" row becomes "Parent contact record": ClassDojo "Message history, exportable"; ShortHand "Log
  calls, texts, meetings, and emails with a date, type, and optional follow-up." (F10)
- "Teach elementary?" paragraph: replace "Plenty of K-5 teachers use it for the same reason" (unverified usage claim)
  with "ShortHand was built by a third grade teacher." plus the existing "private notes instead of public points" idea
  stated as a feature, not a motive.
- NEEDS GREG: "The most common reason teachers reach out" (Why teachers switch) is a usage claim. Keep only if true;
  otherwise "A common reason to switch:".

### B5 + C2. Three feature pages: `parent-communication-log`, `parent-emails`, `behavior-tracking`
Each gets: a "Try the demo" link under the H1 (`?demo=true`, `TrackedLink`, `ctaSource="features_<slug>"`), one
labeled "Example" in text (initials only), and 2 or 3 visible FAQs that answer a page-specific question. About 120 to
180 words each. Existing copy and video stay.
- Parent log example: one Call entry (outbound, date, parent "Ms. R.", one-sentence note, follow-up date). FAQs: free?
  (unlimited on Free, F2); can I share it? ("Copy Full Log" / "Email Full Log", F10).
- Parent emails example: one short Quick Note Home draft for "J." FAQs: free? (one student at a time on Free, bulk is
  Pro, F3, F6); does ShortHand send it? (no, it opens in your mail app or Gmail, F9).
- Behavior tracking (C2): title and H1 "See When You Last Noted Each Student", "Never miss a student" kept as the
  first line. Avoids the "behavior tracking app" queries owned by the roundup in `docs/seo-query-ownership.md`. Fix
  "automatic alerts" in description, OG and the body paragraph ("The dashboard flags anyone who needs attention
  automatically" becomes a plain four-color legend, F11), and the `llms.txt` line after #187 merges. Example: one
  sample note with two tags. FAQ: do students or parents see the rings? ("Parents and students don't have ShortHand
  logins. Teachers choose what to send or share.")
- Analytics: no PostHog change. The existing click listener reports these links as `app_link_clicked` with
  `cta_location: 'page'`; `ctaSource` only sets the GA4 source.

### B9. Dropped from Phase 2
The post already links the printable log near the end, the paragraph sits above the measured CTA of
`blog-cta-presentation`, and the ownership doc says leave this primary post alone. Revisit the out-of-season
welcome-letter paragraph after that experiment's review (about 2026-12-01).

## Not doing in Phase 2

- B6 copy buttons (excluded by Greg), homepage hero and plans section (experiment), C7 app JSON-LD price (separate,
  low value), other 8 feature pages, ClassDojo title/H1/body (Greg 2026-11-20).

## Checks

`npm run lint`, `npm run test`, `npm run build`; built HTML: `/pricing` renders and returns 200 (no redirect), one
`<main>`, metadata set complete, sitemap includes `/pricing`; no em dashes in the diff; `/features/*` nav links point
where decided; homepage HTML for both arms unchanged except the Footer link (control).

## Review

Tier: Medium (pages, components, `next.config.ts`): one independent `/code-review medium` pass on the Phase 2 diff, and
a `Review:` line in the PR body. Plan: one Codex review, one revision (this one). Build Phase 2 on `main` after #187
merges, so the ClassDojo page and `llms.txt` edits do not conflict.

## Codex plan review log (2026-11-22, `codex exec -m gpt-6.2-sol -s read-only -c model_reasoning_effort="high"`)

| # | Finding (severity) | Verdict |
|---|---|---|
| 1 | Price needs a web label; cancel route unconfirmed (high) | Accept: "Pro on the web"; cancel FAQ waits for Greg |
| 2 | Footer Pricing link changes only the control homepage (high) | Accept: no footer or 404 link until the test ends |
| 3 | "Free forever" is a forward promise; trial is for eligible accounts, once (medium) | Accept |
| 4 | No-hit search cannot prove no school plan; "parents see nothing" too broad (medium) | Accept: school FAQ waits for Greg; logins wording |
| 5 | ClassDojo cells imprecise (medium) | Accept: rows reworded or deleted |
| 6 | Copy still implies automatic logging; usage claim in body (medium) | Accept; usage claim flagged for Greg |
| 7 | Recency claim and "alerts" wording (medium) | Accept: new title, legend, llms.txt |
| 8 | B9 adds an exit above a live experiment's CTA; link already exists (medium) | Accept: dropped |
| 9 | A1 rationale unproven (medium) | Accept: no change recommended |
| 10 | Analytics description conflated PostHog and GA4 (low) | Accept: corrected, ctaSource per page |
| 11 | Qualifiers: one-at-a-time drafts, device claim (low) | Accept |
| 12 | Make metadata and review checks explicit (low) | Accept |
