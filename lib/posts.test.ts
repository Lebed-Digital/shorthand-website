import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addInlineCtaTracking } from './posts.ts';

test('adds data-cta attributes to a known slug\'s tracked link', () => {
  const html = '<p>Try the <a href="/back-to-school-toolkit">Welcome Letter Generator</a> now.</p>';
  const result = addInlineCtaTracking(html, 'welcome-letter-to-parents-from-teacher');
  assert.match(result, /data-cta-source="welcome-letter-to-parents-from-teacher"/);
  assert.match(result, /data-cta-destination="toolkit-inline-intro"/);
});

test('tracks two identical href+text links separately, in document order', () => {
  const html = '<p><a href="/back-to-school-toolkit">Welcome Letter Generator</a> ... <a href="/back-to-school-toolkit">Welcome Letter Generator</a></p>';
  const result = addInlineCtaTracking(html, 'welcome-letter-to-parents-from-teacher');
  const first = result.indexOf('toolkit-inline-intro');
  const second = result.indexOf('toolkit-inline-cta');
  assert.ok(first !== -1 && second !== -1);
  assert.ok(first < second);
});

test('leaves other slugs untouched', () => {
  const html = '<p><a href="/back-to-school-toolkit">Welcome Letter Generator</a></p>';
  const result = addInlineCtaTracking(html, 'some-unrelated-post');
  assert.equal(result, html);
});

test('leaves content untouched when the exact href+text pair is not present', () => {
  const html = '<p><a href="/back-to-school-toolkit">Get your letter</a></p>';
  const result = addInlineCtaTracking(html, 'welcome-letter-to-parents-from-teacher');
  assert.equal(result, html);
});
