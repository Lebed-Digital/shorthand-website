# Pulse Academic Keyword & SERP Research (2026-09-07)

Research only. No Pulse Academic or ShortHand code/content changed as part of this pass.

## Method and spend

- Tools: OpenSEO (self-hosted, DataForSEO-backed) for keyword/SERP data, `gsc-server` MCP for Pulse Academic's live Google Search Console data (`sc-domain:pulseacademic.com`, connected and verified), GA4 attempted but not completed (see Gaps below).
- Created a new OpenSEO project scoped to `pulseacademic.com` (`11c35bd0-16ee-470c-9b72-2708d683df13`), US market (locationCode 2840, en).
- Checked `list_saved_keywords` and `get_project_context` first: no prior research existed for this project, nothing was re-bought.
- Paid DataForSEO calls made (4 total):
  1. `research_keywords`, 5 seeds (`exit ticket generator`, `formative assessment app`, `check for understanding`, `student mastery tracker`, `reteaching strategies`) — used to sanity-check what real "related keyword" expansion looks like per cluster. Two of five seeds (`student mastery tracker`, `reteaching strategies`) returned almost entirely unrelated junk (see below) and were not expanded further.
  2. `get_keyword_metrics`, all 27 seed keywords from the brief in one batched call (cheaper and more precise than more seed expansion for exact-match phrases).
  3. `get_serp_results`, 8 keywords, depth 20 (~5 credits/keyword) — the keywords with real volume and/or existing GSC impressions.
  4. `find_serp_competitors`, same 8 keywords — aggregate incumbent/domain view, which is what surfaced Pulse Academic's actual (faint) SERP presence outside the top-20 per-keyword check.
- OpenSEO's `whoami` reports `creditsRemaining: null` — this self-hosted instance bills DataForSEO directly with no exposed credit meter, so exact dollar spend cannot be read back from the tool. Based on DataForSEO's published Labs/SERP pricing for these endpoint types, this pass is roughly in the **$0.50-$2 range**, well under the $5 authorization. No further paid calls are recommended without a specific new question to answer (see Recommendation at the end).

## Gap: GA4 not connected for this OpenSEO project

New OpenSEO projects need GSC/GA4 connected per-project through the web UI; `local_noauth` does not auto-attach every Google property to every project. I created the Pulse Academic project but its GA4 pull returned ShortHand's property instead (still pointed at the old "Default" project). **This needs a one-time manual step**: open `http://localhost:3001/p/11c35bd0-16ee-470c-9b72-2708d683df13/settings/integrations` and connect `pulseacademic.com`'s GA4 property. GSC was available through the older `gsc-server` MCP tool directly (site-scoped, not project-scoped) and that data is real and used throughout this doc.

---

## Part 1: Pulse Academic's current GSC reality (source of truth, free data)

15 months of data (2025-06-01 to 2026-09-04), `sc-domain:pulseacademic.com`.

**Headline: real impressions across every requested concept cluster, essentially zero clicks anywhere except the homepage and one blog post.** This is not a demand problem, it's a ranking/visibility problem.

| Query | Impressions | Avg Position |
|---|---|---|
| formative assessment apps | 66 | 25.7 |
| student mastery | 54 | 31.2 |
| exit ticket app | 34 | 20.6 |
| reteaching | 26 | 38.6 |
| reteaching strategies | 17 | 47.6 |
| student.mastery (typo/brand-adjacent) | 19 | 32.7 |
| mastery tracker | 8 | 36.9 |
| small group planning | 7 | 42.4 |
| how to group students based on data | 7 | 37.1 |
| small group rotation schedule | 7 | 46.3 |
| exit ticket generator | 5 | 70.4 |
| ai exit ticket generator | 4 | 68.5 |
| classroom pulse (brand confusion, see Gaps) | 4 | 56.2 |

Zero clicks recorded on all of the above across the full 15-month window.

**Page-level performance** tells a more nuanced story: a handful of specific blog posts are ranking respectably even though the head terms aren't:

