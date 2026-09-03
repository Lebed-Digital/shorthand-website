import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withAttribution } from './attribution.ts';

test('appends the current pathname as lp to an app link with no query string', () => {
  const result = withAttribution('https://app.getshorthandapp.com?demo=true', '/blog/best-classdojo-alternatives-2026', '');
  const url = new URL(result);
  assert.equal(url.searchParams.get('lp'), '/blog/best-classdojo-alternatives-2026');
  assert.equal(url.searchParams.get('demo'), 'true');
});

test('forwards utm_source/medium/campaign from the current page', () => {
  const result = withAttribution(
    'https://app.getshorthandapp.com',
    '/blog/best-classdojo-alternatives-2026',
    '?utm_source=instagram&utm_medium=organic_social&utm_campaign=guided_demo'
  );
  const url = new URL(result);
  assert.equal(url.searchParams.get('utm_source'), 'instagram');
  assert.equal(url.searchParams.get('utm_medium'), 'organic_social');
  assert.equal(url.searchParams.get('utm_campaign'), 'guided_demo');
  assert.equal(url.searchParams.get('lp'), '/blog/best-classdojo-alternatives-2026');
});

test('does not overwrite a UTM already present on the destination href', () => {
  const result = withAttribution(
    'https://app.getshorthandapp.com?demo=true&utm_source=tiktok&utm_medium=organic_social&utm_campaign=guided_demo',
    '/blog/some-other-post',
    '?utm_source=google&utm_medium=organic'
  );
  const url = new URL(result);
  assert.equal(url.searchParams.get('utm_source'), 'tiktok');
});

test('leaves non-app links untouched', () => {
  const href = 'https://example.com/whatever';
  assert.equal(withAttribution(href, '/blog/some-post', '?utm_source=google'), href);
});

test('does not crash on a malformed href', () => {
  assert.equal(withAttribution('not a url', '/blog/some-post', ''), 'not a url');
});
