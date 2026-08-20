# Report Card Comment Library — Session Handoff

**Last updated:** 2026-07-29
**Status:** Content COMPLETE (374 comments, 27 categories, 5 sections). **PR #7
merged.** Library is live and hidden (`noindex`, unlinked). **Stripe integration
IN PROGRESS** on branch `feature/report-card-comment-library-stripe` — see §13,
§14, and §15, which together are the authoritative record for all payment work.
Content sections §1-§12 below are historical and complete; do not reopen them.

**Where the payment work actually stands:** the Supabase Edge Functions (§13),
the Vercel-side access gate (§14), and the restore-confirm route plus refresh
abuse protection (§15) are all built, committed, pushed, deployed, and
**proven end to end by a real Stripe test-mode purchase (§16, 2026-07-29)**:
checkout completed, webhook signature verified, exactly one paid row created at
$4.99, fulfillment returned 200, the full 374-comment library unlocked, both
shared secrets confirmed matching, and no retries or errors.

**Next task:** decide on the production merge. The proof above came from the
**branch preview deployment**, not production, and the branch is still unmerged
with no PR open. Still test mode only: no live Stripe key, and no real payment
has ever been taken.

**Still pending:** Resend (no API key, no verified domain). **§17 is the
authoritative Resend setup map**: what to verify, which variables go where, and
the ordered `RCCL_SITE_URL` flip (§17.8).

**The restore-request route and form are now BUILT (§17.9)**, uncommitted and
never run against a live service. That closes the last unbuilt code, but
**changes nothing observable until Resend is configured**: the form completes
successfully and silently sends nothing, by design (§17.5). Do not describe
restore email as working until a real send appears in the Resend dashboard.

**Read §17.9 for what shipped, then §17.8 for the ordered next steps**, then
§15.13 for the wider sequence. Note that §11's step list predates all payment work and is superseded;
see the banner there.

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

**Latest commit:** `49103e6` Report Card Comment Library: Academics section
complete (49 comments). Not pushed, not merged, no deploy. Branch is 6 commits
ahead of its remote and 7 ahead of `origin/main`.

**UNCOMMITTED as of this update:** the full Social-Emotional section (31
comments: empathy-and-relationships, emotional-regulation, self-awareness from
a prior session; resilience-and-growth-mindset drafted and written this
session) is in the working tree but not yet committed.

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

## 7c. Academics section — COMPLETE (49 comments, 4 categories)

| Category | Total | Positive | Growth |
|---|---|---|---|
| reading | 14 | 8 | 6 |
| writing | 14 | 8 | 6 |
| math | 14 | 8 | 6 |
| general-work-habits | 7 | 4 | 3 |
| **TOTAL** | **49** | **28** | **21** |

Target was 40-60. **49 was accepted deliberately.** general-work-habits was
capped at 9 and finished at 7 because the missing mirrors would have been
padding or boundary violations.

**Grade bands:** 3-5 = 46, middle-upper = 32, k-2 = 23, preschool = 0.
Preschool is intentionally zero. k-2 in general-work-habits is 1 of 7 and is
honestly thin: consulting subject references, using disciplinary vocabulary,
and revising an explanation after hearing a peer are developmentally later
skills. Do not force them into younger bands to balance the distribution.

**Audit result:** zero near-duplicate pairs at >=0.35, within the section and
against the entire rest of the library. Zero of 28 positives use conditional
support wording.

### THE ARITHMETIC LESSON: replacing a record does not add to the total

**Academics is 49, not 50.** The projection said 50 because it counted the
seven-comment general-work-habits batch as seven additions. It was not. That
category already held one Step 3 sample, which was retired and its ID reused,
so the batch produced **six net additions**, not seven.

`14 + 14 + 14 + 7 = 49.` Library went 340 -> 346, not 347.

**The rule: when a batch replaces or retires an existing record, the section
total is the count of records that end up in the category, not the count of
comments drafted.** Reading, Writing, and Math each revised a Step 3 sample
*in place*, so their batches of 14 produced 13 net additions each and the
category totals are still 14. Only general-work-habits changed a record count,
because the retired sample was a growth comment and its replacement is also a
growth comment at the same ID.

Derive the total from the audit script after writing, never from the batch
size. This is the third time a projected number has drifted (see §12).

### The Step 3 sample retirement (a deviation, documented)

`academics-growth-general-work-habits-01` was **retired, not revised in place**.
The other three Academics samples got the same in-place treatment the preschool
samples got. This one could not:

- The original described **homework submission**, which is outside the
  general-work-habits fence and already owned by `adhd/task-completion` (see
  `adhd-positive-task-completion-01` and `adhd-growth-task-completion-03`).
- The problem was **placement, not wording**. The preschool samples had wording
  that predated the house style; this one had a situation that predated the
  fence. No revision preserving the situation could respect the boundary.
- The **ID was retained for sequencing**, and tone plus the middle-upper band
  were preserved. The original situation was intentionally not preserved.
- A code comment at the record in `lib/report-card-comments.ts` documents this,
  so a future reader does not mistake it for an in-place revision.

### The general-work-habits fence (locked before drafting)

The category is **not** a holding area for comments that fit awkwardly
elsewhere. Placement rule:

| Content | Goes to |
|---|---|
| Reasoning about numbers, solving a problem, showing a mathematical sequence | `math` |
| Revising, organizing, or supporting written ideas | `writing` |
| Citing or interpreting text evidence | `reading` |
| A habit that clearly applies across **multiple** academic subjects | `general-work-habits` |

Explicitly **outside** the fence, owned by Behavior or ADHD: turning work in,
homework, starting promptly, gathering materials, pacing, persistence,
following directions, staying focused, keeping papers organized, general
checking of work.

The five situations that survived: reference tools (both tones), subject
vocabulary (both tones), making reasoning visible cross-subject (positive
only), transfer between subjects (positive only, one comment), revising an
academic explanation after hearing another idea (growth only). Three situations
earned no mirror, which is why the category is 7 and not 9.

### Category boundaries settled during the Academics build

- **The section axis:** Behavior and ADHD describe *how a student works*;
  Academics describes *what a student can do with the content*. If a comment
  would still make sense with the subject swapped out, it belongs in Behavior.
- **Word problems** measure identifying relevant information and choosing
  operations, never reading comprehension broadly.
- **Fact fluency** describes recall and use of number relationships, never
  speed.
- **Showing work** stays in `math` when the sequence is mathematical.
  `general-work-habits` may cover making thinking visible only when the wording
  genuinely crosses disciplines.
- **Explaining thinking** in math is steps, representations, and relationships,
  not `behavior/participation`'s discussion contribution.
- **Content revision** (`writing`) is what changes in the piece;
  `behavior/effort-and-motivation` owns accepting and using feedback as a
  disposition.
- **Evidence** runs in two directions: `reading` locates it in a text to answer
  a question, `writing` deploys it to support the student's own claim.
- **Transfer** in `math` stays inside mathematics (a familiar operation applied
  to a new problem type); cross-subject transfer is `general-work-habits`.

### Content guardrails established during the Academics build

- No grade-level, benchmark, reading-level, or assessment-data claims anywhere.
  These are invented results under style rule 3.
- No "gets the right answer," speed, persistence, effort, or confidence framing
  in math. Reasonableness comments describe estimating and comparing against
  the problem, never being correct.
- No trait labels: "good work habits," "responsible learner," "organized
  student."
- Do not praise using a tool *independently* unless independence is itself the
  target, which in this section it is not (Behavior owns it).
- Supports must name a real academic action, not a generic reminder or
  checklist.
- Handwriting and neatness are absent by design; writing conventions are an
  academic skill, never presentation quality.
- Do not claim an effect on a reader ("so a reader can see"), per the standing
  no-effect-on-others rule.

### Deliberately unwritten

- **Vocabulary from context** (`reading`): every draft restated decoding or
  inference.
- **Mathematical re-approach** (`math`, map situation 9): drafted four times.
  Every version either restated strategy choice (positive-04 / growth-04) or
  was persistence language in mathematical vocabulary. Persistence was removed
  from the map language deliberately; when the concrete strategy-change wording
  did not survive, the situation was left out rather than forced.
- **Growth mirrors** for making-reasoning-visible, transfer, and academic
  discussion (see the fence section above).

### Repeated frames: measured, deliberately not fixed

| Dimension | Result |
|---|---|
| `[Student]`-initial openings | 31 of 49 (63%), section high |
| Distinct non-`[Student]` openings | 13 |
| Top growth frame | `is a skill [Student] is` and `is difficult for [Student]`, 2 each (10%) |
| Top support construction | `might help`, 7 of 21 growth (33%) |
| Repeated growth closers | **0** |
| Near-duplicate pairs >=0.35 | **0** |

**The §7b process lesson repeated and was watched this time.** Two hard caps
were set mid-section (no `When [Student]` openings, no `may support this`).
Both held at zero for the rest of the section, and both concentrated something
else: `[Student]`-initial openings rose 47% -> 63%, and `might help` rose to
33% to become the dominant modal. This was reported at each batch rather than
discovered at the end. Greg's ruling: **do not rewrite clear content to
manipulate an opening percentage.** The tail stayed varied and no stock growth
frame accumulated, so all of it defers to the whole-library structural review
(§11).

New repeated 4-grams introduced: `[Student] does not yet` and `does not yet
consistently`, both shared between `academics-growth-math-06` and
`academics-growth-general-work-habits-01`. Neither trips the duplicate
detector. Deferred to the same review.

---

## 7d. Social-Emotional section — COMPLETE (31 comments, 4 categories)

| Category | Total | Positive | Growth |
|---|---|---|---|
| self-awareness | 9 | 5 | 4 |
| empathy-and-relationships | 7 | 4 | 3 |
| emotional-regulation | 7 | 3 | 4 |
| resilience-and-growth-mindset | 8 | 4 | 4 |
| **TOTAL** | **31** | **16** | **15** |

Target was 30-40. **31 accepted deliberately, not padded.** Three categories
(self-awareness, empathy-and-relationships, emotional-regulation) were drafted
in a prior session directly against the original three Step 3 samples, each
revised in place. `resilience-and-growth-mindset` was drafted this session
against a fourth Step 3 sample that was **retired**, following the Academics
`general-work-habits-01` precedent (see §7c), because its situation
(persistence after a wrong answer) was already owned by
`behavior-positive-effort-and-motivation-01` and it carried a trait claim
("one of their real strengths") the style guide forbids. The ID was reused;
the situation was not preserved.

**Grade bands:** 3-5 = 30, middle-upper = 27, k-2 = 6, preschool = 0.
Preschool is intentionally zero, matching every other non-preschool section.
The section skews older by design: all four categories describe a student's
own reflective account of an internal or interpersonal pattern, which is
developmentally a 3-5-and-up skill. k-2 coverage is thin (6 of 31) and honest,
not padded to look even.

**Audit result:** zero near-duplicate pairs at >=0.35 against the rest of the
library. Within-section, one pair originally scored 0.75 (see below) and was
reworded down to 0.42, now in line with the section's other positive/growth
pairs and the rest of the library. Zero of 16 positive comments use
conditional support wording.

### The resilience-and-growth-mindset fence (locked before drafting)

The category's mechanism is **what a student believes a setback means and
whether that belief shifts**, not whether the student keeps trying. That is
`behavior/effort-and-motivation`'s lane. The first draft map leaked into
persistence ("returns to trying," "struggles to return to trying") and was
caught and tightened before drafting:

| Content | Goes to |
|---|---|
| Whether a student keeps working, tries again, or gives up | `behavior/effort-and-motivation` |
| Whether a student's *interpretation* of a mistake, struggle, or difficulty shifts | `social-emotional/resilience-and-growth-mindset` |

Test applied to every draft line: if it can be rewritten as "keeps trying" or
"puts in effort" without losing the point, it belongs to Behavior, not here.

Final ground: using a mistake as information rather than only a verdict,
believing ability develops with practice rather than being fixed, revising a
negative self-conclusion after a struggle, and treating early difficulty in
something new as expected rather than a warning sign. A fifth positive
situation (comparing current difficulty to a past skill that used to be hard)
was proposed and cut in review as the weakest of the five and the most
backstory-adjacent under style rule 3.

### A near-duplicate pair caught and fixed in review (0.75 -> 0.42)

`resilience-positive-02` and the first draft of `resilience-growth-02` both
described the fixed-vs-changeable-ability belief and scored **0.75** Jaccard
similarity, the highest pair measured anywhere in the library this project
(next highest anywhere: 0.42). Both shared the clause "something they either
have or do not have." Greg explicitly declined to wave this through as an
ordinary positive/growth mirror: "the pair can express opposite sides of the
same mechanism without being nearly the same sentence." Growth-02 was
rewritten with different structure and emphasis, preserving the mechanism:

> Before: "[Student] describes a skill as something they either have or do not
> have, rather than as something that changes with practice."
>
> After: "[Student] often speaks about ability as fixed and does not yet
> describe skills as something that can develop over time."

**Rule for future sections:** a positive/growth mirror pair scoring
meaningfully above the section's other pairs (not just above the 0.35/0.40
threshold) warrants a reword pass even if it technically clears the audit
threshold. Shared function words in a single clean mechanism are not an
excuse; different sentence structure is achievable and was achieved here in
one pass.

### A parser gap found and fixed this session (third parser issue, same root cause)

The retired-and-replaced record (`resilience-positive-01`) carries a five-line
inline `//` comment block between its opening `{` and its `id:` field,
documenting the retirement per the Academics precedent. It is the only record
in the entire file with a comment block in that position. The recreated
`parse.mjs` regex required `id:` immediately after `{` and silently dropped
this one record, undercounting the library by one (373 instead of 374) and
producing a downstream non-sequential-numbering false error. Caught by the
existing parse-count-vs-raw-count check before anything was reported to Greg.
Fixed by making the regex tolerate an optional `//`-comment block between `{`
and `id:`. **Any future parser rewrite must handle: single-quoted text,
double-quoted text (including escaped internal double-quotes), and an optional
leading comment block.** This is the third distinct parsing edge case found
across the project (see §9); the pattern is that hand-written records
accumulate formatting variety the original parser never had to anticipate.

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

**Do not count anything by hand.** Greg has caught manual miscounts three times
now, and one missing `[Student]` token reached his review because a batch was
hand-audited. Run the scripts.

### Two parser/reporting bugs found 2026-07-28 — keep both guards

1. **Double-quoted records were silently dropped.** Records whose text contains
   an apostrophe (`[Student]'s ...`) are stored **double-quoted** in the data
   file; the rest are single-quoted. A parser matching only single quotes
   dropped **14 records** and reported the library at 287 instead of 301. The
   parse-count vs raw-count check caught it. `audit-comments.mjs` now also
   carries an explicit **possessive-string regression check** that fails loudly
   if double-quoted records stop parsing. It was verified by fault injection:
   reinstating the old bug makes it fire two errors. Any rewrite of the parser
   must handle **both quote styles**.
2. **A hand-built opening table summed to 13 of 14.** A possessive opening
   (`[Student]'s written ideas ...`) was left out of the `[Student]`-initial
   bucket, which is exactly what the §9 structural rule forbids.
   `section-audit.mjs` now prints a **RECONCILIATION** line asserting the
   buckets sum to the section total, plus a count of possessive openings. Never
   report a bucket table that does not reconcile.

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

