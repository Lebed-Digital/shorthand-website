import { checkRateLimit } from '@/lib/ratelimit';
import { callReportCardFunction } from '@/lib/report-card-functions';

// Restore-request relay.
//
// Takes an email address from the /restore form and forwards it to the private
// report-card-access-restore Edge Function with action: 'request'. That
// function decides whether the address matches a paid purchase and, if so,
// signs a 30-minute link and sends it via Resend. This route never touches the
// database, holds no Supabase key, and never learns the answer either.
//
// Anti-enumeration is the whole point of the response shape here, and it is
// deliberately asymmetric:
//
//   valid email, purchased      -> 200 { ok: true }
//   valid email, never bought   -> 200 { ok: true }   (identical, byte for byte)
//   Edge Function unreachable   -> 200 { ok: true }   (logged server-side)
//   Edge Function returned junk -> 200 { ok: true }   (logged server-side)
//   malformed JSON body         -> 400 invalid_request
//   missing / malformed email   -> 400 invalid_request
//   rate limited                -> 429
//
// The 400s are safe and intentional. A malformed request is a statement about
// the request, not about any address: you cannot submit a well-formed email and
// receive a 400, so a 400 can never distinguish a customer from a stranger. The
// three 200 cases are what must stay indistinguishable, and they do, including
// when our own infrastructure fails. See handoff §17.5.
//
// The Edge Function itself also always answers { ok: true } for the same
// reason, so there is nothing in `result.data` worth inspecting or relaying.

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Matches the Edge Function's own EMAIL_RE and 320-character bound so the two
// sides agree on what "valid" means. Anything this accepts, that accepts.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 320;

function genericSuccess(): Response {
  return Response.json({ ok: true });
}

function invalidRequest(): Response {
  return Response.json({ error: 'invalid_request' }, { status: 400 });
}

export async function POST(req: Request): Promise<Response> {
  // Body shape is checked before the limiter so malformed junk cannot burn a
  // real person's 5-per-hour budget. Same ordering as restore-confirm.
  let body: { email?: unknown };
  try {
    body = await req.json();
  } catch {
    return invalidRequest();
  }

  const email = body?.email;
  if (typeof email !== 'string') return invalidRequest();

  const trimmed = email.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_EMAIL_LENGTH || !EMAIL_RE.test(trimmed)) {
    return invalidRequest();
  }

  // IP-keyed at 5/hour. Restore-confirm deliberately avoided an IP-primary key
  // because a shared school NAT would let the first teacher's link block the
  // second (§15.5), but that reasoning does not transfer here: this endpoint
  // has no per-link identifier to key on, and the thing being limited is
  // "how much mail can one host make us send", which is exactly per-IP.
  const rl = await checkRateLimit(req, 'report-card-restore');
  if (rl.blocked) return rl.response!;

  const result = await callReportCardFunction<{ ok?: boolean }>('report-card-access-restore', {
    action: 'request',
    email: trimmed,
  });

  // Logged, not surfaced. The visitor is told the same thing either way,
  // because the alternative leaks: "we are having trouble" shown only for real
  // customers would be a purchase oracle. Delivery is verified through Supabase
  // Edge Function logs and the Resend dashboard, never from this response.
  if (!result.ok) {
    console.error('report-card-access/restore: relay to Edge Function failed');
  }

  return genericSuccess();
}