| Page | Impressions | Avg Position | Clicks |
|---|---|---|---|
| `/` (homepage) | 260 | 5.1 | 14 |
| `/blog/how-to-identify-students-who-need-reteaching` | 214 | 35.2 | 3 |
| `/blog/what-are-formative-assessments-exit-tickets` | 242 | 14.8 | 0 |
| `/blog/best-formative-assessment-apps-elementary-2026` | 154 | 16.4 | 0 |
| `/blog/exit-ticket-app-vs-paper-exit-tickets` | 153 | 19.6 | 1 |
| `/blog/how-to-plan-small-groups-quickly` | 123 | 38.3 | 0 |
| `/blog/how-to-track-student-mastery-lesson-by-lesson` | 254 | 28.4 | 1 |
| `/blog/finding-the-right-classroom-data-collection-app` | 101 | 23.1 | 2 |
| `/blog/clipboard-gap-student-understanding` | 29 | 8.7 | 0 |
| `/blog/what-to-do-with-exit-ticket-data` | 24 | 11.2 | 0 |

The homepage is the only page with a real click-through pattern (5.38% CTR at position 5.1). Several specific posts sit at page-1/page-2 boundary (positions 8-16) with real impressions but 0% CTR, meaning the content exists and Google trusts it enough to show it, but titles/snippets aren't earning the click, or the position is just below the fold.

**Brand confusion risk, already visible in the data**: queries like "classroom pulse," "pulse by kelvin," "pulse education," "pulse educator," "pulse.educator impact," "pulse student," "pulse grades," "pulse school" appear in Pulse Academic's own GSC data, most at very weak positions (54-92). These aren't Pulse Academic's brand terms; other "Pulse"-branded ed-tech products already occupy this naming space, and "classroom pulse" specifically overlaps with the (different, ShortHand-side) Classroom Pulse product name internally. Not a keyword opportunity; flagged so branding/positioning work doesn't accidentally chase noise.

---

## Part 2: External keyword data by cluster

### Exit tickets

| Keyword | US monthly volume | KD | CPC | Competition | Intent |
|---|---|---|---|---|---|
| exit ticket generator | 20 | 16 | — | 0 | informational |
| exit ticket app | 10 | 29 | — | 0 | navigational |
| ai exit ticket generator | 10 | — | — | 0.43 (MEDIUM) | informational |
| exit ticket questions | 260 | 0 | — | 0 | informational |
| exit ticket generator for teachers | 0 (no data) | — | — | — | — |
| exit ticket template (related, not seeded) | 1,300 | 3 | $0.22 | 0.5 | informational |

Low raw volume on the exact product-name terms, but this is the **cleanest SERP of the whole research pass** (see Part 3). "Exit ticket template" (1,300/mo) is a much bigger informational-intent adjacent term already ranking for small tool sites, worth noting as a possible funnel-top wedge even though it wasn't in the original seed list.

### Formative assessment

| Keyword | US monthly volume | KD | CPC | Competition | Intent |
|---|---|---|---|---|---|
| formative assessment app | 70 | 11 | $1.63 | 0.14 | informational |
| formative assessment software | 90 | 8 | $2.81 | 0.12 | informational |
| formative assessment tools for teachers | 40 | 36 | — | 0.03 | informational |
| quick formative assessment | 30 | 0 | $2.73 | 0.05 | informational |
| classroom formative assessment tools | 0 (no data) | — | — | — | — |

Seed expansion on "formative assessment app" surfaced real underlying demand: "formative assessment" itself is 27,100/mo, "summative vs formative assessment" 18,100/mo, but that's mostly students/ed-school informational traffic, not teacher tool-shopping traffic, and Google Classroom (11.1M) and Desmos (4.09M) dominate the raw seed purely as brand noise. The teacher-tool-shopping intent lives specifically in the exact phrases in the table above, which are lower volume but real.

### Checks for understanding

| Keyword | US monthly volume | KD | CPC | Competition | Intent |
|---|---|---|---|---|---|
| check for understanding | 1,000 | 0 | — | 0 | informational |
| checks for understanding | 390 | 0 | — | 0 | informational |
| check for understanding strategies | 170 | 0 | — | 0.01 | informational |
| quick checks for understanding | 20 | 31 | — | 0.02 | informational |

Real, meaningful, clean volume. 100% informational intent, 100% content-dominated SERP (see Part 3) — this is a pedagogy question teachers Google, not a product search.

### Mastery

