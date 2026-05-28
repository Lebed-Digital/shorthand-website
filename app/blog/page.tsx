import type { Metadata } from 'next';
import Link from 'next/link';
import AnimatedLogo from '../../components/AnimatedLogo';
import { getAllPosts } from '../../lib/posts';

export const metadata: Metadata = {
  title: 'Blog — ShortHand',
  description: 'Teaching tips, classroom management strategies, and honest stories from a K-12 teacher who built his own productivity app.',
  openGraph: {
    title: 'Blog — ShortHand',
    description: 'Teaching tips, classroom management strategies, and honest stories from a K-12 teacher who built his own productivity app.',
    url: 'https://getshorthandapp.com/blog',
    type: 'website',
  },
  alternates: { canonical: 'https://getshorthandapp.com/blog' },
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <>
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

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>
        <div className="section-label" style={{ marginBottom: '0.75rem' }}>From the Classroom</div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '0.5rem' }}>
          The ShortHand <em>Blog</em>
        </h1>
        <p style={{ color: 'var(--text-dim)', marginBottom: '3rem', fontSize: '1.1rem' }}>
          Real stories from a teacher who got tired of the paperwork and built something about it.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card-link">
              <article className="blog-card">
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {new Date(post.date + 'T12:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} · {post.author}
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text)' }}>
                  {post.title}
                </h2>
                {post.subtitle && (
                  <div style={{ fontSize: '1rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>{post.subtitle}</div>
                )}
                <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>{post.excerpt}</p>
                <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--accent, #a78bfa)' }}>Read more →</div>
              </article>
            </Link>
          ))}
        </div>
      </div>

      <footer>
        <div className="footer-logo">ShortHand</div>
        <div className="footer-tagline">Built by a teacher, for teachers.</div>
        <a href="mailto:hello@getshorthandapp.com" className="footer-email">hello@getshorthandapp.com</a>
        <div className="footer-copy">© 2026 ShortHand. All rights reserved. · <a href="/privacy" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Privacy Policy</a></div>
      </footer>
    </>
  );
}