## 10. Library status: 374 comments — ALL CONTENT SECTIONS COMPLETE

> **Still accurate as a content record.** The comment totals, per-section
> rationale, and the "verify categories against the schema" rule below all
> stand. Nothing here is superseded. It simply describes finished work: the
> content phase ended with PR #7, which is merged. No content drafting is
> planned.

| Section | Populated | Target | Categories locked | Categories populated | Status |
|---|---|---|---|---|---|
| behavior | **145** | 150-200 | 8 | 8 | COMPLETE |
| adhd | **57** | 60-80 | 5 | 5 | COMPLETE |
| preschool | **92** | 80-100 | 6 | 6 | COMPLETE |
| academics | **49** | 40-60 | 4 | 4 | COMPLETE |
| social-emotional | **31** | 30-40 | 4 | 4 | COMPLETE |
| **TOTAL** | **374** | 350-450 | 27 | 27 | ALL COMPLETE |

**374 sits inside both approved bands** (350-450 Product Decision; 360-480
Schema §2 sum of per-section ranges). No padding anywhere. Behavior and ADHD
came in **under** target, Preschool hit its map exactly, Academics landed
mid-range, Social-Emotional landed low-range. All five were accepted
deliberately. Do not retroactively pad any of them.

### Verify the category list against the schema, not the data

Locked categories with zero comments were an artifact of Step 3 sampling
during earlier sections. As of this session, **every locked category in every
section is populated.** Nothing outstanding.

**At the start of each section, read `CATEGORIES_BY_SECTION` in
`lib/report-card-comments.ts` directly.** Never infer a section's category list
from what already has comments. The audit script reports this automatically
under "locked but unpopulated categories."

Schema §2 guidance for preschool: roughly even across all 6 categories is
plausible, since all are genuinely core to the age band. Section total is the
tracked target, not per-category quotas.

---

## 11. Next steps

> **SUPERSEDED as a task list (2026-07-29). Do not work from this section.**
> It was written before any payment work existed and its step list has been
> overtaken by events:
>
> - **Step 4 ("commit the branch, open the PR") is done.** That referred to the
>   content branch. PR #7 is merged and the 374-comment library is on `main`.
> - **Step 5 ("Stripe integration, gating, checkout") is in progress**, and is
>   documented in §13, §14, and §15, not here.
> - **Steps 1-3 (deferred content ideas, final section totals, the Brain schema
>   revision log) were never done and are still genuinely open.** They are
>   content-side follow-ups with no bearing on the payment work, and none of
>   them block it.
>
> **The live ordered task list is §15.13.** The text below is kept unedited as
> the record of what the content phase expected to happen next.

**All five content sections are complete. §12 is resolved and holds: 374 sits
inside both approved bands.** No further content drafting is planned unless
Greg explicitly reopens a section.

**The Behavior structural thinning pass is done (§11a).** ADHD, Preschool,
Academics, and Social-Emotional were reviewed and deliberately left unchanged;
their flagged metrics are documented debt, not proven defects (see §11a for
the reasoning).

Remaining, in order:

1. Evaluate the deferred content ideas from §7 (behavior) and §7c (academics)
2. Decide whether behavior's 145, ADHD's 57, Academics' 49, and
   Social-Emotional's 31 stand as final (recommendation: yes, all four were
   accepted deliberately with documented rationale)
3. Update `Brain/Report Card Comment Library - V1 Schema.md` §10 revision log
   with the Step 6 content decisions, the observed-versus-possible support rule
   (§6), the corrected boundary rule (§8), the ADHD guardrails (§7a), the
   resilience-and-growth-mindset fence (§7d), and the structural review
   outcome (§11a)
4. Commit the branch, open the PR (this route is `.tsx`, so it is
   **branch-and-wait**, never self-merge)
5. Stripe integration, gating, checkout

---

## 11a. Behavior structural thinning pass — COMPLETE (2026-07-28)

**Scope decision:** a full section-by-section audit (fresh `section-audit.mjs`
run against all five sections) showed Behavior was the only section with a
real, compounding structural problem. ADHD, Preschool, Academics, and
Social-Emotional each had at most one or two mild, single-metric skews
(opening-structure concentration, one repeated modal phrase) with **no
near-duplicate pair above 0.42** and no 4-gram repeated more than twice.
Behavior alone had a true monopoly frame plus three compounding stock closers
plus a cluster of 0.40-0.50+ cross-category near-duplicate pairs, all
downstream of the same four templates colliding across categories. **Decision:
thin Behavior only; leave the other four sections untouched.** Rewriting their
mild skews would contradict the standing rule against changing clear content
solely to manipulate a percentage.

**What was fixed:**

1. **The `[Student] is working on` monopoly.** Held 25 of 67 growth comments
   (37%) across all 8 categories. 12 were reworded to genuinely different
   sentence structures (present-tense negatives, reordered clauses, "may"
   constructions), not swapped for a second stock phrase. Result: 12 of 67
   (18%), no category left with more than 1-2 remaining instances. The other
   13 were left as-is; one instance per category reads naturally, multiple is
   where the monopoly was actually felt.
2. **Two near-identical positive/growth pairs**, both the same sentence with
   "is working on" prepended to the positive version:
   - `following-directions-07`/`following-directions-05` (0.69, the highest
     similarity found anywhere in the library this project). Growth-05 now
     names the actual behavioral gap (proceeding without asking) rather than
     negating the positive sentence.
   - `leadership-06`/`leadership-05` (0.50, caught in a targeted check
     requested by Greg specifically for this pair before committing).
     Growth-05 now describes the missing behavior concretely rather than
     restating the positive with a prefix.

**What was deliberately left alone**, out of scope for this pass: the three
older stock closers (`is an area [Student] is continuing to develop` — 10
uses, `an ongoing goal for [Student]` — 7 uses, `[Student] continues to build`
— 7 uses) and their resulting 0.35-0.50 cross-category collisions (about a
dozen pairs, e.g. `peer-relationships-04`/`independence-02` and
`participation-08`/`participation-07`, both at 0.50). **These are documented
debt, not proven defects.** Continuing to chase every 0.35-0.50 pair risks
turning a useful structural pass into endless percentage cleanup; a future
session should treat these as a deliberate, separately-scoped decision, not an
extension of this one.

**A new phrase, capped on introduction:** "is still developing for [Student]"
was used 3 times across the reworded batch (`focus-and-attention-08`,
`peer-relationships-07`, `leadership-04`). Watched during drafting so it did
not become a second monopoly; 3 uses across 3 categories was judged
reasonable and left as-is.

**Verification:** typecheck clean, zero duplicate IDs, zero audit errors,
library total unchanged at 374 (pure rewording, no additions or removals).
Highest within-section near-duplicate after the pass: 0.50 (the two documented
debt pairs above), down from a working set that included a 0.69 outlier.

---

## 11b. Manual browser QA — PASSED (2026-07-28)

Greg tested PR #7's preview deployment directly at `/report-card-comment-library`
(the route is unlinked and `noindex`, so it must be reached by URL, not by
navigating the site).

**Result: manual browser QA passed on desktop, iPhone, and Android.** All
sections, categories, filters, comment wrapping, copy behavior, refresh
behavior, browser Back behavior, and mobile layout worked correctly. No
issues found.

**PR #7 is now ready for final code review and merge.** This was the last
blocker on the merge (§10/§11 previously listed it as pending). Stripe
integration still waits until after the merge, per the standing sequencing:
content and structure first, payment integration only once the library itself
is confirmed working end-to-end in a real browser.

---

## 12. RESOLVED: the final-target math (no gap exists)

**Raised 2026-07-28 by Greg, after Preschool completed. Resolved the same day,
before Academics was drafted. Kept as the record of why no padding happened.**

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

---

## 13. Stripe integration (IN PROGRESS, 2026-07-29)

**This section supersedes §11's step 5 and is the authoritative record for all
payment work.** Everything above it concerns content and is finished.

### 13.1 Branch and commit status

**Branch:** `feature/report-card-comment-library-stripe` (PR #7 already merged,
so this branches from a `main` that contains the full 374-comment library).

| | |
|---|---|
| Committed this session | `92f1489` Add report_card_purchases migration for Stripe integration |
| Ahead of origin by | 1 commit (**not pushed**) |
| Uncommitted | all Edge Function and Vercel code listed in §13.3 |

**Nothing has been pushed, merged, or deployed.** No Edge Function is deployed.
No Stripe or Supabase secret has been configured in any dashboard. The only
thing that has touched live infrastructure is the migration (§13.2).

### 13.2 Migration: APPLIED and VERIFIED

`supabase/migrations/20260728000000_report_card_purchases.sql`, applied to
Supabase project **`muywwvbmpjotcffocyjb`**.

**Important context:** that project ref is listed in the Supabase dashboard as
"Classroom Pulse 3.0 Claude". It is the **shared production database** that also
holds live student data (`notes`, `students`, `parent_communications`,
`student_accommodations`, thousands of rows each). `report_card_purchases` is a
brand-new, fully isolated table with no foreign keys in either direction, but
any future work here is operating in the same database as sensitive student
records. Treat it accordingly.

Final schema:

```sql
create table if not exists public.report_card_purchases (
  id uuid primary key default gen_random_uuid(),
  stripe_checkout_session_id text not null,
  stripe_payment_intent_id text,
  stripe_customer_id text,
  stripe_price_id text not null,
  email text not null,
  amount_total integer not null,
  currency text not null,
  status text not null default 'paid',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint report_card_purchases_session_id_key unique (stripe_checkout_session_id),
  constraint report_card_purchases_payment_intent_id_key unique (stripe_payment_intent_id),
  constraint report_card_purchases_amount_total_check check (amount_total >= 0),
  constraint report_card_purchases_status_check check (status in ('paid', 'refunded', 'revoked'))
);
```

Plus a `lower(email)` index, an `updated_at` trigger (function hardened with
`set search_path = ''`), and RLS enabled with **zero policies**.

**Verified post-apply (all 8 checks passed):** table exists; RLS enabled; 0
policies; 2 unique constraints; 2 check constraints; email index present;
1 non-internal trigger; 0 rows.

**Two migration-safety fixes Greg caught before apply, worth remembering:**

1. `create trigger` is not repeat-safe. A retried migration fails on an existing
   trigger. Fixed with `drop trigger if exists ... on <table>;` immediately
   before it.
2. The trigger function needed `set search_path = ''` to close search-path
   hijacking.

**Full rollback** (both statements needed, dropping the table does NOT remove
the standalone function):

```sql
drop table if exists public.report_card_purchases;
drop function if exists public.report_card_purchases_set_updated_at();
```

### 13.3 Files changed, added, deleted

**Committed (in `92f1489`):**

| File | Status |
|---|---|
| `supabase/migrations/20260728000000_report_card_purchases.sql` | added |

**Uncommitted, Supabase Edge Functions (all Deno):**

| File | Status |
|---|---|
| `supabase/functions/_shared/access-token.ts` | added |
| `supabase/functions/_shared/auth.ts` | added |
| `supabase/functions/_shared/fulfillment.ts` | added |
| `supabase/functions/_shared/stripe.ts` | added, then **DELETED** (see §13.7) |
| `supabase/functions/report-card-checkout-fulfill/index.ts` | added |
| `supabase/functions/report-card-checkout-webhook/index.ts` | added |
| `supabase/functions/report-card-access-restore/index.ts` | added |
| `supabase/functions/report-card-access-revalidate/index.ts` | added |
| `supabase/functions/deno.json` | added |
| `supabase/functions/deno.lock` | added (generated, keep for reproducible builds) |

**Uncommitted, Vercel side:**

| File | Status |
|---|---|
| `lib/stripe.ts` | added (restricted-key client + required-env `getSiteUrl()`) |
| `app/api/report-card-checkout/create-session/route.ts` | added |
| `lib/ratelimit.ts` | modified (added `report-card-checkout` 10/h, `report-card-restore` 5/h) |
| `tsconfig.json` | modified (excluded `supabase/functions`, separate Deno runtime) |
| `package.json` / `package-lock.json` | modified (added `stripe` npm dep) |

### 13.4 Final architecture: no Supabase key in Vercel

**The governing constraint, set by Greg:** `SUPABASE_SERVICE_ROLE_KEY` must never
exist in the Vercel marketing-site environment, because it grants full
administrative access to the same database holding student data.

Therefore **all privileged database access happens inside Supabase Edge
Functions.** Vercel holds no Supabase key of any kind, not even the anon key,
for this feature. It calls narrowly scoped Edge Functions over HTTPS with a
shared bearer secret.

**Secrets by location:**

| Vercel | Supabase Edge Function secrets |
|---|---|
| `STRIPE_SECRET_KEY` (**restricted**, Checkout Sessions Write only) | `STRIPE_SECRET_KEY` (full test key) |
| `STRIPE_PRICE_ID` | `STRIPE_PRICE_ID` |
| `NEXT_PUBLIC_SITE_URL` | `STRIPE_WEBHOOK_SECRET` |
| `REPORT_CARD_FUNCTIONS_SECRET` | `REPORT_CARD_FUNCTIONS_SECRET` (same value) |
| `RCCL_TOKEN_SECRET` | `RCCL_TOKEN_SECRET` (same value) |
| **`SUPABASE_FUNCTIONS_URL`** (see below) | `RESEND_API_KEY`, `RESEND_FROM_ADDRESS` |
| | `RCCL_SITE_URL` |
| | `SUPABASE_SERVICE_ROLE_KEY` (ambient, provided by Supabase automatically) |

> **`SUPABASE_FUNCTIONS_URL` was missing from this table until 2026-07-29** and
> is easy to overlook, because it is not a secret and looks like infrastructure
> rather than configuration. `lib/report-card-functions.ts` requires it, with
> **no fallback**: without it every private Edge Function call throws and the
> gate takes its transient-failure branch, so paying customers would keep
> access until their 30-day token expires while nothing ever revalidates.
> Value: `https://muywwvbmpjotcffocyjb.supabase.co/functions/v1`. It must be
> added to the §13.13 setup steps alongside the Vercel env vars. It is a URL,
> not a credential, and holds no privilege on its own.

`NEXT_PUBLIC_SITE_URL` is **required with no fallback**, it must never silently
default to the production domain, so a misconfigured preview fails loudly.
Values: `http://localhost:3000` local, `https://getshorthandapp.com` production,
per-environment override on Vercel previews.

**Threat model summary:** a full Vercel compromise yields a Checkout-only
restricted Stripe key, the shared function secret (which only reaches the
purpose-built functions, each re-verifying against Stripe before writing), and
the token-signing secret (worst case: free access to a $4.99 comment library).
**It yields no path to student data.** The service-role key stays inside
Supabase's runtime, the same trust boundary the pre-existing `delete-account`
function already occupies, so this feature adds no new location for it.

### 13.5 Stripe decisions

- **Test mode only.** No live keys, no real payments, until Greg explicitly
  approves the live-mode switch.
