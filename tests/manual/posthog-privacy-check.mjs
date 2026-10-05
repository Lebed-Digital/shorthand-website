// Manual end-to-end privacy check for PostHog (instrumentation-client.ts).
//
// Run this after changing instrumentation-client.ts or lib/posthog-privacy.ts,
// after adding a page where a visitor can type personal information, and after
// upgrading posthog-js. It is NOT part of `npm run test:e2e` (the file name has
// no .spec/.test), because it needs its own build and its own server.
//
//   NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=phc_localtest npm run build
//   npx next start -p 3111            (leave running, in a second terminal)
//   node tests/manual/posthog-privacy-check.mjs
//
// What it does:
// - Opens the local build as http://getshorthandapp.com:3111 (a Chromium
//   host-resolver rule), so the production-hostname gate passes locally.
// - Intercepts EVERY PostHog request. The project settings PostHog would send
//   are faked with a deliberately hostile "dashboard" (console logs, network
//   bodies, heatmaps, surveys, tours, unmasked inputs: all switched on), to
//   prove the settings in code win. Uploads are captured here and never sent.
//   The ingestion host is also mapped to 127.0.0.1, so a missed request cannot
//   leave the machine. Only PostHog's public SDK script files are fetched.
// - Blocks GA4, Supabase and every /api route, so nothing touches production.
//   The two generator routes, the email-capture insert, the app and the Play
//   Store are answered here with stand-ins, so the tools can be used for real
//   (generate, copy, print, download, follow a link to the app) with nothing
//   leaving the machine.
// - Types made-up "canary" names into each tool, then searches everything
//   PostHog would have received for them. The generated text and the copied
//   text are canaries too. A blog post's email template is copied as well: it
//   is public text, so the check there is that it rides on no event.
// - Checks the custom events (lib/posthog-events.ts): exactly the expected
//   events arrive, each carrying only its listed properties, and an event or
//   a property that is not on the list never leaves the browser.
//
// Why a real browser and not a unit test: every problem this caught was in how
// the SDK behaves, not in our own logic. Examples: the dashboard can switch on
// the Logs product and the network recorder over a local `false`, and the
// recorder stores `#anchor` links as full URLs including the query string.
import { chromium } from '@playwright/test';
import zlib from 'node:zlib';

const PORT = 3111;
const ORIGIN = `http://getshorthandapp.com:${PORT}`;
const TOKEN = 'phc_localtest'; // must match the token used for the build
// The app and the Play Store are stubbed below. Mapping them here as well means
// a request that misses the stub fails instead of reaching the real thing.
const RESOLVER =
  '--host-resolver-rules=MAP getshorthandapp.com 127.0.0.1, MAP us.i.posthog.com 127.0.0.1, MAP app.getshorthandapp.com 127.0.0.1, MAP play.google.com 127.0.0.1';
// posthog-js discards everything from a "HeadlessChrome" user agent as a bot,
// so without an ordinary user agent every check below would pass vacuously.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const CANARY = {
  libraryName: 'Zorblaxina',
  generatorName: 'Quenthaviel',
  generatorExtra: 'CANARYEXTRA loves soccer',
  letterTeacher: 'MxCanaryteach',
  logStudent: 'Plimsollworth',
  logNote: 'CANARYNOTE called home',
  email: 'canary.email@example.com',
  session: 'cs_test_CANARYSESSION123',
  fbclid: 'CANARYFBCLID',
  consoleMsg: 'CANARYCONSOLE',
  urlSecret: 'CANARYURLSECRET',
  generatedComment: 'CANARYCOMMENT shows steady growth',
  generatedLetter: 'CANARYLETTER welcome to our class',
  gateEmail: 'canary.gate@example.com',
  hostileProp: 'CANARYHOSTILEPROP',
};

