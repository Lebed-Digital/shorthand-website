import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { addHeadingIds, addInlineCtaTracking, getAllPosts, getPost } from './posts.ts';

test('headings get the id a markdown jump link points at', () => {
  const html = [
    '<h2>When there are ongoing concerns (honest but constructive)</h2>',
    "<h2>The message that landed me in the principal's office</h2>",
    '<h3>Q&amp;A with <em>parents</em></h3>',
  ].join('');
  const result = addHeadingIds(html);
  assert.match(result, /<h2 id="when-there-are-ongoing-concerns-honest-but-constructive">/);
  assert.match(result, /<h2 id="the-message-that-landed-me-in-the-principals-office">/);
  assert.match(result, /<h3 id="qa-with-parents">Q&amp;A with <em>parents<\/em><\/h3>/);
});

test('a repeated heading gets a numbered id, and text between headings is untouched', () => {
  const html = '<h3>Example</h3><p>Not a heading.</p><h3>Example</h3>';
  assert.equal(addHeadingIds(html), '<h3 id="example">Example</h3><p>Not a heading.</p><h3 id="example-1">Example</h3>');
});

test('a heading that names its own id uses it and stops printing the marker', () => {
  assert.equal(
    addHeadingIds('<h2>Why Most Plans Fail by October {#why-plans-fail}</h2>'),
    '<h2 id="why-plans-fail">Why Most Plans Fail by October</h2>'
  );
});

// The check that would have caught it: 15 "Jump to a section" links were live
// on two posts with no heading id behind any of them.
test('every jump link in every post lands on a heading in that post', async () => {
  let checked = 0;
  for (const { slug } of getAllPosts()) {
    const anchors = [...fs.readFileSync(`posts/${slug}.md`, 'utf8').matchAll(/\]\(#([^)]+)\)/g)].map((m) => m[1]);
    if (anchors.length === 0) continue;
    const { contentHtml } = await getPost(slug);
    for (const anchor of anchors) {
      assert.ok(contentHtml.includes(` id="${anchor}"`), `${slug}: no heading for #${anchor}`);
      checked++;
    }
  }
  assert.ok(checked > 0, 'expected at least one jump link to check');
});

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
