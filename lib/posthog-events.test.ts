import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  BLOG_CTA_EXPERIMENT_POST,
  BLOG_EXAMPLE_POSTS,
  CUSTOM_EVENTS,
  EXPERIMENTS,
  blogExampleType,
  captureEvent,
  classifyLinkClick,
  experimentSeen,
  experimentVariant,
  filterCustomEvent,
  pdfResource,
  previewVariant,
} from './posthog-events.ts';
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

// The copied example is the one thing this event must never carry, and the
// post's title is a sentence, so neither can ride along.
test('a copied blog example keeps its kind and position, and nothing else', () => {
  const filtered = filterCustomEvent({
    event: 'blog_example_copied',
    properties: {
      example_type: 'email',
      example_number: '3',
      copy_method: 'text_selection',
      text: 'Hi [Parent/Guardian Name], I just wanted to share a quick highlight from today.',
      article_title: '5 Sample Emails to Parents About Student Behavior',
      $pathname: '/blog/sample-emails-to-parents-about-student-behavior',
    },
  });
  assert.deepEqual(filtered?.properties, {
    example_type: 'email',
    example_number: '3',
    copy_method: 'text_selection',
    $pathname: '/blog/sample-emails-to-parents-about-student-behavior',
  });

  const offTheList = filterCustomEvent({
    event: 'blog_example_copied',
    properties: { example_type: 'email', example_number: 'Dear families, welcome', copy_method: 'text_selection' },
  });
  assert.deepEqual(offTheList?.properties, { example_type: 'email', copy_method: 'text_selection' });
});

// A renamed or deleted post would otherwise stop being counted without any
// error to say so.
test('every blog post listed for example tracking exists', () => {
  for (const slug of Object.keys(BLOG_EXAMPLE_POSTS)) {
    assert.ok(fs.existsSync(`posts/${slug}.md`), `posts/${slug}.md is listed in BLOG_EXAMPLE_POSTS but does not exist`);
  }
});

