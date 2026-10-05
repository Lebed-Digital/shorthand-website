'use client';

import { useEffect } from 'react';
import { captureEvent, type CustomEventProps } from '../lib/posthog-events';

// Counts a copy (Ctrl+C, right-click Copy, or the phone's Copy) when the
// selection is in one of a blog post's examples. Rendered only on the posts
// listed in BLOG_EXAMPLE_POSTS (lib/posthog-events.ts).
//
// The posts have no Copy buttons and markdown cannot carry a marker (the
// sanitizer in lib/posts.ts strips raw HTML), so an example is recognised by
// the markup the posts already use:
//   - a blockquote
//   - a list item or paragraph that is one whole quotation
//   - a plain email template: from its "Subject:" line down to "[Your Name]"
// Anything else on the page (prose, headings, the FAQ, the nav) sends nothing.
//
// Only where the selection sits is read, to find the example and its position.
// The selected text and the clipboard are never read.

const WHOLE_QUOTATION = /^\s*["“][\s\S]*["”]\s*$/;
const SUBJECT_LINE = /^\s*Subject:/i;
const SIGN_OFF = /\[Your Name\]/i;
const ENDS_A_TEMPLATE = /^(H[1-6]|HR|BLOCKQUOTE)$/;

const text = (el: Element) => el.textContent ?? '';

// One whole quotation, with or without a bold label in front of it, as in
// **The Helper:** "[Student] comes to school each day with..."
function isQuotation(el: Element): boolean {
  const body = text(el).trimStart();
  const label = el.querySelector('strong');
  const lead = label && body.startsWith(text(label)) ? text(label).length : 0;
  return WHOLE_QUOTATION.test(body.slice(lead));
}

// The element that stands for the whole example `node` sits in, or null.
function exampleAt(node: Node): Element | null {
  const start = node instanceof Element ? node : node.parentElement;
  if (!start?.closest('.blog-content')) return null;

  const quote = start.closest('blockquote');
  if (quote) return quote;

  const item = start.closest('li') ?? start.closest('p');
  if (item && isQuotation(item)) return item;

  // Plain email template. Step up to the top-level block (the post body's
  // blocks sit directly inside a div), then walk back to the "Subject:" line
  // that opens it. A heading, a blockquote or an earlier sign-off on the way
  // means this block is not inside a template.
  let block: Element = start;
  while (block.parentElement && block.parentElement.tagName !== 'DIV') block = block.parentElement;
  for (let el: Element | null = block; el; el = el.previousElementSibling) {
    if (ENDS_A_TEMPLATE.test(el.tagName)) return null;
    if (el !== block && SIGN_OFF.test(text(el))) return null;
    if (el.tagName === 'P' && SUBJECT_LINE.test(text(el))) {
      // Where the body is a blockquote, its subject line is the same example.
      const next = el.nextElementSibling;
      return next?.tagName === 'BLOCKQUOTE' ? next : el;
    }
  }
  return null;
}

// Every example in the post, in reading order.
function allExamples(): Element[] {
  const found = new Set<Element>();
  for (const el of document.querySelectorAll('.blog-content blockquote, .blog-content li, .blog-content p')) {
    const example = exampleAt(el);
    if (example) found.add(example);
  }
  return [...found];
}

export default function BlogExampleCopyTracker({
  exampleType,
}: {
  exampleType: CustomEventProps<'blog_example_copied'>['example_type'];
}) {
  useEffect(() => {
    let lastExample: Element | null = null;
    let lastAt = 0;

    function handleCopy() {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      // ponytail: only the two ends of the selection are checked, so a drag
      // that starts above an example and ends below it is missed. Walk the
      // range if that undercount ever matters. An end at offset 0 has taken
      // nothing from its block (a triple-click ends at the start of the next
      // one), so it does not count.
      const example = exampleAt(range.startContainer) ?? (range.endOffset > 0 ? exampleAt(range.endContainer) : null);
      if (!example) return;

      // A held Ctrl+C repeats, and plenty of people press it twice.
      const now = Date.now();
      if (example === lastExample && now - lastAt < 2000) return;
      lastExample = example;
      lastAt = now;

      captureEvent('blog_example_copied', {
        example_type: exampleType,
        example_number: String(allExamples().indexOf(example) + 1),
        copy_method: 'text_selection',
      });
    }

    document.addEventListener('copy', handleCopy);
    return () => document.removeEventListener('copy', handleCopy);
  }, [exampleType]);

  return null;
}
