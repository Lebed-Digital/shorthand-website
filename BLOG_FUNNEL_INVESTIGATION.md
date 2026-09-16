# Blog Funnel Investigation

**Date:** 2026-09-12
**Scope:** Read-only. Blog to product acquisition path on getshorthandapp.com, plus the receiving surface in `pulse 2.0`. No code changed.
**Data windows:** GSC + GA4, 2026-08-15 to 2026-09-12. Source counts read directly from the repo at this commit.
**Relationship to prior work:** builds on `WEBSITE_AUDIT.md` finding 2 and `docs/funnel-decisions.md`. Those established that blog CTAs are untracked. This investigation asks the prior question: what should the funnel be, before anyone instruments or rebuilds it.

---

## Fix Backlog (start here when implementing)

Every actionable item from all three passes, consolidated. Nothing below has been implemented. File and line references verified at this commit; re-check line numbers before editing since they drift.

**Read the linked section before doing any item.** The rationale, the measurement plan, and the reasons some of these are deliberately *not* worth doing all live there.

### Blockers, do these before the experiments

| # | Fix | Where | Why it blocks | Section |
|---|---|---|---|---|
| B2 | Raise `welcome-letter-generator` limit and stop keying it on raw IP | `lib/ratelimit.ts:16-21` (currently `slidingWindow(5, '1 h')`) | Experiment 2 would send school-NAT traffic into a 5/hour IP limit. Compare the NAT-aware paid helpers in the same file | Product Handoff, caveat 1 |
| B3 | Verify the Welcome Letter Generator on a real iPhone in Safari | `app/back-to-school-toolkit/WelcomeLetterClient.tsx` | Feeder post is 54.9% mobile, the tool is ~14% mobile. Cause unresolved read-only; standing rule says verify on device, don't infer | Follow-Up Pass, Answer to #1 |
| B4 | Turn on 25/50/75% scroll triggers in GA4 for 2 weeks on the four letter-cluster posts | GA4 config, no code | The 40-45% insertion depth for experiment 1 is currently a guess. Default `scroll` fires at 90% only | Correction section |

### Instrumentation, one work item

Do these together in a single PR. All 85 links get touched once.

| # | Fix | Where | Section |
|---|---|---|---|
| I1 | Route blog body CTAs through a tracked component so they fire `cta_click` and pass through `withAttribution` | `app/blog/[slug]/page.tsx` rendering, 85 links across 74 posts | Attribution Design |
| I2 | Stop hardcoding `ctaSource="blog"`; pass the post slug so clicks name a post | `app/blog/[slug]/page.tsx`, footer `TrackedLink`. Copy the `sourceSlug` pattern from `components/LibraryCtaBlock.tsx` | What We Cannot Measure, correction note |
| I3 | Give the "Keep Reading" related-post cards their own `cta_destination` | `app/blog/[slug]/page.tsx` related-posts grid | B (answers the cannibalization question for free) |
| I4 | Normalize the 24 anchors naming `getshorthandapp.com` that navigate to `app.getshorthandapp.com`, plus 3 install-flavored ones | 24 files in `posts/` | E (fold in here, do not schedule separately) |
| I5 | Add `withAttribution` and `event_callback` to the toolkit CTA | `app/back-to-school-toolkit/WelcomeLetterClient.tsx:298-305` | The only tracked CTA on the site missing attribution |

### Content and placement changes

| # | Fix | Where | Section |
|---|---|---|---|
| C1 | Move `RESOURCEOFFERMARKER` from ~87% to ~45% depth | `posts/positive-behavior-email-to-parents-template.md` | Experiment 1, cheapest test on the list |
| C2 | Add mid-article placements at ~40-45% | `posts/short-welcome-message-to-parents-from-teacher.md`, `posts/teacher-introduction-letter-to-parents.md` | Experiment 1 / 2 |
| C3 | Move `sample-emails-to-parents-about-student-behavior` from `PDF_GATES` to `RESOURCE_OFFERS`, marker position unchanged | `app/blog/[slug]/page.tsx:156` | Experiment 3 |
| C4 | Add a `RESOURCE_OFFERS` entry for `sample-emails-to-parents-about-missing-homework` (39 clicks, 60.3% bounce, offers nothing) | `app/blog/[slug]/page.tsx` | C, the only one of 13 zero-CTA posts worth touching |
| C5 | Place the two unused PDFs in-article: `mtss-tier-2-intervention-tracking-sheet.pdf` on the MTSS post (20 clicks, 4.45% CTR) and `student-behavior-pattern-tracker.pdf` | `app/blog/[slug]/page.tsx` `RESOURCE_OFFERS` | D |
| C6 | Consider signup-first (bare app URL) for the ClassDojo post, matching `/classdojo-alternative`. **Confirm with Greg first**, it departs from the blog-wide demo-first rule | `posts/best-classdojo-alternatives-2026.md` | Top Traffic Pages #6 |

### Separate PRs, do not bundle

| # | Fix | Where | Section |
|---|---|---|---|
| S1 | Add a mobile menu to blog post pages, and `/tools` + `/resources` to the mobile nav and footer | `app/blog/[slug]/page.tsx` nav, `app/globals.css:1060`, `components/Footer.tsx` | Executive Conclusion #4. **Ship separately from any CTA experiment or the results are unreadable** |

### Explicitly decided against

Do not redo this analysis later and reach the opposite conclusion without new data:

- **More CTAs.** 85 across 74 posts is about right. The problem is placement and destination.
- **12 of the 13 zero-CTA posts.** 4 are deliberate (they offer something better matched), 8 draw under 10 clicks each.
- **Deleting `/tools` or `/resources`.** Keep them as a browsable index, just stop treating them as the distribution path.
- **Touching the report-card cluster.** It is the one place everything already lines up, and it is the control group.
- **A new blog-specific analytics taxonomy.** `cta_click` + `cta_source` + `cta_destination` covers every question at this volume.
- **Chasing the two malformed indexed URLs.** Stale index entries, 1 impression each, not in `posts/` at this commit. See F.

---

## Executive Conclusion

**We have four problems, not one, and analytics is only the second most important.**

The audit framed this as a measurement gap. It is, but fixing measurement alone would instrument a funnel that is structurally broken in three other ways. Ranked by expected impact:

**1. Placement. The CTAs are below where the readers are.** Across the 74 posts that carry an app CTA, the median position of the first one is at **93% of the article**. 64 of 74 posts place every app CTA in the final 20%. Meanwhile only **5-18% of readers on the top posts reach 90% depth**, while engaging 40-50 seconds per pageview at 38-52% bounce. Readers are reading carefully, extracting the template they came for, and leaving before the CTA. Every other problem on this list is downstream of that one. This is not an argument for more CTAs, it is an argument that the ones we have are in the wrong place.

> **See the "Follow-Up Pass" section below before acting on this.** A second pass verified the scroll figure per page and corrected the mechanism behind it: readers are not inattentive, these posts are *transactional*. That changes what a mid-article CTA has to do and adds a success metric to experiment 1.

