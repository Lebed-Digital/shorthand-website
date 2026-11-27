# ShortHand product facts

The one place for facts the site states about the product. Blog drafts, page copy, FAQ answers and directory listings take their facts from here. If the app and this file disagree, the app is right: fix this file first, then the pages.

**When a fact changes:** update the line and its date, then search for the old wording and fix every hit, for example `rg -i "free forever|4\.99" posts app`. That is the whole process.

Last full check: 2026-11-22 against the app code (`pulse 2.0`). Moved here from CURRENT_STATE.md on 2026-11-27.

## Plans and prices

- **Free plan with no time limit.** Free is permanent, not a trial. Notes, students, classes, parent communication log, goals and accommodations are free with no cap. AI parent notes (Quick Note Home, Detailed Report) are free. Wording rule: say "Free plan with no time limit", never "free forever". Source: app code, `/pricing`.
- **Pro: $4.99/month on the web.** Eligible accounts get one 30-day Pro trial, no credit card. The iPhone app buys through Apple at Apple's price; a browser on any phone uses Stripe. Source: app code, `/pricing`.
- **Pro adds:** the Reports tab (Student Documentation Report, Meeting Prep Report, Documentation Coverage), Ask ShortHand, Shoutouts, Class Summary, Class Note mode, bulk parent emails, Import Birthdays, Quick Grade Table, School Calendar and Rotation. Source: app code.
- **Cancelling:** web subscribers ask support (info@getshorthandapp.com), who cancel in the Stripe Dashboard; the account moves to Free when paid access ends and notes stay. There is no self-service web cancel. App Store purchases cancel in Apple ID settings. The site promises no response time. Source: app code.
- **Report Card Comment Library: $4.99 one-time, no subscription.** 374 comments, Pre-K through grade 5, free sample with no sign-up, access restored on any device by email. Source: `app/report-card-comment-library/PaywallClient.tsx`, `LibraryClient.tsx` (2026-11-27).

## What it is and is not

- Each teacher has their own account. No school, team or district accounts exist. Source: app code.
- ShortHand never sends messages itself. Drafts open in the teacher's mail app or Gmail. Source: app code.
- Parent contacts are logged by the teacher. Nothing is captured automatically. Source: app code (`addParentCommunication` is an explicit teacher action), 2026-09-14 link review.
- Voice dictation on the web uses the browser's own speech recognition. Source: `app/for-schools/page.tsx`.
- Platforms: web app at app.getshorthandapp.com, the App Store (iPhone), Google Play (Android), or add to home screen from the browser. Source: `app/install/`.

## About the author

- Gregory Lebed: 3rd grade teacher, former RBT, 20+ years in education (not "20 years teaching"). Built ShortHand for his own classroom.

## Domains

- Marketing site: getshorthandapp.com. App: app.getshorthandapp.com. Never getshorthand.app (abandoned, blocked by school filters).

Re-check the app before adding new numbers or Pro claims to the site.
