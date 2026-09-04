# SEO Query Ownership Map

**Created:** 2026-07-17 (flagship session). **Data basis:** GSC 90-day window 2026-06-19 to 2026-07-17, GA4 28-day window, live SERP checks.
**Updated 2026-07-30:** country-segmented GSC + GA4 pass. Added the geography/site-age preamble, the SERP-composition observations, revised cluster 1, and a US-only read of the four "better US targets". Blended figures elsewhere in this doc predate that pass and have not been re-segmented.

**Standing caution for whoever edits this doc.** This file has twice recorded a conclusion more confidently than its evidence supported: the preschool "CONFIRMED cannibalization" label (single-day snapshot, disproven 2026-07-30) and, in the same session that caught it, two further overreaches — reading 4-day-old content as if it had 28 days of data, and treating 2 clicks as a measured CTR. The recurring error is stating a mechanism when only a correlation was observed. **Prefer "observed X on date Y, cause not established" over any label like CONFIRMED, PROVEN, or RESOLVED.** If a claim would change what someone does, write down what would falsify it.
**Purpose:** one primary URL per query cluster. Before creating, merging, redirecting, or retitling any page, check this map first. Update it when decisions change.

Rule of thumb proven by this site's data: pages win when they ARE the artifact (copy-paste comments, emails, templates, tools) and carry a specificity modifier (ADHD, preschool, Tier 2). Pages lose when two of our URLs are eligible for the same query.

---

# Read this before using any number in this document (added 2026-07-30)

Every impression, click, and position figure below, unless explicitly labelled US-only, is a **blended worldwide average**. Blended numbers on this site are systematically misleading, for two reasons established on 2026-07-30.

**1. The US is the only segment that converts.** GA4, 90 days to 2026-07-30, country-segmented:

| Event | US | Rest of world |
|---|---|---|
| signup_completed | 30 | 2 (Canada 1, India 1) |
| demo_started | 159 | 11 |
| cta_click | 100 | 15 |
| Organic search users | 428 | ~380 |

Comparable organic traffic volume, roughly 13x difference in conversion rate. Non-US visitors are not a problem and are not displacing US visitors (rankings are not zero-sum across countries, US and non-US impressions grew together all summer), but they are not the audience the funnel serves. Note also that 542 US users arrived **Direct**, more than US organic; GSC is blind to that channel entirely.

**2. Blended position hides the US picture.** Examples measured 2026-07-30: `report-card-comments-for-behavior` reads 8.8 blended but 40.0 US-only. `preschool-report-card-comments` reads US 25.3. `sample-emails-to-parents-about-student-behavior` reads US 22.4. Total US blog clicks sitewide were ~13.

**Practical rule: segment GSC to `country = usa` by default when judging a page's commercial value.** Use blended numbers only for reach questions. Where a cluster note below cites a blended figure, treat it as a reach metric, not a funnel metric.

## Site age confounds every trend in this document

The site launched ~2026-04-08. Through 2026-07-28 the dominant signal in all traffic data is **new-domain indexing, not seasonality or content quality**. US impressions roughly tripled during July (early June ~100-170/day, late July 500-1,455/day) and US position improved from ~15 in May to ~7-9 in late July, both moving in the favourable direction at once, which is characteristic of a young site gaining ground rather than of seasonal demand.

Consequence: **do not attribute the expected September/October rise in US traffic to school being back in session.** Most of it will be the same indexing curve continuing. Attributing it to seasonality will make a maturing domain look like a working content strategy. A clean seasonality read is not available until roughly April 2027 (one full year of data); the first usable partial read is a September/October comparison against the July baseline recorded here.

## SERP composition: what position 7 currently buys (observed 2026-07-30)

**Status: four manual SERP observations, one per query, single point in time, one location. Suggestive, not established.** Recorded here so future checks have a baseline to compare against, not as a settled finding. SERPs vary by user, device, location, and day, and Google's AI Overview rollout is actively changing. Re-observe before relying on any of this.

Four US desktop SERPs were checked by hand because click data could not answer the question (sample too small) and the WebSearch tool is unreliable for live SERP checks on this domain. **All four showed an AI Overview above the organic results.** These spanned three different clusters, so whatever is happening does not appear to be specific to one query family.

