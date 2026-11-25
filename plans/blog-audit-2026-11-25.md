# Blog audit follow-up plan (2026-11-25)

Source: Gemini 93-post audit, 2026-11-25. Verified against `main` at `8223ce7`. Reviewed by Codex (gpt-6.2-sol, high), findings folded in below.
Status: DONE 2026-11-25. Batch 1 #193, Batch 2 #194, Batch 3 #195 (with 3 FAQ corrections) all merged.

Data used: GSC 2026-08-27 to 2026-11-23 (unfiltered, page level), GA4 2026-08-27 to 2026-11-24,
PostHog `$pageview` / `app_link_clicked` / `resource_downloaded` since tracking began (about 2026-10-05).

## Corrections to the Gemini audit

| Gemini said | Verified on main |
|---|---|
| 4 posts with "no app store" / PWA-only claims | **6 posts, 8 lines.** Missed `classdojo-alternative.md:125`, `how-to-simplify-parent-communication.md:73`, `why-teachers-are-switching-from-classdojo-to-shorthand.md:91` |
| 1 mislabeled "install page" link | **2.** Same bug at `how-to-simplify-parent-communication.md:73` |
| "Free to start" in 12 posts | **13 posts, 16 lines.** Missed `classdojo-alternative.md:125`, `best-classdojo-alternatives-2026.md:183` |
| 2 parent-log posts missing the free tool | **1.** `free-parent-communication-log-for-teachers.md:51` already links it (absolute URL) |
| 40 posts without `faq` | Confirmed, 40 |

Both store listings are live (`app/install/page.tsx:9-10`), so "no app store" is now wrong.
Approved wording (CURRENT_STATE.md, Phase 2): "Free plan with no time limit", never "free forever"; Pro $4.99/month on the web.

## Batch 1: accuracy and quick wins (content only, Light tier)

Files: 15 posts. Body text plus one FAQ answer (`best-behavior-tracking-apps-for-teachers-2026.md:15`). No titles, headings, slugs, dates, or redirects change.

1. **App store / PWA claims (6 posts, 8 lines).** Replace with "works in your browser, or get the app for iPhone or Android".
   - `7-reasons-classdojo-alternatives.md:84,88`, `classdojo-alternative.md:60,125`, `free-parent-email-templates-for-teachers.md:219` (keep its "Try ShortHand free" demo link, remove only "No app store."), `how-to-simplify-parent-communication.md:73`, `teacher-burnout-solutions-that-actually-work.md:76`, `why-teachers-are-switching-from-classdojo-to-shorthand.md:91`
