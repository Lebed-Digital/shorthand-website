# Resource Asset Gap Audit + Implementation Order — 2026-09-09

**Type:** Research only. No code changed.

**Question:** Audit every existing PDF/resource against the Tier 1 and Tier 2 gap pages, identify which gaps can be filled with assets already owned, and give an implementation order based on traffic x seasonality x artifact match.

**Companion doc:** `docs/micro-product-opportunity-analysis-2026-09.md` (same session) established the Tier 1/Tier 2 gap list this document acts on.

**Data basis:** GA4 pageviews 2026-08-01 to 2026-09-08 scaled to 30 days (the window reflecting traffic as it currently is; June was ~10 clicks/day, September ~110). GSC queries 2026-06-11 to 2026-09-08. PDF contents read directly from `public/*.pdf`, not inferred from filenames.

---

## 1. The asset inventory — what each PDF actually contains

Every PDF was opened and its text extracted. This matters: two of the six are not what their filenames suggest.

| Asset | Real contents | Type | Currently linked from |
|---|---|---|---|
| `Ready_to_Send_Behavior_Emails_x7k2.pdf` | **10 complete fill-in-the-blank parent email scripts**, each with a "Use when" line: first offense, repeat pattern, physical incident, work refusal, meltdown, defiance, defensive parent, **positive behavior note**, IEP-related, hard-week reset | Copy-paste wording | `sample-emails-to-parents-about-student-behavior`, `how-to-write-behavior-emails-to-parents` (both **email-gated**) |
| `parent-teacher-conference-notes.pdf` | 5-section conference prep + documentation sheet: strengths, academic concerns, behavior concerns, parent input, action plan, with follow-up checkboxes | Printable form | `/resources` only |
| `classroom-behavior-documentation-log.pdf` | 6-column chronological incident log: date/time, student, objective observation, response, contact home, next steps | Printable form | `/resources` only |
| `parent-contact-documentation-log.pdf` | 8-column contact log: date, student, parent, method, topic, outcome, follow-up date, status | Printable form | `/resources` only |
| `student-behavior-pattern-tracker.pdf` | Weekly Mon-Fri grid with quick-codes (O/D/R/E) for baseline data before MTSS/IEP | Printable form | `/resources` only |
| `mtss-tier-2-intervention-tracking-sheet.pdf` | 4 intervention-cycle entry blocks: date, target behavior, intervention used, outcome | Printable form | `/resources`, `how-to-document-tier-2-interventions-for-mtss` |

**Also owned, non-PDF:** `/tools/parent-communication-log` (interactive, printable), `/back-to-school-toolkit` (welcome letter generator + refine API), `/report-card-comment-generator` (single comment), `/report-card-comment-library` (374 comments, built, unlaunched, `noindex`).

### 1.1 Two inventory findings that change the recommendations

**Finding A — the behavior emails PDF already contains the asset for a page it is not on.** Template #8 is a "Positive Behavior Note," which is precisely what `positive-behavior-email-to-parents-template` (169 views/mo, head query converting at **25% CTR**) asks for and currently offers nothing for. The asset exists. It is gated onto two other posts.

