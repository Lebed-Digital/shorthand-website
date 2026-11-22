// IndexNow submitter for getshorthandapp.com. Run by /ship after production is verified.
// Google does not use IndexNow; the Search Console indexing step stays as it is.
//
//   node scripts/indexnow.mjs snapshot <file>
//       Save the live production sitemap URLs. Run BEFORE merging, so deleted URLs can be
//       checked against what was public.
//   node scripts/indexnow.mjs submit [--dry-run] [--before <file>] <url...> [--deleted <url...>]
//       URLs can be full or site paths ("/blog/x"). Anything that fails a check is dropped
//       and listed. Exit 0 = accepted (200/202), no URLs given, or dry run.
//       Exit 1 = failed, or every URL was dropped.

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { SITE, KEY_FILE_RE, accepted, normalize, parseSitemap, rejectReason } from '../lib/indexnow.ts';

const ENDPOINT = 'https://api.indexnow.org/indexnow';
const CHECK_TIMEOUT_MS = 10_000;
const SUBMIT_TIMEOUT_MS = 20_000;

// Never follows redirects, so a 308 is seen as a 308. Network errors come back as status 0.
async function get(url, timeout = CHECK_TIMEOUT_MS) {
  try {
    const res = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(timeout) });
    return { status: res.status, text: await res.text() };
  } catch (err) {
    return { status: 0, text: '', error: err.message };
  }
}

async function liveSitemap() {
  const res = await get(`${SITE}/sitemap.xml`);
  if (res.status !== 200) throw new Error(`could not read ${SITE}/sitemap.xml (status ${res.status}${res.error ? `, ${res.error}` : ''})`);
  return parseSitemap(res.text);
}

function readKey() {
  const dir = fileURLToPath(new URL('../public/', import.meta.url));
  const files = readdirSync(dir).filter((f) => KEY_FILE_RE.test(f));
  if (files.length !== 1) throw new Error(`expected exactly one IndexNow key file in public/, found ${files.length}`);
  return files[0].slice(0, -4);
}

async function snapshot(file) {
  if (!file) throw new Error('usage: snapshot <file>');
  const urls = await liveSitemap();
  writeFileSync(file, [...urls].join('\n') + '\n');
  console.log(`IndexNow: saved ${urls.size} sitemap URLs to ${file}`);
}

async function submit(args) {
  const dryRun = args.includes('--dry-run');
  let before = null;
  const live = [];
  const deleted = [];
  let target = live;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--dry-run') continue;
    else if (a === '--before') {
      const file = args[++i];
      try {
        before = new Set(readFileSync(file, 'utf8').split('\n').map((s) => s.trim()).filter(Boolean));
      } catch {
        console.log(`IndexNow: warning, no pre-merge snapshot at ${file}, deleted URLs will be skipped`);
      }
    }
    else if (a === '--deleted') target = deleted;
    else target.push(a);
  }
  if (!live.length && !deleted.length) {
    console.log('IndexNow: no URLs given, nothing submitted');
    return 0;
  }

  const key = readKey();
  const keyLocation = `${SITE}/${key}.txt`;
  const keyRes = await get(keyLocation);
  if (keyRes.status !== 200 || keyRes.text.trim() !== key) {
    console.log(`IndexNow: ${dryRun ? 'warning' : 'FAILED'}, key file ${keyLocation} not live (status ${keyRes.status})`);
    if (!dryRun) return 1;
  }

  const now = await liveSitemap();
  const send = new Set();
  const dropped = [];
  const inputs = [...live.map((u) => [u, false]), ...deleted.map((u) => [u, true])];
  for (const [raw, isDeleted] of inputs) {
    const url = normalize(raw);
    if (!url) {
      dropped.push([raw, 'not a public https://getshorthandapp.com URL']);
      continue;
    }
    const { status, error } = await get(url);
    if (error) {
      dropped.push([url, `could not load: ${error}`]);
      continue;
    }
    const reason = rejectReason({
      deleted: isDeleted,
      status,
      inSitemapNow: now.has(url),
      inSitemapBefore: before ? before.has(url) : null,
    });
    if (reason) dropped.push([url, reason]);
    else send.add(url);
  }

  for (const [u, why] of dropped) console.log(`  dropped ${u}: ${why}`);
  if (!send.size) {
    console.log('IndexNow: SKIPPED, every URL was dropped (see above), nothing submitted');
    return 1;
  }
  const urlList = [...send];
  if (dryRun) {
    console.log(`IndexNow: dry run, would submit ${urlList.length} URL(s):\n  ${urlList.join('\n  ')}`);
    return 0;
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: new URL(SITE).host, key, keyLocation, urlList }),
      signal: AbortSignal.timeout(SUBMIT_TIMEOUT_MS),
    });
    const body = (await res.text()).slice(0, 300);
    if (accepted(res.status)) {
      console.log(`IndexNow: ${res.status} accepted, ${urlList.length} URL(s) submitted:\n  ${urlList.join('\n  ')}`);
      return 0;
    }
    console.log(`IndexNow: FAILED, ${res.status} ${res.statusText}${body ? `: ${body}` : ''}`);
  } catch (err) {
    console.log(`IndexNow: FAILED, ${err.message}`);
  }
  return 1;
}

const [cmd, ...rest] = process.argv.slice(2);
try {
  if (cmd === 'snapshot') await snapshot(rest[0]);
  else if (cmd === 'submit') process.exitCode = await submit(rest);
  else {
    console.log('usage: node scripts/indexnow.mjs snapshot <file> | submit [--dry-run] [--before <file>] <url...> [--deleted <url...>]');
    process.exitCode = 1;
  }
} catch (err) {
  console.log(`IndexNow: FAILED, ${err.message}`);
  process.exitCode = 1;
}
