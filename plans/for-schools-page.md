# Plan: "For School IT" page + teacher approval email (`/for-schools`)

Date: 2026-11-18. Status: PLAN, Codex-reviewed once (high), awaiting Greg's approval. Nothing built.
Source: `Brain/District Blocking Audit - 2026-11-18.md` (recommendations 1 and 3).

## Why

One documented district refusal (Azle ISD, TX) gave two reasons: ShortHand "can
communicate with students and parents" (not an approved channel), and "an outside source
could see student information." The site never explains how the draft handoff or the data
flows actually work. This page describes both plainly so a district can judge them
against its own policies. It does not argue that the district was wrong.

## Scope

- New `app/for-schools/page.tsx` (server component, static).
- New `app/for-schools/CopyEmail.tsx` (client component, copy button only).
- `components/Footer.tsx`: add a "For Schools" link.
- `app/dpa/page.tsx`: one sentence + link inside the "What Teachers Should Know" summary
  box, which states it is not the agreement. Agreement text, sections, and "Last updated"
  untouched.
- `app/sitemap.ts`: add `/for-schools`.

Not doing: app changes, Supabase, legal text, analytics events, PDF version, web-filter
submissions, state DPA work, homepage or top-nav links, `llms.txt`.

`/for-schools` is free: not in `next.config.ts` `redirects()`; `proxy.ts` matcher is `/` only.

## Verified claims

Website sources are published pages on `origin/main` `497c764`. App sources are
`pulse 2.0` `origin/main` `2392a95`.

| Claim | Source |
|---|---|
| Parent email drafts: `mailto:` on mobile OSes (incl. iPad), Gmail web compose on desktop OSes. Gmail compose URL carries recipient, subject, body; opens the last-active Google account | `src/utils/emailCompose.ts:22-40`, `emailTarget.ts`, `.claude/docs/desktop-email-gmail-handoff.md` |
| Text action opens the device's messaging app (`sms:`), hidden on desktop OSes | `StudentDetailView.tsx:3442-3452`, `emailTarget.ts:35-49` |
| Copy action exists for Quick Note drafts | `StudentDetailView.tsx:3443` |
| No server-side email or SMS to parents or students. Server email goes only to the teacher (sign-in confirmation, transactional) or to the founder (alerts) | `supabase/functions/*`, `api/` (no mail routes, no SMS provider); DPA §6 Resend line |
| No student accounts or logins; no share links or parent portal | Privacy "Who This Applies To", DPA §8, Terms §2; app `git grep` none |
| Stored data types; Google Classroom fields + token | Privacy "What We Collect" |
| Supabase, AWS us-east-1, SOC 2 Type II, AES-256 at rest, TLS, RLS per account, authenticated APIs; operator access commitment | DPA §3, §6; Privacy "How We Protect Your Data", "What We Don't Do" |
| Notes waiting to sync are queued in the browser on the device | `.claude/docs/note-save-truthfulness-and-queue.md` |
| AI: most features OpenAI first, same request to Groq on timeout or certain errors; calendar PDF scan OpenAI only; auto-tagging sends note text in the background; no training; optional OpenAI sharing off; standard OpenAI retention up to 30 days, primarily abuse monitoring; Groq ZDR | `api/ai.ts:137-200`, `api/calendar-scan.ts:34,119`; DPA §6; Privacy "How ShortHand Uses AI"; Brain `Decisions Log.md` 2026-10-06 |
| Auto-tags can be saved without teacher acceptance; goal suggestions are teacher-chosen | `.claude/docs/note-save-performance.md`, `StudentDetailView.tsx:2757-2795` |
| Web dictation uses the browser's speech recognition | Privacy "How ShortHand Uses AI" |
| Sentry (web only) crash reports can incidentally include a student, parent, or class name | DPA §6 |
| iOS: explicit AI consent, fails closed; GA, Vercel Analytics, Sentry off | Privacy "The Native iOS App" |
| Android app is a TWA of the web app | `.claude/docs/android-twa-pro-purchasing.md`; website `/install` |
| Export, Factory Wipe, Delete My Account (Stripe must confirm cancellation first; some billing records kept); school written request, 30 days | Privacy "Your Rights"; DPA §5; `supabase/functions/delete-account/handler.ts:76-88` |
| 72-hour notice of a breach affecting Student Data; schools authorize users and obtain consents | DPA §3, §4 |
| Countersigned ShortHand DPA within 2 business days | DPA summary box |
| Domains | `index.html:9`, `src/lib/supabase.ts`, `accountDeletion.ts:25`, `emailCompose.ts:40`, `analytics.ts:58`, `src/index.css:1`, `vercel.json`; Sentry DSN host is in the public bundle |
| Built by a 3rd grade teacher | `/about` page |
| Contact `info@getshorthandapp.com` | DPA, Privacy, Footer |

