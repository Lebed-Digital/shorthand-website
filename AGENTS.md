## Em dash rule — critical
Never use em dashes (—) in any user-facing content: copy, blog posts, UI text, emails, or anything a visitor might read. Rewrite with commas, periods, or colons instead.

## Blog illustration workflow
Canonical workflow lives in Brain/blog_illustration_workflow.md (C:\Users\doubl\GOOGLE DRIVE\My Drive\Google AI Studio\ShortHand\Brain\blog_illustration_workflow.md). Read it before generating any blog post illustration.

## Before merging, redirecting, or deleting any blog post
Check the post's frontmatter for a `mergeNote` field first. If present, it points to a prior decision in Brain/Decisions Log.md (C:\Users\doubl\GOOGLE DRIVE\My Drive\Google AI Studio\ShortHand\Brain\Decisions Log.md) explaining why similar-looking posts were kept separate. Do not merge/redirect on topic-similarity alone, pull fresh GSC query-level data first to check for actual cannibalization (same query, multiple pages, split clicks), not just similar titles.

## Before adding a new top-level page or route
Check the `redirects()` block in `next.config.ts` first. Social shortlinks live there and reserve top-level words (`/welcome`, `/letters`, `/letter`, `/ig`, `/tt`, `/yt`, `/fb`, `/sub`, `/x`, `/li`, `/how-it-works`, `/dojo`, `/comm`, `/com`). Treat that list as a snapshot, not the authority: read `next.config.ts` itself, since new shortlinks get added over time. A redirect silently takes precedence over a real page at the same path, so adding `app/welcome/page.tsx` while `/welcome` is a redirect gives you a page that works locally and 307s away in production, with no build error to warn you.

If the word is taken and you want the real page, retire or rename the redirect in the same PR. These are all `permanent: false` so browsers have not cached them hard and repointing is safe. Shortlinks get printed in social video descriptions, so if one is already published, prefer moving the shortlink to a new word over silently breaking it: check with Greg on which are live.

## Stale branch safety — critical
Before merging any PR that is not freshly based on current `main`, verify it does not remove or revert changes already merged after the branch was created. If stale, update it or recreate the change from current `main` before merging.

Diff against current `main`, not the PR's original base: `git diff main origin/<branch>`. Read `--stat` for deletions, since those are the dangerous direction. If in any doubt, stop and report the risk instead of merging.

This is a manual check by deliberate choice. Branch protection requiring up-to-date branches was considered and declined in August 2026: the repo has no required CI/status check to hang it on. Do not add repo rules, Actions workflows, or merge-setting changes to solve this unless Greg asks.

Why it matters: two open PRs in August 2026 each held the correct intended change but had gone stale. One would have silently reverted billing and data-retention disclosures; the other would have deleted `app/delete-account/page.tsx`, the Google Play compliance page, with no build error to warn anyone. GitHub shows no staleness warning, and the merge button looks identical whether a branch is one commit behind or forty.

## Review before asking Greg to check a preview
Pick the tier by what the change touches, not its size. The highest tier wins; when unsure, go one up.

- **Light: no independent review.** Blog posts and other content markdown (`posts/`, `docs/`, `plans/`), images, and text or styling-only edits.
- **Medium: one `/code-review medium` pass.** Any other code: pages, components, `app/tools/**`, `app/resources/**`, `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`, `next.config.ts` redirects. The pass reviews with fresh context and only reports. Judge each finding, fix the real ones, rerun the checks. No second pass.
- **Critical: Codex review at high effort.** `app/api/**` (rate limits, report-card checkout and access), `supabase/**`, `proxy.ts`, the PostHog privacy surface (`instrumentation-client.ts`, `lib/posthog-*`), the privacy, terms, DPA and delete-account pages, and any page where a visitor types personal information. Follow the app repo's `/codex-review` procedure (`c:\Projects\pulse 2.0\.claude\skills\codex-review\SKILL.md`); its `npm run lint`, `test` and `build` steps exist here too. If that file is not on this machine, say so and ask Greg instead of skipping the review. Two Codex passes maximum.
- Never both Codex and `/code-review` on one change unless Greg asks.

