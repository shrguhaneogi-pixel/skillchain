import { expect, test } from '@playwright/test'

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`scroll film follows the latest position at ${viewport.width}px`, async ({ page }, info) => {
    await page.setViewportSize(viewport)
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
    await page.goto('/')
    const hero = page.locator('[data-scroll-hero]')
    const video = hero.locator('video')
    await expect(hero).toHaveAttribute('data-scrub', 'true')
    const header = page.locator('.marketing-header')
    const nav = header.getByRole('link', { name: 'Try the demo', exact: true })
    const bounds = await header.boundingBox()
    const action = await nav.boundingBox()
    expect(action!.y + action!.height).toBeLessThanOrEqual(bounds!.y + bounds!.height)
    await expect(hero.locator('img')).toHaveJSProperty('complete', true)
    await expect(video).not.toHaveAttribute('src', /.+/)
    await page.screenshot({ path: info.outputPath('start.png') })

    const scroll = async (progress: number) => {
      await hero.evaluate((track, fraction) => {
        const stage = track.firstElementChild as HTMLElement
        const inset = parseFloat(getComputedStyle(stage).top)
        const distance = (track as HTMLElement).offsetHeight - stage.offsetHeight
        scrollTo(0, scrollY + track.getBoundingClientRect().top - inset + distance * fraction)
      }, progress)
    }
    const read = () => video.evaluate((element: HTMLVideoElement) => ({
      time: element.currentTime, duration: element.duration, paused: element.paused, seeking: element.seeking,
    }))
    const synchronized = async (progress: number) => {
      await expect.poll(async () => {
        const { time, duration, paused, seeking } = await read()
        return paused && !seeking && Math.abs(time - progress * duration) < 0.1
      }).toBe(true)
    }
    await scroll(0.5)
    await synchronized(0.5)
    const pinnedTop = (await hero.locator(':scope > div').boundingBox())?.y
    expect(pinnedTop).toBeGreaterThanOrEqual(59)
    expect(pinnedTop).toBeLessThanOrEqual(74)
    await page.screenshot({ path: info.outputPath('middle.png') })
    const held = (await read()).time
    await page.waitForTimeout(250)
    expect((await read()).time).toBe(held)
    await scroll(0.2)
    await synchronized(0.2)
    await scroll(0.96)
    await scroll(0.35)
    await scroll(1)
    await synchronized(1)
    await expect(hero).toHaveAttribute('data-ending', 'true')
    await expect(hero.getByRole('link', { name: 'Try SkillProof Demo' })).toHaveAttribute('href', '/demo/')
    await expect(hero.getByRole('link', { name: 'Explore the Platform' })).toHaveAttribute('href', '/skillproof/')
    await expect(page.locator('.marketing-header')).toBeInViewport()
    await page.screenshot({ path: info.outputPath('final.png') })
    await page.locator('#incident-desk').scrollIntoViewIfNeeded()
    await expect(page.locator('#incident-desk')).toBeInViewport()
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width)
    expect(errors).toEqual([])
  })
}

test('reduced motion keeps the poster and both actions without a pinned track', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const mediaRequests: string[] = []
  page.on('request', request => { if (request.url().endsWith('/scroll-hero.mp4')) mediaRequests.push(request.url()) })
  await page.goto('/')
  const hero = page.locator('[data-scroll-hero]')
  await expect(hero).toHaveAttribute('data-scrub', 'false')
  await expect(hero.locator(':scope > div')).toHaveCSS('position', 'static')
  await expect(hero.locator('img')).toBeVisible()
  await hero.getByRole('link', { name: 'Try SkillProof Demo' }).focus()
  await expect(hero.getByRole('link', { name: 'Try SkillProof Demo' })).toBeFocused()
  expect(mediaRequests).toEqual([])
  await hero.getByRole('link', { name: 'Try SkillProof Demo' }).press('Enter')
  await expect(page).toHaveURL(/\/demo\/$/)
  await page.goBack()
  await hero.getByRole('link', { name: 'Explore the Platform' }).click()
  await expect(page).toHaveURL(/\/skillproof\/$/)
})

test('a failed film returns to the poster without pinning the page', async ({ page }) => {
  await page.goto('/')
  const hero = page.locator('[data-scroll-hero]')
  await expect(hero).toHaveAttribute('data-scrub', 'true')
  // Use a real 404 so engines that load media outside request interception also exercise the fallback.
  await hero.locator('video').evaluate((player: HTMLVideoElement) => { player.src = '/media/missing-scroll-hero.mp4' })
  await expect(hero).toHaveAttribute('data-scrub', 'false')
  await expect(hero.locator('img')).toBeVisible()
  await expect(hero.getByRole('link', { name: 'Try SkillProof Demo' })).toBeVisible()
})
