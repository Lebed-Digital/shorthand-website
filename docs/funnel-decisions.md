# Funnel Decisions

## CTA destination: body CTAs vs. nav/discovery CTAs

### Current standard (as of 2026-06-26)

Body conversion CTAs (end-of-article blocks, inline post links, about-page conversion blocks) send users directly into the guided demo:

```
https://app.getshorthandapp.com?demo=true
```

The philosophy is **experience first**: a reader who just finished a blog post has enough context to see the product in action without being forced into account creation. `?demo=true` bypasses signup and drops them directly into the live demo with pre-loaded student data. They can create an account after they've seen it work.

Nav/discovery CTAs (top nav "Get ShortHand" buttons, legal page navs, homepage hero) point to the install instructions page:

```
/install
```

### Historical note

Prior to 2026-06-26, body CTAs used `?signup=1`:

```
https://app.getshorthandapp.com?signup=1
```

This was a signup-first approach that required account creation before seeing the product. It was replaced across all 54 blog posts and 3 TSX pages with `?demo=true` to reduce friction and align with the demo-first funnel.

`?signup=1` is preserved here as historical context only. It is no longer used anywhere in the codebase.

### Applied as of 2026-06-17 (original)
- Shared blog bottom CTA (`app/blog/[slug]/page.tsx`) — updated to app signup URL
- All inline blog post links (`posts/*.md`, 56 files) — updated to app signup URL
- About page body CTA (`app/about/page.tsx:150`) — updated to app signup URL

### Updated 2026-06-26 (demo-first migration)
- All body CTAs migrated from `?signup=1` → `?demo=true`
- Files changed: 54 blog posts, `app/about/page.tsx`, `app/blog/[slug]/page.tsx`, `app/install/page.tsx`

### Left on `/install` (nav/discovery)
- Top nav "Get ShortHand" buttons across all pages
- `/install`, `/privacy`, `/terms`, `/dpa` page nav buttons
- Homepage hero CTA (`app/page.tsx`)