2. **Mislabeled "install page" links (2 posts).** Keep the existing `?demo=true` link and fix its anchor text to match ("try the free demo"), then add a plain `/install` link for the iPhone/Android apps. This fixes the mislabel without removing a counted `blog_body` app click mid-experiment (Codex finding 2).
3. **"Free to start" (13 posts, 16 lines)** becomes "Free plan with no time limit" (keep "no credit card" where already said). Drop "no trial period countdown" at `digital-tools-for-recording-student-incidents.md:101` (a 30-day Pro trial exists, so it's ambiguous).
   - `7-reasons-classdojo-alternatives`, `best-apps-for-teacher-parent-communication-2026` (table cell, L59), `best-behavior-management-apps-for-teachers-2026`, `best-behavior-tracking-apps-for-teachers-2026` (L15 FAQ answer, plain text; L133), `best-classdojo-alternatives-2026` (L59, L183), `best-parent-communication-apps-for-documentation-2026`, `classdojo-alternative`, `digital-tools-for-recording-student-incidents`, `how-to-document-student-behavior-first-30-days`, `how-to-simplify-parent-communication`, `shorthand-vs-bloomz` (L56, L75), `teacher-burnout-solutions-that-actually-work`, `why-teachers-are-switching-from-classdojo-to-shorthand`
4. **Bloomz table, `shorthand-vs-bloomz.md:75`.** ShortHand "Paid plan" cell: "Free plan with no time limit. Optional Pro, $4.99/month on the web ([pricing](/pricing))."
5. **Parent log tool link (1 post).** `how-to-document-parent-contact-as-a-teacher.md`: one contextual link to `/tools/parent-communication-log` where the post describes what to log.
6. **`/pricing` links, only where the sentence is already about price (3 places):** Bloomz table (item 4), `best-apps-for-teacher-parent-communication-2026.md:59` "Starting price" cell, `digital-tools-for-recording-student-incidents.md:101`. Never in FAQ answers (the template renders them as plain text). No `/for-schools` links.

Expected benefit: removes 8 wrong install claims and 16 outdated pricing phrases, mostly on comparison posts where buyers check price (best-classdojo-alternatives-2026 alone: 294 clicks/90 days).
Risks: low. 4 of these posts carry `mergeNote`; that field governs merging/redirecting, not body edits. With item 2 changed, Batch 1 adds or removes no app links.

## Batch 2: conversion (6 posts, content only)

Selection: GSC clicks/impressions + PostHog conversion + a free tool or PDF that matches the search intent. Of the 10 candidates first picked, Codex confirmed 4 already have an intent-matched link in the right place (missing-homework L56/L129, call-a-parent L117, conference form L158, ADHD library CTA above the body). Adding another would be duplicate work, so they're dropped.

No new app links, so nothing needs `INLINE_CTA_TRACKING` (a plain markdown app link gets no `lp` attribution and no GA4 `cta_click`). PDF clicks are tracked automatically (`resource_downloaded`); `ResourceOffer` and the PDF gate keep their own tracking unchanged.

| # | Post | 90d GSC clicks / impr | Now | Change | Destination |
|---|---|---|---|---|---|
| 1 | positive-behavior-email-to-parents-template | 562 / 17.5k | PDF offer at 76% | Move `RESOURCEOFFERMARKER` to its own line after Template 1 (~35%) | Existing free emails PDF |
| 2 | teacher-behavior-documentation-guide (hub) | 162 / 5.3k | First CTA at 60% | One line in "Building a daily behavior log" | `classroom-behavior-documentation-log.pdf` |
| 3 | how-to-document-tier-2-interventions-for-mtss | 104 / 2.3k | PDF at 72% | One mention in "The Documentation Problem" (~25%); keep the existing one | `mtss-tier-2-intervention-tracking-sheet.pdf` |
| 4 | how-to-email-parents-about-academic-concerns | 79 / 10.6k | **No in-body CTA** | One line in "Use Objective Data, Not Impressions" | `/tools/parent-communication-log` |
| 5 | email-to-parents-about-fight-at-school | 36 / 8.6k | **No in-body CTA** | One line in "How to Document the Incident" | `classroom-behavior-documentation-log.pdf` |
| 6 | how-to-write-behavior-emails-to-parents | 30 / 6.1k | PDF gate at 98% | Move the "Want all 10 templates?" prompt (own paragraph) and `PDFGATEMARKER` to just after Example 1 (~65%), so readers see a sample first | Existing free emails PDF |

Left alone on purpose: `sample-emails-to-parents-about-student-behavior` (experiment), the three welcome-letter posts (seasonal), `best-classdojo-alternatives-2026` and `best-behavior-tracking-apps-for-teachers-2026` (already the best converters), `best-apps-for-teacher-parent-communication-2026` (ShortHand's own listicle section is the natural spot), the other report card posts (library CTA already high), and the 4 dropped rows above.

Expected benefit: earlier free-tool and PDF offers on about 970 search clicks/90 days that meet their first offer at 60-98% depth or never. Readout four weeks after shipping: page-level `resource_downloaded` totals and blog-to-tool visits. A second link to the same PDF on one page can't show which placement was clicked, so the read is per page, not per link.
Risks: each added sentence must read as advice, not an ad (`no-ai-slop` pass). Moving a marker changes no text Google sees.

## Batch 3: AEO FAQs (10 posts missing `faq`, content only)

3 questions each, plain-text answers under 100 words, none repeating a body section or a sibling post's question (Codex finding 5 trims applied). Final wording is drafted at implementation and checked against each post's body.

1. **positive-behavior-email-to-parents-template** (562 clicks): Email, phone call, or paper note? / Can I send the same positive email to several families? / What if a parent replies with a concern? (Cadence and "every family" dropped: the "Two per week rule" at L137 already answers them.)
2. **report-card-comments-for-students-with-adhd** (161): Should I mention a diagnosis on a report card? / Should comments line up with the IEP or 504 plan? / one more chosen at implementation, ADHD-specific. (Generic "special needs" question dropped: the query map keeps this page on its ADHD modifier.)
3. **email-to-parents-about-fight-at-school** (8.6k impr, 0.42% CTR, chat-style queries): Who should contact parents, the teacher or an administrator? / What if a parent asks what consequence the other child got? (answer tied to school procedure) / Should I email both families the same day? (Naming question dropped: L41 already covers it.)
4. **what-to-say-when-you-call-a-parent-about-behavior** (59): Should I leave a voicemail about behavior? / How long should the call be? / Should an administrator be on the call?
5. **behavior-intervention-plan-template** (46): How often is a BIP reviewed? / Can a general ed teacher start one? / Do parents sign a BIP? (FBA vs BIP dropped: `behavior-intervention-plan-vs-iep.md:33` owns it.)
6. **how-to-politely-tell-parents-child-is-misbehaving** (33): In person, phone, or email? / How soon after the behavior should I tell parents? / Should I tell the student before I contact home? (Disrespect dropped: Phrase 4 section covers it. "Fine at home" dropped: the call post owns that script.)
7. **how-to-document-parent-contact-for-iep** (2.4k impr): Whose job is it to call parents about behavior, the case manager's or the classroom teacher's? (real GSC query) / Does a text or app message count as documented contact? / How long should I keep contact records?
8. **how-to-track-student-behavior-in-the-classroom** (32, pos 13): Can I track behavior with Google Forms? (GSC query) / Should I track positive behavior too? / How long before data shows a pattern?
9. **second-grade-behavior-report-card-comments** (14 clicks at 6.4% CTR, pos 3.6, in season): How long should a second grade comment be? / Should I mention specific incidents? / How do I keep a concern comment from reading as negative?
10. **free-behavior-log-template-for-teachers** (22 clicks, 5.4% CTR): How long should I keep a behavior log? / Can parents ask to see it? / How often should I write in it?

Skipped: `how-to-tell-parents-child-is-disruptive` (would duplicate #6), the 29 posts under ~10 clicks/90 days.
Expected benefit: modest. Google shows no FAQ rich results for this site, so the value is direct answers on the page and text AI engines can lift.
Risks: legal-adjacent answers (#2, #3, #5, #7, #10) stay general and point to "your school or district's policy" rather than stating law.

## Experiments

- `blog-cta-presentation`: untouched. Its metric is scoped to its own post.
- `homepage-modern`: its metrics count web-app clicks site-wide after homepage exposure. Batch 1 (as revised) adds or removes no app links. Batch 2's tool and PDF links could shift a few downstream app clicks. The change hits both arms equally (same blog for both), so it adds noise, not bias, on posts totaling about 970 clicks/90 days. PostHog estimated about 395 days for this test, so waiting for it to end isn't realistic. **Greg's call:** ship Batch 2 during the test, or hold it.

## Order and shipping

1. **Batch 1 now.** One PR, posts only (Light tier, no review). Merged by Claude once the Vercel build passes, under the posts/*.md content exception in Greg's global instructions, and only after Greg approves this plan.
2. **Batch 2 next**, if Greg okays it during `homepage-modern`. One PR, posts only.
3. **Batch 3 last.** One PR. Greg reads the FAQ wording in the PR before merge (new claims, not corrections).

Each PR: diff against current `main` before merging, `Review:` line in the description, then GSC indexing requests for Batch 3's 10 URLs.

## Not doing (low priority or not asked)

`/for-schools` links; `the-sgo-data-trap` / `why-im-building-shorthand` outgoing links; the `special-education-paraprofessional-first-year` orphan (tracked in `plans/neon-audit-fixes-2026-11-20.md`); the other late-CTA posts; the remaining 30 FAQ-less posts; making `free-parent-communication-log-for-teachers.md:51`'s absolute tool URL relative.

## Open questions for Greg

1. Ship Batch 2 during `homepage-modern`? (Recommendation: yes, see Experiments.)
2. `shorthand-vs-bloomz.md:75` says Bloomz costs "From ~$3/student/year, school-purchased". Unverified. Leave it, or check it against Bloomz's pricing page?
3. `email-to-parents-about-fight-at-school.md:41` says not naming other students "is a legal requirement in most districts". Unsourced legal claim. Proposed fix in Batch 1: "Your school's student privacy rules require this."
