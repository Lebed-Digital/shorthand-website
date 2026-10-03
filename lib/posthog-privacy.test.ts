import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  isSensitivePath,
  maskText,
  sanitizeEventUrls,
  sanitizeUrl,
  shouldInitPostHog,
} from './posthog-privacy.ts';

const production = {
  token: 'phc_test',
  hostname: 'getshorthandapp.com',
  pathname: '/',
  webdriver: false,
  devFlag: null,
};

test('initializes on the production hostname for a normal visitor', () => {
  assert.equal(shouldInitPostHog(production), true);
});

test('does not initialize without a project token', () => {
  assert.equal(shouldInitPostHog({ ...production, token: undefined }), false);
  assert.equal(shouldInitPostHog({ ...production, token: '' }), false);
});

test('does not initialize off the production hostname', () => {
  for (const hostname of ['localhost', 'www.getshorthandapp.com', 'app.getshorthandapp.com', 'shorthand-website-git-x.vercel.app']) {
    assert.equal(shouldInitPostHog({ ...production, hostname }), false, hostname);
  }
});

test('does not initialize on /auth/confirmed, in automated browsers, or with sh_dev', () => {
  assert.equal(shouldInitPostHog({ ...production, pathname: '/auth/confirmed' }), false);
  assert.equal(shouldInitPostHog({ ...production, webdriver: true }), false);
  assert.equal(shouldInitPostHog({ ...production, devFlag: '1' }), false);
});

test('tool pages, their subpages, and anything under /tools are sensitive', () => {
  for (const path of [
    '/report-card-comment-library',
    '/report-card-comment-library/success',
    '/report-card-comment-library/restore',
    '/report-card-comment-generator',
    '/report-card-comment-generator/',
    '/back-to-school-toolkit',
    '/tools',
    '/tools/parent-communication-log',
    '/tools/some-future-tool',
  ]) {
    assert.equal(isSensitivePath(path), true, path);
  }
});

test('marketing pages are not sensitive, including lookalike prefixes', () => {
  for (const path of ['/', '/blog', '/blog/report-card-comments-for-behavior', '/privacy', '/toolsmith', '/report-card-comment-generator-tips']) {
    assert.equal(isSensitivePath(path), false, path);
  }
});

test('maskText hides every visible character and keeps whitespace', () => {
  assert.equal(maskText('Maya is kind.\n  Next line'), '**** ** *****\n  **** ****');
  assert.equal(maskText('   '), '   ');
});

test('strips the Stripe session id from the purchase success URL', () => {
  assert.equal(
    sanitizeUrl('https://getshorthandapp.com/report-card-comment-library/success?session_id=cs_live_a1B2c3'),
    'https://getshorthandapp.com/report-card-comment-library/success',
  );
});

test('keeps utm parameters and drops everything else, including the fragment', () => {
  assert.equal(
    sanitizeUrl('https://getshorthandapp.com/blog/x?utm_source=social&token=abc&utm_campaign=welcome_letter&email=a@b.c#access_token=zzz'),
    'https://getshorthandapp.com/blog/x?utm_source=social&utm_campaign=welcome_letter',
  );
  assert.equal(sanitizeUrl('https://getshorthandapp.com/auth/confirmed#access_token=zzz'), 'https://getshorthandapp.com/auth/confirmed');
  assert.equal(sanitizeUrl('/report-card-comment-library?restored=1'), '/report-card-comment-library');
});

test('leaves a URL with no query or fragment untouched', () => {
  assert.equal(sanitizeUrl('https://getshorthandapp.com/blog'), 'https://getshorthandapp.com/blog');
});

test('sanitizes every URL-shaped value on an event, not just $current_url', () => {
  const secret = 'cs_live_a1B2c3';
  const successUrl = `https://getshorthandapp.com/report-card-comment-library/success?session_id=${secret}`;
  const event = sanitizeEventUrls({
    event: '$pageview',
    properties: {
      $current_url: 'https://getshorthandapp.com/report-card-comment-library',
      // The success page does a full page load into the library, so this is
      // where the session id would actually leak.
      $referrer: successUrl,
      $session_entry_url: successUrl,
      $pathname: '/report-card-comment-library',
      title: 'What is PBIS? A plain guide | ShortHand',
      $viewport_width: 390,
    },
    $set: { $current_url: successUrl },
    $set_once: { $initial_current_url: successUrl, $initial_referrer: successUrl },
  });

  assert.equal(JSON.stringify(event).includes(secret), false);
  assert.equal(JSON.stringify(event).includes('session_id'), false);
  // Non-URL values that merely contain a "?" are not touched.
  assert.equal(event.properties.title, 'What is PBIS? A plain guide | ShortHand');
  assert.equal(event.properties.$viewport_width, 390);
});

test('tolerates an event with no property bags', () => {
  const bare: { event: string; properties?: Record<string, unknown> } = { event: '$snapshot' };
  assert.deepEqual(sanitizeEventUrls(bare), { event: '$snapshot' });
});
