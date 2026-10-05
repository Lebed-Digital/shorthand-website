// Custom PostHog events on the public website. This file is the whole
// vocabulary: four event names and, for each one, the property names and the
// exact values each property may take. Nothing else can be sent.
//
// Two layers enforce that. captureEvent() is typed from the table below, so a
// call site cannot pass a free-form string. filterCustomEvent() then runs
// inside PostHog's before_send (see instrumentation-client.ts) and applies the
// same table at runtime, so an event or a property that is not listed here is
// removed even if a later call site gets around the types.
//
// Never add a property that carries what a visitor typed, copied or generated,
// the text of a link or button, an email address, or a URL. To add an event or
// a value: add it to CUSTOM_EVENTS, then update the privacy policy
// (app/privacy/page.tsx) and tests/manual/posthog-privacy-check.mjs, and run
// that check.
//
// No imports and no DOM access outside captureEvent(), so everything here runs
// under `node --test` (see posthog-events.test.ts).

declare global {
  interface Window {
    // Set by instrumentation-client.ts once PostHog has initialized. Absent on
    // previews, localhost, automated browsers and with the sh_dev flag, which
    // is what makes captureEvent() a no-op everywhere PostHog is not running.
    __shTrack?: (name: string, props: unknown) => void;
  }
}

export const CUSTOM_EVENTS = {
  // A click on any link to the app or to its store listing.
  app_link_clicked: {
    destination: ['web_app', 'play_store'],
    cta_location: ['nav', 'footer', 'blog_body', 'page'],
  },
  // A free PDF was downloaded. See PDF_RESOURCES for what 'other' means.
  resource_downloaded: {
    resource: [
      'behavior-emails',
      'behavior-documentation-log',
      'mtss-tier-2-tracking-sheet',
      'parent-contact-log',
      'conference-notes',
      'behavior-pattern-tracker',
      'other',
    ],
    resource_type: ['pdf'],
  },
  // A free tool produced its result: a generator returned text, or the
  // printable log was sent to the printer.
  free_tool_completed: {
    tool: ['report-card-comment', 'welcome-letter', 'parent-communication-log'],
    action: ['generate', 'refine', 'print'],
  },
  // The visitor pressed Copy on a tool's result. Never the copied text.
  tool_output_copied: {
    tool: ['report-card-comment', 'welcome-letter', 'comment-library'],
  },
} as const;

export type CustomEventName = keyof typeof CUSTOM_EVENTS;

export type CustomEventProps<N extends CustomEventName> = {
  -readonly [K in keyof (typeof CUSTOM_EVENTS)[N]]: (typeof CUSTOM_EVENTS)[N][K] extends readonly (infer V)[] ? V : never;
};

type Resource = CustomEventProps<'resource_downloaded'>['resource'];

export function captureEvent<N extends CustomEventName>(name: N, props: CustomEventProps<N>): void {
  if (typeof window === 'undefined') return;
  try {
    window.__shTrack?.(name, props);
  } catch {
    // Analytics must never break the page.
  }
}

// The free PDFs in /public, by path. `resource` is a stable key rather than the
// file name, so renaming a file does not split its history. A PDF that is not
// listed is still counted, as 'other': seeing 'other' in a report is the cue to
// add the new file here and to CUSTOM_EVENTS above.
const PDF_RESOURCES: Record<string, Resource> = {
  '/Ready_to_Send_Behavior_Emails_x7k2.pdf': 'behavior-emails',
  '/classroom-behavior-documentation-log.pdf': 'behavior-documentation-log',
  '/mtss-tier-2-intervention-tracking-sheet.pdf': 'mtss-tier-2-tracking-sheet',
  '/parent-contact-documentation-log.pdf': 'parent-contact-log',
  '/parent-teacher-conference-notes.pdf': 'conference-notes',
  '/student-behavior-pattern-tracker.pdf': 'behavior-pattern-tracker',
};

// Own-property check. A plain `table[key]` would also find inherited names
// such as "constructor", and Object.hasOwn is missing on older school iPads.
function own(table: object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(table, key);
}

export function pdfResource(pathname: string): Resource {
  return own(PDF_RESOURCES, pathname) ? PDF_RESOURCES[pathname] : 'other';
}

// What the click listener in instrumentation-client.ts reads off a clicked
// link. Deliberately only where the link points and where it sits on the
// page. Never the link's text.
export type LinkClick = {
  hostname: string;
  pathname: string;
  search: string;
  sameSite: boolean;
  inNav: boolean;
  inFooter: boolean;
  inBlogBody: boolean;
};

type ClassifiedClick = { [N in CustomEventName]: { name: N; props: CustomEventProps<N> } }[CustomEventName];

// Blog posts link to other apps' Play Store pages, so the store link only
// counts when it is ShortHand's own listing.
const PLAY_STORE_APP_ID = 'id=com.lebeddigital.shorthand';

export function classifyLinkClick(link: LinkClick): ClassifiedClick | null {
  const destination =
    link.hostname === 'app.getshorthandapp.com'
      ? 'web_app'
      : link.hostname === 'play.google.com' && link.search.includes(PLAY_STORE_APP_ID)
        ? 'play_store'
        : null;
  if (destination) {
    const cta_location = link.inNav ? 'nav' : link.inFooter ? 'footer' : link.inBlogBody ? 'blog_body' : 'page';
    return { name: 'app_link_clicked', props: { destination, cta_location } };
  }
  if (link.sameSite && link.pathname.toLowerCase().endsWith('.pdf')) {
    return { name: 'resource_downloaded', props: { resource: pdfResource(link.pathname), resource_type: 'pdf' } };
  }
  return null;
}

// Properties PostHog itself attaches without a "$" prefix that a custom event
// keeps. The utm list matches ALLOWED_QUERY_PARAMS in posthog-privacy.ts.
const SDK_PROPERTIES = new Set(['token', 'distinct_id', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']);

// Runs in before_send, on every event. PostHog's own events ("$pageview",
// "$pageleave", "$snapshot") pass through untouched. Any other event must be
// one of the four above or it is dropped, and on those four every property
// that is not PostHog's own must be a listed name holding a listed value or it
// is removed.
export function filterCustomEvent<T extends { event: string; properties?: Record<string, unknown> }>(event: T): T | null {
  if (event.event.startsWith('$')) return event;
  if (!own(CUSTOM_EVENTS, event.event)) return null;

  const allowed: Record<string, readonly string[]> = CUSTOM_EVENTS[event.event as CustomEventName];
  const props = event.properties ?? {};
  for (const key of Object.keys(props)) {
    if (key.startsWith('$') || SDK_PROPERTIES.has(key)) continue;
    if (!own(allowed, key) || !allowed[key].includes(props[key] as string)) delete props[key];
  }
  return event;
}