test('a post that is not listed has no example type', () => {
  assert.equal(blogExampleType('sample-emails-to-parents-about-student-behavior'), 'email');
  assert.equal(blogExampleType('why-im-building-shorthand'), null);
  assert.equal(blogExampleType('constructor'), null);
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

// ---------------------------------------------------------------------------
// Experiments (feature flags) and blog_cta_paused
// ---------------------------------------------------------------------------

type Answer = (value: unknown) => void;

// A window that can hold the flag helpers and deliver the "PostHog is ready"
// event, which is all experimentVariant() needs from it.
function fakeWindow(extra: Record<string, unknown> = {}) {
  const listeners = new Set<() => void>();
  const fake: Record<string, unknown> & { ready: () => void } = {
    addEventListener: (_type: string, fn: () => void) => void listeners.add(fn),
    removeEventListener: (_type: string, fn: () => void) => void listeners.delete(fn),
    // Every listener here is registered with { once: true }.
    ready: () => {
      const waiting = [...listeners];
      listeners.clear();
      for (const fn of waiting) fn();
    },
    ...extra,
  };
  globalWithWindow.window = fake;
  return fake;
}

test('a pause on the call to action keeps its kind and variant, and nothing else', () => {
  const filtered = filterCustomEvent({
    event: 'blog_cta_paused',
    properties: {
      cta_type: 'workflow_bridge',
      variant: 'test',
      headline: 'Start with the record, then write the email',
      button_text: 'Draft from your notes',
      link_url: 'https://app.getshorthandapp.com?demo=true',
      seconds: '2',
      $pathname: '/blog/sample-emails-to-parents-about-student-behavior',
    },
  });
  assert.deepEqual(filtered?.properties, {
    cta_type: 'workflow_bridge',
    variant: 'test',
    $pathname: '/blog/sample-emails-to-parents-about-student-behavior',
  });

  const offTheList = filterCustomEvent({ event: 'blog_cta_paused', properties: { cta_type: 'Dear families', variant: 'banana' } });
  assert.deepEqual(offTheList?.properties, {});
});

test('a listed experiment stays on an event, and any other flag is removed from it', () => {
  const flagged = () => ({
    '$feature/blog-cta-presentation': 'test',
    '$feature/some-dashboard-flag': true,
    '$feature/constructor': 'x',
    $active_feature_flags: ['blog-cta-presentation', 'some-dashboard-flag', 'constructor'],
  });
  const kept = { '$feature/blog-cta-presentation': 'test', $active_feature_flags: ['blog-cta-presentation'] };

  // On PostHog's own events as well as on the site's.
  assert.deepEqual(filterCustomEvent({ event: '$pageview', properties: flagged() })?.properties, kept);
  assert.deepEqual(filterCustomEvent({ event: 'blog_cta_paused', properties: { ...flagged(), variant: 'test' } })?.properties, {
    ...kept,
    variant: 'test',
  });
});

test('taking part is recorded for a listed experiment only', () => {
  const called = (flag: unknown) =>
    filterCustomEvent({ event: '$feature_flag_called', properties: { $feature_flag: flag, $feature_flag_response: 'test' } });
  assert.deepEqual(called('blog-cta-presentation')?.properties, {
    $feature_flag: 'blog-cta-presentation',
    $feature_flag_response: 'test',
  });
  for (const flag of ['some-dashboard-flag', 'constructor', '', undefined, 7]) assert.equal(called(flag), null, String(flag));
  assert.equal(filterCustomEvent({ event: '$feature_flag_called' }), null);
});

test('every experiment key and variant is a short fixed word, and its post has the call to action', () => {
  for (const [key, variants] of Object.entries(EXPERIMENTS)) {
    assert.match(key, /^[a-z0-9-]{1,40}$/);
    for (const variant of variants) assert.match(variant, /^[a-z0-9_-]{1,40}$/);
  }
  // The call to action under test is placed by this marker.
  assert.match(fs.readFileSync(`posts/${BLOG_CTA_EXPERIMENT_POST}.md`, 'utf8'), /^WORKFLOWBRIDGEMARKER\r?$/m);
});

test('experimentVariant reports a listed variant, once', () => {
  let answer: Answer = () => {};
  const asked: string[] = [];
  fakeWindow({
    __shFlag: (key: string, onValue: Answer) => {
      asked.push(key);
      answer = onValue;
    },
  });
  const got: string[] = [];
  experimentVariant('blog-cta-presentation', (variant) => got.push(variant));

  assert.deepEqual(asked, ['blog-cta-presentation']);
  answer('test');
  answer('control');
  assert.deepEqual(got, ['test']);
});

test('a value that is not a listed variant means no answer, so the control stays', () => {
  for (const value of ['banana', true, false, undefined, null, 'constructor', 'Dear families']) {
    let answer: Answer = () => {};
    fakeWindow({ __shFlag: (_key: string, onValue: Answer) => void (answer = onValue) });
    const got: string[] = [];
    experimentVariant('blog-cta-presentation', (variant) => got.push(variant));
    answer(value);
    assert.deepEqual(got, [], String(value));
  }
});

// PostHog loads after the page hydrates, so the question is usually asked
// before there is anything to ask.
test('experimentVariant waits for PostHog, and never answers if it does not arrive', () => {
  const fake = fakeWindow();
  const got: string[] = [];
  experimentVariant('blog-cta-presentation', (variant) => got.push(variant));
  assert.deepEqual(got, []);

  fake.__shFlag = (_key: string, onValue: Answer) => onValue('control');
  fake.ready();
  assert.deepEqual(got, ['control']);
});

test('a withdrawn question is never answered', () => {
  let answer: Answer = () => {};
  const fake = fakeWindow();
  const got: string[] = [];
  const beforeReady = experimentVariant('blog-cta-presentation', (variant) => got.push(variant));
  beforeReady();
  fake.__shFlag = (_key: string, onValue: Answer) => void (answer = onValue);
  fake.ready();

  const afterAsking = experimentVariant('blog-cta-presentation', (variant) => got.push(variant));
  afterAsking();
  answer('test');
  assert.deepEqual(got, []);
});

test('experimentSeen names the experiment and nothing more', () => {
  const seen: unknown[][] = [];
  fakeWindow({ __shFlagSeen: (...args: unknown[]) => void seen.push(args) });
  experimentSeen('blog-cta-presentation');
  assert.deepEqual(seen, [['blog-cta-presentation']]);
});

test('the flag helpers are no-ops when PostHog is not running, and never throw', () => {
  const never = () => assert.fail('answered without PostHog');
  assert.doesNotThrow(() => experimentVariant('blog-cta-presentation', never)());
  assert.doesNotThrow(() => experimentSeen('blog-cta-presentation'));
  fakeWindow();
  assert.doesNotThrow(() => experimentSeen('blog-cta-presentation'));
  const blowUp = () => {
    throw new Error('PostHog blew up');
  };
  fakeWindow({ __shFlag: blowUp, __shFlagSeen: blowUp });
  assert.doesNotThrow(() => experimentVariant('blog-cta-presentation', never));
  assert.doesNotThrow(() => experimentSeen('blog-cta-presentation'));
});

// The preview switch must be dead on production, whatever the URL says.
test('?cta= picks a variant on a preview and is ignored on production', () => {
  for (const host of ['shorthand-website-git-some-branch.vercel.app', 'localhost']) {
    assert.equal(previewVariant(host, '?cta=variant'), 'test');
    assert.equal(previewVariant(host, '?utm_source=x&cta=control'), 'control');
    for (const search of ['', '?cta=', '?cta=test', '?cta=banana', '?other=variant']) {
      assert.equal(previewVariant(host, search), null, search);
    }
  }
  for (const search of ['?cta=variant', '?cta=control', '']) assert.equal(previewVariant('getshorthandapp.com', search), null, search);
});
