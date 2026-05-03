'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedLogo from '../components/AnimatedLogo';
import { Pencil, ClipboardList, Mail, School, BarChart2, CalendarDays, Brain, Timer, Menu, X } from 'lucide-react';
import featuredPost from '../posts/featured.json';
import Footer from '../components/Footer';

const SplineHero = dynamic(() => import('../components/SplineHero'), { ssr: false });
const GlobeCanvas = dynamic(() => import('../components/GlobeCanvas'), { ssr: false });

const features = [
  { slug: 'quick-note',        Icon: Pencil,        title: 'Quick Note',            desc: 'Tap a student, speak or type a note, done in under 5 seconds. Student photos appear right in the suggestions so you\'re always logging the right kid. Voice-to-text, auto-tagging, and smart shortcuts built in.' },
  { slug: 'behavior-tracking', Icon: School,        title: 'Never Miss a Student',  desc: 'Student status rings glow red when you haven\'t logged in 8+ days. Automatic alerts so no one quietly slips through the cracks.' },
  { slug: 'parent-emails',     Icon: Mail,          title: 'AI Parent Messages',    desc: 'Log a behavior note. Tap "draft message." AI writes it instantly — ready to send or edit. No more staring at a blank email. Get parents in the loop fast, before small issues become big ones.' },
  { slug: 'ai-reports',        Icon: ClipboardList, title: 'AI Reports',            desc: 'Turn months of raw notes into polished, parent-ready progress reports in seconds. Quick Note, Standard, or Detailed.' },
  { slug: 'class-insights',    Icon: BarChart2,     title: 'Progress & Insights',   desc: 'View behavior trends over 4 to 52 weeks. Smart trend badges show who\'s improving and who needs attention — at a glance.' },
];

const btnTap   = { scale: 0.96 };
const btnHover = { scale: 1.04, y: -2 };

