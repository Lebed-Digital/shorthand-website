import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import TrackedLink from '../../components/TrackedLink';
import FeatureVideo from '../../components/FeatureVideo';
import styles from './page.module.css';
import QuickGridDemo from '../../components/QuickGridDemo';
import ScrollMotion from './ScrollMotion';

export const metadata: Metadata = {
  title: 'ShortHand | Modern landing preview',
  robots: { index: false, follow: false },
};

const demo = 'https://app.getshorthandapp.com/?demo=true';

export default function ModernPreview() {
  return <div className={styles.page}>
    <nav className={styles.nav} aria-label="Main navigation">
      <Link href="/" className={styles.logo}><Image src="/branding/shorthand/sh-teachers-icon.png" alt="" width={40} height={40} priority style={{ borderRadius: 9 }} /> ShortHand</Link>
      <div className={styles.links}><a href="#quick-grid">Try it yourself</a><a href="#features">The possibilities</a><Link href="/tools">Free tools</Link><Link href="/blog">For teachers</Link></div>
      <a href="https://app.getshorthandapp.com">Sign in ↗</a>
    </nav>
    <ScrollMotion><main>
      <section className={styles.hero}>
        <div className={styles.eyebrow}><span /> LESS PAPERWORK. MORE PRESENCE.</div>
        <h1>A full classroom.<br />A little more <em>headspace.</em></h1>
        <p>Capture the small moments. See the bigger picture. Walk into your next parent meeting with the full story, already at your fingertips.</p>
        <div className={styles.actions}><TrackedLink href={demo} label="hero_try_demo" className={styles.button}>Try the free demo <span>↗</span></TrackedLink><a href="#walkthrough">Take a closer look <span>↓</span></a></div>
        <small>No account needed. Sample students included.</small>
        <div className={styles.stage} data-reveal>
          <div className={styles.stageHeading}><span>YOUR DAY, A LITTLE LIGHTER</span><span>Built for real classroom life ↗</span></div>
          <div className={styles.product}>
            <div className={styles.productCopy}><span className={styles.pill}>01 / CAPTURE THE MOMENT</span><h2>It happened.<br />It’s recorded.<br /><em>Keep teaching.</em></h2><p>A few taps for a behavior note, a parent conversation, or a small win worth remembering.</p><Link href="/features/quick-note">Meet Quick Note ↗</Link></div>
            <div className={styles.screenshot}><Image src="/quick-grid-note-sheet.jpg" alt="ShortHand Quick Grid with behavior indicators and a Save button" width={760} height={1000} priority /></div>
          </div>
          <div className={styles.stageFoot}><span>Made for K–12 teachers</span><span>Phone, tablet, or laptop</span><span>Free to start</span></div>
        </div>
      </section>
      <section id="quick-grid" className={styles.demo} data-reveal>
        <div className={styles.sectionIntro} data-reveal><span className={styles.eyebrow}>YOUR TURN. JUST A FEW TAPS.</span><h2>Try a quick note.<br /><em>See how easy it feels.</em></h2><p>Tap a sample student, choose an indicator, and save your practice note. Nothing here is saved or sent.</p></div>
        <QuickGridDemo />
      </section>
      <section id="features" className={styles.features}>
        <div className={styles.sectionIntro} data-reveal><span className={styles.eyebrow}>FROM A QUICK NOTE TO A CLEAR PICTURE</span><h2>Your memory is doing enough.<br /><em>Give it some backup.</em></h2></div>
        <div className={styles.cards}>
          <article data-reveal><span className={styles.number}>02 / FIND THE THREAD</span><h3>The whole story.<br />In one place.</h3><p>Parent conversations, classroom observations, and follow-ups stay organized for the moments you need them.</p><Link href="/features/parent-communication-log">Explore communication logs ↗</Link><div className={styles.cardImage}><Image src="/parent-comms-log.png" alt="ShortHand parent communication log" width={700} height={700} /></div></article>
          <article data-reveal><span className={styles.number}>03 / MAKE IT USEFUL</span><h3>Good notes become<br />better conversations.</h3><p>Turn the notes you’ve logged into a parent-ready draft. Review, edit, and send from your own email.</p><Link href="/features/ai-reports">Explore reports ↗</Link><div className={styles.cardImage}><Image src="/3.png" alt="ShortHand generated parent report" width={700} height={700} /></div></article>
        </div>
      </section>
      <section id="walkthrough" data-reveal className={styles.walkthrough}><div><span className={styles.eyebrow}>SEE IT IN ACTION</span><h2>A calmer workflow.<br /><em>Not another chore.</em></h2><p>See how ShortHand fits into the day you already have.</p></div><FeatureVideo videoId="FGeXjIG_c8c" title="ShortHand full walkthrough" wide /></section>
      <section className={styles.closing} data-reveal><span className={styles.eyebrow}>BUILT BY A TEACHER. FOR YOUR REAL DAY.</span><h2>Let the little things<br /><em>add up to clarity.</em></h2><TrackedLink href={demo} label="bottom_try_demo" className={styles.button}>Find your headspace ↗</TrackedLink><p>Start with the free demo. Keep core documentation free.<br />Optional Pro: $4.99/month, with a 30-day trial and no credit card.</p></section>
    </main></ScrollMotion>
    <footer className={styles.footer}><Link href="/" className={styles.logo}>ShortHand</Link><span>A little less to carry home.</span><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/resources">Resources</Link></div></footer>
  </div>;
}
