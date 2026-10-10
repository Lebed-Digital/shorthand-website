'use client';

import { fireCtaClick } from '../lib/gtag';

const LIBRARY_HREF = '/report-card-comment-library';

// What a blog post may say about the paid library. Built on the server from
// lib/report-card-teaser.ts and passed down, so a count or a section name is
// never typed into copy here and cannot go stale. Numbers and labels only:
// comment text never reaches these components.
export interface LibraryFacts {
  totalCount: number;
  freeCount: number;
  sections: string[];
}

// Every library link in a blog post reports to GA4 through this, as a
// `cta_click` with cta_source = the post slug and cta_destination = which link
// it was. The destinations in use:
//   report-card-library-top            one-line note under the subtitle
//   report-card-library-inline         text link in the mid-post block
//   report-card-library-inline-button  button in the mid-post block
//   report-card-library-end            text link in the end-of-post block
//   report-card-library-end-button     button in the end-of-post block
// The two "inline" values are unchanged since 2026-08-20, so a post's history
// reads straight across this rewrite.
function trackAndGo(sourceSlug: string, destination: string) {
  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    fireCtaClick({
      cta_source: sourceSlug,
      cta_destination: destination,
      link_url: LIBRARY_HREF,
      event_callback: () => { window.location.href = LIBRARY_HREF; },
    });
    setTimeout(() => { window.location.href = LIBRARY_HREF; }, 300);
  };
}

// One sentence under a post's subtitle, set like the article and not boxed.
// It is the only library mention every reader of the post is sure to see, so
// it says the three things that matter: what is different, that trying it is
// free, and what the full set costs.
export function LibraryCtaLine({ sourceSlug, library }: { sourceSlug: string; library: LibraryFacts }) {
  return (
    <p
      style={{
        margin: '0 0 2rem',
        paddingLeft: '0.9rem',
        borderLeft: '3px solid #0d9488',
        fontSize: '0.95rem',
        lineHeight: 1.6,
        color: 'var(--text-dim)',
      }}
    >
      Writing these for a whole class? The{' '}
      <a
        href={LIBRARY_HREF}
        onClick={trackAndGo(sourceSlug, 'report-card-library-top')}
        style={{ color: 'var(--text)', fontWeight: 600 }}
      >
        Report Card Comment Library
      </a>{' '}
      fills in each student&rsquo;s name for you and lets you search {library.totalCount} comments. Try{' '}
      {library.freeCount} free with no sign-up. The full set is $4.99 once.
    </p>
  );
}

interface LibraryCtaBlockProps {
  sourceSlug: string;
  placement: string;
  intro: string;
  library: LibraryFacts;
  // Shows the "this page / the library" comparison. Only for posts that are
  // themselves a list of comments: the left column describes such a list.
  compare?: boolean;
}

// The library offer inside a blog post. Mid-post it is spliced into
// contentHtml at a marker string, same pattern as PdfGate.
//
// Copy positioning. 2026-08-20: the offer leads with speed and findability,
// not library size, because a count competes with the free comments the reader
// is already looking at. That still holds: the count is the last line of the
// comparison, not the first. 2026-10-08: the block now states the difference
// between the free page and the paid library side by side, and the button
// offers the free sample. The paywall has been a working sample since
// 2026-09-12 (search, filters, name fill and copy on real comments, no
// sign-up), and the old block never said so: it read as a link to a checkout.
//
// Every capability named below is real in LibraryClient.tsx: keyword search
// across all comments, tone and grade band filters, one-click copy, and name
// personalization.
export default function LibraryCtaBlock({ sourceSlug, placement, intro, library, compare = false }: LibraryCtaBlockProps) {
  const link = (
    <a href={LIBRARY_HREF} onClick={trackAndGo(sourceSlug, placement)} style={{ fontWeight: 700 }}>
      Report Card Comment Library
    </a>
  );

  return (
    <div
      style={{
        margin: '2rem 0',
        padding: '1.5rem 1.75rem',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '14px',
      }}
    >
      {compare ? (
        <>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            {intro} The {link}{' '}is a separate tool, built for getting through a whole class.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '0.75rem',
              margin: '1rem 0 0',
            }}
          >
            <div style={columnStyle(false)}>
              <p style={columnLabelStyle}>
                This page <span style={tagStyle(false)}>Free</span>
              </p>
              <ul style={listStyle}>
                <li style={itemStyle}>Scroll the list to find one that fits</li>
                <li style={itemStyle}>Swap in each student&rsquo;s name yourself</li>
                <li style={itemStyle}>No sign-up</li>
              </ul>
            </div>
            <div style={columnStyle(true)}>
              <p style={columnLabelStyle}>
                The library <span style={tagStyle(true)}>$4.99 once</span>
              </p>
              <ul style={listStyle}>
                <li style={itemStyle}>Type the name once and it fills into every comment</li>
                <li style={itemStyle}>Search by keyword, or filter by tone and grade band</li>
                <li style={itemStyle}>
                  {library.totalCount} comments: {library.sections.join(', ')}
                </li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <p style={{ margin: 0, lineHeight: 1.6 }}>
          {intro} The {link}{' '}is built for getting through a whole class. Type a student&rsquo;s name once and it
          fills into every comment, then search or filter to the one that fits and copy it.
        </p>
      )}
      <p style={{ margin: '1rem 0 0' }}>
        <a
          href={LIBRARY_HREF}
          onClick={trackAndGo(sourceSlug, `${placement}-button`)}
          style={{
            display: 'inline-block',
            padding: '0.7rem 1.25rem',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0d9488, #0891b2)',
            color: '#fff',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          Try {library.freeCount} comments free
        </a>
      </p>
      <p style={{ margin: '0.6rem 0 0', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
        No sign-up to try it. All {library.totalCount} comments are a one-time $4.99, no subscription.
      </p>
    </div>
  );
}

function columnStyle(paid: boolean): React.CSSProperties {
  return {
    padding: '0.9rem 1rem',
    borderRadius: '10px',
    background: paid ? 'rgba(13,148,136,0.12)' : 'rgba(255,255,255,0.03)',
    border: `1px solid ${paid ? 'rgba(13,148,136,0.45)' : 'rgba(255,255,255,0.08)'}`,
  };
}

const columnLabelStyle: React.CSSProperties = {
  margin: '0 0 0.5rem',
  fontWeight: 700,
  color: 'var(--text)',
  lineHeight: 1.4,
};

function tagStyle(paid: boolean): React.CSSProperties {
  return {
    marginLeft: '0.4rem',
    padding: '2px 8px',
    borderRadius: '999px',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    color: paid ? '#5eead4' : 'var(--text-dim)',
    background: paid ? 'rgba(13,148,136,0.25)' : 'rgba(255,255,255,0.08)',
  };
}

const listStyle: React.CSSProperties = {
  margin: 0,
  paddingLeft: '1.1rem',
  fontSize: '0.92rem',
  lineHeight: 1.5,
};

const itemStyle: React.CSSProperties = { marginBottom: '0.3rem' };
