import Image from 'next/image';
import Link from 'next/link';
import TrackedLink from '../../components/TrackedLink';
import FeatureVideo from '../../components/FeatureVideo';
import styles from './page.module.css';
import QuickGridDemo from '../../components/QuickGridDemo';
import ScrollMotion from './ScrollMotion';
import { features } from '../../components/FeatureNav';

// No metadata of its own: proxy.ts serves this page at '/' to visitors in the
// homepage experiment, so it inherits the homepage's title, description and
// canonical from app/layout.tsx. A noindex here would reach the real homepage.

const demo = 'https://app.getshorthandapp.com/?demo=true';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.lebeddigital.shorthand';
const APP_STORE_URL = 'https://apps.apple.com/us/app/shorthand-for-teachers/id6811725040';

// Copied verbatim from the homepage FAQ (app/page.tsx), so both variants make the same claims.
const FAQ = [
  {
    q: 'Is student data safe?',
    a: 'Yes. ShortHand was built by a teacher, for teachers. We use enterprise-grade encryption and Row Level Security so only you have access to your classroom data. No selling data, no advertising, no surveillance. We use a limited set of service providers to operate ShortHand, and our Privacy Policy explains the providers that handle account, student, payment, analytics, and AI data. AI features are processed by OpenAI, with Groq as a backup. Both are bound by data processing terms, and neither uses your data to train its models. Just your notes, locked to your account.',
  },
  {
    q: 'Will this add to my workload?',
    a: 'No. If you can send a text, you can use ShortHand. Logging a note takes about 2 seconds. It saves you hours of drafting emails, writing IEP updates, and trying to remember what happened three weeks ago.',
  },
  {
    q: 'Do I need to download anything?',
    a: 'No. ShortHand works in your browser on any device, so there\'s nothing you have to install. If you prefer a regular app, you can get ShortHand from the App Store on iPhone or from Google Play on Android.',
  },
  {
    q: 'Is ShortHand free to use?',
    a: 'Yes. Try the demo with sample students, no account needed. Create a free account to use ShortHand with your own class. Pro is optional at $4.99/month, and new Pro users get a 30-day trial with no credit card.',
  },
];

export default function ModernPreview() {
  return <div className={styles.page}>
    <nav className={styles.nav} aria-label="Main navigation">
      <Link href="/" className={styles.logo}><Image src="/branding/shorthand/sh-teachers-icon.png" alt="" width={40} height={40} priority style={{ borderRadius: 9 }} /> ShortHand</Link>
      <div className={styles.links}><a href="#features">Features</a><a href="#walkthrough">Walkthrough</a><Link href="/tools">Free tools</Link><Link href="/blog">Blog</Link></div>
      <a href="https://app.getshorthandapp.com">Sign in ↗</a>
    </nav>
    <ScrollMotion><main>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}><span /> K-12 · WORKS ON ANY DEVICE · FREE TO START</div>
          <h1>Never walk into a parent meeting <em>unprepared again.</em></h1>
          <p>Log a behavior note in a few taps. Track patterns over weeks. Walk into any conference, IEP, or admin conversation with the full story, not just what you remember.</p>
          <div className={styles.actions}><TrackedLink href={demo} label="hero_try_demo" className={styles.button}>Try the free demo <span>↗</span></TrackedLink><a href="#walkthrough">See how it works <span>↓</span></a></div>
          <ul className={styles.checks}><li>Use initials or nicknames</li><li>No-signup demo</li><li>No credit card required</li></ul>
        </div>
        <div className={`${styles.heroDemo} ${styles.demo}`}>
          <span className={`${styles.float} ${styles.floatA}`} aria-hidden="true"><b>✓</b> Note saved</span>
          <span className={`${styles.float} ${styles.floatB}`} aria-hidden="true"><b>✉</b> Parent email drafted</span>
          <QuickGridDemo />
        </div>
        <div className={styles.badges}>
          <TrackedLink href={APP_STORE_URL} label="app_store_badge"><Image src="/badges/app-store-badge.svg" alt="Download on the App Store" width={126} height={42} unoptimized /></TrackedLink>
          <TrackedLink href={PLAY_STORE_URL} label="google_play_badge"><Image src="/badges/google-play-badge.png" alt="Get it on Google Play" width={162} height={63} /></TrackedLink>
        </div>
      </section>
      <section id="features" className={styles.features}>
        <div className={styles.sectionIntro} data-reveal><span className={styles.eyebrow}>FROM A QUICK NOTE TO A CLEAR PICTURE</span><h2>Your memory is doing enough.<br /><em>Give it some backup.</em></h2></div>
        <div className={styles.cards}>
          <article data-reveal><span className={styles.number}>01 / FIND THE THREAD</span><h3>The whole story.<br />In one place.</h3><p>Parent conversations, classroom observations, and follow-ups stay organized for the moments you need them.</p><Link href="/features/parent-communication-log">Explore communication logs ↗</Link><div className={styles.cardImage}><Image src="/parent-comms-log.png" alt="ShortHand parent communication log" width={700} height={700} /></div></article>
          <article data-reveal><span className={styles.number}>02 / MAKE IT USEFUL</span><h3>Good notes become<br />better conversations.</h3><p>Turn the notes you’ve logged into a parent-ready draft. Review, edit, and send from your own email.</p><Link href="/features/ai-reports">Explore reports ↗</Link><div className={styles.cardImage}><Image src="/3.png" alt="ShortHand generated parent report" width={700} height={700} /></div></article>
        </div>
        <div className={styles.allFeatures} data-reveal>
          <span className={styles.eyebrow}>EVERY FEATURE</span>
          <ul>{features.map(f => <li key={f.slug}><Link href={`/features/${f.slug}`}>{f.label} <span>↗</span></Link></li>)}</ul>
        </div>
      </section>
      <section id="walkthrough" data-reveal className={styles.walkthrough}><div><span className={styles.eyebrow}>SEE IT IN ACTION</span><h2>A calmer workflow.<br /><em>Not another chore.</em></h2><p>See how ShortHand fits into the day you already have.</p></div><FeatureVideo videoId="FGeXjIG_c8c" title="ShortHand full walkthrough" wide /></section>
      <section className={styles.faq} data-reveal><span className={styles.eyebrow}>COMMON QUESTIONS</span><h2>What teachers ask <em>first.</em></h2>
        {FAQ.map(({ q, a }) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
      </section>
      <section className={styles.closing} data-reveal><span className={styles.eyebrow}>BUILT BY A TEACHER. FOR YOUR REAL DAY.</span><h2>Let the little things<br /><em>add up to clarity.</em></h2><TrackedLink href={demo} label="bottom_try_demo" className={styles.button}>Try the free demo ↗</TrackedLink><p>Start with the free demo. Keep core documentation free.<br />Optional Pro: $4.99/month, with a 30-day trial and no credit card.</p></section>
    </main></ScrollMotion>
    <footer className={styles.footer}><Link href="/" className={styles.logo}>ShortHand</Link><span>A little less to carry home.</span><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/resources">Resources</Link></div></footer>
  </div>;
}
