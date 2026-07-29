// The single idempotent fulfillment path for the Report Card Comment Library.
// Called by BOTH report-card-checkout-fulfill (success-page verification)
// and report-card-checkout-webhook (Stripe webhook). Do not duplicate this
// logic in either function; import it from here so the two callers can
// never drift apart.

import { createClient, type SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'npm:stripe@19.2.0';
import { signAccessToken, newAccessTokenPayload } from './access-token.ts';

// Expected purchase shape for v1. These are deliberately hardcoded rather
// than read back from Stripe at runtime: a price change in the Stripe
// dashboard must NOT silently change what this application accepts as a
// valid payment. Changing the price is an intentional code change plus a
// full test pass.
const EXPECTED_AMOUNT_TOTAL = 499;
const EXPECTED_CURRENCY = 'usd';
const EXPECTED_QUANTITY = 1;

export interface FulfillResult {
  granted: boolean;
  reason?: string;
  accessToken?: string;
  isNewPurchase?: boolean;
}

function getAdminClient(): SupabaseClient {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export function getStripeClient(secretKey: string): Stripe {
  return new Stripe(secretKey, {
    // Deno/edge: use the Fetch-based HTTP client rather than Node's https.
    httpClient: Stripe.createFetchHttpClient(),
  });
}

// Retrieves the Checkout Session from Stripe with line items expanded,
// verifies the ACTUAL purchased line item (not just session metadata, which
// our own checkout route wrote and therefore cannot be trusted as proof of
// what was bought), and idempotently upserts the purchase record.
//
// Safe to call twice, or concurrently, for the same session: the unique
// constraint on stripe_checkout_session_id means only one row is ever
// created, and the loser of a race reads back the winner's row.
export async function fulfillCheckoutSession(sessionId: string): Promise<FulfillResult> {
  const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
  const expectedPriceId = Deno.env.get('STRIPE_PRICE_ID');
  const tokenSecret = Deno.env.get('RCCL_TOKEN_SECRET');

  if (!stripeSecretKey || !expectedPriceId || !tokenSecret) {
    console.error('fulfillCheckoutSession: missing required secret configuration');
    return { granted: false, reason: 'server_misconfigured' };
  }

  if (!sessionId || typeof sessionId !== 'string') {
    return { granted: false, reason: 'invalid_session_id' };
  }

  const stripe = getStripeClient(stripeSecretKey);

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });
  } catch (err) {
    console.error('fulfillCheckoutSession: Stripe retrieval failed:', err);
    return { granted: false, reason: 'session_lookup_failed' };
  }

  // --- Payment state ---
  if (session.status !== 'complete' || session.payment_status !== 'paid') {
    return { granted: false, reason: 'not_paid' };
  }

  // --- Actual purchased line item (the real product verification) ---
  const lineItems = session.line_items?.data ?? [];
  if (lineItems.length !== 1) {
    console.error(
      `fulfillCheckoutSession: expected exactly 1 line item, got ${lineItems.length} on ${sessionId}`
    );
    return { granted: false, reason: 'product_mismatch' };
  }

  const lineItem = lineItems[0];
  if (lineItem.price?.id !== expectedPriceId) {
    console.error(`fulfillCheckoutSession: price ID mismatch on ${sessionId}`);
    return { granted: false, reason: 'product_mismatch' };
  }

  if (lineItem.quantity !== EXPECTED_QUANTITY) {
    console.error(
      `fulfillCheckoutSession: quantity mismatch (${lineItem.quantity}) on ${sessionId}`
    );
    return { granted: false, reason: 'product_mismatch' };
  }

  // --- Amount and currency (hardcoded for v1, see constants above) ---
  if (session.amount_total !== EXPECTED_AMOUNT_TOTAL) {
    console.error(
      `fulfillCheckoutSession: amount mismatch (${session.amount_total}) on ${sessionId}`
    );
    return { granted: false, reason: 'amount_mismatch' };
  }

  if (session.currency !== EXPECTED_CURRENCY) {
    console.error(`fulfillCheckoutSession: currency mismatch (${session.currency}) on ${sessionId}`);
    return { granted: false, reason: 'currency_mismatch' };
  }

  // --- Secondary consistency check, NOT the source of truth ---
  // Our own create-session route stamps this. A mismatch means something is
  // inconsistent between the two services and is worth logging, but the
  // line-item checks above are what actually prove the product.
  if (session.metadata?.rccl_price_id && session.metadata.rccl_price_id !== expectedPriceId) {
    console.error(`fulfillCheckoutSession: metadata/price disagreement on ${sessionId}`);
  }

  const email = session.customer_details?.email;
  if (!email) {
    return { granted: false, reason: 'missing_email' };
  }

  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id ?? null;
  const customerId =
    typeof session.customer === 'string' ? session.customer : session.customer?.id ?? null;

  const admin = getAdminClient();

  const { data: existing, error: selectError } = await admin
    .from('report_card_purchases')
    .select('id')
    .eq('stripe_checkout_session_id', sessionId)
    .maybeSingle();

  if (selectError) {
    console.error('fulfillCheckoutSession: select failed:', selectError.message);
    return { granted: false, reason: 'db_error' };
  }

  let purchaseId: string;
  let isNewPurchase = false;

  if (existing) {
    purchaseId = existing.id;
  } else {
    const { data: inserted, error: insertError } = await admin
      .from('report_card_purchases')
      .insert({
        stripe_checkout_session_id: sessionId,
        stripe_payment_intent_id: paymentIntentId,
        stripe_customer_id: customerId,
        stripe_price_id: expectedPriceId,
        email: email.toLowerCase(),
        amount_total: session.amount_total,
        currency: session.currency,
        status: 'paid',
      })
      .select('id')
      .single();

    if (insertError) {
      if (insertError.code === '23505') {
        // Unique violation: a concurrent caller (webhook vs success page)
        // won the race. Read back its row instead of failing.
        const { data: raced, error: racedError } = await admin
          .from('report_card_purchases')
          .select('id')
          .eq('stripe_checkout_session_id', sessionId)
          .single();
        if (racedError || !raced) {
          console.error('fulfillCheckoutSession: post-race select failed:', racedError?.message);
          return { granted: false, reason: 'db_error' };
        }
        purchaseId = raced.id;
      } else {
        console.error('fulfillCheckoutSession: insert failed:', insertError.message);
        return { granted: false, reason: 'db_error' };
      }
    } else {
      purchaseId = inserted.id;
      isNewPurchase = true;
    }
  }

  const accessToken = await signAccessToken(newAccessTokenPayload(purchaseId), tokenSecret);
  return { granted: true, accessToken, isNewPurchase };
}