| Keyword | US monthly volume | KD | CPC | Competition | Intent |
|---|---|---|---|---|---|
| student mastery | 6,600 | 0 | — | 0 (LOW) | informational |
| mastery tracker | 1,600 | 7 | $7.43 | 0.14 (LOW) | **navigational** |
| student mastery tracker | 20 | — | — | 0 | navigational |
| mastery tracker for teachers | 0 (no data) | — | — | — | — |
| track student mastery | 0 (no data) | — | — | — | — |

`mastery tracker` being labeled navigational is the single most important signal in this cluster: it means Google itself has decided this query is mostly people looking for a specific existing product (MasteryConnect), not people shopping a category. Confirmed directly in the SERP (Part 3). "student mastery" has real volume but almost the same problem: page 1 is entirely MasteryConnect/Instructure brand and support content.

### Reteaching

| Keyword | US monthly volume | KD | CPC | Competition | Intent |
|---|---|---|---|---|---|
| reteaching | 210 | 0 | — | 0 | informational |
| reteaching strategies | 70 | 0 | — | 0.05 | informational |
| reteaching activities | 30 | 0 | — | 0 | informational |
| students who need reteaching | 0 (no data) | — | — | — | — |

Low volume across the board, but this matches Pulse Academic's own best-performing page (`how-to-identify-students-who-need-reteaching`, 214 impressions, position 35.2) reasonably well as a topic match, if not an exact-phrase match. Seed expansion here was almost entirely useless (see Method note: "reiterate," "retort," "retch," "retouch app" — a lexical-similarity trap, not real query data, discarded).

### Small-group planning

| Keyword | US monthly volume | KD | CPC | Competition | Intent |
|---|---|---|---|---|---|
| small group instruction | 880 | 0 | — | 0.02 (LOW) | informational |
| small group planning | 110 | 0 | $2.55 | 0.67 (**HIGH**) | informational |
| small group planning for teachers | 0 (no data) | — | — | — | — |
| how to group students for small group instruction | 10 | — | — | 0 | informational |

"small group planning" is the only HIGH paid-competition term in the entire keyword set (0.67), but that's a paid-ads signal (advertisers bidding on it, likely TPT-style resource sellers and curriculum companies), not organic difficulty (KD is 0, LOW organic competition level). Per your instruction not to conflate the two: this term is organically winnable even though it would be expensive to run paid ads against.

### Not requested, discovered via seed expansion (kept only because they're real and on-topic)

- "exit ticket template" — 1,300/mo, KD 3, informational. Real adjacent demand, currently unaddressed by Pulse Academic's content.
- "mastery learning" — 590/mo, KD 3, informational. Pedagogy-concept term, could support a content wedge distinct from the brand-dominated "mastery tracker."
- "assessment strategies" — 320/mo, KD 13, informational. Broader umbrella term for the check-for-understanding cluster.

Everything else returned by the two "junk" seeds (student mastery tracker, reteaching strategies) was discarded as unrelated (clip art, "discover it student" credit card, "retouch app" photo editing, dictionary/synonym lookups). Flagging explicitly per your instruction: **do not treat these as evidence of anything.**

---

## Part 3: SERP reality for the 8 keywords worth checking

Checked live top-20 organic SERPs plus an aggregate cross-keyword competitor view for: `student mastery`, `mastery tracker`, `check for understanding`, `small group instruction`, `formative assessment app`, `reteaching strategies`, `exit ticket generator`, `small group planning`.

