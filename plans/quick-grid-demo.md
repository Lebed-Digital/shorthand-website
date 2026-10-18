# Plan: interactive Quick Grid demo on the website

Status: revision 3, approved. Session 1 and Try Again implemented on branch `feat/quick-grid-demo` (2026-10-17). Session 2 done, including the privacy-page clause in Greg's approved wording (2026-10-17). Remaining before merge: Greg's iPhone pass on the preview, then a final Codex implementation review.

Session 2 notes:
- The manual privacy check plays the demo in **its own browser sessions** (an interaction run with a Try Again round, and a separate forged-event run), not inside the main visit. So the main visit's `CUSTOM` list and its "five custom events" label are unchanged.
- The replay positive control is the page's description paragraph, not the "Quick Grid" heading, because the `h1` is split into two text nodes ("Quick " and `<em>Grid</em>`).
- Result on 2026-10-17: all 13 Quick Grid checks pass. Overall 125/126. The one failure ("Frequently asked questions" readable on the comment generator) fails on `main` too (113/114) and isn't from this branch. Recorded in `Brain/Known Bugs.md` for later; likely a false positive in the script (the same heading is on `/chatgpt-teacher-freebies`, whose text the script doesn't treat as public).
- Measured on local production builds of `/features/quick-note`: route JS 212.8 KB on `main` and 215.6 KB on the branch (compressed, **+2.8 KB**). Layout shift 0 on both, at 390x844 and 1280x800. Measured locally with a layout-shift observer, not Lighthouse on the preview (the preview is behind Vercel login).

Session 1 notes (small departures from the text below, all from implementation):
- Frame `max-width` is **380px**, not 400px. At 400px the grid gets 376px and fits 5 columns on desktop, which breaks the 4-column acceptance check. 380px gives 356px, so 4.
- Frame `line-height` is **1.5**, the app's real value (Tailwind preflight), instead of the 1.2 in section 6.
- Overflow chips get `min-height: 36px` to meet the tap-target rule. In the app they are about 33px tall.
- **Try Again (approved by Greg 2026-10-17, after testing the Session 1 preview).** See "Try Again" under section 4.
- All analytics work moved to Session 2: the three `captureEvent()` calls, the `TrackedLink` `onClick` prop, and the `__shTrack` stub cases in the spec. `captureEvent()` is typed against `CUSTOM_EVENTS`, so the calls can't compile before the allowlist lands, and the allowlist belongs in the same commit as the privacy clause.
Audited: 2026-10-17, against `pulse 2.0` origin/main `a2bcf8a` and `shorthand-website` origin/main `b011777`.

## Goal

A visitor taps a fictional student, taps one or more behavior chips, hits Save, and sees the tile marked as logged, with no sign-up. It should look and behave like the real app's grid, say plainly that it is practice, and end in a natural CTA into the app's guided demo.

## Hard constraints

