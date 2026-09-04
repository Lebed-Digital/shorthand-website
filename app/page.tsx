'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedLogo from '../components/AnimatedLogo';
import { CalendarDays, Brain, Timer, Menu, X } from 'lucide-react';
import featuredPost from '../posts/featured.json';
import Footer from '../components/Footer';
import { fireCtaClick } from '../lib/gtag';
import { withAttribution } from '../lib/attribution';

const SplineHero = dynamic(() => import('../components/SplineHero'), { ssr: false });

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.lebeddigital.shorthand';

const jobs = [
  {
    slug: 'quick-note',
    title: 'Capture It',
    subtitle: 'Stop relying on memory.',
    desc: 'Document behavior incidents, parent conversations, accommodations, interventions, and classroom observations in seconds while they\'re still fresh.',
    img: '/screenshot1.png',
    imgAlt: 'Quick note screen with behavior tags',
    // crop: show top portion — note text + behavior tags, skip bottom nav
    objectPosition: 'center 15%',
  },
  {
    slug: 'parent-communication-log',
    title: 'Find It',
    subtitle: 'Walk into meetings with the full story.',
    desc: 'See what was discussed, when contact happened, and what still needs follow-up, all organized in one place for conferences, IEP meetings, and admin conversations.',
    img: '/parent-comms-log.png',
    imgAlt: 'Parent communication log showing timestamped contact entries and an urgent follow-up alert',
    objectPosition: 'center top',
  },
  {
    slug: 'ai-reports',
    title: 'Use It',
    subtitle: 'Turn documentation into action.',
    desc: 'Turn the notes you\'ve already logged into a parent-ready draft. Review it, edit if needed, and send it straight from your own email. No parent account, login, or download required.',
    img: '/3.png',
    imgAlt: 'Generated parent report screen',
    objectPosition: 'center top',
  },
];

const btnTap   = { scale: 0.96 };
const btnHover = { scale: 1.04, y: -2 };