- **Vercel uses a Stripe restricted test key** with exactly one permission:
  **Checkout Sessions, Write.** Everything else set to None. Confirmed this is
  sufficient: creating a session with a Price ID string needs no read access to
  Prices, Products, Customers, or PaymentIntents.
- **The full Stripe test secret key lives only in Supabase**, where session
  retrieval and webhook verification happen.

### 13.6 Direct Stripe-to-Supabase webhook routing

Stripe calls the Supabase Edge Function **directly**. The webhook is never
forwarded through Vercel, so Vercel never handles a raw webhook payload.

**URL to register in Stripe test mode:**

```
https://muywwvbmpjotcffocyjb.supabase.co/functions/v1/report-card-checkout-webhook
```

**Event to subscribe:** `checkout.session.completed` **only.**

The webhook authenticates exclusively via Stripe's signature. It does **not**
accept `REPORT_CARD_FUNCTIONS_SECRET`; that secret is only for the private
fulfill / restore / revalidate calls from Vercel.

Deploy note: this function needs `verify_jwt = false` (matching the existing
`delete-account` convention), since Stripe cannot present a Supabase Auth JWT.

### 13.7 Official Stripe SDK replaced handwritten crypto

Originally the Edge Functions used a hand-rolled webhook-signature parser and a
hand-built Stripe REST wrapper. Greg challenged this: handwritten payment crypto
needs a strong reason to exist. It did not.

`_shared/stripe.ts` was **deleted outright** (not left alongside) and replaced
with `npm:stripe@19.2.0`:

> **Version note (recorded 2026-07-29).** The two sides are on **different
> major versions of the Stripe SDK**, and that is not a mistake to "fix"
> casually. Deno/Edge Functions pin `npm:stripe@19.2.0` inline (and in
> `deno.lock`); the Vercel side resolved to `stripe@^22.3.2` when it was
> installed. They never exchange SDK objects, only a Checkout Session **id
> string**, so there is no compatibility surface between them. Vercel only
> creates sessions; all verification happens on the Deno side. Worth knowing
> before anyone aligns the versions, since bumping the Deno pin would mean
> re-running the §13.11 webhook-signature tests.

- `Stripe.createFetchHttpClient()`, Deno/edge compatible transport
- `stripe.webhooks.constructEventAsync(...)`, **the async variant is required**;
  the sync `constructEvent` assumes Node's crypto module and throws
  `SubtleCryptoProvider cannot be used in a synchronous context` under Deno
- `stripe.checkout.sessions.retrieve(id, { expand: ['line_items'] })`

**A real bug this fixed:** the handwritten parser used `Object.fromEntries` on
the `Stripe-Signature` header, keeping only the **last** `v1=` value. Stripe
sends multiple `v1` signatures during webhook-secret rotation, so the old code
would have failed verification mid-rotation. Verified fixed (§13.11).

### 13.8 Exact fulfillment checks

`_shared/fulfillment.ts` is the **single idempotent fulfillment path**, imported
by both `report-card-checkout-fulfill` and `report-card-checkout-webhook`. Do not
duplicate this logic; the two callers must never drift.

**Why metadata alone was rejected:** the first version verified
`session.metadata.rccl_price_id`. Greg caught that this is written by our own
checkout route and is therefore a self-signed label, not proof of what was
bought. Fulfillment now inspects the **actual purchased line item**.

Every check, all required:

| Check | Required value |
|---|---|
| `session.status` | `'complete'` |
| `session.payment_status` | `'paid'` |
| line item count | exactly **1** |
| `line_items.data[0].price.id` | `=== STRIPE_PRICE_ID` |
| `line_items.data[0].quantity` | **1** |
| `session.amount_total` | **499** |
| `session.currency` | **`'usd'`** |

**499 and `usd` are hardcoded constants in the module, deliberately not derived
from Stripe at runtime.** A price change in the Stripe dashboard must not
silently change what the application accepts as valid payment; changing the
price is an intentional code change plus a full test pass.

`metadata.rccl_price_id` remains only as a logged consistency check, explicitly
commented as **not** the source of truth.

**Idempotency:** select-or-insert keyed on the unique
`stripe_checkout_session_id`. On a concurrent race the loser's insert hits
Postgres error `23505` and reads back the winner's row. Both callers converge on
the same `purchaseId`. No duplicate row is possible, so success-page
verification and webhook delivery cannot double-fulfill.

### 13.9 Access model: 30-day cookie, 24-hour revalidation

**The problem Greg identified:** the original design used a one-year stateless
HMAC cookie that never rechecked the database. That made `refunded` and
`revoked` decorative, marking a purchase refunded would not remove access for
up to a year. Worse, the restore path *did* check status, so revocation was
half-enforced and incoherent.

**Chosen model.** Token payload is `{ purchaseId, exp, revalidateAfter }`:

- `exp` = **30 days** (hard expiry)
- `revalidateAfter` = **24 hours**

Gated page behavior on every render:

1. Verify the HMAC locally. Invalid or past `exp` means clear cookie, show paywall.
2. If `revalidateAfter` has **not** passed, grant access, **no network call**.
3. If it **has** passed, call `report-card-access-revalidate`:
   - `valid: true`: set a fresh 30-day token with a new 24-hour window, grant access
   - `not_paid`: clear cookie, show paywall
   - `lookup_failed`: see the rule immediately below

Cost is roughly one Edge Function call per user per day, off the hot path.
Revocation takes effect within 24 hours worst case, immediately on a new device.

#### The `lookup_failed` rule (corrected 2026-07-29, read this carefully)

An earlier draft of this section said only "keep existing access" on a transient
database error. **That was underspecified and would have been a real
vulnerability.** If the gate minted a fresh token whenever revalidation failed,
anyone able to induce or wait out a Supabase error could keep renewing access
forever, and the 30-day hard expiry would never actually bite.

The correct behavior on `lookup_failed`:

- **Temporarily grant access using the existing token.** Do not lock out a
  paying customer over a transient outage.
- **Do not mint, refresh, extend, or re-set the token.** `exp` and
  `revalidateAfter` both stay exactly as they were.
- Because `revalidateAfter` stays stale, the next render retries revalidation.
  The system heals itself once Supabase recovers.
- The existing token therefore keeps working **only until its original hard
  `exp`**, and no further.

**Never mint a fresh token after `lookup_failed`.**

Complete state table for the gate:

| Token state | Revalidate result | Behavior |
|---|---|---|
| valid, `revalidateAfter` not passed | (not called) | grant access, no network call |
| valid, revalidation due | `valid: true` | **set fresh token**, grant access |
| valid, revalidation due | `not_paid` | **clear cookie**, show paywall |
| valid, revalidation due | `lookup_failed` | grant access, **token untouched**, retry next render |
| past `exp`, or bad signature, or malformed | (not called) | show paywall, **even if Supabase is unavailable** |
| no cookie | (not called) | show paywall |

An expired or invalid token must never be rescued by a Supabase outage. The
local HMAC and `exp` check happens first and is decisive on its own.

`verifyAccessToken()` checks signature and hard expiry but deliberately does
**not** enforce `revalidateAfter`. The caller decides, because the gated page
and the restore-confirm path need different behavior. `newAccessTokenPayload()`
is the single place TTLs are set, so fulfill / restore / revalidate cannot drift.

Restoration remains blocked unless status is `paid`.

### 13.10 Edge Function contracts

All four are Deno, all need `verify_jwt = false` at deploy time.

**`report-card-checkout-fulfill`** (private, Bearer `REPORT_CARD_FUNCTIONS_SECRET`)

- `POST { sessionId }`
- `200 { granted: true, accessToken, isNewPurchase }`
- `200 { granted: false, reason }`, where reason is one of `not_paid`,
  `product_mismatch`, `amount_mismatch`, `currency_mismatch`, `missing_email`,
  `db_error`, `session_lookup_failed`, `server_misconfigured`
- `401` bad secret, `400` malformed

**`report-card-checkout-webhook`** (public, Stripe signature only)

- `POST` raw Stripe event body, `Stripe-Signature` header
- `200 { received: true }` terminal
- `500` **only** on `db_error` / `session_lookup_failed`, so Stripe retries
  genuine transient failures. Definitive rejections return 200 so Stripe stops.
- Raw body via `req.text()`, passed untouched to `constructEventAsync()`. Nothing
  parses or re-serializes before verification.

**`report-card-access-restore`** (private, Bearer secret)

- `POST { action: 'request', email }` returns **always** `200 { ok: true }`
  regardless of whether the email matched, including on malformed input and on
  internal misconfiguration. Enumeration is prevented at the function, so Vercel
  cannot distinguish the cases either.
- `POST { action: 'confirm', token }` returns `200 { granted: true, accessToken }`
  or `200 { granted: false, reason }`
- Restore links are fresh, short-lived (**30 min**), and minted on demand. There
  is **no stored token column**; verification is purely cryptographic. This is
  why `access_token_hash` was dropped from the schema.

**`report-card-access-revalidate`** (private, Bearer secret), **NEW this session**

