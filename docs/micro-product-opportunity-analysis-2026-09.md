# Micro-Product Opportunity Analysis — 2026-09-09

**Type:** Research only. No code changed.

**Question asked:** Given the search queries and landing pages already bringing traffic to getshorthandapp.com, what small standalone product ($2.99-$7.99, one-time) could be sold to those visitors at the moment they are trying to solve the problem that brought them here? Explicitly NOT a ShortHand conversion task.

**Data basis:** GSC `sc-domain:getshorthandapp.com` (2026-06-11 to 2026-09-08, vs prior 90 days 2026-03-13 to 2026-06-10) and GA4 (same windows, plus a 2026-08-01 to 2026-09-08 window used for current run-rate because August is when this site's traffic actually arrived). All numbers below are pulled, not estimated. Where a number is a projection it is labeled as such.

**Headline answer:** Nothing scores STRONG. The single best candidate is MEDIUM, and the honest recommendation is to not build a new micro-product yet. Reasoning in Section 8.

---

## 1. Phase 1 — Traffic inventory

### 1.1 The comparison window is nearly useless, and that matters

| Window | Clicks | Impressions | CTR | Avg position |
|---|---|---|---|---|
| Prior 90d (Mar 13 - Jun 10) | 178 | ~10,600 | ~1.7% | ~15-20 |
| Last 90d (Jun 11 - Sep 8) | 3,222 | ~131,000 | ~2.4% | ~6-8 |

That is roughly 18x growth quarter over quarter. It is **not** a growth rate that can be projected forward. Per `docs/seasonality-and-classroom-pulse-research-2026-09.md`, this domain launched 2026-04-08 and has never lived through a full school year; clicks and position improved monotonically every single month, which is the signature of a new domain climbing the indexing curve, not of a seasonal business. Treat "fastest-growing page" rankings from this comparison as noise: almost every page grew from near-zero.

**Consequence for this analysis:** any revenue model built on 90-day averages overstates the present. The site was doing ~10 clicks/day in June and ~110/day in early September. All economics in Section 4 therefore use the **Aug 1 - Sep 8 GA4 window** scaled to 30 days, which reflects traffic as it actually is now.

### 1.2 Top organic landing pages, last 90 days (GSC)

| Page | Clicks | Impr | CTR | Pos |
|---|---|---|---|---|
| /blog/welcome-letter-to-parents-from-teacher | 475 | 19,454 | 2.44% | 6.2 |
| /blog/short-welcome-message-to-parents-from-teacher | 421 | 21,765 | 1.93% | 5.8 |
| /blog/sample-emails-to-parents-about-student-behavior | 366 | 13,173 | 2.78% | 5.8 |
| /blog/teacher-introduction-letter-to-parents | 247 | 13,364 | 1.85% | 6.8 |
| /blog/best-classdojo-alternatives-2026 | 242 | 7,768 | 3.12% | 6.9 |
| /blog/report-card-comments-for-behavior | 212 | 10,379 | 2.04% | 7.9 |
| /blog/preschool-report-card-comments | 211 | 10,153 | 2.08% | 8.2 |
| /blog/positive-behavior-email-to-parents-template | 185 | 4,544 | 4.07% | 7.1 |
| / (homepage) | 100 | 1,159 | 8.63% | 5.6 |
| /blog/best-behavior-tracking-apps-for-teachers-2026 | 95 | 4,470 | 2.13% | 8.3 |

The top 8 blog pages carry 2,359 of 3,222 clicks (73%). This is a concentrated site, which is good for this exercise: there are really only three clusters worth discussing.

### 1.3 High impressions, low CTR (the classic "fix the title" list)

| Page | Impr | CTR | Note |
|---|---|---|---|
| /blog/special-education-behavior-tracking-software | 2,014 | **0.20%** | worst on site |
| /blog/email-to-parents-about-fight-at-school | 1,769 | 0.62% | urgent intent, near-zero capture |
| /blog/how-to-email-parents-about-academic-concerns | 1,553 | 0.97% | |
| /blog/sample-emails-to-parents-about-missing-homework | 4,571 | 0.98% | 4.5k impressions, 45 clicks |
| /blog/best-parent-communication-apps-for-documentation-2026 | 4,985 | 1.44% | position 15.5, ranking problem not title problem |
| /blog | 1,080 | 0.19% | index page, expected |

Per `feedback_ctr-serp-feature-verification`, low CTR at good position often means an AI Overview or featured snippet owns the answer, not that the title is weak. Not diagnosed here; flagged only.

### 1.4 Current on-site conversion, 90 days (GA4)

This is the most important table in the document.

| Event | Count | Users |
|---|---|---|
| page_view | 7,798 | 4,861 |
| signup_completed | **35** | 35 |
| file_download | **45** | 22 |
| cta_click | 174 | 127 |
| parent_email_sent | 24 | 9 |

**4,861 users produced 35 signups and 45 downloads.** Nothing on this site currently converts at a rate that would make a paid micro-product look good. That is context for every scenario below, and it is the reason the recommendation lands where it does.

---

## 2. Phase 2 — The visitor's job (not the article topic)

Derived from query text, not from titles.

| Cluster | Representative real queries | The actual job |
|---|---|---|
| **Welcome letters** (3 pages) | "welcome letter for parents from teacher" (990 impr), "welcome letter to parents from teacher free template", "welcome message for parents in whatsapp group from teachers", "first day of school message to parents", "1st/2nd/4th grade welcome letter to parents" | *"School starts in a few days. I need one letter to send home to families, in my voice, for my grade, and I need it done tonight."* One-time, seasonal, deadline-bound. |
| **Parent email about behavior** | "sample email to parents about student behavior", "how to write an email to a parent about their child's behavior", "email to parents about fight at school", plus **"make this more polite and professional"**, **"how does this sound"**, **"pendek sikit"** (Malay: "make it shorter") | *"Something happened today. I need to send a defensible, non-inflammatory email to this parent before I go home."* Recurring, urgent, emotionally loaded. |
| **Report card comments** | "3 year old preschool progress report comments free" (359 impr), "preschool report card comments", "report card comments for students with behavior problems", "conduct and attitude for report cards", "50 quick report card comments for preschool" | *"I have 25 comments to write and I do not want to compose 25 original sentences."* Bulk, deadline-bound, 2-3x per year. |
| **ClassDojo alternatives** | "class dojo alternatives", "apps like classdojo", "classdojo alternatives free" | *"I am choosing a tool."* Comparison shopping, not a task to complete. No micro-product fits. |

**One finding worth flagging on its own:** the queries `make this more polite and professional`, `how does this sound`, `help me draft the exact wording`, `real examples`, `pendek sikit`, `oui pour les 2`, `form please` are not Google searches. They are conversational prompts, appearing in GSC because these pages are being surfaced inside AI-assistant browsing sessions. The behavior-email page attracts people who are **already mid-draft, iterating on wording with an AI**. That is a real behavioral signal about what that visitor wants, and it cuts directly against selling them a static template pack (Section 5).

---

## 3. Phase 3 — Micro-product matching

| # | Cluster | Smallest product that finishes the job | Form |
|---|---|---|---|
| 1 | Welcome letters | Personalized welcome letter: enter name/grade/tone, get a formatted, printable, editable letter + matching short class-app message + a Meet-the-Teacher half-sheet | Generator + PDF |
| 2 | Parent email (behavior) | Incident-to-email converter: paste rough notes, get a factual, defensible parent email in 3 tone levels | Generator |
| 3 | Report card comments | Comment library, filter by grade/trait, personalize name + pronouns, export 25 at once | **Already built** |
| 4 | Preschool progress reports | Age-band (3yo/4yo/pre-K) progress report comment pack | Template pack |
| 5 | Parent-teacher conference | Conference prep sheet builder, one page per student | Printable builder |
| 6 | Behavior documentation | ABC incident log printable pack | PDF pack |

Products 4-6 are variants of 1-3 or serve traffic under 200 views/month. They are not separately viable and are not modeled.

---

## 4. Phase 4 — Page-level economics

Monthly pageviews are GA4 Aug 1 - Sep 8 scaled to 30 days (`x30/39`). These are real measured views, not projections.

| Page | Aug1-Sep8 views | Monthly run rate |
|---|---|---|
| welcome-letter-to-parents-from-teacher | 667 | 513 |
| short-welcome-message-to-parents-from-teacher | 503 | 387 |
| teacher-introduction-letter-to-parents | 419 | 322 |
| **Letter cluster total** | **1,589** | **1,222** |
| sample-emails-to-parents-about-student-behavior | 374 | 288 |
| positive-behavior-email-to-parents-template | 220 | 169 |
| **Parent-email cluster total** | **594** | **457** |
| preschool-report-card-comments | 197 | 152 |
| report-card-comments-for-behavior | 148 | 114 |
| **Report-card cluster total** | **345** | **265** |

### Revenue scenarios (scenario modeling only, not forecasts)

| Product | Monthly views | Price | 0.25% | 0.5% | 1% | 2% |
|---|---|---|---|---|---|---|
| Letter pack | 1,222 | $4.99 | $15 | $30 | $61 | $122 |
| Letter pack | 1,222 | $6.99 | $21 | $43 | $85 | $171 |
| Parent-email tool | 457 | $4.99 | $6 | $11 | $23 | $46 |
| Report card library (today) | 265 | $4.99 | $3 | $7 | $13 | $26 |

**Read the 2% column carefully.** 2% of blog readers buying a $5 digital product is an aggressive assumption for cold organic traffic with no brand relationship, and even at that rate the best cluster returns **$122-$171/month**. At the more defensible 0.5%, it is **$30-$43/month**.

For calibration against this site's own measured behavior: current site-wide free-signup rate is 35/4,861 = **0.72%**, and free file downloads are 45/4,861 = **0.93%**. A paid conversion is strictly harder than a free one. Assuming a paid rate at or above the current *free* rate would be unjustified, which puts the realistic band at or below the 0.5% column.

---

## 5. Phase 5 — Competition, judged the right way

Not "is the SERP crowded" (irrelevant, they are already here) but "would this specific visitor buy after reading this page."

**Letter pack:** Free substitute risk is **severe, and it is self-inflicted.** `/back-to-school-toolkit` already generates a personalized welcome letter free with no sign-up, and `posts/welcome-letter-to-parents-from-teacher.md` links to it twice, once above the fold at line 36 and once mid-article at line 143, both times labeled "Free, no sign-up." The article itself also contains four complete copyable letters. Selling a $5 letter pack on that page means selling against your own free tool, on the same page, positioned first. The alternative is to remove or downgrade the free tool, which trades a working asset for an unproven one.

**Parent-email tool:** Free substitute risk is severe for a different reason. The query evidence in Section 2 shows these visitors are already using an AI assistant to iterate on wording. They have ChatGPT open. A static template pack is strictly worse than what they already have in another tab, and a $5 AI wrapper competes against a free general-purpose model that does the same job with more flexibility.

**Report card library:** Free substitute risk is **moderate and already managed.** The free `/report-card-comment-generator` produces one comment at a time; the paid library's value is 374 comments organized by category for bulk work. That is a genuine, defensible split, and it is the one cluster where the free and paid versions do different jobs rather than the same job.

**The immediately-available-in-the-article advantage is real** but it is worth cents, not dollars, when the same article already hands over a free tool and four complete examples.

---

## 6. Phase 6 — High-intent moments

Ranked by whether the visitor needs an output *now*:

**Strong (need output now):**
1. "3 year old preschool progress report comments **free**" — 359 impressions, explicitly wants a deliverable, but the word *free* is in the query itself, which is a direct signal about willingness to pay
2. "welcome letter to parents from teacher **free template**" — same pattern
3. "email to parents about fight at school" — genuinely urgent, but only 1,769 impressions and 0.62% CTR = 11 clicks/90d
4. "50 quick report card comments for preschool" — wants bulk, now

**Weak (browsing/comparing):** all ClassDojo-alternative queries, "best X apps" comparisons, "how to talk to parents about behavior" guides.

**The uncomfortable pattern:** the highest-intent queries on this site contain the word "free." Teachers searching for classroom paperwork templates are a population conditioned by TPT freebies, district-provided resources, and Pinterest to expect zero-cost. That is not a reason to reject the idea outright, but it belongs in the risk column with real weight.

---

## 7. Phase 7 — Scoring

Scored 1-10. Weighted per the request toward existing traffic x intent x purchase fit. On "free substitute risk" and "competition," **10 = low risk / favorable**.

| Criterion | Letter pack | Parent-email tool | Report card library |
|---|---|---|---|
| Existing monthly traffic | 8 | 5 | 4 |
| Traffic growth | 7 (seasonal peak passing) | 6 | 8 (Oct-Nov ahead) |
| Search intent | 8 | 7 | 8 |
| Urgency | 8 | 9 | 8 |
| Purchase fit | 4 | 3 | 6 |
| Solves completely | 8 | 6 | 8 |
| Ease of building | 6 | 5 | **10 (built)** |
| Ease of explaining | 9 | 7 | 9 |
| $2.99-$7.99 WTP | 4 | 3 | 6 |
| Free substitute risk | **2** | **2** | 6 |
| Competition (on-site) | 7 | 5 | 8 |
| Placement fit | 9 | 8 | 8 |
| **Weighted verdict** | **MEDIUM** | **WEAK** | **MEDIUM** |

---

## 8. Phase 8 — Results

### 8.1 Top traffic clusters by micro-product potential

The request asked for 20. This site does not have 20 clusters with enough traffic to rank honestly; below ~150 views/month the differences are noise. The real list is 9, ranked, with the rest named as a tail.

| # | Cluster | Monthly views | Micro-product potential |
|---|---|---|---|
| 1 | Welcome/intro letters (3 pages) | 1,222 | Highest volume, worst free-substitute conflict |
| 2 | Parent email re: behavior (2 pages) | 457 | Highest urgency, worst AI-substitute conflict |
| 3 | Report card comments (2 pages) | 265 | Product already exists and is unlaunched |
| 4 | ClassDojo alternatives (3 pages) | ~440 | No product fits; comparison intent |
| 5 | Behavior tracking app comparisons | ~180 | No product fits |
| 6 | Missing homework emails | ~110 | Merges into cluster 2 |
| 7 | Behavior report writing | ~95 | Merges into cluster 2 |
| 8 | MTSS/Tier 2 documentation | ~80 | Niche, but 7 file_downloads already |
| 9 | IEP meeting prep | ~50 | Too small standalone |
| — | Tail (~40 pages) | <40 each | Not independently viable |

### 8.2 Top products worth considering

Ranked. 1-3 are modeled above; 4-10 are named for completeness and are all below viability threshold on current traffic.

1. Welcome Letter Pack (personalized letter + short message + Meet-the-Teacher sheet)
2. Report Card Comment Library — **already built, $4.99, unlaunched**
3. Incident-to-Parent-Email converter
4. Preschool progress report comment pack (3yo/4yo/pre-K bands)
5. Parent-teacher conference prep sheet builder
6. ABC behavior incident log printable pack
7. First-30-days documentation starter kit
8. MTSS Tier 2 documentation pack
9. IEP meeting prep bundle
10. Parent communication log printable (already free at `/tools/parent-communication-log`)

### 8.3 Top 5 candidates in detail

Only 3 clear the bar for detailed treatment. Padding to 5 would mean modeling products against <150 views/month, which would be false precision. #4 and #5 are stated with their disqualifying numbers instead.

---

#### Candidate 1 — Report Card Comment Library — **MEDIUM (strongest)**

- **Pages:** `/blog/preschool-report-card-comments`, `/blog/report-card-comments-for-behavior`, plus 4 smaller report-card posts
- **Traffic:** 265/mo now (345 views Aug1-Sep8); 90-day GSC 293 clicks across the two main pages
- **Queries:** "3 year old preschool progress report comments free" (359 impr, pos 4.8), "preschool report card comments" (147 impr), "report card comments for students with behavior problems", "conduct and attitude for report cards", "50 quick report card comments for preschool"
- **Job:** *"I have 25 comments due and I don't want to write 25 original sentences."*
- **Product:** The existing 374-comment library, 27 categories
- **Pitch:** "374 ready-to-use report card comments, organized by grade and trait, so you can finish a whole class in one sitting."
- **Price:** $4.99 (already set)
- **Buyer receives:** Full categorized library, browsable and copyable
- **Build complexity: NEAR ZERO — this is the finding that matters.** Per `docs/report-card-comment-library-handoff.md`, content is complete, Stripe checkout is built, and a real test-mode purchase was proven end to end on 2026-07-29: checkout completed, webhook signature verified, one paid row at $4.99, fulfillment 200, library unlocked. Remaining work is the production merge, a live Stripe key, and Resend for restore emails. The page is currently `robots: { index: false, follow: false }` and unlinked.
- **Placement:** Inline after the comment examples on both report-card posts, framed as bulk-vs-single against the free generator
- **Scenarios:** 0.25% $3 / 0.5% $7 / 1% $13 / 2% $26 per month
- **Biggest reason it fails:** The traffic is too small to matter *today*. But report card season is October-November and January, and this cluster's peak is ahead, not behind.

---

#### Candidate 2 — Welcome Letter Pack — **MEDIUM (do not build)**

- **Pages:** the three letter posts
- **Traffic:** 1,222/mo, the largest cluster on the site
- **Queries:** "welcome letter for parents from teacher" (990 impr, pos 6.4), "welcome letter to parents from teacher free template", "welcome message for parents in whatsapp group from teachers" (16% CTR), "first day of school message to parents"
- **Job:** *"School starts Monday. I need one letter, in my voice, tonight."*
- **Product:** Personalized letter + matching class-app short message + Meet-the-Teacher half-sheet, as a formatted PDF
- **Pitch:** "Your welcome letter, your short class-app message, and a Meet-the-Teacher sheet, personalized and print-ready in two minutes."
- **Price:** $6.99
- **Build complexity:** Medium. The generator and refine API already exist (`app/api/welcome-letter`, `welcome-letter-refine`); the new work is PDF formatting and the two extra artifacts.
- **Placement:** After the four example letters
- **Scenarios:** 0.25% $21 / 0.5% $43 / 1% $85 / 2% $171 per month
- **Biggest reason it fails, and it is close to fatal:** you already give this away free on the same page, above the fold, labeled "Free, no sign-up," and the article contains four complete copyable letters. Additionally, **the season is ending.** This cluster is a back-to-school spike: it was flat through July and jumped 5-8x in the first three weeks of August. By the time a paid product ships, the buying window has largely closed until next August.

---

#### Candidate 3 — Incident-to-Parent-Email Converter — **WEAK**

- **Pages:** `sample-emails-to-parents-about-student-behavior`, `positive-behavior-email-to-parents-template`
- **Traffic:** 457/mo
- **Queries:** "sample email to parents about student behavior" (pos 3.0), "how to write an email to a parent about their child's behavior", plus the AI-prompt fragments
- **Job:** *"Something happened today. I need a defensible email to this parent before I leave."*
- **Product:** Paste rough notes, get a factual parent email in 3 tones
- **Price:** $4.99
- **Build complexity:** Medium, plus **ongoing per-use AI cost**, the only candidate here with marginal cost per sale
- **Scenarios:** 0.25% $6 / 0.5% $11 / 1% $23 / 2% $46 per month
- **Biggest reason it fails:** The GSC query text proves these visitors already have an AI assistant open and are iterating in it. You would be charging $4.99 for a constrained version of a free tool they are demonstrably already using.

---

#### Candidates 4 and 5 — not modeled, and why

- **Preschool progress report pack (3yo/4yo bands):** the "3 year old preschool progress report comments free" query is the single highest-intent phrase on the site at 359 impressions and position 4.8, but it draws 12 clicks/90d and the word "free" is inside the query. It is a subset of Candidate 1, not a separate product.
- **Parent-teacher conference prep builder:** `parent-teacher-conference-comments-for-teachers` drew 11 sessions in 90 days. There is no traffic to sell against. Revisit if the conference cluster grows into October-November.

---

## 9. The one recommendation

**Launch the Report Card Comment Library that is already built. Do not build anything new.**

Verdict: **MEDIUM.** Nothing here is STRONG, and the request asked to be told so plainly.

The case:

1. **It is the only candidate whose free alternative does a genuinely different job.** The free generator writes one comment; the library gives 374 for bulk work. Candidates 2 and 3 both compete directly against something the visitor already has for free, in one case a tool on the same page.
2. **Marginal cost to find out is near zero.** The content is done, checkout is built, and a real Stripe test purchase has already been proven end to end. Remaining work is a production merge, a live key, and Resend. Every other candidate is weeks of build against worse economics.
3. **Its season is ahead of it,** not behind. Report card season is October-November and January. The letter cluster's season is ending this month.
4. **It answers a question no amount of analysis can.** This site has never taken a single real payment. Whether teachers on this traffic will pay anything is currently unknown, and modeling it further is guessing. A live $4.99 product on two blog pages converts that unknown into a measured number for roughly a day of work.

**What to expect, stated honestly:** at current traffic this returns **$3-$26/month**, most likely the low end. That is not a business. It is a cheap, real experiment that produces a conversion rate you can then apply to the much larger letter cluster before next August, when that traffic returns and there is time to build for it properly.

**What I would not do:** build the Welcome Letter Pack now. It is the biggest cluster, but you would ship into a closing season, against your own free tool that is linked twice on the same page. If the library experiment shows teachers on this traffic will pay, revisit the letter pack in **May or June 2027**, with time to build before the August spike and with a real conversion number in hand.

**The prerequisite nobody should skip:** 4,861 users produced 35 signups and 45 downloads in 90 days. If a free download converts at 0.93%, a paid product will convert below that. Any plan that assumes otherwise is assuming this site's traffic behaves differently than it has actually behaved.
