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

export async function getPost(slug: string): Promise<Post> {
  const raw = fs.readFileSync(path.join(postsDir, `${slug}.md`), 'utf8');
  const { data, content } = matter(raw);
  const processed = await remark().use(remarkGfm).use(html).process(content);
  return { slug, ...data, contentHtml: processed.toString() } as Post;
}
