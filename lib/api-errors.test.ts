import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import * as nodeModule from 'node:module';

// registerHooks is Node >= 22.15 / 24; @types/node@20 does not declare it yet.
type ResolveHook = (
  specifier: string,
  context: unknown,
  next: (specifier: string, context: unknown) => unknown
) => unknown;
const registerHooks = (nodeModule as unknown as {
  registerHooks: (hooks: { resolve: ResolveHook }) => void;
}).registerHooks;

// Audit F5: no upstream provider detail may reach the browser.
//
// The three generator routes are plain edge handlers, so they are called
// directly here with a stubbed global fetch standing in for OpenAI. The
// limiters are stubbed to allow, so every assertion below is about the
// upstream path, never about rate limiting.
process.env.OPENAI_API_KEY ??= 'sk-test-not-a-real-key';
process.env.UPSTASH_REDIS_REST_URL ??= 'https://example.invalid';
process.env.UPSTASH_REDIS_REST_TOKEN ??= 'test-token';

// The routes import through the "@/" tsconfig alias, which Next resolves at
// build time and bare node does not. One resolve hook maps it to the repo
// root, so the real route files can be exercised unmodified.
registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith('@/')) {
      return next(new URL(`../${specifier.slice(2)}.ts`, import.meta.url).href, context);
    }
    return next(specifier, context);
  },
});

// Dynamic, not static: ratelimit.ts builds its Upstash client at import time,
// and static ESM imports would hoist above the env assignments and the hook.
type RateLimitModule = typeof import('./ratelimit.ts');
const ratelimit: RateLimitModule = await import('./ratelimit.ts');
const errors = await import('./api-errors.ts');

type Handler = (req: Request) => Promise<Response>;

const routes: { name: string; tool: keyof RateLimitModule['limiters']; handler: Handler; body: unknown; ok: unknown; field: string }[] = [
  {
    name: 'welcome-letter generate',
    tool: 'welcome-letter-generator',
    handler: (await import('../app/api/welcome-letter/route.ts')).POST,
    body: { teacherName: 'Ms. Johnson', grade: '3rd Grade', subject: '', tone: 'Warm' },
    ok: { choices: [{ message: { content: 'Dear Families, welcome.' } }] },
    field: 'letter',
  },
  {
    name: 'welcome-letter refine',
    tool: 'welcome-letter-refine',
    handler: (await import('../app/api/welcome-letter-refine/route.ts')).POST,
    body: { letter: 'Dear Families, welcome.', instructions: 'Shorter please.' },
    ok: { choices: [{ message: { content: 'Dear Families, hello.' } }] },
    field: 'letter',
  },
  {
    name: 'report-card comment',
    tool: 'report-card-generator',
    handler: (await import('../app/api/free-tool/route.ts')).POST,
    body: { prompt: 'Reading, showing recent growth' },
    ok: { choices: [{ message: { content: 'A warm, specific comment.' } }] },
    field: 'comment',
  },
];

// A provider error body stuffed with everything that must never escape.
const LEAKY_UPSTREAM_BODY = JSON.stringify({
  error: {
    message: 'Rate limit reached for gpt-5.6-luna in organization org-SECRET123 on tokens per min.',
    type: 'insufficient_quota',
    code: 'rate_limit_exceeded',
    request_id: 'req-abc123deadbeef',
  },
});

const SECRETS = ['org-SECRET123', 'gpt-5.6-luna', 'req-abc123deadbeef', 'insufficient_quota', 'rate_limit_exceeded'];

function post(body: unknown): Request {
  return new Request('https://getshorthandapp.com/api/test', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.7' },
    body: JSON.stringify(body),
  });
}

let realFetch: typeof globalThis.fetch;
let realError: typeof console.error;
let realLog: typeof console.log;
let logged: string[];

