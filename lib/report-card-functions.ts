// Authenticated client for the private Report Card Comment Library Edge
// Functions (fulfill / restore / revalidate).
//
// Vercel holds no Supabase key of any kind for this feature, not even the anon
// key. All privileged database access happens inside Supabase Edge Functions,
// which is where SUPABASE_SERVICE_ROLE_KEY lives. This module is the only way
// the marketing site reaches them, and it authenticates with a shared bearer
// secret (REPORT_CARD_FUNCTIONS_SECRET) that grants nothing beyond these four
// purpose-built endpoints, each of which re-verifies against Stripe or the
// purchases table before writing anything.
//
// See docs/report-card-comment-library-handoff.md §13.4.

const FUNCTION_TIMEOUT_MS = 10_000;

export type ReportCardFunction =
  | 'report-card-checkout-fulfill'
  | 'report-card-access-restore'
  | 'report-card-access-revalidate';

export interface FunctionCallResult<T> {
  ok: boolean;
  data?: T;
}

function getFunctionsBaseUrl(): string {
  const explicit = process.env.SUPABASE_FUNCTIONS_URL;
  if (explicit) return explicit.replace(/\/+$/, '');
  throw new Error('SUPABASE_FUNCTIONS_URL is not configured.');
}

// Returns ok:false for every failure mode (misconfiguration, network error,
// timeout, non-JSON body, non-2xx status). Callers must treat ok:false as a
// transient/unknown outcome, never as proof that a purchase is invalid.
export async function callReportCardFunction<T>(
  fn: ReportCardFunction,
  body: unknown
): Promise<FunctionCallResult<T>> {
  const secret = process.env.REPORT_CARD_FUNCTIONS_SECRET;
  if (!secret) {
    console.error(`${fn}: REPORT_CARD_FUNCTIONS_SECRET is not configured`);
    return { ok: false };
  }

  let url: string;
  try {
    url = `${getFunctionsBaseUrl()}/${fn}`;
  } catch (e) {
    console.error(`${fn}: ${e instanceof Error ? e.message : String(e)}`);
    return { ok: false };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FUNCTION_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
      signal: controller.signal,
    });

    if (!res.ok) {
      console.error(`${fn}: responded ${res.status}`);
      return { ok: false };
    }

    const data = (await res.json()) as T;
    return { ok: true, data };
  } catch (e) {
    console.error(`${fn}: request failed:`, e instanceof Error ? e.message : String(e));
    return { ok: false };
  } finally {
    clearTimeout(timer);
  }
}
