// Private function, called only by Vercel's success-page verification route.
// Authenticated via REPORT_CARD_FUNCTIONS_SECRET (see _shared/auth.ts), not
// a Supabase Auth JWT (verify_jwt is set to false at deploy time for this
// reason, matching the delete-account function's convention).
//
// Request:  POST { sessionId: string }
// Response: 200 { granted: true, accessToken: string, isNewPurchase: boolean }
//           200 { granted: false, reason: string }   (session not paid, etc.)
//           401                                       (bad/missing shared secret)
//           400                                       (malformed request body)
//
// Safe to call more than once for the same sessionId: fulfillCheckoutSession
// is idempotent (see _shared/fulfillment.ts).

import { isAuthorizedVercelRequest, corsHeaders, jsonResponse } from '../_shared/auth.ts';
import { fulfillCheckoutSession } from '../_shared/fulfillment.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'method_not_allowed' }, 405);
  }

  if (!isAuthorizedVercelRequest(req)) {
    return jsonResponse({ error: 'unauthorized' }, 401);
  }

  let sessionId: unknown;
  try {
    const body = await req.json();
    sessionId = body?.sessionId;
  } catch {
    return jsonResponse({ error: 'invalid_json' }, 400);
  }

  if (typeof sessionId !== 'string' || sessionId.length === 0 || sessionId.length > 200) {
    return jsonResponse({ error: 'invalid_session_id' }, 400);
  }

  const result = await fulfillCheckoutSession(sessionId);
  return jsonResponse(result, 200);
});