| Keyword | SERP composition | Incumbents | Pulse Academic present? | Winnable for a small site? |
|---|---|---|---|---|
| student mastery | MasteryConnect/Instructure brand + support docs + 1 content site (Sora Schools) | MasteryConnect (enterprise, Canvas-owned) | Yes, position 28 (per aggregate check, outside top-20) | **No.** Entrenched enterprise brand territory. |
| mastery tracker | Almost entirely MasteryConnect help docs, district IT pages, Canvas integration tutorials | MasteryConnect | Yes, position 37 | **No.** Explicitly navigational intent for one product. |
| check for understanding | 100% authority content (Edutopia, HMH, ASCD, university ed schools, TeachforAmerica) | None (no SaaS products rank at all) | Not in top-20 | Content-only play; a product page has no reason to rank here at all |
| small group instruction | 100% authority content (HMH, Edutopia, Lexia, Curriculum Associates blog) | Curriculum Associates, HMH, Lexia (all curriculum/edtech content marketing, not competing products) | Not in top-20 | Content-only play |
| formative assessment app | Formative/GoFormative (positions 2,3), Nearpod, Apple roundup, Edutopia listicle | Formative, Nearpod | Not in top-20 | **Partial.** Two large incumbents present, but the SERP isn't 100% monopolized; roundup/listicle spots exist |
| reteaching strategies | 100% authority content + individual teacher bloggers (Kristine Nannini, Student Centered World) | None (no SaaS) | Yes, position 39 | Content-only play, but individual teacher-blogger sites do rank here, meaning a credible teacher voice has a real shot |
| exit ticket generator | **Small tools and generators**: Slidesgo, QuestionWell, Canva, JotForm, Ziplet, Kuraplan, TeachMateAI, GradeWithAI | None dominant; fragmented field of small players | Not in top-20 | **Yes.** This is the one SERP shaped like "small teacher tool," not "authority content" or "enterprise brand." |
| small group planning | Authority content + individual teacher bloggers + TeachersPayTeachers | TeachersPayTeachers (marketplace, not a competing app) | Yes, position 38 | Content-only play; TPT indicates resource-purchase intent worth noting for positioning, not for SEO competition |

**Aggregate incumbent view** (`find_serp_competitors` across all 8): Edutopia has the widest footprint (6 of 8 keywords, mostly page-1), Instructure/MasteryConnect is the only true competing *product* with multi-keyword visibility, and Pulse Academic itself shows up in exactly 4 of the 8 keyword aggregates at positions 28-39, an existing but very faint foothold, not a null one.

---

## Part 4: Ranked opportunities

Ranked by demand × product fit × realistic ranking potential × current foothold × likelihood of attracting a real product-seeking user (not just informational traffic):

1. **Exit ticket generator / exit ticket template cluster.** Lower absolute volume than mastery or check-for-understanding, but the only SERP shaped like "small tool wins here," direct product fit (Pulse Academic already generates exit tickets), and zero enterprise incumbent to out-rank. Best combination of winnable + commercially relevant.
2. **Formative assessment app/software.** Real teacher-tool-shopping intent, moderate incumbent presence (Formative, Nearpod) but not a monopoly, decent CPC ($1.63-$2.81) confirming advertiser belief in commercial intent. Harder than #1 but still realistic with a genuinely good roundup-style or comparison page.
3. **Reteaching (topic, not exact-match).** Low volume, but Pulse Academic already has its best-performing content page here (214 impressions, page 3), individual teacher bloggers prove a credible non-enterprise voice can rank, and the topic maps directly to the product's "who needs reteaching" feature.
4. **Check for understanding.** Meaningful, clean volume (1,000+390+170/mo) and directly on-topic, but the SERP is a pure authority-content moat with zero product presence anywhere in top 20. Worth owning as a content/top-of-funnel wedge, not as a source of product-trial traffic.
5. **Small group planning/instruction.** Decent volume, LOW organic competition despite HIGH paid competition on the exact "small group planning" phrase, but again a content-only SERP. Useful supporting cluster, not a primary wedge.
6. **Student mastery / mastery tracker.** Real volume (especially "student mastery" at 6,600/mo) but ruled out: this keyword territory is owned outright by an enterprise incumbent (MasteryConnect/Instructure), and Google has already classified "mastery tracker" as navigational to that specific product. Chasing this would mean fighting Canvas's marketing budget for a term Google doesn't think is generic. **Not recommended as an acquisition target**, regardless of demand.

---

## Answers

### A. Does the external keyword/SERP evidence strengthen or weaken the case for relaunching Pulse Academic?

**Strengthens it, with a caveat.** The demand is real and broad: every requested concept cluster shows measurable US search volume and real GSC impressions, meaning teachers are actually searching in this space and Google is already showing Pulse Academic's existing content for some of it. This confirms your read that the 2026 pause was a time-allocation decision, not a demand verdict; there's no evidence here that the category is dead or synthetic.

The caveat: the demand is unevenly winnable. Two of the six requested clusters (mastery, and to a lesser extent formative-assessment-as-a-whole-category) are shaped by entrenched enterprise incumbents or brand-navigational intent that a solo-teacher-founder site cannot out-rank through content or product SEO alone. The other four clusters (exit tickets, check-for-understanding, reteaching, small-group) are realistically winnable, but mostly as content/authority plays rather than direct "product discovery" traffic, except for exit-ticket generator specifically, which is the one SERP where small standalone tools are winning today.

