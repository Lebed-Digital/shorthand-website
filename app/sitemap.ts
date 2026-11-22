import type { MetadataRoute } from 'next';
import { getAllPosts } from '../lib/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://getshorthandapp.com';
  // Static pages (including /blog) carry no lastModified on purpose. `new Date()` here stamped every page
  // as changed on every build, which teaches Google to ignore lastmod site-wide, including
  // the real dates on blog posts. Only add a date to a static page if it is kept accurate.
  const blogPosts = getAllPosts().map((post) => {
    // Must stay in sync with the dateModified fallback in app/blog/[slug]/page.tsx.
    // If these two disagree, Google gets contradictory freshness signals.
    const modified = post.lastModified ?? post.date;
    return {
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(modified.includes('T') ? modified : modified + 'T12:00:00'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    };
  });

  return [
    { url: base, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/install`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/features/quick-note`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/features/import-roster`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/features/behavior-tracking`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/features/accommodations`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/features/ai-reports`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/features/parent-emails`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/features/parent-communication-log`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/features/ask-shorthand`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/features/student-documentation-report`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/features/meeting-prep-report`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/classdojo-alternative`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/report-card-comment-generator`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/report-card-comment-library`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/back-to-school-toolkit`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/tools/parent-communication-log`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/free-seating-chart-prompt`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/week-at-a-glance`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/chatgpt-teacher-freebies`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/resources`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/press`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/tools`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    ...blogPosts,
    { url: `${base}/privacy`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/delete-account`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/terms`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/dpa`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${base}/for-schools`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/support`, changeFrequency: 'yearly', priority: 0.4 },
  ];
}
