import type { MetadataRoute } from 'next';
import { getAllPosts } from '../lib/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://getshorthandapp.com';
  const now = new Date();

  const blogPosts = getAllPosts().map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date.includes('T') ? post.date : post.date + 'T12:00:00'),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/how-it-works`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/install`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/features/quick-note`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/features/behavior-tracking`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/features/ai-reports`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/features/class-insights`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/features/parent-emails`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/features/parent-communication-log`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/features/attendance`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/classdojo-alternative`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/free-tool`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/tools/parent-communication-log`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/resources`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    ...blogPosts,
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/dpa`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
  ];
}