export default function Home() {
  const featuresRef      = useRef<HTMLDivElement>(null);
  const showcaseRef      = useRef<HTMLDivElement>(null);
  const statsRef         = useRef<HTMLDivElement>(null);
  const ctaRef           = useRef<HTMLDivElement>(null);
  const creatorRef       = useRef<HTMLDivElement>(null);
  const comingSoonRef    = useRef<HTMLDivElement>(null);

  const [email, setEmail]         = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  function trackCta(label: string, url: string, e?: React.MouseEvent) {
    e?.preventDefault();
    const navigate = () => { window.location.href = url; };
    (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'cta_click', {
      event_category: 'engagement',
      event_label: label,
      link_url: url,
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

        // Showcase — phones fan out from center on scroll
        if (showcaseRef.current) {
          const phones = showcaseRef.current.querySelectorAll<HTMLElement>('.showcase-phone');
          // phones order: left-far, left-near, center, right-near, right-far
          const configs = [
            { x: -340, y: 60,  rotate: -18, scale: 0.72 },
            { x: -175, y: 24,  rotate: -9,  scale: 0.84 },
            { x: 0,    y: 0,   rotate: 0,   scale: 1    },
            { x: 175,  y: 24,  rotate: 9,   scale: 0.84 },
            { x: 340,  y: 60,  rotate: 18,  scale: 0.72 },
          ];
          phones.forEach((phone, i) => {
            const cfg = configs[i];
            gsap.fromTo(phone,
              { x: 0, y: 0, rotate: 0, scale: i === 2 ? 1 : 0.6, opacity: i === 2 ? 1 : 0 },
              {
                x: cfg.x, y: cfg.y, rotate: cfg.rotate, scale: cfg.scale, opacity: 1,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: showcaseRef.current,
                  start: 'top 75%',
                  end: 'center 40%',
                  scrub: 0.6,
                },
              }
            );
          });
          // Labels fade in alongside the spread
          const labels = showcaseRef.current.querySelectorAll<HTMLElement>('.showcase-label');
          gsap.fromTo(labels,
            { opacity: 0, y: 12 },
            {
              opacity: 1, y: 0, stagger: 0.08, ease: 'power2.out',
              scrollTrigger: { trigger: showcaseRef.current, start: 'top 65%', end: 'center 40%', scrub: 1 },
            }
          );
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
            <span className="nav-badge">Built by a Teacher</span>
          </div>
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="/how-it-works" className="nav-link">How It Works</a>
            <a href="/blog" className="nav-link">Blog</a>
            <a href="/free-tool" className="nav-link" style={{ color: '#22c55e', fontWeight: 700 }}>Free Tool</a>
            <a href="/privacy" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>🔒 Privacy</a>
            <a href="/terms" className="nav-link">Terms</a>
          </div>
          <div className="nav-right">
            <motion.a
              href="/install"
              className="btn-primary"
              whileHover={btnHover}
              whileTap={btnTap}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              onClick={(e) => trackCta('nav_get_shorthand', '/install', e)}
            >
              Join the Beta
            </motion.a>
            <button className="nav-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="nav-mobile-menu" onClick={() => setMenuOpen(false)}>
            <a href="#features" className="nav-mobile-link">Features</a>
            <a href="/how-it-works" className="nav-mobile-link">How It Works</a>
            <a href="/blog" className="nav-mobile-link">Blog</a>
            <a href="/privacy" className="nav-mobile-link">🔒 Privacy</a>
            <a href="/terms" className="nav-mobile-link">Terms</a>
            <a href="/install" className="nav-mobile-link nav-mobile-cta">Join the Beta →</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="hero hero--split">
        <div className="hero-canvas"><SplineHero /></div>
        <div className="hero-split-inner">
          <div className="hero-content hero-content--left">
            <div className="hero-eyebrow">No App Store &nbsp;·&nbsp; Works on Any Device</div>
            <h1>Stop behavior from spiraling.<br /><em>Parents in the loop in seconds.</em></h1>
            <p style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>
              ShortHand is a behavior tracking app that helps K-12 teachers generate AI progress reports, manage classroom data, and send parent communication in seconds — built by a teacher, for teachers.
            </p>
            <p className="hero-sub">
              The moment something happens, tap a note. ShortHand drafts the parent message for you, so communication happens the same day, not a week later when you finally find the time to write it.
            </p>
            <div className="hero-ctas">
              <motion.a
                href="/install"
                className="btn-primary"
                whileHover={btnHover}
                whileTap={btnTap}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                onClick={(e) => trackCta('hero_get_shorthand', '/install', e)}
              >
                Join the Beta →
              </motion.a>
              <motion.a
                href="/how-it-works"
                className="btn-ghost"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={btnTap}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                onClick={(e) => trackCta('hero_see_how_it_works', '/how-it-works', e)}
              >
                See How It Works
              </motion.a>
            </div>
            <p className="hero-demo-nudge">
              Curious?{' '}
              <a
                href="https://app.getshorthandapp.com?demo=true"
                rel="nofollow"
                onClick={() => (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'cta_click', { event_category: 'engagement', event_label: 'hero_try_demo' })}
              >
                Try a live demo — no sign-up, opens instantly →
              </a>
            </p>
          </div>
          <div className="hero-demo-wrap">
            <div className="hero-phone-mockup">
              <video
                src="/add-note-new.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="hero-demo-video"
                ref={(el) => { if (el) el.playbackRate = 0.75; }}
              />
            </div>
            <p className="hero-demo-caption">Voice-to-text note in under 5 seconds · slowed for clarity</p>
          </div>
        </div>
        <div className="hero-scroll">
          <div className="scroll-line" />
        </div>
      </section>

      {/* SHOWCASE — phones fan out on scroll */}
      <section className="showcase-section">
        <div className="section-inner">
          <div className="showcase-header">
            <div className="section-label">Everything in one place</div>
            <h2 className="section-heading">How ShortHand saves<br /><em>teachers hours every week.</em></h2>
          </div>
          <div className="showcase-stage" ref={showcaseRef}>
            {[
              { src: '/mockup-quicknote.webp',  label: 'Log a note in 5 seconds'      },
              { src: '/mockup-report.webp',     label: 'AI-written parent reports'    },
              { src: '/mockup-grid.webp',       label: 'Your whole class at a glance' },
              { src: '/mockup-insights.webp',   label: 'Track progress over time'     },
              { src: '/mockup-parents.webp',    label: 'Parent communication log'     },
            ].map((item, i) => (
              <div key={i} className={`showcase-phone showcase-phone--${i}`}>
                <Image src={item.src} alt={item.label} width={320} height={650} className="showcase-img" />
                <div className="showcase-label">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="features-section">
        <div className="section-inner" ref={featuresRef}>
          <div className="features-header">
            <div className="section-label">What it does</div>
            <h2 className="section-heading">One app for notes, parent communication,<br /><em>and everything in between.</em></h2>
            <p className="section-sub">Built around the problems teachers actually face every day — not the ones app developers imagine.</p>
          </div>
          <div className="features-grid">
            {features.map((f) => (
              <motion.div key={f.slug} whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }} style={{ height: '100%' }}>
                <Link href={`/features/${f.slug}`} className="feature-card">
                  <div className="card-icon"><f.Icon size={26} strokeWidth={1.75} /></div>
                  <div className="card-title">{f.title}</div>
                  <p className="card-desc">{f.desc}</p>
                  {f.slug === 'quick-note' && (
                    <div className="card-mini-demo">
                      <div className="qn-note-row">
                        <div className="qn-avatar" style={{ borderColor: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.5)' }}>MR</div>
                        <div className="qn-bubble">
                          <span className="qn-tag">#behavior</span> Stayed on task entire period — big improvement
                          <div className="qn-meta">🎤 voice · just now</div>
                        </div>
                      </div>
                      <div className="qn-badge">⚡ logged in 4 sec</div>
                    </div>
                  )}
                  {f.slug === 'behavior-tracking' && (
                    <div className="status-ring-demo">
                      {[
                        { initials: 'AJ', color: '#22c55e', glow: 'rgba(34,197,94,0.5)', label: 'Logged today' },
                        { initials: 'MR', color: '#22c55e', glow: 'rgba(34,197,94,0.5)', label: '3 days ago' },
                        { initials: 'SF', color: '#f97316', glow: 'rgba(249,115,22,0.6)', label: '9 days ago' },
                        { initials: 'TK', color: '#ef4444', glow: 'rgba(239,68,68,0.65)', label: '14 days ago', pulse: true },
                      ].map((s) => (
                        <div key={s.initials} className="status-ring-item">
                          <div className="status-ring-avatar" style={{
                            borderColor: s.color,
                            boxShadow: `0 0 10px ${s.glow}, 0 0 20px ${s.glow}`,
                            animation: s.pulse ? 'ringPulse 2s ease-in-out infinite' : 'none',
                          }}>
                            {s.initials}
                          </div>
                          <span className="status-ring-label">{s.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {f.slug === 'parent-emails' && (
                    <div className="card-mini-demo">
                      <div className="ai-report-row">
                        <div className="ai-report-raw">
                          <span className="ai-label">Your notes</span>
                          "talked back, struggled w/ fractions, better end of week"
                        </div>
                        <div className="ai-arrow">✦</div>
                        <div className="ai-report-polished">
                          <span className="ai-label" style={{ color: '#a78bfa' }}>AI draft</span>
                          Marcus has shown growth in self-regulation and is making steady progress in math.
                        </div>
                      </div>
                    </div>
                  )}
                  {f.slug === 'ai-reports' && (
                    <div className="card-mini-demo">
                      <div className="ai-report-types">
                        {[
                          { label: 'Quick Note', color: '#22c55e', desc: '2 sentences' },
                          { label: 'Standard',   color: '#f97316', desc: '1 paragraph' },
                          { label: 'Detailed',   color: '#a78bfa', desc: 'Full report' },
                        ].map(r => (
                          <div key={r.label} className="ai-type-pill" style={{ borderColor: r.color, boxShadow: `0 0 8px ${r.color}44` }}>
                            <span style={{ color: r.color, fontWeight: 700, fontSize: '0.65rem' }}>{r.label}</span>
                            <span style={{ color: 'var(--text-dim)', fontSize: '0.6rem' }}>{r.desc}</span>
                          </div>
                        ))}
                      </div>
                      <div className="ai-spark-badge">✦ months of notes → 30 seconds</div>
                    </div>
                  )}
                  {f.slug === 'class-insights' && (
                    <div className="card-mini-demo">
                      <div className="insights-bars">
                        {[
                          { label: 'Sep', h: 30, color: '#ef4444' },
                          { label: 'Nov', h: 45, color: '#f97316' },
                          { label: 'Jan', h: 60, color: '#f97316' },
                          { label: 'Mar', h: 82, color: '#22c55e', badge: '↑' },
                        ].map(b => (
                          <div key={b.label} className="insights-bar-col">
                            <div className="insights-bar-wrap">
                              {b.badge && <span className="insights-badge" style={{ color: '#22c55e' }}>{b.badge}</span>}
                              <div className="insights-bar" style={{ height: b.h, background: b.color, boxShadow: `0 0 8px ${b.color}88` }} />
                            </div>
                            <span className="insights-bar-label">{b.label}</span>
                          </div>
                        ))}
                      </div>
                      <div className="ai-spark-badge" style={{ color: '#22c55e' }}>↑ Improving · 52-week view</div>
                    </div>
                  )}
                  {f.slug === 'parent-communication-log' && (
                    <div className="card-mini-demo">
                      <div className="commlog-list">
                        {[
                          { icon: '📞', type: 'Phone call',  detail: 'Discussed behavior',  date: 'Mar 28', color: '#22c55e' },
                          { icon: '✉️', type: 'Email sent',  detail: 'Lunch money',          date: 'Apr 1',  color: '#22c55e' },
                          { icon: '🤝', type: 'IEP meeting', detail: '',                      date: 'Apr 4',  color: '#a78bfa' },
                        ].map(e => (
                          <div key={e.type} className="commlog-row">
                            <span className="commlog-icon">{e.icon}</span>
                            <div style={{ flex: 1 }}>
                              <span className="commlog-type" style={{ color: e.color }}>{e.type}</span>
                              {e.detail && <div className="commlog-detail">{e.detail}</div>}
                            </div>
                            <span className="commlog-date">{e.date}</span>
                          </div>
                        ))}
                      </div>
                      <div className="ai-spark-badge">📋 export ready for IEP</div>
                    </div>
                  )}
                  <span className="card-link">Learn more →</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FREE TOOL BANNER */}
      <section style={{ padding: '0 0 60px' }}>
        <div className="section-inner">
          <div style={{
            background: 'linear-gradient(135deg, rgba(13,148,136,0.15) 0%, rgba(8,145,178,0.15) 100%)',
            border: '1px solid rgba(13,148,136,0.35)',
            borderRadius: '20px',
            padding: '40px 48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            flexWrap: 'wrap',
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2dd4bf', marginBottom: '0.5rem' }}>Free · No sign-up · Works instantly</div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 0.5rem', lineHeight: 1.25 }}>Report Card Comment Generator</h2>
              <p style={{ color: 'var(--text-dim)', margin: 0, fontSize: '0.97rem', maxWidth: '480px', lineHeight: 1.6 }}>
                Pick what&apos;s true for a student, hit generate, and get a polished comment in 10 seconds. Casual or academic tone. No account needed.
              </p>
            </div>
            <motion.a
              href="/free-tool"
              whileHover={btnHover}
              whileTap={btnTap}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #0d9488, #0891b2)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1rem',
                padding: '14px 28px',
                borderRadius: '12px',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 20px rgba(13,148,136,0.4)',
                flexShrink: 0,
              }}
            >
              Try it free →
            </motion.a>
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
                '"Who was I going to follow up with?"',
                'Writing the same report 25 times',
              ].map(item => (
                <div key={item} className="ba-item ba-item--before">
                  <span className="ba-icon">✗</span> {item}
                </div>
              ))}
            </div>
            <div className="after-card">
              <div className="ba-label">After</div>
              {[
                'Tap, speak, saved — in 5 seconds',
                'Full communication log, ready for IEPs',
                'Reports generated while you drink coffee',
                'Red ring alerts you before anyone slips through',
                'One button. Professional email to a parent.',
              ].map(item => (
                <div key={item} className="ba-item ba-item--after">
                  <span className="ba-icon">✓</span> {item}
                </div>
              ))}
            </div>
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
              {['20+ Years K–8 Experience', 'Certified RBT', 'Active 3rd Grade Teacher'].map(badge => (
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
                q: 'What is ShortHand?',
                a: 'ShortHand is a behavior tracking app built for K-12 teachers. It lets you log student notes in under 5 seconds using voice or text, track behavior patterns over time, generate AI-written progress reports, and send parent messages instantly.',
              },
              {
                q: 'Do I need to download anything?',
                a: 'No. ShortHand is a Progressive Web App (PWA) — it works in your browser on any device. You can add it to your home screen for a native app feel, but there\'s nothing to download from an app store.',
              },
              {
                q: 'How does ShortHand help with parent communication?',
                a: 'After you log a behavior note, ShortHand\'s AI drafts a parent-ready message in seconds. You review it, make any tweaks, and send — no staring at a blank email. It also keeps a full communication log for IEP meetings.',
              },
              {
                q: 'Can ShortHand help me spot behavior patterns?',
                a: 'Yes. ShortHand tracks behavior over 4 to 52 weeks and shows visual trend charts for each student. Smart badges highlight who\'s improving and who needs attention — so you\'re not relying on memory.',
              },
              {
                q: 'Does ShortHand alert me if I haven\'t checked in on a student?',
                a: 'Yes. Color-coded status rings glow red when a student hasn\'t been logged in 8 or more days, amber at 5–7 days, and green if you\'ve logged recently. No student quietly slips through the cracks.',
              },
              {
                q: 'Is ShortHand free to use?',
                a: 'ShortHand is currently in beta and free to join. Sign up to get access and be notified when new features are ready.',
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
            <div className="section-label">There&apos;s More Inside</div>
            <h2 className="section-heading">The six features above are just<br /><em>the beginning.</em></h2>
            <p className="coming-soon-body">
              Once you&apos;re in, you&apos;ll find tools that go even deeper — built from real classroom
              experience, for the moments that actually matter.
            </p>
            <div className="coming-soon-grid">
              <div className="coming-soon-card">
                <div className="coming-soon-card-icon">🎯</div>
                <div className="coming-soon-card-title">Student Goal Tracking</div>
                <p className="coming-soon-card-desc">Set AI-suggested goals for individual students and track their growth — from Planted to Bloomed, with every step documented.</p>
              </div>
              <div className="coming-soon-card">
                <div className="coming-soon-card-icon">🔍</div>
                <div className="coming-soon-card-title">Ask Your Notes</div>
                <p className="coming-soon-card-desc">Type a question like &quot;Who was struggling with focus this month?&quot; and get an instant, data-backed answer from your own notes.</p>
              </div>
              <div className="coming-soon-card">
                <div className="coming-soon-card-icon">🧠</div>
                <div className="coming-soon-card-title">SEL Micro-Lessons</div>
                <p className="coming-soon-card-desc">AI generates Social-Emotional Learning plans tailored to the behavior patterns in your specific class — ready to drop into any spare five minutes.</p>
              </div>
              <div className="coming-soon-card">
                <div className="coming-soon-card-icon">🔄</div>
                <div className="coming-soon-card-title">Specials Rotation</div>
                <p className="coming-soon-card-desc">Upload your school&apos;s rotation schedule and ShortHand always knows what&apos;s today — Art, Gym, Music and more, right on your home screen.</p>
              </div>
            </div>
            <div className="email-form-wrap">
              <p className="email-form-label">Want to hear when new tools are ready? I&apos;ll only reach out when something worth your time is available.</p>
              {submitted ? (
                <p className="email-submitted">✓ You&apos;re on the list — I&apos;ll be in touch!</p>
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

      {/* Privacy Promise */}
      <section className="privacy-section">
        <div className="section-inner">
          <div className="section-label">Data & Privacy</div>
          <h2 className="section-heading">Our Privacy Promise<br /><em>(Teacher-to-Teacher)</em></h2>
          <p className="section-sub">You're trusting me with notes about real kids. Here's exactly how I protect that.</p>
          <div className="privacy-grid">
            {[
              { icon: '🔒', title: 'Bank-Level Encryption', desc: 'All student data is stored with AES-256 encryption in a SOC 2 Type II certified data center — the same standard banks and hospitals use. Data in transit is protected by SSL/TLS.' },
              { icon: '🚫', title: 'No Data Selling. Ever.', desc: "I'm a teacher, not a data broker. Your notes and student information are never sold, shared, or used for advertising. Period." },
              { icon: '👤', title: 'The "First Name" Rule', desc: "The app doesn't require full legal names or student IDs. You can use initials or nicknames to keep your records even more private." },
              { icon: '🗑️', title: 'You Own the Data', desc: "If you decide to stop using ShortHand, you can delete your account and every single note instantly. We don't keep a copy." },
              { icon: '🤖', title: 'AI with Boundaries', desc: 'The AI only sees your notes when you ask it to write a report. It doesn\'t watch you while you work.' },
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

      {/* CTA */}
      <section className="cta-section">
        <div className="section-inner">
          <div ref={ctaRef} className="cta-layout">
            <div className="cta-text">
              <div className="section-label">Get started</div>
              <h2 className="cta-heading">Free to try.<br />No sign-up required.</h2>
              <p className="cta-sub">
                ShortHand is completely free. Open it on any device and start using it in minutes — nothing to install from an app store.
              </p>
              <div className="cta-btns">
                <motion.a
                  href="/install"
                  className="btn-primary"
                  whileHover={btnHover}
                  whileTap={btnTap}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  onClick={(e) => trackCta('cta_get_shorthand', '/install', e)}
                >
                  Join the Beta →
                </motion.a>
              </div>
            </div>
            <div className="cta-globe">
              <GlobeCanvas />
            </div>
          </div>
        </div>
      </section>

      {/* SEO / crawler keywords — education technology classification */}
      <section style={{ display: 'none' }} aria-hidden="true">
        <p>ShortHand is an education technology application designed to improve teacher productivity and student progress tracking. Built for K–12 educators, ShortHand supports pedagogy, classroom management, behavior documentation, parent communication, and data-driven instruction. This tool helps teachers track student growth, generate progress reports, and maintain organized records — all in support of positive educational outcomes. ShortHand is a legitimate SaaS product for schools, districts, and individual educators seeking teacher productivity tools and classroom management software.</p>
      </section>
      {/* Blog links — internal linking for SEO */}
      <section style={{ padding: '3rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div className="section-label" style={{ marginBottom: '1rem' }}>From the Blog</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <Link href="/blog/why-teachers-are-switching-from-classdojo-to-shorthand" style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none', display: 'block' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.35rem', lineHeight: 1.4 }}>Why Teachers Are Switching from ClassDojo in 2026</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Read more →</div>
            </Link>
            <Link href="/blog/student-progress-report-comments-for-teachers" style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none', display: 'block' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.35rem', lineHeight: 1.4 }}>Student Progress Report Comments for Teachers</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Read more →</div>
            </Link>
            <Link href="/blog/digital-tools-for-recording-student-incidents" style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none', display: 'block' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.35rem', lineHeight: 1.4 }}>Digital Tools for Recording Student Incidents and Progress</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Read more →</div>
            </Link>
            <Link href="/blog/how-to-simplify-parent-communication" style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none', display: 'block' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.35rem', lineHeight: 1.4 }}>How to Simplify Parent Communication as a Teacher</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Read more →</div>
            </Link>
            <Link href="/blog/best-apps-for-teacher-parent-communication-2026" style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none', display: 'block' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.35rem', lineHeight: 1.4 }}>Best Apps for Teacher-Parent Communication in 2026</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Read more →</div>
            </Link>
            <Link href="/blog/teacher-burnout-solutions-that-actually-work" style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none', display: 'block' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.35rem', lineHeight: 1.4 }}>Teacher Burnout Solutions That Actually Work</div>
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
