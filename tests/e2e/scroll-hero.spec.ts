import { expect, test } from './home-fixture'

for (const [width, height] of [[1440, 900], [834, 1112], [390, 844]]) {
  test(`Home shows the simulation CTA and defers concept media at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    const films: string[] = []
    page.on('request', request => {
      if (request.url().includes('.mp4')) films.push(request.url())
    })
    await page.goto('/')
    const hero = page.locator('.home-hero')
    const cta = hero.getByRole('link', { name: 'Try the simulation' })
    await expect(cta).toBeInViewport({ ratio: 1 })
    await expect(page.locator('video')).toHaveCount(0)
    await page.waitForLoadState('networkidle')
    expect(films).toEqual([])

    await hero.getByRole('button', { name: 'Play', exact: true }).press('Enter')
    const player = hero.locator('video')
    await expect(player).toHaveAttribute('preload', 'none')
    await expect(player).toHaveAttribute('controls', '')
    await expect.poll(() => player.evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0)
    await expect.poll(() => player.evaluate((video: HTMLVideoElement) => video.textTracks[0].mode)).toBe('showing')
    await hero.getByText('Read transcript', { exact: true }).click()
    await expect(hero.getByText(/The workplace and evidence report shown/)).toBeVisible()
    expect(films.every(url => url.includes('/scroll-hero.mp4'))).toBe(true)
  })
}

test('the mobile hero keeps action rows when the control font arrives', async ({ page }) => {
  await page.setViewportSize({ width: 412, height: 823 })
  let releaseFont!: () => void
  const pendingFont = new Promise<void>(resolve => { releaseFont = resolve })
  await page.route('**/fonts/source.woff2', async route => {
    await pendingFont
    await route.continue()
  })
  try {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const hero = page.locator('.home-hero')
    const primary = hero.getByRole('link', { name: 'Try the simulation' })
    const secondary = hero.getByRole('link', { name: 'View a sample report' })
    const sameReadingOrder = async () => {
      const first = (await primary.boundingBox())!
      const second = (await secondary.boundingBox())!
      expect(second.y).toBeGreaterThanOrEqual(first.y + first.height)
    }
    await sameReadingOrder()
    releaseFont()
    await page.evaluate(() => document.fonts.ready)
    await sameReadingOrder()
  } finally {
    releaseFont()
  }
})