**Finding B — the site gates the same asset class two contradictory ways.** `/resources` serves all five form PDFs as direct downloads, advertised with the signal text **"No sign-up required"** ([app/resources/page.tsx:36](../app/resources/page.tsx#L36)). The blog `PdfGate` component ([components/PdfGate.tsx](../components/PdfGate.tsx)) requires an email into `email_leads` before opening the file. Same kind of artifact, opposite friction, and the free path is the one nobody can find: `/resources` drew **13 pageviews** in the last 39 days.

This is the likeliest single explanation for `file_download` firing only **45 times against 4,861 users** in 90 days. It is not proof, because download events are not attributed by source in the current GA4 setup, but the structural cause is visible without further measurement.

---

## 2. Gap-by-gap audit

Views/mo = GA4 Aug 1-Sep 8, scaled x30/39. "Match" judges the asset against the visitor's actual job, not topic adjacency.

### Tier 1

| Page | Views/mo | Job | Best owned asset | Match |
|---|---|---|---|---|
| **positive-behavior-email-to-parents-template** | 169 | "Send a good-news email home tonight" | `Ready_to_Send_Behavior_Emails` (template #8 is exactly this; 9 others are adjacent) | **STRONG — asset exists, wrong page** |
| **teacher-introduction-letter-to-parents** | 322 | "Write my intro / meet-the-teacher letter" | `/back-to-school-toolkit` generator | **PARTIAL — generator writes a *welcome* letter, not an intro/meet-the-teacher letter.** Already linked; the gap is product scope, not linking |
| **sample-emails-to-parents-about-missing-homework** | 41 | "Send a missing-work note home" | `Ready_to_Send_Behavior_Emails` (#4 Work Refusal is closest) | **WEAK — work refusal ≠ missing homework.** Different situation, different tone |
| **how-to-write-a-student-behavior-report** | 49 | "Write up an incident into a formal report" | `classroom-behavior-documentation-log` | **PARTIAL — a log captures raw incidents; a *report* is the composed output.** Genuinely useful upstream, does not finish the job |

### Tier 2

| Page | Views/mo | Job | Best owned asset | Match |
|---|---|---|---|---|
| **teacher-documentation-log-template** | 27 | "Get a documentation log I can print" | `classroom-behavior-documentation-log` | **EXACT — title promises a template, page delivers prose, we own the template** |
| **student-behavior-log-for-teachers** | 11 | "Get a behavior log" | `classroom-behavior-documentation-log` + `student-behavior-pattern-tracker` | **EXACT** |
| **free-behavior-log-template-for-teachers** | 6 | "Free behavior log" | same as above | **EXACT** (title literally says "free template") |
| **iep-meeting-notes-template** | 15 | "Notes template for tomorrow's IEP" | `parent-teacher-conference-notes` | **PARTIAL — conference ≠ IEP meeting**, structure transfers, labels do not |
| **behavior-intervention-plan-template** | 14 | "BIP template" | `mtss-tier-2-intervention-tracking-sheet` | **PARTIAL — tracking a Tier 2 intervention ≠ writing a BIP** |
| **classroom-management-plan-template** | 9 | "Management plan template" | none | **NONE** |
| **parent-phone-call-script** | 22 | "What do I say on this call" | `Ready_to_Send_Behavior_Emails` (written, not spoken) | **WEAK — wrong medium** |
| **how-to-document-parent-contact-as-a-teacher** | 7 | "Log parent contact" | `parent-contact-documentation-log` | **EXACT** (already linked on the *IEP* variant, not this one) |
| **how-to-prepare-for-parent-teacher-conference** | <5 | "Prep for conferences" | `parent-teacher-conference-notes` | **EXACT match, but near-zero traffic today.** Seasonal, see §3 |

### Summary of what the owned assets can and cannot do

**Can be filled today with zero new asset creation (7 pages):** positive-behavior-email, teacher-documentation-log-template, student-behavior-log-for-teachers, free-behavior-log-template, how-to-document-parent-contact-as-a-teacher, how-to-prepare-for-parent-teacher-conference, how-to-write-a-student-behavior-report (partial, as upstream aid).

**Cannot be filled without new work (5 pages):** missing-homework emails (needs a distinct template set), iep-meeting-notes (needs relabeling of the conference form at minimum), behavior-intervention-plan (needs a real BIP template), classroom-management-plan (nothing owned), parent-phone-call-script (needs a spoken-word script card).

---

## 3. Seasonality, applied honestly

Per `docs/seasonality-and-classroom-pulse-research-2026-09.md`, this domain has never completed a school year, and site-wide seasonality cannot be separated from the indexing curve. Only one cluster-specific seasonal signal is *observed*: the welcome/back-to-school cluster was flat through July, then jumped 5-8x in the first three weeks of August.

Everything else below is **teacher-calendar inference, not measured data**, and is labeled as such:

| Cluster | Window | Basis |
|---|---|---|
| Welcome/intro letters | Aug (peak passing now) | **Observed** in GSC |
| Parent-teacher conferences | **Late Oct - Nov** | Inferred (US conference season) |
| Report card comments | **Oct-Nov, Jan** | Inferred |
| Behavior documentation / logs | Rising Sep-Oct, sustained | Inferred (patterns emerge ~6 weeks in) |
| IEP / MTSS | Steady, no strong peak | Inferred |
| Missing homework | Rising Oct onward | Inferred |

**Practical consequence:** the conference asset is the one where timing genuinely matters. `parent-teacher-conference-notes.pdf` is a finished, exact-match form sitting on an orphan page roughly six weeks before the inferred season starts. That is the one item where acting late costs a full year.

---

## 4. Implementation order

Ranked by (traffic x artifact match x seasonal timing) / effort. Each step names its own success measure.

### Step 1 — Ungate, or dual-path, the behavior emails PDF
**Effort:** ~1 line + a decision. **Blocks:** everything else in this list.

The contradiction in §1.1 has to be resolved before adding placements, or every new placement inherits an email wall that the site's own `/resources` page contradicts in writing. Two defensible options:

- **(a) Ungate on blog posts**, matching `/resources` and the "no sign-up" promise. Maximizes downloads, gives up lead capture.
- **(b) Keep the gate, but offer the file directly with an *optional* email**, matching the `OptionalEmailCapture` pattern already proven on `/report-card-comment-generator` (PR #75) and the welcome letter generator.

**Recommendation: (b).** It resolves the contradiction, preserves lead capture, and reuses a component already shipped and working. This is Greg's call, not mine to assume, because it trades measurable leads for measurable downloads.

**Measure:** `file_download` rate per pageview on gated posts, before vs after.

### Step 2 — Put the behavior emails PDF on `positive-behavior-email-to-parents-template`
**Effort:** one entry in the `PDF_GATES` map in [app/blog/[slug]/page.tsx:74](../app/blog/[slug]/page.tsx#L74).

Highest-value single change available. 169 views/mo, the head query "positive email home to parents template" converts at **25% CTR from position 4.2**, the page offers nothing today, and template #8 in the existing PDF is literally a positive behavior note. Nothing is built; one map entry is added.

**Caveat to handle in the copy:** the PDF is titled "10 Ready-to-Send Behavior Emails," and this page's visitor wants *positive* news. Lead with template #8 explicitly, or the offer reads as off-topic on a good-news page.

**Measure:** downloads on this page; it should outperform both currently-gated pages on rate.

### Step 3 — Link the log PDFs to the three log/template pages
**Effort:** three map entries. Pages: `teacher-documentation-log-template` (27/mo), `student-behavior-log-for-teachers` (11/mo), `free-behavior-log-template-for-teachers` (6/mo).

Individually small, but these are **exact** matches where the page title promises a template and delivers prose, and `free-behavior-log-template-for-teachers` has the word "free template" in its own slug. Combined ~44 views/mo at the cleanest artifact match on the site.

**Measure:** combined download count; treat this trio as one experiment, not three.

### Step 4 — Conference notes onto the conference pages, before late October
**Effort:** two map entries. **This is the deadline-bound item.**

`parent-teacher-conference-notes.pdf` is finished and exact-match. Target `how-to-prepare-for-parent-teacher-conference` and `parent-teacher-conference-comments-for-teachers`. Both are near-zero traffic *today* (<5 and 10 views/mo), which is exactly why this ranks 4th rather than 1st, and exactly why it cannot wait: if the inferred conference season is real, the traffic arrives in late October and the asset needs to already be placed.

**Measure:** conference-page traffic Oct 15 - Nov 30 vs now. **This doubles as the test of whether the inferred seasonality in §3 is real at all** — a genuinely valuable read regardless of downloads, because it is the first cluster that can confirm or refute the calendar model on this domain.

### Step 5 — Fix `/resources` discoverability
**Effort:** small; add contextual links from documentation-cluster posts.

Five finished PDFs reachable only from a page that got 13 views in 39 days. Cheap to fix once Steps 2-4 establish which assets pull.

### Step 6 — Only now, consider creating new assets

In value order, and only if Steps 2-4 show teachers actually take free artifacts:
1. **Missing-homework email templates** (41 views/mo, 4,571 impressions at 0.98% CTR, queries explicitly say "missing assignments template")
2. **Behavior report composer/exemplar** — "behavior reports" drew 258 impressions and **zero clicks**
3. **IEP meeting notes form** — relabel the conference form, cheapest new asset here
4. **BIP template** — many query variants, all ranked 15-50, so demand is unproven at reachable positions
5. **Parent phone call script card** — 22 views/mo, wrong medium for every asset owned

---

## 5. What this does not do, stated plainly

None of this is revenue. It is free-artifact placement, and it is deliberately sequenced ahead of the paid question from the companion doc.

The reason: 4,861 users produced 45 downloads and 35 signups in 90 days. Until it is known whether these visitors will accept a *free* finished artifact when it is placed in front of them at the right moment, modeling paid conversion is guesswork. Steps 2-4 cost roughly a day total, use only assets already owned, and produce the number that makes the paid decision answerable.

If downloads stay flat after Steps 1-4, that is the most useful possible finding: it means the constraint is the audience, not the offer, and the Report Card Comment Library launch should be judged on that basis rather than on the traffic totals alone.