Not claimed: FERPA/COPPA "compliant", any certification of ShortHand itself, MFA, backup
retention, incident-response plan, pen-testing, SDPC registry listing, signing a district
agreement unchanged, district approval anywhere, non-US data residency, a complete
firewall allowlist.

## Page copy (no em dashes)

Metadata: title and OG title "ShortHand for Schools: Privacy and IT Review"; description
and OG description "How ShortHand handles student data, parent communication, and AI,
for district IT and privacy review."; canonical; OG image `/og-image-v2.png`; twitter
`summary_large_image`. Indexed, in sitemap. Layout: DPA page shell (glow-field, nav,
`detail-hero`, summary box, `privacy-card`s, 760px column) and the shared `<Footer />`.

**Hero.** "ShortHand for Schools" / "For district IT, privacy, and administrative staff
reviewing ShortHand. Teachers: skip to the approval request email." (link `#approval-email`)

**At a glance** (summary box):
- Built for educators and school staff. Students don't have accounts and never use ShortHand.
- ShortHand doesn't send messages to parents or students. It prepares drafts, and the
  educator decides whether and where to send them.
- Each teacher's stored records are separated from every other account by database access controls.
- Student information is never sold, never used for advertising, and not used to train AI models.
- Some features send note text to AI providers. Details below.
- Teachers can export or erase their data. Schools can request deletion under the DPA.

**1. What ShortHand is.** A classroom documentation app built by a third grade teacher.
Teachers record short notes about student behavior, progress, and parent contact, then
use them to prepare reports, meeting notes, and parent messages. It runs as a web app at
app.getshorthandapp.com (the Android app on Google Play runs this same web app) and as a
native iOS app. It is not a student information system, a learning platform, or a
messaging service, and it doesn't replace your district's official records.

**2. How parent communication works.**
- ShortHand can draft a parent email or text from the teacher's notes.
- On a phone or iPad, an email draft opens in the device's mail app. On a computer, it
  opens in Gmail in the browser, which passes the recipient, subject, and draft text to
  Gmail and may use whichever Google account was last active, personal or district.
- On supported mobile devices, the Text button opens the device's messaging app with the draft.
- The educator reviews, edits, and sends from their own account. ShortHand's servers
  never email or text parents or students.
- Where a Copy button is available, a teacher can paste the draft into a
  district-approved channel instead, without opening Gmail.
- There are no student accounts, logins, or student messaging.
- Educators remain responsible for using the communication channels their district approves.

**3. Student data.**
- What's stored: what the educator enters, which can include student names, class
  periods, notes, behavior tags, goals, attendance, birthdays, accommodation information
  (IEP, 504, RTI), parent or guardian names and contact details, and a log of parent
  contacts. If a teacher connects Google Classroom, ShortHand reads the course list and
  student names, emails, and profile photos for roster import, and stores a connection
  token until the teacher disconnects. Teachers can enter first names or initials instead
  of full names.