| Query | Our pos | What sat above us |
|---|---|---|
| `class dojo alternatives` | ~7 | AI Overview, Reddit, Leaderboarded, Facebook, LiveSchool, PAA (4 questions), Capterra |
| `classdojo competitors` | ~2 organic | AI Overview, Bloomz (competitor blog, near-identical article) |
| `apps like classdojo` | ~3 organic | AI Overview, Reddit, PAA |
| `sample emails to parents about student behavior` | ~3 organic | AI Overview (reproduced a full email template, subject + body), Reddit, Tarver Academy |

Observations worth carrying forward, each with its caveat:

- **The overviews cited competitors, not us,** on all three app queries (LiveSchool, Bloomz, Remind, TalkingPoints, Seesaw, Classcraft). Sources skewed toward aggregators (Capterra, Leaderboarded) and vendor pages. Whether being cited is achievable, or worth pursuing, is unknown and untested.
- **Reddit ranked #1 or #3 on all four** and was cited in most overviews. Consistent with Google favouring peer discussion on these queries. What to do about that, if anything, is an open question and not answered here.
- **The parent-email overview reproduced the artifact itself,** not a summary. A prior expectation that template-intent queries would be *less* absorbed than comparison queries was wrong on this one observation. Worth re-testing on other template queries before generalising.
- **`behavior tracking app` resolved to the wrong intent entirely:** the overview and most results covered consumer habit-tracking apps (Habitica, App Store listings, an NIH paper), not classroom software. If that holds on re-check, the query is probably not worth pursuing regardless of position.
- **`apps like classdojo` had the shortest stack above us** and is also the only ClassDojo query that earned clicks (2 clicks / 22 imp, 28d). Two clicks is far too few to conclude anything; noting the coincidence only so a future check can look for the same pattern with more data.

**Possible implication, explicitly not established:** if this pattern holds, the click value of a position-7 ranking on these queries may be materially lower than standard CTR curves assume, which would make ranking-improvement work worth less than it looks. The site's US CTR of 1.8% at average position 12 is at least *consistent* with that, but it is equally consistent with other explanations (young domain, title/description quality, query mix). **Do not restructure content strategy on this.** Treat it as a hypothesis to test deliberately, with a stated method, before acting.

What would actually test it: re-observe these four SERPs plus 3-4 template/artifact queries from other clusters at the Aug 20 and Nov 5 checkpoints; compare CTR on queries with vs without an overview once impression volume is large enough to support the comparison.

### Source panel vs named answer: record these separately

Four more SERPs were checked later the same day (eight total). These showed something the first four did not make obvious: **getshorthandapp.com appears repeatedly in AI Overview source panels while ShortHand is not named in any overview answer text.** On `best behavior tracking apps for teachers in 2026` the source panel showed three getshorthandapp.com cards (special-ed page, parent-communication page, and one more) while the answer named ClassDojo, LiveSchool, PBIS Rewards, Class Charts, BEHCA/AbleSpace.

These are two different things and they can move independently, so **future checks should record both**:

1. Is `getshorthandapp.com` in the **source panel**? (2026-07-30: yes, repeatedly.)
2. Is **ShortHand named in the answer text**? (2026-07-30: no, on any of 8 queries.)

If source citations rise while name-mentions stay flat, that would point away from trust/authority and toward content shape. If both rise together, authority. If neither moves, something else. None of that is established; it is just what the two-part record would let a future session distinguish.

**One untested idea, recorded so it is not lost and not acted on yet.** The pages being cited are roundups, i.e. editorial *about* apps. An extraction system reading a roundup has products to extract, and they are mostly other people's. A page that is unambiguously about ShortHand may give a summarizer a different thing to work with. This is speculation from 8 screenshots. **Do not rewrite the roundups to promote ShortHand harder** — their neutrality is plausibly what makes them citable, and the deliberate decision to route grading/lesson-planning searchers elsewhere (cluster 9) is worth more than a shot at an overview mention. If anything is ever tried here, it should be an *additional* product-shaped page, not degradation of the editorial ones.

