# Report Card Comment Library — Session Handoff

**Last updated:** 2026-07-28
**Status:** Step 6 in progress. Behavior complete (145). ADHD complete (57).
Preschool complete (92). Library at 301.
**Next task:** Academics content map. The final-target question is **resolved**
(§12): the projected 371-401 sits inside both approved bands, and the approved
per-section targets are unchanged.

---

## 1. Product context

A $4.99 one-time-purchase static comment library, separate from the free
`/report-card-comment-generator`. The goal is Greg's first real paid ShortHand
sale, not revenue maximization. One real stranger paying $4.99 is the success
condition.

**Sources of truth (read before changing scope or schema):**

- `Brain/Report Card Comment Library - Product Decision.md` — scope, price, what is NOT in V1
- `Brain/Report Card Comment Library - V1 Schema.md` — record shape, categories, §7 content style guide

Brain path: `C:\Users\doubl\GOOGLE DRIVE\My Drive\Google AI Studio\ShortHand\Brain\`

Payment provider is **Stripe** (decided 2026-07-22). Not yet integrated. Out of
scope until the library content is done.

**Explicitly NOT in V1:** accounts, saved favorites, rosters, batch/bulk
workflows, AI generation, complex export formats, subscriptions, tiers.

---

## 2. Branch and files

**Branch:** `feature/report-card-comment-library-prototype` (NOT merged to main)

**Latest commit:** `22f6d7c` Report Card Comment Library: update handoff for
Preschool completion. Not pushed, not merged, no deploy. Branch is 4 commits
ahead of its remote and 5 ahead of `origin/main`.

| File | Role |
|---|---|
| `lib/report-card-comments.ts` | Schema types, `CATEGORIES_BY_SECTION`, all comment data |
| `app/report-card-comment-library/page.tsx` | Route wrapper, noindex |
| `app/report-card-comment-library/LibraryClient.tsx` | All UI: tabs, filters, search, personalization, edit, copy |

The route is not linked from anywhere on the site yet.

**Working tree is clean** (verified 2026-07-28). Step 5 fixes and all Step 6
content through Preschool are committed.

---

## 3. Steps 1-5 (complete)

1. **Decision memo** — approved 2026-07-22
2. **Schema design** — approved 2026-07-22, three revisions folded in
3. **~20 sample comments** — approved 2026-07-22 after three revision passes; these are the style model
4. **One-pass prototype** — built 2026-07-22, Playwright-verified (12/12 checks)
5. **Confirmation review pass** — completed 2026-07-28. Three fixes:
   - **Name capitalization:** lowercase input now auto-capitalizes in preview and copy, via `capitalizeName()` using `\p{L}+` so hyphenated and multi-word names work ("mary jane" → "Mary Jane").
   - **Stale-edit bug (correctness):** editing a comment used to freeze the student name into it permanently. A teacher moving through a roster could copy student #1's name onto student #2's report card. Fixed by resetting `dirty` when the `name` prop changes (`dirtyForName` state + set-during-render reset).
   - **Explanatory note** added under the name field: "Changing the student name resets any edited comments."
   - Deliberately NOT changed: the preschool section-tab vs. preschool grade-band overlap. It is intentional per schema §1/§2.

---

## 4. Step 6 workflow (the approved loop)

Greg switched the session to **Opus** for this step because content quality,
category boundaries, and duplicate prevention matter more than token cost.

**Do not generate the whole library in one pass.** For each category:

1. **Propose a content map** (read-only) — distinct situations/skills per category with approximate counts. Wait for approval.
2. **Draft one batch**, roughly 14-22 comments. Do not write to the data file.
3. **Self-audit the batch** against the style guide, section boundaries, and all previously approved comments. Explicitly flag near-duplicates, vague wording, invented interventions or progress, diagnosis language, absolutes, and repeated sentence structures.
4. **Greg reviews and returns targeted revisions.** He revises heavily; expect 4-9 changes per batch.
5. **Apply revisions, re-audit only the changed comments**, then write to the data file.
6. **Run typecheck + the audit scripts**, report exact totals derived from the data.

**Rules that govern the loop:**

- **Human review before writing.** Never add a batch to the data file before Greg approves it.
- **Derive all audit counts from the data, never by hand.** Greg caught two manual miscounts; counts now come from scripts.
- **Do not pad to hit a number.** Stop when new comments restate existing ones. 450 is not a hard ceiling (~480 is fine if genuinely distinct), and coming in under a section target is acceptable and should be reported honestly.
- **Do not mirror every positive into a growth comment.** Pair only when both tones carry genuinely different observational weight.
- **When the mirroring rule cuts a comment, first look for a genuinely distinct situation to replace it**, rather than assuming the section must shrink.
- **Do not add a new category to close a numerical gap.** A new category requires a genuinely distinct body of content.

---

## 5. Locked schema

```ts
type Section = 'behavior' | 'adhd' | 'preschool' | 'academics' | 'social-emotional';
type Tone = 'positive' | 'growth';
type GradeBand = 'preschool' | 'k-2' | '3-5' | 'middle-upper';

