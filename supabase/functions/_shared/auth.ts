// Verifies the shared-secret bearer token Vercel sends on private calls.
// The Stripe webhook function does NOT use this: it authenticates via
// Stripe's own signature scheme instead (see stripe.ts constructEvent usage).

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export function isAuthorizedVercelRequest(req: Request): boolean {
  const expected = Deno.env.get('REPORT_CARD_FUNCTIONS_SECRET');
  if (!expected) {
    console.error('REPORT_CARD_FUNCTIONS_SECRET is not configured');
    return false;
  }

  const header = req.headers.get('Authorization') ?? '';
  const prefix = 'Bearer ';
  if (!header.startsWith(prefix)) return false;

  const provided = header.slice(prefix.length);
  return timingSafeEqual(provided, expected);
}

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
