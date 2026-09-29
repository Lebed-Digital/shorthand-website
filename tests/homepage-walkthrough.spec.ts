import { test, expect, type Page } from '@playwright/test';

/**
 * Homepage full-walkthrough video: facade loads nothing from YouTube until
 * clicked, the hero "See How It Works" button lands on it, both GA4 events
 * fire, and the existing vertical FeatureVideo embeds are unchanged.
 */

type GtagCall = [string, string, Record<string, unknown>];

/** Captures gtag calls the same way tests/generator-analytics.spec.ts does. */
async function captureEvents(page: Page): Promise<GtagCall[]> {
  const captured: GtagCall[] = [];
  await page.exposeFunction('__recordEvent', (args: GtagCall) => {
    captured.push(args);
  });
  await page.addInitScript(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).gtag = (...args: unknown[]) => (window as any).__recordEvent(args);
  });
  return captured;
}

function eventsNamed(captured: GtagCall[], name: string): Record<string, unknown>[] {
  return captured.filter((c) => c[0] === 'event' && c[1] === name).map((c) => c[2]);
}

/** Records every request to a YouTube player domain and answers it locally. */
async function recordYouTube(page: Page): Promise<string[]> {
  const hits: string[] = [];
  await page.route(/youtube(-nocookie)?\.com/, async (route) => {
    hits.push(route.request().url());
    await route.fulfill({ status: 200, contentType: 'text/html', body: '<html></html>' });
  });
  return hits;
}

async function ratio(page: Page, selector: string): Promise<number> {
  const box = await page.locator(selector).first().boundingBox();
  return box!.width / box!.height;
}

const FRAME = '#walkthrough .video-frame-wrap';

test('walkthrough player does not load until clicked, then plays and fires video_play', async ({ page }) => {
  const events = await captureEvents(page);
  const youtube = await recordYouTube(page);

  await page.goto('/');
  const section = page.locator('#walkthrough');
  await section.scrollIntoViewIfNeeded();
  await expect(section.getByRole('button', { name: 'Play ShortHand full walkthrough' })).toBeVisible();

  expect(await ratio(page, FRAME)).toBeCloseTo(16 / 9, 1);
  await expect(section.locator('iframe')).toHaveCount(0);
  expect(youtube).toEqual([]);
  expect(eventsNamed(events, 'video_play')).toEqual([]);

  await section.getByRole('button', { name: 'Play ShortHand full walkthrough' }).click();

  await expect(section.locator('iframe')).toHaveAttribute(
    'src',
    /youtube-nocookie\.com\/embed\/FGeXjIG_c8c\?autoplay=1/
  );
  expect(eventsNamed(events, 'video_play')).toEqual([
    { video_id: 'FGeXjIG_c8c', video_placement: 'homepage_walkthrough' },
  ]);
});