- Where: Supabase database (AWS us-east-1, Virginia, USA). App hosted on Vercel. Notes
  waiting to sync are briefly queued in the browser on the teacher's device.
- Who can see it: stored records are tied to the teacher's account and separated by
  row-level security, so other teachers, schools, and parents can't see them. The
  operator (one person) can technically access the database and commits to doing so only
  at the teacher's request, for example to fix a problem.
- Leaving ShortHand: teachers can export their data, erase student records with Factory
  Wipe, or delete their account in Settings. Some billing records may be kept where
  required. Under the DPA, a school can request in writing that ShortHand delete the
  Student Data of its authorized users within 30 days.
- Service providers: the full list is in DPA Section 6 (link). Student information can
  reach Supabase and Vercel (storage and hosting), OpenAI and Groq (AI features), Google
  (only if the teacher connects Google Classroom or uses Gmail drafts), and Sentry (web
  crash reports can incidentally include a student, parent, or class name; not used in
  the iOS app). Web voice dictation uses the browser's own speech recognition, which may
  be processed by the browser maker.

**4. AI features.**
- Features: automatic note tagging, report and parent-message drafts, summaries, answers
  to questions about the teacher's own notes, and roster, birthday, and calendar imports.
- Requests go from ShortHand's servers, not the teacher's browser. Most features use
  OpenAI first and send the same request to Groq if OpenAI times out or returns certain
  errors. School calendar PDF scanning uses OpenAI only.
- When a note is saved without tags chosen by the teacher, its text is sent to the AI
  provider in the background to suggest tags. A provider receives whatever is in that
  text, which can include full names, accommodations, or goals. Imports can also send
  pasted parent contact details.
- Neither provider uses this data to train models. ShortHand has turned off optional data
  sharing with OpenAI. Under standard API data controls, OpenAI may retain inputs and
  outputs for up to 30 days, primarily for abuse monitoring. Groq is configured for Zero
  Data Retention.
- Teachers review drafts before using them and choose whether to add suggested goals.
  Automatic tagging can add tags to saved notes. Decisions about grades, placement, and
  discipline stay with educators.
- In the iOS app, AI features require the teacher's explicit consent and can be turned off.

**5. Security.**
- Data stored in Supabase is encrypted at rest (AES-256). Traffic between the app and
  ShortHand's servers uses HTTPS.
- Supabase and Vercel are SOC 2 Type II certified providers.
- Row-level security on stored records. Account APIs verify the sign-in on every request.
- Sign-in: email and password, Google, or Sign in with Apple (iOS).
- Under the DPA, ShortHand notifies the school within 72 hours of becoming aware of a
  breach affecting Student Data.
- iOS app: no advertising SDK, no ad tracking, no Google Analytics, Vercel Analytics, or Sentry.

**6. District review and approval.**
- Documents: Privacy Policy, Data Processing Agreement, Terms of Service, Account Deletion (links).
- Signed DPA: email info@getshorthandapp.com with your district name for a countersigned
  copy of ShortHand's DPA, returned within 2 business days.
- District-specific agreements or review questions: email info@getshorthandapp.com. Any
  agreement is reviewed before it is signed.
- Under the DPA, schools decide who may enter Student Data and obtain any required consents.
- Whether ShortHand is approved is your district's decision.

