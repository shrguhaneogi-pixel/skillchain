import { expect, test } from '@playwright/test'

test('the orb follows the mouse and responds to marketing targets', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/')
  const orb = page.locator('[data-linked-orb]')
  const root = page.locator('html')
  const platform = page.getByRole('button', { name: 'Platform', exact: true })

  await page.mouse.move(740, 35)
  await expect(orb).toHaveAttribute('data-mode', 'default')
  await expect(orb).toHaveCSS('pointer-events', 'none')
  await expect.poll(() => orb.evaluate(el => {
    const transform = new DOMMatrix(getComputedStyle(el).transform)
    return [transform.m41, transform.m42]
  })).toEqual([740, 35])
  await platform.hover({ position: { x: 8, y: 8 } })
  await expect(orb).toHaveAttribute('data-mode', 'magnetic')
  const bounds = (await platform.boundingBox())!
  await expect.poll(async () => orb.evaluate((el, pointerX) => new DOMMatrix(getComputedStyle(el).transform).m41 - pointerX, bounds.x + 8)).toBeGreaterThan(1)
  await page.mouse.down()
  await expect(orb).toHaveAttribute('data-pressed', '')
  await page.mouse.up()
  await expect(orb).not.toHaveAttribute('data-pressed', '')
  await expect(platform).toHaveAttribute('aria-expanded', 'true')
  await page.keyboard.press('Escape')
  await expect(platform).toBeFocused()
  await expect(root).not.toHaveAttribute('data-linked-cursor-active', '')

  await page.mouse.move(700, 300)
  await expect(orb).toHaveAttribute('data-tone', 'dark')
  const bento = page.locator('[data-cursor="view"]').first()
  await bento.locator('img').hover()
  await expect(orb).toHaveAttribute('data-mode', 'view')
  await expect(orb.getByText('VIEW')).toHaveCSS('opacity', '1')
  await page.mouse.move(-5, -5)
  await expect(orb).not.toHaveAttribute('data-visible', '')
  await bento.click()
  await expect(page).toHaveURL(/\/skillproof\/#mailbox$/)
  expect(errors).toEqual([])
})

test('pricing uses magnetic buttons and leaves native cursors in inputs and the demo', async ({ page }) => {
  await page.goto('/pricing/')
  const orb = page.locator('[data-linked-orb]')
  const action = page.locator('main button').first()
  await action.hover()
  await expect(orb).toHaveAttribute('data-mode', 'magnetic')
  const field = page.locator('main input').first()
  await field.hover()
  await expect(orb).not.toHaveAttribute('data-visible', '')
  await expect(field).not.toHaveCSS('cursor', 'none')
  await page.goto('/demo/')
  await page.mouse.move(300, 300)
  await expect(orb).toHaveCount(0)
  await expect(page.locator('html')).not.toHaveAttribute('data-linked-cursor-active', '')
})

test('system reduced motion and touch preserve the native pointer', async ({ browser, page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.mouse.move(300, 300)
  await expect(page.locator('[data-linked-orb]')).toHaveCSS('display', 'none')
  await expect(page.locator('html')).not.toHaveAttribute('data-linked-cursor-active', '')

  const mobile = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } })
  try {
    const touch = await mobile.newPage()
    await touch.goto(page.url())
    await touch.touchscreen.tap(300, 300)
    await expect(touch.locator('[data-linked-orb]')).toHaveCSS('display', 'none')
    await expect(touch.locator('html')).not.toHaveAttribute('data-linked-cursor-active', '')
  } finally { await mobile.close() }
})
