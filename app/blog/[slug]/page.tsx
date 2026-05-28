import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AnimatedLogo from '../../../components/AnimatedLogo';
import { getAllPosts, getPost } from '../../../lib/posts';

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const posts = getAllPosts();
  const meta = posts.find((p) => p.slug === slug);
  if (!meta) return {};
  return {
    title: `${meta.title} — ShortHand Blog`,
    description: meta.excerpt,
    openGraph: {
      title: `${meta.title} — ShortHand Blog`,
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

        <div style={{
          marginTop: '3rem',
          padding: '1.75rem',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          textAlign: 'center',
        }}>
          <p style={{ marginBottom: '1rem', color: 'var(--text-dim)' }}>Ready to stop drowning in paperwork?</p>
          <Link href="/install" className="btn-primary" style={{ display: 'inline-block' }}>
            Try ShortHand Free →
          </Link>
        </div>
      </article>

      <footer>
        <div className="footer-logo">ShortHand</div>
        <div className="footer-tagline">Built by a teacher, for teachers.</div>
        <a href="mailto:hello@getshorthandapp.com" className="footer-email">hello@getshorthandapp.com</a>
        <div className="footer-copy">© 2026 ShortHand. All rights reserved. · <a href="/privacy" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Privacy Policy</a></div>
      </footer>
    </>
  );
}