const hostileRemoteConfig = {
  supportedCompression: [],
  autocapture_opt_out: false,
  capturePerformance: { network_timing: true, web_vitals: true },
  analytics: { endpoint: '/i/v0/e/' },
  elementsChainAsString: true,
  errorTracking: { autocaptureExceptions: true },
  logs: { captureConsoleLogs: true },
  autocaptureExceptions: true,
  sessionRecording: {
    endpoint: '/s/',
    consoleLogRecordingEnabled: true,
    sampleRate: null,
    minimumDurationMilliseconds: 0,
    linkedFlag: null,
    networkPayloadCapture: { recordBody: true, recordHeaders: true },
    masking: { maskAllInputs: false, maskTextSelector: null },
    urlTriggers: [],
    urlBlocklist: [],
    eventTriggers: [],
  },
  surveys: true,
  productTours: true,
  heatmaps: true,
  captureDeadClicks: true,
  defaultIdentifiedOnly: true,
  hasFeatureFlags: true,
  conversations: true,
  toolbarParams: {},
  isAuthenticated: false,
  siteApps: [],
  toolbarVersion: 'toolbar',
};

function decodeBody(buf) {
  if (!buf || buf.length === 0) return null;
  let b = buf;
  if (b.length > 2 && b[0] === 0x1f && b[1] === 0x8b) b = zlib.gunzipSync(b);
  let s = b.toString('utf8');
  if (s.startsWith('data=')) s = Buffer.from(decodeURIComponent(s.slice(5).split('&')[0]), 'base64').toString('utf8');
  try {
    return JSON.parse(s);
  } catch {
    return { __undecoded: s.slice(0, 200) };
  }
}

// posthog-js gzips large replay payloads into latin1 strings inside the JSON.
function inflateDeep(v) {
  if (typeof v === 'string') {
    if (v.length > 2 && v.charCodeAt(0) === 0x1f && v.charCodeAt(1) === 0x8b) {
      try {
        return inflateDeep(JSON.parse(zlib.gunzipSync(Buffer.from(v, 'latin1')).toString('utf8')));
      } catch {
        return v;
      }
    }
    return v;
  }
  if (Array.isArray(v)) return v.map(inflateDeep);
  if (v && typeof v === 'object') {
    const o = {};
    for (const k of Object.keys(v)) o[k] = inflateDeep(v[k]);
    return o;
  }
  return v;
}

async function newSession(browser, { initScript } = {}) {
  const context = await browser.newContext({ userAgent: UA });
  const rec = { phRequests: [], uploads: [], scripts: [] };
  if (initScript) await context.addInitScript(initScript);

  await context.route(/googletagmanager\.com|google-analytics\.com|doubleclick\.net/, (r) => r.abort());
  await context.route(/supabase\.co/, (r) => r.abort());
  // Lets the purchase success page run its real redirect into the library.
  await context.route('**/api/report-card-checkout/verify-session', (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ granted: true }) }),
  );
  await context.route(/\/api\/(?!report-card-checkout\/verify-session)/, (r) => {
    if (/posthog\.com/.test(r.request().url())) return r.fallback();
    return r.abort();
  });

  // Stand-ins, registered after the blocks above so they win. They let the
  // tools reach a real result without OpenAI, Supabase or the app being called.
  const json = (body) => ({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
  await context.route('**/api/free-tool', (r) => r.fulfill(json({ comment: CANARY.generatedComment })));
  await context.route('**/api/welcome-letter', (r) => r.fulfill(json({ letter: CANARY.generatedLetter })));
  await context.route(/supabase\.co\/rest\/v1\/email_leads/, (r) =>
    r.fulfill({ status: 201, headers: { 'access-control-allow-origin': '*' }, body: '' }),
  );
  await context.route(/^https?:\/\/(app\.getshorthandapp\.com|play\.google\.com)\//, (r) =>
    r.fulfill({ status: 200, contentType: 'text/html', body: '<title>stand-in</title>stand-in' }),
  );

  await context.route(/posthog\.com/, async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    rec.phRequests.push(`${req.method()} ${url.hostname}${url.pathname}`);

    if (/\/array\/[^/]+\/config\.js$/.test(url.pathname)) {
      const js = `window._POSTHOG_REMOTE_CONFIG=window._POSTHOG_REMOTE_CONFIG||{};window._POSTHOG_REMOTE_CONFIG[${JSON.stringify(TOKEN)}]={config:${JSON.stringify(hostileRemoteConfig)},siteApps:[]};`;
      return route.fulfill({ status: 200, contentType: 'application/javascript', body: js });
    }
    if (/\/array\/[^/]+\/config$/.test(url.pathname)) {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(hostileRemoteConfig) });
    }
    if (url.pathname.startsWith('/static/')) {
      rec.scripts.push(url.pathname.replace(/^\/static\/[\d.]+\//, ''));
      return route.continue(); // PostHog's public SDK script files only
    }
    if (url.pathname.startsWith('/flags') || url.pathname.startsWith('/decide')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ...hostileRemoteConfig, featureFlags: {}, featureFlagPayloads: {} }),
      });
    }
    // Everything else is an upload (events, replay, logs). Capture, never forward.
    rec.uploads.push({ path: url.pathname, body: inflateDeep(decodeBody(req.postDataBuffer())) });
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 1 }) });
  });

  return { context, rec };
}