export default function Home() {
  const featuresRef      = useRef<HTMLDivElement>(null);
  const statsRef         = useRef<HTMLDivElement>(null);
  const ctaRef           = useRef<HTMLDivElement>(null);
  const creatorRef       = useRef<HTMLDivElement>(null);
  const comingSoonRef    = useRef<HTMLDivElement>(null);

  const [email, setEmail]         = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  function trackCta(label: string, url: string, e?: React.MouseEvent) {
    e?.preventDefault();
    const destination = withAttribution(url, window.location.pathname, window.location.search);
    const navigate = () => { window.location.href = destination; };
    fireCtaClick({
      cta_source: 'homepage',
      cta_destination: label,
      link_url: destination,
      event_callback: navigate,
    });
    setTimeout(navigate, 300);
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'email_signup', {
      event_category: 'engagement',
      event_label: 'keep_me_posted',
    });
    await fetch('https://formspree.io/f/mreopvek', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setSubmitted(true);
  }

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    async function initGSAP() {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Feature cards — staggered slide-up
        if (featuresRef.current) {
          const cards = featuresRef.current.querySelectorAll<HTMLElement>('.feature-card');
          gsap.fromTo(cards,
            { opacity: 0, y: 48, scale: 0.96 },
            {
              opacity: 1, y: 0, scale: 1,
              duration: 0.65, ease: 'power3.out',
              stagger: 0.1,
              scrollTrigger: { trigger: featuresRef.current, start: 'top 80%' },
            }
          );
          const header = featuresRef.current.querySelector<HTMLElement>('.features-header');
          if (header) {
            gsap.fromTo(header,
              { opacity: 0, y: 32 },
              { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
                scrollTrigger: { trigger: header, start: 'top 85%' } }
            );
          }
        }

        // Stats — scale up from slightly small
        if (statsRef.current) {
          const items = statsRef.current.querySelectorAll<HTMLElement>('.stat-item');
          gsap.fromTo(items,
            { opacity: 0, scale: 0.92, y: 24 },
            {
              opacity: 1, scale: 1, y: 0,
              duration: 0.6, ease: 'back.out(1.5)',
              stagger: 0.12,
              scrollTrigger: { trigger: statsRef.current, start: 'top 82%' },
            }
          );
        }

        // Creator — fade + slide up
        if (creatorRef.current) {
          gsap.fromTo(creatorRef.current,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
              scrollTrigger: { trigger: creatorRef.current, start: 'top 82%' } }
          );
        }

        // Coming soon — fade + slide up
        if (comingSoonRef.current) {
          gsap.fromTo(comingSoonRef.current,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
              scrollTrigger: { trigger: comingSoonRef.current, start: 'top 82%' } }
          );
        }

        // CTA — slide up
        if (ctaRef.current) {
          gsap.fromTo(ctaRef.current,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out',
              scrollTrigger: { trigger: ctaRef.current, start: 'top 85%' } }
          );
        }
      });
    }

    initGSAP();

    // Spotlight border — track mouse position per feature card
    const cards = document.querySelectorAll<HTMLElement>('.feature-card');
    const handlers: Array<{ el: HTMLElement; fn: (e: MouseEvent) => void }> = [];
    cards.forEach(card => {
      const fn = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      };
      card.addEventListener('mousemove', fn);
      handlers.push({ el: card, fn });
    });

    return () => {
      ctx?.revert();
      handlers.forEach(({ el, fn }) => el.removeEventListener('mousemove', fn));
    };
  }, []);

  return (
    <>
      <div className="glow-field" aria-hidden>
        <span className="g1" /><span className="g2" /><span className="g3" />
        <span className="g4" /><span className="g5" />
      </div>

      {/* NAV */}
      <nav>
        <div className="nav-inner">
          <div className="nav-left">
            <AnimatedLogo />
          </div>
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="/blog" className="nav-link">Blog</a>
            <a href="/tools" className="nav-link" style={{ color: '#22c55e', fontWeight: 700 }}>Tools</a>
            <a href="/resources" className="nav-link">Resources</a>
            <a href="/privacy" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>🔒 Privacy</a>
          </div>
          <div className="nav-right">
            <motion.a
              href="https://app.getshorthandapp.com"
              className="btn-primary"
              whileHover={btnHover}
              whileTap={btnTap}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              onClick={(e) => trackCta('nav_get_shorthand', 'https://app.getshorthandapp.com', e)}
            >
              Open ShortHand →
            </motion.a>
            <button className="nav-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="nav-mobile-menu" onClick={() => setMenuOpen(false)}>
            <a href="#features" className="nav-mobile-link">Features</a>
            <a href="/blog" className="nav-mobile-link">Blog</a>
            <a href="/privacy" className="nav-mobile-link">🔒 Privacy</a>
            <a href="/terms" className="nav-mobile-link">Terms</a>
            <a href="https://app.getshorthandapp.com" className="nav-mobile-link nav-mobile-cta">Open ShortHand →</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="hero hero--split">
        <div className="hero-canvas"><SplineHero /></div>
        <div className="hero-split-inner">
          <div className="hero-content hero-content--left">
            <div className="hero-eyebrow">K-12 &nbsp;·&nbsp; Works on Any Device &nbsp;·&nbsp; Free to Start</div>
            <h1>Never walk into a parent meeting<br /><em>unprepared again.</em></h1>
            <p className="hero-sub">
              Log a behavior note in 5 seconds. Track patterns over weeks. Walk into any conference, IEP, or admin conversation with the full story, not just what you remember.
            </p>
            <div className="hero-ctas">
              <motion.a
                href="https://app.getshorthandapp.com/?demo=true"
                className="btn-primary"
                whileHover={btnHover}
                whileTap={btnTap}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                onClick={(e) => trackCta('hero_try_free_demo', 'https://app.getshorthandapp.com/?demo=true', e)}
              >
                Try the Free Demo →
              </motion.a>
              <motion.a
                href="#features"
                className="btn-ghost"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={btnTap}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                onClick={(e) => trackCta('hero_see_how_it_works', '#features', e)}
              >
                See How It Works
              </motion.a>
            </div>
            {/* Secondary install option. Android teachers can get the real Play
                listing instead of the Add to Home Screen workaround. */}
            <div className="hero-play-badge">
              <span className="play-badge-label">Android teachers:</span>
              <a
                href={PLAY_STORE_URL}
                onClick={(e) => trackCta('google_play_badge', PLAY_STORE_URL, e)}
              >
                <Image
                  src="/badges/google-play-badge.png"
                  alt="Get it on Google Play"
                  width={162}
                  height={63}
                />
              </a>
            </div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem 1rem',
              marginTop: '1rem',
              fontSize: '0.78rem',
              fontWeight: 500,
              color: 'var(--text-dim)',
              alignItems: 'center',
            }}>
              {['FERPA-conscious', 'COPPA-conscious', 'Guided demo included', 'No credit card required'].map((item, i, arr) => (
                <span key={item} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ color: 'var(--green)', fontSize: '0.7rem' }}>✓</span>
                    {item}
                  </span>
                  {i < arr.length - 1 && <span style={{ color: 'rgba(255,255,255,0.15)', marginLeft: '-0.5rem' }}>·</span>}
                </span>
              ))}
            </div>
          </div>
          <div className="hero-demo-wrap">
            <div style={{ borderRadius: '16px', overflow: 'hidden', width: '315px', aspectRatio: '9/16', position: 'relative', boxShadow: '0 24px 60px rgba(0,0,0,0.35)', background: '#000' }}>
              <video
                src="/hero-video.mp4"
                poster="/hero-video-poster.jpg"
                preload="none"
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', cursor: 'pointer' }}
                onClick={(e) => {
                  const v = e.currentTarget;
                  if (v.paused) { v.play(); setVideoPlaying(true); }
                  else { v.pause(); setVideoPlaying(false); }
                }}
                onEnded={() => setVideoPlaying(false)}
              />
              {!videoPlaying && (
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(0,0,0,0.25)', cursor: 'pointer', pointerEvents: 'none',
                }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.95)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <polygon points="9,7 19,12 9,17" fill="#111" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="hero-scroll">
          <div className="scroll-line" />
        </div>
      </section>

      {/* TESTIMONIAL — DANA */}
      <section style={{ padding: '56px 24px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '2rem 2.75rem',
            position: 'relative',
            textAlign: 'center',
          }}>
            {/* Large quote mark */}
            <div style={{
              fontSize: '4rem',
              lineHeight: 1,
              color: 'var(--accent)',
              opacity: 0.4,
              fontFamily: 'Georgia, serif',
              marginBottom: '-0.5rem',
              userSelect: 'none',
            }}>&ldquo;</div>
            <p style={{
              fontSize: '1.4rem',
              fontStyle: 'italic',
              color: '#fff',
              lineHeight: 1.6,
              fontWeight: 400,
              margin: '0.25rem 0 1.25rem',
            }}>
              The app was quick and easy to learn, even for a not-so-techy teacher like me, and it saves so much time.
            </p>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <div style={{
                width: 'clamp(80px, 10vw, 120px)',
                height: 'clamp(80px, 10vw, 120px)',
                borderRadius: '50%',
                overflow: 'hidden',
                flexShrink: 0,
                border: '3px solid rgba(249,115,22,0.4)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              }}>
                <Image
                  src="/Dana R..png"
                  alt="Dana R., Elementary Teacher"
                  width={120}
                  height={120}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>Dana R.</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Elementary Teacher</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 0 48px' }}>
        <hr style={{ width: '120px', border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: 0 }} />
      </div>

      {/* INTENT STRIP */}
      <section style={{ padding: '0 0 60px' }}>
        <div className="section-inner">
          <p style={{ textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '1.25rem' }}>
            What brings you here?
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.875rem', maxWidth: '860px', margin: '0 auto' }}>
            {[
              { emoji: '✉️', label: 'I need parent email help', href: '/features/parent-emails', track: null },
              { emoji: '🔄', label: "I'm replacing ClassDojo", href: '/classdojo-alternative', track: null },
              { emoji: '📋', label: 'I need behavior documentation', href: '/features/quick-note', track: null },
              { emoji: '🧠', label: 'I keep forgetting what happened', href: 'https://app.getshorthandapp.com?demo=true&source=forgetting', track: 'intent_forgetting_demo' },
            ].map(({ emoji, label, href, track }) => (
              <a
                key={href}
                href={href}
                onClick={track ? (e) => trackCta(track, href, e) : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.09)',
                  background: 'rgba(255,255,255,0.03)',
                  textDecoration: 'none',
                  color: 'var(--text)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  lineHeight: 1.4,
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(249,115,22,0.4)';
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(249,115,22,0.06)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.09)';
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.03)';
                }}
              >
                <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{emoji}</span>
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* JOBS — 3-card problem/solution section */}
      <section id="features" className="features-section">
        <div className="section-inner" ref={featuresRef}>
          <div className="features-header">
            <div className="section-label">What it does</div>
            <h2 className="section-heading">Three things every teacher needs.</h2>
            <p className="section-sub">Capture what happened. Find it when it matters. Turn it into something useful.</p>
          </div>
          <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
            {jobs.map((j) => (
              <motion.div key={j.slug} whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }} style={{ height: '100%' }}>
                <Link href={`/features/${j.slug}`} className="feature-card" style={{ gap: 0 }}>
                  <div style={{
                    marginBottom: '1.75rem',
                    aspectRatio: '3 / 4',
                    width: '100%',
                    position: 'relative',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08)',
                  }}>
                    <Image
                      src={j.img}
                      alt={j.imgAlt}
                      fill
                      style={{ objectFit: 'cover', objectPosition: j.objectPosition }}
                    />
                  </div>
                  <div className="card-title" style={{ fontSize: '1.35rem', marginBottom: '0.3rem' }}>{j.title}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent, #a78bfa)', marginBottom: '0.75rem' }}>{j.subtitle}</div>
                  <p className="card-desc" style={{ fontSize: '0.97rem', lineHeight: 1.65 }}>{j.desc}</p>
                  <span className="card-link" style={{ marginTop: 'auto', paddingTop: '1.25rem' }}>Learn more →</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MORE FEATURES — compact grid linking to secondary feature pages */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="section-inner">
          <p style={{ textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '1.25rem' }}>
            More ways ShortHand helps
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.875rem', maxWidth: '920px', margin: '0 auto' }}>
            {[
              { emoji: '🟢', title: 'Never Miss a Student', desc: 'Color-coded alerts for who needs a check-in.', href: '/features/behavior-tracking' },
              { emoji: '📥', title: 'Import Your Class Roster', desc: 'Paste your whole class list and ShortHand sorts it automatically.', href: '/features/import-roster' },
              { emoji: '✉️', title: 'Parent Emails', desc: 'Turn notes into professional messages instantly.', href: '/features/parent-emails' },
              { emoji: '🗂️', title: 'Accommodations at a Glance', desc: 'Every student\'s IEP, 504, and classroom accommodations, in one place.', href: '/features/accommodations' },
              { emoji: '🔍', title: 'Ask ShortHand', desc: 'Ask a question like "Who needs support this month?" and get an answer pulled straight from your own logged notes.', href: '/features/ask-shorthand' },
              { emoji: '🗒️', title: 'Meeting Prep Report', desc: 'Pull a student\'s notes, parent communication, goals, and accommodations together before a meeting, with a short AI summary of key themes.', href: '/features/meeting-prep-report' },
              { emoji: '🎯', title: 'Student Goal Tracking', desc: 'Set AI-suggested goals for a student and track progress from Planted to Bloomed.', href: 'https://app.getshorthandapp.com' },
              { emoji: '🧠', title: 'SEL Micro-Lessons', desc: 'AI-generated 15-minute Social-Emotional Learning plans based on your class\'s logged patterns.', href: 'https://app.getshorthandapp.com' },
              { emoji: '🔄', title: 'Specials Rotation', desc: 'Set your school\'s rotation once and always know what\'s today: Art, Gym, Music, and more.', href: 'https://app.getshorthandapp.com' },
            ].map(({ emoji, title, desc, href }) => (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  padding: '1.25rem 1.25rem 1.5rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.09)',
                  background: 'rgba(255,255,255,0.03)',
                  textDecoration: 'none',
                  color: 'var(--text)',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(249,115,22,0.4)';
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(249,115,22,0.06)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.09)';
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.03)';
                }}
              >
                <span style={{ fontSize: '1.4rem' }}>{emoji}</span>
                <span style={{ fontSize: '1rem', fontWeight: 600 }}>{title}</span>
                <span style={{ fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--text-dim)' }}>{desc}</span>
                {href.startsWith('http') && (
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent, #a78bfa)', marginTop: '0.25rem' }}>Open ShortHand →</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        <div className="section-inner">
          <div className="stats-inner" ref={statsRef}>
            <div className="stat-item">
              <div className="stat-number"><span>&lt; 5</span> sec</div>
              <div className="stat-label">to log a note</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">Any <span>device</span></div>
              <div className="stat-label">phone, tablet, or computer</div>
            </div>
            <div className="stat-item">
              <div className="stat-number"><span>Zero</span> install</div>
              <div className="stat-label">no app store required</div>
            </div>
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section style={{ padding: '80px 0' }}>
        <div className="section-inner">
          <div className="section-label" style={{ marginBottom: '1rem' }}>Sound familiar?</div>
          <h2 className="section-heading" style={{ marginBottom: '2.5rem' }}>Before &amp; After<br /><em>ShortHand.</em></h2>
          <div className="before-after-grid">
            <div className="before-card">
              <div className="ba-label">Before</div>
              {[
                'Scraps of paper shoved in a pocket',
                'Forgotten parent conversations',
                '3 hours of SGO data entry on a Sunday',
                '"Which students haven\'t I documented lately?"',
                'Rewriting the same details for emails, reports, and meetings',
              ].map(item => (
                <div key={item} className="ba-item ba-item--before">
                  <span className="ba-icon">✗</span> {item}
                </div>
              ))}
            </div>
            <div className="after-card">
              <div className="ba-label">After</div>
              {[
                'Tap, speak, saved. In 5 seconds.',
                'A full parent communication log with follow-ups surfaced',
                'Reports generated while you drink coffee',
                'Red rings show who may be slipping through',
                'Capture it once. Reuse it for emails, reports, and meeting notes.',
              ].map(item => (
                <div key={item} className="ba-item ba-item--after">
                  <span className="ba-icon">✓</span> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DEMO / FREE / PRO */}
      <section className="plans-section" aria-labelledby="plans-heading">
        <div className="section-inner">
          <div className="section-label">Getting started</div>
          <h2 id="plans-heading" className="section-heading">Demo, Free, and <em>Pro.</em></h2>
          <p className="section-sub">Try it first. Use it free. Upgrade only if you want to.</p>
          <div className="plans-grid">
            <div className="plan-card">
              <div className="plan-card-kicker">No account</div>
              <h3 className="plan-card-title">Guided demo</h3>
              <p className="plan-card-body">Open ShortHand with sample students and click through the app. No account needed.</p>
            </div>
            <div className="plan-card">
              <div className="plan-card-kicker">Free</div>
              <h3 className="plan-card-title">Your classroom</h3>
              <p className="plan-card-body">Create a free account to use ShortHand with your own class. Core documentation stays free.</p>
            </div>
            <div className="plan-card plan-card--pro">
              <div className="plan-card-kicker">Optional</div>
              <h3 className="plan-card-title">Pro</h3>
              <p className="plan-card-body">$4.99/month if you want extras like Ask ShortHand and Meeting Prep reports. New Pro users get a 30-day trial, no credit card.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Promise */}
      <section className="privacy-section">
        <div className="section-inner">
          <div className="section-label">Data & Privacy</div>
          <h2 className="section-heading">Our Privacy Promise<br /><em>(Teacher-to-Teacher)</em></h2>
          <p className="section-sub">You're trusting me with notes about real kids. Here's exactly how I protect that.</p>
          <div className="privacy-grid">
            {[
              { icon: '🔒', title: 'Bank-Level Encryption', desc: 'All student data is stored with AES-256 encryption in a SOC 2 Type II certified data center, the same standard banks and hospitals use. Data in transit is protected by SSL/TLS.' },
              { icon: '🚫', title: 'No Data Selling. Ever.', desc: "I'm a teacher, not a data broker. Your notes and student information are never sold, shared, or used for advertising. Period." },
              { icon: '👤', title: 'The "First Name" Rule', desc: "The app doesn't require full legal names or student IDs. You can use initials or nicknames to keep your records even more private." },
              { icon: '🗑️', title: 'You Own the Data', desc: "If you decide to stop using ShortHand, you can delete your account and every single note instantly. We don't keep a copy of your notes or student information." },
              { icon: '🔐', title: 'Smart and Private', desc: 'ShortHand only reads your notes when you ask it to write a report. It doesn\'t watch you while you work.' },
            ].map((item) => (
              <div key={item.title} className="privacy-card">
                <div className="privacy-icon">{item.icon}</div>
                <div className="privacy-title">{item.title}</div>
                <p className="privacy-desc">{item.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/privacy" className="btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              🔒 Read the Full Privacy Policy →
            </Link>
          </div>
        </div>
      </section>

      {/* CREATOR */}
      <section className="creator-section">
        <div className="section-inner">
          <div ref={creatorRef} className="creator-card">
            <div className="creator-top">
              <Image src="/creator.jpg" alt="Gregory, creator of ShortHand" className="creator-photo" width={200} height={260} priority />
              <div>
                <div className="creator-eyebrow">BUILT BY A TEACHER. FOR TEACHERS.</div>
                <h2 className="creator-heading">A Message from the Creator</h2>
              </div>
            </div>
            <p className="creator-body" style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text)' }}>
              I didn&apos;t build this app to give you more work. I built it because I was tired of
              drowning in paperwork while trying to keep my head above water.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', margin: '1rem 0 1.25rem' }}>
              {['20+ Years K–8 Experience', 'Former RBT', 'Active 3rd Grade Teacher'].map(badge => (
                <span key={badge} style={{
                  background: 'rgba(167,139,250,0.12)',
                  border: '1px solid rgba(167,139,250,0.3)',
                  color: 'var(--accent, #a78bfa)',
                  borderRadius: '999px',
                  padding: '0.3rem 0.9rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                }}>
                  {badge}
                </span>
              ))}
            </div>
            <p className="creator-body">
              I have spent over 20 years in the classroom. Before I became a 3rd grade teacher,
              I worked as a one-to-one aide and a Registered Behavior Technician. I know exactly
              how loud, fast, and overwhelming a school day can be. This tool was created
              with love to assist my fellow teachers who are looking for a better way to track
              progress and bridge the gap between school and home.
            </p>
            <blockquote className="creator-quote">
              &ldquo;Good data shouldn&apos;t be a chore. It should be the bridge that connects a
              teacher&apos;s observation to a parent&apos;s understanding.&rdquo;
            </blockquote>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '80px 0' }}>
        <div className="section-inner">
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <div className="section-label" style={{ marginBottom: '0.75rem' }}>Common Questions</div>
            <h2 className="section-heading" style={{ marginBottom: '2.5rem' }}>ShortHand FAQ: <em>Everything you need to know.</em></h2>
            {[
              {
                q: 'Is student data safe?',
                a: 'Yes. ShortHand was built by a teacher, for teachers. We use enterprise-grade encryption and Row Level Security so only you have access to your classroom data. No selling data, no surveillance, no sharing with third parties. AI processing is handled by providers who are contractually prohibited from using your data for anything beyond providing the service. Just your notes, locked to your account.',
              },
              {
                q: 'Will this add to my workload?',
                a: 'No. If you can send a text, you can use ShortHand. Logging a note takes about 2 seconds. It saves you hours of drafting emails, writing IEP updates, and trying to remember what happened three weeks ago.',
              },
              {
                q: 'Do I need to spend hours setting this up?',
                a: 'No. You can import your roster from Google Classroom or a spreadsheet in minutes. There is no manual to read. Just open the app and start logging.',
              },
              {
                q: 'Can my whole grade level or school use this?',
                a: 'Absolutely. ShortHand makes grade-level collaboration and transition meetings much smoother. If your principal has questions about privacy or implementation, have them reach out directly.',
              },
              {
                q: 'What is ShortHand?',
                a: 'ShortHand is a behavior and parent-communication tool built for K-12 teachers. Log what happened in seconds, then turn those notes into parent emails, progress reports, and meeting-ready summaries whenever you need them.',
              },
              {
                q: 'Do I need to download anything?',
                a: 'No. ShortHand is a Progressive Web App (PWA). It works in your browser on any device. You can add it to your home screen for a native app feel, but there\'s nothing to download from an app store.',
              },
              {
                q: 'How does ShortHand help with parent communication?',
                a: 'ShortHand keeps your parent communication history organized in one place, including dates, details, and follow-ups. When you need to reach out, it can turn an existing note into a parent-ready draft. You review it, make any changes, and send it through your own email.',
              },
              {
                q: 'Does ShortHand alert me if I haven\'t checked in on a student?',
                a: 'Yes. Color-coded status rings glow red when a student hasn\'t been logged in 16 or more days, amber at 9 to 15 days, and green if you\'ve logged in the last 8 days. No student quietly slips through the cracks.',
              },
              {
                q: 'Is ShortHand free to use?',
                a: 'Yes. Try the guided demo with no account. Create a free account to use ShortHand with your own class. Pro is optional at $4.99/month, and new Pro users get a 30-day trial with no credit card.',
              },
            ].map(({ q, a }) => (
              <details key={q} style={{
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                padding: '1.25rem 0',
              }}>
                <summary style={{
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  cursor: 'pointer',
                  color: 'var(--text)',
                  listStyle: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                }}>
                  {q}
                  <span style={{ color: 'var(--accent, #a78bfa)', flexShrink: 0, fontSize: '1.2rem' }}>+</span>
                </summary>
                <p style={{ marginTop: '0.75rem', color: 'var(--text-dim)', lineHeight: 1.7, fontSize: '0.97rem' }}>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FROM THE BLOG */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="section-inner">
          <div className="section-label" style={{ marginBottom: '1.25rem' }}>From the Blog</div>
          <Link href={`/blog/${featuredPost.slug}`} className="blog-card-link" style={{ maxWidth: '680px' }}>
            <div className="blog-card" style={{ padding: '1.75rem 2rem' }}>
              <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.35rem', color: 'var(--text)' }}>
                {featuredPost.title}
              </div>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
                {featuredPost.subtitle}
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: 1.6, margin: '0 0 1rem' }}>
                {featuredPost.excerpt}
              </p>
              <span style={{ fontSize: '0.9rem', color: 'var(--accent, #a78bfa)' }}>Read the post →</span>
            </div>
          </Link>
        </div>
      </section>

      {/* MORE INSIDE */}
      <section className="coming-soon-section">
        <div className="section-inner">
          <div ref={comingSoonRef} className="coming-soon-inner">
            <div className="section-label">Always Improving</div>
            <h2 className="section-heading">ShortHand keeps<br /><em>getting better.</em></h2>
            <p className="coming-soon-body">
              New features ship regularly, built from real classroom experience and
              feedback from teachers actually using it.
            </p>
            <div className="email-form-wrap">
              <p className="email-form-label">Want to hear when something new lands? I&apos;ll only reach out when it&apos;s worth your time.</p>
              {submitted ? (
                <p className="email-submitted">✓ You&apos;re on the list. I&apos;ll be in touch!</p>
              ) : (
                <form className="email-form" onSubmit={handleEmailSubmit}>
                  <input
                    className="email-input"
                    type="email"
                    required
                    placeholder="Type your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <motion.button
                    type="submit"
                    className="btn-primary"
                    whileHover={btnHover}
                    whileTap={btnTap}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    Keep Me Posted →
                  </motion.button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* WHY MY PERSPECTIVE */}
      <section className="perspective-section">
        <div className="section-inner">
          <h2 className="perspective-heading">Why My Perspective Matters</h2>
          <div className="perspective-grid">
            <div className="perspective-card perspective-card--accent">
              <div className="perspective-icon"><CalendarDays size={28} strokeWidth={1.75} /></div>
              <div className="perspective-title">20+ Years of Experience</div>
              <p className="perspective-desc">I&apos;ve seen every classroom trend and every type of paperwork. This app is the solution to problems that actually exist in a real school.</p>
            </div>
            <div className="perspective-card">
              <div className="perspective-icon"><Brain size={28} strokeWidth={1.75} /></div>
              <div className="perspective-title">RBT &amp; Aide Background</div>
              <p className="perspective-desc">My experience in behavior intervention means this app captures the nuances of student behavior that standard gradebooks often miss.</p>
            </div>
            <div className="perspective-card">
              <div className="perspective-icon"><Timer size={28} strokeWidth={1.75} /></div>
              <div className="perspective-title">Classroom Reality</div>
              <p className="perspective-desc">I know you don&apos;t have ten minutes to log a note. That&apos;s why every feature in this app is built to be finished in seconds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="section-inner">
          <div ref={ctaRef} className="cta-layout">
            <div className="cta-text">
              <div className="section-label">Get started</div>
              <h2 className="cta-heading">Try the guided demo.<br />No account needed.</h2>
              <p className="cta-sub">
                Catch problems before they become calls home. Open the demo in your browser, then create a free account when you want to use ShortHand with your class. Pro is optional.
              </p>
              <div className="cta-btns">
                <motion.a
                  href="https://app.getshorthandapp.com/?demo=true"
                  className="btn-primary btn-primary--lg"
                  whileHover={btnHover}
                  whileTap={btnTap}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  onClick={(e) => trackCta('cta_get_shorthand', 'https://app.getshorthandapp.com/?demo=true', e)}
                >
                  Open ShortHand →
                </motion.a>
                <a
                  href={PLAY_STORE_URL}
                  className="cta-play-badge"
                  onClick={(e) => trackCta('google_play_badge', PLAY_STORE_URL, e)}
                >
                  <Image
                    src="/badges/google-play-badge.png"
                    alt="Get it on Google Play"
                    width={180}
                    height={70}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog links — internal linking for SEO */}
      <section style={{ padding: '3rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div className="section-label" style={{ marginBottom: '1rem' }}>From the Blog</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <Link href="/blog/how-to-document-parent-contact-as-a-teacher" style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none', display: 'block' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.35rem', lineHeight: 1.4 }}>How to Document Parent Contact as a Teacher (So You're Always Covered)</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Read more →</div>
            </Link>
            <Link href="/blog/how-to-document-parent-contact-for-iep" style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none', display: 'block' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.35rem', lineHeight: 1.4 }}>How to Document Parent Contact for IEP Students (What the Law Actually Requires)</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Read more →</div>
            </Link>
            <Link href="/blog/what-to-do-when-parents-dont-respond-to-calls" style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none', display: 'block' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.35rem', lineHeight: 1.4 }}>What to Do When Parents Don't Respond to Your Calls or Emails</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Read more →</div>
            </Link>
            <Link href="/blog/what-to-do-when-parent-says-you-never-called" style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none', display: 'block' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.35rem', lineHeight: 1.4 }}>What to Do When a Parent Says You Never Called Them</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Read more →</div>
            </Link>
            <Link href="/blog/best-parent-communication-apps-for-documentation-2026" style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none', display: 'block' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.35rem', lineHeight: 1.4 }}>Best Parent Teacher Communication Apps for Documentation (2026)</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Read more →</div>
            </Link>
            <Link href="/blog/parent-phone-call-script" style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none', display: 'block' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.35rem', lineHeight: 1.4 }}>The Ultimate Parent Phone Call Script for Teachers</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Read more →</div>
            </Link>
            <Link href="/blog/best-classdojo-alternatives-2026" style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none', display: 'block' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.35rem', lineHeight: 1.4 }}>Best ClassDojo Alternatives in 2026 (Ranked by Real Teachers)</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Read more →</div>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </>
  );
}