### B. What are the top 3 acquisition wedges?

1. **Exit ticket generator/template** (the only tool-shaped, incumbent-free SERP; direct product fit)
2. **Formative assessment app comparisons** (real commercial intent, moderate but not insurmountable incumbents, matches an existing decent-performing page: `best-formative-assessment-apps-elementary-2026`, already at position 16.4 with 154 impressions)
3. **Reteaching** as a content/authority wedge feeding product trial (matches the site's actual best-performing page today, low competition, credible as an individual-voice topic)

### C. Which language should Pulse Academic use in positioning versus SEO?

**Positioning** (product page, app copy, pitch) should keep the current framing: in-the-moment lesson mastery, who "got it" vs. "almost there" vs. "needs help," fast checks for understanding, and reteaching triggered by real data. This is differentiated and concrete.

**SEO** should deliberately avoid leaning on "mastery tracker" or "student mastery" as primary target keywords or on-page H1s, since Google has already sorted that language into MasteryConnect's brand territory; using it prominently risks confusing users and wasting content effort against unwinnable SERPs. Prefer "exit ticket," "formative assessment," "check for understanding," and "reteaching" as the external-facing SEO vocabulary, reserving "mastery" as a supporting/internal-page term rather than a primary keyword target.

### D. Which existing pages should be improved rather than creating new content?

These already have real impressions and page-1/2-adjacent positions but 0% CTR, meaning the fastest wins are title/snippet/meta-description rewrites, not new content:

- `/blog/what-are-formative-assessments-exit-tickets` (242 impressions, position 14.8, 0 clicks)
- `/blog/best-formative-assessment-apps-elementary-2026` (154 impressions, position 16.4, 0 clicks)
- `/blog/how-to-track-student-mastery-lesson-by-lesson` (254 impressions, position 28.4, 1 click) — reposition away from "mastery" terminology per (C) above, toward exit-ticket/formative-assessment framing, since the page is already ranking on adjacent terms
- `/blog/clipboard-gap-student-understanding` (29 impressions, position 8.7, 0 clicks) — genuinely close to page 1, worth a title/CTA pass first before writing anything new
- `/blog/how-to-plan-small-groups-quickly` (123 impressions, position 38.3, 0 clicks)

### E. Top 5 content/tool opportunities

1. **An actual free exit-ticket generator tool** (not just a blog post) — matches the one SERP shown to reward small standalone tools; direct analog to what worked for ShortHand's own free-tools strategy
2. **A "best formative assessment apps" comparison/roundup post refresh**, positioning Pulse Academic honestly alongside Formative/Nearpod (the ShortHand playbook of honest-comparison posts, e.g. `best-classdojo-alternatives-2026`, is directly reusable here)
3. **An "exit ticket template" library/download page** — 1,300/mo adjacent term, currently entirely unaddressed, low KD (3)
4. **A deeper reteaching content cluster** built on the existing best-performing page, written in the same credible teacher-first voice that's winning that SERP for individual bloggers
5. **A small-group planning template/tool**, given LOW organic difficulty despite HIGH paid competition, a sign of real unmet demand that paid advertisers already believe in

### F. Smallest relaunch/validation experiment before meaningful development

Given the product is "mostly-built" already, the smallest real test is: **fix the CTR problem on the 3-5 pages above (title/meta/snippet rewrites only, a few hours of work, zero development) and watch 2-4 weeks of GSC data.** These pages already have Google's trust (real impressions, decent positions) but are earning zero clicks, which is a solvable, cheap, fast, and fully reversible experiment that requires no code changes to the product itself and would directly validate or invalidate whether "people who see this in search will click through" before spending any development time on new features or tools.

If that CTR fix produces real click-through and even a handful of signups from the existing paused product, that's strong evidence to invest further (the exit-ticket generator tool, from E above, would be the next step). If it doesn't move at all, that's useful negative evidence collected for the cost of a few hours, not a re-launch.

---

*Research conducted 2026-09-07 using OpenSEO (self-hosted DataForSEO integration) and the gsc-server MCP against live `sc-domain:pulseacademic.com` GSC data. No Pulse Academic or ShortHand code/content modified.*