**2. Destination mismatch on the highest-traffic topics.** All 85 in-body CTAs point at the same URL: `https://app.getshorthandapp.com?demo=true`. Traffic is dominated by four welcome-letter and parent-email template posts (1,130 of ~2,000 GSC clicks, 57%). A reader who came for a welcome letter template lands on **"Welcome! Here's your demo class. 8 fake students are loaded with notes"** and is offered two next actions: *add a note on a student*, and *browse the student roster*. Neither is a welcome letter. The promise the article made is dropped at the door. Worse, we already own the right destination: `/back-to-school-toolkit` is a working Welcome Letter Generator, and it is the product experience that continues the #1 and #2 posts' promise exactly.

**3. Attribution and click tracking.** Confirmed as previously documented: 85 plain `<a>` tags rendered through `dangerouslySetInnerHTML`, no `fireCtaClick`, no `withAttribution`. GA4 shows blog as 4 of 96 `cta_click` events. All 7 attributed signups record `landing_page = "/"`. Real, but it is a measurement problem, and measurement of a funnel whose CTAs 87% of readers never see will mostly measure the 13%.

**4. Mobile discoverability is worse on blog pages than the audit found.** The audit noted `/tools` and `/resources` are missing from the homepage's mobile menu. The stronger finding: **blog post pages have no mobile menu at all.** `app/blog/[slug]/page.tsx` renders its own nav with no hamburger, and `app/globals.css:1060` sets `.nav-link { display: none !important; }` under 768px. On a phone, a blog post's entire navigation collapses to the logo and one "Get ShortHand" button. Mobile is 38% of users, and the blog is 97% of traffic, so this is the majority path.

> The follow-up pass strengthens this considerably: **mobile already produces more `cta_click` events than desktop (54 vs 42)** despite scrolling less, engaging half as long, and bouncing more. And the #1 post is 55% mobile while the tool it feeds is 14% mobile. See "Follow-Up Pass" below.

**What is NOT a problem:** CTA density. 85 CTAs across 74 posts is roughly one per post, which is right. The 13 posts with zero app CTA include several that should stay that way. Adding more CTAs would make the pages worse without moving the number.

**The single highest-leverage change** is not analytics and not new CTAs. It is pointing the four welcome-letter/parent-email posts at `/back-to-school-toolkit` instead of the generic demo, with one mid-article placement, and tracking it. That is a topic-matched handoff to an asset that already exists and already works.

---

## Current Funnel Map

```
GOOGLE SEARCH  (~2,000 clicks / 28 days)
   |
   | 97% lands on a blog post, 3% on the homepage
   v
BLOG POST  (app/blog/[slug]/page.tsx)
   |
   |-- [A] In-body markdown CTA  x85 across 74 posts
   |       plain <a>, median depth 93%
   |       -> app.getshorthandapp.com?demo=true
   |       NO tracking. NO attribution.
   |
   |-- [B] Footer TrackedLink  x87 (every post)
   |       "Try ShortHand Free ->" at 100% depth
   |       -> ?demo=true + lp + utm    TRACKED
   |
   |-- [C] Nav "Get ShortHand"  x87 (every post)
   |       -> ?demo=true, plain <Link>, NOT tracked
   |       HIDDEN ON MOBILE (no hamburger on blog pages)
   |
   |-- [D] BlogWorkflowBridge  x2 posts, mid-article (44%)
   |       TrackedLink -> ?demo=true    TRACKED
   |
   |-- [E] LibraryCtaBlock  x9 posts
   |       -> /report-card-comment-library ($4.99)   TRACKED
   |
   |-- [F] ResourceOffer  x6 posts, ungated PDF
   |       -> local .pdf, fires resource_download    TRACKED
   |
   |-- [G] PdfGate  x2 posts, email-gated PDF        TRACKED
   |
   |-- [H] Internal links to /tools et al  x28 across 19 posts
   |       plain markdown <a>, NOT tracked
   |
   v
app.getshorthandapp.com?demo=true&lp=/blog/...
   |
   | App.tsx:1722 reads lp/utm -> sessionStorage  (attribution only)
   | App.tsx:1740 isDemo -> signInAnonymously() -> demo_started
   | lp NEVER changes what the visitor sees
   v
WELCOME MODAL, demo variant  (WelcomeModal.tsx:293-360)
   "Welcome! Here's your demo class."
   "8 fake students are loaded with notes."
   -> [Add a note on a student]  [Browse the student roster]
   |
   v
signup -> recordFirstTouchAttribution() freezes lp/utm against user_id
```

**The critical structural fact:** `lp` is write-only telemetry. It is read once at `App.tsx:1722`, stashed in sessionStorage, and frozen at signup. It never branches the landing experience. Every one of the 85 blog CTAs, regardless of topic, resolves to the identical demo class screen.

---

## What We Can Measure Today

| Question | Answered by | Confidence |
|---|---|---|
| Which articles get search traffic | GSC `gsc_page_performance` | High |
| Which queries drive each article | GSC `gsc_query_for_page` | High. Note the country-filter artifact, use unfiltered |
| How many people reach ~90% scroll depth | GA4 `scroll` (428 events / 363 users) | Medium. GA4 enhanced measurement, fires at 90% |
| Clicks on the footer CTA per post | GA4 `cta_click` with `cta_source='blog'` | High mechanism, tiny volume (4 events) |
| Clicks on `LibraryCtaBlock` | `cta_click` with `cta_source=<slug>` | High. 6 events across 4 slugs |
| PDF/resource downloads by placement | GA4 `resource_download` with `resource_source` | High mechanism. 4 events |
| Email leads by placement | Supabase `email_leads.source` | High |
| Real signups, total | `auth.users` + `welcome_emails` (Founder Dashboard) | High. This is the source of truth |
| In-app behavior after arrival | Supabase `analytics_events` | High for behavior, NOT for signups |
| First-touch landing page, for tracked paths only | `first_touch_attribution` | Mechanism works, coverage is ~0 for blog |

## What We Cannot Measure Today

| Question | Why not |
|---|---|
| **Did anyone click an in-body blog CTA?** | All 85 are plain `<a>` from `dangerouslySetInnerHTML`. No handler exists. This is the big one |
| **Which article sent a given signup?** | `lp` is only appended by the four click-tracked paths. Blog body CTAs cannot carry it by construction. 7 of 7 attributed signups say `/` |
| **Which CTA within a post was clicked** | No per-placement id on body CTAs. The footer `TrackedLink` uses one shared `ctaSource='blog'` for all 87 posts, so even the tracked path cannot say which post |
| **Did a blog visitor reach the demo at all** | GA4 shows genuinely low session volume on the app subdomain relative to site `cta_click` (422 sessions / 90 days, confirmed real, not a cross-domain measurement defect — see corrected section A). The low count reflects the funnel drop-off itself, not lost tracking |
| Did a blog visitor start a trial | `trial_started` is 0 in GA4 for 28 days (6 in Supabase). Cannot be joined to a source page |
| What a blog visitor did in the demo | `analytics_events` has it, but no source-page dimension to group by |
| Clicks from posts into `/tools`, `/back-to-school-toolkit` | 28 internal links, all untracked plain markdown |
| Whether the nav CTA or the footer CTA does the work | Nav CTA on blog posts is a plain `<Link>`, untracked |

