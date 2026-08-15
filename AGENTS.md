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

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