**7. Technical information.**
- Nothing to install on district devices, no browser extensions, nothing on student devices.
- Common web app destinations (from the app's code, not a guaranteed complete allowlist):
  - Core: `app.getshorthandapp.com` (app, its API, and Vercel Analytics),
    `muywwvbmpjotcffocyjb.supabase.co` (database and sign-in).
  - Optional features: `accounts.google.com` (Google sign-in, Google Classroom),
    `mail.google.com` (email drafts on a computer), `checkout.stripe.com` (buying Pro on
    the web), `fonts.googleapis.com` and `fonts.gstatic.com` (fonts).
  - Web analytics and crash reporting: `www.googletagmanager.com`,
    `*.google-analytics.com`, `*.ingest.us.sentry.io`.
  - Website: `getshorthandapp.com`.
- "Please review these through your district's normal process. We don't recommend
  working around district filtering."

**8. Need approval from your district?** (`id="approval-email"`)
Intro: "Send this to your technology department. Copy it, paste it into a new email, and
edit it however you like." Read-only box + Copy Email button. Below: "Approval is your
district's decision."

> Subject: Request to Review ShortHand Classroom Documentation Tool
>
> Hello,
>
> I'd like to request approval to use ShortHand, a classroom documentation app built by an elementary school teacher.
>
> It helps teachers organize student observations and prepare parent communications. It does not send emails or messages to parents on its own, and students do not use it or have accounts.
>
> The developer has published information about student privacy, security, and data handling for district review:
> https://getshorthandapp.com/for-schools
>
> The Data Processing Agreement is available here:
> https://getshorthandapp.com/dpa
>
> Would your department be willing to review ShortHand and let me know whether it can be approved for classroom use?
>
> Thank you!

**9. Contact.** info@getshorthandapp.com, ShortHand / Lebed Digital LLC.

## Copy button

`CopyEmail.tsx` follows `app/free-seating-chart-prompt/PromptClient.tsx`: clipboard write,
fallback selects the `<pre>` when the clipboard is blocked, `aria-live` status. Copies
subject line + body. No tracking. The text isn't editable on the page, so there is no
typed input and no PostHog masking change.

## Discoverability

Footer "For Schools" link, DPA summary-box link, sitemap. No homepage or nav change.

## Build and validation

- Before coding: read the relevant `node_modules/next/dist/docs/` guide (metadata, client components).
- `npm run lint`, `npm run test`, `npm run build`.
- Grep built HTML for em dashes and `</(a|strong)>[A-Za-z]`.
- Playwright on the preview: 375px with no horizontal scroll, Copy Email clipboard text,
  `#approval-email` anchor.
- Review tier Critical (privacy representations, DPA page edit): `/codex-review` at high
  effort on the diff, two passes max. PR description gets a `Review:` line.
- Branch + PR + Vercel preview. Merge only after Greg confirms the preview.

## Needs Greg before building

1. OK to add one sentence + link in the DPA summary box (not the agreement)?
2. OK to publish the Supabase host? It is already in the app's public JavaScript.
3. Production settings: confirm OpenAI optional sharing is still off and Groq ZDR is still
   on (Codex can't see dashboards; the page repeats the DPA's existing claims).

## Separate compliance notes (not fixed here)

- DPA §3 lists subprocessor sharing as allowed, while §7 says no re-disclosure without
  prior written school consent. The two clauses may read as conflicting. Legal wording, needs Greg.
- DPA intro "in compliance with FERPA, COPPA" and Terms "comply with ... FERPA and
  COPPA". Softer: "designed to support schools' obligations under FERPA and COPPA".
- App OpenAI calls lack `store: false` (`api/ai.ts`, `api/calendar-scan.ts`), deferred 2026-10-06.
- No disclosed backup retention, no written incident-response procedure, no MFA.
- Google Analytics in the web app is commonly flagged in K-12 reviews.
- Desktop Gmail drafts may open in a teacher's personal account (now disclosed on the page).
- Privacy policy describes the iOS app but not the Android (TWA) app explicitly.

## Codex plan review (1 pass, gpt-6.2-sol, high)

19 findings, all accepted and folded in above. Main changes: Sentry, browser dictation,
and Gmail-compose data flow added; deletion scope, auto-tagging, Groq fallback scope,
72-hour scope, and "doesn't send messages" narrowed to match sources; domain list
relabeled as not a complete allowlist; review commitments limited to what the DPA
already promises; Finding 5 (DPA §3 vs §7) logged as a separate compliance note.
