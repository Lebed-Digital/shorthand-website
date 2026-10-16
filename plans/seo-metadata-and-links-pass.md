# Small SEO pass: blog share metadata, /tools metadata, 7 contextual links

Date: 2026-10-15. Source: the read-only SEO indexing audit of 2026-10-14 (Claude, in a Codex
session) and Codex's review of it. Both findings were re-checked against current `main`
(`11a108f`) before writing this plan.

Not a redesign. No merges, deletes, redirects, robots, canonical, or sitemap changes.

## Verified current state

- `app/layout.tsx:27-50` sets site-wide `openGraph` (with `images: /og-image.png` 1200x630) and
  `twitter` (homepage title, description, image).
- `app/blog/[slug]/page.tsx:205-220` `generateMetadata` returns its own `openGraph` without
  `images` and no `twitter`. Next 16 merges metadata **shallowly**
  (`node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md`,
  "Merging"), so the post's `openGraph` replaces the layout's (image lost) and `twitter` is
  inherited whole from the layout (homepage title and description on every post).
- `app/tools/page.tsx:4-23` description names only the comment generator and welcome letters;
  the page now lists five free tools (comment generator, welcome letter generator, printable
  parent communication log, seating chart prompt, week at a glance prompt) plus the paid
  library. No `twitter` block, so it inherits the homepage twitter title.
- `public/og-image.png` exists, 1200x630. Recent pages (`app/free-seating-chart-prompt/page.tsx:18-28`,
  `app/week-at-a-glance/page.tsx`) already use the convention this plan copies: absolute
  `https://getshorthandapp.com/og-image.png` in `openGraph.images` and a full `twitter` block
  with `card: 'summary_large_image'`.
- Inbound links (audit crawl, re-confirmed by grep of `posts/`): `/features/student-documentation-report`
  only from the FeatureNav "Next" button on `/features/ask-shorthand`; `/free-seating-chart-prompt`
  only from `/tools`; the two blog targets only from `/blog`. No post links to any of the four.

## Change 1: blog post share metadata (`app/blog/[slug]/page.tsx`, `lib/posts.ts`)

In `generateMetadata`, build the title once and add an image and a twitter block:

```ts
const title = `${meta.title} | ShortHand Blog`;
const image = { url: meta.image ?? 'https://getshorthandapp.com/og-image.png', width: 1200, height: 630, alt: meta.title };
return {
  title,
  description: meta.excerpt,
  openGraph: { title, description: meta.excerpt, url: ..., type: 'article', images: [image] },
  twitter: { card: 'summary_large_image', title, description: meta.excerpt, images: [image.url] },
  alternates: { canonical: ... }, // unchanged
};
```

`lib/posts.ts` `PostMeta`: add `image?: string` with a one-line comment (optional per-post share
image, 1200x630, path or absolute URL). `normalizePostData` already spreads all frontmatter,
so no loader change. No post sets `image` today, so all 90 posts get the default image.
A later post can add `image: "/blog-images/foo.png"`; `metadataBase` in the layout resolves a
relative path to an absolute URL.

Unchanged: `title`, `description`, `canonical`, `og:url`, `og:type`, the `BlogPosting` and
`FAQPage` JSON-LD in the page body. `twitter:site`/`creator` are not set anywhere today and are
not added.

## Change 2: `/tools` metadata (`app/tools/page.tsx`)

- `description` and `openGraph.description` both become (one string constant, 163 chars):
  "Free teacher tools: report card comment and welcome letter generators, a printable parent
  communication log, and ChatGPT seating chart and weekly planning prompts."
  The paid library is deliberately left out of a "free tools" description.
- Add `twitter: { card: 'summary_large_image', title: 'Free Tools for Teachers | ShortHand', description: <same>, images: ['https://getshorthandapp.com/og-image.png'] }`.
- `title`, `canonical`, `og:url`, `og:type`, `og:image` unchanged. No change to page content.

## Change 3: seven contextual links, body text only (`posts/*.md`)

One sentence each, placed where the reader is already on that subtopic. No headings, titles,
excerpts, FAQs, `relatedPosts`, `date` or `lastModified` change (adding a link is not a
refresh, so no `lastModified`). No em dashes.

**Target `/blog/how-to-talk-to-parents-about-student-behavior`** (step-by-step call guide: open,
factual language, defensive parent, disagreement, documenting after)

1. `posts/teacher-parent-communication-guide.md` (parent comms hub), "Making the phone call"
   section, new paragraph after the "Before you dial, ..." paragraph (line 58):
   > For the call itself, [How to Talk to Parents About Student Behavior](/blog/how-to-talk-to-parents-about-student-behavior) walks through it step by step: how to open, what to say when a parent gets defensive, and what to write down afterward.
2. `posts/how-to-tell-parents-child-is-disruptive.md` line 51, appended to the "Always offer a
   phone call" paragraph:
   > If they take you up on it, this [step-by-step guide to talking with parents about behavior](/blog/how-to-talk-to-parents-about-student-behavior) covers how to open the call and handle a defensive reaction.

**Target `/blog/how-to-use-a-student-behavior-log`** (the habit: when to log, what details
matter, avoiding over-logging, using it at meetings)

3. `posts/teacher-behavior-documentation-guide.md` (behavior documentation hub), "Building a
   daily behavior log", new paragraph after the template paragraph (line 54):
   > Once you have a format, [How to Actually Use a Student Behavior Log](/blog/how-to-use-a-student-behavior-log) covers the harder part: when to log, which details matter, and how to keep it from eating your prep period.