beforeEach(() => {
  realFetch = globalThis.fetch;
  realError = console.error;
  realLog = console.log;
  logged = [];
  console.error = (...args: unknown[]) => { logged.push(args.join(' ')); };
  console.log = () => {};
  // Every limiter allows, so nothing below is our own 429.
  for (const tool of Object.keys(ratelimit.limiters) as (keyof RateLimitModule['limiters'])[]) {
    ratelimit.limiters[tool].limit = (async () => ({ success: true })) as never;
  }
});

afterEach(() => {
  globalThis.fetch = realFetch;
  console.error = realError;
  console.log = realLog;
});

function stubFetch(impl: () => Promise<Response>) {
  globalThis.fetch = (async () => impl()) as typeof globalThis.fetch;
}

for (const route of routes) {
  test(`${route.name}: an upstream error body never reaches the client`, async () => {
    stubFetch(async () => new Response(LEAKY_UPSTREAM_BODY, { status: 429, headers: { 'content-type': 'application/json' } }));

    const res = await route.handler(post(route.body));
    const text = await res.text();

    for (const secret of SECRETS) {
      assert.ok(!text.includes(secret), `client body leaked ${secret}: ${text}`);
    }
    assert.equal(text, JSON.stringify({ error: { message: errors.GENERATOR_ERROR_MESSAGE } }));
    assert.equal(res.status, errors.GENERATOR_ERROR_STATUS);
  });

  test(`${route.name}: an upstream 429 is not mirrored as our own 429`, async () => {
    stubFetch(async () => new Response(LEAKY_UPSTREAM_BODY, { status: 429 }));

    const res = await route.handler(post(route.body));
    // The client reads status first: a 429 here would be miscounted as
    // generation_blocked when it is really an upstream failure.
    assert.notEqual(res.status, 429);
    assert.equal(res.status, 502);
  });

  test(`${route.name}: a thrown network error never reaches the client`, async () => {
    stubFetch(async () => { throw new Error('connect ECONNREFUSED 10.1.2.3:443 for api.openai.com key sk-live-SECRET'); });

    const res = await route.handler(post(route.body));
    const text = await res.text();

    assert.ok(!text.includes('ECONNREFUSED'), text);
    assert.ok(!text.includes('sk-live-SECRET'), text);
    assert.ok(!text.includes('10.1.2.3'), text);
    assert.equal(res.status, 502);
  });

  test(`${route.name}: the upstream detail is still logged server-side`, async () => {
    stubFetch(async () => new Response(LEAKY_UPSTREAM_BODY, { status: 500 }));

    await route.handler(post(route.body));
    const joined = logged.join('\n');
    assert.match(joined, /\[generator\] upstream failure/);
    assert.match(joined, /org-SECRET123/, 'server logs keep the detail that makes this debuggable');
  });

  test(`${route.name}: a successful generation is unchanged`, async () => {
    stubFetch(async () => new Response(JSON.stringify(route.ok), { status: 200, headers: { 'content-type': 'application/json' } }));

    const res = await route.handler(post(route.body));
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data[route.field], (route.ok as { choices: { message: { content: string } }[] }).choices[0].message.content);
    assert.equal(data.error, undefined);
  });

  test(`${route.name}: our own rate limit still returns its own 429, unchanged`, async () => {
    ratelimit.limiters[route.tool].limit = (async () => ({ success: false })) as never;
    let fetched = false;
    stubFetch(async () => { fetched = true; return new Response('{}', { status: 200 }); });

    const res = await route.handler(post(route.body));
    assert.equal(res.status, 429, 'blocked-vs-failed classification depends on this staying 429');
    const data = await res.json();
    assert.match(data.error.message, /free generation limit/);
    assert.equal(fetched, false, 'a blocked request must never reach the provider');
  });

  test(`${route.name}: an invalid request is still a 400, not a 502`, async () => {
    stubFetch(async () => new Response('{}', { status: 200 }));
    const res = await route.handler(post({ nonsense: true }));
    assert.equal(res.status, 400);
  });
}
