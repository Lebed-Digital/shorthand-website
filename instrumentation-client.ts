// PostHog on the public website: Web Analytics, Session Replay, and the five
// custom events listed in lib/posthog-events.ts. Autocapture stays off.
//
// This is getshorthandapp.com only. PostHog is NOT in the ShortHand app
// (app.getshorthandapp.com is a separate repo), and the privacy policy says so.
//
// The privacy rules (which pages are masked, which URL parameters survive) live
// in lib/posthog-privacy.ts with tests. Read that file before changing this one.
// If you add a page where a visitor can type a student name or anything else
// personal, add it to SENSITIVE_PATH_PREFIXES there and put the `ph-mask` class
// on the page's root element.
import { classifyLinkClick, filterCustomEvent } from './lib/posthog-events';
import { isSensitivePath, maskText, sanitizeEventUrls, sanitizeUrl, shouldInitPostHog } from './lib/posthog-privacy';

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

// GA4's gate in app/layout.tsx reads this flag with no try/catch, so a browser
// that blocks localStorage gets no GA4. Match that: unreadable means "skip".
function readDevFlag(): string | null {
  try {
    return window.localStorage.getItem('sh_dev');
  } catch {
    return '1';
  }
}

if (
  shouldInitPostHog({
    token,
    hostname: window.location.hostname,
    pathname: window.location.pathname,
    webdriver: navigator.webdriver,
    devFlag: readDevFlag(),
  })
) {
  // Loaded on demand rather than imported at the top: this file runs before
  // React hydrates, and a top-level import would put the whole SDK in the
  // critical path of every page, including visits where the gate above fails.
  import('posthog-js')
    .then(({ default: posthog }) => {
      posthog.init(token!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        defaults: '2026-05-30',

        // Web Analytics: pageviews (including client-side navigations) and
        // pageleaves. The only other events are the five custom ones sent
        // through window.__shTrack below; before_send drops anything else.
        capture_pageview: 'history_change',
        capture_pageleave: true,
        autocapture: false,
        rageclick: false,
        capture_dead_clicks: false,
        capture_heatmaps: false,
        capture_exceptions: false,
        capture_performance: false,

        // Visitors stay anonymous. Never call posthog.identify() on this site.
        person_profiles: 'identified_only',
        // Keep PostHog's cookie on getshorthandapp.com itself. The default
        // would set it on .getshorthandapp.com and send it to the app too.
        cross_subdomain_cookie: false,

        // Keeps remote config loading (Session Replay needs it) but evaluates
        // no feature flags, which also keeps surveys and experiments off.
        advanced_disable_feature_flags: true,
        disable_surveys: true,
        disable_web_experiments: true,
        // These products are switched on from the PostHog dashboard, not from
        // code, so they are pinned off here. Logs matters most: it uploads
        // console output along with the full page URL, that upload does not
        // pass through before_send below, and `captureConsoleLogs: false` does
        // NOT override the dashboard toggle. Dropping every record does.
        logs: { captureConsoleLogs: false, beforeSend: () => null },
        disable_product_tours: true,
        disable_conversations: true,
        // PostHog lifts ad click ids (gclid, fbclid, ...) out of the URL into
        // their own properties. This masks them.
        mask_personal_data_properties: true,

        // Strips query strings and fragments from every URL on every event,
        // then drops any custom event or property that is not on the list in
        // lib/posthog-events.ts.
        before_send: (event) => (event ? filterCustomEvent(sanitizeEventUrls(event)) : event),

        disable_session_recording: false,
        enable_recording_console_log: false,
        session_recording: {
          // Every input, textarea and select value is masked on every page.
          maskAllInputs: true,
          recordHeaders: false,
          recordBody: false,
          // "*" sends every text node through maskTextFn, which masks all text
          // on the tool pages and inside any `ph-mask` element, and leaves
          // public marketing copy readable everywhere else.
          maskTextSelector: '*',
          maskTextFn: (text, element) =>
            isSensitivePath(window.location.pathname) || element?.closest('.ph-mask') ? maskText(text) : text,
          // This callback does two jobs. PostHog runs it against the page URL
          // that Session Replay records (passed as `{ name }` alone), so the
          // replay URL bar is sanitized. It also sees every captured network
          // request, which is dropped: the dashboard can attach the network
          // recorder even with the three options above set to false.
          maskCapturedNetworkRequestFn: (request) => {
            if (request.entryType || request.initiatorType) return null;
            return { ...request, name: sanitizeUrl(request.name ?? '') };
          },
          // The recorder stores link targets as absolute URLs, so an in-page
          // link such as `#features` is saved as the whole current URL, query
          // string included. Sanitize link and form targets the same way.
          maskAttributeFn: (name, value, element) => {
            const tag = element?.tagName;
            const isLinkTarget = name === 'href' && (tag === 'A' || tag === 'AREA');
            const isFormTarget = name === 'action' && tag === 'FORM';
            return isLinkTarget || isFormTarget ? sanitizeUrl(value) : value;
          },
        },
      });

      // The one way a custom event reaches PostHog. Call sites use
      // captureEvent() in lib/posthog-events.ts, which finds this function.
      // Only capture is exposed, never the SDK itself, so nothing on a page
      // can reach identify().
      //
      // send_instantly: a click on a link to the app is the last thing the
      // page does. Queued, the event would depend on the send PostHog makes
      // while the page unloads, which is best effort and which the manual
      // privacy check cannot observe: queued, that check never saw an app
      // link click arrive. Sent at once, the request leaves while the page is
      // still alive. before_send still runs on these.
      window.__shTrack = (name, props) => {
        posthog.capture(name, props as Record<string, string>, { send_instantly: true });
      };

      // One listener covers every link to the app and every PDF on the site,
      // including pages added later, so no link has to opt in. This is not
      // autocapture: it reads where a clicked link points and whether it sits
      // in the nav, the footer or a blog post body, and never its text.
      // Capture phase, so it runs before a link's own handler navigates away.
      document.addEventListener(
        'click',
        (e) => {
          const link = e.target instanceof Element ? e.target.closest('a[href]') : null;
          if (!(link instanceof HTMLAnchorElement)) return;
          const hit = classifyLinkClick({
            hostname: link.hostname,
            pathname: link.pathname,
            search: link.search,
            sameSite: link.origin === window.location.origin,
            inNav: Boolean(link.closest('nav')),
            inFooter: Boolean(link.closest('footer')),
            inBlogBody: Boolean(link.closest('.blog-content')),
          });
          if (hit) window.__shTrack?.(hit.name, hit.props);
        },
        true,
      );
    })
    .catch(() => {
      // Analytics must never break the page.
    });
}
