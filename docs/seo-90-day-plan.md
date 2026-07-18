# SEO 90-Day Operating Plan (2026-07-18 to 2026-10-16)

**Written:** 2026-07-18 (flagship exit session). **Companion to:** `docs/seo-query-ownership.md` (the query→URL ownership map, created 2026-07-17). Check that map before creating, merging, or retitling ANYTHING. This plan tells you WHEN and WHAT; the map tells you WHO OWNS WHICH QUERY.

**Data basis:** GSC 90-day window ending 2026-07-17 (site baseline: 316 clicks, ~20,000 impressions), GA4 28-day window, live SERP checks from the 2026-07-17 audit.

**Seasonal logic that drives every date in this plan:**
- **August:** back-to-school. Welcome-letter/intro queries spike, and teachers pick their behavior/communication apps for the year (app roundup peak ~mid-August).
- **October to December:** report-card season. The report-card-comments cluster (the site's #1 clicking cluster) peaks. Everything report-card must be live and interlinked BEFORE October.
- The welcome cluster refresh, generator migration, and preschool differentiation already shipped (commits `3cb7772`, `cfd4cfe`, `d591151`). This plan is what comes next.

---

## Execution order at a glance

| # | Project | Type | When | Impact | Confidence |
|---|---------|------|------|--------|------------|
| 1 | CTR fixes: parent-email meta + fight-at-school title | Existing-page | Now (July) | Medium | High |
| 2 | GSC indexing requests (Greg, manual) | Technical | Now (July) | Medium | High |
| 3 | ClassDojo roundup: add "vs Hiteach" section | Existing-page | July/early Aug | Small-Medium | High |
| 4 | New post: Daily Behavior Report for Preschool (Free Template) | New content | Early Aug | Medium | Medium-High |
| 5 | 2026-08-13 special-ed audit (pre-committed) | Audit/decision | Aug 13 | Medium | Medium |
| 6 | 2026-08-15 consolidation check + app-roundup differentiation | Consolidation | ~Aug 15 | Medium | Medium |
| 7 | Report-card comments HUB build | New content | Sept | **High** | High |
| 8 | New post: Kindergarten Report Card Comments | New content | Late Sept/early Oct | Medium | Medium-High |
| 9 | 2026-09-15 back-to-school review | Measurement | Sept 15 | n/a | n/a |
| 10 | 2026-10-15 report-card pre-season check | Measurement | Oct 15 | n/a | n/a |

Parked (do NOT start in this window): classroom-management cluster, admin-observation post (needs Greg's call), sick-student email spoke, ClassDojo vs Remind (Dec), IEP service tracking post (Nov, post-audit), generator-article fold decision (Dec).

---

## A. Existing-page improvements

### Project 1 — CTR fixes on the two parent-email pages
- **Expected impact:** Medium. The primary is the site's #1 page (58 clicks/2,375 imp/90d, pos 6.7); a better meta description at position 6-7 realistically lifts CTR 20-40%. Fight-at-school has 292 imp at pos 8.0 with 0.68% CTR, which is starved.
- **Confidence:** High. Pure CTR mechanics, no ranking risk.
- **Primary URLs:** `/blog/sample-emails-to-parents-about-student-behavior`, `/blog/email-to-parents-about-fight-at-school`.
- **Why prioritized:** cheapest clicks available anywhere on the site; zero structural risk; no seasonal dependency, so do it first.
- **Exact changes:**
  - `posts/sample-emails-to-parents-about-student-behavior.md`: rewrite `excerpt` frontmatter to front-load the copy-paste promise (e.g. "Copy-paste email templates for telling parents about behavior problems, written by a teacher. Polite, professional, and ready in 2 minutes."). Under 160 chars.
  - `posts/email-to-parents-about-fight-at-school.md`: retitle to make the TEACHER audience explicit (mixed parent/teacher searchers are suppressing CTR). Something like "Email to Parents About a Fight at School: What Teachers Should Say (Templates)". Keep the slug.
- **Must not change:** slugs, dates, H2 structure, internal links, the samples/how-to split with `how-to-write-behavior-emails-to-parents` (intentional and working, per ownership map cluster 3).
- **Risks:** minimal. A title change can wobble rankings 1-2 weeks.
- **Measure:** 2026-08-15 and 2026-09-15 in GSC. **Success:** primary page CTR up at same position; fight-at-school CTR > 1.5%. **Failure:** CTR flat after 6 weeks at same position → try a second meta variant; position drop > 3 spots sustained 4 weeks → revert title.
- **Execution prompt:**
  > In c:\Projects\Shorthand-website: (a) rewrite the `excerpt` frontmatter of `posts/sample-emails-to-parents-about-student-behavior.md` to front-load the copy-paste promise, under 160 characters; (b) retitle `posts/email-to-parents-about-fight-at-school.md` so the title clearly addresses teachers (not parents), keeping the slug and date unchanged. No em dashes anywhere. Do not touch headings, body, or links. Read docs/seo-query-ownership.md cluster 3 first. Build, commit, push.

### Project 3 — ClassDojo roundup: add "ClassDojo vs Hiteach" section
- **Expected impact:** Small-Medium. Query "classdojo vs hiteach" has 23 imp at pos 5.5 with ZERO coverage on the page; adding a section usually consolidates a top-5 position into clicks.
- **Confidence:** High (we already rank; we're just adding the content Google thinks we have).
- **Primary URL:** `/blog/best-classdojo-alternatives-2026` (1,344 imp, pos 7.9).
- **Why prioritized:** quick win on a PROTECTED page; content addition only, well within the mergeNote rules.
- **Exact changes:** add one H2 "ClassDojo vs Hiteach" (or fold as an entry in the roundup's comparison structure, matching the page's existing pattern) with an honest 150-250 word comparison. Add Hiteach to any comparison table if one exists.
- **Must not change:** anything else on the page; do NOT merge/redirect any of the 5 ClassDojo posts (mergeNote frontmatter, Decisions Log 2026-07-13); do not touch `classdojo-vs-seesaw-2026`.
- **Risks:** low. Don't let the new section dilute the "alternatives" head term; keep it one section.
- **Measure:** 2026-09-15. **Success:** "classdojo vs hiteach" earning clicks, position ≤ 5. **Failure:** no impressions shift after 8 weeks → leave it, it cost one section.
- **Execution prompt:**
  > In c:\Projects\Shorthand-website: read `posts/best-classdojo-alternatives-2026.md` and docs/seo-query-ownership.md cluster 9 first. Add ONE new section covering "ClassDojo vs Hiteach" (23 impressions at position 5.5, zero current coverage), matching the page's existing per-app section format, 150-250 words, honest teacher-voice comparison. Do not modify any other section, the title, or any links. Do not merge or redirect anything. No em dashes. Build, commit, push.

### Project 6 — App-roundup differentiation (AFTER the Aug 15 consolidation check)
- **Expected impact:** Medium. "behavior management apps for teachers" (40 imp) currently splits across 3 URLs; the tracking post's primary-classroom subtopic (15 imp, pos 20.3) lands on a redirected URL.
- **Confidence:** Medium (redirect consolidation must finish first; that's Google-side and we can't force it beyond a re-index request).
- **Primary URLs:** `/blog/best-behavior-tracking-apps-for-teachers-2026`, `/blog/best-behavior-management-apps-for-teachers-2026`.
- **Why prioritized (and why NOT sooner):** the staged plan in `docs/seo-query-ownership.md` (bottom section) explicitly waits for the ~2026-08-15 GSC check. Editing while Google is still consolidating 301s muddies attribution of what worked.
- **Exact changes (steps 3-5 of the map's staged plan):**
  1. If `/blog/classroom-behavior-tracking-apps` still holds rankings on Aug 15: request re-indexing of that URL in Search Console UI (pushes the 301 through).
  2. One differentiation pass on both roundups: remove "management" from every H2 on the tracking post, remove "tracking" from every H2 on the management post. Intros rewritten to state each page's lane in the first 100 words.
  3. Add H2 "Behavior tracking app features for primary classrooms" to the tracking post.
  4. Freshness pass on both (update app facts, dates, screenshots references) before the mid-August app-decision peak. If Aug 15 is too late for the peak, the freshness pass alone (no heading surgery) may be done in the first week of August.
- **Must not change:** titles/H1s (explicitly excluded until consolidation settles); do NOT merge the two roundups (evidence bar not met, per map); don't touch the observation-apps post.
- **Risks:** heading changes on pages mid-consolidation can delay settling; that's why this is gated on the Aug 15 check.
- **Measure:** 2026-09-15, then 2026-10-15. **Success:** "behavior management apps for teachers" resolves to ONE ranking URL (the management roundup) at better than pos 15; old URLs shed impressions. **Failure:** still split in mid-October → escalate to the evidence-bar review described in the map before considering anything bigger.
- **Execution prompt:**
  > In c:\Projects\Shorthand-website: read docs/seo-query-ownership.md sections 5, 6, 7 and the "App-roundup consolidation plan" at the bottom. Today is after 2026-08-15. First pull fresh GSC data with gsc_query_for_page for /blog/classroom-behavior-tracking-apps, /blog/best-behavior-tracking-apps-for-teachers-2026, and /blog/best-behavior-management-apps-for-teachers-2026. Then execute steps 3-5 of the staged plan exactly as written there (re-index request note for Greg, H2 differentiation pass, new primary-classrooms H2, freshness pass). Titles and H1s must NOT change. The two roundups must NOT be merged. No em dashes. Build, commit, push, and update the map's cluster 5/6 entries with what you did.

---

## B. New content

### Project 4 — "Daily Behavior Report for Preschool (Free Template)" post
- **Expected impact:** Medium. "daily behavior report for preschool" (9 imp) currently lands WRONG on the behavior-comments page at pos 34; a dedicated template post owns an uncontested query family and strengthens the preschool cluster.
- **Confidence:** Medium-High. Template/artifact posts are this site's proven winners ("pages win when they ARE the artifact," per the ownership map).
- **Primary URL (new):** `/blog/daily-behavior-report-for-preschool` (or similar slug with the exact phrase).
- **Supporting:** links to `/blog/preschool-report-card-comments`, `/blog/report-card-comments-behavior-preschool`, and the behavior-documentation hub.
- **Why prioritized:** August timing = preschool/daycare year start; the query is currently misrouted; planned in the map (cluster 2) since 2026-07-17.
- **Exact changes:** new post per the global blog workflow (Gemini prompt → Greg pastes → save to `posts/`). Must include an actual fill-in template (the artifact), preschool-specific behavior examples, FAQ 3-4 questions.
- **Must not change:** the two existing preschool posts (differentiation just shipped in `d591151`; they are in a measurement window until 2026-10-15).
- **Risks:** cannibalization with the behavior-comments post if the new post uses "report card comment" phrasing. Rule: this post NEVER uses "report card" in title or headings; it owns "daily behavior report" only.
- **Measure:** 2026-09-15 (indexing + first impressions), 2026-10-15. **Success:** post ranks top 20 for "daily behavior report for preschool" and the behavior-comments page stops receiving that query. **Failure:** both pages ranking for it by mid-October → tighten internal anchor text and de-optimize the older page's stray mention.
- **Execution prompt:**
  > Follow the blog post workflow in global CLAUDE.md (Step 3) to write a Gemini prompt for a post targeting "daily behavior report for preschool", a free-template post in the preschool cluster. Requirements beyond the standard rules: the post must contain an actual copyable daily behavior report template (the artifact itself); it must never use the phrase "report card" in the title or any heading (that belongs to the two existing preschool report-card posts, see docs/seo-query-ownership.md cluster 2); internal links to /blog/preschool-report-card-comments, /blog/report-card-comments-behavior-preschool, and the behavior-documentation hub. After Greg returns the draft, save as posts/daily-behavior-report-for-preschool.md with bare YYYY-MM-DD date, build, commit, push, and add the new URL to docs/seo-query-ownership.md cluster 2.

### Project 7 — Report-card comments HUB (the single highest-impact project in this plan)
- **Expected impact:** **High.** Report-card comments is the site's #1 clicking cluster (primary alone: 50 clicks, 2,480 imp, pos 8.2) and the ONLY major cluster without a hub. Hubs on this site demonstrably concentrate authority (the 4 existing hubs anchor their clusters). Built in September, it compounds through Oct-Dec report-card season.
- **Confidence:** High. Proven pattern on this exact site.
- **Primary URL (new):** a hub page, e.g. `/blog/report-card-comments-guide` or a dedicated route like the existing hub pages (match whatever pattern `teacher-parent-communication-guide` uses).
- **Supporting URLs (all get linked FROM the hub, and all link BACK):** `report-card-comments-for-behavior` (primary), `report-card-comments-for-students-with-adhd`, `report-card-comments-for-struggling-students`, `second-grade-behavior-report-card-comments`, `social-emotional-report-card-comments`, `student-progress-report-comments-for-teachers`, `parent-teacher-conference-comments-for-teachers`, both preschool posts, `/report-card-comment-generator` (the tool), `/blog/free-report-card-comment-generator`, and (once live) the kindergarten post.
- **Why prioritized:** highest-authority cluster + hard seasonal deadline (must be indexed and passing internal-link equity before October).
- **Exact changes:**
  - New hub page: intro (what makes a good comment), then sections linking each spoke with 2-3 sentence descriptions, prominently featuring the generator tool.
  - Add hub link to every spoke post's related-links section (this is the step that always gets skipped; do not skip it).
  - Hub targets broad "report card comments" informational intent but must NOT try to outrank its own spokes: no long lists of actual comments on the hub (the spokes ARE the artifacts).
- **Must not change:** spoke titles/slugs; the preschool pair (measurement window); the generator page structure (SSR fix from `cfd4cfe` must stay: header/H1 outside LeadGate).
- **Risks:** hub cannibalating the behavior primary if it carries comment lists. Mitigation is structural (links + descriptions only). Watch at the Oct 15 check.
- **Measure:** 2026-10-15 pre-season check, then December. **Success:** hub indexed by Oct 1; cluster-wide clicks in Oct-Nov beat the 90-day baseline run rate by 30%+; generator position improves toward 15-25. **Failure:** hub outranking a spoke for that spoke's own modifier query → strip the offending hub section down to a link.
- **Execution prompt:**
  > In c:\Projects\Shorthand-website: build the report-card comments hub. First read docs/seo-query-ownership.md cluster 1 and study how the existing hub `teacher-parent-communication-guide` is structured (find it in posts/ or app/). Create the hub following that exact pattern, linking ALL of these with 2-3 sentence descriptions each: report-card-comments-for-behavior, report-card-comments-for-students-with-adhd, report-card-comments-for-struggling-students, second-grade-behavior-report-card-comments, social-emotional-report-card-comments, student-progress-report-comments-for-teachers, parent-teacher-conference-comments-for-teachers, preschool-report-card-comments, report-card-comments-behavior-preschool, /report-card-comment-generator, and /blog/free-report-card-comment-generator. The hub must NOT contain lists of actual report card comments (the spokes own the artifacts). Then edit every one of those spoke posts to link back to the hub in their related-links/internal-link areas. No em dashes, bare YYYY-MM-DD date. Build, verify no post lost existing links, commit, push. Update docs/seo-query-ownership.md cluster 1 (it flags this hub as the known gap). Ask Greg to request indexing for the new hub URL.

### Project 8 — "Kindergarten Report Card Comments" post
- **Expected impact:** Medium. Extends the winning cluster into an uncontested age modifier before season; planned in the map.
- **Confidence:** Medium-High (same artifact+modifier formula).
- **Primary URL (new):** `/blog/kindergarten-report-card-comments`.
- **Why prioritized:** must be indexed ~4-6 weeks before late-October report-card writing; late September publish is the deadline.
- **Exact changes:** standard workflow post, 60+ copyable comments organized by domain, links to hub + preschool general post + behavior primary + generator.
- **Must not change:** preschool pages (kindergarten post must not use "preschool"/"pre-k" phrasing in headings; those belong to cluster 2).
- **Risks:** overlap with second-grade and preschool posts. Rule: "kindergarten" modifier in title and headings, never bare "report card comments" as a heading.
- **Measure:** 2026-11-15. **Success:** top 20 for "kindergarten report card comments" by mid-November. **Failure:** not indexed/ranking by Dec → check internal links and hub inclusion before touching content.
- **Execution prompt:**
  > Follow the blog post workflow in global CLAUDE.md Step 3 for a post targeting "kindergarten report card comments". Formula per docs/seo-query-ownership.md: the page must BE the artifact (60+ copyable comments) and carry the kindergarten modifier in title and headings; never use bare "report card comments" or any "preschool"/"pre-k" phrasing in headings. Internal links: report-card comments hub, preschool-report-card-comments, report-card-comments-for-behavior, /report-card-comment-generator. Save as posts/kindergarten-report-card-comments.md, add to the hub's link list, add to docs/seo-query-ownership.md cluster 2, build, commit, push.

---

## C. Consolidation, audits, technical

### Project 2 — Indexing requests (Greg, Search Console UI, no AI needed)
Still outstanding from 2026-07-17: `/report-card-comment-generator`, `/free-tool` (pushes the 308), `/back-to-school-toolkit`, the 4 URLs changed in `3cb7772`, plus `d591151`'s two preschool URLs. 10 minutes of clicking; do this week. Later additions: the daily-behavior-report post, the hub, the kindergarten post as each ships.

### Project 5 — 2026-08-13 special-ed audit (pre-existing commitment)
- **Scope per GSD.md + map cluster 8:** re-pull GSC page+query data for `/blog/special-education-behavior-tracking-software`; re-check the position 8-25 compliance/IEP-intent queries and cannibalization overlaps now that rankings settled; decide between title/meta change, content expansion, internal-link fix, or repositioning (leading candidate: away from enterprise/compliance intent toward the inclusion-teacher/IEP-adjacent angle). Fold in the routing decision for the 235-imp AI-engine query "compare special education software for integrating behavioral tracking." **Do not touch the page before Aug 13.**
- **Success:** a written decision (even "leave alone") recorded in the ownership map. The November IEP-service-tracking post is gated on this audit.
- **Execution prompt:**
  > It is on/after 2026-08-13. Run the special-ed audit committed in Brain GSD.md (SEO Status section, 2026-07-14 entry) and docs/seo-query-ownership.md cluster 8. Pull gsc_query_for_page for /blog/special-education-behavior-tracking-software plus the two app roundups. Answer: (1) has cannibalization on "behavior management apps for teachers" and the AI query resolved or persisted? (2) is the compliance/IEP query cluster still the page's uncontested territory? (3) recommend ONE action: title/meta change, content expansion, internal links, repositioning, or leave alone, with evidence. Write the decision into docs/seo-query-ownership.md cluster 8 and Brain GSD.md. Do not edit the post itself without Greg's approval of the recommendation.

### Project 6a — 2026-08-15 consolidation check (gate for Project 6)
Pull `gsc_page_performance` + `gsc_query_for_page` for every redirecting URL listed in the map's "check dates" section. Expected: old URLs shedding impressions; `/report-card-comment-generator` indexed and replacing `/free-tool`; welcome-letter post moving from ~14.7 toward top 10. Record results in the map, then trigger Project 6.

---

## D. Parked (do not start before 2026-10-16, or gated on Greg)

| Item | Why parked | Earliest revisit |
|---|---|---|
| Classroom-management cluster expansion | Thin authority, big competitive arena; map says 2027 decision | 2027 |
| Admin-observation post ("classroom/lesson observation app", 36 imp, admin-observing-teacher intent) | Different buyer than ShortHand's; **needs Greg's explicit call** | Greg decides |
| Sick-student check-in email spoke (~14 imp) | Real gap but below everything above | Nov 2026 |
| ClassDojo vs Remind post | Head-to-head = distinct intent (mergeNotes), planned Dec | Dec 2026 |
| IEP service tracking / progress reporting post | Gated on the Aug 13 audit outcome | Nov 2026 |
| `/blog/free-report-card-comment-generator` fold decision | Kept deliberately 2026-07-17; re-check impressions | Dec 2026 |
| FAQPage JSON-LD discrepancy (`app/blog/[slug]/page.tsx` emits it; CLAUDE.md says unused) | Deliberately unreconciled; investigate intent before changing either | When Greg asks |
| Preschool pair follow-up edits | Differentiation just shipped; measurement window | 2026-10-15 check |

## What must NOT change, anywhere in this plan
- The 5 ClassDojo posts: no merges/redirects (mergeNote frontmatter + Decisions Log 2026-07-13).
- The two preschool report-card posts: differentiate-only decision already executed; hands off until Oct 15.
- The two app roundups: no merge (evidence bar not met).
- `/blog/special-education-behavior-tracking-software`: parked until Aug 13.
- Redirected URLs (`/free-tool`, `/blog/classroom-behavior-tracking-apps`, `/blog/5-behavior-management-apps-for-teachers`, the merged report-card URLs): consolidation lag is normal; do nothing.
- The LeadGate SSR structure on both tool pages (H1/header outside the gate) — regression here re-creates the position-79 disaster.
- Frontmatter dates stay bare `YYYY-MM-DD` (a `T` crashes the sitemap build). No em dashes in any content. FAQPage schema stays out of new pages.
