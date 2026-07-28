# Report Card Comment Library — Session Handoff

**Last updated:** 2026-07-28
**Status:** Step 6 in progress. Behavior section complete (145). Library at 160 of ~450-480.
**Next task:** Draft the ADHD section (target 60-80).

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

| File | Role |
|---|---|
| `lib/report-card-comments.ts` | Schema types, `CATEGORIES_BY_SECTION`, all comment data |
| `app/report-card-comment-library/page.tsx` | Route wrapper, noindex |
| `app/report-card-comment-library/LibraryClient.tsx` | All UI: tabs, filters, search, personalization, edit, copy |

The route is not linked from anywhere on the site yet.

**Uncommitted changes exist on this branch** (both files modified). Step 5 fixes
and all Step 6 content are uncommitted as of this handoff.

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

**Deferred content ideas (do NOT add during ADHD):** specials/substitutes/
different-adult contexts, unstructured settings (recess, hallway, lunch),
digital/device conduct, preschool-appropriate participation. Evaluate these only
after the full library exists.

---

## 8. Boundary decisions (hard-won, apply them)

The single most important rule for the next session:

- **`behavior/focus-and-attention`** = attention during a **specific** task, subject, setting, or time of day. No implication of a persistent pattern. **Carries no support clauses.**
- **`adhd` section** = a **broader or recurring** attention/executive-function pattern, and **may name supports that help**.

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
read-only analysis tools, not repo files).

`C:\Users\doubl\AppData\Local\Temp\claude\c--Projects-Shorthand-website\b6e8418c-f6e8-45eb-b80b-8342ee951476\scratchpad\`

| Script | Checks |
|---|---|
| `audit-comments.mjs` | Totals by section/category/tone, grade-band coverage, **duplicate texts**, **missing `[Student]` token**, **em dashes**, and a parse-count vs. raw-count check that catches malformed records |
| `behavior-audit.mjs` | Full text dump by category/tone, opening-phrase and closing-phrase frequency, per-category grade bands, **Jaccard near-duplicate detection** (same tone, ≥0.40). Currently filtered to `section === 'behavior'`; one line to generalize |
| `growth-structures.mjs` | Classifies growth comments into structural frames, reports stock-frame share |

**Standard verification after every batch:**

```bash
npx tsc --noEmit -p tsconfig.json 2>&1 | grep -i "report-card-comments\|LibraryClient"
grep -o "id: '[^']*'" lib/report-card-comments.ts | sort | uniq -d   # duplicate IDs
node <scratchpad>/audit-comments.mjs
```

Greg handles browser testing himself. Only ask him to test when a change is
technically risky or a regression is suspected.

---

## 10. Library status: 160 comments

| Section | Populated | Target | Categories locked | Categories populated |
|---|---|---|---|---|
| behavior | **145** | 150-200 | 8 | 8 |
| adhd | 4 | 60-80 | 5 | 4 |
| preschool | 4 | 80-100 | 6 | 4 |
| academics | 4 | 40-60 | 4 | 4 |
| social-emotional | 3 | 30-40 | 4 | 3 |
| **TOTAL** | **160** | ~450-480 | 27 | 23 |

The non-behavior counts are the original Step 3 sample comments only.

### RESOLVED: the ADHD category-count question

Greg flagged that planning said five ADHD categories while the data showed four.

**Verified against `CATEGORIES_BY_SECTION` in `lib/report-card-comments.ts`:
the schema locks FIVE ADHD categories.**

```
adhd: ['attention-and-focus', 'impulse-control', 'organization',
       'task-completion', 'self-regulation-strategies']
```

`task-completion` is locked but **unpopulated**: no Step 3 sample was written
for it. The four visible categories are an artifact of sampling, not a schema
discrepancy. **The ADHD map must cover all five, including `task-completion`.**

The same pattern exists elsewhere and is expected, not a bug. Four locked
categories across three sections have zero comments so far, and each must be
covered when its section is drafted:

| Section | Locked but currently unpopulated |
|---|---|
| adhd | `task-completion` |
| preschool | `social-emotional-development`, `early-math` |
| social-emotional | `self-awareness` |

Verify this list against `CATEGORIES_BY_SECTION` at the start of each section,
rather than inferring the category list from what already has comments.

Schema §2 guidance for ADHD: ~12-16 per category if even, but
`self-regulation-strategies` may want fewer, more specific entries than
`attention-and-focus`. Section total is the tracked target, not per-category quotas.

---

## 11. Next steps after ADHD

Remaining: preschool (80-100), academics (40-60), social-emotional (30-40).
Roughly 230-260 comments after ADHD.

Then, in order:

1. Whole-library structural review (deferred frame-A and stock-closer thinning)
2. Evaluate the deferred content ideas from §7
3. Decide whether behavior's 145 and any other under-target sections stand
4. Update `Brain/Report Card Comment Library - V1 Schema.md` §10 revision log with the Step 6 content decisions and the additional wording rules in §6 above
5. Commit the branch, open the PR (this route is `.tsx`, so it is **branch-and-wait**, never self-merge)
6. Stripe integration, gating, checkout
