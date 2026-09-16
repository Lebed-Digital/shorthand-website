import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

const postsDir = path.join(process.cwd(), 'posts');

export interface PostMeta {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  /**
   * Optional. Set this only when an existing post is genuinely refreshed.
   * `date` stays the original publication date; this drives dateModified.
   * When absent, dateModified falls back to `date`, so posts that have never
   * been revised are not reported to Google as recently updated.
   */
  lastModified?: string;
  author: string;
  excerpt: string;
  tags?: string[];
  relatedPosts?: string[];
  faq?: { q: string; a: string }[];
}

export interface Post extends PostMeta {
  contentHtml: string;
}

// gray-matter parses unquoted YAML dates into Date objects, so both date fields
// have to survive that before they reach the schema.
function toDateString(value: unknown): string {
  return value instanceof Date ? value.toISOString().slice(0, 10) : String(value);
}

function normalizePostData(data: Record<string, unknown>): Omit<PostMeta, 'slug'> {
  return {
    ...data,
    date: toDateString(data.date),
    // Spread conditionally: a post without lastModified must stay undefined
    // rather than becoming the string "undefined", which would defeat the
    // `?? date` fallback at the call site.
    ...(data.lastModified != null ? { lastModified: toDateString(data.lastModified) } : {}),
  } as Omit<PostMeta, 'slug'>;
}

export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));
  return files
    .map((file) => {
      const slug = file.replace(/\.md$/, '');
      const raw = fs.readFileSync(path.join(postsDir, file), 'utf8');
      const { data } = matter(raw);
      return { slug, ...normalizePostData(data) } as PostMeta;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

function tokenize(text: string): Set<string> {
  return new Set(
    text.toLowerCase()
      .replace(/[^a-z0-9 ]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !['that', 'this', 'with', 'from', 'your', 'have', 'more', 'about', 'what', 'when', 'will', 'they', 'their', 'been', 'also', 'into', 'than', 'then', 'some', 'over', 'just'].includes(w))
  );
}

export function getRelatedPosts(currentSlug: string, all: PostMeta[]): PostMeta[] {
  const current = all.find((p) => p.slug === currentSlug);
  if (!current) return [];

  // Manual override: return exactly those slugs in order
  if (current.relatedPosts && current.relatedPosts.length > 0) {
    return current.relatedPosts
      .map((s) => all.find((p) => p.slug === s))
      .filter((p): p is PostMeta => !!p)
      .slice(0, 3);
  }

  const currentTags = new Set((current.tags || []).map((t) => t.toLowerCase()));
  const currentTokens = tokenize(`${current.title} ${current.slug.replace(/-/g, ' ')} ${current.excerpt || ''}`);

  const scored = all
    .filter((p) => p.slug !== currentSlug)
    .map((p) => {
      let score = 0;

      // Tag overlap (high signal)
      const pTags = new Set((p.tags || []).map((t) => t.toLowerCase()));
      for (const tag of pTags) {
        if (currentTags.has(tag)) score += 3;
      }

      // Keyword overlap from title + slug + excerpt
      const pTokens = tokenize(`${p.title} ${p.slug.replace(/-/g, ' ')} ${p.excerpt || ''}`);
      for (const token of pTokens) {
        if (currentTokens.has(token)) score += 1;
      }

      return { post: p, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ post }) => post);

  return scored;
}

// Adds cta_click tracking to specific in-body links without touching how
// markdown renders. remark-html's default sanitizer (v16, `sanitize: true`)
// strips raw inline <a data-*> HTML written directly in a post's markdown
// source, dropping the tag entirely and leaving only its text, so tracking
// attributes can't be authored in posts/*.md. Instead, target the exact
// `<a href="...">text</a>` string remark-html emits for a plain markdown
// link and inject data-cta-source/data-cta-destination onto it here, after
// sanitization has already run. TrackedBlogContent's delegated click handler
// (components/TrackedBlogContent.tsx) reads these attributes at click time.
// Keyed by slug so this never touches other posts' links.
const INLINE_CTA_TRACKING: Record<string, { href: string; text: string; ctaDestination: string }[]> = {
  'welcome-letter-to-parents-from-teacher': [
    { href: '/back-to-school-toolkit', text: 'Welcome Letter Generator', ctaDestination: 'toolkit-inline-intro' },
    { href: '/back-to-school-toolkit', text: 'Welcome Letter Generator', ctaDestination: 'toolkit-inline-cta' },
  ],
  'short-welcome-message-to-parents-from-teacher': [
    { href: '/back-to-school-toolkit', text: 'Welcome Letter Generator', ctaDestination: 'toolkit-inline' },
    { href: 'https://app.getshorthandapp.com?demo=true', text: 'Try ShortHand free', ctaDestination: 'body-end-demo' },
  ],
  'teacher-introduction-letter-to-parents': [
    { href: 'https://app.getshorthandapp.com?demo=true', text: 'Try ShortHand free', ctaDestination: 'body-end-demo' },
    { href: '/back-to-school-toolkit', text: 'Welcome Letter Generator', ctaDestination: 'toolkit-inline' },
  ],
};

export function addInlineCtaTracking(contentHtml: string, slug: string): string {
  const targets = INLINE_CTA_TRACKING[slug];
  if (!targets) return contentHtml;

  let html = contentHtml;
  for (const { href, text, ctaDestination } of targets) {
    // Replace only the first remaining match so a repeated href+text pair
    // (e.g. two separate "Welcome Letter Generator" links) is tracked once
    // per list entry, in document order, rather than both at once.
    const plain = `<a href="${href}">${text}</a>`;
    const tracked = `<a href="${href}" data-cta-source="${slug}" data-cta-destination="${ctaDestination}">${text}</a>`;
    html = html.replace(plain, tracked);
  }
  return html;
}

export async function getPost(slug: string): Promise<Post> {
  const raw = fs.readFileSync(path.join(postsDir, `${slug}.md`), 'utf8');
  const { data, content } = matter(raw);
  const processed = await remark().use(remarkGfm).use(html).process(content);
  const contentHtml = addInlineCtaTracking(
    processed.toString()
      .replace(/<table>/g, '<div class="table-wrapper"><table>')
      .replace(/<\/table>/g, '</table></div>'),
    slug
  );
  return { slug, ...normalizePostData(data), contentHtml } as Post;
}
