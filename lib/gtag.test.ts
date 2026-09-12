import { test, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import {
  fireGenerationAttempt,
  fireGenerationSuccess,
  fireGenerationBlocked,
  fireGenerationFailed,
} from './gtag.ts';

// lib/gtag.ts talks to window.gtag. Node has no window, so stand one up and
// record what the helpers push into it.
type GtagCall = [string, string, Record<string, unknown>];
const calls: GtagCall[] = [];

const globalWithWindow = globalThis as unknown as { window?: unknown };
const hadWindow = 'window' in globalThis;

beforeEach(() => {
  calls.length = 0;
  globalWithWindow.window = {
    gtag: (...args: unknown[]) => { calls.push(args as GtagCall); },
    location: { pathname: '/report-card-comment-generator' },
  };
});

after(() => {
  if (!hadWindow) delete globalWithWindow.window;
});

test('fires one generation_attempt carrying only tool and action', () => {
  fireGenerationAttempt('welcome-letter', 'generate');

  assert.equal(calls.length, 1);
  const [kind, name, params] = calls[0];
  assert.equal(kind, 'event');
  assert.equal(name, 'generation_attempt');
  assert.deepEqual(params, { tool: 'welcome-letter', action: 'generate' });
});

test('success, blocked and failed each fire under their own stable event name', () => {
  fireGenerationSuccess('report-card-comment', 'generate');
  fireGenerationBlocked('welcome-letter', 'refine');
  fireGenerationFailed('welcome-letter', 'generate', 'http_error');

  assert.deepEqual(calls.map((c) => c[1]), [
    'generation_success',
    'generation_blocked',
    'generation_failed',
  ]);
  assert.deepEqual(calls[1][2], { tool: 'welcome-letter', action: 'refine' });
  assert.deepEqual(calls[2][2], { tool: 'welcome-letter', action: 'generate', reason: 'http_error' });
});

test('a blocked generation is never reported as a success', () => {
  fireGenerationBlocked('welcome-letter', 'generate');
  assert.equal(calls.filter((c) => c[1] === 'generation_success').length, 0);
});

// The PII guarantee. Every parameter value must come from the closed sets the
// types describe, so no free-form user content can reach GA4 through these.
test('event payloads contain only low-cardinality values from a closed set', () => {
  const tools = ['report-card-comment', 'welcome-letter'] as const;
  const actions = ['generate', 'refine'] as const;
  const reasons = ['http_error', 'network', 'empty_response'] as const;

  for (const tool of tools) {
    for (const action of actions) {
      fireGenerationAttempt(tool, action);
      fireGenerationSuccess(tool, action);
      fireGenerationBlocked(tool, action);
      for (const reason of reasons) fireGenerationFailed(tool, action, reason);
    }
  }

  const allowed = new Set<unknown>([...tools, ...actions, ...reasons]);
  for (const [, , params] of calls) {
    assert.deepEqual(Object.keys(params).sort().join(','),
      'reason' in params ? 'action,reason,tool' : 'action,tool');
    for (const value of Object.values(params)) {
      assert.ok(allowed.has(value), `unexpected analytics value: ${String(value)}`);
    }
  }
});

test('no-ops instead of throwing when gtag is absent (ad blocker)', () => {
  globalWithWindow.window = { location: { pathname: '/x' } };
  assert.doesNotThrow(() => {
    fireGenerationAttempt('welcome-letter', 'generate');
    fireGenerationSuccess('welcome-letter', 'generate');
    fireGenerationBlocked('welcome-letter', 'generate');
    fireGenerationFailed('welcome-letter', 'generate', 'network');
  });
});

test('swallows an error thrown by gtag itself so a generator never breaks', () => {
  globalWithWindow.window = {
    gtag: () => { throw new Error('GA blew up'); },
    location: { pathname: '/x' },
  };
  assert.doesNotThrow(() => fireGenerationAttempt('welcome-letter', 'refine'));
});
