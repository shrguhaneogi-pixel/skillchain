import { expect, test } from '@playwright/test'

const viewports = [
  { width: 1920, height: 1080, x: 0.5, y: 0.5 },
  { width: 1366, height: 768, x: 0.01, y: 0.01 },
  { width: 2560, height: 1080, x: 0.99, y: 0.01 },
  { width: 768, height: 1024, x: 0.01, y: 0.98 },
  { width: 1440, height: 900, x: 0.99, y: 0.98 },
]

for (const point of viewports) {
  test(`parchment erodes from ${point.x}, ${point.y} at ${point.width}px`, async ({ page }, info) => {
    const { width, height } = point
    await page.setViewportSize({ width, height })
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    const films: string[] = []
    page.on('request', request => { if (request.url().endsWith('/scroll-hero.mp4')) films.push(request.url()) })
    await page.goto('/')
    const overlay = page.locator('[data-parchment-intro]')
    await expect(overlay.getByRole('button', { name: 'Enter SkillChain' })).toBeFocused()
    await expect(overlay.locator('img')).toHaveJSProperty('complete', true)
    expect(await overlay.boundingBox()).toEqual({ x: 0, y: 0, width, height })
    const emblem = (await overlay.locator('img').boundingBox())!
    expect(emblem.x + emblem.width / 2).toBeCloseTo(width / 2, 0)
    expect(emblem.y + emblem.height / 2).toBeCloseTo(height / 2, 0)
    await expect(page.locator('main').locator('xpath=ancestor::*[@inert]')).toHaveCount(1)
    await page.clock.install({ time: 0 })
    await page.clock.pauseAt(60_000)
    await page.mouse.click(width * point.x, height * point.y)
    await expect(overlay).toHaveAttribute('data-phase', 'dust')
    await page.clock.runFor(150)
    const source = { x: point.x, y: point.y }
    const alpha = await overlay.locator('[data-parchment-sheet]').evaluate((element, origin) => {
      const canvas = element as HTMLCanvasElement
      const ctx = canvas.getContext('2d')!
      const read = (x: number, y: number) => ctx.getImageData(Math.floor(x * canvas.width), Math.floor(y * canvas.height), 1, 1).data[3]
      return [read(origin.x, origin.y), read(origin.x < 0.5 ? 0.95 : 0.05, origin.y < 0.5 ? 0.95 : 0.05)]
    }, source)
    expect(alpha).toEqual([0, 255])
    await page.clock.runFor(320)
    await page.screenshot({ path: info.outputPath('dust.png') })
    await page.clock.runFor(1100)
    await expect(overlay).toHaveCount(0)
    await expect(page.locator('main h1')).toBeFocused()
    await expect(page.locator('[inert]')).toHaveCount(0)
    expect(films).toEqual([])
    expect(errors).toEqual([])
    await page.reload()
    await expect(overlay).toHaveCount(0)
  })
}

test('touch enters from an off-center tap and stays dismissed across navigation', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, deviceScaleFactor: 3 })
  try {
    const page = await context.newPage()
    await page.goto(baseURL!)
    const overlay = page.locator('[data-parchment-intro]')
    await expect(overlay.getByText('Tap anywhere to enter')).toBeVisible()
    await page.clock.install({ time: 0 })
    await page.clock.pauseAt(60_000)
    await page.touchscreen.tap(326, 735)
    await page.clock.runFor(180)
    const alpha = await overlay.locator('[data-parchment-sheet]').evaluate(el => {
      const canvas = el as HTMLCanvasElement
      return canvas.getContext('2d')!.getImageData(Math.floor(326 * canvas.width / 390), Math.floor(735 * canvas.height / 844), 1, 1).data[3]
    })
    expect(alpha).toBe(0)
    expect(await overlay.locator('[data-parchment-sheet]').evaluate(el => (el as HTMLCanvasElement).width)).toBeLessThanOrEqual(527)
    await page.clock.runFor(1450)
    await expect(overlay).toHaveCount(0)
    await page.goto(new URL('/pricing/', baseURL).href)
    await page.goBack()
    await expect(overlay).toHaveCount(0)
  } finally { await context.close() }
})

for (const key of ['Enter', 'Space']) {
  test(`${key} dismisses the entrance using the reduced-motion fade`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const overlay = page.locator('[data-parchment-intro]')
    await expect(overlay.getByRole('button', { name: 'Enter SkillChain' })).toBeFocused()
    await page.clock.install({ time: 0 })
    await page.clock.pauseAt(60_000)
    await page.keyboard.press(key)
    await expect(overlay).toHaveAttribute('data-phase', 'fade')
    await expect(overlay.locator('canvas').first()).toHaveCSS('visibility', 'hidden')
    await page.clock.runFor(300)
    await expect(overlay).toHaveCount(0)
  })
}

test('keyboard skip restores navigation immediately', async ({ page }) => {
  await page.goto('/')
  const overlay = page.locator('[data-parchment-intro]')
  await expect(overlay.getByRole('button', { name: 'Enter SkillChain' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(overlay.getByRole('button', { name: 'Skip intro' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(overlay).toHaveCount(0)
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Pricing' }).first().click()
  await expect(page).toHaveURL(/\/pricing\/$/)
})

test('the homepage remains available with JavaScript disabled', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  try {
    const page = await context.newPage()
    await page.goto(baseURL!)
    await expect(page.locator('[data-parchment-intro]')).toBeHidden()
    await expect(page.locator('html')).not.toHaveCSS('overflow-y', 'hidden')
    await expect(page.locator('main h1')).toBeVisible()
  } finally { await context.close() }
})
