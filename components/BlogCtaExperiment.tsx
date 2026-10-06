'use client';

import { useEffect } from 'react';
import { captureEvent, experimentSeen, experimentVariant, previewVariant, type ExperimentVariant } from '../lib/posthog-events';

// Experiment `blog-cta-presentation` (lib/posthog-events.ts): is the call to
// action in the middle of a post skipped because of how it looks? Both
// variants are the same markup, words, link and position
// (components/BlogWorkflowBridge.tsx). 'test' adds one class to it, styled in
// app/globals.css.
//
// What is measured, in order:
//   seen     the call to action is at least half on screen. This is PostHog's
//            own "$feature_flag_called", so taking part means having seen it,
//            not having loaded the page.
//   paused   it then stayed there for two seconds with the tab in front
//            (blog_cta_paused, once per page view).
//   clicked  app_link_clicked, from the site-wide link listener.
//
// A visitor joins only while the call to action is still below the screen.
// PostHog blocked, slow or absent, or a flag that arrives after the reader has
// reached it, all leave the control in place with nothing recorded. So nobody
// watches it change shape, and nothing they are reading moves.

const KEY = 'blog-cta-presentation';
const TEST_CLASS = 'blog-workflow-bridge--editorial';
const ON_SCREEN = 0.5;
const PAUSE_MS = 2000;

type Variant = ExperimentVariant<typeof KEY>;

export default function BlogCtaExperiment() {
  useEffect(() => {
    const cta = document.querySelector<HTMLElement>('.blog-workflow-bridge');
    if (!cta || !('IntersectionObserver' in window)) return;

    // Preview deployments only, where there is no PostHog to ask. Always null
    // on production.
    const forced = previewVariant(window.location.hostname, window.location.search);
    const badge = forced ? previewBadge(forced) : null;

    let observer: IntersectionObserver | undefined;
    let timer: number | undefined;
    let syncPause = () => {};
    const noteClick = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest('a')) badge?.note('Clicked');
    };

    const run = (variant: Variant) => {
      if (!forced && cta.getBoundingClientRect().top < window.innerHeight) return;
      cta.classList.toggle(TEST_CLASS, variant === 'test');

      let onScreen = false;
      let seen = false;
      let paused = false;
      // The tab check matters on this page in particular: a reader copies a
      // template and switches to their email with the post still open.
      syncPause = () => {
        if (paused || !onScreen || document.hidden) {
          window.clearTimeout(timer);
          timer = undefined;
          return;
        }
        timer ??= window.setTimeout(() => {
          paused = true;
          observer?.disconnect();
          captureEvent('blog_cta_paused', { cta_type: 'workflow_bridge', variant });
          badge?.note('Paused 2s');
        }, PAUSE_MS);
      };
      observer = new IntersectionObserver(
        ([entry]) => {
          onScreen = entry.intersectionRatio >= ON_SCREEN;
          if (onScreen && !seen) {
            seen = true;
            experimentSeen(KEY);
            badge?.note('Seen');
          }
          syncPause();
        },
        { threshold: ON_SCREEN },
      );
      observer.observe(cta);
      document.addEventListener('visibilitychange', syncPause);
      if (badge) cta.addEventListener('click', noteClick, true);
    };

    const withdraw = forced ? () => {} : experimentVariant(KEY, run);
    if (forced) run(forced);

    return () => {
      withdraw();
      observer?.disconnect();
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', syncPause);
      cta.removeEventListener('click', noteClick, true);
      cta.classList.remove(TEST_CLASS);
      badge?.remove();
    };
  }, []);

  return null;
}

// Preview deployments only: shows which variant was forced and what would have
// been recorded, since nothing is sent from a preview. Drawn by hand rather
// than rendered, so the page's own markup is the same with and without it.
function previewBadge(variant: Variant) {
  const steps = { Seen: false, 'Paused 2s': false, Clicked: false };
  const el = document.createElement('div');
  el.setAttribute('data-cta-preview', variant);
  el.style.cssText =
    'position:fixed;left:12px;top:12px;z-index:9999;pointer-events:none;padding:8px 10px;border-radius:8px;' +
    'border:1px solid #f97316;background:#111;color:#fff;font:12px/1.5 ui-monospace,monospace;white-space:pre';
  const draw = () => {
    const name = variant === 'test' ? 'VARIANT (editorial)' : 'CONTROL (current card)';
    el.textContent = [`CTA preview: ${name}`, ...Object.entries(steps).map(([step, done]) => `${step}: ${done ? 'YES' : 'no'}`)].join('\n');
  };
  draw();
  document.body.appendChild(el);
  return {
    note(step: keyof typeof steps) {
      steps[step] = true;
      draw();
    },
    remove: () => el.remove(),
  };
}