interface Comment {
  id: string;               // "behavior-positive-self-control-01", never reused
  section: Section;
  category: CategoryFor<Section>;  // must belong to its own section
  tone: Tone;
  gradeBands: GradeBand[];
  text: string;             // uses the literal [Student] token
}
```

All four classification fields are closed types derived from
`CATEGORIES_BY_SECTION`. A misspelled category is a build error, which is why
**the typecheck is the real validation step**, not a formality.

**ID convention:** `{section}-{tone}-{category}-{NN}`, zero-padded, sequential
within each section+tone+category combination.

**Personalization:** `[Student]` is the stored token. Preview shows "Jordan"
when no name is entered. Copy-time fallback to "the student" only if a name was
never entered.

---

## 6. Content style guide (schema §7, all 9 rules)

1. Professional, observable, family-facing language. Write for the parent.
2. No diagnosing or implying a diagnosis, especially in the ADHD section.
3. **The line is invented backstory/results, not specificity.** Fine: "benefits from brief breaks," "keeps materials organized." Not fine: "since starting a color-coded folder system," "has reduced missing work," "a timer solved the problem."
4. No comparisons with classmates.
5. No unsupportable absolutes ("always," "never," "hardest"). **But confident, warm phrasing is not an absolute.** Do not flatten "tries again rather than give up."
6. Gender-neutral they/their for any second reference.
7. Specific enough to be useful, broad enough to copy honestly.
8. Growth comments name the developing skill; a broadly applicable support is allowed, a named tool or claimed result is not.
9. No near-duplicates that differ only in adjectives.

**Guardrail:** the goal is a trustworthy library, not a maximally hedged one. If
a revision pass is making every comment more tentative or generic, the guide is
being over-applied.

**Project rule:** no em dashes anywhere in user-facing text. The audit script
checks this automatically.

### The observed-versus-possible support rule (established during ADHD, applies library-wide)

Any comment naming a support must be one of two forms, and the wording is not
interchangeable:

- **Observed support** (the teacher has seen it work for this student): direct
  wording. "Attention is steadier with a brief check-in partway through a task."
  "Identifying a clear first step helps them begin."
- **Possible support** (a strategy being proposed, not reported): conditional
  wording. "Dividing a task into shorter segments **may support** this."
  "More frequent movement opportunities **might help**."

Positive comments lean observed, because the teacher is reporting what happened.
**A positive comment must never use conditional support wording** (audited: 0 in
ADHD). Growth comments use both, but a growth comment proposing a strategy the
teacher has not seen work must be conditional.

This is what lets the library name supports at all without violating style rule
3 (no invented interventions or claimed results).

**Vary the conditional construction from the start.** "May support this" alone
reached 50% of ADHD growth comments before being deliberately varied ("could
help," "might help," restructured sentences), ending at 25%. Do not let a single
modal phrase dominate a section and defer the fix.

### Additional wording rules Greg established during Step 6

These came out of batch reviews and are not in the schema doc yet:

- Do not infer internal states. Write the observable behavior. ("understands directions" → "follows directions"; "takes pride in" → "completes with care and is eager to share")
- Do not claim an effect on others ("in a way others can follow", "helps the whole class").
- Do not predict an outcome that has not been observed ("would help them catch missed steps").
- Do not characterize another student ("a struggling classmate", "a provoking peer"). Name the situation instead.
- Do not imply popularity, being in charge, or having classmates follow them.
- Do not praise compliance, speed, volume, confidence, extroversion, perfectionism, or overwork.
- Do not use neatness or presentation as a proxy for effort.
- Do not assume which subjects a student prefers in a positive comment.
- Avoid overusing "the first time," "without reminders," "listens carefully."
- Asking for help must never read as a weakness. Include comments where recognizing the need for help is a strength.
- A quiet student must have honestly positive participation comments available. Listening and written contribution are real participation, not consolation prizes.

---

## 7. Behavior section — COMPLETE (145 comments, 8 categories)

| Category | Total | Positive | Growth |
|---|---|---|---|
| peer-relationships | 22 | 13 | 9 |
| self-control | 21 | 11 | 10 |
| effort-and-motivation | 20 | 11 | 9 |
| participation | 19 | 10 | 9 |
| independence | 18 | 9 | 9 |
| focus-and-attention | 16 | 8 | 8 |
| following-directions | 15 | 8 | 7 |
| leadership | 14 | 8 | 6 |
| **TOTAL** | **145** | **78** | **67** |

Target was 150-200. **145 was accepted deliberately**, not padded. Greg and
Claude agreed distinctness beats a round number.

**Grade band coverage within behavior:** 3-5 = 135, middle-upper = 104, k-2 = 88,
preschool = 20. **Do not try to equalize these.** The dedicated Preschool section
carries preschool content, and some imbalance is developmentally appropriate
(self-control skews young, leadership skews old).

### Structural variety pass (completed 2026-07-28)

An audit found 88% of behavior growth comments used one of eight stock frames,
with "[Student] is working on X" alone accounting for 30. Twelve comments were
reworded (content, tone, category, and grade bands all preserved).

Result: stock-frame share **88% → 73%**; "is working on" openings **31 → 23**;
varied structures **8 → 18**. Both cross-category near-duplicate pairs resolved;
the detector now returns **zero** pairs above 0.40 similarity in behavior.

**Deliberately stopped there.** Frame A still holds 22 comments and the three
stock closers hold 24, but they are now spread thinly rather than clustered.
**These are deferred to a whole-library structural review after all sections are
drafted**, so the same formulas can be thinned once, coordinated, rather than
piecemeal.

**Deferred content ideas (do NOT add while drafting other sections):**
specials/substitutes/different-adult contexts, unstructured settings (recess,
hallway, lunch), digital/device conduct, preschool-appropriate participation.
Evaluate these only after the full library exists.

---

## 7a. ADHD section — COMPLETE (57 comments, 5 categories)

| Category | Total | Positive | Growth |
|---|---|---|---|
| attention-and-focus | 15 | 9 | 6 |
| task-completion | 12 | 7 | 5 |
| organization | 12 | 7 | 5 |
| self-regulation-strategies | 10 | 6 | 4 |
| impulse-control | 8 | 4 | 4 |
| **TOTAL** | **57** | **33** | **24** |

Target was 60-80. **57 was accepted deliberately, not padded.** The approved map
planned 66; nine were lost to consolidation and guardrail-driven cuts, every one
of them Greg-directed. Padding to 60 was explicitly declined.

**Grade bands:** 3-5 = 57, middle-upper = 53, k-2 = 33, preschool = 0.
Preschool is intentionally zero (the Preschool section owns that band, and
due-date/assignment tracking is not a preschool concept).

**Audit result:** zero near-duplicate pairs at >=0.35 similarity, both within
ADHD and against the entire rest of the library. That threshold is stricter than
the >=0.40 used on behavior.

### Category boundaries settled during the ADHD build

| Category | Owns |
|---|---|
| attention-and-focus | Whether attention is sustained or regained, as a recurring pattern |
| impulse-control | Acting, speaking, or moving before pausing, across situations |
| organization | Workable systems for materials, papers, assignments, due dates, unfinished work |
| task-completion | Whether work is begun, finished, resumed, and submitted across assignments |
| self-regulation-strategies | Recognizing a need and selecting, requesting, or using a strategy |

Worked distinctions:

- Task initiation appears in **task-completion** only as a recurring pattern
  across assignments, never as one isolated slow start (that is
  `behavior/independence`).
- Starting *too fast*, before reviewing the task, is **impulse-control**, not
  task-completion.
- Work never finished (**task-completion growth-02**) is kept distinct from work
  completed but not submitted (**growth-03**). Different failure points.
- Misplaced papers (**organization**) is distinct from unsubmitted completed work
  (**task-completion**).
- Recording assignments, due dates, and outstanding work were consolidated into
  **one** organization concept in two tones, not three near-duplicate entries.
- "Returning to learning after using a strategy" lives in
  `adhd-positive-impulse-control-03`, deliberately not duplicated in
  self-regulation-strategies.
- Multi-day project *effort* is `behavior/effort-and-motivation`; multi-day
  project *organization* is `adhd/organization`.

### Content guardrails established during the ADHD build

These came out of Greg's batch reviews and apply to future sections:

- Do not equate organization with a neat desk or tidy folders. A system can look
  unconventional and still work. Measure whether the student can locate
  materials, identify what needs attention, and move work through the steps.
- Do not frame impulsivity as disrespect, defiance, carelessness, or character.
- Do not treat stillness, silence, or immediate compliance as the ideal, and do
  not praise a student merely for being quiet or seated.
- Movement comments focus on using appropriate opportunities and returning to
  learning, never on suppressing movement.
- Do not treat unfinished work as laziness or lack of caring.
- Do not praise overwork, perfectionism, rigid systems, or working beyond the
  expected time.
- Do not praise compliance with adult support. Asking for help, movement, space,
  or a break is self-advocacy, not dependence.
- Growth comments must not blame a student for failing to recognize a need
  before becoming overwhelmed.
- Do not imply families are responsible when materials do not travel between
  home and school.
- Do not assume a specific classroom system exists (no signal system, break
  spot, seating menu, or chart as an established fixture).
- Avoid naming specialized or clinical tools.
- A positive comment must describe a real strength or growing self-management
  skill, not merely the absence of a problem.

### Known thin spots (reported, deliberately not filled)

1. **Growth is lighter than positive in every category** (24 vs 33). Most
   pronounced in attention-and-focus (9/6). A teacher writing about a documented
   challenge likely reaches for growth comments more often, so this is the
   imbalance most likely to be felt in real use.
2. **k-2 coverage is 33 of 57 (58%)**, skewing toward 3-5 and middle-upper.
   Developmentally right for organization and task-completion, less obviously
   right for attention-and-focus and impulse-control.
3. **impulse-control at 8** is the smallest category and lost the most during
   review. If any ADHD category warrants a later revisit, it is this one.

---

## 7b. Preschool section — COMPLETE (92 comments, 6 categories)

| Category | Total | Positive | Growth |
|---|---|---|---|
| social-emotional-development | 16 | 9 | 7 |
| self-help-skills | 16 | 9 | 7 |
| play-and-cooperation | 16 | 9 | 7 |
| early-literacy | 16 | 9 | 7 |
| early-math | 14 | 8 | 6 |
| gross-and-fine-motor | 14 | 8 | 6 |
| **TOTAL** | **92** | **52** | **40** |

Target was 80-100. **92 hit the approved map exactly**, the first section to do
so. 88 new comments plus four Step 3 samples revised in place.

**Grade bands:** preschool = 92, all others 0. This is correct and deliberate.

**Tone split is 57/43 positive**, a deliberate positive skew approved at map
time. At this age many "growth" items are normal developmental acquisition, and
a heavy growth column reads as deficit framing for a four-year-old. The
countervailing risk Greg named: positive comments must still name a specific
observable skill, never become praise filler.

**Audit result:** one near-duplicate pair at 0.38 (the fastener pair, reviewed
and approved as an ordinary positive/growth pairing). **Zero** against the
entire rest of the library, including all 20 preschool-band behavior comments.
Zero of 52 positive comments use conditional support wording.

### The four Step 3 samples were revised in place

Step 3 approval was treated as approval of the *situations*, not permanent
protection of wording that predates the house style. IDs, categories, tones, and
grade bands preserved. What was removed: named tools ("playdough and tongs"),
time-of-day framing ("During story time," "at pickup time"), inferred internal
states ("gets excited every time"), compliance framing ("without being
reminded"), unsupported claims ("would help build hand strength"), and
turn-taking language that crossed into Behavior's lane.

**Apply the same rule to the remaining Academics (4) and Social-Emotional (3)
samples.** They have the same provenance and the same problems.

### Category boundaries settled during the Preschool build

| Category | Owns |
|---|---|
| social-emotional-development | First acquisition of a social-emotional skill |
| self-help-skills | Dressing, toileting, meals, belongings, cleanup as a physical sequence |
| play-and-cooperation | The nature of play itself: entering, sustaining, negotiating, recovering |
| early-literacy | Letters, sounds, name writing, print concepts, read-aloud, retell, predict, rhyme |
| early-math | Rote counting, one-to-one correspondence, numerals, sorting, patterns, shapes, spatial words, quantity |
| gross-and-fine-motor | Hand control outside the eating routine, plus climbing, balance, ball skills, spatial navigation |

Worked distinctions:

- **Rote counting** (saying the sequence) and **one-to-one correspondence**
  (one number per object) are separate skills and must not be merged. A draft
  that said "counts in order to a growing number of objects" collapsed them and
  was caught in review.
- **Sorting** is about what belongs together; **quantity comparison** is about
  which group has more, fewer, or the same. Both involve groups of objects.
- **Meal utensils are self-help-skills**, not motor. Motor owns hand control in
  drawing, cutting, building, and manipulating.
- **Cleanup is the physical sequence**, not obeying a cleanup direction. That
  keeps it clear of `behavior/independence` (classroom routines).
- **Group games measure understanding the structure**, not rule obedience,
  waiting, or impulse control.
- **Body awareness is navigating space** (stopping, changing direction,
  avoiding obstacles), never personal space or hands-to-self, which are
  `behavior/self-control`.
- **Recovery in play** is returning to the activity or trying a new idea, not
  emotional regulation broadly.

### Content guardrails established during the Preschool build

- Parallel play is not deficient by default. A growth comment framing it as a
  gap needs explicit evidence that shared play is the current instructional
  goal.
- Independent play and independent book use are legitimate positive skills, not
  lower stages that must progress toward group activity. Both were left
  unpaired deliberately.
- "Trying independently first" must never imply that asking for help sooner is a
  weakness.
- Toileting stays neutral, private, and brief. Two comments, routine-framed, no
  accident language, no clinical terms.
- Meals cover containers, utensils, feeding, and cleanup, never quantity eaten
  or food preferences.
- Name writing is letter formation, never handwriting neatness.
- Read-aloud comments describe attending, commenting, answering, connecting.
  Never "loves books" or "enjoys stories."
- Retelling (known events) and prediction (clues suggesting what comes next) are
  distinct and must not blend.
- Drawing describes observable control or representation, never artistic talent,
  and never whether another person can recognize the picture.
- Do not make speed, memorization, or answering correctly-and-quickly the
  success criterion in early-math.
- Avoid claims about strength, coordination, or developmental progress a teacher
  cannot directly observe. Describe the action.
- Supports stay classroom-based. Home-practice prescriptions appear exactly once
  library-wide (self-help growth-03) and should not be repeated.

### Deliberately unwritten (do NOT add later to hit a number)

Four mapped situations were left uncovered because every draft was either filler
or a near-duplicate: **vocabulary** and **independent book choice**
(early-literacy), **nonstandard measurement** (early-math), and **running**
(gross-and-fine-motor). The map identifies possible ground, not a checklist that
overrides quality.

### Repeated frames: measured, deliberately not fixed

| Frame | Count | Share of 40 growth |
|---|---|---|
| `[Student] is learning to` | 5 | 13% |
| `and is beginning to` | 5 | 13% |
| `is a skill [Student] is` | 3 | 8% |
| `is difficult for [Student]` | 3 | 8% |

Openings are 62% `[Student]`-initial with 32 distinct non-`[Student]` openings,
none appearing more than twice. No repeated growth closers at all.

**All four frames are left alone deliberately.** At 13% or below this is
cosmetic churn, and they belong in the deferred whole-library structural review
(§11) alongside behavior's frame A and ADHD's `[Student]` concentration, so the
same formulas get thinned once, coordinated.

**Process lesson worth carrying:** `[Student] is learning to` was capped
mid-section, and `and is beginning to` then accumulated to the same count
unwatched. Steering away from one frame concentrates another. Track the whole
frame distribution, not just the one currently being avoided. The same thing
happened with conditionals: avoiding "may support this" pushed "could help" to
the top spot.

---

## 8. Boundary decisions (hard-won, apply them)

**CORRECTED 2026-07-28 (during the ADHD build).** The earlier framing said
behavior comments carry no support clauses. That was wrong and is superseded:

- **The real axis is bounded-situation vs. recurring-pattern.**
  `behavior/*` describes a bounded classroom situation or skill.
  `adhd` describes a recurring pattern, strategy, or support condition **across**
  situations.
- **Behavior comments are not forbidden from mentioning supports.** Support
  language is a common *consequence* of the recurring-pattern lane, not the test
  for it.
- **Do not add support language merely to make a behavior-like comment qualify
  for ADHD.** If a comment describes one bounded situation, it belongs in
  behavior no matter how the support clause is worded.

Applied concretely between `behavior/focus-and-attention` and `adhd`:

- **`behavior/focus-and-attention`** = attention during a **specific** task, subject, setting, or time of day.
- **`adhd` section** = a **broader or recurring** attention/executive-function pattern.

All 16 behavior/focus-and-attention comments already exist and are scoped to
named settings. The ADHD section must occupy the recurring-pattern-and-supports
lane **without restating them**. Six candidates were cut from that category
specifically because they belonged to ADHD: "needs frequent check-ins to stay on
task" (recurring pattern) and "benefits from a quiet workspace" (names a
support) are the two clearest examples of what ADHD should now cover.

Other locked boundaries:

| Category | Owns |
|---|---|
| self-control | Regulating an impulse or reaction in an emotionally charged moment |
| focus-and-attention | Staying mentally engaged with a task or lesson |
| following-directions | Understanding, remembering, clarifying, carrying out an instruction |
| independence | Starting, managing, checking, completing work; materials, time, routines, help-seeking |
| participation | Contributing to instruction, discussion, shared learning |
| leadership | Guiding, coordinating, modeling, advocating, taking responsibility |
| peer-relationships | Cooperation and reciprocity with classmates |
| effort-and-motivation | Willingness, persistence, investment, response to feedback |

Worked examples of the fine distinctions:

- "adjusts when plans change" = **self-control** (emotional response); "adjusts when a procedure changes" = **following-directions** (procedural update).
- "begins work when an activity starts" = **independence**; a comment about the gap between directions ending and work starting was **cut** as too narrow to justify against it.
- "listens as much as they contribute" = **peer-relationships** (reciprocity); "listens and builds on what classmates said" = **participation** (shared learning).
- "classroom responsibilities" = **leadership** (duty to the class), not independence (own work).
- "rereads the directions before asking for help" = **following-directions**; "tries a strategy before asking" = **independence**.

---

## 9. Reusable audit scripts

Location: the session scratchpad. **Recreate them if missing** (they are
read-only analysis tools, not repo files). They live in whatever the current
session's scratchpad path is; recreating is faster than hunting for the old one.

| Script | Checks |
|---|---|
| `audit-comments.mjs` | Totals by section/category/tone, grade-band coverage, **duplicate IDs**, **duplicate texts**, **missing `[Student]` token**, **em/en dashes**, **ID convention + sequential numbering**, **locked-but-unpopulated categories**, and a parse-count vs. raw-count check that catches malformed records |
| `section-audit.mjs` | Takes a section name. **Jaccard near-duplicates within the section AND against the entire rest of the library** (>=0.35), support-language breakdown (conditional vs observed vs none, plus a check that no positive comment uses conditional wording), opening-structure buckets, growth-closer frequency, repeated 4-grams, per-category grade bands |
| `dump.mjs` | Takes `section` or `section/category` filters. Prints full text by tone with grade bands. Use before drafting to read the adjacent categories you must not restate |

**Do not count anything by hand.** Greg has caught manual miscounts twice, and
one missing `[Student]` token reached his review because a batch was
hand-audited. Run the scripts.

### Structural classification rule

When bucketing opening structures, **every opening beginning with `[Student]`
goes in one bucket**, including possessive forms (`[Student]'s`). Splitting them
understates concentration.

**Standard verification after every batch:**

```bash
npx tsc --noEmit -p tsconfig.json 2>&1 | grep -i "report-card-comments\|LibraryClient"
grep -o "id: '[^']*'" lib/report-card-comments.ts | sort | uniq -d   # duplicate IDs
node <scratchpad>/audit-comments.mjs
```

Greg handles browser testing himself. Only ask him to test when a change is
technically risky or a regression is suspected.

---

## 10. Library status: 301 comments

| Section | Populated | Target | Categories locked | Categories populated | Status |
|---|---|---|---|---|---|
| behavior | **145** | 150-200 | 8 | 8 | COMPLETE |
| adhd | **57** | 60-80 | 5 | 5 | COMPLETE |
| preschool | **92** | 80-100 | 6 | 6 | COMPLETE |
| academics | 4 | 40-60 | 4 | 4 | next |
| social-emotional | 3 | 30-40 | 4 | 3 | pending |
| **TOTAL** | **301** | see §12 | 27 | 26 | |

**Remaining: Academics (40-60), Social-Emotional (30-40).** The academics and
social-emotional counts above are the original Step 3 sample comments only, and
both sets need the same in-place revision the four preschool samples got (§7b).

Behavior and ADHD came in **under** target (145 vs 150-200, 57 vs 60-80),
Preschool hit its map exactly (92). All three were accepted deliberately. Do not
retroactively pad any of them.

### Verify the category list against the schema, not the data

Locked categories with zero comments are expected, not a bug: they are an
artifact of Step 3 sampling. `adhd/task-completion` was the first case and is
now populated. Still outstanding:

| Section | Locked but currently unpopulated |
|---|---|
| social-emotional | `self-awareness` |

This is now the **only** unpopulated category left in the library.

**At the start of each section, read `CATEGORIES_BY_SECTION` in
`lib/report-card-comments.ts` directly.** Never infer a section's category list
from what already has comments. The audit script reports this automatically
under "locked but unpopulated categories."

Schema §2 guidance for preschool: roughly even across all 6 categories is
plausible, since all are genuinely core to the age band. Section total is the
tracked target, not per-category quotas.

---

## 11. Next steps

**§12 is resolved.** The approved targets stand unchanged: Academics 40-60,
Social-Emotional 30-40. Do not expand either to chase a total.

Remaining content: **academics (40-60), social-emotional (30-40)**, roughly
70-100 comments. Follow the §4 workflow exactly: content map first, wait for
approval, then one category at a time with a self-audit before each write.

Then, in order:

1. **Whole-library structural review (deferred).** Three known clusters to thin
   in one coordinated pass, not piecemeal:
   - **Behavior:** frame A still holds 22 comments and three stock closers hold
     24. Stock-frame share is 73% after the first pass.
   - **ADHD:** `[Student]` openings at 56% of 57; "may support this" at 6 of 24
     growth comments, all concentrated in task-completion and organization
     (drafted before the vary-the-conditional rule was established).
   - **Preschool:** four frames at 13% or below of 40 growth comments (§7b).
   Do not fix any of them piecemeal while drafting new sections.
2. Evaluate the deferred content ideas from §7
3. Decide whether behavior's 145 and ADHD's 57 stand as final
4. Update `Brain/Report Card Comment Library - V1 Schema.md` §10 revision log
   with the Step 6 content decisions, the observed-versus-possible support rule
   (§6), the corrected boundary rule (§8), and the ADHD guardrails (§7a)
5. Commit the branch, open the PR (this route is `.tsx`, so it is
   **branch-and-wait**, never self-merge)
6. Stripe integration, gating, checkout

---

## 12. RESOLVED: the final-target math (no gap exists)

**Raised 2026-07-28 by Greg, after Preschool completed. Answer this before
drafting Academics.**

The arithmetic:

| | |
|---|---|
| Current library | **301** |
| Academics target | 40-60 |
| Social-Emotional target | 30-40 |
| **Projected final total** | **371-401** |
| Target as stated in this handoff (DISPROVEN, see below) | ~450-480 |
| **Apparent gap** | **49-109 comments** |

The three completed sections are not the cause. Behavior (145) and ADHD (57)
came in under target and Preschool (92) hit its map, but even at the **top** of
every remaining range the library lands at 401, still 49 short of 450.

**Do NOT close this gap by quietly expanding Academics or Social-Emotional.**
That would reintroduce exactly the padding this project has refused at every
step, and it contradicts the standing rule that section totals are need-based.

### Checked against both source docs 2026-07-28, same session

Possibility 1 is confirmed. **The "~450-480" figure is drift and was never an
approved number.** Neither source doc contains it:

| Source | Stated overall target |
|---|---|
| `Report Card Comment Library - Product Decision.md`, "Content target" | "Approximately **350-450** genuinely distinct comments" |
| `Report Card Comment Library - V1 Schema.md` §2, sum of the five per-section ranges (150-200, 60-80, 80-100, 40-60, 30-40) | **360-480** |

Schema §2 also explicitly warns against the arithmetic that produces an inflated
number: an earlier draft multiplied 27 categories by 15-20 each, reached 405-540,
and was corrected precisely because it was "quietly over target, and worse, an
incentive to pad narrow categories."

**Resolution: the projected 371-401 sits inside both approved bands.** It clears
the Product Decision's 350-450 and sits inside Schema §2's 360-480. There is no
gap and nothing to make up. The apparent 49-109 shortfall was measured against a
number that does not exist in any approved document.

**Consequences:**

- Academics stays at 40-60 and Social-Emotional at 30-40. Do not expand either
  to chase a total.
- The tracked target is **350-450** (Product Decision, the source of truth for
  scope). Every "~450-480" reference in this handoff has been corrected.
- If a section again appears to fall short, check the figure against the Product
  Decision doc before treating it as a gap. This is the second time a derived
  number has drifted upward and created phantom scope.

Greg still owns the final call on whether 371-401 is the right landing place. The
point resolved here is narrower: **there is no arithmetic problem to solve, so no
padding is warranted.**
