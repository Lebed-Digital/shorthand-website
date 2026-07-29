import Stripe from 'stripe';

// Uses a Stripe RESTRICTED key scoped to "Checkout Sessions: Write" only.
// This client creates Checkout Sessions and nothing else — session
// retrieval/verification happens inside the Supabase Edge Functions using a
// separate, full-access Stripe secret key that never exists in Vercel.
export function getStripeClient(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured.');
  }
  return new Stripe(secretKey);
}

// Required, no fallback: the base URL must be explicit per environment
// (local / preview / production) rather than silently defaulting to the
// production domain, so a misconfigured preview deploy fails loudly instead
// of redirecting Stripe Checkout back to the live site.
export function getSiteUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    throw new Error('NEXT_PUBLIC_SITE_URL is not configured.');
  }
  return siteUrl.replace(/\/+$/, '');
}