function eventsOf(rec) {
  const out = [];
  for (const u of rec.uploads) {
    const b = u.body;
    const list = Array.isArray(b) ? b : b && Array.isArray(b.batch) ? b.batch : b ? [b] : [];
    for (const e of list) if (e && typeof e.event === 'string') out.push(e);
  }
  return out;
}

// Every piece of TEXT the replay recorded: text nodes in snapshots and mutations.
function replayTexts(rrwebEvents) {
  const texts = [];
  (function walk(v, key) {
    if (typeof v === 'string') {
      if (key === 'textContent' || key === 'value') texts.push(v);
      return;
    }
    if (Array.isArray(v)) {
      for (const x of v) walk(x, key);
      return;
    }
    if (v && typeof v === 'object') for (const k of Object.keys(v)) walk(v[k], k);
  })(rrwebEvents, '');
  return texts;
}

// Visible text on the current page: text nodes of 14+ characters outside script/style.
const pageTexts = (page) =>
  page.evaluate(() => {
    const out = new Set();
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) {
      const n = w.currentNode;
      const tag = n.parentElement && n.parentElement.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') continue;
      const t = n.nodeValue.trim();
      if (t.length >= 14) out.add(t);
    }
    return [...out];
  });

const results = [];
function check(name, pass, detail) {
  results.push({ name, pass });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? `  [${detail}]` : ''}`);
}

const browser = await chromium.launch({ args: [RESOLVER, '--disable-blink-features=AutomationControlled'] });

// ---------- 1. A "real visitor" on the production hostname ----------
// The test origin is plain http, where browsers do not offer the clipboard, and
// a print dialog would hang the run. Both are replaced, and the clipboard
// stand-in keeps what was "copied" so the test can show it held a canary.
const { context, rec } = await newSession(browser, {
  initScript: () => {
    window.__copied = [];
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async (text) => void window.__copied.push(text) },
    });
    window.print = () => {};
  },
});
const page = await context.newPage();
const copiedText = () => page.evaluate(() => window.__copied.join('\n'));
const copied = {}; // tool -> [text that reached the clipboard, canary it should hold]
const rest = (ms = 8000) => page.waitForTimeout(ms); // long enough for replay to flush before leaving a page
const sensitive = {}; // page label -> visible texts
let marketing = [];

await page.goto(`${ORIGIN}/?utm_source=test_src&fbclid=${CANARY.fbclid}`, { waitUntil: 'load' });
check(
  'test browser looks like a real visitor (webdriver false, normal user agent)',
  (await page.evaluate(() => navigator.webdriver)) === false && !(await page.evaluate(() => navigator.userAgent)).includes('Headless'),
);
await page.waitForTimeout(3000);
marketing = marketing.concat(await pageTexts(page));
const emailInput = page.locator('input[type="email"]').first();
const hadEmail = (await emailInput.count()) > 0;
if (hadEmail) await emailInput.fill(CANARY.email);
await page.evaluate(
  ([m, s]) => {
    console.log(m);
    return fetch(`/robots.txt?secret=${s}`).then((r) => r.text()).catch(() => {});
  },
  [CANARY.consoleMsg, CANARY.urlSecret],
);
await rest();

// Client-side navigation INTO tool pages: tests masking of text added by a route change.
await page.locator('a[href="/tools"]').first().click();
await page.waitForURL('**/tools');
await page.waitForTimeout(2500);
sensitive['tools index (client-side navigation, no ph-mask class)'] = await pageTexts(page);
await page.locator('a[href="/tools/parent-communication-log"]').first().click();
await page.waitForURL('**/tools/parent-communication-log');
await page.waitForTimeout(2500);
await page.locator('input[placeholder="Student name"]').first().fill(CANARY.logStudent);
await page.locator('textarea').first().fill(CANARY.logNote);
sensitive['parent communication log (client-side navigation)'] = await pageTexts(page);
await page.getByRole('button', { name: 'Print / Save as PDF' }).click();
await rest();

await page.goto(`${ORIGIN}/report-card-comment-generator`, { waitUntil: 'load' });
await page.waitForTimeout(2500);
await page.locator('input[placeholder="e.g. Alex"]').first().fill(CANARY.generatorName);
await page.locator('textarea').first().fill(CANARY.generatorExtra);
sensitive['comment generator'] = await pageTexts(page);
await page.getByRole('button', { name: 'Math', exact: true }).first().click();
await page.getByRole('button', { name: 'Generate comment' }).click();
await page.getByLabel('Generated comment').waitFor();
await page.getByRole('button', { name: 'Copy', exact: true }).click();
copied['comment generator'] = [await copiedText(), CANARY.generatedComment];
await rest();

await page.goto(`${ORIGIN}/back-to-school-toolkit`, { waitUntil: 'load' });
await page.waitForTimeout(2500);
await page.locator('input[placeholder="e.g. Ms. Johnson"]').first().fill(CANARY.letterTeacher);
sensitive['back-to-school toolkit'] = await pageTexts(page);
await page.locator('select').first().selectOption('3rd Grade');
await page.getByRole('button', { name: 'Generate letter' }).click();
await page.getByRole('button', { name: 'Copy', exact: true }).waitFor();
await page.getByRole('button', { name: 'Copy', exact: true }).click();
copied['welcome letter'] = [await copiedText(), CANARY.generatedLetter];
await rest();

// Comment library: the typed name is substituted into rendered comment TEXT.
await page.goto(`${ORIGIN}/report-card-comment-library`, { waitUntil: 'load' });
await page.waitForTimeout(2500);
await page.locator('input[placeholder^="e.g. Alex"]').first().fill(CANARY.libraryName);
await page.waitForTimeout(1500);
const libTexts = await pageTexts(page);
const nameNodes = libTexts.filter((t) => t.includes(CANARY.libraryName)).length;
check('library: the typed name really is rendered as plain page text (the leak vector exists)', nameNodes > 0, `${nameNodes} distinct text nodes`);
sensitive['comment library'] = libTexts;
await page.getByRole('button', { name: 'Copy', exact: true }).first().click();
copied['comment library'] = [await copiedText(), CANARY.libraryName];
await rest();

// Purchase success page, then the site's own full-page redirect into the library.
await page.goto(`${ORIGIN}/report-card-comment-library/success?session_id=${CANARY.session}`, { waitUntil: 'load' });
await page.waitForURL(/\/report-card-comment-library$/, { timeout: 15000 }).catch(() => {});
const referrerSeen = await page.evaluate(() => document.referrer);
check(
  'success page redirected into the library with the session id in document.referrer (the leak vector exists)',
  /report-card-comment-library$/.test(page.url()) && referrerSeen.includes(CANARY.session),
);
await rest();

// A plain PDF link, on a URL carrying a secret the event must not pick up.
await page.goto(`${ORIGIN}/resources?token=${CANARY.urlSecret}`, { waitUntil: 'load' });
await page.waitForTimeout(2500);
// A marketing page: its text is readable in the replay by design, and some of
// it ("No sign-up required") is repeated on the tool pages.
marketing = marketing.concat(await pageTexts(page));
const download = page.waitForEvent('download');
await page.locator('a[download]').first().click();
await (await download).cancel().catch(() => {});
await rest();

// The email-gated PDF, then the nav link to the app from the same post. The
// second click really leaves the page, so it also shows the event survives.
await page.goto(`${ORIGIN}/blog/sample-emails-to-parents-about-student-behavior`, { waitUntil: 'load' });
await page.waitForTimeout(2500);
marketing = marketing.concat(await pageTexts(page));
// Copy from the post the way a visitor does: select, then Ctrl+C. A paragraph
// of prose first, which must send nothing, then the first email template.
const selectAndCopy = async (selector) => {
  const selected = await page.locator(selector).first().evaluate((el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    return selection.toString();
  });
  await page.keyboard.press('Control+C');
  await page.waitForTimeout(500);
  return selected.replace(/\s+/g, ' ').trim();
};
await selectAndCopy('.blog-content p');
const copiedExample = await selectAndCopy('.blog-content blockquote');
await page.locator('.blog-content input[type="email"]').first().fill(CANARY.gateEmail);
const pdfTab = context.waitForEvent('page', { timeout: 15000 }).catch(() => null);
await page.getByRole('button', { name: 'Get the free PDF' }).click();
const gateOpened = await pdfTab;
check('email gate: the stand-in accepted the address and the PDF opened (the event path ran)', gateOpened !== null);
if (gateOpened) await gateOpened.close().catch(() => {});
await rest();
await page.locator('nav a[href^="https://app.getshorthandapp.com"]').first().click();
await page.waitForURL(/app\.getshorthandapp\.com/, { timeout: 15000 }).catch(() => {});
check('app link: the click really left the site for the app stand-in', /app\.getshorthandapp\.com/.test(page.url()), page.url());
await page.waitForTimeout(3000);

// The Play Store badge, which navigates from its own click handler.
await page.goto(`${ORIGIN}/`, { waitUntil: 'load' });
await page.waitForTimeout(3000);
await page.locator('a[href*="play.google.com"]').first().click();
await page.waitForURL(/play\.google\.com/, { timeout: 15000 }).catch(() => {});
check('Play Store badge: the click really left the site for the store stand-in', /play\.google\.com/.test(page.url()), page.url());
await page.waitForTimeout(3000);

await page.goto(`${ORIGIN}/privacy?token=${CANARY.urlSecret}&utm_medium=test_med#frag`, { waitUntil: 'load' });
await page.waitForTimeout(2500);
marketing = marketing.concat(await pageTexts(page));
// What a careless or hostile call site could do: an event that is not on the
// list, a listed event with extra properties, and a listed property holding
// free text. The first must never arrive; the other two must arrive stripped.
const trackerPresent = await page.evaluate((secret) => {
  if (typeof window.__shTrack !== 'function') return false;
  window.__shTrack('made_up_event', { note: secret });
  window.__shTrack('tool_output_copied', { tool: 'welcome-letter', text: secret, email: secret });
  window.__shTrack('free_tool_completed', { tool: secret, action: 'refine' });
  return true;
}, CANARY.hostileProp);
check('the tracker is present where PostHog is running (the hostile calls were really made)', trackerPresent);
await rest();
// A real page unload sends its final batch by beacon after the test can see it,
// so fire the same event by hand while the page is still alive.
await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
await page.waitForTimeout(3000);
await context.close();

