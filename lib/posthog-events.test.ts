import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { CUSTOM_EVENTS, captureEvent, classifyLinkClick, filterCustomEvent, pdfResource } from './posthog-events.ts';
import { fireFreeCommentCopied, fireGenerationSuccess } from './gtag.ts';

const marketingLink = {
  hostname: 'getshorthandapp.com',
  pathname: '/blog',
  search: '',
  sameSite: true,
  inNav: false,
  inFooter: false,
  inBlogBody: false,
};
const appLink = { ...marketingLink, hostname: 'app.getshorthandapp.com', pathname: '/', search: '?demo=true', sameSite: false };

const globalWithWindow = globalThis as unknown as { window?: unknown };
afterEach(() => {
  delete globalWithWindow.window;
});

// Stands up a window whose tracker records what the helpers hand it.
function recordTracked(): [string, unknown][] {
  const tracked: [string, unknown][] = [];
  globalWithWindow.window = { __shTrack: (name: string, props: unknown) => tracked.push([name, props]) };
  return tracked;
}

test('a link to the app is an app_link_clicked, located by where it sits on the page', () => {
  assert.deepEqual(classifyLinkClick(appLink), {
    name: 'app_link_clicked',
    props: { destination: 'web_app', cta_location: 'page' },
  });
  const located = (where: Partial<typeof appLink>) => classifyLinkClick({ ...appLink, ...where })?.props;
  assert.deepEqual(located({ inNav: true }), { destination: 'web_app', cta_location: 'nav' });
  assert.deepEqual(located({ inFooter: true }), { destination: 'web_app', cta_location: 'footer' });
  assert.deepEqual(located({ inBlogBody: true }), { destination: 'web_app', cta_location: 'blog_body' });
});

test("only ShortHand's own Play Store listing counts as an app link", () => {
  const store = { ...appLink, hostname: 'play.google.com', pathname: '/store/apps/details' };
  assert.deepEqual(classifyLinkClick({ ...store, search: '?id=com.lebeddigital.shorthand' })?.props, {
    destination: 'play_store',
    cta_location: 'page',
  });
  assert.equal(classifyLinkClick({ ...store, search: '?id=com.classdojo.android' }), null);
});

test('a PDF on this site is a resource_downloaded with a stable key', () => {
  assert.deepEqual(classifyLinkClick({ ...marketingLink, pathname: '/parent-teacher-conference-notes.pdf' }), {
    name: 'resource_downloaded',
    props: { resource: 'conference-notes', resource_type: 'pdf' },
  });
  assert.equal(pdfResource('/Ready_to_Send_Behavior_Emails_x7k2.pdf'), 'behavior-emails');
});

test('a PDF that is not listed is counted as "other", never by its file name', () => {
  assert.equal(pdfResource('/some-new-printable.pdf'), 'other');
  assert.equal(pdfResource('constructor'), 'other');
});

test('ordinary links, and PDFs on other sites, are not events', () => {
  assert.equal(classifyLinkClick(marketingLink), null);
  assert.equal(classifyLinkClick({ ...marketingLink, hostname: 'example.com', pathname: '/x.pdf', sameSite: false }), null);
});

test("PostHog's own events pass through the filter untouched", () => {
  const pageview = { event: '$pageview', properties: { $current_url: 'https://getshorthandapp.com/', title: 'ShortHand' } };
  assert.deepEqual(filterCustomEvent(structuredClone(pageview)), pageview);
});

test('an event name that is not on the list is dropped', () => {
  for (const event of ['cta_click', 'note_copied', 'constructor', 'toString', '']) {
    assert.equal(filterCustomEvent({ event, properties: { tool: 'welcome-letter' } }), null, event);
  }
});

// The privacy guarantee. Whatever a call site passes, only listed property
// names holding listed values survive, alongside PostHog's own properties.
test('a listed event keeps only listed properties holding listed values', () => {
  const filtered = filterCustomEvent({
    event: 'tool_output_copied',
    properties: {
      tool: 'report-card-comment',
      text: 'Maya is a kind and curious student.',
      email: 'teacher@school.edu',
      link_url: 'https://app.getshorthandapp.com/?lp=/blog',
      constructor: 'x',
      // Listed on another event, but not on this one.
      action: 'generate',
      fbclid: 'abc',
      token: 'phc_test',
      distinct_id: 'anon-1',
      utm_source: 'social',
      $current_url: 'https://getshorthandapp.com/report-card-comment-generator',
    },
  });

  assert.deepEqual(filtered?.properties, {
    tool: 'report-card-comment',
    token: 'phc_test',
    distinct_id: 'anon-1',
    utm_source: 'social',
    $current_url: 'https://getshorthandapp.com/report-card-comment-generator',
  });
});

test('a listed property holding an unlisted value is removed', () => {
  const filtered = filterCustomEvent({
    event: 'free_tool_completed',
    properties: { tool: 'Zorblaxina', action: 'generate' },
  });
  assert.deepEqual(filtered?.properties, { action: 'generate' });
});

test('every listed value is a short fixed word, never a sentence or a URL', () => {
  for (const table of Object.values(CUSTOM_EVENTS)) {
    for (const values of Object.values(table)) {
      for (const value of values) assert.match(value, /^[a-z0-9_-]{1,40}$/);
    }
  }
});

test('captureEvent hands the tracker the event and nothing more', () => {
  const tracked = recordTracked();
  captureEvent('tool_output_copied', { tool: 'welcome-letter' });
  assert.deepEqual(tracked, [['tool_output_copied', { tool: 'welcome-letter' }]]);
});

test('captureEvent is a no-op when PostHog is not running, and never throws', () => {
  assert.doesNotThrow(() => captureEvent('tool_output_copied', { tool: 'welcome-letter' }));
  globalWithWindow.window = {};
  assert.doesNotThrow(() => captureEvent('tool_output_copied', { tool: 'welcome-letter' }));
  globalWithWindow.window = {
    __shTrack: () => {
      throw new Error('PostHog blew up');
    },
  };
  assert.doesNotThrow(() => captureEvent('tool_output_copied', { tool: 'welcome-letter' }));
});

// lib/gtag.ts mirrors two of its GA4 events to PostHog so the two tools count
// the same moments. Neither needs GA4 to be present: an ad blocker that
// removes gtag must not also silence PostHog.
test('a successful generation is mirrored to PostHog as free_tool_completed', () => {
  const tracked = recordTracked();
  fireGenerationSuccess('report-card-comment', 'refine');
  assert.deepEqual(tracked, [['free_tool_completed', { tool: 'report-card-comment', action: 'refine' }]]);
});

test('a copied library comment is mirrored as tool_output_copied, without its section', () => {
  const tracked = recordTracked();
  fireFreeCommentCopied('behavior');
  assert.deepEqual(tracked, [['tool_output_copied', { tool: 'comment-library' }]]);
});