**A correction worth stating plainly:** even the "tracked" blog path is nearly useless for attribution, because `ctaSource="blog"` is hardcoded once in `app/blog/[slug]/page.tsx` for all 87 posts. GA4's 4 blog clicks cannot be attributed to a post. `LibraryCtaBlock` does this correctly, passing `sourceSlug` as `cta_source`. That is the pattern that already works in this repo.

---

## CTA Patterns Found

### Pattern A. In-body markdown CTA (85 links, 74 posts) — the dominant pattern

**Anchor text, actual counts:**

| Wording | Count |
|---|---|
| Try ShortHand free | 16 |
| ShortHand (bare product name, mid-sentence) | 14 |
| getshorthandapp.com | 9 |
| Try it free at getshorthandapp.com | 9 |
| Try ShortHand free → | 7 |
| Try ShortHand free at getshorthandapp.com | 6 |
| Try it here / Try it free / Try ShortHand here / Start for free / Start documenting free / etc. | 24 combined |

1. **What does the visitor see?** Usually an inline text link near the last paragraph. Roughly 24 of 85 read as a bare domain or product name rather than an offer.
2. **What do they expect?** Three different things, depending on wording. "Try ShortHand free" implies a product trial. "getshorthandapp.com" implies the marketing site, not the app. "the guided demo" and "install page" imply specific destinations. **24 of the 85 name a destination the link does not go to**: the variants containing "getshorthandapp.com" all navigate to `app.getshorthandapp.com?demo=true`, a different host, and "install page"/"install the app" (3) go to the demo, not `/install`.
3. **Where do they actually land?** All 85, without exception, on `app.getshorthandapp.com?demo=true`.
4. **Attribution preserved?** No. No `withAttribution`, so no `lp`, no UTM forwarding.
5. **Click recorded?** No.
6. **Does the next screen continue the promise?** Only for behavior-documentation posts. For the welcome-letter and parent-email posts that are 57% of traffic, no. See Top Traffic Pages.
7. **Better destination?** Yes, and it varies by topic. Covered in Product Handoff Opportunities.

**Placement, measured:**

| Metric | Value |
|---|---|
| Posts with at least one app CTA | 74 of 87 |
| Median depth of first CTA | **93%** |
| 25th percentile | 88% |
| Earliest in any post | 29% (`best-classdojo-alternatives-2026`) |
| Posts where every CTA is in the final 20% | **64 of 74** |
| GA4 users reaching 90% scroll | 363 of 2,794 (**13%**) |

### Pattern B. Footer TrackedLink (all 87 posts)

"Stop trying to remember everything." plus **Try ShortHand Free →**. Fully tracked, carries `lp` and UTM, fires `cta_click` with `event_callback` and a 300ms fallback. Mechanically the best-built CTA on the blog. Two flaws: it sits at 100% depth, below the FAQ accordion and the "Keep Reading" grid, so it is past two separate off-ramps; and `ctaSource="blog"` is shared by all 87 posts, so its data cannot name a post.

### Pattern C. Nav "Get ShortHand" (all 87 posts)

Plain `<Link>` to `?demo=true`. Untracked, no attribution. **Invisible on mobile** since blog pages render no hamburger and `.nav-link` is `display:none !important` under 768px. On report-card posts the nav correctly swaps in a "Comment library: $4.99" button, showing per-slug nav variation is already an established pattern here.

### Pattern D. BlogWorkflowBridge (2 posts)

The strongest pattern in the repo and the only one placed mid-article. On `sample-emails-to-parents-about-student-behavior` it sits at **44% depth**, above the scroll cliff. It names a three-step workflow and uses topic-specific CTA copy ("Draft from your notes", "Start a behavior record") rather than "Try ShortHand free". Fully tracked with a per-post `sourceSlug` and `trackingLabel`. GA4 is consistent with it working: `how-to-write-a-student-behavior-report` recorded 2 `cta_click` events against 77 pageviews, while the entire rest of the blog's footer CTA recorded 4 against ~2,500 pageviews. At these counts that is a directional signal, not proof, but it is the only mid-article data point we have. **This is the template to copy.**

### Pattern E. LibraryCtaBlock (9 posts)

Tracked, attributed, per-slug `cta_source`, with a per-post custom intro line so the offer speaks to the page. Points at the $4.99 library. Reworded 2026-08-20 to lead with speed rather than comment count. Correct construction, paid destination.

### Pattern F. ResourceOffer (6 posts)

Ungated PDF, fires `resource_download` with a stable `resource_source`, then offers an optional email. This is the lowest-friction conversion on the site and the only pattern that delivers value before asking for anything. 4 events in 28 days, but 3 of its 6 placements are on near-zero-traffic conference posts placed ahead of season.

### Pattern G. PdfGate (2 posts) and Pattern H. Untracked internal links (28 across 19 posts)

PdfGate is email-gated, tracked. The 28 internal links to `/tools/parent-communication-log`, `/back-to-school-toolkit`, `/report-card-comment-generator` and `/report-card-comment-library` are plain markdown, untracked. The leak is visible: `/blog/welcome-letter-to-parents-from-teacher` had 506 pageviews and `/back-to-school-toolkit`, which it links to twice, had 59.

---

## Top Traffic Pages

Ranked by GSC clicks, 2026-08-15 to 2026-09-12.

### 1. `/blog/short-welcome-message-to-parents-from-teacher` — 346 clicks, 427 pageviews

- **Visitor intent:** Copy a short welcome message for a class app or text, today, and send it.
- **Current CTA:** One in-body link at **line 108 of 112 (96% depth)**: "Try ShortHand free ... and make 'great communicator' your reputation this year." Plus the footer TrackedLink. One internal link to `/back-to-school-toolkit`.
- **Current destination:** `?demo=true`, the demo class with 8 fake students.
- **Mismatch:** Severe, on two counts. The visitor wants a message to send in the next five minutes and is offered a year-long documentation habit. And at 96% depth, roughly 87% of readers never see the offer. The post already links to `/back-to-school-toolkit`, the Welcome Letter Generator, which is the thing this reader actually wants, but that link is untracked and buried.
- **Recommended experiment:** Promote the `/back-to-school-toolkit` link to a mid-article `ResourceOffer`-style block at roughly 40% depth, with copy naming the generator, and track it per-slug. Leave the app CTA where it is. Measures whether a topic-matched free tool beats a generic demo on the site's #1 page.

### 2. `/blog/welcome-letter-to-parents-from-teacher` — 315 clicks, **506 pageviews (highest on the site)**