- Zero changes to the production app (`pulse 2.0`).
- No Supabase, no auth, no API routes, no new dependencies. The demo itself writes nothing to localStorage, sessionStorage, IndexedDB or cookies. Reload or remount starts fresh. (PostHog and GA keep their existing storage. That is not the demo's.)
- No free-text input anywhere in the demo.
- Isolated: one new component and its CSS module. The only shared-code changes are the analytics allowlist, the privacy disclosure, tests, and one optional prop on `TrackedLink` (all listed below).

## Terminology (avoid a wrong-file mistake)

- In app code, **"Quick Note" means the AI parent note** ("Quick Note Home", `StudentDetailView.tsx`). That is NOT this feature.
- The grid is the app's **Log Notes grid**: `pulse 2.0/src/components/log-notes/`.
- The website already calls it **"Quick Grid"** (`app/features/quick-note/page.tsx`). Use "Quick Grid" in all copy and the `quick_grid` analytics value.

## 1. Audit: the app's grid (source of truth for the port)

Three presentational components, 560 lines, with **no Supabase, storage or network code inside them**:

| File | Lines | What it does |
|---|---|---|
| `log-notes/StudentLogGrid.tsx` | 213 | Header ("Log Notes", class select, "N logged" status, "+ Multiple", "Full note"), `auto-fill minmax(68px,1fr)` grid, gap 6px, first-name sort, "Tap a student to log a note" hint |
| `log-notes/StudentTile.tsx` | 116 | 64px-min tile, 28px initials avatar (sage/15 bg, sage-dark text), 11px bold name, `active:scale(0.97)`; logged = sage border + sage/5 bg + 16px check badge top-right |
| `log-notes/NoteComposerSheet.tsx` | 231 | Bottom sheet + scrim: name + close, first 6 chips wrap ("Quick"), rest in one horizontal scroll row, collapsed "Add a note (optional)", Save (disabled until something is chosen), "More options" |

Helpers: `utils/quickChips.ts` (`slice(0, 6)`), `utils/logSession.ts` (note count and per-tile state kept separately), `utils/compactNames.ts`, `utils/getDisplayName.ts`, `utils/cn.ts`. Icons: lucide `Check`, `X`, `ChevronRight`.

State and saving live in `PulseScreen.tsx` (`openSheetForStudent` clears tags on every open, `dismissSheet` discards the draft, `handleSheetSave` closes only on an accepted save). **Not touched.**

Fonts: the app body is Montserrat, and `h1, h2, h3` are **Boogaloo** (`src/index.css:69`). That covers the grid's "Log Notes" title and the sheet's student name.

Behavior to preserve:
- Multiple chips per note (toggle on/off, `aria-pressed`, check SVG on selected chips).
- Chip palette: positive = emerald (50 bg / 200 border / 700 text; selected 500 bg, white text), growth = rose, neutral = amber (selected amber-400).
- Quick area = first 6 chips, wrapping. Overflow = one horizontal scroll row with the next chip partly visible.
- Repeated saves: the same student can be logged again; the tile stays checked and the note count goes up.
- Note count and student count are independent (`logSession.ts`: 3 notes for 1 student is count 3, one checked tile).
- Tags cleared on dismissal and on every open.
- Motion is minimal in the real app: tile press-scale and `transition-all`. The sheet appears with no slide-in. Don't add motion the app doesn't have.

Data the port copies:
- Chips: the app's **first 18 default indicators, in curated order** (`hooks/useClassroomData.ts:86`): On Task, Participation, Redirected, Off Task, Unprepared, Disruption | Peer Conflict, Kindness, Incomplete, Persistence, Independent Work, Teamwork, Leadership, Growth Mindset, Star Work, Self-Regulation, Check-In, Modified Work. That puts 6 in Quick, 12 in the overflow row, and includes all three chip colors.
- Students: the app's guided-demo names (Falcon, Blueberry, Zigzag, Comet, `WelcomeModal.tsx:43`) plus 8 more in the same whimsical style, 12 total, all with unique single-word names (so `compactDisplayNames` isn't needed). No realistic human names.

**The app's guided demo does not use this grid.** `showGrid` requires `!isSandboxMode` (`PulseScreen.tsx:995`), so `?demo=true` walks the visitor through the full composer and a report instead. The CTA copy must not promise the same grid (section 4, Copy).

## 2. Audit: the website

- Next 16.2.1, React 19.2, lucide-react 1.7, framer-motion installed. **No Tailwind**: plain `app/globals.css` + CSS modules. Dark-only site, no light theme to support.
- `/features/quick-note` is a server component (metadata) that already renders client components (`TrackedLink`, `FeatureVideo`). It is not a redirect source in `next.config.ts`. Its `.detail-hero` has 24px side padding at 768px and below.
- Analytics today (`instrumentation-client.ts`):
  - SDK autocapture, rage clicks and dead clicks are off. Pageview and pageleave are on. Session replay is on, with all inputs masked, and text masked only on sensitive paths and inside `.ph-mask`. No `blockClass` override, so the SDK default `ph-no-capture` (present in installed `posthog-js` 1.435.8) blocks a subtree from replay.
  - `lib/posthog-events.ts` `CUSTOM_EVENTS` is the allowlist. `filterCustomEvent()` runs in `before_send` and drops unlisted events, properties and values, but deliberately keeps SDK metadata (`$`-prefixed properties, `distinct_id`, utm fields).
  - **`app_link_clicked` is fired by one site-wide capture-phase click listener** for every `<a>` pointing at `app.getshorthandapp.com`. Outside `nav`, `footer` and `.blog-content`, it records `cta_location: 'page'`. It's our own code, so `ph-no-capture` doesn't affect it. Components never fire it themselves.
  - `window.__shTrack` sends with `send_instantly: true`. It's absent on previews, localhost and automated browsers, where `captureEvent()` is a no-op.
  - `TrackedLink` adds first-touch attribution (`withAttribution`), fires GA4 `cta_click` if `gtag` exists, and navigates on the GA callback or after a 300ms fallback, so it still navigates when GA is blocked.