- `POST { purchaseId }` (UUID-validated; Vercel has already verified the HMAC
  locally, so this function's only job is the database status check)
- `200 { valid: true, accessToken }`, still paid, fresh 30-day token
- `200 { valid: false, reason: 'not_paid' }`, refunded / revoked / missing,
  clear cookie and show paywall
- `200 { valid: false, reason: 'lookup_failed' }`, **transient DB error**
- `401` bad secret, `400` malformed

> **Do not conflate `lookup_failed` with `not_paid` when building the gate.**
> `lookup_failed` must **keep** existing access, so a Supabase outage does not
> lock out every paying customer at once. Only `not_paid` revokes.
>
> But `lookup_failed` must **never mint a fresh token**. It grants access on the
> existing token only, leaving `exp` and `revalidateAfter` untouched, so access
> still dies at the original hard expiry and revalidation retries next render.
> See the full state table in §13.9.

### 13.11 Tests completed

| Test | Result |
|---|---|
| `deno check` (7 function files, real Stripe types) | clean |
| `deno lint` (excl. `no-import-prefix`, see note) | clean |
| Stripe SDK runtime probe | `createFetchHttpClient`, `constructEventAsync`, `sessions.retrieve` all present |
| Webhook sig: valid signature | accepted |
| Webhook sig: tampered payload | rejected |
| Webhook sig: wrong secret | rejected |
| Webhook sig: **multi-`v1` rotation header** | accepted (old handwritten parser would have failed) |
| Token round-trip | OK |
| Token TTLs (30d exp, 24h revalidate, revalidate < exp) | OK |
| Token wrong secret / tampered payload / expired / malformed | all rejected |
| Token stale-but-unexpired still verifies, revalidation detectable | OK |
| `npx tsc --noEmit` | clean |
| `npx eslint` on new/changed files | clean |
| `npm run build` | succeeds, route registered dynamic |

`no-import-prefix` is excluded deliberately: it objects to inline
`https://esm.sh/...` imports, which is the exact pattern the existing production
`delete-account` function already uses successfully.

Repo-wide `eslint .` reports 52 **pre-existing** errors (`app/terms/page.tsx`,
`components/LeadGate.tsx`, and the `catch (e: any)` pattern in the older API
routes). None are in files touched by this work.

`npm audit` reports pre-existing vulnerabilities in `next`, `sharp`, `postcss`,
and dev transitives. **Not introduced by adding `stripe`**, out of scope here.

### 13.12 Untestable before deployment

- Shared-secret auth under real Supabase request routing (`Deno.env.get` against
  actually-configured secrets)
- Real Stripe webhook delivery end to end (needs `stripe listen` / `stripe
  trigger` against the deployed function)
- The `23505` race path under genuine concurrency
- Service-role RLS-bypass behavior against the real table
- Resend delivery, entirely. **No API key or verified sending domain exists
  yet.** Missing `RESEND_API_KEY` / `RESEND_FROM_ADDRESS` is handled safely
  (logged, non-throwing, still returns the generic `{ ok: true }`), but
  **restoration email must not be described as working until a real test send
  succeeds.**
- The full redirect loop, since the success page, gated UI, and the Vercel-side
  token verifier do not exist yet

### 13.13 Setup Greg still has to do (none of it done yet)

Nothing below has been touched. All of it requires Greg, and each step should be
confirmed before Claude acts on anything adjacent to it.

1. Create the Stripe **test-mode** Product and Price ($4.99 one-time), which
   yields `STRIPE_PRICE_ID`
2. Create the Stripe **restricted test key**, Checkout Sessions Write, all
   else None
3. Generate `REPORT_CARD_FUNCTIONS_SECRET` and `RCCL_TOKEN_SECRET` (long random
   values, identical in both Vercel and Supabase)
4. Set Supabase Edge Function secrets (§13.4 right column)
5. Set Vercel env vars (§13.4 left column)
6. Register the webhook URL (§13.6) in Stripe test mode, which yields
   `STRIPE_WEBHOOK_SECRET`
7. Resend account, API key, verified sending domain

### 13.14 Exact next-step prompt

Paste this verbatim into a fresh Claude chat. Tell it to read this handoff
first, then continue from here.

> Proceed with the Vercel-side checkpoint:
>
> lib/report-card-access.ts
> success-page verification route
> cookie issuance
> server-side library gate
> 24-hour revalidation handling
>
> On a transient lookup_failed, do not immediately lock out a paying customer,
> but do not refresh or extend the token.
>
> The existing token may continue granting access only until its original hard
> exp. Keep revalidateAfter stale so the system retries later. Never mint a
> fresh token after lookup_failed.
>
> Required behavior:
>
> valid: true -> set fresh token and grant access
> not_paid -> clear cookie and show paywall
> lookup_failed with an otherwise unexpired token -> temporarily grant access
> using the existing token, without changing expiry or revalidation time
> expired or invalid token -> show paywall even if Supabase is unavailable
>
> Preserve:
>
> non-payers must never receive the full 374-comment dataset in browser
> JavaScript
> immediate access cannot depend on Resend
> noindex, nofollow
> no deployment, secrets, commit, or push yet
>
> After implementation, report:
>
> Exact gate behavior for every token state
> Whether the full dataset appears anywhere in the unauthenticated payload
> Cookie security flags
> Success-page failure behavior
> Typecheck, build, and targeted test results

Supporting detail for whoever picks this up (not part of the prompt above):

- The wire format `lib/report-card-access.ts` must mirror exactly is in
  `supabase/functions/_shared/access-token.ts`:
  `base64url(payload) + "." + base64url(HMAC-SHA256)`, payload
  `{ purchaseId, exp, revalidateAfter }`, Web Crypto, shared
  `RCCL_TOKEN_SECRET`. Keep the two implementations in lockstep.
- A `lib/report-card-functions.ts` client is also needed: the authenticated
  caller for the private Edge Functions, sending
  `Authorization: Bearer <REPORT_CARD_FUNCTIONS_SECRET>`.
- The full gate state table is in §13.9. The `lookup_failed` rule there is
  binding.
- The restore-access routes wrapping `report-card-access-restore` (`request`
  and `confirm`) are still outstanding, rate-limited via the existing
  `report-card-restore` limiter. They can follow this checkpoint.
- The teaser UI is the full page structure, section/category list, total
  comment count, filters, and 1-2 real sample comments per section, with
  everything else withheld server-side.
- Never treat query params, the success redirect, localStorage, or client
  state as proof of purchase. Stay in Stripe test mode.

---

## 14. Vercel-side gate checkpoint (COMPLETE, 2026-07-29)

**This section records the work described by §13.14's "exact next-step prompt".**
That checkpoint is now implemented and verified locally. §13 remains accurate
for everything on the Supabase/Stripe side; this section is the authority for
the Vercel side.

### 14.1 Status: nothing deployed, pushed, or committed

Unchanged from §13.1 and important:

| | |
|---|---|
| Committed this session | **nothing** |
| Branch | `feature/report-card-comment-library-stripe` |
| Unpushed commits on branch | 3 (`92f1489`, `06d521c`, `2f3b428`, all pre-dating this session) |
| Everything in §14.2 | **uncommitted working-tree changes** |

No Edge Function deployed. No secret configured in any dashboard. No Stripe
Product/Price created. Still test-mode-only by design. The migration (§13.2)
remains the only thing that has ever touched live infrastructure.

### 14.2 Files added and changed

**Added, Vercel library code:**

| File | Purpose |
|---|---|
| `lib/report-card-access.ts` | HMAC verifier + cookie option builders. Mirrors the Deno wire format exactly. |
| `lib/report-card-functions.ts` | Authenticated Edge Function client (bearer secret, 10s timeout). |
| `lib/report-card-gate.ts` | `evaluateAccess()`, the single access decision. Implements the §13.9 state table. |
| `lib/report-card-teaser.ts` | `server-only` module. Builds the non-payer payload; also exposes `getFullLibrary()`. |

**Added, routes and UI:**

| File | Purpose |
|---|---|
| `app/api/report-card-checkout/verify-session/route.ts` | Success-page verification. Relays session id to fulfill, sets the cookie. |
| `app/api/report-card-access/refresh/route.ts` | Cookie-writing companion to the gated page. Takes no body. |
| `app/report-card-comment-library/PaywallClient.tsx` | Unauthenticated view (teaser only). |
| `app/report-card-comment-library/AccessRefresher.tsx` | Pings the refresh route to persist a decision. |
| `app/report-card-comment-library/success/page.tsx` | Reads `session_id` (awaited `searchParams`, Next 16). |
| `app/report-card-comment-library/success/SuccessClient.tsx` | Verification UI, retry logic. |
| `app/report-card-comment-library/restore/page.tsx` | **Placeholder only.** See §14.10. |

**Changed:**

| File | Change |
|---|---|
| `app/report-card-comment-library/page.tsx` | Now a gated async Server Component. `dynamic = 'force-dynamic'`. |
| `app/report-card-comment-library/LibraryClient.tsx` | Takes `comments` as a **prop**; no longer imports `REPORT_CARD_COMMENTS`. Dropped stale "Prototype preview" copy. |
| `package.json` / `package-lock.json` | Added `server-only@^0.0.1` (see §14.6). |

`lib/ratelimit.ts` and `tsconfig.json` still show as modified, but those are the
§13.3 changes from the prior session, not new work.

### 14.3 The architectural constraint that shaped this

**Next.js Server Components cannot set cookies during render.** Confirmed in
`node_modules/next/dist/docs/01-app/03-api-reference/04-functions/cookies.md`:
`.set` / `.delete` only work in a Server Function or Route Handler.

So the gated page **decides** but cannot **persist**. The page renders
`AccessRefresher`, a tiny client component that POSTs to
`/api/report-card-access/refresh`, which re-runs the same `evaluateAccess()`
and writes the resulting cookie.

**That route takes no request body at all.** It re-derives everything from the
incoming cookie, so a caller can only ever cause the state their own cookie
already justifies. It is a "flush the decision" nudge, not a client claim.

Also considered and rejected: doing this in `proxy.ts` (Next 16's rename of
`middleware.ts`). Its own docs warn against relying on shared modules there.

### 14.4 Exact gate behavior, all token states (verified)

Every row was exercised against a running production build (`next start`), not
reasoned about:

| Token state | Revalidate result | Behavior | Verified |
|---|---|---|---|
| no cookie | not called | paywall | yes |
| valid, `revalidateAfter` not passed | not called | grant, **no network call** | yes |
| valid, revalidation due | `valid: true` | grant + **fresh token set** | yes |
| valid, revalidation due | `not_paid` | paywall + **cookie cleared** | yes |
| valid, revalidation due | `lookup_failed` | grant, **no `Set-Cookie` at all** | yes |
| valid, revalidation due | network/function unreachable | identical to `lookup_failed` | yes |
| past `exp` | not called | paywall (Supabase never consulted) | yes |
| bad signature (wrong secret) | not called | paywall | yes |
| malformed garbage | not called | paywall | yes |

The local HMAC + hard-expiry check runs first and is decisive on its own, so an
expired or forged token is never rescued by a Supabase outage.

### 14.5 30-day cookie, 24-hour revalidation, and the lookup_failed rule

TTLs come from `newAccessTokenPayload()` on the Deno side and are never
recomputed on the Vercel side: `exp` = 30 days, `revalidateAfter` = 24 hours.
Before `revalidateAfter` passes, the gate grants access on local HMAC alone
with **zero network calls**. Cost is roughly one function call per user per day.

**`lookup_failed` was verified by header inspection, not by reading the code.**
With a stale-but-unexpired token and the function unreachable, the page render
and the refresh route both returned **no `Set-Cookie` header whatsoever**:

```
=== Page render with stale token + unreachable function ===
  (no Set-Cookie -> token NOT refreshed)
=== Refresh route with stale token + unreachable function ===
  (no Set-Cookie -> token NOT refreshed)
  body: {"access":true}
```

So access continues, `exp` and `revalidateAfter` stay exactly as they were, the
token still dies at its original hard expiry, and because `revalidateAfter`
stays stale the next render retries and the system heals itself. This is the
§13.9 rule holding in practice: **never mint a fresh token after
`lookup_failed`.**

A transport-level failure (network error, timeout, 401, non-JSON) is
deliberately indistinguishable from `lookup_failed` to the gate and is handled
identically. Only an explicit `not_paid` revokes.

### 14.6 server-only enforcement for teaser data

`lib/report-card-teaser.ts` begins with `import 'server-only'`. This is
load-bearing: it makes the **build fail** if that module is ever pulled into a
Client Component, which is exactly what would drag all 374 comments into the
browser bundle.

This required adding `server-only@^0.0.1` to `package.json` (it was not
previously a dependency). It is the official React package for this guarantee
and ships essentially no runtime code.

The structural fix matters more than the guard: `LibraryClient` no longer
imports `REPORT_CARD_COMMENTS` at all. The data arrives as a prop from the
gated Server Component. The small label/category maps are still imported
directly, which is fine, they are non-sensitive and the paywall legitimately
displays them.

### 14.7 Dataset exposure results (all 374 records checked)

Method: a scratch script split `lib/report-card-comments.ts` on record
boundaries so **every** record was accounted for rather than relying on one
regex, then searched the real rendered payload from a running server. It
reported `total records (by id): 374`, `texts extracted: 374`, **`records with
UNPARSED text: 0`**, so the claim below covers the whole dataset with no
silently skipped records.

| Payload | Comment texts present | Expected |
|---|---|---|
| Anonymous visitor | **10** | 10 (2 samples x 5 sections) |
| Revoked user (`not_paid`) | **10** | 10 |
| Paid user | **374** | all |

The 10 in both unauthenticated cases are exactly the intended samples: one
`positive` and one `growth` per section, chosen deterministically so the
preview honestly represents both tones.

> **CORRECTED 2026-07-29 (§15).** This section originally reported the paid
> payload as **373** of 374 and explained it as React splitting one comment's
> string across separate rendered nodes. **That explanation was wrong.**
>
> The real cause was a bug in the audit script itself: it split the source on
> `{ id:` boundaries, and the first record's opening brace shares a line with
> the array opener, so record #1 was silently dropped from the extraction
> before any searching happened. The shortfall was in the measurement, never in
> the payload.
>
> With the splitter corrected (split on `id:` rather than `{ id:`), the script
> reports `total records (by id): 374`, `texts extracted: 374`, `records with
> UNPARSED text: 0`, and the paid payload matches **374 of 374**.
>
> **The library has all 374 records and always did.** Do not go looking for a
> missing comment, and do not trust the old React explanation if you find it
> quoted elsewhere.

Also confirmed: zero occurrences of any non-sample comment in
`.next/static/chunks/`, so nothing leaks via the client bundle either.

### 14.8 Cookie flags (observed, not assumed)

```
set-cookie: rccl_access=<TOKEN>; Path=/; Expires=...; Max-Age=2592000; Secure; HttpOnly; SameSite=lax
```

- `HttpOnly` so client JS can never read the token; an XSS bug cannot exfiltrate access.
- `Secure` in production only, so `http://localhost` development still works.
- `SameSite=lax` **deliberately, not strict**: the Stripe success redirect is a
  top-level cross-site GET back to our domain, which `strict` would block.
- `Max-Age` derives from the token's own `exp`, so the browser drops the cookie
  at the same moment the signature stops verifying.
- Clearing uses `Max-Age=0`.

### 14.9 Success page and tamper tests

**Success page.** The `session_id` in the URL is never proof of purchase. It is
posted to `verify-session`, which relays it to the fulfill Edge Function, which
retrieves the session from Stripe and applies every §13.8 check before minting.

Retry behavior: terminal reasons (`not_paid`, `product_mismatch`,
`amount_mismatch`, `currency_mismatch`, `missing_email`, `invalid_session_id`,
`invalid_request`) fail immediately and are never retried. Everything else is
treated as transient and retried up to 3 times at 2s intervals, because a
brand-new payment can briefly race the webhook. On final failure the page never
claims the payment failed; it points to restore and says access is safe.
Fulfillment is idempotent, so refreshing the success page is harmless.

`verify-session` also re-verifies the token it was handed before setting it, so
a `RCCL_TOKEN_SECRET` mismatch between Vercel and Supabase fails loudly instead
of writing a cookie the gate would silently reject.

**Tamper tests, all rejected:**

| Attack | Result |
|---|---|
| No cookie -> refresh route | `{"access":false}`, no `Set-Cookie` |
| Attacker body `{"purchaseId":"...","access":true}` | `{"access":false}` (body ignored entirely) |
| Forged token signed with a different secret | `{"access":false}` |
| Empty/garbage `sessionId` | `{"granted":false,"reason":"invalid_request"}` |

### 14.10 Bug found and fixed mid-session: dead cookie never cleared

Caught while testing `not_paid`, and worth recording because it was introduced
and fixed within this session.

**The bug:** on the revocation branch the page returned `<PaywallClient />`
only. The paywall rendered correctly, but `AccessRefresher` was rendered solely
when `decision.freshToken` existed, so a revoked user's dead cookie was never
actually removed from the browser. Every subsequent page load would re-run the
full Edge Function round trip instead of short-circuiting on "no cookie".

**The fix:** `page.tsx` now renders `AccessRefresher` on the deny branch too,
whenever `decision.clearCookie` is set. Re-verified afterward: revocation still
shows the paywall, still clears the cookie, and the paywall branch still leaks
only the 10 samples.

### 14.11 What was tested, and how

Against a real production build (`npm run build` + `next start` on port 3100),
with test-only secrets passed through the process environment. **The existing
`.env.local` was deliberately not modified**, it holds live values.

| Check | Result |
|---|---|
| `npx tsc --noEmit` | clean |
| `npx eslint` on all new/changed files | clean |
| `npm run build` | succeeds; library + success routes correctly `ƒ` (dynamic) |
| All 9 gate token states | pass (§14.4) |
| Dataset exposure, 3 payloads, 374/374 records | pass (§14.7) |
| Cookie flags | pass (§14.8) |
| Full purchase flow -> cookie -> library unlocked | pass |
| 4 tamper tests | all rejected (§14.9) |

**Edge Functions were replaced by a local Node stub** for these tests
(`stub-functions.mjs` in scratchpad, modes: `valid` / `not_paid` /
`lookup_failed`), mirroring the real shared-secret auth and token format.
Nothing was deployed to Supabase.

### 14.12 Still untested (unchanged from §13.12, plus)

The stub does not reduce the §13.12 list. Still genuinely unverified:

- **Real Stripe webhook delivery** end to end (`stripe listen` / `stripe trigger`
  against the deployed function)
- **The `23505` idempotency race** under genuine concurrency
- **Resend delivery, entirely.** No API key, no verified sending domain. Restore
  email must not be described as working until a real test send succeeds.
- Shared-secret auth under real Supabase request routing
- Service-role RLS-bypass behavior against the real table

### 14.13 `/restore` is a placeholder

`app/report-card-comment-library/restore/page.tsx` exists **only** so the
"Already bought it?" link is never a 404. It does not call
`report-card-access-restore`, and it deliberately **does not claim email
restoration works**, because it does not: the Vercel-side request/confirm
routes are unwritten and Resend is unconfigured (§13.13 step 7).

It currently directs users to `info@getshorthandapp.com`, which is the address
already used across the site (`hello@` was used in a first draft and corrected).

### 14.14 What's next

1. ~~**Restore routes**: `request` and `confirm`~~ **The `confirm` half is now
   built and tested, see §15.** The `request` half is still unbuilt and still
   blocked on Resend. Note that §15 did **not** use the existing
   `report-card-restore` limiter as planned here; see §15.5 for why an IP-keyed
   limiter was the wrong choice for this path.
2. **Greg's setup steps** (§13.13), none of which are done.
3. **Deploy the four Edge Functions** with `verify_jwt = false`.
4. **Then** real end-to-end testing against Stripe test mode, which is the only
   thing that can close out §14.12.

---

## 15. Restore-confirm + refresh abuse protection (COMPLETE, 2026-07-29)

Narrow checkpoint following §14. Two things were in scope: build the
**restore-confirm** route only, and add **abuse protection** to
`/api/report-card-access/refresh`. The restore-*request* UI was explicitly out
of scope and is still not built.

### 15.1 Status: nothing committed, pushed, deployed, or configured

Unchanged from §14.1 and still true:

| | |
|---|---|
| Committed this session | **nothing** |
| Branch | `feature/report-card-comment-library-stripe` |
| Unpushed commits on branch | 3, all pre-dating §14 |
| Everything in §15.2 | **uncommitted working-tree changes** |

No Edge Function deployed. No secret set in any dashboard. No Stripe
Product/Price created. `.env.local` was **not** modified; it holds live values,
and all testing passed test-only secrets through the process environment
instead. The §13.2 migration remains the only thing that has ever touched live
infrastructure.

### 15.2 Files added and changed

**Added:**

| File | Purpose |
|---|---|
| `app/report-card-comment-library/restore/confirm/route.ts` | The restore-confirm Route Handler. |
| `app/report-card-comment-library/restore/failed/page.tsx` | Generic failure page, two buckets, no internal reasons. |

**Changed:**

| File | Change |
|---|---|
| `supabase/functions/report-card-access-restore/index.ts` | Split `not_paid` from `lookup_failed` (§15.6). Reason codes documented in the header. |
| `lib/ratelimit.ts` | Added 3 limiters + `hashedRateLimitKey`, `checkPurchaseRateLimit`, `checkRestoreConfirmRateLimit`. |
| `lib/report-card-gate.ts` | `evaluateAccess()` takes an optional `RevalidationThrottle`. |
| `app/api/report-card-access/refresh/route.ts` | Now rate limited; takes `req` so the limiter can see the request. |
| `app/report-card-comment-library/restore/page.tsx` | Comment only. User-facing copy deliberately unchanged (§15.10). |

### 15.3 Restore-confirm path and full flow

**Path: `/report-card-comment-library/restore/confirm`.** This is a
**Route Handler at a user-facing path**, not under `/api/`, and that is
deliberate: it is the exact URL the Edge Function already mints into
restoration emails (`RCCL_SITE_URL` + this path + `?token=`). Putting the
handler anywhere else would have meant either changing the emailed URL or
adding a second hop that leaks the token into a client-visible redirect.

It is a Route Handler rather than a page for the §14.3 reason: it must write a
cookie, and a Server Component cannot. Confirmed again in Next 16.2.1's own
docs (`cookies.md`: `.set` works only in a Server Function or Route Handler).

It responds to **GET**, because the visitor arrives by clicking a link in a
mail client, not via fetch.

Flow, in order:

1. **Extract `token`** from the query string.
2. **Validate the token shape locally** before anything else (§15.4).
3. **Rate-limit check**, keyed on the link (§15.5).
4. **Forward to the Edge Function** as `action: 'confirm'`, via
   `callReportCardFunction`, with the bearer secret. This route performs no
   database access and holds no Supabase key of any kind.
5. **On `granted: true`, re-verify the returned access token locally**
   before trusting it (§15.4).
6. **Set the cookie and redirect**, `303` to `/report-card-comment-library`,
   with `Set-Cookie` and `Location` in the same response.

`303` specifically, so the browser follows with a GET and a refresh of the
destination does not resubmit the restore link.

The token in the URL is **never** treated as proof of purchase. The Edge
Function verifies its HMAC and 30-minute expiry, then re-checks the live
purchase row, before minting anything.

### 15.4 Token validation, both directions

**Inbound, before forwarding.** A token that is absent, empty, or longer than
2000 characters is rejected locally and is **never forwarded** to the Edge
Function. This check sits deliberately **before** the rate limiter, so junk
requests cannot consume a legitimate link's budget.

**Outbound, before setting the cookie.** When the Edge Function returns
`granted: true`, the route calls `verifyAccessToken()` on the token it was
handed *before* writing it. If Vercel and Supabase ever drift on
`RCCL_TOKEN_SECRET` or on the wire format, this fails loudly at the moment of
restoration instead of writing a cookie the gate would silently reject on the
next page load, which to a user would look like a broken restore link. Same
guard `verify-session` already uses (§14.9), and it is tested: the
`wrong_secret_token` case redirects to the failure page and sets no cookie.

### 15.5 Rate-limit keys, thresholds, and fallback

| Route | Primary key | Budget | Secondary |
|---|---|---|---|
| `restore/confirm` | SHA-256 of the **presented link** | 8 / hour | IP, 60 / hour |
| `access/refresh` | SHA-256 of the **verified `purchaseId`** | 12 / hour | IP folded into the same key |

**No raw token is ever a rate-limit key, and no raw token or IP is ever
logged.** `hashedRateLimitKey()` hashes and truncates to 160 bits; log lines
record only `keyed=purchase` or `keyed=link`.

**Shared-school-network protection.** Neither route is IP-primary, and that is
the whole point. Teachers in one building share a single outbound NAT address.
The obvious implementation, reusing the existing IP-keyed `report-card-restore`
limiter at 5/hour, would mean **the second teacher in a school to ever click a
restore link gets blocked by the first.** That was in fact the first
implementation here and it was wrong; it is now keyed on the link itself, with
IP only as a wide secondary bound. Verified directly: after one link exhausted
its 8 attempts, **a different link from the same IP succeeded immediately.**

The `report-card-restore` limiter (5/h, IP) is now used by nothing. Left in
place for the future restore-*request* route, where an IP key is appropriate
because there is no link or purchase to key on yet.

**Fallback when the limiter itself is unavailable: fail open.** If Upstash is
unreachable, both helpers log and allow the request. These limiters bound cost,
they do not enforce access, and the real gate still runs afterwards. Failing
closed would convert an Upstash blip into a site-wide lockout of paying
customers.

### 15.6 not_paid versus lookup_failed (a real bug, fixed)

`report-card-access-revalidate` already drew this distinction correctly.
**`report-card-access-restore` did not.** Its confirm path collapsed three
different situations into one reason:

```ts
if (error || !purchase || purchase.status !== 'paid') {
  return jsonResponse({ granted: false, reason: 'purchase_not_found' }, 200);
}
```

So a **transient database failure** was reported to a paying customer as
"your purchase does not exist", and the caller had no way to tell a retryable
outage from a definitive answer. Now split:

| Situation | Reason | Retryable |
|---|---|---|
| Query **succeeded**, no matching row | `not_paid` | no |
| Query **succeeded**, row is `refunded` / `revoked` | `not_paid` | no |
| Query **failed** (actual DB/query error) | `lookup_failed` | **yes** |

The full reason list is now documented in the function's header comment:
`invalid_token`, `invalid_or_expired_token`, `not_paid`, `lookup_failed`,
`server_misconfigured`. Only `lookup_failed` is transient.

**This mirrors §13.9's rule and must stay mirrored.** A successful lookup that
finds nothing is a definitive answer. A failed lookup is not an answer at all.

### 15.7 Refresh: throttled only when revalidation is actually due

`evaluateAccess()` now accepts an optional `RevalidationThrottle`, consulted at
exactly one point: **after** the local HMAC and hard-expiry check pass, and
**after** `isRevalidationDue()` returns true. That is the only place the gate
makes a network call.

Consequences, both verified:

- A **locally valid token whose `revalidateAfter` has not passed is never rate
  limited and never touches the network.** Eight rapid refresh calls with a
  fresh token produced **0** Edge Function invocations. Ordinary reading is
  therefore never throttled.
- An **expired or forged token is rejected before the throttle is reached**, so
  the limiter can never be the thing that grants or denies access.

**A rate-limit block is treated exactly like `lookup_failed`** (§13.9): access
continues **on the existing token only**. Nothing is minted, refreshed, or
extended; `exp` and `revalidateAfter` are left untouched, so the token still
dies at its original hard expiry and the next render retries. Verified by
header inspection: a throttled request returned `{"access":true}` with **no
`Set-Cookie` at all**.

This closes the obvious attack on the design. Being throttled cannot be used to
dodge revocation, and cannot extend access past 30 days.

Gate state table, extended from §13.9:

| Token state | Revalidate result | Behavior |
|---|---|---|
| valid, `revalidateAfter` not passed | (not called) | grant, no network call, **not throttled** |
| valid, revalidation due | `valid: true` | set fresh token, grant |
| valid, revalidation due | `not_paid` | clear cookie, paywall |
| valid, revalidation due | `lookup_failed` | grant, **token untouched** |
| valid, revalidation due | **throttled** | grant, **token untouched**, retry next render |
| past `exp` / bad signature / malformed | (not called) | paywall, throttle never consulted |
| no cookie | (not called) | paywall |

### 15.8 Generic failure page

`/report-card-comment-library/restore/failed`. Every unsuccessful confirm lands
here, and the route collapses **all** internal reasons into exactly two buckets
before redirecting:

| Bucket | Meaning | Covers |
|---|---|---|
| `e=busy` | transient, worth retrying | `lookup_failed`, function unreachable, timeout, non-2xx, rate limited, token/secret drift |
| `e=link` | definitive, retrying will not help | expired link, bad signature, malformed/absent/oversized token, `not_paid` (missing, refunded, revoked) |

Anything unrecognised falls back to `link`. The real reason is logged
server-side and **never reflected to the visitor**, so the URL cannot be used
to probe whether a given purchase exists, was refunded, or was revoked. Tested
for the absence of the strings `lookup_failed`, `not_paid`, `invalid`,
`revoked`, `refunded`, and `purchase` in the rendered HTML of both buckets.

`robots: { index: false, follow: false }` on both new pages, matching the rest
of the feature.

### 15.9 Cookie flags

Identical to §14.8 and to `accessCookieOptions()`, observed on the wire:

```
rccl_access=<TOKEN>; Path=/; Max-Age=2592000; HttpOnly; SameSite=Lax
```

- `HttpOnly`, so client JS can never read the token.
- `SameSite=Lax`, not strict, for the same top-level cross-site redirect reason
  as §14.8.
- `Max-Age` derived from the token's own `exp`.
- **`Secure` is added in production only** (`NODE_ENV === 'production'`), so
  `http://localhost` development still works. `NODE_ENV` is build-time, not
  user input, so this is not attacker-controllable.

The cookie is built by hand in this route rather than via `cookies().set()`, so
that `Set-Cookie` and the redirect leave in a single response. The flags are
kept deliberately identical to `accessCookieOptions()`; **if one changes, change
both.**

Every failure path sets **no cookie at all**, verified in all 8 rejection cases.

### 15.10 Restore-request email flow is still NOT built

Unchanged and important:

- The Vercel-side `request` route does not exist. Nothing on the site sends a
  restoration email.
- Resend is still unconfigured: no API key, no verified sending domain
  (§13.13 step 7).
- `/report-card-comment-library/restore` is **still the §14.13 placeholder**,
  and still points users to **`info@getshorthandapp.com`**. Its user-facing
  copy was deliberately left unchanged this session, because it correctly says
  email restoration is not switched on, and that is still true.
- **Do not add a "send me a link" form until a real Resend test send
  succeeds.** Such a form would silently do nothing.

What *is* now true: if a user somehow has a valid restore link, the confirm
half will honor it. Only the half that generates and emails links is missing.

### 15.11 Tests, checks, and build

All against a real production build (`npm run build` + `next start` on 3100),
Edge Functions replaced by a local Node stub mirroring the real shared-secret
auth and token wire format. Nothing deployed. Real Upstash credentials were
read from `.env.local` for the limiter tests **without modifying the file**;
test limiters use their own key prefixes and never touch production buckets.

| Check | Result |
|---|---|
| Targeted suite (sections A-F) | **42 / 42 pass** |
| Dataset exposure, 374/374 records, 0 unparsed | pass, see below |
| `npx tsc --noEmit` | clean |
| `npx eslint` on all new/changed files | clean |
| `deno check` on the changed function | clean |
| `deno lint` (excl. `no-import-prefix`) | clean |
| `npm run build` | succeeds, both new routes registered as dynamic |
| Em dash rule | no em dashes in any new file |

What the 42 cover: the full success flow and that the issued cookie really does
unlock the library; all 8 rejection cases, each checked for both the correct
bucket and the absence of a cookie; failure-page reason leakage in both
buckets; that a locally valid token makes zero function calls; the refresh
throttle engaging, still granting, and minting nothing; and a re-run of every
§14.4 gate state to confirm no regression.

Exposure results on the restore paths, all 374 records accounted for:

| Payload | Comment texts | Expected |
|---|---|---|
| failure page `e=busy` | 0 | 0 |
| failure page `e=link` | 0 | 0 |
| confirm with a bad token | 0 | 0 |
| `/restore` placeholder | 0 | 0 |
| library, no cookie | 10 | 10 |

### 15.12 Testing lesson: an orphaned next start served a stale build

Recorded as a **testing-process lesson, not a product bug.** There is nothing
to fix in the application.

Two consecutive rounds of test failures looked exactly like real code defects,
including cases that could not possibly have reached the failing code path. The
cause was an **orphaned `next start` process still holding port 3100** from an
earlier launch, serving a stale build. `pkill -f "next start"` did not match it
on this platform and reported zero processes, so every "clean rebuild, re-run"
cycle was still being answered by the old server.

What actually found it: `netstat -ano` filtered to `:3100` showed a live PID
that did not appear in the node process list. `taskkill //PID <pid> //F`
cleared it, and the identical test run then passed 42/42.

**For the next session:** on Windows, verify the listening PID with `netstat`
and kill by PID. Do not trust `pkill -f` to have worked, and treat "a code path
that cannot run is failing" as evidence of a stale server before it is treated
as evidence of a bug.

### 15.13 What is next (unchanged from §14.14, minus the confirm half)

1. **Restore-request route + UI**, blocked on Resend (§13.13 step 7).
2. **Greg's setup steps** (§13.13), none of which are done.
3. **Deploy the four Edge Functions** with `verify_jwt = false`. Note the
   restore function changed this session (§15.6) and must be redeployed with
   that fix.
4. **Then** real end-to-end testing against Stripe test mode, the only thing
   that can close out §14.12.

---

## 16. First successful end-to-end Stripe test-mode purchase (2026-07-29)

**The payment path works end to end.** A real test-mode checkout was completed
against the deployed Edge Functions and the branch preview deployment. This
closes most of the §14.12 untested list, which no amount of local testing could
reach.

### 16.1 What was verified, with the evidence

| Claim | Evidence |
|---|---|
| Checkout session created | `create-session` returned a live `cs_test_...` URL, 200 |
| Payment completed | Stripe test card `4242...`, redirected back to the preview |
| **Webhook signature verified** | webhook returned **200**, not 400 |
| Exactly one purchase row | `total_rows = 1`, `distinct_sessions = 1` |
| Correct product | `amount_total = 499`, `currency = 'usd'`, `status = 'paid'` |
| Fulfillment succeeded | `report-card-checkout-fulfill` returned **200** |
| Full library unlocked | all 374 comments rendered for the paying user |
| Shared secrets match | see §16.3 |
| No retries, no errors | zero 500s in the logs, single webhook delivery |

**Signature verification passed affirmatively, not by absence of evidence.** A
bad signature makes `constructEventAsync` throw, which returns **400**. An
earlier unsigned probe confirmed that 400 path fires. The real delivery
returned 200, so it got past verification, parsed the event, and ran
fulfillment to completion.

### 16.2 The idempotency race ran for real and held

The two independent fulfillment callers both fired, about 3 seconds apart:

| Time (UTC) | Function | Status |
|---|---|---|
| 19:14:21.807 | `report-card-checkout-webhook` | 200 |
| 19:14:24.772 | `report-card-checkout-fulfill` | 200 |

Both call the same `fulfillCheckoutSession()`. Result: **one row**, with
`created_at` exactly equal to `updated_at`. The second caller neither inserted
a duplicate nor updated the winner's row. It took the select-finds-existing
path and returned the same `purchaseId`, which is why the success page could
unlock with a valid cookie.

**Caveat, stated honestly:** 3 seconds apart is sequential, not simultaneous.
This exercised the **select-finds-existing** branch, NOT the `23505`
unique-violation branch, which requires true concurrency. The practical
double-fulfillment failure mode is confirmed handled; the `23505` path remains
formally untested and is low risk.

### 16.3 Secret parity confirmed indirectly but decisively

Neither shared secret was directly asserted, but both are proven by behavior:

- **`REPORT_CARD_FUNCTIONS_SECRET`** matches: `report-card-checkout-fulfill`
  returned 200 rather than 401, so Vercel's bearer token was accepted by the
  deployed function.
- **`RCCL_TOKEN_SECRET`** matches: the library unlocked. A token minted in Deno
  was verified by `lib/report-card-access.ts` under Node. Had these drifted,
  `verify-session` would have refused to set the cookie (§14.9), by design.

### 16.4 §14.12 status after this test

| Item | Status |
|---|---|
| Real Stripe webhook delivery end to end | **CLOSED** |
| Shared-secret auth under real Supabase routing | **CLOSED** |
| Service-role RLS-bypass against the real table | **CLOSED** (row written to an RLS-enabled, zero-policy table) |
| `RCCL_TOKEN_SECRET` parity Vercel/Supabase | **CLOSED** |
| `23505` idempotency race under genuine concurrency | still open, low risk (§16.2) |
| **Resend delivery** | **still open, unconfigured** |

### 16.5 Environment used, and what is still pending

Tested on the **branch preview deployment** of
`feature/report-card-comment-library-stripe`, not production. Six Preview-scoped
Vercel variables were configured, including `SUPABASE_FUNCTIONS_URL`, the one
missing from §13.4 until it was caught during the commit review.

**Vercel Authentication was temporarily disabled** for Preview deployments so
Stripe's redirect back from Checkout could reach the success page. Stripe's
redirect is a plain browser navigation and carries no SSO cookie, so the
protection wall would have broken the success page while leaving the webhook
unaffected (Stripe calls Supabase directly, never Vercel). **Protection was
re-enabled immediately after the test.**

**Still pending, both deliberately:**

1. **Resend**: no API key, no verified sending domain. The restore-*request*
   route and UI remain unbuilt (§15.10). Do not add a "send me a link" form
   until a real test send succeeds.
2. **Production merge**: the branch is unmerged and no PR is open. Everything
   above was proven on a preview deployment. Still test mode only; no live
   Stripe key, and no real payment has ever been taken.

### 16.6 Deployment version note

Setting `STRIPE_WEBHOOK_SECRET` caused Supabase to restart **all** Edge
Functions with the updated environment, bumping every function's version by one,
including `delete-account`, which this project never touched. `ezbr_sha256`,
`created_at`, and `updated_at` were unchanged on all five, confirming no code
was redeployed. A version bump alone does not indicate a redeploy.

---

## 17. Resend setup map and restore-request audit (DOCUMENTATION ONLY, 2026-07-29)

**No code was changed, deployed, merged, or configured in this session.** This
section is the result of a read-only audit of the existing restore code, done to
establish exactly what Resend setup it expects before any of it is built. The
implementation plan that came out of this audit is in §17.7, and it is a
proposal awaiting approval, not a record of work done.

### 17.1 Resend account setup

| Item | Value | Notes |
|---|---|---|
| Domain to verify | `getshorthandapp.com` | A subdomain such as `mail.getshorthandapp.com` also works. Nothing in the code hard-codes either one. |
| Sender address | `ShortHand <info@getshorthandapp.com>` | Not set in code. Read entirely from `RESEND_FROM_ADDRESS` and passed straight through to Resend's `from` field, so the `Name <addr>` display form is accepted. |
| API key permissions | **Sending access only**, restricted to the verified domain | The function never reads, lists, or manages anything. It makes exactly one call: `POST https://api.resend.com/emails`. |

`info@getshorthandapp.com` is the right sender because it is already the address
used across the whole site, including on both restore pages
(`restore/page.tsx`, `restore/failed/page.tsx`), so replies reach a real inbox.
`hello@` was used in a first draft and corrected (§14.13); do not reintroduce it.

### 17.2 Where the variables live: Supabase only

| Variable | Location | Read at |
|---|---|---|
| `RESEND_API_KEY` | **Supabase Edge Function secrets only** | `report-card-access-restore/index.ts` |
| `RESEND_FROM_ADDRESS` | **Supabase Edge Function secrets only** | same |
| `RCCL_SITE_URL` | **Supabase Edge Function secrets only** | same, builds the emailed link |

**No Resend variable belongs in Vercel.** The Vercel side never touches Resend
and never sends mail. All three are read with `Deno.env.get` inside the Edge
Function. This matches the secrets table in §13.4; adding the two Resend keys
takes the configured Supabase secret count from six to eight.

### 17.3 `RCCL_SITE_URL` is shared across Preview and Production

**This is the trap in this section.** Supabase secrets are project-wide. They
are not branch-scoped and not environment-scoped, unlike the Vercel Preview
variables used in §16. There is exactly one `RCCL_SITE_URL` and both Preview and
Production read the same value.

It builds the link inside every restoration email. So whatever it is set to is
where **every** restore email points, for every user, regardless of which
deployment they bought from.

Consequences, both real:

- Set to the Preview URL, production emails send paying teachers to a preview
  deployment (which is normally behind Vercel Authentication).
- Set to production, the Preview restore flow cannot be tested, because the
  emailed link will leave the preview deployment entirely.

There is no way to split this per environment with the current design. It must
be flipped deliberately, in the order given in §17.8, and flipping it is a
required cutover step, not a cleanup detail.

### 17.4 The restore-request flow has no caller (the real gap)

> **Superseded by §17.9 (2026-07-29).** The relay route and form described as
> missing below were built later the same session. The audit findings are kept
> verbatim because they explain *why* the code is shaped the way it is. What
> remains true: Resend is still unconfigured, so the flow still sends nothing.

The Edge Function's `action: "request"` handler is **fully built and deployed**.
Nothing invokes it. Verified three ways:

1. There is no `app/api/report-card-access/restore` route. The only report-card
   API routes that exist are `report-card-access/refresh`,
   `report-card-checkout/create-session`, and
   `report-card-checkout/verify-session`.
2. Grepping `app/` and `lib/` for the `request` action literal returns nothing.
3. `/report-card-comment-library/restore` is still the §14.13 placeholder. It
   has **no email form**, and tells users to email `info@getshorthandapp.com`
   manually.

**Configuring Resend alone will therefore change nothing observable.** No code
path reaches the send. Two pieces must still be built: a Vercel API route that
relays the request action, and a form that posts to it. The confirm half is
complete and was proven in §15/§16; only the half that generates and emails
links is missing. This restates §15.10 and remains true.

### 17.5 Success is not observable from the HTTP response

`handleRequest` **always** returns `{ ok: true }`, whether the email matched a
paid purchase, matched nothing, or was malformed. This is deliberate
anti-enumeration design, documented in the function's own header comment: the
caller must not be able to tell whether a given address bought the product.

A missing `RESEND_API_KEY` or `RESEND_FROM_ADDRESS` is **logged and returns
early**, never thrown, so the response is still `{ ok: true }`.

**A completely unconfigured Resend setup is therefore indistinguishable from a
working one, from the outside.** Delivery must be verified through:

- **Supabase Edge Function logs** (the `console.error` lines name the exact
  missing variable, and log Resend's status code and body on a failed send), and
- **the Resend dashboard** (delivery events).

Never treat a `200` or an `{ ok: true }` from this route as evidence that mail
was sent. That inference is invalid by design.

### 17.6 The restore email is plain text only

The send body sets `text` and no `html` field. This is deliverable and fine, and
arguably better for spam filtering, but it means no styling, no logo, and no
button: the recipient sees a bare URL. Worth knowing before anyone reports it as
a bug. Subject line is `Your Report Card Comment Library access`. The link
expires in 30 minutes (`RESTORE_TOKEN_TTL_SECONDS`).

### 17.7 Implementation plan (APPROVED, steps 1-2 BUILT: see §17.9)

Steps 1 and 2 were approved and are now built; §17.9 records what actually
shipped and where it differs from the text below. Steps 3 and 4 remain pending
and are still blocked on Resend.

1. **Vercel relay route**, `app/api/report-card-access/restore/route.ts`:
   POST, `runtime = 'nodejs'`, `dynamic = 'force-dynamic'`. Validates the email
   shape, applies an IP-keyed rate limit (this path is IP-keyed unlike
   restore-confirm, because here there is no link to key on; see §15.5 for why
   confirm went the other way), relays via `callReportCardFunction`, and returns
   the same generic success for every outcome including its own failures, to
   preserve §17.5.
2. **Restore form** replacing the §14.13 placeholder: email field, one submit
   button, and a single terminal state saying that if that address bought the
   library, a link is on its way, and to check the inbox and the spam folder. It
   must **never** confirm or deny that the address was found. Keep the
   `info@getshorthandapp.com` fallback line for the genuinely stuck. Keep
   `noindex, nofollow`.
3. **Preview testing** covering paid email, unknown email, expired link, reused
   link, and successful unlock (§17.8).
4. **`RCCL_SITE_URL` flip** per §17.8, before production cutover.

### 17.8 Required ordering for `RCCL_SITE_URL`

Because of §17.3, the flip is ordered, not incidental:

1. Set `RCCL_SITE_URL` to the **exact Preview URL** of the branch deployment,
   including scheme and no trailing slash.
2. Run the full Preview restore test matrix (§17.7 step 3). Vercel
   Authentication has to be off for the emailed link to land, exactly as in
   §16.5, and must be **re-enabled immediately afterwards**.
   **Done 2026-07-29/30, results in §17.10.** Authentication was re-enabled and
   confirmed. Expiry and tampering remain outstanding.
3. At production cutover, set `RCCL_SITE_URL` to
   **`https://getshorthandapp.com`**.
4. Re-verify with one real restore email from production after the merge. Until
   step 3 happens, any restore email a real customer triggers points at a
   preview deployment.

**Do not skip step 3.** It is the single change that most easily gets forgotten,
because nothing fails loudly when it is wrong: the emails still send, still
return `200`, and still look fine in the logs. They just point somewhere the
customer cannot reach.

### 17.9 What was actually built (steps 1-2, 2026-07-29)

*(Status line below is superseded by §17.10. Kept for the record of what was
true when steps 1-2 landed.)* **Not committed, not pushed, not deployed, no PR.**
Resend is still unconfigured and `RCCL_SITE_URL` is unchanged. Steps 3 and 4 of
§17.7 have not been started.

**Current status:** committed and pushed to
`feature/report-card-comment-library-stripe`, deployed to Preview, Resend
configured and verified, and runtime-tested per §17.10. Still no PR and not
merged to production.

**Files:**

| File | Change |
|---|---|
| `app/api/report-card-access/restore/route.ts` | **new**, the relay route |
| `app/report-card-comment-library/restore/RestoreRequestClient.tsx` | **new**, the form |
| `app/report-card-comment-library/restore/page.tsx` | rewritten, placeholder replaced |

#### Differences from the §17.7 proposal

**1. The response contract is asymmetric, not uniformly generic.** §17.7 said
the route would return generic success for *every* outcome. That was overcautious
and is not what was built. Malformed input now gets a 400:

| Case | Response |
|---|---|
| Invalid JSON body | `400 { error: 'invalid_request' }` |
| Missing / non-string / malformed / >320-char email | `400 { error: 'invalid_request' }` |
| Valid email, purchased | `200 { ok: true }` |
| Valid email, never purchased | `200 { ok: true }` (identical) |
| Edge Function unreachable or erroring | `200 { ok: true }`, real failure logged |
| Rate limited | `429` |

This does not weaken anti-enumeration. A 400 is a statement about the request,
not about any address: a well-formed email can never produce one, so a 400
cannot separate a customer from a stranger. What must stay indistinguishable is
the three 200 cases, and they are byte-identical, **including when our own
infrastructure fails**. That last case is the subtle one: surfacing a real error
only to people whose send actually attempted would be a purchase oracle, so
transport failures are logged server-side and shown as success.

**2. No rate limiter was added.** §17.7 implied new limiter config. Not needed.
`report-card-restore` already existed in `lib/ratelimit.ts` at **5 requests per
hour, IP-keyed**, defined during earlier work and never wired to anything. It
was evidently reserved for exactly this route. `lib/ratelimit.ts` is
**unchanged**; the route calls `checkRateLimit(req, 'report-card-restore')`.

Note the deliberate contrast with restore-confirm, which rejected an IP-primary
key because a shared school NAT would let one teacher's link block the next
(§15.5). That reasoning does not transfer: this endpoint has no per-link
identifier to key on, and the quantity being limited is "how much mail one host
can make us send", which is inherently per-IP.

**3. The page stayed a server component.** The form was extracted to
`RestoreRequestClient.tsx` so `page.tsx` keeps emitting its `noindex, nofollow`
metadata normally. Verified in the prerendered output: the built
`restore.html` contains `<meta name="robots" content="noindex, nofollow"/>`.
The route is now `○ (Static)` in the build manifest, which is correct: the shell
is static and the form is entirely client-side.

#### Form states as built

| State | Behavior |
|---|---|
| Idle | Labelled email field, "Email me a link" |
| Locally invalid | Inline `role="alert"`, `aria-invalid`, red border, **no request sent**; clears on next keystroke |
| Submitting | Field and button disabled, "Sending..." |
| Submitted | Terminal message, form replaced, not re-armed |
| Rate limited (429) | "Too many requests from this connection", form stays usable |
| Network / server failure | **Identical to Submitted**, by design |

The submitted message says a link is on its way *if that address was used to buy
the library*, states the 30-minute expiry, and points at the spam folder. It
never confirms or denies that a purchase was found.

Accessibility: `<label htmlFor>` bound to the input, `type="email"`,
`autoComplete="email"`, `inputMode="email"`, `autoCapitalize="none"`,
`autoCorrect="off"`, `spellCheck={false}`, `maxLength={320}`, `aria-invalid`,
`aria-describedby` pointing at the error, `role="alert"` on errors and
`role="status"` on the success message. `noValidate` on the form so the custom
message is what users see rather than the browser's native bubble.

The `info@getshorthandapp.com` fallback appears in **both** the idle and
submitted states. It is load-bearing while Resend is unconfigured, because in
that window the form completes successfully and silently sends nothing (§17.5).

#### Client-side validation is not a security boundary

The component's `EMAIL_RE` and 320-char bound intentionally duplicate the
route's, which in turn match the Edge Function's. The client copy exists only so
honest typos get corrected without a round trip. All three layers must be kept
in agreement: if the client ever accepts something the route rejects, users get
an opaque terminal message instead of a useful correction.

#### Verification

- `npx tsc --noEmit`: **clean, exit 0**
- `npm run lint`: **54 problems (52 errors, 2 warnings), all pre-existing.**
  Confirmed by stashing the changes and re-running: the baseline is identical at
  54/52/2. The three new/changed files produce **zero** lint output. The
  pre-existing errors are unrelated (`react/no-unescaped-entities`,
  `react-hooks/set-state-in-effect` in `components/LeadGate.tsx`, and an
  `<img>` warning in `components/FeatureVideo.tsx`).
- `npm run build`: **succeeded.** `/api/report-card-access/restore` registers as
  `ƒ (Dynamic)`; `/report-card-comment-library/restore` as `○ (Static)`.
- **No test framework exists in this repo.** `package.json` defines only `dev`,
  `build`, `start`, and `lint`, and there are no `*.test.*` or `*.spec.*` files.
  "Tests" here means typecheck + lint + build. Nothing was run against a live
  Supabase or Resend at the time this section was written.

  **Superseded by §17.10:** runtime verification on Preview has since happened.
  The matrix is no longer outstanding except for token expiry and tampering.

#### Still true after this work

*(Superseded by §17.10. Resend is now configured and verified, and a real test
send has been confirmed. The paragraph below described the state before that.)*

Submitting the form today does nothing observable. Resend has no API key and no
verified domain, so the Edge Function logs the missing variable and still
returns `{ ok: true }`. The UI cannot tell, by design. Do not describe restore
email as working until a real test send is confirmed in the Resend dashboard.

### 17.10 Preview runtime verification results (2026-07-29/30)

Run against the branch Preview deployment with `RCCL_SITE_URL` pointed at the
Preview URL and Vercel Authentication temporarily off. **Vercel Authentication
was re-enabled afterwards and confirmed in a fresh incognito window.**

All timestamps below are UTC. Note the run spans midnight: the happy path ran
2026-07-30 00:49-00:50 UTC, which was the evening of 2026-07-29 Eastern.

#### Results

| # | Test | Result |
|---|---|---|
| 1 | Happy path: purchased email | **Pass.** Generic response, email delivered, link pointed at the exact Preview deployment, confirmation redirected, all 374 comments unlocked |
| 2 | Unknown email | **Pass.** Byte-identical generic response, no email delivered, single `200`, no confirm follow-up |
| 3 | Malformed email via form | **Pass.** Inline error, no request sent, no rate-limit budget consumed |
| 4 | Malformed email direct (`{"email":"not-an-email"}`) | **Pass.** `400 invalid_request` |
| 5 | Malformed email direct (invalid JSON body) | **Pass.** `400 invalid_request` |
| 6 | Rate limiting | **Pass.** Threshold confirmed at 5/hour, 6th request `429` |
| 7 | Limited-state UI | **Pass.** Correct message, form stays usable rather than being replaced |
| 8 | Resend dashboard | **Pass.** No sends for unknown addresses |

**Neither direct malformed request (#4, #5) reached the Edge Function.**
Confirmed by absence from the Supabase logs: validation in
`app/api/report-card-access/restore/route.ts` runs before the limiter and before
`callReportCardFunction`, so a malformed body is rejected entirely within Vercel.

#### Rate-limit threshold: how 5 was actually proven

The run did not start from an empty window, and the reconciliation matters
because a naive reading of the logs looks like a contradiction.

`report-card-restore` is `Ratelimit.slidingWindow(5, '1 h')`, IP-keyed. Sliding,
not fixed: each request counts for one hour from its own timestamp and drops out
individually. That is what makes the arithmetic below valid.

At run start (01:52:06):

| Prior request | Age | Counted? |
|---|---|---|
| 00:49:46 happy path | 62 min | No, aged out |
| 00:58:38 unknown email | 53 min | **Yes** |

So the IP began with **1 of 5 already consumed**. Four new requests were allowed
(01:52:06, 01:52:29, 01:53:15, 01:53:35), reaching the total of 5. The next form
submission returned `429`.

1 surviving + 4 allowed = 5 at the threshold, 6th blocked. **The configured
5-per-hour threshold is confirmed.** No clean-window retest is required.

**The `429`s never reached Supabase.** Only four new Edge Function entries exist
for this run, and the blocked requests produced none, because `checkRateLimit`
returns before `callReportCardFunction` is called. Short-circuit behavior
directly observed, not inferred.

> Reading these logs later: the Network tab and the Edge Function logs count
> different things and will not match. The browser sees every POST to
> `/api/report-card-access/restore`; Supabase sees only those that passed the
> limiter. One `200` and four `429`s in DevTools alongside four Edge Function
> `200`s is consistent, not contradictory, once the surviving prior request is
> accounted for.

#### Known non-error in the webhook log

`report-card-checkout-webhook` has a `400` at 2026-07-30 00:49:35 UTC. It
**predates** the successful purchase webhook (01:14:21) by about 25 minutes and
is **not a retry of it**. It is a known setup-time rejected request, almost
certainly a signature check against a payload signed with a different secret
during configuration.

Earlier notes said the purchase run had "no retries or errors". That is true of
the successful run specifically, but should not be read as the function's entire
history being clean. Do not treat this `400` as a new fault.

#### Still outstanding

- **Token expiry.** Deliberately excluded from the live matrix. To be tested
  later with a locally generated pre-expired token, **without changing the shared
  30-minute TTL**.
- **Tampering.** Note when testing: a tampered *cookie* is rejected by local HMAC
  in `lib/report-card-gate.ts` with no network call, so a passing tamper test
  produces **zero** Edge Function log lines. Absence of logs is the pass
  condition. A tampered *link token* does reach the Edge Function and should come
  back not-granted.
- **`RCCL_SITE_URL` flip to `https://getshorthandapp.com`** at production
  cutover, per §17.8 step 3.
- Production merge, production Vercel variables, Stripe live-mode setup, and a
  final real-money purchase test.

## 18. Production cutover Phase 1 + prep inventory (2026-07-30)

**Read-only sessions. No code, secrets, Stripe, Vercel, or Supabase state was
changed by either pass below.**

### 18.1 Phase 1: PR opened

- **PR:** [#8](https://github.com/Lebed-Digital/shorthand-website/pull/8) —
  `feature/report-card-comment-library-stripe` into `main`.
- **Rollback reference** (pre-merge `main`):
  `0b939c30124feec6f45ee5d86b54f97b1f286ed8`.
- 34 files changed, +4540/-24. Diff audited line-by-line for secrets: every
  `SUPABASE_SERVICE_ROLE_KEY` hit is a `Deno.env.get(...)` lookup by name, not
  a value. Migration only creates `report_card_purchases`, RLS enabled, zero
  policies (service_role-only).
- Checks: Vercel deployment pass, Vercel Preview Comments pass. Merge state:
  CLEAN / MERGEABLE. **Not merged** — merge is Greg's call, per the
  application-code branch-and-wait rule.

### 18.2 The six Vercel Production environment variables

| # | Variable | Read at | Exposure | Production value | Source |
|---|---|---|---|---|---|
| 1 | `STRIPE_SECRET_KEY` | `lib/stripe.ts:8` | Server-only | **New live value** — restricted key, Checkout Sessions: Write only | Stripe |
| 2 | `STRIPE_PRICE_ID` | `app/api/report-card-checkout/create-session/route.ts:11` | Server-only | **New live value** — live price ID, not interchangeable with test | Stripe |
| 3 | `NEXT_PUBLIC_SITE_URL` | `lib/stripe.ts:20` | **Browser-exposed** | `https://getshorthandapp.com` | Application URL |
| 4 | `REPORT_CARD_FUNCTIONS_SECRET` | `lib/report-card-functions.ts:39` (sends) / `supabase/functions/_shared/auth.ts:15` (verifies) | Server-only | Must **match** the Supabase-side value exactly | Shared secret |
| 5 | `RCCL_TOKEN_SECRET` | `lib/report-card-access.ts:44` / `supabase/functions/_shared/access-token.ts` | Server-only | Must **match** the Supabase-side value exactly | Shared secret |
| 6 | `SUPABASE_FUNCTIONS_URL` | `lib/report-card-functions.ts:27` | Server-only | Same Supabase project serves both environments (secrets are project-wide, §17.3), so **same as Preview**: `https://muywwvbmpjotcffocyjb.supabase.co/functions/v1` | Supabase |

This matches the §13.4 table exactly; no drift found between code and docs.
`RCCL_SITE_URL` is **not** part of this list — it is Supabase-only (§17.2/17.3),
and `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY`
(`lib/supabase.ts`) belong to an unrelated, pre-existing Supabase client.

### 18.3 Webhook event and URL

- Subscribed event: **`checkout.session.completed` only**
  (`supabase/functions/report-card-checkout-webhook/index.ts:15,61-66`; any
  other event type is acknowledged `200` and ignored, by design).
- Production webhook URL (same for Preview and Production, since the webhook
  authenticates via Stripe signature, not by environment):
  `https://muywwvbmpjotcffocyjb.supabase.co/functions/v1/report-card-checkout-webhook`

### 18.4 Stripe live-mode items to create

1. Product: "Report Card Comment Library"
2. One-time Price, **$4.99 USD** exactly — `fulfillment.ts:16-18` hardcodes
   `EXPECTED_AMOUNT_TOTAL = 499` / `EXPECTED_CURRENCY = 'usd'`; any other
   amount or currency is rejected as `amount_mismatch`/`currency_mismatch`
3. Live webhook endpoint at the URL in §18.3, event `checkout.session.completed`
4. Live webhook signing secret → Supabase `STRIPE_WEBHOOK_SECRET`
5. **Two** live API keys are needed, not one:
   - Restricted (Checkout Sessions: Write only) → Vercel `STRIPE_SECRET_KEY`
   - Full-access → Supabase-side `STRIPE_SECRET_KEY`

### 18.5 Risks and ambiguities found

1. **Supabase secrets are project-wide**, so `STRIPE_SECRET_KEY` and
   `STRIPE_WEBHOOK_SECRET` cannot differ between Preview and Production on the
   Supabase side — there is one Supabase project. Flipping these to live values
   at cutover means **Preview's webhook/fulfillment path goes live-mode at the
   same moment**, same trap already documented for `RCCL_SITE_URL` in §17.3,
   just not previously called out for the Stripe secrets. Decide deliberately.
2. **Two distinct live secret keys, same variable name.** Easy to paste the
   same key into both Vercel and Supabase by mistake; they must be different
   keys with different scopes, mirroring the existing test-mode split.
3. **No Stripe publishable key exists in the code.** Checkout is created
   server-side and the browser follows `session.url`
   (`create-session/route.ts:43`) — do not add a
   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` unprompted.
4. No other doc/code mismatch found. The six-variable table, webhook event,
   and webhook URL are consistent across code comments and this doc.

### 18.6 Tomorrow's checklist

**A. Stripe live-mode** — switch to live mode; create Product; create $4.99
Price; create restricted key (Vercel); create full-access key (Supabase);
create webhook endpoint (§18.3 URL, `checkout.session.completed` only); copy
signing secret.

**B. Vercel Production variables** — add all six from §18.2, Production scope
only; confirm only `NEXT_PUBLIC_SITE_URL` is browser-exposed; leave Preview
values untouched.

**C. Supabase secrets** — update `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
**and `STRIPE_PRICE_ID`** to live values (note §18.5.1); flip `RCCL_SITE_URL` to
`https://getshorthandapp.com` and read it back to confirm exact value; confirm
Resend secrets unchanged; do not redeploy functions unless required.

> **§19 correction (2026-07-30): `STRIPE_PRICE_ID` was missing from this list**
> when cutover was actually performed. Only `STRIPE_SECRET_KEY` and
> `STRIPE_WEBHOOK_SECRET` were updated on the Supabase side; the Supabase
> `STRIPE_PRICE_ID` secret was left holding the **test** price ID. This caused
> the first live purchase to fail fulfillment silently. See §19 for the full
> incident and recovery. `STRIPE_PRICE_ID` is now added to this checklist item
> above and must be treated as a required live-mode secret on **both**
> Vercel and Supabase, not just Vercel.

**D. Final pre-merge verification** — re-confirm PR #8 still CLEAN/MERGEABLE
and branch hasn't drifted; three-way match of code expectations vs. Vercel
Production vs. Supabase; confirm Vercel Authentication still on for Preview;
merge PR #8 (Greg's decision); proceed to the smoke test / controlled
real-purchase / restore-test phases of the cutover plan.

## 19. First live purchase: silent fulfillment failure and recovery (2026-07-30)

**Incident.** The first real production purchase ($4.99, live Stripe) charged
successfully, but the success page showed "We could not confirm this yet."
Both `report-card-checkout-webhook` and `report-card-checkout-fulfill`
returned HTTP 200, and Vercel's `verify-session` route also returned 200, so
no error appeared anywhere in Supabase or Vercel logs. Despite the real
charge succeeding, **zero rows** were written to `report_card_purchases` for
this purchase; the table still held only the one test-mode row from
2026-07-29.

**Root cause.** `fulfillCheckoutSession()` (`supabase/functions/_shared/fulfillment.ts`)
reads `STRIPE_PRICE_ID` from the **Supabase** secret store, a separate value
from the Vercel `STRIPE_PRICE_ID` used to create the Checkout Session. During
cutover, only the Vercel-side `STRIPE_PRICE_ID` was updated to the live price.
The Supabase-side `STRIPE_PRICE_ID` secret still held the **test-mode** price
ID, so when fulfillment retrieved the live session and compared its actual
line-item price against the expected price, they did not match. This trips
the `product_mismatch` branch (`fulfillment.ts:91-94`), which is a
**non-retryable** rejection: the webhook acknowledges it with 200 (by design,
so Stripe stops retrying an event that will never succeed as coded), and
`verify-session` also returns 200 with `granted: false` **without logging
anything** (`verify-session/route.ts:60-62`). A silent, correctly-coded
denial, not a crash, which is why nothing appeared in error-level logs on
either platform. Confirmed by Greg reading back the Supabase secret and
finding it still set to the test price ID.

**Recovery.** Greg updated the Supabase `STRIPE_PRICE_ID` secret to the live
price `price_1TyxR1J2hMFVGCT3zjNupHSE`, then reloaded the existing Stripe
success URL once (same `cs_live_...` Checkout Session, no new charge). This
re-invoked `verify-session` → `report-card-checkout-fulfill` against the same
session ID, which now matched the corrected price, and fulfillment completed
successfully.

### 19.1 Read-only verification performed after recovery

- **Exactly one new live row.** `report_card_purchases` now has two rows
  total: the pre-existing 2026-07-29 test-mode row and one new row created at
  `2026-07-30 18:07:45.513 UTC`. No duplicates.
- **Row matches the live purchase.** `stripe_checkout_session_id` begins
  `cs_live_...`, `stripe_price_id` = `price_1TyxR1J2hMFVGCT3zjNupHSE` (the live
  price ID), `amount_total` = 499, `currency` = `usd`, `status` = `paid`.
- **Timestamp correlation.** The successful retry's fulfill call in Supabase
  logs (`18:07:45.588 UTC`) lands within 75ms of the row's `created_at`
  (`18:07:45.513 UTC`), confirming that specific call is what wrote it.
- **Granted: true confirmed indirectly.** Vercel logs show
  `GET /report-card-comment-library/success` at `18:07:41`,
  `POST /api/report-card-checkout/verify-session` at `18:07:42` (200,
  rate-limit allowed), then `GET /report-card-comment-library` at `18:07:45`
  (200) — consistent with `verify-session` receiving `granted: true`, setting
  the access cookie, and the browser proceeding to the unlocked library. This
  matches Greg's direct observation that all 374 comments became visible.
- **No new errors.** No error/warning-level logs in Vercel for the recovery
  window or since. No Supabase Edge Function log entries beyond the expected
  200s. `get_runtime_errors` returned none.
- **No duplicate webhook delivery.** Only the original webhook delivery
  (`17:58:07.994 UTC`) appears in logs; the retry did not re-trigger Stripe's
  webhook, only Vercel's own `verify-session` → fulfill call, which is
  idempotent on `stripe_checkout_session_id` (unique constraint), consistent
  with exactly one row existing despite three total fulfillment attempts
  (original webhook, original fulfill, retry fulfill) against the same
  session.
- **Refresh-safe access confirmed by code review.** `lib/report-card-gate.ts`
  (`evaluateAccess`) verifies the `rccl_access` cookie's HMAC and hard expiry
  locally on every request, no network call, and only calls Supabase to
  revalidate when the 24-hour `revalidateAfter` window has passed. A page
  refresh right after purchase will preserve access purely from the cookie
  already set by `verify-session`. Even once revalidation is due, a
  transient Supabase failure defaults to keeping access rather than
  revoking it (`lookup_failed` and unexpected-shape responses both fall
  through to `{ access: true }`); only an explicit `not_paid` from Supabase
  revokes.

### 19.2 Verdict

The purchase path is now confirmed healthy for this transaction: one real
$4.99 charge, one matching database row, no duplicates, no new errors, access
correctly granted and refresh-safe. The underlying cause (`STRIPE_PRICE_ID`
must be updated on **both** Vercel and Supabase, not just Vercel) is now
called out explicitly in §18.6.C above so it is not repeated. No refund, code
change, secret rotation, redeploy, or restore-by-email test was performed as
part of this verification.

## 20. Production restore-by-email verified: known + unknown email (2026-07-30)

### 20.1 Known-email restore (request + confirm)

Greg ran a real production restore using the email from the live purchase in
§19.

- **Request.** `POST /api/report-card-access/restore` at `18:11:33 UTC` → 200,
  rate limiter allowed. Matching Supabase `report-card-access-restore` call
  (`action: request`) at `18:11:34.678 UTC` → 200.
- **Confirm.** `GET /report-card-comment-library/restore/confirm` at
  `18:12:14 UTC` → **303** to the library path. Per
  `restore/confirm/route.ts`, a 303 to `LIBRARY_PATH` is reachable only from
  the success branch (line 117); every failure branch redirects to
  `/restore/failed` instead and logs `console.error`, none of which fired.
  Matching Supabase confirm call at `18:12:16.094 UTC` → 200.
- **Link origin.** The confirm request landed on the Production deployment
  aliased only to `getshorthandapp.com` and its domain variants, consistent
  with the emailed link pointing at production rather than a preview URL.
- **No duplicate purchase row.** `report_card_purchases` held exactly 2 rows
  before and after this test; neither `created_at` nor `updated_at` changed.
  Restore never writes to this table by design.
- **No new errors** in Vercel or Supabase logs.
- **Incidental, not a fault:** Production rolled over to a new deployment
  (triggered by the §19 docs commit) between the request and confirm calls.
  Both deployments alias to the same production domain; no disruption.

### 20.2 Unknown-email restore (anti-enumeration)

- `POST /api/report-card-access/restore` at `18:16:24.914 UTC` → **200**,
  same shape and status as the known-email request in §20.1, byte-identical
  from the caller's perspective. Matching Supabase call at
  `18:16:26.006 UTC` → **200**.
- **No account existence revealed.** Per code review
  (`supabase/functions/report-card-access-restore`, §17.5): the `request`
  action always returns `{ ok: true }` regardless of whether the email
  matches a purchase, so a 200 here carries no signal either way.
- **No purchase row created or changed.** Row count still 2, most recent
  `updated_at` unchanged at `18:07:45.513 UTC`.
- **No email sent, inferred not directly observed.** The send path is only
  reached on a matched purchase; since no row changed and this is by
  definition an unmatched email, Resend was never called. This is inferred
  from code + database evidence; no direct Resend dashboard log was checked.
- **No new errors** in Vercel or Supabase logs.

### 20.3 Production status: LIVE and fully verified

Every planned production test has now passed:

| Test | Result |
|---|---|
| Real $4.99 live Stripe purchase (after the §19 `STRIPE_PRICE_ID` fix) | PASS |
| Exactly one matching `report_card_purchases` row, no duplicates | PASS |
| Access granted, all 374 comments visible, refresh-safe via cookie | PASS |
| Restore-by-email, known purchaser (request + confirm) | PASS |
| Restore-by-email, unknown email (anti-enumeration) | PASS |
| Link points to `getshorthandapp.com`, not Preview | PASS |
| No duplicate charges, no duplicate rows, no unexpected errors | PASS |

**The Report Card Comment Library ($4.99, Stripe) is production-live and
fully verified end to end.** Still deliberately deferred, unchanged from
§16.4: token expiry (test with a locally generated pre-expired token, not by
changing the shared 30-minute TTL) and tampering (cookie and link-token). See
§16.6's "Still outstanding" note for how to test each without touching shared
config.

## 21. Launch closeout (2026-07-30)

- **PR #8** merged via squash as `5babad2734731da888af8bcfd6b20cb1f5af9064`.
- **`main`** clean and synced at `2ab472d4fef7980919d09f84fa8c88594fba085d`.
- **`feature/report-card-comment-library-stripe`** deleted locally and on
  origin; nothing left depends on it.
- Live Stripe product and $4.99 price configured and confirmed correct
  (§18-19).
- One real-money live purchase passed (§19). Initial access grant failed
  silently because the Supabase `STRIPE_PRICE_ID` secret still held the
  test-mode price ID; updating it to the live price ID and reloading the
  existing paid success URL recovered access **without a second charge**.
- Known-email and unknown-email restore-by-email both passed in production
  (§20), including anti-enumeration.
- Exactly one live `report_card_purchases` row exists, no duplicates, no
  runtime errors observed anywhere in this process.
- Remaining, deliberately deferred: expired-token and tampering tests
  (§16.4/§16.6), neither of which blocks launch.

**No current launch blockers.**

## 22. Refund handling: current state and manual procedure (2026-07-30)

**Refunds are not automated.** Confirmed by code review: the webhook
(`supabase/functions/report-card-checkout-webhook/index.ts`) subscribes to
and handles `checkout.session.completed` only; any other event type,
including `charge.refunded` or `refund.created`, is acknowledged and ignored
(`{ received: true, ignored: true }`). Stripe's dashboard is likewise
subscribed to `checkout.session.completed` only. **Refunding a purchase in
Stripe has zero automatic effect on `report_card_purchases` or on the
purchaser's access.**

This is not accidental scope: the schema's check constraint already allows
`status in ('paid', 'refunded', 'revoked')`, and every access path
(`report-card-access-revalidate`, `report-card-access-restore`,
`lib/report-card-gate.ts`) already enforces `status = 'paid'` correctly
wherever it reads the row. Only the *writer* for the refunded/revoked
transition was never built. Given $4.99 pricing and expected near-zero
refund volume, building a refund webhook handler now would be premature; the
manual procedure below is sufficient until refund volume ever makes it
annoying.

### 22.1 Manual refund procedure (use this every time, until automated)

1. Refund the payment in the Stripe dashboard as normal.
2. Find the matching row by the **Stripe checkout session ID or payment
   intent ID** (not email; an email can match multiple purchases over time,
   the session/intent ID cannot).
3. Run, scoped to that exact identifier:
   ```sql
   update public.report_card_purchases
   set status = 'refunded'
   where stripe_checkout_session_id = '<exact session id>'
     and stripe_payment_intent_id = '<exact payment intent id>'
   returning id, stripe_checkout_session_id, status, updated_at;
   ```
4. Confirm the `returning` output is exactly one row, matches the intended
   purchase, and shows `status = 'refunded'`. Never delete the row; it stays
   the permanent, traceable record of a legitimate refund.
5. Access dies automatically within 24 hours via the existing revalidation
   cycle (`ACCESS_REVALIDATE_SECONDS`, `_shared/access-token.ts`). To confirm
   immediately rather than waiting: clear the `rccl_access` cookie for
   `getshorthandapp.com` in the browser that made the purchase, then reload
   `/report-card-comment-library`. A cookie-less request always re-checks the
   database, so a `refunded` row shows the $4.99 paywall immediately.

**The risk of skipping step 3:** not fraud exposure (the product is 374
static text comments, worth nothing to resell), but record drift, Stripe
shows refunded while Supabase still shows paid, discovered only much later.
Revisit automating this only if refund volume ever makes the manual step
easy to forget.

### 22.2 Personal test-purchase refund, verified end to end (2026-07-30)

Greg's own real production purchase (§19, the live-mode `cs_live_...`
session, distinct from the earlier `cs_test_...` test-mode row from
2026-07-29, which was untouched throughout) was refunded in Stripe and
cleaned up using the procedure above, to keep the purchase history honest:
one real test purchase, fully refunded, zero real customer purchases to
date.

- **Row identified and confirmed** before any change: exactly 2 rows existed
  in `report_card_purchases`, both `status = 'paid'`. The `cs_live_...` row
  (id `33be7f7f-3181-41c8-bc12-b3a64b5e7b5d`) was confirmed against the
  Stripe-side refunded payment intent (`pi_3TyyDXJ2hMFVGCT31dUGRx49`) before
  the update ran.
- **Update executed**, scoped by both `stripe_checkout_session_id` and
  `stripe_payment_intent_id`. Exactly one row returned and changed:
  `status: 'paid' -> 'refunded'`, `updated_at` bumped by the existing
  trigger.
- **No other row affected.** Full-table re-select afterward showed the
  `cs_test_...` row (id `f5a1c6a7-487b-439b-8ae0-e3e1a93382fe`) unchanged,
  still `status = 'paid'`, `updated_at` identical to its original
  `created_at`. Row never deleted, permanently traceable by both its Stripe
  session and payment-intent IDs.
- **Access revocation confirmed live**, not just at the database level:
  Greg cleared the `rccl_access` cookie in the browser that made the
  purchase and reloaded `/report-card-comment-library` on production. Result:
  the $4.99 paywall, exactly as an unauthenticated visitor sees it. Confirms
  the revalidation logic in `lib/report-card-gate.ts` behaves as designed
  when `status != 'paid'`.
- **No code changed.** This was a one-time manual data correction using
  machinery that already existed; §22.1 is the reusable procedure for any
  future refund, real or test.

---

## 23. Inline blog CTA repositioned: speed over volume (2026-08-20)

**Status: shipped as an experiment, unproven.** This section is the baseline
and change point for a later read, not a result. Do not describe it as a win
until there is post-change click and sales data to compare against.

### 23.1 Baseline being replaced

Measured over the 31 days ending 2026-08-20:

| Metric | Value |
| --- | --- |
| Posts carrying the inline CTA | 9 (all `LIBRARYCTAMARKER` posts) |
| Reach | ~273 GSC clicks / ~350 GA4 sessions |
| Inline CTA clicks | 2 |
| CTA click-through rate | ~0.6% |
| Sales from this funnel | 0 |

### 23.2 Hypothesis

The plumbing works (the marker splice, the tracking, the checkout, all verified
in §14 to §21). The offer was the problem. The old block led with
"has 374 comments organized by section and category," which competes directly
with the free comments the reader has just finished scrolling through on the
same page. A teacher who already has enough usable comments for tonight does
not want more comments.

So the CTA now sells **time and findability**: getting to the one comment that
fits a specific student in seconds, instead of scrolling. Volume moved to a
supporting proof line at the bottom.

### 23.3 What changed

Single edit in `components/LibraryCtaBlock.tsx`, so all 9 posts move together.

- **Leads with the outcome**: right comment in seconds, not scrolling a long list.
- **Names the real differentiators**: keyword search across every comment, plus
  filters for section, category, tone, and grade band, then name
  personalization and copy, then next student. Every one of those was verified
  against `app/report-card-comment-library/LibraryClient.tsx` before being
  claimed. Nothing in the copy describes a feature the product does not have.
- **Count demoted** to a dim supporting line, still live from
  `REPORT_CARD_COMMENTS.length`, so it cannot go stale.
- **Free-generator off-ramp removed from inside the paid block.** The old
  "Just need one custom comment right now? The free generator still does that,
  no payment needed" line advertised the free alternative at the moment of
  conversion. The generator itself is unchanged and still linked from the body
  copy of all 9 of these posts, so nothing is hidden from readers.
- **Added a button** below the paragraph copy, alongside the existing inline
  text link. This is the one change that is not pure copy: a text-only link at
  0.6% may be an affordance problem as much as a message problem. It also
  preserves a second tracked click target now that the generator link is gone.
  It confounds the experiment slightly; if the read afterwards is ambiguous,
  that is why.

Three entries in `LIBRARY_CTA_INTROS` (`app/blog/[slug]/page.tsx`) were
reworded so the handoff into the new offer does not itself lead with volume:

| Slug | Was | Now |
| --- | --- | --- |
| `report-card-comments-for-struggling-students` | "Need more, across every category?" | "Need to find the right one faster, across every category?" |
| `second-grade-behavior-report-card-comments` | "Want more, beyond second grade behavior?" | "Writing comments beyond second grade behavior too?" |
| `free-report-card-comment-generator` | "...browse a large set of ready-made comments and copy what fits:" | "...search ready-made comments and copy the one that fits:" |

The other six intros are untouched.

### 23.4 Deliberately not changed

Blog body copy, the number of free comments in any post, marker position, CTA
placement in the post, the library and paywall themselves, pricing, SEO titles
and meta descriptions, the free generator, and the `cta_click` event name and
`cta_source` values.

### 23.5 Tracking note for the later read

`cta_source` is still the post slug and the event is still `cta_click`, so
before/after comparison by post is clean. `cta_destination` values changed:

- `report-card-library-inline` — unchanged, still the inline text link.
- `report-card-library-inline-button` — new, the button.
- `report-card-library-inline-generator` — retired. Any hits after 2026-08-20
  are stale sessions on cached pages.

Total CTA clicks per post should be read as the sum of the first two.

### 23.6 Verification performed

`tsc --noEmit` clean, `next build` clean. All 9 marker posts confirmed in the
built HTML to render the new block with the correct post-specific intro, the
live 374 count, both links, and no leftover marker string. Both `PDF_GATES`
posts confirmed unaffected (the gate branch is checked first and neither post
has a library intro, so the two splices cannot collide). Both links fired
`cta_click` with the expected payload under a stubbed `gtag` in a real browser
on `preschool-report-card-comments` and `report-card-comments-for-behavior`.

### 23.7 Final shipped copy (post-review tweak)

PR #60 merged to `main` 2026-08-20. Before merge, Greg flagged one sentence in
`components/LibraryCtaBlock.tsx` as wordy: "...filter by section, category,
tone, and grade band until what is on screen actually fits the student you
are writing about." Tightened in the same PR (commit `f2d4744`) to:

> "...filter by section, category, tone, and grade band to quickly find one
> that fits the student you're writing about."

Full block text as merged:

> {post-specific intro} The **Report Card Comment Library** is built to get
> you to the right comment in seconds instead of scrolling a long list.
> Search every comment by keyword, or filter by section, category, tone, and
> grade band to quickly find one that fits the student you're writing about.
>
> Type the student's name once and it drops into every comment. Copy the one
> that fits, then move to the next student.
>
> **[ Find your comments faster ]**
>
> 374 comments, organized by section and category. One-time $4.99, no
> subscription.

No other wording, behavior, or tracking changed from §23.3 to §23.6 above;
this section exists only so the doc records the exact sentence that actually
shipped, not the pre-review draft.