**Queries checked 2026-07-30, reuse this exact list for comparability:** `class dojo alternatives`, `classdojo competitors`, `apps like classdojo`, `sample emails to parents about student behavior`, `best behavior tracking apps for teachers in 2026`, `free teacher apps for behavior tracking`, `best apps for documenting parent communication for teachers`, `teacher apps that track behavior and document parent communication`.

### Head terms vs long tail (observation, ordinary explanation available)

Across those 8 SERPs, the pattern in where we rank organically:

- **Short category head terms** (`behavior tracking app`, `class dojo alternatives`): buried, pos ~7 or worse, below Reddit/aggregators/vendors.
- **Long multi-feature queries** (`teacher apps that track behavior and document parent communication`): the **homepage ranked first organically**, with a snippet describing ShortHand doing exactly that. On `best apps for documenting parent communication for teachers`, our own snippet surfaced "...the best option is ShortHand. It logs every parent contact with a..."

**This does not need an AI Overview explanation.** Long specific queries have less competition, and a 4-month-old domain competing on long tail before head terms is the ordinary progression. Noted because it is where we currently look competitive, and because those searchers have clearer intent. Not a basis for a content plan on its own; volume on those queries is unknown and probably small.

## 1. Report card comments (core)

- **Primary:** `/blog/report-card-comments-for-behavior` (2,480 imp, pos 8.2, 50 clicks/90d — biggest earner)
- **Supporting:** `report-card-comments-for-students-with-adhd`, `report-card-comments-for-struggling-students`, `second-grade-behavior-report-card-comments`, `social-emotional-report-card-comments`, `student-progress-report-comments-for-teachers`, `parent-teacher-conference-comments-for-teachers`, `/report-card-comment-generator` (tool), `/blog/free-report-card-comment-generator` (tool guide)
- **Primary owns:** report card comments for behavior, behavior(al) report card comments, conduct on report card, comments for difficult/naughty students, behavior comments
- **Supporting own:** their exact modifier (ADHD, struggling, second grade, social emotional, progress report, conference)
- **Avoid on all:** preschool/pre-k phrasing (cluster 2), "generator" phrasing (tool page)
- **Redirects still consolidating into primary:** `/blog/report-card-comments-for-students-with-behavior-problems` (merged 2026-07-04, old URL still earned 32 clicks/1,382 imp in GSC — normal lag, do nothing), `/blog/behavior-comments-for-report-cards`, `/blog/how-to-write-honest-behavior-comments`, `/blog/how-to-write-behavior-comments-on-report-card`
- **Cannibalization:** none active after the 07-04 merge; watch that consolidation completes (check ~2026-08-15)
- **Recommendation:** leave alone structurally. **Hub gap:** this is the site's #1 clicking cluster and the only major cluster without a hub. Build a report-card-comments hub before October report-card season, linking every supporting page + the generator.
- **US performance: UNTESTED, not poor (established 2026-07-30).** This cluster's blended numbers are its best, and its US numbers are its worst (primary reads 8.8 blended, 40.0 US-only). The tempting conclusion, that report-card content is a poor funnel fit and the October hub should be dropped, was drafted and then **disproven**. During the US report-card season this site has actually lived through (2026-05-15 to 06-20), these six pages sat at **positions 35 to 75**, i.e. pages 4 through 8:

  | Page | US imp | US clicks | US pos |
  |---|---|---|---|
  | report-card-comments-for-behavior | 62 | 0 | 35.7 |
  | report-card-comments-for-students-with-behavior-problems | 23 | 0 | 40.1 |
  | how-to-write-behavior-comments-on-report-card | 21 | 0 | 74.9 |
  | report-card-comments-behavior-preschool | 16 | 0 | 37.6 |
  | report-card-comments-for-students-with-adhd | 10 | 0 | 40.6 |
  | behavior-comments-for-report-cards | 6 | 0 | 66.2 |

  Zero US clicks at position 35+ is the expected result of not being visible, not evidence that US teachers don't want this content. The primary has since climbed from 35.7 to ~15. **The cluster has never been tested against US traffic while ranking.** Do not judge it until it has been.
