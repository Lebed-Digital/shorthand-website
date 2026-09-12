// Name personalization shared by the paid library view and the free slice on
// the paywall. Extracted so the two views cannot drift: a comment previewed on
// the paywall must read exactly as it does after purchase, and "copy" must
// produce the same text in both places.
//
// Safe for client components: pure string helpers, no comment data.

export const SAMPLE_NAME = 'Jordan';

function capitalizeName(name: string): string {
  return name.replace(/\p{L}+/gu, (word) => word[0].toUpperCase() + word.slice(1));
}

// What the visitor sees on screen. With no name typed, previews against a
// sample name so the comment still reads like a finished sentence.
export function personalize(text: string, name: string): string {
  const trimmed = name.trim();
  const useName = trimmed ? capitalizeName(trimmed) : SAMPLE_NAME;
  return text.split('[Student]').join(useName);
}

// What lands on the clipboard. With no name typed, falls back to "the student"
// rather than the sample name, so nobody pastes "Jordan" into another child's
// report card.
export function finalizeForCopy(text: string, name: string): string {
  const trimmed = name.trim();
  if (trimmed) return text.split('[Student]').join(capitalizeName(trimmed));
  return text.split('[Student]').join('the student');
}
