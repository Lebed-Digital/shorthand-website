import { test, expect, type Page } from '@playwright/test';

/**
 * The Quick Grid practice demo on /features/quick-note
 * (components/QuickGridDemo.tsx, plans/quick-grid-demo.md section 7).
 *
 * Nothing in the demo is saved or sent, so these tests drive it like a visitor
 * and check what is on screen, what is focused, and what left the page.
 */

const PAGE = '/features/quick-note';
const APP_HOST = 'https://app.getshorthandapp.com';

const tile = (page: Page, name: string) =>
  page.getByRole('button', { name: new RegExp(`^Log a note for ${name}`) });
const allTiles = (page: Page) => page.getByRole('button', { name: /^Log a note for / });
const chip = (page: Page, label: string) => page.getByRole('button', { name: label, exact: true });
const sheet = (page: Page) => page.getByRole('dialog');
const closeButton = (page: Page) => sheet(page).getByRole('button', { name: 'Close' });
const saveButton = (page: Page) => sheet(page).getByRole('button', { name: 'Save' });

async function logNote(page: Page, name: string, labels: string[]) {
  await tile(page, name).click();
  for (const label of labels) await chip(page, label).click();
  await saveButton(page).click();
  await expect(sheet(page)).toHaveCount(0);
}

const columnCount = (page: Page) =>
  allTiles(page).first().evaluate(el => getComputedStyle(el.parentElement!).gridTemplateColumns.split(' ').length);

const hasHorizontalPageScroll = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);

// The sheet's scrolling middle: the Quick chips' container's parent.
const chipArea = (page: Page) => chip(page, 'On Task').locator('xpath=../..');

test.describe('behavior', () => {
  test('disclaimer is visible before any interaction', async ({ page }) => {
    await page.goto(PAGE);
    await expect(page.getByText('Practice with fictional students. Nothing is saved. App save times vary.')).toBeVisible();
    await expect(page.getByText(/Your demo time/)).toHaveCount(0);
  });

  test('tap, pick chips, save: tile checked, counts and result shown', async ({ page }) => {
    await page.goto(PAGE);
    await expect(allTiles(page)).toHaveCount(12);

    await tile(page, 'Comet').click();
    await expect(sheet(page)).toBeVisible();
    await expect(sheet(page).getByRole('heading', { name: 'Comet' })).toBeVisible();
    await expect(sheet(page).locator('[aria-pressed="true"]')).toHaveCount(0);
    await expect(saveButton(page)).toBeDisabled();

    await chip(page, 'On Task').click();
    await chip(page, 'Kindness').click();
    await expect(chip(page, 'On Task')).toHaveAttribute('aria-pressed', 'true');
    await chip(page, 'Kindness').click();
    await expect(chip(page, 'Kindness')).toHaveAttribute('aria-pressed', 'false');
    await expect(saveButton(page)).toBeEnabled();

    await saveButton(page).click();
    await expect(sheet(page)).toHaveCount(0);
    await expect(tile(page, 'Comet')).toHaveAttribute('aria-label', 'Log a note for Comet, note logged');
    await expect(page.getByText('1 logged', { exact: true })).toBeVisible();
    await expect(page.getByText(/^Your demo time: \d+\.\d seconds$/)).toBeVisible();
    await expect(page.getByText(/You logged 1 note for 1 student\./)).toBeVisible();
  });

  test('logging the same student again counts notes, not students', async ({ page }) => {
    await page.goto(PAGE);
    await logNote(page, 'Comet', ['On Task']);
    const time = await page.getByText(/^Your demo time/).textContent();
    await logNote(page, 'Comet', ['Off Task']);

    await expect(page.getByText('2 logged', { exact: true })).toBeVisible();
    await expect(allTiles(page).filter({ has: page.locator('[aria-hidden="true"] svg') })).toHaveCount(1);
    await expect(page.getByText(/You logged 2 notes for 1 student\./)).toBeVisible();
    await expect(page.getByText(/^Your demo time/)).toHaveText(time!);
  });

  test('close, scrim and Escape dismiss with nothing logged and clear chips', async ({ page }) => {
    await page.goto(PAGE);

    const dismissals: ((p: Page) => Promise<void>)[] = [
      p => closeButton(p).click(),
      async p => {
        const frame = await sheet(p).locator('..').boundingBox();
        await p.mouse.click(frame!.x + 30, frame!.y + 30);
      },
      p => p.keyboard.press('Escape'),
    ];
    for (const dismiss of dismissals) {
      await tile(page, 'Maple').click();
      await chip(page, 'Participation').click();
      await dismiss(page);
      await expect(sheet(page)).toHaveCount(0);
    }

    await expect(tile(page, 'Maple')).toHaveAttribute('aria-label', 'Log a note for Maple');
    await expect(page.getByText(/logged/)).toHaveCount(0);
    await tile(page, 'Maple').click();
    await expect(sheet(page).locator('[aria-pressed="true"]')).toHaveCount(0);
  });

  test('6 Quick chips wrap, the other 12 sit in one horizontal row', async ({ page }) => {
    await page.goto(PAGE);
    await tile(page, 'Comet').click();
    const quick = chip(page, 'On Task').locator('..');
    const overflow = chip(page, 'Peer Conflict').locator('..');
    await expect(quick.getByRole('button')).toHaveCount(6);
    await expect(overflow.getByRole('button')).toHaveCount(12);
    expect(await quick.evaluate(el => getComputedStyle(el).flexWrap)).toBe('wrap');
    const row = await overflow.evaluate(el => ({
      wrap: getComputedStyle(el).flexWrap,
      overflowX: getComputedStyle(el).overflowX,
      scrolls: el.scrollWidth > el.clientWidth,
    }));
    expect(row).toEqual({ wrap: 'nowrap', overflowX: 'auto', scrolls: true });
  });

  test('both demo links go to the guided demo', async ({ page }) => {
    await page.goto(PAGE);
    await tile(page, 'Comet').click();
    await expect(sheet(page).getByRole('link', { name: /More options are in the full app/ }))
      .toHaveAttribute('href', `${APP_HOST}/?demo=true`);
    await chip(page, 'On Task').click();
    await saveButton(page).click();
    await expect(page.getByRole('link', { name: 'Try the guided demo →' })).toHaveAttribute('href', `${APP_HOST}/?demo=true`);
  });
});