- **Keep the October hub.** Its original rationale rested on blended data, but the corrected reading supports it more strongly: build the asset during the trough so it has a quarter of indexing before the next US cycle. Same logic applies to the Report Card Comment Library product.
- **Real checkpoints for this cluster:** early November 2026 (first US season with plausible rankings) and late May/June 2027 (the decisive one, matching the window measured above). Two of the six pages sat at 66 and 75, far worse than the rest; if they have not moved substantially by November, distinguish "young page" from "page isn't good enough for the query" then, not now.

## 2. Preschool

- **Primary (general):** `/blog/preschool-report-card-comments` — owns: preschool/pre-k report card comments, progress report comments, 3-year-old and 4-year-old comments, daycare/nursery report comments, end-of-year, all developmental/academic domains
- **Primary (behavior):** `/blog/report-card-comments-behavior-preschool` — owns: preschool behavior comments, routines, transitions, self-regulation, following directions, emotional regulation, sharing/turn-taking struggles, separation
- **Query overlap: RESOLVED on its own. Re-measured 2026-07-30, no action needed.**
  - The 2026-07-17 entry labelled this "CONFIRMED cannibalization" on a single-day snapshot showing two URLs appearing for overlapping queries. **That label was wrong.** Overlap is not cannibalization: proving it needs URL flipping over time, or one page rising as the other falls, and that evidence was never collected. Treat "both pages appear for a query" as a prompt to measure, never as a finding.
  - **What the data actually shows (28d, 2026-07-02 to 07-30).** "preschool report card comments": general page 3 clicks @15.1, behavior page 0 clicks @19.1. The correct page wins outright. The general page climbed from **@40.3 (Jun 1-Jul 15) to @15.1**, roughly 25 positions, **with none of the proposed restructuring applied.** Both pages were simply weak on that generic, most likely competition, not each other. Their 8.3/8.8 site-wide averages against 20s-40s on the contested generics was the tell, and it was visible in the original data.
  - **The pages have separated cleanly.** General owns the "3/4 year old progress report comments" family (8 clicks, 179 imp @5.2), nursery, and generic preschool. Behavior owns "daily behavior report for preschool," "preschool behavior report," "behavior report preschool," "pre k comments for report cards." That is the split the 07-17 spec was trying to engineer, arrived at without it. The 2026-07-28 heading-pattern fixes (pilot batch) plausibly helped.
- **The 2026-07-17 differentiation spec is now OBSOLETE. Do not execute it.** Running it today would move self-regulation/routines content off a page ranking @5.2 for its best query family and retitle a behavior page that is now correctly picking up behavior-specific queries. It would break something that fixed itself.
- **Must not merge:** these two pages. Still true, and now for a better reason: they demonstrably own different queries.
- **Real opportunity here:** "daily behavior report for preschool" sits at **11 imp @34.5 with zero clicks** on the behavior page. That is a dedicated-post gap, not a restructuring problem. See planned additions.
- **Planned additions:** "Daily behavior report for preschool (free template)" (Aug 2026 post — will own that query); "Kindergarten report card comments" (Oct 2026 post).
- **Method note for whoever reads this next:** `gsc_query_for_page` returned "No query data found" for the general page on two date ranges ending 2026-07-01, while overlapping ranges returned full data for the same URL. The empty results were an artifact, not zero traffic. If this tool returns empty for a page you know has clicks, re-run with a shifted window before concluding anything.

## 3. Parent emails