4. `posts/free-behavior-log-template-for-teachers.md`, end of "Why a Simpler Version Works for
   Elementary", new paragraph before `RESOURCEOFFERMARKER` (line 80):
   > Whichever version you print, the template only helps if you fill it in. [How to actually use a student behavior log](/blog/how-to-use-a-student-behavior-log) covers when to write entries and how to avoid over-logging.

**Target `/features/student-documentation-report`** (Pro: unedited, dated PDF of a student's
notes for any date range; explicitly not an AI summary)

5. `posts/how-to-write-a-student-behavior-report.md` line 94, after "...and ShortHand can draft
   the summary from your own records." (that sentence describes the AI summary, so the raw
   export is the natural contrast):
   > If someone wants the raw notes instead of a summary, the [Student Documentation Report](/features/student-documentation-report), a Pro feature, exports them unedited as a dated PDF for any date range.
6. `posts/how-to-document-student-behavior-for-iep.md` line 123, appended after "You're
   reviewing something that's already there.":
   > If the IEP team asks for a copy, the [Student Documentation Report](/features/student-documentation-report), included with Pro, exports that student's notes for any date range as a clean, dated PDF.

**Target `/free-seating-chart-prompt`**

7. `posts/how-to-track-student-behavior-in-the-classroom.md` line 67, "Sticky Notes on a Seating
   Chart" method, after "Put a printed seating chart on your desk.":
   > If you need a fresh one, this [free AI seating chart prompt](/free-seating-chart-prompt) turns a photo of your empty room into a printable chart.

   Only one genuinely natural source exists. Other "seating" mentions in posts are app
   comparisons (Class Charts), preferential-seating interventions, or a back-to-school intro
   about desks, and a link there would be forced. Not adding a second.

Considered and excluded: `sample-emails-to-parents-about-student-behavior` (a PostHog CTA
experiment is running on it; leave its body alone), `what-to-say-when-you-call-a-parent-about-behavior`
(same intent as target 1-2, a link there blurs which page answers "what to say on the call"),
`iep-behavior-documentation-checklist` (its "export a professional data report" line overstates
what the feature does; linking would endorse that wording), a homepage feature-grid card for the
documentation report (`.tsx` layout change, broader than needed).

## Out of scope, noted only

- About 28 other pages (feature pages, `/blog` index, `/resources`, `/about`, legal pages) also
  have no `twitter` block and inherit the homepage twitter title. Same one-block fix if wanted;
  not in this pass.
- `BlogPosting` JSON-LD has no `image`. Optional for Google; not touched.
- The seven zero-impression posts, sitemap `lastModified: new Date()`, the 404 URLs.

## Verification

1. `npm run lint`, `npm test`, `npm run build`.
2. `next start` on the production build, then for a sample of posts (including one with and one
   without `faq`) plus `/tools`, `/`, and `/free-seating-chart-prompt` (control):
   - exactly one each of `og:title`, `og:description`, `og:image`, `og:url`, `twitter:card`,
     `twitter:title`, `twitter:description`, `twitter:image`, `<link rel=canonical>`;
   - `twitter:title` equals the page's `<title>`; `og:image` and `twitter:image` are absolute
     `https://getshorthandapp.com/og-image.png`; canonical unchanged from `main`.
   - All 90 posts: script count of posts with `og:image` (expect 90) and with the homepage
     twitter title (expect 0).
   - Homepage and control page metadata byte-identical to a `main` build.
3. Links: each of the 7 new hrefs appears exactly once in its source page's built HTML, the
   target returns 200, and the rendered sentence has correct spacing around the link (the JSX
   spacing bug does not apply to markdown, but check anyway). Grep the diff for `—`.
4. One temporary check of the override path: set `image:` on one post locally, confirm the tag,
   revert before commit.

## Delivery

One local branch, one commit set, not pushed (Greg: no deploy, no merge). The diff includes
`.tsx` so it is branch-and-wait under CLAUDE.md regardless.

## Codex review log

### Pass 1 (2026-10-15)

`codex exec -m gpt-6.1-sol -s read-only` (reasoning effort high). Codex read the layout, blog and
tools metadata, `lib/posts.ts` and its tests, Next's `resolve-metadata.js` and metadata docs,
`docs/seo-query-ownership.md`, all seven source posts, the four targets, and the CTA tracking,
ResourceOffer and experiment components. Reply: `NO_MEANINGFUL_ISSUES`. Plan cleared; no second
pass (workflow: a clean pass 1 ends the loop).

## Implementation record (2026-10-15)

Built exactly as planned on local branch `seo/blog-share-metadata-and-links`. Not pushed.

- ESLint on the three changed code files: clean. `npm test`: 107/107. `npm run build`: clean.
- Production build served locally, all 90 posts checked by script: 90 have exactly one each of
  og:title, og:description, og:image, og:url, twitter:card, twitter:title, twitter:description,
  twitter:image and canonical; twitter:title equals `<title>` on every post; 0 posts still carry
  the homepage twitter title.
- Head metadata diffed against live production (`main`): `/` and `/free-seating-chart-prompt`
  identical; `/tools` changes only description, og:description, twitter:title and
  twitter:description; a sample post changes only twitter title/description and adds og:image
  tags. BlogPosting/FAQ JSON-LD identical to production on two sampled posts.
- Override path: a temporary `image: "/teacher-behavior-log.png"` on one post rendered as an
  absolute og:image and twitter:image; reverted and rebuilt before the checks above.
- Links: each of the 7 new hrefs appears exactly once in its source page's built HTML with
  correct spacing, and every target returns 200. No em dashes in the diff.
