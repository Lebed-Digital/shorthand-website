import 'server-only';

import {
  CATEGORIES_BY_SECTION,
  CATEGORY_LABELS,
  REPORT_CARD_COMMENTS,
  SECTION_LABELS,
  type Comment,
  type Section,
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
// counts, and exactly SAMPLES_PER_SECTION real comments per section. Every
// other comment text stays on the server.

const SAMPLES_PER_SECTION = 2;

export interface TeaserCategory {
  id: string;
  label: string;
  count: number;
}

export interface TeaserSection {
  id: Section;
  label: string;
  count: number;
  categories: TeaserCategory[];
  samples: Comment[];
}

export interface TeaserData {
  totalCount: number;
  sections: TeaserSection[];
}

// Deterministic sample choice: one positive and one growth comment per section
// where both exist, so the preview honestly represents both tones rather than
// showing two of whichever happens to come first.
function pickSamples(sectionComments: Comment[]): Comment[] {
  const positive = sectionComments.find((c) => c.tone === 'positive');
  const growth = sectionComments.find((c) => c.tone === 'growth');
  const picked = [positive, growth].filter((c): c is Comment => Boolean(c));

  for (const c of sectionComments) {
    if (picked.length >= SAMPLES_PER_SECTION) break;
    if (!picked.includes(c)) picked.push(c);
  }

  return picked.slice(0, SAMPLES_PER_SECTION);
}

export function getTeaserData(): TeaserData {
  const sections = (Object.keys(CATEGORIES_BY_SECTION) as Section[]).map((id) => {
    const sectionComments = REPORT_CARD_COMMENTS.filter((c) => c.section === id);

    const categories = CATEGORIES_BY_SECTION[id].map((categoryId) => ({
      id: categoryId,
      label: CATEGORY_LABELS[categoryId] ?? categoryId,
      count: sectionComments.filter((c) => c.category === categoryId).length,
    }));

    return {
      id,
      label: SECTION_LABELS[id],
      count: sectionComments.length,
      categories,
      samples: pickSamples(sectionComments),
    };
  });

  return {
    totalCount: REPORT_CARD_COMMENTS.length,
    sections,
  };
}

// The full dataset, for the gated path only. Kept behind this named export in
// a server-only module so every call site is greppable and obviously
// server-side.
export function getFullLibrary(): Comment[] {
  return REPORT_CARD_COMMENTS;
}