test.describe('timer', () => {
  test('runs from first tap through dismissals, freezes at first save', async ({ page }) => {
    // Paused, so only fastForward moves performance.now(). A running clock
    // would add however long the dev server takes to handle each click.
    await page.clock.install({ time: new Date('2026-01-05T08:00:00') });
    await page.goto(PAGE);
    await page.clock.pauseAt(new Date('2026-01-05T09:00:00'));

    await tile(page, 'Comet').click();
    await page.clock.fastForward(2000);
    await closeButton(page).click();
    await page.clock.fastForward(1000);
    await tile(page, 'Comet').click();
    await page.clock.fastForward(500);
    await expect(page.getByText(/Your demo time/)).toHaveCount(0);
    await chip(page, 'On Task').click();
    await saveButton(page).click();
    await expect(page.getByText('Your demo time: 3.5 seconds')).toBeVisible();

    await page.clock.fastForward(5000);
    await logNote(page, 'Nova', ['Teamwork']);
    await expect(page.getByText('Your demo time: 3.5 seconds')).toBeVisible();
  });
});

test.describe('try again', () => {
  const tryAgain = (page: Page) => page.getByRole('button', { name: 'Try Again' });
  const checkedTiles = (page: Page) => allTiles(page).filter({ has: page.locator('[aria-hidden="true"] svg') });

  test('appears after the first save and resets the whole practice session', async ({ page }) => {
    await page.goto(PAGE);
    await expect(tryAgain(page)).toHaveCount(0);
    await logNote(page, 'Comet', ['On Task']);
    await logNote(page, 'Comet', ['Kindness']);
    await logNote(page, 'Nova', ['Check-In']);
    await expect(page.getByText('3 logged', { exact: true })).toBeVisible();

    await tryAgain(page).click();
    await expect(page.getByText(/logged/)).toHaveCount(0);
    await expect(checkedTiles(page)).toHaveCount(0);
    await expect(page.getByText(/Your demo time/)).toHaveCount(0);
    await expect(page.getByText(/You logged/)).toHaveCount(0);
    await expect(tryAgain(page)).toHaveCount(0);
    await expect(tile(page, 'Biscuit')).toBeFocused();

    await tile(page, 'Comet').click();
    await expect(sheet(page).locator('[aria-pressed="true"]')).toHaveCount(0);
    await expect(saveButton(page)).toBeDisabled();
  });

  test('the second attempt is timed fresh from its own first tap', async ({ page }) => {
    await page.clock.install({ time: new Date('2026-01-05T08:00:00') });
    await page.goto(PAGE);
    await page.clock.pauseAt(new Date('2026-01-05T09:00:00'));

    await tile(page, 'Comet').click();
    await page.clock.fastForward(2000);
    await chip(page, 'On Task').click();
    await saveButton(page).click();
    await expect(page.getByText('Your demo time: 2.0 seconds')).toBeVisible();

    await tryAgain(page).click();
    await page.clock.fastForward(10_000); // idle time between attempts never counts
    await tile(page, 'Maple').click();
    await page.clock.fastForward(1500);
    await chip(page, 'Teamwork').click();
    await saveButton(page).click();
    await expect(page.getByText('Your demo time: 1.5 seconds')).toBeVisible();

    await page.clock.fastForward(4000);
    await logNote(page, 'Nova', ['Kindness']);
    await expect(page.getByText('Your demo time: 1.5 seconds')).toBeVisible();
  });

  test('can be repeated any number of times, and the guided demo link stays', async ({ page }) => {
    await page.goto(PAGE);
    for (let round = 0; round < 5; round++) {
      await logNote(page, 'Pickle', ['Participation']);
      await expect(page.getByText('1 logged', { exact: true })).toBeVisible();
      await expect(page.getByText(/You logged 1 note for 1 student\./)).toBeVisible();
      await expect(page.getByRole('link', { name: 'Try the guided demo →' })).toHaveAttribute('href', `${APP_HOST}/?demo=true`);
      await tryAgain(page).click();
      await expect(checkedTiles(page)).toHaveCount(0);
    }
  });
});

