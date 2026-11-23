import { expect, test, type Page } from '@playwright/test'
import { introSessionKey } from '../../lib/cinematicIntro'

const dialog = (page: Page) => page.getByRole('dialog', { name: 'SkillChain opening' })
const primary = (page: Page) => page.locator('.home-hero').getByRole('link', { name: 'Try the simulation' })

async function holdCover(page: Page) {
  await page.clock.install({ time: 0 })
  await page.clock.pauseAt(1000)
  await page.goto('/')
  await expect(dialog(page)).toBeVisible()
}

async function expectReleased(page: Page) {
  await expect(page.locator('[data-cinematic-opening]')).toHaveCount(0)
  await expect(page.locator('#skillchain-app')).not.toHaveJSProperty('inert', true)
  await expect(page.locator('html')).not.toHaveAttribute('data-opening-active')
  await expect(page.locator('html')).not.toHaveAttribute('data-opening-locked')
  await expect(page.locator('html')).not.toHaveCSS('overflow-y', 'hidden')
}

test('first document is covered and dismissal makes the unchanged CTA clickable', async ({ page, context }) => {
  await holdCover(page)
  await expect(page.locator('#skillchain-app')).toHaveJSProperty('inert', true)
  const session = await context.newCDPSession(page)
  const { root } = await session.send('DOM.getDocument')
  const { nodeId } = await session.send('DOM.querySelector', { nodeId: root.nodeId, selector: '#skillchain-app main h1' })
  const { nodes } = await session.send('Accessibility.getPartialAXTree', { nodeId, fetchRelatives: false })
  expect(nodes[0]?.ignored).toBe(true)
  await session.detach()
  await expect(page.locator('html')).toHaveCSS('overflow-y', 'hidden')
  const originalWidth = (await page.locator('main').boundingBox())!.width
  await dialog(page).getByRole('button', { name: 'Skip intro' }).click()
  await expectReleased(page)
  expect((await page.locator('main').boundingBox())?.width).toBeCloseTo(originalWidth, 0)
  await expect(page.locator('#opening-document-start')).toBeFocused()
  expect(await page.evaluate(key => sessionStorage.getItem(key), introSessionKey)).toBe('1')
  await primary(page).click()
  await expect(page).toHaveURL(/\/demo\/$/)
})

test('refresh, site navigation, Back and Forward keep the first visit consumed', async ({ page }) => {
  await holdCover(page)
  await page.reload()
  await expectReleased(page)
  await page.locator('footer').getByRole('link', { name: 'Pricing' }).click()
  await expect(page).toHaveURL(/\/pricing\/$/)
  await page.goBack()
  await expectReleased(page)
  await page.goForward()
  await expect(page).toHaveURL(/\/pricing\/$/)
  await page.locator('header').getByRole('link', { name: 'SkillChain Home' }).click()
  await expectReleased(page)
})

for (const path of ['/pricing/', '/demo/', '/#preview']) {
  test(`a fresh visit to ${path} consumes the session and does not cover Home later`, async ({ page }) => {
    await page.goto(path)
    await expectReleased(page)
    expect(await page.evaluate(key => sessionStorage.getItem(key), introSessionKey)).toBe('1')
    await page.goto('/')
    await expectReleased(page)
  })
}

test('storage failure leaves a directly usable page', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => { throw new DOMException('Denied', 'SecurityError') }
  })
  await page.goto('/')
  await expectReleased(page)
  await expect(primary(page)).toBeVisible()
})

test('Skip works while framework scripts are still blocked', async ({ page }) => {
  await page.route('**/_next/static/**/*.js', route => route.abort())
  await holdCover(page)
  await dialog(page).getByRole('button', { name: 'Skip intro' }).click()
  await expectReleased(page)
  await primary(page).click()
  await expect(page).toHaveURL(/\/demo\/$/)
})

for (const key of ['Enter', 'Space', 'Escape']) {
  test(`first Tab reaches Skip, and ${key} returns to document start`, async ({ page }) => {
    await holdCover(page)
    await page.keyboard.press('Tab')
    await expect(dialog(page).getByRole('button', { name: 'Skip intro' })).toBeFocused()
    await page.keyboard.press(key)
    await expectReleased(page)
    await expect(page.locator('#opening-document-start')).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: 'Skip to content', exact: true })).toBeFocused()
  })
}

test('the OS reduced-motion preference bypasses the cover', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expectReleased(page)
  expect(await page.evaluate(key => sessionStorage.getItem(key), introSessionKey)).toBe('1')
  await expect(primary(page)).toBeInViewport()
})

