export const runtime = 'edge';

export async function POST(req: Request): Promise<Response> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json({ error: { message: 'Server misconfigured.' } }, { status: 500 });
  }

  let letter: string, instructions: string;
  try {
    const body = await req.json();
    letter = body?.letter;
    instructions = body?.instructions ?? '';
    if (!letter || typeof letter !== 'string' || letter.length > 3000) throw new Error();
    if (typeof instructions !== 'string' || instructions.length > 500) throw new Error();
  } catch {
    return Response.json({ error: { message: 'Invalid request.' } }, { status: 400 });
  }

  const refinePart = instructions.trim()
    ? `Teacher instructions: ${instructions.trim()}`
    : 'Make it sound more natural and human. Less generic.';

  const prompt = `Here is a parent welcome letter:\n\n${letter}\n\nRewrite it based on these instructions: ${refinePart}\n\nKeep the same teacher name, grade level, and approximate length. Never use em dashes. Output only the letter text, no labels, no intro, no extra commentary.`;

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
            content: 'You are a helpful assistant that rewrites parent welcome letters for teachers based on their feedback. Output only the revised letter text. No labels, no intro, no extra commentary. Never use em dashes.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 600,
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
    const letter = data.choices?.[0]?.message?.content?.trim();
    if (!letter) throw new Error('Empty response from AI.');

    return Response.json({ letter });
  } catch (e: any) {
    return Response.json(
      { error: { message: e?.message ?? 'Something went wrong.' } },
      { status: 500 }
    );
  }
}