// ---------- analysis ----------
const events = eventsOf(rec);
const names = [...new Set(events.map((e) => e.event))].sort();
const all = JSON.stringify(rec.uploads);
const rrweb = events.filter((e) => e.event === '$snapshot').flatMap((e) => e.properties.$snapshot_data || []);
const snapText = JSON.stringify(rrweb);
const nonSnap = events.filter((e) => e.event !== '$snapshot');
const texts = replayTexts(rrweb);
const textSet = new Set(texts.map((t) => t.trim()));
const uploadPaths = {};
for (const u of rec.uploads) uploadPaths[u.path] = (uploadPaths[u.path] || 0) + 1;
const fullSnapshots = rrweb.filter((r) => r.type === 2).length;

console.log('\n--- captured locally (never sent) ---');
console.log('uploads by endpoint:', JSON.stringify(uploadPaths));
console.log('events:', events.length, '| names:', names.join(', '));
console.log('replay events:', rrweb.length, '| full snapshots:', fullSnapshots, '| recorded text strings:', texts.length, '| decoded bytes:', all.length);
console.log('SDK scripts loaded:', [...new Set(rec.scripts)].join(', ') || '(none)');
console.log('undecoded uploads:', rec.uploads.filter((u) => u.body && u.body.__undecoded).length, '\n');

