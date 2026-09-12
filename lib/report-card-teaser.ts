import 'server-only';

import {
  CATEGORIES_BY_SECTION,
  CATEGORY_LABELS,
  REPORT_CARD_COMMENTS,
  SECTION_LABELS,
  type Comment,
  type Section,
  type Tone,
} from './report-card-comments';

// Builds the small, safe subset of the library that unauthenticated visitors
// are allowed to receive.
//
// The 'server-only' import above is load-bearing: it makes the build fail if
// this module is ever pulled into a Client Component, which is what would drag
// lib/report-card-comments.ts (all 374 comments) into the browser bundle. The
// paywalled page must never import the full dataset, directly or transitively.
//
// What a non-payer gets: the page structure, section and category names,
// counts, and the free slice built by getFreeSliceData below. Every other
// comment text stays on the server.

export interface TeaserCategory {
  id: string;
  label: string;
  count: number;
}

// The full dataset, for the gated path only. Kept behind this named export in
// a server-only module so every call site is greppable and obviously
// server-side.
export function getFullLibrary(): Comment[] {
  return REPORT_CARD_COMMENTS;
}

// ---------------------------------------------------------------------------
// Free slice
// ---------------------------------------------------------------------------
//
// The paywall is a working product, not a screenshot: visitors get a real
// searchable, filterable, name-personalized set of comments before paying.
// FREE_PER_SECTION comments per section, balanced across tone, spread across
// categories so one category cannot absorb a section's whole allowance.
//
// Deliberately built from the same REPORT_CARD_COMMENTS list rather than a
// hand-copied duplicate: a divergent copy would be the thing that goes stale.
// Only these comments' text crosses to the client; the rest stay server-side,
// which is the invariant the 'server-only' import at the top of this file
// protects.

const FREE_PER_SECTION = 4;

export interface FreeSliceSection {
  id: Section;
  label: string;
  totalCount: number;
  freeCount: number;
  categories: TeaserCategory[];
}

export interface FreeSliceData {
  totalCount: number;
  freeCount: number;
  comments: Comment[];
  sections: FreeSliceSection[];
}

// Round-robin over categories, alternating the tone we prefer, so a section's
// free comments are not all one category or all one tone. Deterministic: the
// same input list always yields the same slice, so the free set does not
// reshuffle between renders (which would make "copy it, then buy" confusing).
function pickFree(sectionComments: Comment[]): Comment[] {
  const byCategory = new Map<string, Comment[]>();
  for (const c of sectionComments) {
    const bucket = byCategory.get(c.category);
    if (bucket) bucket.push(c);
    else byCategory.set(c.category, [c]);
  }

  const picked: Comment[] = [];
  const buckets = [...byCategory.values()];
  let wantTone: Tone = 'positive';

  // Each pass takes at most one comment per category, preferring the tone we
  // are owed. Stops as soon as a full pass adds nothing, so a section with
  // fewer than FREE_PER_SECTION comments terminates instead of spinning.
  while (picked.length < FREE_PER_SECTION) {
    let addedThisPass = false;
    for (const bucket of buckets) {
      if (picked.length >= FREE_PER_SECTION) break;
      const next =
        bucket.find((c) => c.tone === wantTone && !picked.includes(c)) ??
        bucket.find((c) => !picked.includes(c));
      if (!next) continue;
      picked.push(next);
      addedThisPass = true;
      wantTone = next.tone === 'positive' ? 'growth' : 'positive';
    }
    if (!addedThisPass) break;
  }

  return picked;
}

export function getFreeSliceData(): FreeSliceData {
  const comments: Comment[] = [];

  const sections = (Object.keys(CATEGORIES_BY_SECTION) as Section[]).map((id) => {
    const sectionComments = REPORT_CARD_COMMENTS.filter((c) => c.section === id);
    const free = pickFree(sectionComments);
    comments.push(...free);

    return {
      id,
      label: SECTION_LABELS[id],
      totalCount: sectionComments.length,
      freeCount: free.length,
      categories: CATEGORIES_BY_SECTION[id].map((categoryId) => ({
        id: categoryId,
        label: CATEGORY_LABELS[categoryId] ?? categoryId,
        count: sectionComments.filter((c) => c.category === categoryId).length,
      })),
    };
  });

  return {
    totalCount: REPORT_CARD_COMMENTS.length,
    freeCount: comments.length,
    comments,
    sections,
  };
}
