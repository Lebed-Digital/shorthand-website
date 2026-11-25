# Experiment review, 2026-11-25

Two PostHog experiments, reviewed with a practical framework: is the data trustworthy, which way does it lean, how much would a wrong call cost. Statistical significance was not required (Greg, 2026-11-25).

Method: HogQL against raw events in PostHog project 643752, one row per person, first-seen variant, conversions counted only after that person's first exposure. Win probabilities use Beta(1,1) priors (Monte Carlo, 200k draws). Session recordings filtered with `filter_test_accounts: true`.

## 1. `homepage-modern` (experiment 573008)

Setup: 25% of human visitors get `app/modern-preview` at `/` (proxy.ts, `sh_home` cookie, 90 days). Exposure = homepage `$pageview` tagged `$feature/homepage-modern`. Started 2026-11-06. Mid-test changes on 11-10 (PR #167, test-arm fade removed) and 11-16 (PR #179, test-arm phone menu + press line on both). Official read window starts 2026-11-16.

### Results

Full run (2026-11-06 to 2026-11-25):

| Metric (per visitor) | Control (current) | Test (modern) | Relative | P(test better) | 90% interval on lift |
|---|---|---|---|---|---|
| Visitors | 63 | 28 | | | |
| Opened the web app (primary) | 11 (17.5%) | 7 (25.0%) | +43% | 0.81 | -29% to +177% |
| Started Quick Grid demo | 8 (12.7%) | 5 (17.9%) | +41% | 0.77 | -38% to +217% |
| Finished Quick Grid demo | 1 (1.6%) | 4 (14.3%) | +800% | 0.99 | +68% to +3040% |
| App OR demo start | 19 (30.2%) | 10 (35.7%) | +18% | 0.71 | -31% to +94% |
| App Store / Play click | 1 | 0 | | | |
| Visited another page | 11 (17.5%) | 6 (21.4%) | | | |
| Avg max scroll on `/` | 23% | 43% | | | |
| Median time on `/` | 16 s | 26 s | | | |

Read window only (2026-11-16 to 2026-11-25): control 27 visitors, 3 app opens (11.1%); test 12 visitors, 2 app opens (16.7%), P(test better) 0.72. Quick Grid starts 4 vs 1. Same direction, smaller sample.

### Data quality

- Allocation: 28 of 91 tagged visitors (31%) got test against a 25% target. Chi-square p ≈ 0.23, so no sample ratio mismatch.
- No visitor saw both variants (cookie assignment is sticky).
- 18 homepage pageviews carried no variant tag (7 of them with no browser string, so likely bots). Small, and not tied to an arm.
- Outliers: no single visitor drives the result. Every converter has 1-2 app clicks. One test visitor viewed `/` 5 times (one conversion counted).
- Traffic mix is similar: Google and direct desktop dominate both arms. A few non-US visitors (NG, AE, HK, AU, IN, MX) converted in both arms.
- Session recordings: 24 test-arm recordings, 0 console errors. Autocapture is off, so rage and dead clicks aren't recorded.
- PostHog's own planner estimated about 395 days to reach significance at this traffic.

### Recommendation: keep the modern homepage

Every metric leans the same way: app opens, demo starts, demo completions, scroll depth and time on page. Health checks are clean, and no outlier or tracking fault explains the gap. The demo completion difference (4 of 28 vs 1 of 63) is the strongest single signal. The primary metric is still a lean, not proof: about an 80% chance the modern page is better, with a range that includes a modest loss.

The cost of a wrong call is low. The page is one rewrite in `proxy.ts`, so it can be switched back in minutes, and the next month of traffic still shows whether the app-open rate holds.

Before making it the only homepage (Greg reviews first, nothing has been deployed):
1. Sort out PR #190 (still open). It changes the control homepage only ("SGO" wording, whole-school FAQ answer, footer contrast). If the modern page wins, apply the equivalent edits to `app/modern-preview` instead, or they are lost when the control page is retired.
2. Retire the experiment in one PR: remove the `proxy.ts` rewrite and cookie, move the modern page to `app/page.tsx`, remove the `homepage-modern` entry from `EXPERIMENTS`, update `tests/manual/posthog-privacy-check.mjs` and the privacy policy's "two versions" sentence if no experiment remains, then end experiment 573008 in PostHog.
3. Check one number after 30 days: web-app opens per homepage visitor stays at or above the old control's ~17%.

## 2. `blog-cta-presentation` (experiment 546099)

Setup: mid-article "workflow bridge" CTA on `/blog/sample-emails-to-parents-about-student-behavior`, control = boxed card, test = editorial style, 50/50 via PostHog flag. Same words, link, position. Started 2026-11-02. Primary metric: `app_link_clicked` with `cta_location = blog_body` on that page.

### Results (2026-11-02 to 2026-11-25)

Exposure = `$feature_flag_called` for `blog-cta-presentation`.

| Metric (per visitor) | Control (boxed) | Test (editorial) | P(test better) |
|---|---|---|---|
| Visitors | 82 | 82 | |
| Paused on the CTA (`blog_cta_paused`) | 44 (53.7%) | 34 (41.5%) | 0.06 |
| In-body app click (primary) | 2 (2.4%) | 0 (0%) | 0.12 |
| Any app click | 3 | 0 | |
| PDF download | 2 | 0 | |
| Copied an example | 7 | 9 | |

### Data quality

- Allocation is an exact 82/82 split. No visitor saw both variants.
- Coverage gap: about 292 people viewed the post in this period, but only 164 (56%) have a flag call. The other 44% (likely ad-blocked flag requests or exits before hydration) are outside the test. That doesn't favor either arm, but the results cover about half the readers.
- `$feature/blog-cta-presentation` is on only 36 of the post's pageviews (the flag loads after the pageview fires). Analyses must use `$feature_flag_called`, not the pageview tag.
- Volume is very low: 2 conversions in total.

### Recommendation: keep the boxed card (control)

Everything that moved favors the boxed card: more readers stopped on it (54% vs 41%, the clearest difference), and all app clicks and PDF downloads came from that arm. The editorial style was meant to read more naturally, but the data suggests fewer people notice it. Six more days to the 2026-12-01 review would add about 30 visitors and can't change that picture, so there's no reason to wait. Ending early costs nothing because control is what was live before.

Ending it is a code change (branch, preview, Greg's merge): remove `BlogCtaExperiment`, the `EXPERIMENTS` entry and the `?cta=` preview switch, render the boxed card directly, update `tests/manual/posthog-privacy-check.mjs` and the privacy policy if no experiment remains, then end experiment 546099 in PostHog. Waiting on Greg.

## Lessons for the next test

- Time-box from the start: pick a stop date and the decision rule before launch (see AGENTS.md, "Experiments").
- At about 100 homepage visitors a month and about 160 tracked post readers a month, only large differences show up. Test bold changes, not polish.
- Use `$feature_flag_called` (or the experiment's own exposure event) for analysis, never the pageview tag.
