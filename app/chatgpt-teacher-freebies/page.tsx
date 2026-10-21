import type { Metadata } from 'next';
import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FreeToolsCta from '../../components/FreeToolsCta';
import { HeroCopyButton, OutLink, PromptBox } from './PromptClient';

const PAGE_URL = 'https://getshorthandapp.com/chatgpt-teacher-freebies';
const TITLE = 'Free ChatGPT Prompt to Find Teacher Freebies and Discounts | ShortHand';
const DESCRIPTION =
  'Copy a free ChatGPT scheduled task prompt that searches the web for teacher discounts, free tools, and promotions every morning, and only flags the ones worth your time.';
const SOCIAL_DESCRIPTION = 'Let ChatGPT hunt for teacher freebies and discounts while you teach. Free prompt and setup guide, no sign-up.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: SOCIAL_DESCRIPTION,
    url: PAGE_URL,
    type: 'website',
    images: [{ url: 'https://getshorthandapp.com/og-image-v2.png', width: 1200, height: 630, alt: 'Free ChatGPT prompt to find teacher freebies' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: SOCIAL_DESCRIPTION,
    images: ['https://getshorthandapp.com/og-image-v2.png'],
  },
};

const LETTER_COLORS = ['#e2725b', '#34d399', '#f59e0b', '#60a5fa', '#a78bfa', '#e2725b', '#34d399', '#f59e0b', '#60a5fa'];

const FAQS: [string, ReactNode][] = [
  [
    'Is this free?',
    <>
      Yes. The prompt is free to copy and there&apos;s no ShortHand sign-up. You do need a ChatGPT account. Scheduled tasks
      are available on the free ChatGPT plan, with limits.
    </>,
  ],
  [
    'Do I need a paid ChatGPT plan?',
    <>
      No. According to OpenAI, free accounts can run a recurring task up to once a day in a flexible window like
      &quot;morning,&quot; with up to 3 active tasks. Paid plans get exact times and more tasks. Features can still vary by
      account and app version, and a school or district ChatGPT account may have tasks turned off.
    </>,
  ],
  [
    'Can ChatGPT check my Gmail?',
    <>
      Sometimes. OpenAI says scheduled tasks can use connected apps like Gmail when the app is available for your account.
      That depends on your plan, region, and workspace. Look for Gmail in ChatGPT&apos;s settings under Apps (some versions
      say Plugins). If it isn&apos;t there, the main prompt still works without it.
    </>,
  ],
  [
    'Will it notify me automatically?',
    <>
      Yes, once notifications are on. In ChatGPT, go to Settings, then Notifications, and pick Push, Email, or both. For
      phone alerts, set up the task in the ChatGPT mobile app and allow notifications when it asks.
    </>,
  ],
  [
    'Can I change what it searches for?',
    <>
      Yes. Fill in the lines in [brackets] before you send it. Later, open the task from Scheduled and edit its
      instructions, for example to add tools you already use or categories you want skipped.
    </>,
  ],
  [
    'Can I turn it off?',
    <>
      Yes. Go to Scheduled in ChatGPT, open the task, and pause or delete it. Deleting the chat the task came from also
      pauses it.
    </>,
  ],
  [
    'Is it safe to connect my email?',
    <>
      That&apos;s your call. Connecting Gmail lets ChatGPT read your mailbox, not just promotions. Never connect a school
      email account, and remember a personal inbox can still hold messages about students or families. On free and personal
      paid plans, OpenAI says information from connected apps may be used to train its models if the &quot;Improve the
      model for everyone&quot; setting is on, and you can turn that off. You can also disconnect Gmail anytime.
    </>,
  ],
  [
    'Does it work for teachers outside the United States?',
    <>
      The task itself works outside the US, but a lot of teacher discounts don&apos;t. That&apos;s why the prompt asks
      for your country, so it can skip offers you can&apos;t use. Connected apps like Gmail can vary by region.
    </>,
  ],
];

const h2Style: CSSProperties = { fontSize: 20, fontWeight: 600, color: '#f1f5f9', margin: '40px 0 12px', letterSpacing: '-0.01em' };
const h3Style: CSSProperties = { fontSize: 16, fontWeight: 600, color: '#f1f5f9', margin: '20px 0 6px' };
const pStyle: CSSProperties = { fontSize: 15, lineHeight: 1.7, color: '#cbd5e1', margin: '0 0 12px' };
const listStyle: CSSProperties = { ...pStyle, paddingLeft: 22, margin: '0 0 16px' };
const liStyle: CSSProperties = { marginBottom: 8 };
const linkStyle: CSSProperties = { color: '#2dd4bf', textDecoration: 'underline' };
const strongStyle: CSSProperties = { color: '#f1f5f9' };
const secondaryButton: CSSProperties = { display: 'block', textAlign: 'center', background: 'rgba(255,255,255,0.08)', color: '#fff', fontWeight: 700, fontSize: 15, padding: '12px 18px', borderRadius: 10, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.18)' };

export default function ChatGptTeacherFreebiesPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '6px 20px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', fontFamily: 'var(--font-fredoka, sans-serif)', fontWeight: 700, fontSize: 22, letterSpacing: '0.02em' }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: 'sans-serif', fontWeight: 400 }}>←</span>
          {'ShortHand'.split('').map((letter, i) => (
            <span key={i} style={{ color: LETTER_COLORS[i] }}>{letter}</span>
          ))}
        </Link>
      </div>

      <main style={{ maxWidth: 600, margin: '0 auto', padding: '20px 16px 56px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 10 }}>
          <h1 style={{ flex: 1, fontSize: 27, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.01em', lineHeight: 1.25 }}>
            Let ChatGPT Hunt for Teacher Freebies While You Teach
          </h1>
          <Image
            src="/mini-me-thumbs-up.png"
            alt="Pixel art of Greg, a third grade teacher, giving a thumbs up"
            width={110}
            height={85}
            priority
            style={{ imageRendering: 'pixelated', flexShrink: 0 }}
          />
        </div>
        <p style={{ ...pStyle, fontSize: 16, color: '#e2e8f0' }}>
          I set up a ChatGPT task to look for useful teacher tools, freebies, and promotions. So far, it&apos;s helped me save
          about $160 and discover tools I might have missed.
        </p>

        <HeroCopyButton />
        <div style={{ marginTop: 10 }}>
          <OutLink to="chatgpt" style={secondaryButton}>Open ChatGPT ↗</OutLink>
        </div>
        <ol style={{ ...pStyle, fontSize: 14, paddingLeft: 22, margin: '14px 0 6px', color: '#cbd5e1' }}>
          <li>Copy the prompt.</li>
          <li>Open ChatGPT and start a new chat.</li>
          <li>Paste it, fill in the [brackets], and send.</li>
          <li>Check that ChatGPT confirms the task. That&apos;s it.</li>
        </ol>
        <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
          Free. No ShortHand sign-up. You need a ChatGPT account (the free plan works, with limits).{' '}
          <a href="#setup" style={linkStyle}>Full setup steps</a>
        </p>

        <h2 style={h2Style}>What does this actually do?</h2>
        <p style={pStyle}>Once a day, ChatGPT runs the task on its own:</p>
        <ul style={listStyle}>
          <li style={liStyle}>It searches the web for teacher freebies, discounts, and promotions.</li>
          <li style={liStyle}>If you connect Gmail and your account supports it, it can also look through promo emails.</li>
          <li style={liStyle}>It checks what it finds against your preferences and its rules: still active, trustworthy, actually useful.</li>
          <li style={liStyle}>It tells you about the few that are worth a look, with links and who qualifies.</li>
        </ul>
        <p style={pStyle}>
          The goal is fewer, better alerts, not another daily pile of junk. It won&apos;t be perfect. ChatGPT can still miss
          a deal or get a detail wrong, and features vary by plan and account, so check the offer page before you sign up for
          anything.
        </p>

        <h2 style={h2Style}>Copy the setup prompt</h2>
        <p style={pStyle}>
          This is a starter version of the workflow I use. My personal setup includes additional tasks and connected email
          accounts.
        </p>
        <p style={pStyle}>
          This works on its own with web search, no apps to connect. Replace the parts in [brackets] with your own details.
          Leave a line in brackets and ChatGPT skips it (it will ask once for your country).
        </p>
        <PromptBox which="main" label="Free ChatGPT prompt" />

        <h3 style={h3Style}>Optional: also check your email</h3>
        <p style={pStyle}>
          Only if Gmail is connected to your ChatGPT account (more on that below). Paste this under the main prompt before you
          send it. Already set up the task? Open it from Scheduled, edit the instructions, and paste this at the end.
        </p>
        <PromptBox which="gmail" label="Optional Gmail add-on" />
        <div role="note" style={{ marginTop: 16, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: 12, padding: '14px 16px' }}>
          <p style={{ ...pStyle, margin: 0, color: '#fde68a' }}>
            <strong style={{ color: '#fcd34d' }}>Use a personal email, never your school account.</strong>{' '}
            School email holds student and family information, and your district&apos;s rules about AI apply there.
            Connecting Gmail gives ChatGPT access to the whole inbox, not just promotions, so only connect an account
            you&apos;re comfortable sharing.
          </p>
        </div>

        <h2 id="setup" style={h2Style}>Set it up in ChatGPT</h2>
        <ol style={listStyle}>
          <li style={liStyle}>
            <strong style={strongStyle}>Open ChatGPT</strong>{' '}on the web at{' '}
            <OutLink to="chatgpt" style={linkStyle}>chatgpt.com</OutLink>{' '}or in the ChatGPT phone app, and sign in. Want
            alerts on your phone? Use the app.
          </li>
          <li style={liStyle}>
            <strong style={strongStyle}>Start a regular new chat.</strong>{' '}Not inside a Project, and not a custom GPT or a
            voice chat. Tasks don&apos;t support those.
          </li>
          <li style={liStyle}>
            <strong style={strongStyle}>Paste the prompt</strong>, fill in the [brackets], and send it.
          </li>
          <li style={liStyle}>
            <strong style={strongStyle}>Confirm it was created.</strong>{' '}ChatGPT shows a confirmation when it makes a task.
            You&apos;ll also find it under Scheduled in ChatGPT. If you don&apos;t see a confirmation, reply &quot;Please
            schedule this as a daily task.&quot;
          </li>
          <li style={liStyle}>
            <strong style={strongStyle}>Turn on notifications.</strong>{' '}Go to Settings, then Notifications, and choose Push,
            Email, or both. Your browser or phone may ask permission. Say yes.
          </li>
          <li style={liStyle}>
            <strong style={strongStyle}>Edit, pause, or delete it anytime</strong>{' '}from Scheduled, or select the task title
            in its chat. Can&apos;t find Scheduled? Go to Settings, then Notifications, then Manage tasks.
          </li>
          <li style={liStyle}>
            <strong style={strongStyle}>Gmail (optional).</strong>{' '}In ChatGPT&apos;s settings, open Apps (some versions say
            Plugins) and connect Gmail if it&apos;s offered. If it isn&apos;t listed, your account doesn&apos;t have it, and the
            web-only prompt still works.
          </li>
        </ol>
        <p style={pStyle}>
          On the free plan, the task runs once a day in a time window like &quot;morning,&quot; not at an exact time. Menu
          names in ChatGPT change from time to time. If something looks different, OpenAI keeps an up-to-date guide:{' '}
          <OutLink to="openai_help" style={linkStyle}>Scheduled tasks in ChatGPT</OutLink>.
        </p>

        <h2 style={h2Style}>My results</h2>
        <p style={pStyle}>
          I&apos;m a third grade teacher, and I don&apos;t have time to search for every new promotion or teacher discount. I
          wanted ChatGPT to do the searching and let me know when something was actually worth my attention.
        </p>
        <p style={pStyle}>
          So far it&apos;s saved me about $160, and it&apos;s turned up useful tools I probably wouldn&apos;t have found on my
          own. The best part is the filtering. I don&apos;t dig through deals anymore, I just look at the few it flags.
        </p>
        <p style={pStyle}>
          Those are my results, not a promise. What you find depends on what you teach, where you live, and what&apos;s out
          there that week.
        </p>

        <h2 style={h2Style}>Tips for better results</h2>
        <ul style={listStyle}>
          <li style={liStyle}>
            <strong style={strongStyle}>List the tools you already use.</strong>{' '}It can watch for upgrades and teacher plans
            for those.
          </li>
          <li style={liStyle}>
            <strong style={strongStyle}>Say what you care about.</strong>{' '}&quot;AI tools and printables for 2nd grade
            reading&quot; gets better results than &quot;anything for teachers.&quot;
          </li>
          <li style={liStyle}>
            <strong style={strongStyle}>Exclude what you don&apos;t want.</strong>{' '}Clothing, travel, subscriptions you
            already pay for.
          </li>
          <li style={liStyle}>
            <strong style={strongStyle}>Ask for links and deadlines.</strong>{' '}The prompt already does, but if they go
            missing, tell it.
          </li>
          <li style={liStyle}>
            <strong style={strongStyle}>Read the offer page before you sign up.</strong>{' '}Check the price, what happens when
            a trial ends, and whether your school email is required.
          </li>
          <li style={liStyle}>
            <strong style={strongStyle}>Too many alerts?</strong>{' '}Edit the task and lower the limit to one find, or tell it
            to only notify you when something is free or at least half off. Getting a notification even on days with nothing?
            Add &quot;Don&apos;t notify me unless you found something.&quot;
          </li>
        </ul>

        <h2 style={h2Style}>Frequently asked questions</h2>
        {FAQS.map(([q, a]) => (
          <div key={q}>
            <h3 style={h3Style}>{q}</h3>
            <p style={pStyle}>{a}</p>
          </div>
        ))}

        <h2 style={h2Style}>Make it yours</h2>
        <p style={pStyle}>
          Start with the prompt as it is, let it run for a week, then tweak it. Cut what you don&apos;t want, add the tools you
          use, and it gets more useful. If you like having ChatGPT do the busywork, try the free{' '}
          <Link href="/week-at-a-glance" style={linkStyle}>week at a glance prompt</Link>{' '}or the{' '}
          <Link href="/free-seating-chart-prompt" style={linkStyle}>seating chart prompt</Link>{' '}next.
        </p>

        <FreeToolsCta ctaSource="chatgpt_teacher_freebies" />
      </main>
    </div>
  );
}
