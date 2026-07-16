# Funnel Decisions

## CTA destination: demo-first vs. signup-first

### Current standard (as of 2026-07-15)

Two funnel paths, split by visitor intent — not by CTA position (nav vs. body) alone.

**Demo-first** — for cold/educational traffic that hasn't decided yet:
```
https://app.getshorthandapp.com?demo=true
```
`?demo=true` bypasses signup and drops the visitor directly into the live demo with pre-loaded student data. Used on: blog posts (`posts/*.md`, `app/blog/[slug]/page.tsx`, `app/blog/page.tsx`), the homepage hero (`app/page.tsx`), `/about`, `/install` (both its nav and body CTA), `/press`, `/terms`, `/privacy`, `/dpa`, `/back-to-school-toolkit`.

Philosophy: **experience first**. A reader who just finished a blog post, or a first-time visitor on the homepage hero, has enough context to see the product in action without being forced into account creation first. They can create an account after they've seen it work.

**Signup-first** — bare app URL, no query param:
```
https://app.getshorthandapp.com
```
No `?demo=true` means `isDemo` evaluates false in `App.tsx` (pulse 2.0 repo), so the visitor lands directly on the Sign In / Create Account screen — no demo detour. Used on: every page's nav "Get ShortHand" / "Open ShortHand →" button (including the homepage nav, which is distinct from the homepage *hero*), the six feature landing pages (`ai-reports`, `class-insights`, `behavior-tracking`, `parent-communication-log`, `parent-emails`, `quick-note`), `classdojo-alternative`, `/tools`, `/resources`, `/free-tool`.

Philosophy: these are the buttons a visitor reaches when they've already decided. Nav CTAs get clicked by people re-visiting to open the app, not people browsing cold — they don't need a demo detour they didn't ask for. The feature pages and `classdojo-alternative` are SEO landing pages for high-intent searches ("classdojo alternative", "behavior tracking software") — the visitor is already comparing solutions, not looking for a soft on-ramp, so sending them straight to account creation is the shorter path to the thing they came to do.

**Confirmed 2026-07-15**: this split is deliberately kept, not a gap to fix. Traced two real signups back to this exact bypass path (nav / high-intent landing pages) with zero prior demo engagement under the resulting account — the direct-to-signup path is converting, so it stays as-is.

### Historical note

Prior to 2026-06-26, all body CTAs used `?signup=1`:
```
https://app.getshorthandapp.com?signup=1
```
This was a signup-first approach that required account creation before seeing the product. It was replaced across all 54 blog posts and 3 TSX pages with `?demo=true` to reduce friction and align with the demo-first funnel.

`?signup=1` is preserved here as historical context only. It is no longer used anywhere in the codebase.

Prior to 2026-07-15, this doc described the split as strictly "body CTAs → demo, nav/discovery CTAs → `/install`," and listed the homepage hero as one of the CTAs left on `/install`. That was already stale relative to the code: the homepage hero has used `?demo=true` directly since the 2026-06-26 migration (never routed through `/install`), and nav CTAs across the site link straight to the bare app URL, not to `/install`. The six feature pages and `classdojo-alternative` were also missing from the doc entirely. The "Current standard" section above reflects what the code actually does and why, verified against `app/page.tsx`, the six `app/features/*/page.tsx` files, and `app/classdojo-alternative/page.tsx`.

### Applied as of 2026-06-17 (original)
- Shared blog bottom CTA (`app/blog/[slug]/page.tsx`) — updated to app signup URL
- All inline blog post links (`posts/*.md`, 56 files) — updated to app signup URL
- About page body CTA (`app/about/page.tsx:150`) — updated to app signup URL

### Updated 2026-06-26 (demo-first migration)
- All body CTAs migrated from `?signup=1` → `?demo=true`
- Files changed: 54 blog posts, `app/about/page.tsx`, `app/blog/[slug]/page.tsx`, `app/install/page.tsx`