test.describe('persistence and network', () => {
  test('adds no storage, makes no app/API/Supabase requests, reload is fresh', async ({ page, context }) => {
    const blocked: string[] = [];
    page.on('request', req => {
      const url = req.url();
      if (/\/api\//.test(url) || /\.supabase\.co/.test(url) || url.startsWith(APP_HOST)) blocked.push(url);
    });
    const snapshot = async () => ({
      local: await page.evaluate(() => Object.keys(localStorage).sort()),
      session: await page.evaluate(() => Object.keys(sessionStorage).sort()),
      cookies: (await context.cookies()).map(c => c.name).sort(),
    });

    await page.goto(PAGE);
    await page.waitForLoadState('networkidle');
    const before = await snapshot();

    await tile(page, 'Comet').click();
    await closeButton(page).click();
    await logNote(page, 'Comet', ['On Task', 'Participation']);
    await logNote(page, 'Zigzag', ['Check-In']);

    expect(await snapshot()).toEqual(before);
    expect(blocked).toEqual([]);

    await page.reload();
    await expect(allTiles(page).filter({ has: page.locator('[aria-hidden="true"] svg') })).toHaveCount(0);
    await expect(page.getByText(/logged/)).toHaveCount(0);
    await expect(page.getByText(/Your demo time/)).toHaveCount(0);
  });

  test('with no analytics loaded, the flow works and the CTA still navigates', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.route(`${APP_HOST}/**`, route => route.fulfill({ contentType: 'text/html', body: '<p>app stub</p>' }));

    await page.goto(PAGE);
    await logNote(page, 'Comet', ['On Task']);
    await page.getByRole('link', { name: 'Try the guided demo →' }).click();
    await page.waitForURL(url => url.href.startsWith(APP_HOST));
    expect(new URL(page.url()).searchParams.get('demo')).toBe('true');
    expect(errors).toEqual([]);
  });
});

test.describe('layout', () => {
  for (const [width, cols] of [[320, 3], [360, 3], [375, 4], [390, 4], [1280, 4]] as const) {
    test(`${cols} columns at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(PAGE);
      expect(await columnCount(page)).toBe(cols);
    });
  }

  test('no horizontal page scroll at 320 with the sheet open and the row scrolled', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto(PAGE);
    await tile(page, 'Comet').click();
    await chip(page, 'Modified Work').scrollIntoViewIfNeeded();
    expect(await chip(page, 'Peer Conflict').locator('..').evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
    expect(await hasHorizontalPageScroll(page)).toBe(false);
  });

  for (const [width, height] of [[390, 844], [1280, 800]] as const) {
    test(`Close and Save both visible when the sheet opens at ${width}x${height}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto(PAGE);
      await tile(page, 'Comet').click();
      await expect(closeButton(page)).toBeInViewport({ ratio: 1 });
      await expect(saveButton(page)).toBeInViewport({ ratio: 1 });
    });
  }

  test('landscape phone: Close and Save reachable by page scroll alone', async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 });
    await page.goto(PAGE);
    await tile(page, 'Comet').click();
    for (const target of [closeButton(page), saveButton(page)]) {
      await target.scrollIntoViewIfNeeded();
      await expect(target).toBeInViewport({ ratio: 1 });
    }
    expect(await chipArea(page).evaluate(el => el.scrollTop)).toBe(0);
  });

  test('only the chip area scrolls inside the sheet, without chaining to the page', async ({ page }) => {
    await page.goto(PAGE);
    await tile(page, 'Comet').click();
    const area = await chipArea(page).evaluate(el => ({ y: getComputedStyle(el).overflowY, chain: getComputedStyle(el).overscrollBehaviorY }));
    expect(area).toEqual({ y: 'auto', chain: 'contain' });
    expect(await sheet(page).evaluate(el => getComputedStyle(el).overflowY)).toBe('visible');
  });
});