- **Primary:** `/blog/sample-emails-to-parents-about-student-behavior` (2,375 imp, pos 6.7, 58 clicks — site's #1 page)
- **Supporting:** `how-to-write-behavior-emails-to-parents` (how-to intent), `how-to-email-parents-about-bad-behavior`, `positive-behavior-email-to-parents-template`, `sample-emails-to-parents-about-missing-homework`, `how-to-email-parents-about-academic-concerns`, `email-to-parents-about-fight-at-school`, `parent-email-after-difficult-phone-call`, `free-parent-email-templates-for-teachers`
- **Primary owns:** sample emails to parents about behavior, email to parent about student behavior, how to write an email to a parent about their child's behavior
- **Avoid:** none critical; the samples/how-to split is intentional and working
- **Cannibalization:** none observed
- **Recommendation:** leave alone. Pending CTR fixes only: primary's meta description (front-load "copy-paste"), fight-at-school title (clarify teacher audience; 292 imp, pos 8.0, 0.68% CTR from mixed parent/teacher searchers). **Gap:** sick-student check-in email (~14 imp across 8 uncontested variants) — future spoke.

## 4. Welcome and introduction (back-to-school)

- **Primaries:** `/blog/welcome-letter-to-parents-from-teacher` (letters), `/blog/short-welcome-message-to-parents-from-teacher` (app/text/WhatsApp messages), `/blog/teacher-introduction-letter-to-parents` (introductions + in-person script), `/back-to-school-toolkit` (tool; conversion, not SERP)
- **Owns respectively:** welcome letter queries / short message + WhatsApp queries / introduction letter + "introduce yourself to parents" + meet-the-teacher queries / none (tool)
- **Known benign overlap:** welcome-letter post ranks ~10 for "short welcome message" while the dedicated page ranks 2.3 — the right page wins; leave alone.
- **Status:** fully interlinked and refreshed 2026-07-17 (commit 3cb7772). Decision per SERP check: "how to introduce yourself to parents as a teacher" is letter-intent; it lives IN the intro-letter post, not a separate article. Do not create a standalone "introduce yourself" post.

## 5. Behavior tracking apps

- **Primary:** `/blog/best-behavior-tracking-apps-for-teachers-2026` (492 imp, pos 9.7)
- **Redirect still consolidating:** `/blog/classroom-behavior-tracking-apps` → primary. Old URL still held 535 imp/pos 16.1 including "behavior tracking app" (23 imp @13.8) and a 42-imp share of the AI query "compare special education software for integrating behavioral tracking." Do nothing except wait; re-check ~2026-08-15. No internal links point at the old URL (verified 2026-07-17).
- **Primary owns:** behavior tracking app(s) (for teachers), free behavior tracking apps, behavior tracking software (for schools), behavior tracker app, app to track student behavior
- **Avoid:** "behavior management apps" (cluster 6), "student observation apps" (cluster 7), "special education software" (cluster 8)
- **Recommendation:** see app-roundup consolidation plan below before editing.

## 6. Behavior management apps

- **Primary:** `/blog/best-behavior-management-apps-for-teachers-2026` (100 imp, pos 19)
- **Redirect consolidating:** `/blog/5-behavior-management-apps-for-teachers` → primary (40 imp still on old URL, pos 45)
- **Primary owns:** behavior management apps for teachers, classroom behavior management apps/software/systems, behavior management tools
- **Avoid:** "tracking" phrasing in every H2
- **Current cannibalization:** "behavior management apps for teachers" (40 imp, overall pos 15.6) splits across the old tracking URL (pos 54), this page (pos 45), and at least one other page ranking ~15. Differentiation plan below.

## 7. Observation apps

- **Primary:** `/blog/best-student-observation-apps-for-teachers` (43 imp "student observation apps", pos 15.2)
- **Owns:** student observation apps, classroom observation app vs spreadsheet (partially), teacher observation app (ambiguous)
- **Unowned intent:** "classroom observation app" (26 imp, pos 18.5) and "lesson observation app" (10 imp, pos 12.5) are mostly ADMIN-observing-TEACHER intent — a different buyer than ShortHand's. **Open decision for Greg:** target that audience with a separate post or ignore it. Do not bolt admin-observation content onto the student-observation post.

## 8. Special education / IEP

- **Primary:** `/blog/special-education-behavior-tracking-software` — **Unparked 2026-09-04.** The 2026-08-13 audit window passed; fresh unfiltered pull (2026-08-06 to 2026-09-02) confirms the prior finding: 906 of ~1,400 impressions across 8 weeks (65%) are one non-converting AI-crawler query, `compare special education software for integrating behavioral tracking.` @ pos 10.2, 0 clicks ever. Page-level position improved 14.4 -> 11.6 -> 10.9 but clicks stayed flat at 0-3/month — the position gain is the AI-citation query, not real ranking strength. Real teacher-intent queries sit at pos 20-50 (`special education software for teachers` 43 imp @29.3, `special education data collection apps` @30.3). Title/meta left alone (no realistic CTR upside while the AI query dominates impressions); instead did a content/internal-linking pass: added a "patterns over time" section linking to the MTSS post, connected parent-contact documentation to `how-to-document-parent-contact-for-iep`, and linked the IEP documentation checklist, none of which existed as in-body links before. Watch the real long-tail queries (excluding the AI query) for movement before considering this page again.
- **Supporting:** `iep-behavior-documentation-checklist`, `how-to-document-parent-contact-for-iep` (114 imp, pos 8.1), `how-to-document-student-behavior-for-iep`, `what-to-say-at-an-iep-meeting`, `iep-meeting-checklist-for-teachers`, `iep-meeting-notes-template`, `special-education-paraprofessional-first-year`
- **Notable:** the 235-imp AI-engine query "compare special education software for integrating behavioral tracking." splits between this page and the old tracking-apps URL. Fold into the Aug 13 audit.
- **Planned:** IEP service tracking / progress reporting post (Nov 2026, post-audit; "best iep service tracking software for reporting" 12 imp @9.7 currently unowned).

## 9. ClassDojo comparisons — PROTECTED CLUSTER

- Five posts carry `mergeNote` frontmatter (Decisions Log 2026-07-13): **do not merge or redirect any of them without fresh query-level cannibalization evidence.**
- **Primary (roundup):** `/blog/best-classdojo-alternatives-2026` (1,344 imp, pos 7.9). **Head-to-head:** `classdojo-vs-seesaw-2026` (500 imp, pos 7.1). Supporting: `classdojo-alternative` (blog), `7-reasons-classdojo-alternatives`, `why-teachers-are-switching-from-classdojo-to-shorthand`. Note the separate marketing landing page `/classdojo-alternative` (app route) also exists — intentional, signup-first CTA per funnel-decisions.md.
- **Re-verified 2026-07-26 (query×page, 28d vs prior 28d): still NO cannibalization.** Every query resolves to one page with the loser 15-40 positions behind at single-digit impressions ("class dojo alternatives" roundup 6.5 vs seesaw 23.5; "seesaw vs class dojo" seesaw 4.2 vs roundup 20.0). Google is choosing correctly. Five-post separation confirmed; mergeNotes stay.
- **Primary now:** 47 clicks / 1,749 imp / 2.69% CTR / pos 6.9 (was pos ~16). Position fix worked. **Note:** a US-only slice of this page reads 292 imp / 0.68% CTR and excludes the converting query — do not use that number to judge the page.
- **Done 2026-07-26:** added "Best ClassDojo Alternatives by Need" (documentation, parent comms, points, grading, lesson planning) + a "ClassDojo vs HiTeach" section to the roundup. Closes the zero-click gap on `classdojo alternatives for grading` (40 imp, pos 5.9), `...for lesson planning` (17 imp, pos 9.1), `...for points` (19 imp, pos 5.9) and pulls `which is better: classdojo vs. hiteach` (27 imp, pos 4.6) off the Seesaw post, which never mentioned HiTeach. Grading/lesson-planning entries deliberately route searchers to SIS/planning tools and state ShortHand does not serve those needs.
- **Owns (added):** classdojo alternatives for grading / for lesson planning / for points, classdojo vs hiteach.
- **Watch (~2026-08-20):** whether the grading/lesson-planning queries convert now or stay at 0 CTR. If impressions hold at pos ~6 with still-zero clicks, the cause is AI Overview absorption, not the page, and no further content work is warranted.
- **Do not read those sections before ~2026-08-20 (noted 2026-07-30).** A 28d US pull on 07-30 showed grading 37 imp @5.8 / points 17 @5.7 / lesson-planning 15 @8.9, all zero clicks, and this was briefly taken as the Aug 20 rule firing early. It was not: the sections went live 2026-07-26, so they existed for **4 of those 28 days** while the impressions accumulated mostly before they existed. Google also typically takes 2-8 weeks to re-evaluate after a content change. The Aug 20 date was chosen for this reason and should not be pulled forward.
- **US-only 28d snapshot for the primary, 2026-07-02 to 07-30 (context for Aug 20, not a verdict):** 323 imp / 2 clicks / 0.62% / pos 7.7 across 39 queries. Sister page `classdojo-vs-seesaw-2026`: 61 imp / 0 clicks / pos 7.7. Low CTR at a good position is real at the page level here, but the cause is not established: SERP composition (see preamble), young domain, and snippet quality are all live candidates. Two clicks on the one converting query is not enough to distinguish them.
- **Pending adds:** "ClassDojo vs Remind" post (Dec 2026 — head-to-head = distinct intent per the mergeNotes).

## 10. MTSS / interventions

- **Pages:** `how-to-document-tier-2-interventions-for-mtss` (8.7% CTR — overperformer), `behavior-intervention-plan-template`, `behavior-intervention-plan-vs-iep`, `behavior-intervention-plan-for-off-task-behavior`
- **Owns:** tier 2 intervention documentation, MTSS documentation, BIP template/vs IEP
- **Recommendation:** leave alone; ensure the behavior-documentation hub links all four.

## 11. Classroom management

- **Pages:** `classroom-management-plan-template` (pos 20.7), `classroom-management-without-yelling` (pos 21.5), `classroom-management-for-disruptive-students`, `how-to-redirect-student-behavior`, `student-behavior-problems-in-the-classroom`
- **Reality check:** big competitive arena, thin authority, no hub. **Recommendation:** leave alone in 2026; revisit as a 2027 cluster decision. Do not add posts here while report-card and back-to-school clusters have open work.

---

# App-roundup consolidation plan (cluster 5/6/7)

**Written 2026-07-17. Verified: zero internal links point to any redirected URL. All consolidation lag is Google-side; there is nothing to "fix" mechanically. The remaining work is content differentiation, and it should NOT be rushed.**

Query-family → intended target:

| Query family | Target URL |
|---|---|
| behavior tracking app(s), tracker, software, free | best-behavior-tracking-apps-for-teachers-2026 |
| behavior management apps/software/tools/systems | best-behavior-management-apps-for-teachers-2026 |
| student observation apps | best-student-observation-apps-for-teachers |
| classroom/lesson observation app (admin intent) | none (open decision) |
| apps like/similar to classdojo, competitors, alternatives | best-classdojo-alternatives-2026 |
| parent communication apps (institutional) | best-parent-communication-apps-for-documentation-2026 (reposition toward "documentation" phrasing; do not chase "school communication app") |

Safe to do now (low risk):
1. Nothing mechanical — link hygiene already clean (verified).
2. When editing either roundup for any other reason: remove the other cluster's head term from H2s ("management" out of the tracking post's headings, "tracking" out of the management post's headings). Title/H1 changes NOT included until consolidation settles.

Wait until ~2026-08-15 (after redirect consolidation is checked in GSC):
3. If the old tracking URL still holds rankings: request re-indexing of `/blog/classroom-behavior-tracking-apps` in Search Console to push the 301 through.
4. Then differentiate intros/H2s of both roundups in one pass, and add a "behavior tracking app features for primary classrooms" H2 to the tracking post (15 imp, pos 20.3, currently landing on the old URL).
5. Freshness pass on both roundups before back-to-school app-decision peak (mid-August).

Evidence bar for anything bigger (merging the two roundups, new observation post): fresh `gsc_query_for_page` pulls showing the same query splitting between them with material impressions. As of 2026-07-17 that bar is NOT met for a merge — the two roundups serve distinct query families.

## US-only pull on the four "better US targets" (2026-07-02 to 07-30)

A prior session listed four pages as better US targets on blended data. Segmented to `country = usa`, two of the four look different than expected. Single 28d window on a young site, so treat as a first read rather than a ranking.

| Page | US imp | US clicks | US pos | Note |
|---|---|---|---|---|
| `special-education-behavior-tracking-software` | 350 | 0 | 17.6 | **253 imp (72%) come from one AI-phrased query**, `compare special education software for integrating behavioral tracking.` @9.9, 0 clicks. Excluding it, ~97 real imp. Genuine queries underneath: `behavior tracking software` 22 @16.1, `best iep service tracking software for reporting` 12 @9.7, `best behavior plan software for special education` 4 @7. **Still parked to 2026-08-13; leave parked.** |
| `classroom-behavior-tracking-apps` | 150 | 0 | 19.7 | Best query set of the four: `behavior tracking app` 23 @11.6, `free behavior tracking apps for teachers` 15 @4.8, `behavior tracking apps` 8 @9.4, `student behavior tracking app` 3 @8.3. But this URL is **supposed to be 301'd** into the 2026 roundup (272 US imp @11.1) and is still holding impressions. Looks like a consolidation issue rather than a content opportunity. Handle via the 2026-08-15 redirect check above, not as a writing task. |
| `best-parent-communication-apps-for-documentation-2026` | 258 | 0 | 41.6 (US-only, stale) | **Correction 2026-09-03:** this US-segmented row understated the page badly — unfiltered `page`-level data for 2026-08-06 to 2026-09-02 shows 2,940 imp / 45 clicks / 1.53% CTR / **pos 13.2**, up from pos 19.9 the prior 28 days and pos 12.2 in the trailing 7 days. Consistent with the known GSC country-filter undercount/scramble artifact. Do not use US-segmented single-page pulls to judge this page; use unfiltered `gsc_report`/`gsc_query_for_page`. Narrow CTR/structure pass done 2026-09-03 (title, meta, comparison table, ShortHand differentiator, 2 internal links) — see git history on the post for details. |
| `how-to-track-student-behavior-in-the-classroom` | 95 | 0 | 48.9 | Weakest. `behavioral pattern tracking` is 54 imp (57%) @49.2 and may not be teacher intent. Informational query set. Deprioritise. |

Sitewide US context for the same window: **10 clicks across 47 pages.** Most pages with real impressions sit at pos 15-50. Any conclusion drawn from a single page's US clicks in this window is drawing on near-zero events.

---

# Metrics and check dates

- **2026-08-15:** GSC check — redirect consolidation (clusters 1, 5, 6): old URLs should be shedding impressions. Welcome cluster positions (expect welcome-letter post moving from ~14.7 toward top 10 as August volume arrives). `/report-card-comment-generator` indexed and replacing `/free-tool` in GSC (expect position improvement from 79 baseline; realistic target 15-25 by October).
- **2026-08-20:** ClassDojo roundup check (cluster 9). Re-pull `gsc_query_for_page` for `/blog/best-classdojo-alternatives-2026`. Baseline to beat: 47 clicks / 1,749 imp / 2.69% CTR / pos 6.9 (28d to 2026-07-25). Watch the four queries the 2026-07-26 sections targeted: `classdojo alternatives for grading` (40 imp @5.9, 0 clicks), `...for points` (19 @5.9, 0), `...for lesson planning` (17 @9.1, 0), `which is better: classdojo vs. hiteach` (27 @4.6). **Clicks appear = success, stop. Impressions hold at pos ~6 with still-zero clicks = AI Overview absorption, not the page: stop, do not keep editing.** Position drop = revert. Do NOT judge this page from the US-only slice (292 imp / 0.68% CTR), it excludes the converting query.
- **2026-08-13:** special-ed audit (pre-existing commitment) — fold AI-query routing into it.
- **2026-09-15:** back-to-school cluster review — clicks on welcome/intro/toolkit pages; decide whether the intro post's in-person section captures "how to introduce yourself" clicks.
- **2026-10-15:** report-card season pre-check — preschool differentiation results (generic "preschool report card comments" should have ONE page ranking, position <15), hub build decision, generator page position.
- **2026-11-05:** report-card cluster, first US-season read. Segment `country = usa`. Baseline to beat is the 2026-05-15 to 06-20 table in cluster 1 (six pages, 138 US imp, 0 US clicks, positions 35-75). Any US clicks at all is new information. Also check whether the two worst pages (66.2, 74.9) have moved.
- **2027-05-25:** the decisive report-card read, same window as the original measurement. This is the first apples-to-apples US season comparison and the point at which "is this cluster worth more investment" can honestly be answered.
- **2027-04-08:** one full year of data. First point at which seasonality can be separated from the new-domain indexing curve. Before this date, treat all year-over-nothing trend claims as confounded.
- **Baselines (90d ending 2026-07-17):** site 316 clicks / ~20,000 impressions; top pages listed in cluster sections above.
- **Geography baselines (90d ending 2026-07-30, for the checkpoints above):** US 383 clicks / 21,215 imp / pos 12 blended-window; GA4 30 US signups vs 2 non-US; ~13 total US blog clicks sitewide. Daily US impressions late July: 500-1,455. Daily US impressions early June: 96-208.