test('hero "See How It Works" lands on the walkthrough heading, clear of the sticky nav', async ({ page }) => {
  const events = await captureEvents(page);
  await page.goto('/');

  await page.getByRole('link', { name: 'See How It Works' }).click();

  await expect(page).toHaveURL(/\/#walkthrough$/);
  const heading = page.locator('#walkthrough-heading');
  // Smooth scroll: wait for it to arrive, then check it is not under the 64px nav.
  await expect.poll(async () => (await heading.boundingBox())!.y).toBeLessThan(300);
  expect((await heading.boundingBox())!.y).toBeGreaterThanOrEqual(64);
  await expect(page.locator(FRAME)).toBeInViewport();

  expect(eventsNamed(events, 'cta_click').map((e) => e.cta_destination)).toContain('hero_see_how_it_works');
});

test('walkthrough CTA fires its own cta_click and opens the guided demo', async ({ page }) => {
  const events = await captureEvents(page);
  await page.route('https://app.getshorthandapp.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '<html>app</html>' })
  );

  await page.goto('/');
  const section = page.locator('#walkthrough');
  await expect(section.getByText('No account, no credit card.')).toBeAttached();
  await section.getByRole('link', { name: 'Try the guided demo' }).click();

  await expect(page).toHaveURL(/app\.getshorthandapp\.com\/\?demo=true/);
  const click = eventsNamed(events, 'cta_click').find((e) => e.cta_destination === 'walkthrough_try_demo');
  expect(click).toMatchObject({ cta_source: 'homepage' });
  expect(String(click!.link_url)).toContain('lp=%2F');
});

test('/how-it-works redirects to the walkthrough', async ({ request }) => {
  const res = await request.get('/how-it-works', { maxRedirects: 0 });
  expect(res.status()).toBe(307);
  expect(res.headers().location).toBe('/#walkthrough');
});

test('ClassDojo alternative page links to the walkthrough', async ({ page }) => {
  await page.goto('/classdojo-alternative');
  await page.getByRole('link', { name: 'Want to see it first? Watch the 6-minute walkthrough.' }).click();

  await expect(page).toHaveURL(/\/#walkthrough$/);
  await expect(page.locator('#walkthrough-heading')).toBeInViewport();
});

test('existing vertical feature videos keep the 9:16 layout and click-to-play behavior', async ({ page }) => {
  const youtube = await recordYouTube(page);
  await page.goto('/features/quick-note');

  const frame = page.locator('.video-frame-wrap').first();
  await expect(frame).toBeVisible();
  expect(await ratio(page, '.video-frame-wrap')).toBeCloseTo(9 / 16, 1);
  expect((await frame.boundingBox())!.width).toBeLessThanOrEqual(360);
  await expect(frame).not.toHaveClass(/video-frame-wrap--wide/);
  // Thumbnail loading is untouched on vertical embeds (no lazy attribute added).
  await expect(frame.locator('img')).not.toHaveAttribute('loading', /.*/);
  await expect(frame.locator('iframe')).toHaveCount(0);
  expect(youtube).toEqual([]);

  await frame.getByRole('button').click();
  await expect(frame.locator('iframe')).toHaveAttribute('src', /7fQrX5eHAsc\?autoplay=1.*controls=0/);
});

// --- Safari / mobile: player API path -----------------------------------------

const IPHONE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';

/** Stand-in for youtube.com/iframe_api: records what FeatureVideo asks for, then "plays". */
const FAKE_API = `window.YT = { ready: (cb) => cb(), Player: function (el, opts) {
  window.__yt = { videoId: opts.videoId, host: opts.host, playerVars: opts.playerVars };
  const f = document.createElement('iframe');
  f.src = opts.host + '/embed/' + opts.videoId;
  el.replaceWith(f);
  opts.events.onReady({ target: { playVideo: () => { window.__yt.played = true; } } });
} };`;

async function fakePlayerApi(page: Page): Promise<string[]> {
  const hits: string[] = [];
  await page.route(/youtube(-nocookie)?\.com/, (route) => {
    const url = route.request().url();
    hits.push(url);
    const api = url.includes('/iframe_api');
    return route.fulfill({ status: 200, contentType: api ? 'text/javascript' : 'text/html', body: api ? FAKE_API : '<html></html>' });
  });
  return hits;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ytState = (page: Page) => page.evaluate(() => (window as any).__yt);

test.describe('Safari and mobile (one tap to play)', () => {
  test.use({ userAgent: IPHONE_UA, viewport: { width: 390, height: 844 } });

  test('one tap loads the player API only then, and starts playback', async ({ page }) => {
    const events = await captureEvents(page);
    const youtube = await fakePlayerApi(page);

    await page.goto('/#walkthrough');
    const play = page.locator('#walkthrough').getByRole('button', { name: 'Play ShortHand full walkthrough' });
    await expect(play).toBeVisible();
    expect(youtube).toEqual([]);

    await play.click();

    await expect.poll(async () => (await ytState(page))?.played).toBe(true);
    expect(await ytState(page)).toMatchObject({
      videoId: 'FGeXjIG_c8c',
      host: 'https://www.youtube-nocookie.com',
      playerVars: { autoplay: 1, playsinline: 1 },
    });
    const iframe = (await page.locator(`${FRAME} iframe`).boundingBox())!;
    expect(iframe.width).toBeGreaterThan((await page.locator(FRAME).boundingBox())!.width - 4);
    expect(eventsNamed(events, 'video_play')).toHaveLength(1);
  });

  test('vertical feature videos keep controls hidden on this path', async ({ page }) => {
    await fakePlayerApi(page);
    await page.goto('/features/quick-note');
    await page.locator('.video-frame-wrap').first().getByRole('button').click();

    await expect.poll(async () => (await ytState(page))?.played).toBe(true);
    expect((await ytState(page)).playerVars).toMatchObject({ controls: 0 });
  });

  test('falls back to the plain embed if the player API script is blocked', async ({ page }) => {
    await page.route(/youtube\.com\/iframe_api/, (route) => route.abort());
    await page.route(/youtube-nocookie\.com/, (route) =>
      route.fulfill({ status: 200, contentType: 'text/html', body: '<html></html>' })
    );

    await page.goto('/#walkthrough');
    await page.locator('#walkthrough').getByRole('button', { name: 'Play ShortHand full walkthrough' }).click();

    await expect(page.locator(`${FRAME} iframe`)).toHaveAttribute('src', /FGeXjIG_c8c\?autoplay=1/);
  });
});

test.describe('phone width', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('walkthrough fits the screen at 16:9 with the CTA below it', async ({ page }) => {
    await page.goto('/#walkthrough');
    const frame = page.locator(FRAME);
    await expect(frame).toBeInViewport();

    const box = (await frame.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(390);
    expect(box.width / box.height).toBeCloseTo(16 / 9, 1);

    const cta = page.locator('#walkthrough').getByRole('link', { name: 'Try the guided demo' });
    await cta.scrollIntoViewIfNeeded();
    await expect(cta).toBeVisible();
    // Measure both after the same scroll so the comparison is layout, not timing.
    expect((await cta.boundingBox())!.y).toBeGreaterThan((await frame.boundingBox())!.y);
  });

  test('hamburger menu "Walkthrough" lands on the walkthrough from the homepage and a blog post', async ({ page }) => {
    for (const path of ['/', '/blog/welcome-letter-to-parents-from-teacher']) {
      await page.goto(path);
      await page.getByRole('button', { name: 'Menu' }).click();
      await page.locator('.nav-mobile-menu').getByRole('link', { name: 'Walkthrough' }).click();
      await expect(page).toHaveURL(/\/#walkthrough$/);
      await expect(page.locator(FRAME)).toBeInViewport();
    }
  });

  test('hero tap and the ClassDojo link both land on the walkthrough', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'See How It Works' }).click();
    await expect(page.locator(FRAME)).toBeInViewport();

    await page.goto('/classdojo-alternative');
    await page.getByRole('link', { name: 'Want to see it first? Watch the 6-minute walkthrough.' }).click();
    await expect(page.locator(FRAME)).toBeInViewport();
  });
});
