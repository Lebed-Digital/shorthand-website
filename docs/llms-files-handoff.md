# llms Files Session Handoff

**Last updated:** 2026-08-16

## Current status

The minimal `llms` cleanup is complete and pushed to `origin/main`.

- Current commit: `caee6872638db3c4d46586bd1b48605892fee070`
- Commit message: `Simplify llms content`
- The earlier local SHA `54e37cb` was amended and should not be treated as the final commit.
- `public/llms-full.txt` was deleted.
- `public/llms.txt` remains manually curated.
- No generator, package script, build hook, or deployment configuration was added.

The final Behavior Tracking line is:

```text
- Behavior Tracking: review each student's note history and see an 8-week activity view to spot recent patterns
```

## Why this wording was chosen

The shipping ShortHand app was checked in the canonical app checkout at:

`C:\Projects\pulse-2.0-main-integration`

The app checkout was on `main` at commit
`6a4441f5ae9f6ed0887e112289b25bff6ce72677`, which matched `origin/main` at the
time of investigation.

Findings:

- The 4-week class behavior trend exists in
  `src/components/InsightsScreen.tsx`, but Reports/Insights is excluded from
  every entitlement state in `src/context/ProGate.tsx`.
- `src/App.tsx` redirects the `insights` tab to Pulse and does not render the
  Insights screen. The class trend is therefore unavailable to Free, trial,
  paid, and complimentary users today.
- The individual student dashboard creates eight weekly activity buckets in
  `src/components/StudentDetailView.tsx` and renders without a Pro entitlement
  check. A normal Free user can see it.
- Student notes are loaded without a date cap in
  `src/hooks/useClassroomData.ts`. The student timeline exposes older notes
  through its Show 5 More control.
- AI report note filters currently exposed in the UI are Today, 5 Days,
  14 Days, 30 Days, and Custom. They are not the same concept as a behavior
  trend chart range.
- The planned Detailed report quota is deliberately inactive in
  `src/lib/quota.ts`.

This evidence ruled out the prior `1 day to 52 weeks` wording. It mixed report
date filters, an available 8-week student view, and hidden class-insights
functionality.

## Website discrepancies found

At the time of investigation:

- The deployed homepage FAQ was observed claiming tracking from 1 day to
  52 weeks, visual trend charts, and smart badges as general capabilities.
  Recheck the live page before acting because deployment state can change.
- The current local homepage source only promotes color-coded student alerts.
- `app/features/class-insights/page.tsx` describes intended 4-week through
  52-week charts and smart badges. The route is unlinked, noindexed, and has a
  visible warning that it describes intended rather than current behavior.
- `public/llms.txt` still describes the Behavior Tracking feature-page link as
  `Visual trend data for IEP meetings and conferences`. That description was
  not changed because the final amendment was explicitly limited to the single
  Core Features line. Recheck it if another accuracy cleanup is requested.

## Decision on maintenance

Keep one small, hand-written `public/llms.txt`. Do not generate a blog URL list
or recreate `llms-full.txt` unless there is evidence that a real consumer needs
it. The blog index already provides discovery, while automation would add a
build dependency and recurring generated diffs without fixing the more likely
source of drift, manually stated product facts.

Product facts in `public/llms.txt` should be rechecked whenever app behavior or
entitlements change.

## Repository state after the product change

Immediately after pushing `caee687`:

- Local `main` matched `origin/main`.
- The working tree was clean.
- No PR was created because the commit was pushed directly to `main` at the
  user's request.

This handoff file was created afterward as a separate documentation change.
