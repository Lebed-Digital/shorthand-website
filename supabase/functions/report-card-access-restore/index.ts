// Private function, called only by Vercel's restore-access routes.
// Authenticated via REPORT_CARD_FUNCTIONS_SECRET (see _shared/auth.ts).
//
// Two actions, one function:
//
// action: "request"
//   Request:  POST { action: "request", email: string }
//   Response: 200 { ok: true }  -- ALWAYS this shape regardless of whether
//             the email matched a purchase, to prevent enumeration. Vercel
//             has no way to distinguish "sent" from "no match" from this
//             response, which is deliberate.
//   Side effect: if the email matches a paid purchase, sends a restoration
//   email via Resend containing a fresh, short-lived (30 min) signed link.
//
// action: "confirm"
//   Request:  POST { action: "confirm", token: string }
//   Response: 200 { granted: true, accessToken: string }
//             200 { granted: false, reason: string }
//   The confirm token is a distinct, short-lived token type from the
//   long-lived access token it produces (see _shared/access-token.ts).
//
//   reason is one of:
//     invalid_token            malformed / absent / absurdly long
//     invalid_or_expired_token bad signature or past exp (30 min link)
//     not_paid                 query SUCCEEDED, row missing or not 'paid'
//     lookup_failed            query FAILED (transient); retryable
//     server_misconfigured     RCCL_TOKEN_SECRET absent
//
//   not_paid and lookup_failed are deliberately distinct. Only lookup_failed
//   is retryable; everything else is definitive.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { isAuthorizedVercelRequest, corsHeaders, jsonResponse } from '../_shared/auth.ts';
import {
  signAccessToken,
  verifyAccessToken,
  newAccessTokenPayload,
  RESTORE_TOKEN_TTL_SECONDS,
} from '../_shared/access-token.ts';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getAdminClient() {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

async function sendRestorationEmail(email: string, restoreUrl: string): Promise<void> {
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  if (!resendApiKey) {
    // Handled, not thrown: local/dev environments and any environment where
    // Resend hasn't been configured yet should not crash the request. The
    // caller still returns { ok: true } either way (see the note on
    // enumeration above), so this failure is silent to the end user but
    // loud in logs.
    console.error('report-card-access-restore: RESEND_API_KEY not configured, skipping send');
    return;
  }

  const fromAddress = Deno.env.get('RESEND_FROM_ADDRESS');
  if (!fromAddress) {
    console.error('report-card-access-restore: RESEND_FROM_ADDRESS not configured, skipping send');
    return;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: email,
        subject: 'Your Report Card Comment Library access',
        text: `Here is your link to reopen the Report Card Comment Library:\n\n${restoreUrl}\n\nThis link expires in 30 minutes. If it expires, just request a new one from the library page.`,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`report-card-access-restore: Resend send failed (${res.status}): ${body}`);
    }
  } catch (err) {
    console.error('report-card-access-restore: Resend request threw:', err);
  }
}

async function handleRequest(email: unknown): Promise<Response> {
  if (typeof email !== 'string' || !EMAIL_RE.test(email) || email.length > 320) {
    // Still a generic ok response: malformed input reveals nothing either.
    return jsonResponse({ ok: true }, 200);
  }

  const tokenSecret = Deno.env.get('RCCL_TOKEN_SECRET');
  const siteUrl = Deno.env.get('RCCL_SITE_URL');
  if (!tokenSecret || !siteUrl) {
    console.error('report-card-access-restore: missing RCCL_TOKEN_SECRET or RCCL_SITE_URL');
    return jsonResponse({ ok: true }, 200);
  }

  const admin = getAdminClient();
  const { data: purchase, error } = await admin
    .from('report_card_purchases')
    .select('id')
    .eq('email', email.toLowerCase())
    .eq('status', 'paid')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('report-card-access-restore: lookup failed:', error.message);
    return jsonResponse({ ok: true }, 200);
  }

  if (purchase) {
    // Short-lived restore link. revalidateAfter is set equal to exp because
    // this token is only ever exchanged for a real access token by the
    // confirm path, never used to grant access directly.
    const restoreExp = Math.floor(Date.now() / 1000) + RESTORE_TOKEN_TTL_SECONDS;
    const restoreToken = await signAccessToken(
      { purchaseId: purchase.id, exp: restoreExp, revalidateAfter: restoreExp },
      tokenSecret
    );
    const restoreUrl = `${siteUrl}/report-card-comment-library/restore/confirm?token=${encodeURIComponent(restoreToken)}`;
    await sendRestorationEmail(email, restoreUrl);
  }

  // Same response whether or not a purchase was found.
  return jsonResponse({ ok: true }, 200);
}

async function handleConfirm(token: unknown): Promise<Response> {
  if (typeof token !== 'string' || token.length === 0 || token.length > 2000) {
    return jsonResponse({ granted: false, reason: 'invalid_token' }, 200);
  }

  const tokenSecret = Deno.env.get('RCCL_TOKEN_SECRET');
  if (!tokenSecret) {
    console.error('report-card-access-restore: RCCL_TOKEN_SECRET not configured');
    return jsonResponse({ granted: false, reason: 'server_misconfigured' }, 200);
  }

  const payload = await verifyAccessToken(token, tokenSecret);
  if (!payload) {
    return jsonResponse({ granted: false, reason: 'invalid_or_expired_token' }, 200);
  }

  const admin = getAdminClient();
  const { data: purchase, error } = await admin
    .from('report_card_purchases')
    .select('id, status')
    .eq('id', payload.purchaseId)
    .maybeSingle();

  // An actual query failure is NOT the same as a definitive "you did not pay",
  // and the two must never be collapsed (they were, until 2026-07-29). A
  // transient database error is reported as lookup_failed so the caller can
  // treat it as retryable and say "try again in a moment" rather than telling
  // a paying customer their purchase does not exist. Mirrors the same split in
  // report-card-access-revalidate.
  if (error) {
    console.error('report-card-access-restore: lookup failed:', error.message);
    return jsonResponse({ granted: false, reason: 'lookup_failed' }, 200);
  }

  // Successful query. Either there is no such row, or it is refunded/revoked.
  // Both are definitive: the answer will not change by retrying.
  if (!purchase || purchase.status !== 'paid') {
    return jsonResponse({ granted: false, reason: 'not_paid' }, 200);
  }

  const accessToken = await signAccessToken(newAccessTokenPayload(purchase.id), tokenSecret);

  return jsonResponse({ granted: true, accessToken }, 200);
}

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

  let body: { action?: unknown; email?: unknown; token?: unknown };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'invalid_json' }, 400);
  }

  if (body.action === 'request') return handleRequest(body.email);
  if (body.action === 'confirm') return handleConfirm(body.token);
  return jsonResponse({ error: 'invalid_action' }, 400);
});