test.describe('enlarged text', () => {
  for (const [width, height] of [[390, 844], [320, 568]] as const) {
    test(`200% text at ${width}x${height}: no page scroll, names truncate, controls reachable`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto(PAGE);
      await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });

      expect(await hasHorizontalPageScroll(page)).toBe(false);
      const names = await allTiles(page).evaluateAll(tiles =>
        tiles.map(t => {
          const name = t.lastElementChild as HTMLElement;
          const tb = t.getBoundingClientRect();
          const nb = name.getBoundingClientRect();
          return { inside: nb.left >= tb.left - 0.5 && nb.right <= tb.right + 0.5, ellipsis: getComputedStyle(name).textOverflow };
        }),
      );
      for (const n of names) expect(n).toEqual({ inside: true, ellipsis: 'ellipsis' });

      await tile(page, 'Blueberry').click();
      expect(await hasHorizontalPageScroll(page)).toBe(false);
      const dialog = (await sheet(page).boundingBox())!;
      for (const box of [await chip(page, 'On Task').locator('..').boundingBox(), await chip(page, 'Peer Conflict').locator('..').boundingBox()]) {
        expect(box!.x).toBeGreaterThanOrEqual(dialog.x - 0.5);
        expect(box!.x + box!.width).toBeLessThanOrEqual(dialog.x + dialog.width + 0.5);
      }
      for (const target of [closeButton(page), saveButton(page)]) {
        await target.scrollIntoViewIfNeeded();
        await expect(target).toBeInViewport({ ratio: 1 });
      }
    });
  }
});

test.describe('keyboard and focus', () => {
  test('the whole flow works by keyboard, focus moves into the sheet and back', async ({ page }) => {
    await page.goto(PAGE);
    // Tab from the top of the page until a tile has focus.
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('Tab');
      if (await page.evaluate(() => document.activeElement?.hasAttribute('data-student'))) break;
    }
    const name = await page.evaluate(() => document.activeElement?.getAttribute('data-student'));
    expect(name).toBe('Biscuit');

    await page.keyboard.press('Enter');
    await expect(sheet(page)).toBeFocused();
    await page.keyboard.press('Tab'); // Close
    await expect(closeButton(page)).toBeFocused();
    await page.keyboard.press('Tab'); // first chip
    await expect(chip(page, 'On Task')).toBeFocused();
    await page.keyboard.press('Space');
    await expect(chip(page, 'On Task')).toHaveAttribute('aria-pressed', 'true');
    await saveButton(page).focus();
    await page.keyboard.press('Enter');

    await expect(sheet(page)).toHaveCount(0);
    await expect(tile(page, 'Biscuit')).toBeFocused();
    await expect(tile(page, 'Biscuit')).toHaveAttribute('aria-label', 'Log a note for Biscuit, note logged');
  });

  test('while the sheet is open, Tab never reaches the pane behind it', async ({ page }) => {
    await page.goto(PAGE);
    await tile(page, 'Comet').click();
    await expect(allTiles(page).first().locator('xpath=ancestor::*[@inert]')).toHaveCount(1);
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => !!document.activeElement?.closest('[inert]'))).toBe(false);
    }
  });

  test('focus returns to the tile after Close, scrim and Escape', async ({ page }) => {
    await page.goto(PAGE);
    await tile(page, 'Rocket').click();
    await closeButton(page).click();
    await expect(tile(page, 'Rocket')).toBeFocused();

    await tile(page, 'Pebble').click();
    const frame = (await sheet(page).locator('..').boundingBox())!;
    await page.mouse.click(frame.x + 30, frame.y + 30);
    await expect(tile(page, 'Pebble')).toBeFocused();

    await tile(page, 'Sprout').click();
    await page.keyboard.press('Escape');
    await expect(tile(page, 'Sprout')).toBeFocused();
  });

  test('chips use aria-pressed and the status line is polite', async ({ page }) => {
    await page.goto(PAGE);
    await expect(page.locator('[aria-live="polite"]').first()).toBeAttached();
    await tile(page, 'Comet').click();
    await expect(sheet(page).locator('[aria-pressed]')).toHaveCount(18);
  });
});
