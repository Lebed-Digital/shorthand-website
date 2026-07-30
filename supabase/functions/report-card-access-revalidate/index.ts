// Private function, called only by Vercel's gated library page, and only
// when a valid access token's revalidateAfter timestamp has passed (roughly
// once per user per 24 hours, not on every page render).
//
// Authenticated via REPORT_CARD_FUNCTIONS_SECRET (see _shared/auth.ts).
//
// This is what makes 'refunded' and 'revoked' in report_card_purchases
// actually withdraw access rather than being decorative: the purchase row is
// re-checked here, and a token is only reissued while status = 'paid'.
//
// Request:  POST { purchaseId: string }
// Response: 200 { valid: true, accessToken: string }   (still paid, reissued)
//           200 { valid: false, reason: string }       (refunded/revoked/missing)
//           401                                        (bad/missing shared secret)
//           400                                        (malformed request body)
//
// Deliberately takes purchaseId rather than the token itself: Vercel has
// already verified the token's HMAC signature and hard expiry locally before
// calling here, so this function's only job is the database status check.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { isAuthorizedVercelRequest, corsHeaders, jsonResponse } from '../_shared/auth.ts';
import { signAccessToken, newAccessTokenPayload } from '../_shared/access-token.ts';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

  const tokenSecret = Deno.env.get('RCCL_TOKEN_SECRET');
  if (!tokenSecret) {
    console.error('report-card-access-revalidate: RCCL_TOKEN_SECRET not configured');
    return jsonResponse({ valid: false, reason: 'server_misconfigured' }, 200);
  }

  let purchaseId: unknown;
  try {
    const body = await req.json();
    purchaseId = body?.purchaseId;
  } catch {
    return jsonResponse({ error: 'invalid_json' }, 400);
  }

  if (typeof purchaseId !== 'string' || !UUID_RE.test(purchaseId)) {
    return jsonResponse({ error: 'invalid_purchase_id' }, 400);
  }

  const admin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data: purchase, error } = await admin
    .from('report_card_purchases')
    .select('id, status')
    .eq('id', purchaseId)
    .maybeSingle();

  if (error) {
    console.error('report-card-access-revalidate: lookup failed:', error.message);
    // Do NOT revoke access on a transient database error. Vercel treats this
    // as "keep existing access, try again later" so a Supabase blip does not
    // lock out paying customers.
    return jsonResponse({ valid: false, reason: 'lookup_failed' }, 200);
  }

  if (!purchase || purchase.status !== 'paid') {
    return jsonResponse({ valid: false, reason: 'not_paid' }, 200);
  }

  const accessToken = await signAccessToken(newAccessTokenPayload(purchase.id), tokenSecret);
  return jsonResponse({ valid: true, accessToken }, 200);
});
