import { test } from 'node:test';
import assert from 'node:assert/strict';
import { accepted, normalize, parseSitemap, rejectReason } from './indexnow.ts';

test('normalize keeps production URLs only', () => {
  assert.equal(normalize('/blog/x'), 'https://getshorthandapp.com/blog/x');
  assert.equal(normalize('https://getshorthandapp.com'), 'https://getshorthandapp.com/');
  assert.equal(normalize('https://shorthand-website-git-x.vercel.app/blog/x'), null);
  assert.equal(normalize('https://app.getshorthandapp.com/'), null);
  assert.equal(normalize('http://getshorthandapp.com/blog/x'), null);
  assert.equal(normalize('https://www.getshorthandapp.com/blog/x'), null);
  assert.equal(normalize('https://getshorthandapp.com/blog/x?utm=1'), null);
  assert.equal(normalize('http://localhost:3000/'), null);
});

test('parseSitemap reads <loc> entries and drops foreign hosts', () => {
  const xml = '<urlset><url><loc>https://getshorthandapp.com</loc></url>' +
    '<url><loc> https://getshorthandapp.com/blog/a </loc></url>' +
    '<url><loc>https://evil.example/x</loc></url>' +
    '<url><loc>https://getshorthandapp.com/blog/teacher&apos;s</loc></url></urlset>';
  assert.deepEqual([...parseSitemap(xml)], [
    'https://getshorthandapp.com/',
    'https://getshorthandapp.com/blog/a',
    normalize("/blog/teacher's"),
  ]);
});

test('rejectReason: live URLs need sitemap + exact 200', () => {
  const live = { deleted: false, inSitemapBefore: null };
  assert.equal(rejectReason({ ...live, status: 200, inSitemapNow: true }), null);
  assert.match(rejectReason({ ...live, status: 200, inSitemapNow: false })!, /sitemap/);
  assert.match(rejectReason({ ...live, status: 308, inSitemapNow: true })!, /308/);
});

test('rejectReason: deleted URLs must have been public and be gone now', () => {
  const del = { deleted: true, inSitemapNow: false };
  assert.equal(rejectReason({ ...del, status: 404, inSitemapBefore: true }), null);
  assert.equal(rejectReason({ ...del, status: 410, inSitemapBefore: true }), null);
  assert.equal(rejectReason({ ...del, status: 308, inSitemapBefore: true }), null);
  assert.match(rejectReason({ ...del, status: 404, inSitemapBefore: false })!, /never public/);
  assert.match(rejectReason({ ...del, status: 404, inSitemapBefore: null })!, /snapshot/);
  assert.match(rejectReason({ ...del, status: 200, inSitemapBefore: true })!, /200/);
  assert.match(rejectReason({ ...del, status: 404, inSitemapBefore: true, inSitemapNow: true })!, /still/);
});

test('accepted treats 200 and 202 as success', () => {
  assert.ok(accepted(200) && accepted(202));
  assert.ok(!accepted(403) && !accepted(422) && !accepted(429));
});
