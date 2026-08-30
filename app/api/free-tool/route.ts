import { OPENAI_CHAT_COMPLETIONS_URL, OPENAI_REASONING_EFFORT, OPENAI_TEXT_MODEL } from '@/lib/ai-config';
import { checkRateLimit } from '@/lib/ratelimit';

export const runtime = 'edge';

export async function POST(req: Request): Promise<Response> {
  const apiKey = process.env.OPENAI_API_KEY;
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
    const res = await fetch(OPENAI_CHAT_COMPLETIONS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENAI_TEXT_MODEL,
        reasoning_effort: OPENAI_REASONING_EFFORT,
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that writes concise, warm, specific report card comments for elementary school teachers. Output only the comment text. No intro, no labels, no quotes. Write a polished comment a teacher would actually paste onto a report card. Use complete sentences with a clear subject, and match the requested length; do not pad with extra praise, home requests, or empty closers. Write in third person; do not address the student as "you." Vary sentence structure. Use the student name at most once or twice, then pronouns. If no name is given, pick either "this student" or "your child" and use it consistently; never mix both, and never use placeholders such as [Student]. Do not repeat the same verb or stock phrase in one comment, and do not stack phrases like "working on," "continuing to," or "does well in." Treat listed items as topics, not wording to copy; rephrase chip labels such as "Working on social skills" or "Showing recent growth." Keep academic strengths, areas for growth, and social or behavior notes in their own lanes. Mention only what the teacher listed. Do not invent subskills, strategies, or home suggestions. Never add subjects, skills, anecdotes, or details that were not provided. Never use em dashes.',
          },
          { role: 'user', content: prompt },
        ],
        max_completion_tokens: 200,
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