check('recording really ran: several full snapshots captured', fullSnapshots >= 5, `${fullSnapshots} full snapshots, ${snapText.length} bytes`);
const marketingSeen = [...new Set(marketing)].filter((t) => textSet.has(t)).length;
check('positive control: marketing page text IS readable in the replay', marketingSeen >= 10, `${marketingSeen} of ${new Set(marketing).size} marketing strings found`);

for (const [k, v] of Object.entries(CANARY)) {
  const n = all.split(v).length - 1;
  check(`canary "${k}" appears nowhere in what PostHog would receive`, n === 0, `${n} occurrences`);
}
if (!hadEmail) console.log('INFO  no email input on the home page; email canary not exercised');

const marketingSet = new Set(marketing);
for (const [label, list] of Object.entries(sensitive)) {
  const unique = list.filter((t) => !marketingSet.has(t));
  const leaked = unique.filter((t) => textSet.has(t));
  check(
    `all text masked on: ${label}`,
    unique.length > 0 && leaked.length === 0,
    `${unique.length} page strings checked, ${leaked.length} readable${leaked.length ? ': ' + JSON.stringify(leaked.slice(0, 2)) : ''}`,
  );
}

check('no "session_id=" anywhere in any upload', !all.includes('session_id='));
const urls = [];
for (const e of nonSnap) {
  for (const bag of [e.properties, e.$set, e.$set_once]) {
    if (!bag) continue;
    for (const [k, v] of Object.entries(bag)) if (typeof v === 'string' && /^(https?:\/\/|\/)/.test(v)) urls.push(`${k}=${v}`);
  }
}
const utmOnly = /\?utm_[a-z]+=[^&#]*(&utm_[a-z]+=[^&#]*)*$/;
const badUrls = urls.filter((u) => /[?#]/.test(u.slice(u.indexOf('=') + 1)) && !utmOnly.test(u));
check('every URL-valued event property has only utm params (no other query, no fragment)', badUrls.length === 0, badUrls.slice(0, 3).join(' ; ') || `${urls.length} URL values checked`);
check('utm_source survives sanitization', urls.some((u) => u.includes('utm_source=test_src')));
const pageUrls = rrweb.filter((r) => r.type === 4).map((r) => r.data.href);
check('replay page URLs carry no query other than utm and no fragment', pageUrls.length > 0 && pageUrls.every((h) => !/[?#]/.test(h) || utmOnly.test(h)), `${pageUrls.length} page URLs`);
const hrefs = [...new Set(snapText.match(/"href":"http:\/\/getshorthandapp\.com[^"]*"/g) || [])];
check('no link recorded in the replay carries the session id, fbclid or a fragment', hrefs.every((h) => !/session_id|fbclid|#/.test(h)), `${hrefs.length} distinct links`);

// ---------- custom events (lib/posthog-events.ts) ----------
// Written out by hand rather than imported from the app, so a mistake in the
// app's own list cannot make this check agree with it.
const CUSTOM = ['app_link_clicked', 'resource_downloaded', 'free_tool_completed', 'tool_output_copied', 'blog_example_copied'];
const allowed = new Set(['$pageview', '$pageleave', '$snapshot', ...CUSTOM]);
const extra = names.filter((n) => !allowed.has(n));
check('only $pageview / $pageleave / $snapshot and the five custom events are sent', names.length > 0 && extra.length === 0, extra.join(', ') || names.join(', '));

// PostHog's own properties: "$"-prefixed, plus these. Whatever is left on a
// custom event is what the site itself chose to send.
const SDK_KEYS = new Set(['token', 'distinct_id', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']);
const customEvents = nonSnap.filter((e) => CUSTOM.includes(e.event));
const own = (e) => Object.fromEntries(Object.entries(e.properties).filter(([k]) => !k.startsWith('$') && !SDK_KEYS.has(k)).sort());
const sent = customEvents.map((e) => `${e.event} ${JSON.stringify(own(e))}`).sort();
const expected = [
  'app_link_clicked {"cta_location":"nav","destination":"web_app"}',
  'app_link_clicked {"cta_location":"page","destination":"play_store"}',
  // Once, for the template. The prose copied just before it sent nothing.
  'blog_example_copied {"copy_method":"text_selection","example_number":"1","example_type":"email"}',
  'free_tool_completed {"action":"generate","tool":"report-card-comment"}',
  'free_tool_completed {"action":"generate","tool":"welcome-letter"}',
  'free_tool_completed {"action":"print","tool":"parent-communication-log"}',
  // The hostile call: its free-text "tool" was removed, the event still counted.
  'free_tool_completed {"action":"refine"}',
  'resource_downloaded {"resource":"behavior-emails","resource_type":"pdf"}',
  'resource_downloaded {"resource":"mtss-tier-2-tracking-sheet","resource_type":"pdf"}',
  'tool_output_copied {"tool":"comment-library"}',
  'tool_output_copied {"tool":"report-card-comment"}',
  // Sent twice: once by the real Copy button, once by the hostile call with
  // its "text" and "email" properties removed.
  'tool_output_copied {"tool":"welcome-letter"}',
  'tool_output_copied {"tool":"welcome-letter"}',
].sort();
console.log('INFO  custom events sent:\n  ' + (sent.join('\n  ') || '(none)'));
check(
  'custom events: exactly the expected events, each with exactly its listed properties',
  JSON.stringify(sent) === JSON.stringify(expected),
  `${sent.length} sent, ${expected.length} expected`,
);
for (const name of CUSTOM) check(`custom event fired: ${name}`, customEvents.some((e) => e.event === name));
// The post is a public page, so its text is readable in the replay by design.
// What must not happen is the copied template riding along on an event.
const copiedProbe = copiedExample.slice(0, 40);
check('blog example: the selection really held the template text (the leak vector exists)', copiedProbe.length === 40, copiedProbe);
check('blog example: the copied text is on no event', !JSON.stringify(nonSnap).includes(copiedProbe));
for (const [tool, [text, canary]] of Object.entries(copied)) {
  check(`${tool}: the copied text really held a canary (the leak vector exists)`, text.includes(canary));
}
check('an event name that is not on the list never leaves the browser', !names.includes('made_up_event'));
const unprefixed = [...new Set(customEvents.flatMap((e) => Object.keys(e.properties).filter((k) => !k.startsWith('$'))))].sort();
console.log('INFO  non-$ property names on custom events:', unprefixed.join(', '));
check('no page or link text on any event (no $elements / $el_text)', !nonSnap.some((e) => Object.keys(e.properties).some((k) => /^\$el/.test(k))));
check('no autocapture events', !names.some((n) => /autocapture|rageclick|dead_click/.test(n)));
check(
  'custom events are anonymous (person processing off)',
  customEvents.length > 0 && customEvents.every((e) => e.properties.$process_person_profile === false),
  `${customEvents.length} custom events`,
);
check(
  'custom events carry the page they happened on, with no query other than utm',
  customEvents.length > 0 &&
    customEvents.every((e) => {
      const url = e.properties.$current_url;
      return typeof e.properties.$pathname === 'string' && typeof url === 'string' && (!/[?#]/.test(url) || utmOnly.test(url));
    }),
  [...new Set(customEvents.map((e) => e.properties.$pathname))].join(', '),
);
check('pageleave events are captured (web analytics)', names.includes('$pageleave'));
check('no logs upload (console capture) despite the dashboard switching it on', !Object.keys(uploadPaths).some((p) => /logs/.test(p)), Object.keys(uploadPaths).join(', '));
const consoleEntries = rrweb.filter((r) => r.type === 6 && /console/.test(r.data.plugin || '')).map((r) => JSON.stringify(r.data.payload.payload));
const pageConsole = consoleEntries.filter((p) => !p.includes('[SessionRecording]'));
check('no page console output in the replay (only the recorder own diagnostics, if any)', pageConsole.length === 0, `${consoleEntries.length} recorder diagnostics, ${pageConsole.length} page console entries`);
const netReqs = rrweb.filter((r) => r.type === 6 && /network/.test(r.data.plugin || '')).flatMap((r) => (r.data.payload && r.data.payload.requests) || []);
const netWithUrl = netReqs.filter((r) => r.name);
check('no network requests recorded with a URL, headers or body', netWithUrl.length === 0 && !/"(request|response)(Headers|Body)"/.test(snapText), `${netReqs.length} timing-only entries, ${netWithUrl.length} with a URL`);
const scripts = [...new Set(rec.scripts)];
check('no surveys / tours / conversations / dead-click / exception / web-vitals / toolbar scripts loaded', !scripts.some((s) => /survey|tour|conversation|dead-click|exception|web-vitals|toolbar/.test(s)), scripts.join(', '));
check('no feature flag requests', rec.phRequests.filter((r) => /\/flags|\/decide/.test(r)).length === 0);
check('no identify / alias / person-property events', !events.some((e) => ['$identify', '$create_alias', '$set', '$groupidentify'].includes(e.event)));
const pvs = nonSnap.filter((e) => e.event === '$pageview');
check('pageviews are anonymous (person processing off)', pvs.length > 0 && pvs.every((e) => e.properties.$process_person_profile === false), `${pvs.length} pageviews`);
console.log('INFO  pageview paths:', pvs.map((e) => e.properties.$pathname).join(' > '));
console.log('INFO  fbclid property values seen:', JSON.stringify([...new Set(nonSnap.map((e) => e.properties.fbclid).filter((v) => v !== undefined))]));

// ---------- 2. Gates: none of these may contact PostHog at all ----------
async function gateRun(label, urlPath, opts = {}) {
  const s = await newSession(opts.browser || browser, { initScript: opts.initScript });
  const p = await s.context.newPage();
  await p.goto(`${opts.origin || ORIGIN}${urlPath}`, { waitUntil: 'load' });
  await p.waitForTimeout(5000);
  await s.context.close();
  check(`gate: ${label} -> zero PostHog requests`, s.rec.phRequests.length === 0, `${s.rec.phRequests.length} requests`);
}
await gateRun('/auth/confirmed on the production hostname', '/auth/confirmed');
await gateRun('sh_dev flag set', '/', {
  initScript: () => {
    try {
      localStorage.setItem('sh_dev', '1');
    } catch {}
  },
});
await gateRun('non-production hostname (localhost)', '/', { origin: `http://localhost:${PORT}` });
const automated = await chromium.launch({ args: [RESOLVER] });
await gateRun('automated browser (navigator.webdriver = true)', '/', { browser: automated });
await automated.close();

const s2 = await newSession(browser);
const p2 = await s2.context.newPage();
await p2.goto(`${ORIGIN}/`, { waitUntil: 'load' });
await p2.waitForTimeout(4000);
const cookies = (await s2.context.cookies()).filter((c) => c.name.startsWith('ph_'));
await s2.context.close();
check(
  'PostHog cookie is host-only (not shared with app.getshorthandapp.com)',
  cookies.length > 0 && cookies.every((c) => !c.domain.startsWith('.')),
  cookies.map((c) => `${c.name.replace(TOKEN, 'TOKEN')}@${c.domain}`).join(', ') || 'no cookie',
);

await browser.close();
const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
