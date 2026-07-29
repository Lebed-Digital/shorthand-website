// Public function. Stripe calls this URL directly:
//   https://<project-ref>.supabase.co/functions/v1/report-card-checkout-webhook
// Authenticated exclusively via Stripe's webhook signature, never via
// REPORT_CARD_FUNCTIONS_SECRET.
//
// The raw request body is read with req.text() and passed untouched to
// Stripe's constructEventAsync(), which performs signature verification.
// Nothing parses or re-serializes the body before that call, because
// verification is computed over the exact bytes Stripe sent.
//
// constructEventAsync (not constructEvent) is required here: it uses the
// Web Crypto SubtleCrypto API, which is what Deno provides. The synchronous
// variant assumes Node's crypto module.
//
// Subscribed event: checkout.session.completed only (v1 is card-only /
// immediate-completion payment methods, so no async_payment_succeeded
// handling is needed).
//
// Calls the same fulfillCheckoutSession() used by report-card-checkout-fulfill,
// so success-page verification and webhook delivery can never fulfill a
// purchase differently or create duplicate records.

import Stripe from 'npm:stripe@19.2.0';
import { corsHeaders, jsonResponse } from '../_shared/auth.ts';
import { fulfillCheckoutSession, getStripeClient } from '../_shared/fulfillment.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'method_not_allowed' }, 405);
  }

  const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  if (!stripeSecretKey || !webhookSecret) {
    console.error('report-card-checkout-webhook: Stripe secrets not configured');
    return jsonResponse({ error: 'server_misconfigured' }, 500);
  }

  const signatureHeader = req.headers.get('Stripe-Signature');
  if (!signatureHeader) {
    return jsonResponse({ error: 'missing_signature' }, 400);
  }

  // Raw text, never req.json(): signature verification needs the exact bytes.
  const rawBody = await req.text();

  const stripe = getStripeClient(stripeSecretKey);

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, signatureHeader, webhookSecret);
  } catch (err) {
    console.error('report-card-checkout-webhook: signature verification failed:', err);
    return jsonResponse({ error: 'invalid_signature' }, 400);
  }

  if (event.type !== 'checkout.session.completed') {
    // Acknowledge and ignore. Only checkout.session.completed is subscribed
    // in the Stripe dashboard, but return 200 defensively so Stripe does not
    // retry an event we intentionally do not act on.
    return jsonResponse({ received: true, ignored: true }, 200);
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const result = await fulfillCheckoutSession(session.id);

  if (!result.granted && (result.reason === 'db_error' || result.reason === 'session_lookup_failed')) {
    // Transient failure on our end: return 500 so Stripe retries delivery.
    return jsonResponse({ received: false }, 500);
  }

  // Any other outcome (granted, or a definitive non-retryable reason such as
  // not_paid / product_mismatch / amount_mismatch) is terminal for this
  // event; acknowledge so Stripe stops retrying.
  return jsonResponse({ received: true }, 200);
});
