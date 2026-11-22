import { expect, test, type Locator } from '@playwright/test'

async function enter(picture: Locator, fraction: number) {
  await picture.evaluate((element, progress) => {
    const { top, height } = element.getBoundingClientRect()
    scrollTo(0, scrollY + top - innerHeight + Math.min(height, innerHeight) * progress)
  }, fraction)
}

for (const fallback of [false, true]) {
  test(`product images open independently and reverse${fallback ? ' without View Timelines' : ''}`, async ({ page }, info) => {
    if (fallback) await page.addInitScript(() => {
      const supports = CSS.supports.bind(CSS)
      CSS.supports = (...args: [string, string?]) => args[0].startsWith('view-timeline-name:') ? false
        : args[1] === undefined ? supports(args[0]) : supports(args[0], args[1])
    })
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    const grid = page.locator('.bento')
    if (fallback) await expect(grid).toHaveAttribute('data-reveal-fallback', '')
    const first = grid.locator('picture').first()
    const last = grid.locator('picture').last()
    const firstImage = first.locator('img')
    const opacity = (picture: Locator) => picture.locator('img').evaluate(img => Number(getComputedStyle(img).opacity))

    await enter(first, 0.35)
    await expect.poll(() => opacity(first)).toBeGreaterThan(0.2)
    await expect.poll(() => opacity(first)).toBeLessThan(0.8)
    await expect(firstImage).not.toHaveCSS('clip-path', 'none')
    await page.screenshot({ path: info.outputPath('revealing.png') })
    await enter(first, 0.96)
    await expect(firstImage).toHaveCSS('opacity', '1')
    await enter(last, 0.35)
    await expect.poll(() => opacity(last)).toBeLessThan(0.8)
    await expect(firstImage).toHaveCSS('opacity', '1')
    await enter(first, 0.35)
    await expect.poll(() => opacity(first)).toBeLessThan(0.8)
    await page.keyboard.press('Tab')
    const link = grid.getByRole('link', { name: /Inside the mailbox/ })
    await link.focus()
    await expect(link).toBeFocused()
    await expect(firstImage).toHaveCSS('opacity', '1')
    await link.press('Enter')
    await expect(page).toHaveURL(/\/skillproof\/#mailbox$/)
  })
}