## 3. Reuse vs. isolated copy: **isolated copy** (unchanged)

The app's components can't be imported: separate repos, Tailwind classes the website doesn't have (and adding Tailwind's preflight would restyle the whole marketing site), and props typed against app database rows. A shared package for ~400 lines is over-engineering. Port it faithfully: same markup structure, sizes, colors and behavior, with the Tailwind classes hand-translated into one CSS module. The header comment names the source files and commit `a2bcf8a`, so drift is traceable.

## 4. Implementation

### Files

New:
- `components/QuickGridDemo.tsx`: client component. Grid, sheet, counters, timer, CTA, analytics calls.
- `components/QuickGridDemo.module.css`: the translated styles.
- `tests/quick-grid-demo.spec.ts`: Playwright spec (see Acceptance).

Changed:
- `app/features/quick-note/page.tsx`: render `<QuickGridDemo />` above the existing video.
- `lib/posthog-events.ts`: three new events (section 5). Update the header comment's event count ("six" becomes "nine").
- `lib/posthog-events.test.ts`: one allowlist test for the new events.
- `app/privacy/page.tsx`: one clause added to the PostHog paragraph (section 5).
- `tests/manual/posthog-privacy-check.mjs`: demo steps and expectations (section 5).
- `components/TrackedLink.tsx`: an optional `onClick?: () => void` prop, called first thing in `handleClick`. Additive, no behavior change for existing callers.

### DOM structure

```
<div class="root ph-no-capture">       ← replay-blocked; contains EVERYTHING below
  <div class="frame">                  ← white app card, position: relative
    <div class="pane" inert={open}>    ← everything the scrim covers
      header: "Log Notes" · "N logged"
      hint: "Tap a student to log a note"
      grid of 12 tiles
      result row (after first Save): demo time, counts, CTA link
    </div>
    {open && <div class="scrim" />}    ← siblings of pane, so NOT inert
    {open && <div class="sheet" role="dialog">…</div>}
  </div>
  <p class="disclaimer">…</p>          ← always visible
</div>
```

`ph-no-capture` goes on the outermost wrapper only, so the grid, sheet, timer, counters and CTA are all excluded from replay, including content inserted after load. It doesn't suppress the three explicit `captureEvent()` calls or the site-wide `app_link_clicked` listener.

### State (all `useState`/`useRef`, nothing persisted)

- `sheetStudentId: string | null`
- `selectedTags: string[]`, set to `[]` on open, on dismiss (✕, scrim, Escape) and after Save
- `noteCount: number`, +1 on every valid Save
- `loggedIds: Set<string>`, the checked tiles; its size is the student count
- `startedAt: useRef<number | null>`, `startedSent`/`completedSent: useRef<boolean>`
- `elapsedMs: number | null`, frozen after the first valid Save
- `returnFocusId: useRef<string | null>`, the tile to refocus on close

A valid Save means the sheet is open and at least one chip is selected. Save is disabled otherwise, so a click on a disabled Save never counts.

### What's dropped or changed vs. the app, and why

