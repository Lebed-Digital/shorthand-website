'use client';

/**
 * A practice copy of the app's Log Notes grid, with fictional students.
 *
 * Hand-ported from pulse 2.0 at commit a2bcf8a:
 *   src/components/log-notes/StudentLogGrid.tsx
 *   src/components/log-notes/StudentTile.tsx
 *   src/components/log-notes/NoteComposerSheet.tsx
 * Same markup, sizes, colors and behavior, with the Tailwind classes translated
 * into QuickGridDemo.module.css. Re-port when the app grid visibly changes.
 * The plan and its reasoning: plans/quick-grid-demo.md.
 *
 * Nothing here is saved or sent anywhere. All state is React state, so a
 * reload starts fresh. There is no text field, so a visitor can't type data.
 *
 * Intentional differences from the app:
 * - The website's system font instead of Montserrat and Boogaloo.
 * - The sheet sits inside the demo frame, not the viewport, and has no
 *   aria-modal: it covers the demo only, so the rest of the page stays usable.
 * - No text field, class selector, "+ Multiple", "Full note" or offline state.
 * - "More options" links to the app's guided demo instead of opening the full
 *   composer.
 */

import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronRight, X } from 'lucide-react';
import TrackedLink from './TrackedLink';
import { captureEvent } from '../lib/posthog-events';
import styles from './QuickGridDemo.module.css';

// The app's guided-demo names (WelcomeModal.tsx) plus eight more in the same
// style. One word each and all unique, so no name shortening is needed. Sorted
// by name, as the app sorts its grid.
const STUDENTS = [
  'Falcon', 'Blueberry', 'Zigzag', 'Comet',
  'Pickle', 'Maple', 'Rocket', 'Pebble', 'Sprout', 'Waffle', 'Nova', 'Biscuit',
].sort((a, b) => a.localeCompare(b));

type ChipType = 'positive' | 'growth' | 'neutral';

// The app's first 18 default indicators, in its curated order
// (hooks/useClassroomData.ts). The first 6 are the Quick chips.
const CHIPS: { label: string; type: ChipType }[] = [
  { label: 'On Task', type: 'positive' },
  { label: 'Participation', type: 'positive' },
  { label: 'Redirected', type: 'growth' },
  { label: 'Off Task', type: 'growth' },
  { label: 'Unprepared', type: 'growth' },
  { label: 'Disruption', type: 'growth' },
  { label: 'Peer Conflict', type: 'growth' },
  { label: 'Kindness', type: 'positive' },
  { label: 'Incomplete', type: 'growth' },
  { label: 'Persistence', type: 'positive' },
  { label: 'Independent Work', type: 'positive' },
  { label: 'Teamwork', type: 'positive' },
  { label: 'Leadership', type: 'positive' },
  { label: 'Growth Mindset', type: 'positive' },
  { label: 'Star Work', type: 'positive' },
  { label: 'Self-Regulation', type: 'positive' },
  { label: 'Check-In', type: 'neutral' },
  { label: 'Modified Work', type: 'neutral' },
];
const QUICK = CHIPS.slice(0, 6);
const OVERFLOW = CHIPS.slice(6);

const GUIDED_DEMO_URL = 'https://app.getshorthandapp.com/?demo=true';

// The only property any demo event carries. See CUSTOM_EVENTS.
const DEMO = { demo: 'quick_grid' } as const;
const ctaClicked = () => captureEvent('quick_grid_demo_cta_clicked', DEMO);

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

