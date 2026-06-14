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
  author: string;
  excerpt: string;
  tags?: string[];
  relatedPosts?: string[];
  faq?: { q: string; a: string }[];
}

export interface Post extends PostMeta {
  contentHtml: string;
}

export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));
  return files
    .map((file) => {
      const slug = file.replace(/\.md$/, '');
      const raw = fs.readFileSync(path.join(postsDir, file), 'utf8');
      const { data } = matter(raw);
      return { slug, ...data } as PostMeta;
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

export async function getPost(slug: string): Promise<Post> {
  const raw = fs.readFileSync(path.join(postsDir, `${slug}.md`), 'utf8');
  const { data, content } = matter(raw);
  const processed = await remark().use(remarkGfm).use(html).process(content);
  const contentHtml = processed.toString()
    .replace(/<table>/g, '<div class="table-wrapper"><table>')
    .replace(/<\/table>/g, '</table></div>');
  return { slug, ...data, contentHtml } as Post;
}