| App element | Demo | Why |
|---|---|---|
| "Add a note (optional)" text | Removed | No typed data, and chip-only is the app's own fast path |
| Offline/queued state, class selector, "+ Multiple" | Removed | Nothing real to sync; one class; multi-select is a second flow |
| Header "Full note" button | Removed | It's a second route into the full composer, which the demo doesn't have. The sheet's link (next row) covers it without adding a background control. |
| Sheet "More options" button | A plain link: "More options are in the full app ›" to the guided demo | One element, no extra panel state, nothing to dismiss. Counts as a demo CTA. |
| `history.pushState` for Android back | Removed | On a marketing page it breaks the browser Back button |
| Sheet as a body portal, `position: fixed` | Sheet inside the frame, `position: absolute` | A viewport-wide sheet on a long desktop page looks wrong and fights page scroll |
| `aria-modal="true"` | `role="dialog"` without `aria-modal`; the background pane gets `inert` | The sheet covers only the demo, not the page (see Keyboard) |
| Montserrat body, Boogaloo `h1`-`h3` | Website system font for both, same weights | Avoids two font downloads for one widget. Accepted visual difference: the "Log Notes" title and the sheet's student name lose Boogaloo's rounded display style. |

### Responsive layout

- Frame: `width: 100%; max-width: 400px`, centered, white, radius 32px, app `card-shadow`, 12px padding.
- Grid: `repeat(auto-fill, minmax(68px, 1fr))`, gap 6px, exactly as the app. Four columns need 4 × 68 + 3 × 6 = **290px** of content width. Inside `.detail-hero`'s 2 × 24px gutters and the frame's 2 × 12px padding, that means:
  - **3 columns below a 362px viewport** (320 and 360 included: at 360 the content width is 288px).
  - **4 columns from 362px** (375, 390, 414 and desktop).
  - Accepted as is. Shrinking app spacing to force 4 columns at 360 would trade away fidelity.
- 12 students = 4 rows at 3 columns, 3 rows at 4. No internal grid scroll.
- Frame `min-height: 480px`, so the sheet always has room. The grid is top-aligned with blank space below it, like the app screen.
- Sheet: anchored to the frame's bottom, `max-height: calc(100% - 16px)`, column layout:
  - Top (fixed): grab handle, student name, Close (✕, 44px target).
  - Middle (`overflow-y: auto; overscroll-behavior: contain`): Quick chips, overflow row.
  - Bottom (fixed): Save, then the "More options" link.
  - Close and Save are never inside the scrolling chip area.
