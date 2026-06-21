import { checkRateLimit } from '@/lib/ratelimit';

export const runtime = 'edge';

export async function POST(req: Request): Promise<Response> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json({ error: { message: 'Server misconfigured.' } }, { status: 500 });
  }

  const rl = await checkRateLimit(req, 'welcome-letter-generator');
  if (rl.blocked) return rl.response!;

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

  const gradeContext: Record<string, string> = {
    'Pre-K': 'Pre-K families are often anxious about their child\'s first school experience. The letter should be especially reassuring, mention routines and nap/snack time if relevant, use very simple language, and emphasize that the classroom is a safe and playful place.',
    'Kindergarten': 'Kindergarten families may have a mix of excitement and separation anxiety. Acknowledge the big milestone, mention that the classroom is warm and structured, and reassure them their child will be looked after.',
    '1st Grade': 'First grade is when reading and writing take off. Reference early literacy and math in a way that feels exciting, not pressured. Families want to know their child will be challenged but supported.',
    '2nd Grade': 'Second graders are hitting their stride. The letter can be a little more confident in tone, mention growing independence, and reference things like chapter books, math facts, or collaborative projects.',
    '3rd Grade': 'Third grade is a big transition year — standardized testing, longer writing assignments, more independence. Acknowledge the step up without making it scary. Be specific about what third grade looks like in this classroom.',
    '4th Grade': 'Fourth graders are becoming more self-directed. Mention student ownership of learning, projects, and the growing complexity of the work. Families appreciate knowing expectations are rising.',
    '5th Grade': 'Fifth grade is often the last year of elementary school. There may be a mix of nostalgia and anticipation. Acknowledge the role this year plays in preparing students for middle school without being dramatic about it.',
    '6th Grade': 'Sixth grade often means a new school or a new structure. Families may be nervous about the transition. Be specific about classroom routines, how to reach the teacher, and what middle school expectations look like.',
    '7th Grade': 'Seventh graders are deep in middle school. The letter can be more direct and less hand-holdy. Families want to know about grading, expectations, and how the teacher communicates. Keep it efficient.',
    '8th Grade': 'Eighth grade is the final year of middle school. Many families are already thinking about high school. Acknowledge the stakes, be clear about expectations and preparation, and keep the tone mature and confident.',
  };

  const toneInstructions: Record<string, string> = {
    Warm: `Write in a genuinely warm, personal tone. This is not "corporate warm" with words like "journey" and "growth mindset." It sounds like a real person who chose teaching because they love kids. Short sentences. Real feelings. The kind of letter a family reads and thinks, "I like this teacher already."`,
    Funny: `Write a warm welcome letter with 2-3 dry teacher-humor moments woven in — self-deprecating observations about the first week, the supplies list, the 47 permission slips, or the general chaos of back-to-school. The letter is warm overall; the humor punctuates it, it does not dominate it. Never joke about children's emotions, struggles, or crying. The humor is always directed at the teacher or the situation, never at kids.`,
    Professional: `Write in a structured, efficient professional tone. Shorter paragraphs. No fluff. Lead with who you are, what the year will look like, and how to reach you. This is not cold — it is respectful and clear. A family should finish reading it in 30 seconds and know exactly what to expect. Do not use warm filler phrases like "I am so excited" or "this is going to be an amazing year."`,
  };

  const subjectLine = subject.trim()
    ? `The teacher teaches ${subject.trim()}. Reference this subject specifically in the letter — what students will do in this class, what families can expect, and why it matters at this grade level.`
    : 'The teacher teaches all subjects. Reference the range of what students will learn across the day.';

  const prompt = `Write a parent welcome letter from a teacher at the start of the school year.

Teacher name: ${teacherName.trim()}
Grade level: ${grade}
${subjectLine}

GRADE-SPECIFIC CONTEXT — this is critical. The letter must sound like it was written for ${grade} specifically, not a generic classroom:
${gradeContext[grade] ?? 'Tailor the letter to the specific developmental stage and expectations of this grade level.'}

TONE — do not ignore this. The three tones produce fundamentally different letters, not just different adjective choices:
${toneInstructions[tone]}

Additional rules:
- 3-4 paragraphs
- Never use em dashes, use commas, colons, or periods instead
- Do not use: "utilize," "leverage," "foster," "facilitate," "delve," "journey," "growth mindset," "holistic"
- No generic filler like "this is going to be an amazing year" unless the tone earns it
- Output only the letter text, no subject line, no labels, no extra commentary`;

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
            content: 'You are a helpful assistant that writes parent welcome letters for teachers. Output only the letter text. No labels, no intro, no extra commentary. Never joke about children crying, struggling emotionally, or having a hard time. Do not invent or promise specific communication systems, infrastructure, or channels. Do not mention a classroom website, newsletter, app, portal, blog, or specific platform unless the teacher provided it. Do not commit to specific schedules like "weekly updates" or "regular newsletters." Speak about communication only in general terms — for example, "I will keep you informed about your child\'s progress" or "please reach out with any questions." The teacher will add specifics themselves.',
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
