import { expect, test } from '@playwright/test'

test('Vite sign-in screen receives the Fastify health response', async ({ page }) => {
  const external: string[] = []
  page.on('request', request => {
    if (!request.url().startsWith('http://127.0.0.1:5173/')) external.push(request.url())
  })
  await page.setViewportSize({ width: 390, height: 844 })
  const response = page.waitForResponse('**/api/health')
  await page.goto('/')
  expect((await (await response).json()).status).toBe('ready')
  await expect(page.getByText(/API ready/)).toBeVisible()
  await expect(page.getByRole('button', { name: /Mira Sen/ })).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()
  const layout = await page.evaluate(async () => {
    await document.fonts.ready
    return { width: document.documentElement.scrollWidth, localFontFaces: [...document.fonts].filter(font => font.status === 'loaded').length }
  })
  expect(layout.width).toBeLessThanOrEqual(390)
  expect(layout.localFontFaces).toBeGreaterThan(0)
  expect(external).toEqual([])
})