- **Visitor intent:** See real welcome letter examples, then produce their own.
- **Current CTA:** **None to the app.** This post is one of the 13 with zero `app.getshorthandapp.com` links. It carries two internal links to `/back-to-school-toolkit` (one of them an inline screenshot of the generator) and five links to other posts. The only app CTAs are the untracked nav button and the footer TrackedLink.
- **Current destination:** `/back-to-school-toolkit`, untracked, or the footer demo link.
- **Mismatch:** Mild on intent, severe on instrumentation. The intent handoff here is **already correct**, the best on the site: highest-traffic page, pointing at a topic-matched free tool with a screenshot. And we cannot measure a single click of it. The 506 to 59 pageview ratio is the only signal available, and it is confounded by the generator's other entry points.
- **Recommended experiment:** Do nothing to the content. **Instrument it first.** Add click tracking to the two toolkit links with a per-placement id. This page is the cleanest natural test of the topic-matched handoff hypothesis and it is currently running blind. Everything else on this list should wait for what this page tells us.

### 3. `/blog/sample-emails-to-parents-about-student-behavior` — 255 clicks, 364 pageviews

- **Visitor intent:** Copy a behavior email template and send it.
- **Current CTA:** The best-constructed stack on the blog. `BlogWorkflowBridge` at **44% depth** ("Start with the record, then write the email", CTA "Draft from your notes", tracked). An in-body link at 84%. `PdfGate` at 96% offering 10 ready-to-send emails for an email address. Plus footer and nav.
- **Current destination:** Bridge and body to `?demo=true`. Gate to the PDF.
- **Mismatch:** Modest. The bridge does the contextual handoff work honestly and the demo does contain parent-message drafting, so the promise roughly holds. The remaining friction is that the PDF, the thing matching the visitor's literal intent, is **email-gated** while the equivalent asset on `positive-behavior-email-to-parents-template` is ungated via `ResourceOffer`. Same PDF file, two different friction levels.
- **Recommended experiment:** Switch this page's `PDF_GATES` entry to a `RESOURCE_OFFERS` entry, matching the ungated pattern already used on the sibling post. Compare `resource_download` and `email_leads` volume against the gated baseline. Tests whether gating this asset earns more addresses than it costs in downloads.

### 4. `/blog/teacher-introduction-letter-to-parents` — 214 clicks, 360 pageviews

- **Visitor intent:** Write an introduction letter, often mid-year or as a new teacher.
- **Current CTA:** One in-body link at **line 186 of 192 (96% depth)**. One internal link to `/back-to-school-toolkit`. Plus footer and nav.
- **Current destination:** `?demo=true`.
- **Mismatch:** Same shape as #1. Letter-writing intent, documentation-app destination, at a depth most readers never reach. This post is also the target of two social shortlinks (`/letter`, `/letters`) carrying `utm_campaign=teacher_intro_letter`, so it takes social traffic too, and those visitors hit the same wall.
- **Recommended experiment:** Same treatment as #1. Mid-article generator offer, tracked. Run it as the paired variant so #1 and #4 can be compared against each other on the same hypothesis.

### 5. `/blog/positive-behavior-email-to-parents-template` — 168 clicks, 220 pageviews, **4.05% CTR (best of the blog)**

- **Visitor intent:** Send good news home.
- **Current CTA:** `ResourceOffer` at **87% depth** (ungated 10-template PDF) and an in-body app link at **100%**.
- **Current destination:** The PDF, then `?demo=true`.
- **Mismatch:** The offer is right and the placement is wrong. This is the best ungated asset on the site sitting below the scroll cliff on the site's highest-CTR page.
- **Recommended experiment:** Move the `RESOURCEOFFERMARKER` from 87% to roughly 45% depth. Single-variable, content-neutral, and `resource_download` already tracks it per-source, so the before/after comparison needs no new instrumentation. **This is the cheapest real test on the list.**

### 6. `/blog/best-classdojo-alternatives-2026` — 147 clicks, 199 pageviews

- **Visitor intent:** High intent. Actively comparing products, ready to switch.
- **Current CTA:** The only post with an early CTA: in-body link at **31% depth**, immediately followed by `ClassDojoProductProof` at 32%, plus another at 98%. Also links to `/tools/parent-communication-log`.
- **Current destination:** `?demo=true`.
- **Mismatch:** Arguably one. `docs/funnel-decisions.md` routes high-intent comparison traffic on `/classdojo-alternative` (the page) straight to signup, no demo detour, and records two traced signups through that path. This post is the same intent on the blog side and gets the demo detour instead. The split is applied by page type, not by intent.
- **Recommended experiment:** Route this post's CTAs to the bare app URL (signup-first), matching the sibling landing page. Low risk, consistent with an already-validated decision. Worth confirming with Greg first since it deliberately departs from the blog-wide demo-first rule.

### 7-8. Report-card comment posts — `report-card-comments-for-behavior` 84 clicks, `preschool-report-card-comments` 64 clicks

- **Visitor intent:** Find a comment to paste into a report card, now.
- **Current CTA:** `LibraryCtaBlock` (tracked, per-slug, $4.99), links to the free generator, nav swapped to a library button.
- **Mismatch:** Minimal. This cluster is the one place where topic, CTA, destination and tracking already line up, and it is the only non-homepage source producing measurable clicks in GA4. **Leave it alone.** It is the existence proof that the pattern works, and its current numbers are the baseline the other experiments will be judged against.

---

## Attribution Design

Design goal: the simplest thing that answers all six questions. Resist building a taxonomy.

**The whole design is one rule: every app-bound and tool-bound link in a blog post goes through the tracked-click path that already exists, and carries the post slug.**

Nothing new needs inventing. `TrackedLink` + `withAttribution` + `fireCtaClick` already do this correctly, and `LibraryCtaBlock` already demonstrates the per-slug variant. The gap is coverage, not capability.

### The six questions

| Question | Answered by | Change needed |
|---|---|---|
| Which article brought the visitor? | `lp=/blog/<slug>` on the outbound URL, landing in `first_touch_attribution.landing_page` | Route body CTAs through `withAttribution`. **Mechanism already built and verified in production 2026-09-04** |
| Which CTA did they click? | `cta_click` with `cta_source=<slug>` and `cta_destination=<placement id>` | Two changes: make body CTAs fire the event at all, and stop hardcoding `ctaSource="blog"` in `app/blog/[slug]/page.tsx` |
| What did they do after arriving? | Supabase `analytics_events` joined on `user_id` | Nothing new. Becomes answerable once `lp` reaches the app for blog users |
| Did they demo? | `demo_started` in `analytics_events` (64 in 28 days) | Nothing on the website side. Note GA4 shows 0 for this event, see the caveat below |
| Did they sign up? | `auth.users` + `welcome_emails`, joined to `first_touch_attribution` | Nothing new |
| Did they start a trial? | `trial_started` in `analytics_events` (6 in 28 days) | Nothing new |

### Parameters

Keep exactly what exists. `lp`, `utm_source`, `utm_medium`, `utm_campaign`.

- **Do not add a `source` or `campaign` param for organic blog links.** `lp` already carries the page identity and is the field `first_touch_attribution` reads. A second overlapping param would split the history of a table that has been live for eight days.
- **Do not put UTMs on organic internal links.** A UTM on an internal link starts a new GA4 session and destroys the referring-page data. `withAttribution` already gets this right by forwarding UTMs only when the visitor arrived carrying them.
- The `redirects()` shortlinks in `next.config.ts` (`/ig`, `/tt`, `/letters`, and the rest) already set proper UTMs for social. That layer is correct and needs nothing.