**Ready for Greg:** for a code change, `npm run lint`, `npm run test` and `npm run build` pass locally (this repo has no CI, so this is the only check besides Vercel's build), the tier's review is done, and the PR description has one `Review:` line saying what ran and how it ended, for example `Review: /code-review medium, 2 findings, both fixed` or `Review: none (Light)`.

This ends where Greg's preview check begins. `/ship`, the content self-merge exception and every other merge rule in the global instructions are unchanged.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Before adding a page where a visitor can type personal information
PostHog Session Replay runs on this site (`instrumentation-client.ts`). Typed form values are masked on every page, but on-screen text is masked only on the paths in `SENSITIVE_PATH_PREFIXES` (`lib/posthog-privacy.ts`) and inside elements with the `ph-mask` class. A new tool or form page that can show typed data back as ordinary text must be added to that list and get `ph-mask` on its root element.

Custom PostHog events go through `captureEvent()` in `lib/posthog-events.ts` and nowhere else. That file lists every allowed event name, property name, and property value, and `before_send` silently drops anything not on the list, so a new event that skips the list will never arrive. Never add a property that carries typed, copied, or generated text, link or button text, an email address, or a URL. Autocapture stays off.

Feature flags are off (`advanced_disable_feature_flags` in `instrumentation-client.ts`), and `filterCustomEvent()` strips every flag property and every `$feature_flag_called`. No experiment code is in the repo since both 2026-11 tests were retired. To run a new time-boxed test, restore the pieces from git history (search the log for "retire homepage-modern and blog-cta-presentation"): the `EXPERIMENTS` list, `experimentVariant()` / `experimentSeen()`, the narrow flag request in `instrumentation-client.ts`, and its checks in `tests/manual/posthog-privacy-check.mjs`. The flag request is the one PostHog request that does not pass through `before_send`. PostHog's no-code web experiments, surveys and tours stay off.

Do not call `posthog.identify()` anywhere on this site. Do not loosen the settings in `instrumentation-client.ts` without reading its comments: several exist because a PostHog dashboard toggle would otherwise override the code. The privacy policy describes this behavior, so that file and `app/privacy/page.tsx` change together. After any such change, and after upgrading `posthog-js`, run the browser check described at the top of `tests/manual/posthog-privacy-check.mjs`: the masking depends on SDK behavior that unit tests cannot see.

## Experiments are time-boxed (Greg, 2026-11-25)
A/B tests inform decisions. They do not freeze the site. This site gets about 100 homepage visitors and a few hundred blog readers a month, so significance on small differences can take a year. Waiting that long is not an option.

- **Before launch,** write down the stop date (default 4 weeks, 8 at most), the primary metric, and the decision rule, for example "keep the variant if it leads on the primary metric and nothing is broken". Put them in the PostHog experiment description and in CURRENT_STATE.md.
- **At the stop date,** review it and decide: per-variant visitors, conversions, rates, relative difference, win probability, sample ratio, outliers, tracking gaps, and a look at a few recordings. Significance is not required. A consistent lean with clean data is enough to pick, and you state the uncertainty plainly. Record the result in `docs/experiments-review-YYYY-MM-DD.md` (first one: `docs/experiments-review-2026-11-25.md`).
- **While a test runs,** site improvements do not wait. Say when a change touches a tested page or metric, and ship it unless Greg says hold. Arm-symmetric changes (the same edit for both variants, or pages both arms share) are noise, not bias.
- **Greg picks the winner.** Present the results and a recommendation, and do not deploy or retire a variant until Greg says so.
- Test bold changes, not polish. At this traffic, only big differences show up.
- Analyse exposure with the experiment's own exposure event (`$feature_flag_called` or `$exposure`), not the `$feature/...` tag on the pageview. The flag often loads after the pageview fires.

## Deploys
This Vercel project (`shorthand-website`) has working Git integration: pushing a branch builds its preview, and merging to `main` deploys production within seconds. **Do not run `vercel deploy` here.** It only creates a second identical deployment that burns Deployment Storage (happened 2026-09-20, commit `94d7a03`). The app repo (`pulse 2.0`, Vercel project `pulse-3`) is the opposite: CLI-only.

## SEO and AEO rules (ShortHand website)

These apply to every page and blog post. Do not skip any of these when adding new content.

### Date format — critical
- Frontmatter `date` must be bare `YYYY-MM-DD` — no time, no timezone, no `T`
- The sitemap generator appends `T12:00:00` automatically — if the date already has a `T` it crashes the build
- Full ISO dates (with `T`) are only allowed inside `schema.org` JSON-LD blocks

### Schema / JSON-LD rules
- `SoftwareApplication` and `Organization` schemas live in `app/layout.tsx` — do not move them to individual pages
- `BlogPosting` schema goes in each blog post's `page.tsx` — not in layout (would inject on every page including privacy/terms)
- `FAQPage` JSON-LD is emitted on purpose by `app/blog/[slug]/page.tsx` for every post with `faq` frontmatter (kept by Greg, 2026-11-20: valid markup, harmless, readable by non-Google engines). Google does not show FAQ rich results for this site, so expect none. Do not remove it from blog posts, and do not add `FAQPage` to non-blog pages
- Self-canonicals (`alternates: { canonical: url }`) required on every page including /privacy, /terms, /dpa

### AI crawler rules (robots.ts)
The following crawlers are explicitly allowed: GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-Web, PerplexityBot, Google-Extended, Applebot-Extended
CCBot is blocked (scraper, not a search bot)
When adding new AI search crawlers, add them to `app/robots.ts`

### AEO (Answer Engine Optimization)
- Every blog post needs an FAQ section with 3-4 questions teachers would actually Google
- FAQ answers should be under 100 words, specific, and directly answer the question — written to be lifted verbatim by AI answer engines
- No hidden keyword sections — Google flags these as spam, they were removed May 2026
- `llms.txt` exists at `/llms.txt` — keeps ChatGPT Search and Perplexity crawling the site

### Internal linking
- Every new blog post needs 2-4 internal links to related posts
- Hub pages exist for 4 clusters: parent comms, behavior documentation, ClassDojo alternatives, teacher workload/burnout
- New posts should link to the relevant hub page and at least one spoke post
- Orphan posts (no internal links pointing to them) hurt SEO — always check after adding a post

### Performance
- YouTube embeds must use the facade pattern: thumbnail + play button, swap to iframe on click with `?autoplay=1`
- Never embed a raw YouTube `<iframe>` on a marketing page — kills LCP score
- Blog tables must be wrapped in `overflow-x: auto` div for mobile

### OG / metadata
- Every page needs: title, description, OG title, OG description, OG image, canonical, twitter card
- Twitter card type: `summary_large_image` (not `summary`)
- OG image: `/og-image-v2.png` (1200x630, SH TEACHERS branding, PR #137, 2026-10-21). The old `/og-image.png` and `/og-image.webp` are the pre-rebrand notebook art, unreferenced, kept pending cleanup. Do not point new pages at them. Next time the artwork changes, use a new filename (`-v3`) so link-preview caches refetch.
