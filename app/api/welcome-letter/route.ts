export const runtime = 'edge';

export async function POST(req: Request): Promise<Response> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json({ error: { message: 'Server misconfigured.' } }, { status: 500 });
  }

  let teacherName: string, grade: string, subject: string, tone: string;
  try {
    const body = await req.json();
    teacherName = body?.teacherName ?? '';
    grade = body?.grade ?? '';
    subject = body?.subject ?? '';
    tone = body?.tone ?? 'Warm';
    if (!teacherName || typeof teacherName !== 'string' || teacherName.length > 100) throw new Error();
    if (!grade || typeof grade !== 'string') throw new Error();
    if (typeof subject !== 'string' || subject.length > 100) throw new Error();
    if (!['Warm', 'Funny', 'Professional'].includes(tone)) throw new Error();
  } catch {
    return Response.json({ error: { message: 'Invalid request.' } }, { status: 400 });
  }

  const toneInstructions: Record<string, string> = {
    Warm: 'Write in a warm, welcoming, and encouraging tone. Feel like a teacher who genuinely loves their class and wants families to feel at ease.',
    Funny: 'Write with light humor and personality. Keep it appropriate for families but let the teacher\'s fun side show through. A joke or two is welcome.',
    Professional: 'Write in a polished, professional tone. Clear, respectful, and organized. Suitable for formal school communication.',
  };

  const subjectLine = subject.trim()
    ? `The teacher teaches ${subject.trim()}.`
    : 'The teacher teaches all subjects (elementary generalist).';

  const prompt = `Write a parent welcome letter from a teacher at the start of the school year.

Teacher name: ${teacherName.trim()}
Grade level: ${grade}
${subjectLine}
Tone: ${toneInstructions[tone]}

The letter should:
- Open with a warm greeting to families
- Introduce the teacher briefly (name, grade, subject if applicable)
- Express excitement for the year ahead
- Include 2-3 sentences about the classroom environment or teaching philosophy
- Mention one or two practical things families can expect (communication, homework expectations, or similar)
- Close with an invitation to reach out with questions
- Be 3-4 paragraphs total
- Feel personal and human, not like a template
- Never use em dashes under any circumstances, use commas, colons, or periods instead
- Do not use the words "utilize," "leverage," "foster," "facilitate," or "delve"

Output only the letter text. No subject line, no labels, no extra commentary.`;

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
            content: 'You are a helpful assistant that writes parent welcome letters for teachers. Output only the letter text. No labels, no intro, no extra commentary.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 600,
        temperature: 0.8,
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
