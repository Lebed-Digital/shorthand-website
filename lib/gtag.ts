declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function fireCtaClick(params: {
  cta_source: string;
  cta_destination: string;
  link_url?: string;
  event_callback?: () => void;
}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', 'cta_click', {
    ...params,
    cta_page: window.location.pathname,
  });
}

// ---------------------------------------------------------------------------
// Paid-funnel events (Report Card Comment Library)
// ---------------------------------------------------------------------------
//
// Analytics must never be able to break checkout or access. Every helper below
// goes through fireEvent(), which no-ops when gtag is absent and swallows any
// error gtag itself throws. A blocked analytics script, an ad blocker, or a
// malformed GA config can therefore never take down the purchase path.
//
// PII rule, enforced by the shape of these functions: no email addresses, no
// Stripe session/customer/payment-intent ids, no entitlement tokens, no
// purchase row ids are accepted as parameters. Only a stable product key,
// price, currency, and coarse categorical reasons.

// The product identifier sent to GA4. Deliberately a plain constant here
// rather than a registry: this PR is observability only, and a second product
// does not exist yet.
export const RCCL_PRODUCT_KEY = 'report-card-comment-library';
export const RCCL_PRICE_USD = 4.99;
export const RCCL_CURRENCY = 'USD';

function fireEvent(name: string, params: Record<string, unknown>): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  try {
    window.gtag('event', name, params);
  } catch {
    // Never propagate. See the note above.
  }
}

// Fired when the buyer actually initiates checkout, i.e. at the moment the
// create-session request is sent, not on page view. `source` distinguishes the
// two CTAs on the paywall so they can be compared.
export function fireBeginCheckout(source: string): void {
  fireEvent('begin_checkout', {
    product_key: RCCL_PRODUCT_KEY,
    value: RCCL_PRICE_USD,
    currency: RCCL_CURRENCY,
    cta_source: source,
    cta_page: typeof window !== 'undefined' ? window.location.pathname : undefined,
  });
}

// Fired when create-session fails, so a drop between begin_checkout and
// reaching Stripe can be told apart from a user who simply abandoned.
export function fireCheckoutStartFailed(reason: string): void {
  fireEvent('checkout_start_failed', {
    product_key: RCCL_PRODUCT_KEY,
    reason,
  });
}

// Fired ONLY after the server has confirmed fulfillment.
//
// The caller must have received granted:true from /verify-session, which only
// returns that after the fulfill Edge Function retrieved the session from
// Stripe and verified payment status, line item, quantity, amount and
// currency. A Stripe redirect to the success URL is NOT sufficient on its own
// and must never trigger this.
//
// No transaction_id is sent. The only stable identifier available client-side
// is the Stripe Checkout Session id, which is a payment identifier we have no
// analytics need for. GA4's own duplicate-transaction suppression is therefore
// not available, so duplicate protection is handled explicitly at the call
// site (a sessionStorage guard keyed on the session id, which never leaves the
// browser). See SuccessClient.
export function firePurchase(): void {
  fireEvent('purchase', {
    product_key: RCCL_PRODUCT_KEY,
    value: RCCL_PRICE_USD,
    currency: RCCL_CURRENCY,
  });
}

// Fired when the restore form is submitted with a locally-valid address.
export function fireRestoreAttempt(): void {
  fireEvent('restore_purchase_attempt', { product_key: RCCL_PRODUCT_KEY });
}

// Fired on the library page when it was reached by following a restore link.
export function fireRestoreSuccess(): void {
  fireEvent('restore_purchase_success', { product_key: RCCL_PRODUCT_KEY });
}

// Fired on the restore-failure page. `reason` is only ever the coarse bucket
// the server already exposes in the URL ('busy' | 'link'), which is public by
// design and carries no information about whether a purchase exists. The
// server's internal reasons (not_paid, lookup_failed, ...) are deliberately
// never sent here: collapsing them is what makes the page non-enumerable.
export function fireRestoreFailure(reason: 'busy' | 'link'): void {
  fireEvent('restore_purchase_failure', {
    product_key: RCCL_PRODUCT_KEY,
    reason,
  });
}

// ---------------------------------------------------------------------------
// Free-slice interaction events (Report Card Comment Library paywall)
// ---------------------------------------------------------------------------
//
// These measure whether the free slice does its job: does a visitor actually
// use it (name, filter, copy) before deciding, and does hitting a locked
// comment move them to checkout.
//
// checkout_clicked and purchase_completed from the brief are deliberately NOT
// new events. begin_checkout and purchase above already cover those two steps
// and are the GA4-standard names the existing Stripe funnel reports on;
// duplicating them under a second name would double-count the funnel. Same PII
// rule as above: no comment text, no names typed by the user, no ids.

export function fireLibraryPageView(variant: 'free' | 'paid'): void {
  fireEvent('library_page_view', { product_key: RCCL_PRODUCT_KEY, variant });
}

// Fired once per page, on the first name keystroke, not per character.
export function fireNameEntered(): void {
  fireEvent('name_entered', { product_key: RCCL_PRODUCT_KEY });
}

// `filter` is the control used ('search' | 'section' | 'tone'), never the
// query text the visitor typed.
export function fireFilterUsed(filter: string): void {
  fireEvent('filter_used', { product_key: RCCL_PRODUCT_KEY, filter });
}

// Comment section only, never the comment text or id.
export function fireFreeCommentCopied(section: string): void {
  fireEvent('free_comment_copied', { product_key: RCCL_PRODUCT_KEY, section });
}

export function fireLockedCommentClicked(section: string): void {
  fireEvent('locked_comment_clicked', { product_key: RCCL_PRODUCT_KEY, section });
}
