# Seasonality Research + Classroom Pulse Validation — 2026-09-07

**Type:** Research only. No website, app, or codebase changes were made in the course of producing this document. The Classroom Pulse / Pulse Academic codebase was not opened.

**Data basis:** All available GSC history for `sc-domain:getshorthandapp.com` (2026-04-08 launch through 2026-09-05, ~5 months) and `sc-domain:pulseacademic.com` (first real data 2026-04-29 through 2026-09-05, ~4.5 months). Supplemented by web search (no keyword-volume tool with hard numbers was available; treat all external demand claims as directional, not measured) and by the repo/Brain documents cited inline.

**Companion docs, read alongside this one:**
- `docs/seo-query-ownership.md` — query ownership map, and the source of the standing caution repeated below about blended vs. segmented data and the new-domain indexing confound.
- `docs/gsc-site-opportunity-scan-2026-09.md` — the whole-site opportunity scan this document extends with a time dimension.
- Brain `Pulse academic.md` — Pulse Academic's locked-in June 2026 positioning and content strategy.
- Brain `New App — Pulse Academic Tracker.md` — the original 2026-04-29 product spec.

---

## 0. A naming collision you should resolve before acting on this document

The request refers to "a second existing Lebed Digital product concept, Classroom Pulse... in-the-moment formative assessment... exit tickets... student mastery." **That description matches Pulse Academic (pulseacademic.com), not "Classroom Pulse 2.0."** Two different products share the word "Pulse":

| Name | What it is | Repo | Status |
|---|---|---|---|
| **Classroom Pulse 2.0 / "Pulse 2.0"** | Teacher behavior/mood tracking PWA, per global CLAUDE.md | `c:\projects\pulse 2.0` (aka `pulse-2.0-agl`) | Live, actively developed (iOS App Store work in progress as of 2026-08-31 per Brain handoff) |
| **Pulse Academic** | Lesson-level formative assessment / exit tickets / "Got It, Almost, Needs Help" mastery tracker | `c:\projects\pulse-academic-website` (marketing site) + a separate app | **Live but paused, mid-rebuild** (see Section 4) |

This document is about **Pulse Academic**, matched on product description (exit tickets, formative assessment, mastery tracking) and confirmed by its homepage headline ("Know exactly who got it before the bell rings") and its own strategy doc. **The instruction "do not modify or open the Classroom Pulse codebase" is interpreted here as Pulse Academic's codebase** (`c:\projects\pulse-academic-website` and its companion app, neither of which was opened beyond reading already-public-facing marketing copy and one strategy doc). Confirm this reading before anyone acts on section D/E below — if "Classroom Pulse" actually meant Pulse 2.0, the findings here do not apply to that product at all.

---

## 1. GSC history broken down by month / school-year period

**Full history available: 2026-04-08 (site launch) through 2026-09-05, roughly five months.** This is the single most important limitation on this entire research task: a school year runs ~10 months (August/September through June), and this site has not yet lived through a single complete one. Every seasonal claim below is either (a) actually observed within this five-month window, or (b) reasonable interpretation extrapolated from teacher-calendar knowledge, not observed data. Section 4 keeps these strictly separated.