### Events

One event, two parameters. `cta_click` with `cta_source` as the post slug and `cta_destination` as a stable placement id (`body-mid`, `body-end`, `footer`, `nav`, `toolkit-inline`). That is enough to answer "which CTA" and "which article" simultaneously.

Resist adding `blog_cta_click`, `tool_link_click`, or per-pattern events. GA4's 28-day totals are 96 `cta_click` and 4 `resource_download`. At that volume, splitting the funnel into more event names produces categories with one or two rows each and no statistical power. One event with good parameters is strictly more useful.

### One honest caveat

Per `WEBSITE_AUDIT.md` finding 1, GA4 is currently losing `signup_completed`, `demo_started` and `trial_started` entirely (0 rows against 64/20/6 in Supabase), because `gtag` sits after an `await` and `initAnalytics()` is deferred until auth resolves. **Blog attribution instrumented today would land in a GA4 funnel whose bottom three steps are missing.** The website-side `cta_click` would still record (the website's gtag loads normally), and `lp` would still reach `first_touch_attribution` in Supabase, so "which article brought the visitor" gets answered either way. But "did they demo, sign up, or trial, by source page" only becomes answerable in GA4 after that fix. Supabase can answer it sooner via `first_touch_attribution` joined to `analytics_events`. **Do the audit's finding 1 first, or accept that the first weeks of blog attribution are Supabase-only.**

> **Correction, 2026-09-16 (see section A below):** the claim in this note that a missing `linker` config severs the client id across the domain hop was checked against 90 days of GA4 data and closed as a false positive. `getshorthandapp.com` and `app.getshorthandapp.com` share an eTLD+1 and one measurement ID, so GA4's default `cookie_domain: 'auto'` already carries the client id across the hop with no linker needed, and no self-referral sessions exist in the data. Finding 1's gtag-ordering fix stands on its own merits and needs no linker work alongside it. **Supabase via `lp` remains the path to trust for "which article produced this signup" regardless**, since it was never dependent on GA4 cross-domain mechanics in the first place.

---

## Product Handoff Opportunities

Direct answer to the question posed: **yes, the blog's strongest search topics point at specific product entries, and for the two biggest we already own the right destination and are not using it.**

| Blog cluster | GSC clicks (28d) | Current destination | Better destination | Exists today? |
|---|---|---|---|---|
| **Welcome / intro letters** (#1, #2, #4) | **875** | `?demo=true` demo class, or nothing | **`/back-to-school-toolkit`** (Welcome Letter Generator) | **Yes, built and working** |
| **Parent behavior emails** (#3, #5) | 423 | `?demo=true`, plus PDFs | The ungated 10-template PDF, then the demo | **Yes, both assets exist** |
| **Report card comments** (#7, #8, plus 7 more) | ~224 | `/report-card-comment-library` | Already correct | Yes |
| **Behavior documentation** (#11 and others) | ~70 | `?demo=true` demo class | Already correct. This is the one cluster where the generic demo IS the matched destination | Yes |
| **ClassDojo alternatives** (#6) | 147 | `?demo=true` | Bare app URL, signup-first, matching `/classdojo-alternative` | Yes |
| Parent communication log / IEP | ~50 | mixed | `/tools/parent-communication-log` | Yes |

**The finding this table produces:** the welcome-letter cluster is **44% of the blog's search clicks** and has a purpose-built free tool sitting one click away that it barely uses. `/back-to-school-toolkit` got 59 pageviews in 28 days against 875 clicks arriving on the posts that should feed it.

**Two caveats before anyone acts on that.**

1. `WEBSITE_AUDIT.md` finding 4 is a blocker, not a footnote. `lib/ratelimit.ts` limits `welcome-letter-generator` to **5 requests per hour keyed on raw IP**, while the paid paths in the same file deliberately avoid IP-primary keying because "teachers at one school share a single outbound NAT address." Sending 875 clicks per month of school-network traffic at an IP-keyed 5/hour limit would manufacture the exact failure the paid-path comments were written to prevent. **Fix the rate limit before increasing traffic to this tool, not after.**
2. A free generator is a lateral move, not a product signup. It captures an email via `OptionalEmailCapture` and offers a tracked app CTA on the result screen. That is a real but longer path. The experiment is worth running precisely because we do not know whether it beats the demo, and right now we cannot know, because neither side is measured.

**What a matched handoff would look like, for illustration only:** a reader finishing the welcome-letter post lands on `/back-to-school-toolkit`, gets a letter in 30 seconds, and only then sees "Want to stay organized all year?" with the tracked app CTA that is **already built** at `WelcomeLetterClient.tsx:295-305`. The value is delivered before the ask. That CTA has one known defect worth fixing if this path gets traffic: it calls `fireCtaClick` without `withAttribution` and without `event_callback`, using `next/link` for an external URL, so navigation races the beacon. It is the only tracked CTA on the site missing attribution.

---

## What NOT To Change Yet

1. **Do not add more CTAs.** 85 across 74 posts is about one per post and that is correct. The problem is placement and destination. More CTAs on a page that 87% of readers do not finish adds clutter and moves nothing.
2. **Do not touch the report-card cluster.** Topic, CTA, destination and tracking already agree, and it is the only measurable non-homepage source. It is the control group.
3. **Do not rewrite headings or titles on high-traffic posts.** Per standing guidance, headings on high-traffic posts change only for SEO reasons with data behind them. Every experiment below is a body or placement change.
4. **Do not add the 13 zero-CTA posts to the CTA list as a batch.** `welcome-letter-to-parents-from-teacher` has no app CTA and is the site's highest-traffic page, which makes it the natural control for the topic-matched hypothesis. Several others are short template pages where a pitch would read as intrusive. Decide individually, after the first results. **Now done, see second follow-up pass section C: 4 of the 13 are deliberate and 8 more draw under 10 clicks each, so the verdict is "leave it" for 12 of 13. Only `sample-emails-to-parents-about-missing-homework` earns a change.**
5. **Do not drive traffic at the Welcome Letter Generator until the rate limit is fixed.** See above.
6. **Do not build a new blog-specific analytics taxonomy.** `cta_click` plus `cta_source` plus `cta_destination` covers every question at this volume.
7. **Do not change the demo-first / signup-first split as a policy.** It was deliberately confirmed 2026-07-15 with two traced signups. The ClassDojo post is a single-page exception worth testing, not a reason to revisit the rule.
8. **Do not fix the blog mobile nav and a CTA experiment in the same change.** Both are worth doing. Shipping them together makes the result unreadable.

---

## Follow-Up Pass: Scroll Verification and the Mobile Split

Added 2026-09-12, same session, after the main report. Two questions were checked because the first was load-bearing for the whole argument and the second was the sharpest unexplained number. **The first one materially corrects a claim made above.**

### Correction: the "13% never see a CTA" figure was right about the gap and wrong about the cause

The Executive Conclusion argues 13% of readers reach 90% depth, and concludes that most readers never see an app CTA. The 13% is real. **The conclusion drawn from it was too strong, and the engagement data says something different and more useful.**

Per-page, 2026-08-15 to 2026-09-12:

| Page | Pageviews | `scroll` (90%) | Scroll rate | Engagement per PV | Bounce |
|---|---|---|---|---|---|
| `welcome-letter-to-parents-from-teacher` | 507 | 39 | 7.7% | 40.0s | 46.9% |
| `short-welcome-message-to-parents-from-teacher` | 427 | 23 | **5.4%** | 40.2s | 52.3% |
| `sample-emails-to-parents-about-student-behavior` | 364 | 43 | 11.8% | 45.7s | 46.0% |
| `teacher-introduction-letter-to-parents` | 360 | 30 | 8.3% | 49.8s | 50.8% |
| `positive-behavior-email-to-parents-template` | 220 | 39 | **17.7%** | 42.1s | 51.0% |
| `best-classdojo-alternatives-2026` | 199 | 18 | 9.0% | 43.1s | 38.3% |
| `/back-to-school-toolkit` | 59 | 16 | **27.1%** | 43.0s | **14.3%** |

**What this changes.** Readers are spending **40 to 50 seconds engaged per pageview** with bounce rates of 38-52%. That is not a page people bounce off. It is genuine reading. But only 5-18% reach 90% depth. Those two facts together mean readers are **reading a portion of the article carefully and then leaving**, not skimming and not finishing. They are getting the template they came for from the middle of the page and going.

So the original framing, "the CTA is too low for readers to see," is directionally right but the mechanism is not inattention. It is that **these posts are transactional**: the reader extracts one letter or email template and leaves satisfied. That is a stronger argument for mid-article placement, not a weaker one, but it reframes what the CTA has to do. It cannot rely on a reader who has finished and is wondering what to do next, because that reader mostly does not exist here. It has to interrupt at the point of value extraction.

**It also raises a caution the report did not have.** If readers leave because they got what they came for, then a mid-article CTA competes with the thing they came for. Experiment 1's success metric should include the engagement and bounce numbers above, not just click rate. A CTA that lifts clicks while cutting engagement time is taking value out of the page.

**One genuine confound, stated plainly.** GA4's `scroll` fires at 90% depth only, so it cannot distinguish "left at 40%" from "left at 85%." The 40-50s engagement figures make shallow bailing unlikely but do not rule out mid-page exit. **Recommended before experiment 1: add 25/50/75% scroll triggers for two weeks on the four letter-cluster posts.** That converts the depth question from inference to measurement and tells you the exact insertion point rather than the guessed 40-45%. This is a small, temporary GA4 config change, not a code change.

**The toolkit row is the most encouraging number in this investigation.** `/back-to-school-toolkit` has a **14.3% bounce rate and 27.1% scroll rate**, three to five times better than any blog post. People who reach the generator engage with it heavily. The problem has never been the tool. It is that only 59 people per month find it.

### Answer to #1: the mobile split is real, and it is worse than the pageview ratio suggested

| Metric | Desktop | Mobile |
|---|---|---|
| Pageviews (sitewide) | 2,390 | 1,445 |
| `scroll` events | 298 | 125 |
| Scroll rate | 12.5% | **8.7%** |
| Engagement per PV, `welcome-letter` post | **45.1s** | **25.0s** |
| `cta_click` | 42 (29 users) | **54 (35 users)** |

Three findings, in order of how much they should change plans:

**1. Mobile readers engage at roughly half the depth.** 25.0s versus 45.1s per pageview on the same post, and a scroll rate of 8.7% versus 12.5%. Mobile bounce on `short-welcome-message` is **62.7%** against 40.9% desktop on the identical page. Mobile is not a smaller version of the desktop audience, it is a materially shallower one, and it is the audience the #1 post is majority-composed of.

**2. Mobile already out-clicks desktop on CTAs, despite all of it.** 54 mobile `cta_click` events versus 42 desktop. Mobile readers scroll less, engage less, bounce more, **and click more**. That is the single most actionable number in this follow-up. It argues the mobile audience has higher intent per unit of attention, and that the mobile CTA problem is one of supply and position, not of willingness. Note this is mostly homepage traffic, where a mobile menu exists; blog posts have no hamburger at all.

**3. The generator is desktop-only in practice.** `/back-to-school-toolkit` is roughly **51 desktop to 8 mobile**, about 14% mobile, on a site that is 38% mobile overall and fed by a post that is **54.9% mobile**. The funnel inverts at exactly the handoff point: the feeding post is mobile-majority, the tool it feeds is desktop-dominated.

**Why, and what I could not determine read-only.** Two candidate explanations, and I cannot separate them from analytics alone:

- **Discoverability.** The two links into the toolkit sit inside body copy on a post with no mobile nav. A mobile reader at 25s of engagement and 8.7% scroll depth plausibly never reaches them.
- **The generator itself on a phone.** `WelcomeLetterClient.tsx` is a form plus an AI call plus a result pane with copy/refine/reset controls. Its 14.3% bounce says people who arrive do fine, but that population is 86% desktop, so it is not evidence about the mobile experience.

The discoverability explanation is better supported: the low mobile share is visible at the *entry* to the tool, and the people who do arrive bounce at 14.3%. If the generator were broken on phones, arrivals would bounce. **But this is inference, and the report's standing guidance is that cross-platform behavior gets verified on a real device, not assumed.** One pass through the generator on an actual iPhone in Safari would settle it, and that check should happen before experiment 2 drives 875 clicks per month at it.

### What these two answers change about the plan

1. **Experiment 1 gets a prerequisite and a second success metric.** Add 25/50/75% scroll triggers for two weeks first, so the insertion depth is measured rather than guessed. Judge the result on engagement time and bounce alongside click rate.
2. **Experiment 2 gets a blocker added, alongside the rate limit.** Verify the Welcome Letter Generator on a real phone before routing mobile-majority traffic to it. Two blockers now, both cheap, both genuinely load-bearing.
3. **The blog mobile nav moves up in priority.** Item 8 of "What NOT To Change Yet" still holds, do not ship it inside a CTA experiment. But mobile out-clicking desktop while having no blog navigation at all makes it a stronger candidate than the main report implied.
4. **The transactional-reader finding is worth carrying into content decisions**, not just CTA placement. These posts are consulted, not read. That is a fact about the audience that outlives any single experiment.

---

## Second Follow-Up Pass: The Remaining Five Questions

Added 2026-09-12, same session. Covers the five items left from the follow-up shortlist. **One of these (cross-domain GA4) changes the scope of `WEBSITE_AUDIT.md` finding 1 and should be read before that work starts.**

### A. Cross-domain GA4 — CLOSED 2026-09-16, false positive. No linker needed, no self-referral exists.

**Superseded.** This section originally concluded the missing `linker`/`cookie_domain` config was a real defect severing sessions at the domain hop, based on 6 app-host sessions against 96 site `cta_click` events in a partial-month window. A dedicated follow-up investigation (2026-09-16) re-checked this against 90 days of GA4 data and closed it as a false positive. Full writeup: `docs/ga4-cross-domain-linker-audit-2026-09-16.md`.

**What was wrong in the original read:** `getshorthandapp.com` and `app.getshorthandapp.com` are apex and subdomain of the same eTLD+1, both reporting into the same GA4 property under the identical measurement ID `G-Y954JF2V55`. GA4's default `cookie_domain: 'auto'` writes the `_ga` cookie at the registrable-domain scope for exactly this case, so the client id is already shared across the hop with zero explicit config. The `linker`/`_gl` mechanism this section called for is for genuinely separate root domains, not an apex/subdomain pair sharing one property.

**What the fuller data shows:** across 90 days, `app.getshorthandapp.com` has zero `getshorthandapp.com / referral` sessions and `getshorthandapp.com` has zero `app.getshorthandapp.com / referral` sessions. The app host's real sources are `google / organic` (160), `(direct)` (115), and legitimate referrals (`accounts.google.com` OAuth, `t.co`). No self-referral pollution exists. The original "6 sessions" figure was real but came from a much narrower/partial date window and was the wrong signal, low app-host volume reflects real product/funnel behavior (see the drop-off investigation below), not a broken cookie.

**Corrected interpretation:** absence of explicit `linker`/`cookie_domain` config is not itself a bug for an apex + subdomain pair on the same eTLD+1 sharing one measurement ID. Do not re-add B1 (linker + referral exclusions) without new evidence of actual self-referral in GA4 data.

**What is still real and unaffected by this correction:** `WEBSITE_AUDIT.md` finding 1 (gtag-ordering bug causing `demo_started`/`signup_completed`/`trial_started` to be lost in GA4) is a separate, confirmed, still-open defect. Fixing it is unrelated to cross-domain linking and does not require any linker config.

### B. What readers do instead of clicking

Partly answered, with an honest limit. Bounce rates on the top posts run **38-52%**, so roughly half of readers view exactly one page and leave. That is the dominant behavior, and combined with the transactional finding in the first follow-up (40-50s engaged, 5-18% reaching 90% depth), the picture is consistent: **most readers take their template from mid-article and go.**

For the other half, `sessionDefaultChannelGroup` shows 2,760 of 3,425 sessions are Organic Search and only 11 are Referral, so internal blog-to-blog navigation is happening within sessions rather than generating new ones. GA4's `scroll`-only instrumentation cannot tell me which internal link they took.

**The "Keep Reading" cannibalization hypothesis from the shortlist remains untested.** The related-posts grid and the FAQ accordion both sit between the article body and the footer `TrackedLink`, which is structurally a reason the footer CTA underperforms, but I have no click data on either and cannot separate them. Resolving it needs outbound-link tracking on the related-posts cards, which is the same instrumentation work item as the body CTAs. Worth adding a distinct `cta_destination` for those cards when that lands, so the question answers itself rather than needing its own experiment.

### C. The 13 zero-CTA posts: 4 are deliberate, 9 are drift

Audited individually rather than as a batch. The 13 split cleanly:

**Deliberate, leave alone (4).** Each already offers something better matched than an app CTA:

| Post | What it offers instead |
|---|---|
| `welcome-letter-to-parents-from-teacher` | 2 links to `/back-to-school-toolkit` (the correct handoff, per Top Traffic Pages) |
| `social-emotional-report-card-comments` | `LibraryCtaBlock` + 3 tool links |
| `free-behavior-log-template-for-teachers` | `ResourceOffer` (ungated log PDF) |
| `how-to-prepare-for-parent-teacher-conference` | `ResourceOffer` (conference notes PDF) |

**Drift, not a decision (9).** These have **no app CTA, no resource offer, no tool link, nothing**: `5-student-behavior-patterns-teachers-should-never-ignore`, `email-to-parents-about-fight-at-school`, `how-to-document-student-behavior-first-30-days`, `how-to-email-parents-about-academic-concerns`, `how-to-talk-to-parents-about-student-behavior`, `how-to-use-a-student-behavior-log`, `parent-email-after-difficult-phone-call`, `sample-emails-to-parents-about-missing-homework`, `what-to-say-when-you-call-a-parent-about-behavior`.

**The finding is that this mostly does not matter, with one exception.** Eight of the nine draw 0-10 GSC clicks each. Adding CTAs to them is busywork on pages nobody reads. **The exception is `sample-emails-to-parents-about-missing-homework`: 39 clicks, 3,829 impressions, 59 pageviews, and a 60.3% bounce rate**, the worst engagement of any page in the top 15 (1,301 engagement-seconds across 59 pageviews, about 22s each). It is a template post with nothing to hand the reader, on a site that has a ready-to-send parent-email PDF sitting in `/public`. That is a one-line `RESOURCE_OFFERS` entry, and it is the only member of this group worth touching.

**Revision to "What NOT To Change Yet" item 4:** the guidance to decide individually was right, and the individual decision for 12 of 13 is "leave it." Only the missing-homework post earns a change.

### D. Does `/tools` deserve to exist? Not in its current form

The audit called `/tools` and `/resources` orphaned. Having looked at what they contain, the sharper finding is that **the hub pages are not the problem, the unused inventory behind them is.**

`/resources` holds 5 printable PDFs. Cross-referencing against the `RESOURCE_OFFERS` map in `app/blog/[slug]/page.tsx`:

| Resource | Used in a blog `ResourceOffer`? |
|---|---|
| `classroom-behavior-documentation-log.pdf` | Yes, 3 placements |
| `parent-teacher-conference-notes.pdf` | Yes, 2 placements |
| `Ready_to_Send_Behavior_Emails_x7k2.pdf` | Yes, 3 placements (2 gated) |
| **`mtss-tier-2-intervention-tracking-sheet.pdf`** | **No. Used nowhere** |
| **`student-behavior-pattern-tracker.pdf`** | **No. Used nowhere** |

`/blog/how-to-document-tier-2-interventions-for-mtss` gets **20 clicks at 4.45% CTR** (above-average intent) and has no offer, while a purpose-built MTSS Tier 2 tracking sheet sits unused two directories away. Same shape as the welcome-letter finding, smaller scale.

**On the hub question itself:** a hub adds a click between reader and asset, and at 8 and 15 pageviews respectively that click is where the traffic dies. But the hubs cost nothing to keep and are the correct destination for the nav and footer links they are currently missing from. **The recommendation is not to delete them, it is to stop treating them as the distribution mechanism.** Assets reach readers through in-article `ResourceOffer` blocks on the matching post, which is the pattern that already works and is already tracked per-source. The hubs become a browsable index for people who want one, not the path.

### E. Anchor text that names the wrong destination (24 of 85)

Confirmed and counted. **24 of the 85 in-body CTAs use anchor text naming `getshorthandapp.com` while the href points to `app.getshorthandapp.com?demo=true`**, a different host. Spread across 24 separate posts, one each, in four wording variants ("getshorthandapp.com", "Try it free at getshorthandapp.com", "Try ShortHand free at getshorthandapp.com", "try it free at getshorthandapp.com").

A further 3 use install-flavored wording ("install the app", "install page", "install") while also going to the demo, not `/install`.

**Honest assessment of severity: low, and I would not prioritize it.** The destination is a legitimate ShortHand property and the visitor arrives somewhere sensible. There is no security or trust problem. It is a tidiness issue with a mild credibility cost for a reader who hovers and notices the mismatch.

**But it is nearly free to fix, and there is a reason to do it during the instrumentation work rather than separately:** all 85 links get touched when body CTAs are converted to tracked components. Normalizing the anchor text in the same pass costs almost nothing. Doing it as its own PR would be churn on 24 content files for no measurable gain. **Fold it in, do not schedule it.**

### F. Two malformed URLs are indexed (incidental find)

Not on the shortlist, surfaced while pulling page data. GSC shows two URLs that should not exist:

- `getshorthandapp.com/blog/get-shorthandapp.com/blog/how-to-email-parents-about-academic-concerns` (1 impression) — a relative link written with the domain in it, resolving under `/blog/`
- `getshorthandapp.com/blog/short-welcome-message-to-proven-teacher` (1 impression, position 1.0) — looks like a find-and-replace accident on "from" to "proven"

Neither appears in `posts/*.md` at this commit, so both are almost certainly stale index entries from previously-published typos rather than live bugs. Zero clicks, 1 impression each. **Noting them only so they are not rediscovered as a mystery later.** They will decay on their own; no action needed unless they persist past the next few crawls.

### Summary of what this pass changes

1. ~~Cross-domain linker joins finding 1's scope.~~ **Closed 2026-09-16 as a false positive** — see section A above. No linker or GA4 console change needed; apex/subdomain sharing one measurement ID already gets correct cross-domain behavior from GA4's `cookie_domain: 'auto'` default. Supabase remains the trustworthy path for attribution either way.
2. **One post from the zero-CTA group earns a change** (`sample-emails-to-parents-about-missing-homework`, 39 clicks, 60% bounce, nothing offered). The other 12 stay as they are.
3. **Two unused PDFs should be placed in-article**, MTSS Tier 2 most of all. Same pattern as experiment 3, no new mechanism.
4. **The hubs stay, but stop being the distribution path.** In-article offers do that job.
5. **Anchor text normalization folds into the instrumentation PR**, not its own.
6. The "Keep Reading" cannibalization question stays open and gets answered for free if the related-posts cards get their own `cta_destination` during instrumentation.

---

## First Three Experiments After Analytics Is Fixed

Ordered so each one produces a readable result. Prerequisite for all three: blog body CTAs fire `cta_click` with a per-slug `cta_source`, and pass through `withAttribution`. Strongly preferred prerequisite: `WEBSITE_AUDIT.md` finding 1, so the app-side half of the funnel is visible in GA4 rather than Supabase-only.

### Experiment 1 — Move the CTA above the scroll cliff

**Hypothesis:** CTA depth, not CTA copy or destination, is the binding constraint. 13% of readers reach 90% depth; the median first CTA is at 93%.

**Change:** On the three highest-traffic posts that have a late in-body CTA (`short-welcome-message-to-parents-from-teacher`, `teacher-introduction-letter-to-parents`, `positive-behavior-email-to-parents-template`), add one mid-article placement at roughly 40-45% depth. On the positive-email post this is purely moving the existing `RESOURCEOFFERMARKER` from 87% to about 45%, changing no words at all. Leave the end-of-post CTA in place.

**Prerequisite added by the follow-up pass:** turn on 25/50/75% scroll triggers in GA4 for two weeks on these posts first. GA4's default `scroll` fires only at 90%, which cannot tell "left at 40%" from "left at 85%", so the 40-45% insertion depth is currently a guess. Two weeks of data makes it a measurement. This is a GA4 config change, no code.

**Measure:** `cta_click` per slug, and `resource_download` for the positive-email post, versus the 28-day baseline. **Also required, per the follow-up pass:** engagement time per pageview and bounce rate against the baselines in that section. These posts are transactional, readers extract a template and leave, so a mid-article CTA competes with the thing they came for. A CTA that lifts clicks while cutting engagement time is taking value out of the page, and that is a fail, not a win.

**Why first:** single variable, no copy change, no destination change, and one of the three placements needs no new instrumentation to read. If placement is the constraint, this shows up fast and makes every later experiment cheaper to interpret. If it does not move, the "readers never see the CTA" thesis is wrong and experiments 2 and 3 should be reconsidered.

### Experiment 2 — Topic-matched handoff on the welcome-letter cluster

**Hypothesis:** A reader who came for a welcome letter converts better through a welcome letter generator than through a generic demo class.

**Change:** On `short-welcome-message-to-parents-from-teacher` and `teacher-introduction-letter-to-parents`, promote the existing `/back-to-school-toolkit` link into a tracked mid-article offer block, with copy naming the generator specifically. Instrument, but do not otherwise touch, `welcome-letter-to-parents-from-teacher`, which keeps its current form as the in-cluster comparison.

**Two blockers, both cheap, both load-bearing:**
1. **The `welcome-letter-generator` rate limit fix** (5/hour keyed on raw IP, see Product Handoff Opportunities).
2. **A real-device check of the generator on a phone,** added by the follow-up pass. `short-welcome-message` is **54.9% mobile** and `/back-to-school-toolkit` is **~14% mobile**. The funnel inverts at exactly this handoff. The evidence favours a discoverability cause over a broken mobile UI (arrivals bounce at only 14.3%), but that population is 86% desktop, so it is not evidence about phones. Per standing guidance, cross-platform behavior gets verified on a real device rather than inferred. One pass through the generator on an iPhone in Safari settles it before this experiment routes mobile-majority traffic at it.

**Measure:** tracked clicks into `/back-to-school-toolkit` per source post; `/back-to-school-toolkit` pageviews against its 59 baseline; `welcome_letter_toolkit` CTA clicks and `email_leads` rows with source `welcome-letter-generator-post-result`; and, through `first_touch_attribution`, signups carrying a `landing_page` in this cluster.

**Why second:** highest potential upside (875 clicks of matched intent) but the most moving parts, and its result is only readable once experiment 1 has told us whether placement was confounding everything.

### Experiment 3 — Ungate the behavior-email PDF

**Hypothesis:** The email gate on `sample-emails-to-parents-about-student-behavior` costs more downloads and app clicks than the addresses it collects are worth. The identical PDF is already ungated on the sibling post.

**Change:** Move this post's entry from `PDF_GATES` to `RESOURCE_OFFERS` in `app/blog/[slug]/page.tsx`, keeping the marker at its current position so placement stays constant. Same file, same page, gate removed and the optional-email step moved after the download.

**Measure:** `resource_download` volume, `email_leads` rows for that source before and after, and downstream `cta_click` on the post. The decision rule is explicit: if total addresses collected fall by more than the download increase justifies, revert.

**Why third:** it is a clean comparison against a real sibling baseline that already exists on the site, it isolates friction as a variable, and it answers the gate-versus-ungate question for every future resource placement. It is also the safest to revert.
