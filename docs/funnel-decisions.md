# Funnel Decisions

## CTA destination: body CTAs vs. nav/discovery CTAs

### Rule
Body conversion CTAs (end-of-article blocks, inline post links, about-page conversion blocks) send users directly to the app signup/demo flow:

```
https://app.getshorthandapp.com?signup=1
```

Nav/discovery CTAs (top nav "Get ShortHand" buttons, legal page navs, homepage hero, how-it-works page) point to the install instructions page:

```
/install
```

### Rationale
A reader who just finished a blog post or scrolled to the bottom of the About page has already decided to try the product. Sending them to the install instructions page adds friction and drops conversion. The `/install` page is appropriate for users who need to understand what a PWA is before they commit.

### Applied as of 2026-06-17
- Shared blog bottom CTA (`app/blog/[slug]/page.tsx`) — updated to app signup URL
- All inline blog post links (`posts/*.md`, 56 files) — updated to app signup URL
- About page body CTA (`app/about/page.tsx:150`) — updated to app signup URL

### Left on `/install` (nav/discovery)
- Top nav "Get ShortHand" buttons across all pages
- `/install`, `/how-it-works`, `/privacy`, `/terms`, `/dpa` page nav buttons
- Homepage hero CTA (`app/page.tsx`)
