import { checkRateLimit } from '@/lib/ratelimit';
import { getStripeClient, getSiteUrl } from '@/lib/stripe';

// nodejs, not edge: the stripe SDK's default HTTP client assumes Node APIs.
export const runtime = 'nodejs';

export async function POST(req: Request): Promise<Response> {
  const rl = await checkRateLimit(req, 'report-card-checkout');
  if (rl.blocked) return rl.response!;

  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) {
    return Response.json({ error: { message: 'Server misconfigured.' } }, { status: 500 });
  }

  let siteUrl: string;
  try {
    siteUrl = getSiteUrl();
  } catch {
    return Response.json({ error: { message: 'Server misconfigured.' } }, { status: 500 });
  }

  try {
    const stripe = getStripeClient();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      // Card only: v1 promises instant access, so payment methods that can
      // settle asynchronously (e.g. bank debits) are excluded on purpose.
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      // Read back by the fulfill Edge Function to confirm this session paid
      // for the expected product before granting access.
      metadata: { rccl_price_id: priceId },
      success_url: `${siteUrl}/report-card-comment-library/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/report-card-comment-library`,
    });

    if (!session.url) {
      throw new Error('Stripe did not return a Checkout URL.');
    }

    return Response.json({ url: session.url });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('report-card-checkout/create-session failed:', message);
    return Response.json(
      { error: { message: 'Could not start checkout. Please try again.' } },
      { status: 500 }
    );
  }
}