test('footer motion override wins when returning Home', async ({ page }) => {
  await page.goto('/pricing/')
  await page.getByRole('button', { name: 'Reduce motion' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-reduced-motion', 'true')
  await page.locator('header').getByRole('link', { name: 'SkillChain Home' }).click()
  await expectReleased(page)
  await expect(page.locator('html')).toHaveAttribute('data-reduced-motion', 'true')
})

test('an override activated during the timeline releases the cover', async ({ page }) => {
  await holdCover(page)
  await page.evaluate(() => { document.documentElement.dataset.reducedMotion = 'true' })
  await expectReleased(page)
})

test('a hidden visibility state ends the timeline and releases inert', async ({ page }) => {
  await holdCover(page)
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await expectReleased(page)
})

test('the watchdog completes an opening with no CSS animationend', async ({ page }) => {
  await holdCover(page)
  await page.addStyleTag({ content: '.cinematic-opening .opening-panel { animation: none !important; }' })
  await page.clock.runFor(2000)
  await expect(dialog(page)).toHaveAttribute('data-opening-phase', 'open')
  await expect(dialog(page).locator('[data-opening-percent]')).toHaveText('100%')
  await page.clock.runFor(1240)
  await expectReleased(page)
})

test('the real timeline reaches 100% and sends the curtains in opposite directions', async ({ page }) => {
  await page.setViewportSize({ width: 1332, height: 667 })
  const errors: string[] = []
  const videos: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => {
    if (message.type() === 'error' || /hydrat/i.test(message.text())) errors.push(message.text())
  })
  page.on('request', request => {
    if (request.url().endsWith('.mp4')) videos.push(request.url())
  })
  await page.addInitScript(() => {
    const timeline = { began: 0, finished: 0 }
    Object.defineProperty(window, 'openingTimings', { value: timeline })
    const observer = new MutationObserver(() => {
      const overlay = document.querySelector<HTMLElement>('[data-cinematic-opening]')
      if (!timeline.began && overlay?.dataset.openingPhase === 'progress') timeline.began = performance.now()
      if (timeline.began && !overlay) {
        timeline.finished = performance.now()
        observer.disconnect()
      }
    })
    observer.observe(document, { attributes: true, attributeFilter: ['data-opening-phase'], childList: true, subtree: true })
  })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const cover = dialog(page)
  const upper = cover.locator('[data-opening-panel="upper"]')
  const lower = cover.locator('[data-opening-panel="lower"]')
  await expect(cover).toBeVisible()
  expect((await upper.boundingBox())?.height).toBeCloseTo(667 * .58, 0)
  expect((await lower.boundingBox())?.height).toBeCloseTo(667 * .42, 0)
  await expect(cover.locator('[data-opening-percent]')).toHaveText('100%')
  await expect(cover).toHaveAttribute('data-opening-phase', 'open')
  await expect.poll(async () => {
    const u = await upper.boundingBox()
    const l = await lower.boundingBox()
    return !!u && !!l && u.y < -10 && l.y > 667 * .58 + 10
  }).toBe(true)
  await expectReleased(page)
  const elapsed = await page.evaluate(() => {
    const { began, finished } = (window as Window & { openingTimings?: { began: number; finished: number } })
      .openingTimings ?? { began: 0, finished: 0 }
    return finished - began
  })
  expect(elapsed).toBeGreaterThanOrEqual(2500)
  expect(elapsed).toBeLessThanOrEqual(3200)
  expect(videos).toEqual([])
  expect(errors).toEqual([])
})

const viewports = [
  [1332, 667], [1366, 768], [1440, 900], [1920, 1080], [768, 1024], [1024, 768],
  [320, 568], [375, 812], [390, 844], [430, 932], [667, 375], [683, 384], [390, 300],
]

for (const [width, height] of viewports) {
  test(`the cover fits ${width} × ${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await holdCover(page)
    const overflows = await dialog(page).evaluate((overlay, size) => {
      const epsilon = 1
      const parts = ['.opening-debuggers', '.opening-presents', '.opening-fleuron', '.opening-wordmark',
        '.opening-shield', '.opening-progress', '.opening-skip']
      return parts.filter(selector => {
        const item = overlay.querySelector(selector)!
        const bounds = item.getBoundingClientRect()
        const panel = item.closest('.opening-panel')?.getBoundingClientRect()
        return !bounds.width || !bounds.height || bounds.left < -epsilon || bounds.right > size.width + epsilon ||
          bounds.top < (panel?.top ?? 0) - epsilon || bounds.bottom > (panel?.bottom ?? size.height) + epsilon
      })
    }, { width, height })
    expect(overflows).toEqual([])
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
  })
}

test.describe('touch', () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } })

  test('a tap dismisses the cover and the next tap opens the simulation', async ({ page }) => {
    await holdCover(page)
    await dialog(page).getByRole('button', { name: 'Skip intro' }).tap()
    await expectReleased(page)
    await primary(page).tap()
    await expect(page).toHaveURL(/\/demo\/$/)
  })
})

test.describe('no JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('server markup stays hidden and the site can be navigated', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('[data-cinematic-opening]')).toHaveCount(1)
    await expect(page.locator('[data-cinematic-opening]')).toBeHidden()
    await expect(page.locator('html')).not.toHaveCSS('overflow-y', 'hidden')
    await expect(page.locator('#skillchain-app')).not.toHaveJSProperty('inert', true)
    await primary(page).click()
    await expect(page).toHaveURL(/\/demo\/$/)
  })
})