export default function QuickGridDemo() {
  const [sheetStudent, setSheetStudent] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [noteCount, setNoteCount] = useState(0);
  const [loggedIds, setLoggedIds] = useState<Set<string>>(() => new Set());
  // Set at the first tile tap and frozen at the first Save. Later saves
  // never change it.
  const startedAt = useRef<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  // Once per mount each. Try Again deliberately leaves these alone.
  const startedSent = useRef(false);
  const completedSent = useRef(false);
  const returnFocusId = useRef<string | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const nameId = useId();

  // Runs after the commit that adds or removes the sheet, so on close the
  // pane is no longer inert and its tile can take focus.
  useEffect(() => {
    if (sheetStudent) {
      sheetRef.current?.focus();
    } else if (returnFocusId.current) {
      frameRef.current
        ?.querySelector<HTMLElement>(`[data-student="${returnFocusId.current}"]`)
        ?.focus();
      returnFocusId.current = null;
    }
  }, [sheetStudent]);

  function openSheet(e: React.MouseEvent<HTMLButtonElement>) {
    const name = e.currentTarget.dataset.student!;
    if (startedAt.current === null) startedAt.current = performance.now();
    if (!startedSent.current) {
      startedSent.current = true;
      captureEvent('quick_grid_demo_started', DEMO);
    }
    returnFocusId.current = name;
    setSelectedTags([]);
    setSheetStudent(name);
  }

  function closeSheet() {
    setSelectedTags([]);
    setSheetStudent(null);
  }

  function toggleTag(label: string) {
    setSelectedTags(tags => (tags.includes(label) ? tags.filter(t => t !== label) : [...tags, label]));
  }

  function save() {
    if (!sheetStudent || selectedTags.length === 0) return;
    if (elapsedMs === null && startedAt.current !== null) {
      setElapsedMs(performance.now() - startedAt.current);
    }
    if (!completedSent.current) {
      completedSent.current = true;
      captureEvent('quick_grid_demo_completed', DEMO);
    }
    setNoteCount(n => n + 1);
    setLoggedIds(ids => new Set(ids).add(sheetStudent));
    closeSheet();
  }

  // A fresh practice round: counts, checks, chips and timer all reset, so the
  // next tile tap starts a new time. Unlimited.
  function tryAgain() {
    startedAt.current = null;
    setElapsedMs(null);
    setNoteCount(0);
    setLoggedIds(new Set());
    setSelectedTags([]);
    // This button is about to disappear, so put focus on the first tile.
    frameRef.current?.querySelector<HTMLElement>('[data-student]')?.focus();
  }

  const renderChip = (chip: (typeof CHIPS)[number], compact: boolean) => {
    const isSelected = selectedTags.includes(chip.label);
    return (
      <button
        key={chip.label}
        type="button"
        onClick={() => toggleTag(chip.label)}
        aria-pressed={isSelected}
        className={`${styles.chip} ${compact ? styles.chipQuick : styles.chipOverflow} ${styles[chip.type]} ${isSelected ? styles.selected : ''}`}
      >
        {chip.label}
        {isSelected && (
          <svg className={styles.chipCheck} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>
    );
  };

  return (
    <div className={`${styles.root} ph-no-capture`}>
      <div
        ref={frameRef}
        className={styles.frame}
        onKeyDown={e => { if (e.key === 'Escape' && sheetStudent) closeSheet(); }}
      >
        <div className={styles.pane} inert={sheetStudent !== null}>
          <div className={styles.header}>
            <h2 className={styles.title}>Log Notes</h2>
            <span className={styles.status} aria-live="polite">
              {noteCount > 0 ? `${noteCount} logged` : ''}
            </span>
          </div>

          <p className={styles.hint}>Tap a student to log a note</p>

          <div className={styles.grid}>
            {STUDENTS.map(name => {
              const logged = loggedIds.has(name);
              return (
                <button
                  key={name}
                  type="button"
                  data-student={name}
                  onClick={openSheet}
                  className={`${styles.tile} ${logged ? styles.tileLogged : ''}`}
                  aria-label={logged ? `Log a note for ${name}, note logged` : `Log a note for ${name}`}
                >
                  {logged && (
                    <span className={styles.badge} aria-hidden="true">
                      <Check size={10} strokeWidth={4} />
                    </span>
                  )}
                  <div className={styles.avatar}>{name.slice(0, 2).toUpperCase()}</div>
                  <span className={styles.tileName}>{name}</span>
                </button>
              );
            })}
          </div>

          <div aria-live="polite">
            {elapsedMs !== null && (
              <div className={styles.result}>
                <p className={styles.time}>Your demo time: {(elapsedMs / 1000).toFixed(1)} seconds</p>
                <p className={styles.summary}>
                  You logged {plural(noteCount, 'note')} for {plural(loggedIds.size, 'student')}. The guided
                  demo in the app goes further: write a full note and turn it into a report.
                </p>
                <TrackedLink
                  href={GUIDED_DEMO_URL}
                  label="quick_grid_demo_cta"
                  ctaSource="features_quick_note"
                  onClick={ctaClicked}
                  className={styles.cta}
                >
                  Try the guided demo →
                </TrackedLink>
                <button type="button" onClick={tryAgain} className={styles.tryAgain}>
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>

        {sheetStudent && (
          <>
            <div className={styles.scrim} onClick={closeSheet} aria-hidden="true" />
            <div
              ref={sheetRef}
              className={styles.sheet}
              role="dialog"
              aria-labelledby={nameId}
              tabIndex={-1}
            >
              <div className={styles.sheetTop}>
                <div className={styles.handleRow}>
                  <div className={styles.handle} />
                </div>
                <div className={styles.sheetHeader}>
                  <h3 id={nameId} className={styles.sheetName}>{sheetStudent}</h3>
                  <button type="button" onClick={closeSheet} className={styles.close} aria-label="Close">
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className={styles.sheetBody}>
                <div className={styles.quick}>{QUICK.map(c => renderChip(c, true))}</div>
                <div className={styles.overflowBleed}>
                  <div className={styles.overflowRow}>{OVERFLOW.map(c => renderChip(c, false))}</div>
                </div>
              </div>

              <div className={styles.sheetBottom}>
                <button type="button" onClick={save} disabled={selectedTags.length === 0} className={styles.save}>
                  Save
                </button>
                <TrackedLink
                  href={GUIDED_DEMO_URL}
                  label="quick_grid_demo_cta"
                  ctaSource="features_quick_note"
                  onClick={ctaClicked}
                  className={styles.moreOptions}
                >
                  More options are in the full app <ChevronRight size={12} aria-hidden="true" />
                </TrackedLink>
              </div>
            </div>
          </>
        )}
      </div>

      <p className={styles.disclaimer}>Practice with fictional students. Nothing is saved. App save times vary.</p>
    </div>
  );
}
