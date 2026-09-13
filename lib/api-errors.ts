// Client-safe failure response for the free AI generators.
//
// The routes talk to OpenAI, and OpenAI's error bodies carry things a browser
// has no business seeing: organization ids, model names, request ids, quota
// and billing detail. Returning res.status alongside them was also wrong in
// its own right, because an upstream 429 reached the browser looking exactly
// like our own rate limit and got counted as generation_blocked.
//
// So every upstream failure collapses to one fixed message and one fixed
// status. Our own rate limit still returns its own 429 from checkRateLimit,
// before any of this runs.

export const GENERATOR_ERROR_MESSAGE =
  'Something went wrong generating that. Please try again in a moment.';

// 502, not 500: the failure is upstream, and it must not collide with our own
// 429 (blocked) in the client's analytics classification.
export const GENERATOR_ERROR_STATUS = 502;

export function generatorErrorResponse(): Response {
  return Response.json(
    { error: { message: GENERATOR_ERROR_MESSAGE } },
    { status: GENERATOR_ERROR_STATUS }
  );
}

// Server-side only. Records enough to debug (which route, what the upstream
// said) and nothing a teacher typed: the caller passes the upstream's own
// error, never the request body or the generated text.
export function logUpstreamFailure(tool: string, detail: unknown): void {
  const message =
    detail instanceof Error ? detail.message : typeof detail === 'string' ? detail : JSON.stringify(detail);
  console.error(`[generator] upstream failure | tool=${tool} | ${message}`);
}
