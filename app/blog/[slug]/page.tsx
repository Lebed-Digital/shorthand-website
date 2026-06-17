import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AnimatedLogo from '../../../components/AnimatedLogo';
import { getAllPosts, getPost, getRelatedPosts } from '../../../lib/posts';

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const posts = getAllPosts();
  const meta = posts.find((p) => p.slug === slug);
  if (!meta) return {};
  return {
    title: `${meta.title} | ShortHand Blog`,
    description: meta.excerpt,
    openGraph: {
      title: `${meta.title} | ShortHand Blog`,
      description: meta.excerpt,
      url: `https://getshorthandapp.com/blog/${slug}`,
      type: 'article',
    },
    alternates: { canonical: `https://getshorthandapp.com/blog/${slug}` },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post;
  try {
    post = await getPost(slug);
  } catch {
    notFound();
  }

  const allPosts = getAllPosts();
  const relatedPosts = getRelatedPosts(slug, allPosts);

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": `${post.date}T00:00:00+00:00`,
    "dateModified": `${post.date}T00:00:00+00:00`,
    "author": {
      "@type": "Person",
      "name": "Gregory Lebed",
      "jobTitle": "3rd Grade Teacher",
      "url": "https://getshorthandapp.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ShortHand",
      "logo": { "@type": "ImageObject", "url": "https://getshorthandapp.com/icon.png" }
    },
    "url": `https://getshorthandapp.com/blog/${slug}`,
    "mainEntityOfPage": `https://getshorthandapp.com/blog/${slug}`
  };

  const faqSchema = post.faq && post.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faq.map((item: { q: string; a: string }) => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": { "@type": "Answer", "text": item.a }
    }))
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <div className="glow-field" aria-hidden>
        <span className="g1" /><span className="g2" /><span className="g3" />
        <span className="g4" /><span className="g5" />
      </div>

      <nav>
        <div className="nav-inner">
          <div className="nav-left">
            <AnimatedLogo />
          </div>
          <div className="nav-links">
            <Link href="/#features" className="nav-link">Features</Link>
            <Link href="/how-it-works" className="nav-link">How It Works</Link>
            <Link href="/blog" className="nav-link">Blog</Link>
          </div>
          <Link href="/install" className="btn-primary">Get ShortHand</Link>
        </div>
      </nav>

      <article style={{ maxWidth: '720px', margin: '0 auto', padding: '6rem 1.5rem 5rem' }}>
        <Link href="/blog" style={{ fontSize: '0.9rem', color: 'var(--text-dim)', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
          ← Back to Blog
        </Link>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {new Date(post.date + 'T12:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} · <Link href="/about" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>{post.author}</Link>
        </div>

        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.75rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '0.5rem' }}>
          {post.title}
        </h1>
        {post.subtitle && (
          <p style={{ fontSize: '1.2rem', color: 'var(--text-dim)', marginBottom: '2.5rem', lineHeight: 1.4 }}>
            {post.subtitle}
          </p>
        )}

        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {post.faq && post.faq.length > 0 && (
          <div style={{ marginTop: '3rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>Frequently Asked Questions</h2>
            {post.faq.map((item: { q: string; a: string }, i: number) => (
              <details key={i} style={{
                marginBottom: '0.75rem',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px',
                overflow: 'hidden',
              }}>
                <summary style={{
                  padding: '1rem 1.25rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: 'rgba(255,255,255,0.03)',
                  listStyle: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  {item.q}
                  <span style={{ fontSize: '1.2rem', marginLeft: '0.5rem', flexShrink: 0 }}>+</span>
                </summary>
                <div style={{ padding: '1rem 1.25rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        )}

        {relatedPosts.length > 0 && (
          <div style={{ marginTop: '3.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-dim)' }}>
              Keep Reading
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {relatedPosts.map((rp) => {
                const wordCount = rp.excerpt ? rp.excerpt.split(/\s+/).length * 8 : 800;
                const readTime = Math.max(3, Math.round(wordCount / 200));
                return (
                  <Link
                    key={rp.slug}
                    href={`/blog/${rp.slug}`}
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    <div className="blog-related-card" style={{
                      padding: '1.25rem',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      height: '100%',
                      transition: 'border-color 0.2s, background 0.2s',
                    }}>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {readTime} min read
                      </p>
                      <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.35, margin: 0 }}>
                        {rp.title}
                      </p>
                      {rp.excerpt && (
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '0.5rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {rp.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div style={{
          marginTop: '3rem',
          padding: '1.75rem',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          textAlign: 'center',
        }}>
          <p style={{ marginBottom: '1rem', color: 'var(--text-dim)' }}>Stop trying to remember everything.</p>
          <a href="https://app.getshorthandapp.com?signup=1" className="btn-primary" style={{ display: 'inline-block' }}>
            Try ShortHand Free →
          </a>
        </div>
      </article>

      <footer>
        <div className="footer-logo">ShortHand</div>
        <div className="footer-tagline">Built by a teacher, for teachers.</div>
        <a href="mailto:info@getshorthandapp.com" className="footer-email">info@getshorthandapp.com</a>
        <div className="footer-copy">© 2026 ShortHand. All rights reserved. · <a href="/privacy" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Privacy Policy</a></div>
      </footer>
    </>
  );
}
