import { checkRateLimit } from '@/lib/ratelimit';

export const runtime = 'edge';

export async function POST(req: Request): Promise<Response> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json({ error: { message: 'Server misconfigured.' } }, { status: 500 });
  }

  const rl = await checkRateLimit(req, 'report-card-generator');
  if (rl.blocked) return rl.response!;

  let prompt: string;
  try {
    const body = await req.json();
    prompt = body?.prompt;
    if (!prompt || typeof prompt !== 'string' || prompt.length > 1000) throw new Error();
  } catch {
    return Response.json({ error: { message: 'Invalid request.' } }, { status: 400 });
  }

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that writes concise, warm, specific report card comments for elementary school teachers. Output only the comment text. No intro, no labels, no quotes.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return Response.json(
        { error: { message: err?.error?.message ?? 'AI request failed.' } },
        { status: res.status }
      );
    }

    const data = await res.json();
    const comment = data.choices?.[0]?.message?.content?.trim();
    if (!comment) throw new Error('Empty response from AI.');

    return Response.json({ comment });
  } catch (e: any) {
    return Response.json(
      { error: { message: e?.message ?? 'Something went wrong.' } },
      { status: 500 }
    );
  }
}