| Period | Total clicks | Total impressions | Avg CTR | Avg position (impression-weighted, approx.) | Note |
|---|---|---|---|---|---|
| Apr 8-30, 2026 (launch month, partial) | ~14 | ~350 | ~4% | 20-60, highly volatile | New-domain noise; not a seasonal read |
| May 2026 | ~93 | ~4,900 | ~1.9% | mid-teens to 20s | Still early indexing |
| Jun 2026 | ~330 | ~11,700 | ~2.8% | ~9-13 | Growth accelerating |
| Jul 2026 | ~750 | ~29,600 | ~2.5% | ~8-9 | Strong, steady growth |
| Aug 2026 | ~1,940 | ~86,600 | ~2.2% | ~7-8 | **Sharpest month-over-month jump in the dataset (2.6x July's clicks)** |
| Sep 1-5, 2026 (partial) | ~476 | ~19,600 | ~2.4% | ~6-7 | Continuing at August's pace or slightly above |

**The critical confound, stated plainly:** clicks and impressions rose every single month without exception, and position improved every single month without exception (roughly 20s in May to high single digits by September). This is the signature of **a new domain climbing Google's trust/indexing curve**, which happens on a roughly 4-8 month timescale regardless of calendar season. A genuinely seasonal site would show a rise-then-fall-then-rise pattern layered on top of a flatter baseline; this site shows pure, monotonic growth. **On the whole-site total, seasonality cannot be distinguished from indexing maturity with this data.** `seo-query-ownership.md` reached the identical conclusion in July and it still holds in September.

**However, one specific pattern breaks the monotonic story and is worth taking seriously (see Section 3.1 below): the welcome-letter/back-to-school cluster's growth was not smooth. It was flat through July, then jumped 5-8x specifically in the first three weeks of August, aligned with when US teachers return to their classrooms.** That is a real, cluster-specific signal layered on top of the site-wide indexing trend, not just more of the same curve.

---

## 2. Strongest topic/query clusters, period by period

Using page-level data pulled separately for each calendar month (Apr partial, May, Jun, Jul, Aug, Sep partial):

**April (launch, mostly noise):** Homepage and `/features/quick-note` account for nearly all clicks (6 of ~14). No cluster signal yet; sample size too small.

**May 2026:** `sample-emails-to-parents-about-student-behavior` dominates (26 of ~93 clicks), with `report-card-comments-for-behavior` and `best-behavior-tracking-apps-for-teachers-2026` as distant seconds. IEP-related pages (`iep-meeting-checklist-for-teachers`, `what-to-say-at-an-iep-meeting`) appear for the first time with real clicks. **This roughly aligns with late-spring IEP season and end-of-year parent communication**, but the site was one month old, so this could equally be "whichever pages happened to get indexed first."

**June 2026:** Report-card cluster becomes dominant for the first time: `report-card-comments-for-students-with-adhd` (50 clicks), `report-card-comments-for-behavior` (31), `report-card-comments-for-students-with-behavior-problems` (29), `report-card-comments-behavior-preschool` (27) — four of the top five pages are report-card content. `sample-emails-to-parents-about-student-behavior` still leads overall (54 clicks). **This is a strong, plausible seasonal alignment: June is when US schools issue final report cards and progress reports.**

**July 2026:** Report-card cluster remains #1 and #2 by raw clicks (`report-card-comments-for-behavior` 110, `preschool-report-card-comments` 102 - a brand-new page this month), but the **welcome-letter cluster enters the top 10 for the first time** (`short-welcome-message-to-parents-from-teacher` 48 clicks, `welcome-letter-to-parents-from-teacher` 45, `teacher-introduction-letter-to-parents` 21). ClassDojo comparison content also becomes a top performer (`best-classdojo-alternatives-2026` 61 clicks). **The report-card content still leading into July is plausible: many US districts run summer school and issue summer progress reports through July, and this may also just be that cluster's indexing catching up rather than a seasonal signal specifically.**

**August 2026 (the sharpest inflection in the whole dataset):** The welcome-letter cluster explodes into first, second, and fourth place: `welcome-letter-to-parents-from-teacher` (364 clicks, up from 45 in July, an 8x jump), `short-welcome-message-to-parents-from-teacher` (270, up from 48, a 5.6x jump), `teacher-introduction-letter-to-parents` (169, up from 21, an 8x jump). Report-card content grows too but much more modestly (`report-card-comments-for-behavior` 68 clicks, actually down from July's 110; `preschool-report-card-comments` flat at 102). **This is the clearest single seasonal signal in the entire dataset: back-to-school welcome/introduction content spiking sharply and specifically in August, while report-card content does not follow the same curve, is hard to explain by indexing alone** (if it were pure indexing, all clusters should have grown roughly proportionally; they didn't).

**September 1-5, 2026 (partial):** Welcome-letter cluster remains dominant but growth has visibly plateaued/normalized (`short-welcome-message` 96 clicks in 5 days, pace-adjusted roughly flat vs. August's daily rate; `welcome-letter-to-parents-from-teacher` 57 clicks in 5 days, also roughly flat to slightly down pace-adjusted). A new page enters the top 10 for the first time this period: `how-to-write-a-student-behavior-report` (13 clicks in 5 days, its best relative showing yet). **Consistent with the interpretation that the back-to-school spike has already crested by early September and behavior-documentation content (which becomes relevant once the school year is actually underway and behavior patterns emerge) may be starting its own rise** - but five days of data is not enough to call this a trend.

---

## 3. Mapping spikes to teacher-calendar moments

### 3.1 Back to school (early-mid August)

**Evidence: real and specific.** The welcome-letter/introduction-letter cluster's 5-8x August spike, while sibling clusters (report-card, ClassDojo) grew far less in the same month, cannot be explained by generic indexing maturity alone — if it were purely indexing, growth would track proportionally across the whole site. Query-level detail confirms searcher intent is calendar-driven: `welcome letter for parents from teacher` (974 impressions, the single highest-impression query on the site for the Aug-Sep window) and its many variants are unambiguously "I am about to start the school year and need to write this" queries, not evergreen reference lookups.

### 3.2 Parent communication (ongoing, not a single spike)

**Evidence: present but not clearly seasonal within this window.** `sample-emails-to-parents-about-student-behavior` has been a consistently strong performer every month since May, without an obvious single-month spike. This reads as **evergreen demand** (parents need to be contacted about behavior year-round) rather than a calendar moment — plausible interpretation, not something this data can prove given the confound, but the flat-then-growing (rather than spike-then-decay) shape is at least consistent with "ongoing need" rather than "seasonal event."

### 3.3 Classroom management

**Evidence: weak, page-level performance never strong enough to show a seasonal shape.** Classroom-management pages (`classroom-management-plan-template`, `classroom-management-without-yelling`) have single-digit-to-low-double-digit clicks in every month observed. `seo-query-ownership.md` already flags this as "thin authority, no hub" and deliberately parked. **Cannot assess seasonality on a signal this small; reasonable interpretation only: classroom-management planning likely peaks in August alongside back-to-school, since teachers set up their systems before students arrive, but this site has no evidence either way.**

### 3.4 Conferences

**Evidence: present but small.** `parent-teacher-conference-comments-for-teachers`, `how-to-prepare-for-parent-teacher-conference`, and related pages show scattered single-digit clicks across months with no month standing out as a clear peak in the available window. **Reasonable interpretation: US parent-teacher conferences commonly cluster around October-November (fall) and March-April (spring); this site has not yet lived through either fall conference season with meaningful traffic, so this is a real gap in evidence, not a finding.**

### 3.5 Progress reports / report cards

**Evidence: real and specific, though confounded with new-content-going-live.** The report-card cluster's dominance in June-July aligns with when many US schools issue final report cards and summer-school progress reports. However, `preschool-report-card-comments` and other pages in this cluster were **newly published or newly ranking during this exact window** (per `seo-query-ownership.md` and the September opportunity scan), so some of the "June-July spike" is really "this content went live and got indexed in June-July," not "June-July is when people search this." **The report-card cluster's real test is the next report-card cycle (`seo-query-ownership.md` already flags 2026-11-05 and 2027-05-25 as the meaningful checkpoints) — this document cannot yet distinguish seasonality from first-indexing on this cluster.**

### 3.6 Intervention / MTSS

**Evidence: present, small, and shows a plausible but unconfirmed spring pattern.** `how-to-document-tier-2-interventions-for-mtss` had its best relative CTR (6.7-13.16% across different months) starting in July and continuing since, but absolute volume is low (26-30 clicks/month at peak). No clear seasonal spike observed; MTSS documentation in real schools is often tied to specific review cycles (e.g., 6-8 week intervention windows) that could occur at almost any point in the year depending on the district. **Not enough evidence to map this to a specific calendar moment yet.**

### 3.7 Testing (standardized testing season)

**Evidence: none found.** No page or query cluster in the GSC data shows any signal related to standardized testing, test prep, or testing-season teacher needs. This is worth stating plainly as **a confirmed content gap**, not just unmeasured seasonality — ShortHand has no content in this space at all, so there is nothing for GSC to show a spike in.

### 3.8 End of year

**Evidence: none directly observed yet (site has not reached a second June).** The one thing that could be end-of-year signal - the May/June IEP and report-card activity - is confounded with new-domain indexing exactly like everything else in this dataset. **Real end-of-year data does not exist yet; the first genuinely testable end-of-year read is May-June 2027,** matching the checkpoint `seo-query-ownership.md` already set for the report-card cluster.

---

## 4. Evidence vs. reasonable interpretation — explicit separation

**Established by direct observation in this GSC data:**
- Total site traffic grew every month from launch through the present, with no down month.
- The welcome-letter/introduction-letter cluster specifically (not the whole site) spiked 5-8x in August while other clusters grew far more modestly in the same month.
- The report-card cluster was the largest cluster by clicks in June and July, before the welcome-letter cluster overtook it in August.
- No content or query signal exists anywhere in the dataset for standardized testing.
- Pulse Academic (a live, indexed site for 4+ months) has real query-level demand signal for exit tickets, formative assessment, and mastery tracking, but converts almost none of it to clicks (Section 5).

**Reasonable interpretation, not directly observable in this data (flagged individually above, collected here for clarity):**
- That conferences peak in October-November and March-April — a real, well-known US school-calendar fact, but this site has not yet lived through either window with meaningful traffic to confirm it shows up here.
- That classroom-management planning peaks in August alongside back-to-school — plausible by analogy to the welcome-letter spike, unconfirmed because classroom-management content on this site is too thin to show any shape at all.
- That MTSS/intervention documentation follows a spring pattern — not supported by any spike in this data; stated only as a general possibility.
- That end-of-year (May-June) will show its own distinct spike separate from indexing growth — cannot be tested until the site has a second May-June to compare against a now-mature baseline.
- That the June-July report-card dominance is meaningfully "report-card season" rather than "this content happened to launch and get indexed in June-July" — genuinely ambiguous with the current data; the doc-designated November and next-May checkpoints are the actual test.

**The single most important thing to carry forward:** this site cannot yet answer "is this seasonal" for most clusters, because it has not lived through a full year. The honest position is that **one real seasonal signal exists (back-to-school/welcome content), one plausible-but-confounded signal exists (report cards), and everything else is either too thin to show a shape or has not yet had its calendar moment occur since launch.**

---

## 5. Pages showing primarily seasonal growth vs. sustained cross-period growth

**Primarily seasonal (spiked sharply in one specific calendar window, not a smooth month-over-month climb):**
- `/blog/welcome-letter-to-parents-from-teacher` — flat-ish through July (45 clicks), then 364 in August, an 8x jump concentrated in a 3-week window. The clearest seasonal page on the site.
- `/blog/short-welcome-message-to-parents-from-teacher` — same pattern, 48 → 270 clicks July to August.
- `/blog/teacher-introduction-letter-to-parents` — same pattern, 21 → 169 clicks.
- `/back-to-school-toolkit` — too small in absolute terms to be conclusive (3-4 clicks/month), but by name and design this is explicitly a seasonal, not evergreen, asset.

**Sustained growth across multiple periods (smooth month-over-month climb, no single-month spike disproportionate to overall site growth):**
- `/blog/sample-emails-to-parents-about-student-behavior` — 26 (May) → 54 (Jun) → 58 (Jul) → 194 (Aug) → pace-consistent in Sep. Growing steadily and roughly in proportion to the site's overall indexing curve, not spiking in one month. Best read as evergreen, not seasonal.
- `/blog/best-classdojo-alternatives-2026` — 0 (pre-June) → 7 (Jun) → 61 (Jul) → 147 (Aug) → pace-consistent in Sep. Also growing roughly proportionally to overall site growth; comparison-shopping for classroom apps is plausibly a year-round activity (new teachers, dissatisfied ClassDojo users switching mid-year), not calendar-locked.
- `/blog/report-card-comments-for-behavior` and `/blog/preschool-report-card-comments` — genuinely ambiguous. They grew fastest in June-July, which coincides with new-content indexing, not necessarily with report-card season itself (see 3.5). Their true seasonal shape will not be knowable until they've been live and indexed through a second report-card cycle without a "new content" confound.

**Practical implication:** the welcome-letter cluster is the one place on this site where a genuine "build ahead of the spike" content calendar strategy is currently justified by real evidence. Everything else should be treated as evergreen or unproven-seasonal until more of the calendar has been observed.

---

## 6. Teacher-calendar moments with little or no current content

Cross-referencing the eight calendar moments named in the request against what actually exists on getshorthandapp.com (per the September opportunity scan's full page inventory):

| Moment | Existing content? | Gap severity |
|---|---|---|
| Testing / standardized testing season | **None found.** No page, no query signal, nothing in `seo-query-ownership.md` either. | **Total gap.** |
| End of year (non-report-card: yearbooks, transitions, summer prep, "what to do with student work") | **None found** beyond report cards and one `summer-school-*` pair aimed at summer school teachers specifically, not general end-of-year wrap-up. | **Large gap.** |
| Conferences | Thin: `parent-teacher-conference-comments-for-teachers`, `how-to-prepare-for-parent-teacher-conference`, `what-to-say-at-parent-teacher-conference`, `what-to-bring-to-parent-teacher-conference-about-behavior`. All exist but all show weak position (15-60+) and near-zero clicks every month observed. | **Content exists, but is not working** - different from a true gap, but functionally the same for a teacher searching right now. |
| Testing-adjacent: end-of-unit data review, benchmark assessment prep | **None.** This is really the Pulse Academic space, and getshorthandapp.com (behavior/documentation-focused) has no reason to cover it directly. | **Not a gap for ShortHand specifically** - correctly out of scope for a behavior/documentation product. |
| Intervention / MTSS | Real but small: `how-to-document-tier-2-interventions-for-mtss`, `iep-behavior-documentation-checklist`, plus the broader IEP cluster. `seo-query-ownership.md` already has a planned November IEP-service-tracking post. | **Moderate gap**, already identified and planned by prior work. |
| Classroom management (August setup specifically, as distinct from mid-year behavior issues) | Exists (`classroom-management-plan-template`, `classroom-management-without-yelling`, etc.) but `seo-query-ownership.md` explicitly parks this cluster as "thin authority, no hub... revisit as a 2027 cluster decision." | **Deliberate gap, already a documented decision** - not new information. |
| Parent communication | Well covered; this is one of the site's two largest clusters. | **No gap.** |
| Back to school | Well covered and is the strongest-performing cluster as of August. | **No gap; actively working.** |
| Progress reports (distinct from final report cards - interim/quarter progress notes) | Only `student-progress-report-comments-for-teachers`, which has near-zero traffic every month (1 click most months). | **Real gap** - "progress report" and "report card" are treated as one cluster in current content, but a teacher writing a mid-quarter interim progress note has different needs (shorter, more provisional language) than one writing a final report card comment. |
| Testing-season parent communication ("how to tell parents about test results/scores") | **None found.** | **Gap**, and one that sits squarely inside ShortHand's actual positioning (parent communication), unlike general test-prep content. |

---

## 7. Teacher Search Calendar (August through July)

**Reading this table:** "Current GSC evidence" is drawn only from what this site has actually shown in the five months of data available; where the site hasn't lived through that month yet, it says so explicitly rather than guessing. Opportunity rating is High/Medium/Low/Unproven, where "Unproven" means the underlying teacher need is plausible but this research has no way to size it yet.

| Month | Teacher problem | Existing ShortHand page(s) | Current GSC evidence | Content/tool gap | Opportunity |
|---|---|---|---|---|---|
| **August** | "I need to introduce myself / welcome families before the first day" | `/blog/welcome-letter-to-parents-from-teacher`, `/blog/short-welcome-message-to-parents-from-teacher`, `/blog/teacher-introduction-letter-to-parents`, `/back-to-school-toolkit` | **Strong, directly observed.** 5-8x spike in August 2026, largest cluster on the site (803 combined August clicks). | Minor: no dedicated "first day of school checklist" or "meet the teacher night" content. | **High** (protect/expand; already working) |
| **August** | "I need to set up my classroom management system before kids arrive" | `/blog/classroom-management-plan-template`, `/blog/classroom-management-without-yelling` | Weak. Low single-digit clicks every month; no August-specific spike despite plausible fit. | Deliberately parked per `seo-query-ownership.md` - thin authority, crowded competitive field. | **Low** (per existing decision, not this research) |
| **September** | "School just started, I'm noticing behavior patterns and need to start documenting" | `/blog/how-to-document-student-behavior-from-day-one`, `/blog/teacher-behavior-documentation-guide`, `/blog/how-to-write-a-student-behavior-report` | Modest, early sign: `how-to-write-a-student-behavior-report` had its best relative week yet in early September (13 clicks/5 days). Too little data to call a trend. | Content exists; underperforming positions (7-15) suggest a CTR/optimization opportunity more than a content gap. | **Medium** |
| **September/October** | "I need to prep for testing season, benchmark assessments" | None | None - no content exists. | **Total content gap**, but likely belongs to Pulse Academic's positioning (formative/benchmark assessment), not ShortHand's (behavior/documentation). | **Unproven for ShortHand; possibly High for Pulse Academic** |
| **October** | "First parent-teacher conferences of the year are coming up" | `/blog/how-to-prepare-for-parent-teacher-conference`, `/blog/what-to-say-at-parent-teacher-conference`, `/blog/what-to-bring-to-parent-teacher-conference-about-behavior`, `/blog/parent-teacher-conference-comments-for-teachers` | Weak across the board (near-zero clicks, positions 15-60+ every month observed). Site has not yet lived through a fall conference season to test whether this improves seasonally. | Content exists but is not ranking. `seo-query-ownership.md`'s existing 2026-09-15 back-to-school review is the right moment to also check this cluster. | **Medium** (real need, unproven whether current content can capture it) |
| **October-December** | "Report card season is here" | `/blog/report-card-comments-for-behavior` + full report-card cluster (site's largest content investment) | Strong in June-July 2026, but that may have been indexing, not report-card season, since it was mid-summer. **The real test (per `seo-query-ownership.md`) is 2026-11-05.** | None - already the single most-planned cluster on the site (October hub build already scheduled). | **High** (already prioritized; this document adds nothing new here) |
| **November** | "I need to track intervention/MTSS progress for a student not responding to Tier 1" | `/blog/how-to-document-tier-2-interventions-for-mtss`, IEP cluster | Present, growing, best CTR on the site (6.7-13%) but low absolute volume. | November IEP-service-tracking post already planned per `seo-query-ownership.md`. | **Medium-High** (already planned) |
| **December-January** | "Winter break is coming, I need a check-in on how the semester went" / mid-year progress notes | `/blog/student-progress-report-comments-for-teachers` (only page even loosely on-topic) | Near-zero (1 click most months). | **Real gap**: no dedicated "mid-year / semester check-in" or interim progress note content distinct from end-of-year report cards. | **Unproven, worth testing** |
| **January-February** | "New semester, new class roster, I need to re-establish behavior expectations" | None specific (general classroom-management content only) | None. | Gap, but overlaps the already-parked classroom-management cluster. | **Low** (per existing decision) |
| **February-March** | "Report cards / progress reports again (many US districts run trimesters or mid-year marking periods here)" | Same report-card cluster as October | Same caveats as October - the cluster exists, seasonality within it unconfirmed. | None new. | **High** (already covered by existing plan) |
| **March-April** | "Spring parent-teacher conferences" | Same conference pages as October | Same weak performance as October; second data point when it happens will help distinguish "conferences don't work as a topic" from "conferences are seasonal and site just hasn't hit the window yet." | Same as October. | **Medium** |
| **April-May** | "Standardized testing is happening, parents are asking about scores" | None | None. | **Total gap**, and this specific angle (parent communication about test results) is squarely inside ShortHand's positioning, unlike general test-prep. | **Unproven, worth testing - closest testing-adjacent angle to ShortHand's actual product** |
| **May-June** | "End of year: final report cards, saying goodbye, summer prep" | Report-card cluster (final comments) + nothing for the "saying goodbye / end of year letter" angle specifically | Cannot assess - site's only May-June so far was month one of operation. **2027-05-25 is the real checkpoint**, already set by `seo-query-ownership.md`. | Missing an "end of year letter to parents/students" content pair to mirror the back-to-school welcome-letter cluster. Given how strong that cluster performs, its bookend is a reasonable bet. | **Medium-High (speculative but well-reasoned by analogy)** |
| **June-July (summer)** | "Summer school documentation, building next year's system" | `/blog/summer-school-documentation-first-week`, `/blog/summer-school-build-documentation-system-before-september` | Small but present (3 clicks/month range). Niche audience (summer school teachers specifically). | Adequate for its small audience; not a priority gap. | **Low** |

---

## 8. Classroom Pulse (Pulse Academic) demand research

### 8.1 What already exists (this is not hypothetical - real evidence exists)

Pulse Academic (pulseacademic.com) launched 2026-04-30, has been indexed for over four months, and its Brain strategy doc (`Pulse academic.md`, "locked in June 2026") already contains real content strategy, positioning work, and a 3-layer funnel model. **The site's own live homepage currently reads "Temporarily Paused... signups aren't open right now... it gets rebuilt."** This is the single most important fact for section D/E: this is not a green-field validation question, it is a **post-mortem-and-relaunch** question.

### 8.2 GSC evidence from pulseacademic.com's first ~4.5 months

**Overall performance: essentially no traction.** Approximately 24 total clicks across the entire measured period, against real impression volume (query-level rows regularly show 20-70+ impressions), at average positions almost entirely in the 20s-50s. Daily click counts are 0 or 1 on all but a handful of days; the single best day (2026-08-21) recorded 4 clicks. For comparison, getshorthandapp.com was already recording 40-100+ daily clicks by its equivalent point in its own lifecycle. Both sites launched within three weeks of each other and had the same founder, similar production quality, and similar content-marketing approach - the gap is stark.

**But the demand signal underneath is real, not absent:**

| Query | Impressions | Clicks | Position | Read |
|---|---|---|---|---|
| `student mastery` | 55 | 0 | 31.2 | Real search volume, page not ranking well enough to convert |
| `formative assessment apps` | 67 | 0 | 25.6 | Same pattern |
| `data collection app for teachers` | 42 | 0 | 20.0 | Same pattern, closest to page-1 of anything on the site |
| `exit ticket app` | 35 | 0 | 20.4 | Same pattern |
| `reteaching` | 26 | 0 | 38.6 | Broader query than the product, but shows the underlying teacher problem ("who needs reteaching") gets searched |
| `exit ticket generator` | 5 | 0 | 70.4 | Low volume, page not ranking at all |
| `ai exit ticket generator` | 4 | 0 | 68.5 | Same |
| `mastery tracker` | 8 | 0 | 36.9 | Direct product-category match, unranked |
| `classroom pulse` | 4 | 0 | 56.0 | Own-brand query, still not ranking - suggests weak domain authority/indexing more than a naming problem |

**Reading this table:** every single query with any real volume shows **zero clicks**, because position never gets better than the low 20s. This is not a demand problem - `formative assessment apps` at 67 impressions and `student mastery` at 55 impressions are respectable numbers for a niche B2B-ish education topic this early - it is a **visibility/ranking problem**, structurally identical to the pattern found in the earlier GSC validation report for getshorthandapp.com's own underperforming tool pages (parent-communication-log, report-card-comment-generator): real searcher demand exists, the page simply isn't winning the position needed to capture it.

### 8.3 External research on the named terms and related terms

No keyword-volume tool with hard monthly-search numbers was available in this session (Google Keyword Planner, Ahrefs, and SEMrush were not accessible as tools here); the findings below are from general web search and should be treated as directional confirmation that these are real, actively-served categories with commercial competition, not a measurement of volume.

**Confirmed as real, actively-served categories (multiple commercial products exist, suggesting sustained demand):**
- **Exit ticket generator** - at least four dedicated tools found (OpenEduCat, Jotform's AI generator, Kuraplan, TeachQuill), each positioning around "generate a lesson-specific exit ticket in under a couple minutes." This validates the core mechanic Pulse Academic already built (upload lesson → AI extracts objective → generate question).
- **Formative assessment app** - a mature, competitive category with established players (Formative, Pear Deck, Nearpod, ASSISTments, Google Classroom's built-in tools). This is good news and bad news: real demand, but Pulse Academic is entering a crowded field of well-funded incumbents, not a blue ocean.

**Related terms surfaced by pulseacademic.com's own GSC data that go beyond the request's original wordlist** (this matters because the request explicitly asked for related terms, not just the ones named):
- `reteaching` / `reteaching strategies` / `reteaching activity` (26, 17, 9 impressions respectively) - a distinctly different phrasing from "formative assessment" that focuses on the *output* of the assessment (what to do next) rather than the assessment itself. This matches the Brain strategy doc's own insight almost exactly: "teachers don't wake up thinking 'I need formative assessment,' they wake up thinking 'which kids do I pull first today.'" The GSC data validates that insight directly - `reteaching` gets more impressions than `formative assessment` in the site's own data.
- `small group instruction` / `small group planning` / `small group rotation schedule` - a cluster the strategy doc already identified (Cluster 1: "who needs reteaching") but which the live site's own content (`how-to-plan-small-groups-quickly`, `how-to-group-students-for-small-group-instruction`) has not yet managed to rank for (positions 32-41).
- `anecdotal notes` (17 impressions) - overlaps conceptually with ShortHand's own positioning; worth noting this term shows up on a formative-assessment site at all, suggesting some searcher confusion or overlap between "documenting behavior" and "documenting academic progress" that a future content strategy for either product should be aware of.
- `check for understanding` / `checks for understanding` (implied by page `check-for-understanding-without-grading`, 19 impressions) - a commonly-used teacher-training phrase, worth treating as a first-class synonym cluster alongside "formative assessment" and "exit ticket," since it's the phrase teacher-prep programs actually use.

**Not validated as meaningful search terms** (per the request's original list): `quick formative assessment` and `track student understanding` returned no distinguishable signal in either the web search or the site's own GSC data - these read as descriptive phrases a copywriter would use, not phrases a teacher would type into Google, similar to the earlier finding on "teacher documentation app" for ShortHand.

### 8.4 Why Pulse Academic likely failed to gain traction (evidence-based, not speculative where evidence exists)

1. **It is not a ranking/content-quality problem in the way "no content" would be** - the site has 20+ blog posts covering closely-matched topics (exit tickets, reteaching, small groups, mastery tracking) and still can't crack position 20 on almost anything. This points toward **domain authority / backlink / technical SEO factors**, or possibly **insufficient time before the pause decision was made** (4.5 months is not long for a competitive category with entrenched incumbents like Nearpod and Pear Deck, versus ShortHand's much less contested ClassDojo-alternative and parent-letter spaces).
2. **The category is more competitive than ShortHand's.** ShortHand competes against ClassDojo (behavior/parent-comms) and not much else at the content level. Pulse Academic competes against Formative, Pear Deck, Nearpod, ASSISTments, and Google Classroom's native tools - all well-funded, well-established, well-linked. The same content effort that got ShortHand to position 6-9 on "classdojo alternatives" queries may simply need more time or more differentiation to work in a more crowded field.
3. **Clarified by Greg (2026-09-07): the pause was an allocation decision, not a validation result.** Pulse Academic was paused because Greg was putting his limited development time entirely into ShortHand, not because Pulse Academic had been tested and found to lack demand or product value. This materially changes how the weak GSC performance in Section 8.2 should be read: the near-zero clicks reflect a product that stopped receiving attention partway through its indexing curve, not a product that was given a fair runway and failed on its merits. It also means the "why was it paused" open question in the original draft of this section is resolved - there is no hidden technical or product problem to uncover before considering a relaunch.

### 8.5 Is Classroom Pulse (Pulse Academic) worth a low-cost validation/relaunch experiment?

**Yes.** The demand evidence (Section 8.2's query table) is real and not fully captured, which is a materially different starting position than "build something and see if anyone wants it." The core insight already validated by the site's own GSC data (`reteaching` outperforming `formative assessment` in impressions) confirms the strategy doc's outcome-over-feature positioning was directionally correct even though it didn't yet translate into rankings or clicks.

**Why it was paused is now known and removes the biggest open question:** per Greg (2026-09-07), the pause was a time-allocation decision in favor of ShortHand, not a verdict on Pulse Academic's demand or product value. That reframes the weak GSC numbers - the product was never actually tested to a real conclusion, it was set down mid-climb. Two things are still worth weighing before meaningful re-investment:
- **Was 4.5 months of (partial, then zero) attention long enough to judge even if it hadn't been paused?** ShortHand didn't hit its own inflection point until month 4 (August) either - Pulse Academic may simply not have reached a comparable point in its own indexing curve.
- **Is the competitive field (Formative, Pear Deck, Nearpod) something a solo-founder content strategy can realistically win share of voice against**, versus ShortHand's comparatively open field?

Neither of these can be answered from GSC data alone, but neither is a reason to avoid the low-cost test in Section 8.6 - they're exactly what that test is designed to start answering.

### 8.6 The smallest possible test before investing meaningful development time

Given that the app is "mostly built" per the request and the marketing site already exists with real (if currently paused) content and query data, the smallest test does not need to be a rebuild:

1. **Un-pause signups on the existing pulseacademic.com site with zero code changes**, and watch two weeks of GA4/signup data against the real (if weak) organic traffic it's already getting from the queries in Section 8.2. This costs nothing but a config flip and answers "does anyone who finds this today actually want it," independent of the ranking problem.
2. **In parallel, pick the single highest-impression, lowest-position query already sitting in pulseacademic.com's own GSC data** (`student mastery`, 55 impressions at position 31, or `formative assessment apps`, 67 impressions at position 25.6) and do exactly one on-page optimization pass on whichever existing post targets it most closely - a title/meta rewrite, nothing structural - to see if it can move from position 25-31 into single digits, the way ShortHand's ClassDojo roundup moved from ~16 to ~7 with a comparable pass. If it moves and still doesn't convert, that's evidence against the product; if it moves and converts, that's a strong signal to invest further.
3. **Ask Greg directly why it was paused**, before either of the above, since the answer may make both tests moot (e.g., if the app itself has a broken core loop, no amount of traffic will validate it).

This sequence costs a config change, one content edit, and one conversation - not new development - and would produce real signal within 2-4 weeks, comparable to the time it took the welcome-letter cluster to show its August spike on the sibling site.

---

## A. Does seasonality appear to be a major driver of getshorthandapp.com traffic?

**Not provably, with one clear exception.** The site is five months old and its traffic growth is dominated by new-domain indexing maturity - every month grew over the last, every cluster's position improved every month, which is the signature of a young site gaining trust, not of seasonal demand cycling. The one place seasonality is directly evidenced, not just inferred, is the **back-to-school welcome-letter cluster**, which spiked 5-8x specifically in August while sibling clusters grew far less in the same month - a pattern indexing alone cannot explain. Everything else (report cards, conferences, MTSS, end-of-year) is either confounded with the indexing curve or hasn't had its calendar moment occur yet since launch. **The honest answer is: mostly no, with one real exception, and the tools to tell the difference for the rest won't exist until the site has a second full year of data** (checkpoints already set for November 2026 and May 2027 per `seo-query-ownership.md`).

## B. Is building content/tools around the entire teacher calendar a defensible strategy?

**Defensible as a hypothesis worth testing incrementally, not yet defensible as a proven strategy to bet heavily on.** The one calendar moment with real evidence (back-to-school) performed extremely well, which is a genuine data point in favor. But betting on the other seven moments named in the request without evidence risks repeating Pulse Academic's own experience: real underlying demand (confirmed by query impressions) that didn't translate to results within the time actually invested, for reasons not fully understood. The more defensible version of this strategy is: **build ahead of the one proven moment (back-to-school) confidently, build ahead of the plausible-but-unconfirmed moments (report cards, conferences) cheaply and as scheduled checkpoints allow, and treat testing-season and true end-of-year content as genuine experiments with a defined "did this work" checkpoint**, rather than assuming the whole calendar behaves like August did.

## C. Top 10 missing seasonal opportunities

1. **Testing-season parent communication** ("how to talk to parents about test scores/results") - total content gap, and the angle most aligned with ShortHand's actual parent-communication positioning.
2. **Mid-year / interim progress note content**, distinct from final report-card comments - near-zero existing content, real teacher need (progress notes use more provisional, less final language than report cards).
3. **An "end of year letter to parents/students"** to bookend the extremely strong welcome-letter cluster - no existing content, strong analogy to a proven performer.
4. **Fall parent-teacher conference content that actually ranks** - content exists but has never shown a real position; needs a genuine CTR/ranking pass, not new writing.
5. **Spring parent-teacher conference content** - same gap, second occurrence in the calendar year.
6. **"First day of school" / "first week of school" logistics content** distinct from the welcome-letter angle already covered (classroom setup, first-week routines) - adjacent to the site's strongest cluster, plausible spillover audience.
7. **November IEP/MTSS service-tracking post** - already planned per `seo-query-ownership.md`, reinforced by this document's finding that MTSS content has the site's best CTR on tiny volume.
8. **A true "end of year" content pair beyond report cards** (transitions, summer prep, saying goodbye) - total gap.
9. **Standardized-testing-adjacent behavior documentation** ("how testing stress shows up in behavior," a genuinely ShortHand-relevant angle rather than generic test-prep) - total gap, worth testing cheaply since it's off the beaten path of existing competitor content.
10. **A dedicated "returning from a break" or "January reset" behavior-expectations post** - overlaps the currently-parked classroom-management cluster, but framed around a specific calendar re-entry moment (post-winter-break) rather than general classroom management, which might justify revisiting the parking decision on narrower grounds.

## D. Is Classroom Pulse (Pulse Academic) worth a low-cost validation/relaunch experiment?

**Yes, and more clearly so now than the underlying GSC data alone would suggest.** The demand signal is real (confirmed by the product's own GSC data, not just external research), the core positioning insight already reached by the Brain strategy doc is independently validated by that same GSC data, and the observed failure mode (real impressions, near-zero clicks, weak positions) looks like a fixable visibility problem rather than evidence of no demand. Confirmed by Greg (2026-09-07): the pause was a time-allocation decision in favor of ShortHand, not a verdict reached by testing Pulse Academic and finding it lacking - the product has never actually been evaluated to a real conclusion. That is a materially better risk profile than either a from-scratch product bet or a product that was tried and failed.

## E. The smallest possible test for Classroom Pulse before investing meaningful development time

**Un-pause the existing site with no code changes and watch two weeks of real traffic and any signups against the already-indexed content.** Since the pause is now confirmed to be an allocation decision rather than a verdict on the product, there is no open "why was it paused" question left to resolve first - the test can start immediately. If un-pausing shows any life, follow with one narrowly-scoped on-page optimization pass (title/meta only) on the single highest-impression, lowest-position existing post (`student mastery` or `formative assessment apps`, both currently stuck at positions 25-31) to see if it can move the way ShortHand's own comparable pages have. Total cost: one config flip, one content edit - no new development.

---

*Research only. No website, app, or Pulse Academic/Classroom Pulse codebase changes were made. Data via Google Search Console (gsc-server MCP) for sc-domain:getshorthandapp.com and sc-domain:pulseacademic.com, pulled 2026-09-07. External keyword-volume claims are directional (web search only, no keyword-volume tool available this session) and should be re-verified with a dedicated keyword tool before being used to size an investment decision.*