- Short viewports (landscape phone, 667 × 375): the 480px frame is taller than the viewport, so Close and Save may not both be on screen at once. Requirement: **both are reachable by ordinary page scrolling, without scrolling the chip area.** No viewport-aware layout.
- Opening the sheet moves focus into it (see Keyboard), and the browser's native focus scrolling brings the sheet into view. No `scrollIntoView` code.
- Overflow chip row: `overflow-x: auto` inside the sheet only, with `min-width: 0` on its parents, so it never widens the page.
- Scrim: covers the frame only (`position: absolute; inset: 0`), click dismisses.
- Text sizes in `rem` (the app's 11px = 0.6875rem, etc.), so a visitor's browser font-size setting scales them. Tile names truncate with an ellipsis as in the app. Tiles use `min-height`, so they grow with larger text instead of clipping.
- Tap targets: tiles at least 64px tall, chips at least 36px tall, Save full-width at about 48px.
- `prefers-reduced-motion`: no press-scale.

### Keyboard and focus

- Tiles and chips are real `<button>`s, so Enter and Space work with no extra code.
- **Open:** record the tile id in `returnFocusId`, set the whole background pane `inert`, render the sheet, then focus the sheet container (`tabIndex={-1}`, `aria-labelledby` the student name). With the pane inert, the header, tiles, result row and CTA can't be focused or clicked behind the scrim. Tab order inside the sheet: Close, chips, Save, More options.
- No page-wide focus trap: the sheet covers only the demo, so the rest of the page stays usable. That's why there's no `aria-modal`.
- **Escape:** a `keydown` handler on the frame (not on `window`) closes the sheet when focus is inside it.
- **Close and Save:** set `sheetStudentId` to null, which removes `inert`. Then, in an effect that runs after that commit, focus the tile in `returnFocusId`. An inert element can't take focus, so the order matters. After Save, the tile's `aria-label` includes "note logged" (app wording).
- Status (`aria-live="polite"`): announces "N logged" and the demo time after Save.

### Timer (exact lifecycle)

1. Starts at the **first student-tile activation** in this mount: `startedAt.current = performance.now()`, only if it's still `null`. Same moment `quick_grid_demo_started` fires.
2. Keeps running through dismissals and reopens. Closing the sheet without saving doesn't reset it.
3. Stops at the **first valid Save**: `elapsedMs = performance.now() - startedAt.current`. **Frozen**: later saves never change it.
4. No live stopwatch. Nothing is shown until the first Save. Then the line reads: **"Your demo time: X seconds"**, with X = `(elapsedMs / 1000).toFixed(1)`.
5. Resets on Try Again (the next tile tap starts a fresh time, the next valid Save stops it), and on remount or reload.
6. **Elapsed time is not included in any custom event property.** The started and completed events carry PostHog's standard timestamps, so an approximate duration can be inferred from them. The widget is excluded from replay, so the displayed time isn't recorded there either.

### Copy (no em dashes anywhere)

- Under the frame, **visible from the first render, always**: "Practice with fictional students. Nothing is saved. App save times vary." Here "Nothing is saved" refers to the practice notes. Analytics is covered by the privacy page (section 5).
- After the first Save: **"Your demo time: X seconds"**.
- Result row after the first Save: "You logged {noteCount} note(s) for {loggedIds.size} student(s). The guided demo in the app goes further: write a full note and turn it into a report." Link button: **"Try the guided demo →"** to `https://app.getshorthandapp.com/?demo=true`.
  - This copy describes the guided demo as it actually is (full composer and report, not this grid), so a visitor isn't surprised when the grid isn't there.
- Header keeps the app's "Log Notes" and "N logged" (N = notes, as in the app).
- Below "Try the guided demo →", a secondary **"Try Again"** button (see next section).

### Try Again (approved 2026-10-17)

- Shown in the result row, under the guided-demo CTA, after the first valid Save. The guided-demo CTA stays.
- Clicking it resets the whole practice session: note count, checked tiles, selected chips, the result row and the timer (`startedAt` back to `null`, `elapsedMs` back to `null`). Focus moves to the first tile, since the button itself disappears.
- The next tile tap starts a fresh timer, and the next valid Save stops and freezes it. Idle time between rounds never counts.
- Unlimited rounds. No attempt cap.
- Nothing new is stored, and no new event is added. The analytics refs (`startedSent`, `completedSent`) are **not** reset, so `quick_grid_demo_started` and `quick_grid_demo_completed` still fire at most once per component mount, however many rounds a visitor plays. Clicking Try Again sends nothing.
- It's inside the `ph-no-capture` wrapper like the rest of the widget.

## 5. Analytics

### Events (added to `CUSTOM_EVENTS`)

```
quick_grid_demo_started:     { demo: ['quick_grid'] }
quick_grid_demo_completed:   { demo: ['quick_grid'] }
quick_grid_demo_cta_clicked: { demo: ['quick_grid'] }
```

| Event | Fires when | How often |
|---|---|---|
| `quick_grid_demo_started` | First student-tile activation (click, tap, Enter or Space) | Once per component mount (`startedSent` ref), not reset by Try Again |
| `quick_grid_demo_completed` | First valid simulated Save | Once per component mount (`completedSent` ref), not reset by Try Again |
| `quick_grid_demo_cta_clicked` | Activation of a demo link to the app (result-row "Try the guided demo" or the sheet's "More options" link) | Every activation (the page navigates away anyway) |

- The only **application-defined** property is the fixed `{ demo: 'quick_grid' }`. No student ids or names, chip labels, counts, text, or elapsed time. The types and `filterCustomEvent` both enforce this. Standard SDK metadata still rides along as on every event (timestamp, `distinct_id`, page and device `$` properties, allowed utm fields).
- All three go through `captureEvent()`. Nothing fires on render, scroll or view. The page's existing CTAs (nav, bottom "Get Started Free") fire no demo events.
- These are three **new custom events**, not the only things recorded on the page: pageview/pageleave and the site-wide `app_link_clicked` continue as before. The widget itself is excluded from replay by `ph-no-capture`, and the rest of the page is recorded as today.

### CTA integration, with no duplicate `app_link_clicked`

- Both demo links are `TrackedLink`s to `https://app.getshorthandapp.com/?demo=true`, with `label="quick_grid_demo_cta"` and `ctaSource="features_quick_note"`. That keeps first-touch attribution and GA4 `cta_click` as on every other CTA.
- `app_link_clicked { destination: 'web_app', cta_location: 'page' }` keeps arriving from the existing global listener, unchanged. **The component never calls `app_link_clicked` itself.** The demo must not sit inside `nav`, `footer` or `.blog-content`.
- `quick_grid_demo_cta_clicked` fires from `TrackedLink`'s new optional `onClick`, before navigation. Both events use `send_instantly`.
- Result: one demo CTA click = exactly one `app_link_clicked` + one `quick_grid_demo_cta_clicked` + one GA4 `cta_click` (when GA loads).

### Privacy disclosure (`app/privacy/page.tsx`, ships in the same PR)

In the PostHog paragraph's list of recorded actions, after "or pausing on a suggestion to try ShortHand inside a blog post", add:

> ", or starting, finishing, or following the link from the sample Quick Grid demo, whose practice notes use made-up students and are not saved"

The next sentence ("These records note which tool, file, link, or kind of example was involved, and never include anything that was typed, generated, or copied") stays true unchanged. The paragraph already discloses identifiers and technical metadata, so no broader rewrite. Greg approves the final wording.

Out of scope, logged for Greg: Codex noted the site has no consent gate or visitor opt-out for PostHog. The policy doesn't claim consent-first collection, so the wording isn't contradicted, but whether that meets consent obligations is a separate governance question. This demo neither fixes nor worsens it.

### Analytics checks

`lib/posthog-events.test.ts` (`npm test`):
- The three events keep `demo: 'quick_grid'`.
- Any other `demo` value is removed. Extra properties (`student`, `tags`, `elapsed_ms`, `text`) are removed. SDK keys pass through.
- An unlisted variant name (`quick_grid_demo_saved`) is dropped.

`tests/manual/posthog-privacy-check.mjs` (manual, real SDK, local production build):
- Add the three names to `CUSTOM`, and update the "five custom events" check label.
- **Interaction run** (its own page): on `/features/quick-note`, tap a tile, close, reopen, pick 2 chips, Save, log a second student, then click "Try the guided demo" (the app host is already stubbed). Expected custom events from this run, exactly:
  - one `quick_grid_demo_started {"demo":"quick_grid"}`
  - one `quick_grid_demo_completed {"demo":"quick_grid"}`
  - one `quick_grid_demo_cta_clicked {"demo":"quick_grid"}`
  - one `app_link_clicked {"cta_location":"page","destination":"web_app"}`
  - "Exactly" applies to properties the site defines (the script's existing `own()` helper strips `$` and SDK keys).
- **Forged-event run** (a separate fresh page, counted separately): `window.__shTrack('quick_grid_demo_completed', { demo: 'quick_grid', student: 'Zigzag', tags: 'Off Task', elapsed_ms: '2300' })`. Assert that the received event's site-defined properties are exactly `{"demo":"quick_grid"}`. Not added to the interaction run's expected list.
- **No `$autocapture`** events in either run.
- **Replay:** decode the interaction run's `$snapshot` data. With the sheet opened at least once and the result row shown:
  - None of the 12 student names, the 18 chip labels, "Your demo time" or the CTA text appear.
  - The page's own heading ("Quick Grid") does appear, which proves recording ran and the check isn't passing vacuously.
- **Event payloads:** no non-`$snapshot` payload contains a student name or chip label.
- Run it before merge, and paste the pass/fail summary into the PR.

## 6. Inherited website CSS (things the port must override)

| Inherited rule | Effect on the demo | Fix in the CSS module |
|---|---|---|
| `body { color: #fff; font-weight: 300; line-height: 1.8 }` | White, thin, loosely spaced text on a white card | Set color (slate-900 / slate-700 / slate-400 as the app does), weights (700 to 900) and `line-height: 1.2` on the frame root |
| `.detail-hero { text-align: center }` | Sheet and header text centered | `text-align: left` on the frame root, centered only where the app centers (tile names) |
| `*, *::before, *::after { margin: 0; padding: 0 }` | Matches Tailwind's preflight, so it helps | None |
| `button` has no global reset | Browser default font, background and border on tiles and chips | Explicit `font: inherit; background; border; cursor` on every button class |
| `body::after` fixed noise overlay (opacity 0.04) | Faint grain over the white card | Accept. It's under 4% and matches the rest of the site. |
| Dark-only theme | White card on near-black | Intended: it reads as "this is the app screen" |

Intentional visual differences from the app, to note in the component header:
- System font instead of Montserrat (body) and Boogaloo (`h1`-`h3`: "Log Notes", the student name).
- The sheet sits in the frame, not the viewport.
- No text field, class selector, "+ Multiple" or "Full note".
- "More options" is a link out instead of opening the full composer.

## 7. Acceptance checklist

Automated in `tests/quick-grid-demo.spec.ts` unless marked (manual) or (device).

Behavior:
- [ ] Tap a tile: the sheet opens with that student's name and no chips selected.
- [ ] Save is disabled until at least one chip is selected. Multiple chips can be selected and deselected.
- [ ] Chip colors match the app for positive, growth and neutral, selected and unselected (manual, side by side with the app).
- [ ] 6 Quick chips wrap; the other 12 scroll horizontally in one row.
- [ ] Save closes the sheet, checks the tile, shows "1 logged", "Your demo time: X seconds" and the result row.
- [ ] Logging the same student again: "2 logged", one checked tile, "2 notes for 1 student", demo time unchanged.
- [ ] ✕, scrim click and Escape all close the sheet with nothing logged. Reopening shows no chips selected.
- [ ] The disclaimer is visible on first load, before any interaction.
- [ ] "More options" and "Try the guided demo" are links to `app.getshorthandapp.com/?demo=true`.

Timer (Playwright `page.clock`, which controls `performance.now()`):
- [ ] Tap a tile, advance 2s, close, advance 1s, reopen, advance 0.5s, pick a chip, Save: shows "3.5 seconds".
- [ ] Advance 5s, log another note: still "3.5 seconds".
- [ ] No time text exists before the first Save.

Try Again:
- [ ] Not shown before the first Save. Clicking it clears the count, checks, chips, result row and time, and focuses the first tile.
- [ ] Second round: idle time between rounds doesn't count, the new time runs from the round's first tap to its first Save, and later saves don't change it.
- [ ] Five rounds in a row work, and the guided-demo link is there every round.
- [ ] Started and completed still arrive once per mount across several rounds (analytics stub).

Persistence and network:
- [ ] The localStorage, sessionStorage and cookie keys are the same before and after the full flow (the demo adds none). Reload shows a fresh grid: no checks, no count, no time.
- [ ] From page load until the CTA click, no requests go to `/api/*`, `*.supabase.co`, or `app.getshorthandapp.com`. Analytics hosts (PostHog, GA) are allowed and not asserted on.

Layout:
- [ ] 3 columns at 320 and 360. 4 columns at 375, 390 and 1280.
- [ ] No horizontal page scroll at 320 with the sheet open and the overflow row scrolled.
- [ ] At 390 × 844 and 1280 × 800: Close and Save are both visible when the sheet opens.
- [ ] At 667 × 375 landscape: Close and Save are each reachable by page scroll alone, with the chip area never scrolled.
- [ ] Only the chip area scrolls inside the sheet, and its scroll doesn't chain to the page.

Enlarged text:
- [ ] With `html { font-size: 200% }` injected at 390 wide: no horizontal page scroll, tile names truncate rather than overflow, chips stay inside the sheet, and Close and Save are reachable as above.
- [ ] At 320 × 568 (the reflow width of 200% zoom on a 640px window): the same checks.
- [ ] (device) iPhone Safari with the largest Safari page zoom: the flow is usable.

Keyboard and accessibility:
- [ ] The whole flow works by keyboard alone: Tab to a tile, Enter, Tab to chips, Space, Tab to Save, Enter.
- [ ] While the sheet is open, Tab never reaches the header, tiles, result row or CTA behind it. The pane has `inert`.
- [ ] Focus goes to the sheet on open, and returns to the originating tile on close (✕, scrim, Escape) and on Save.
- [ ] Tile aria-labels and chip `aria-pressed` match the app. The status line is `aria-live="polite"`.

Analytics (Playwright, with a recording `__shTrack` stub, the same pattern as `tests/blog-example-copy.spec.ts`):
- [ ] `quick_grid_demo_started` and `quick_grid_demo_completed` each arrive once per mount, even after several opens, closes and saves.
- [ ] One CTA click = one `quick_grid_demo_cta_clicked`. The component itself never sends `app_link_clicked`.
- [ ] Each of the three carries exactly `{ demo: 'quick_grid' }`.

Analytics unavailable:
- [ ] With no `__shTrack` and no `gtag` (the Playwright default): the full flow works, the CTA still navigates (via `TrackedLink`'s 300ms fallback), and there are no console errors.
- [ ] With a `__shTrack` that throws: the full flow still works, and there are no uncaught errors.

Privacy (manual, `posthog-privacy-check.mjs`):
- [ ] Passes with the section 5 expectations, including replay exclusion, no `$autocapture`, and the separate forged-event run. Summary pasted in the PR.
- [ ] The privacy page clause is merged in the same PR.

Ship:
- [ ] `npm test`, `npm run build` and lint pass. Zero em dashes in new copy (grep the built HTML).
- [ ] Bundle size and layout shift are **measured, not assumed**:
  - Bundle: compare the route's First Load JS in `next build` output before and after. The estimate is under 10KB.
  - Layout shift: no new shift from the demo in a Lighthouse run on the preview.
- [ ] Branch + PR + Vercel preview. Branch-and-wait (`.tsx`), Greg checks the preview on a real iPhone and on desktop before merge.

## 8. Placement

- **This PR: `/features/quick-note` only**, directly above the existing video. The page copy already describes this exact flow.
- **Deferred:** homepage integration and any A/B test (hero slot vs. section, via `EXPERIMENTS`). Revisit after the demo has been live long enough to read the `started → completed → cta_clicked` numbers.

## 9. Risks

| Risk | Level | Mitigation |
|---|---|---|
| Analytics collecting demo content | Low | Fixed single-value property, `before_send` allowlist, widget excluded from replay, unit test, manual check that searches events and snapshots |
| Visitors thinking it saved real data | Low | Disclaimer visible from the start, "demo time" wording, "Nothing is saved" |
| CTA expectation mismatch | Low | Copy says the guided demo is a full note and a report, not this grid |
| Performance | Low (estimate) | No images, SSR'd static first render (not `ssr:false`). Measured before merge. |
| Drift from the app | Medium, accepted | Header comment points at the source files and commit. Re-port when the app grid visibly changes. |
| Production app | None | No changes to `pulse 2.0` |

## 10. Effort: two focused sessions, one PR

- **Session 1:** component + CSS module, all behavior, timer, responsive layout, inert pane and focus, placement on `/features/quick-note`, the Playwright spec (behavior, timer, layout, enlarged text, keyboard, analytics stub, analytics unavailable). Push the branch so Greg can look at an early preview.
- **Session 2:** allowlist + `TrackedLink` prop + unit test, privacy clause, manual privacy check run (replay, autocapture, forged event), bundle/CLS measurement, real-device pass, fixes, then hand the PR to Greg.

## Open decisions for Greg

1. The privacy-policy clause wording (section 5).
2. The 8 extra fictional student names (default: whimsical one-word names like the app's demo).
3. The CTA destination: the guided demo `?demo=true` (default; it matches every other site CTA, and the copy now says what it contains) vs. plain sign-up. Sign-up doesn't show the grid right away either: `showGrid` also requires `students.length > 0`, so a new account sees it only after adding a student.
