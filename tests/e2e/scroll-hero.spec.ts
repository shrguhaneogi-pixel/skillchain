import { expect, test } from './home-fixture'

const sizes = [[1366, 768], [1440, 900], [1920, 1080], [2560, 1080], [768, 1024], [390, 844]]

for (const [width, height] of sizes) {
  test(`scroll film flows and seeks at ${width}px`, async ({ page }, info) => {
    const viewport = { width, height }
    await page.setViewportSize(viewport)
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
    await page.goto('/')
    const hero = page.locator('[data-scroll-hero]')
    const stage = hero.locator('[data-hero-media]')
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
    const opening = (await stage.boundingBox())!
    expect(opening.x).toBeCloseTo(0, 0)
    expect(opening.width).toBeCloseTo(width, 0)
    expect(opening.width / opening.height).toBeCloseTo(16 / 9, 2)
    expect(opening.y).toBeGreaterThanOrEqual(bounds!.height - 1)
    await expect(stage).toHaveCSS('position', 'relative')
    const following = page.locator('#incident-desk')
    const followingTop = (await following.boundingBox())!.y
    expect(followingTop).toBeLessThan(height * 2)

    const scroll = async (progress: number) => {
      await stage.evaluate((media, fraction) => {
        const frame = media.getBoundingClientRect()
        const header = document.querySelector<HTMLElement>('.marketing-header')!
        scrollTo(0, scrollY + frame.top - header.offsetHeight + frame.height * 0.48 * fraction)
      }, progress)
    }
    const read = () => video.evaluate((element: HTMLVideoElement) => ({
      time: element.currentTime, duration: element.duration, paused: element.paused, seeking: element.seeking,
    }))
    const synchronized = async (progress: number) => {
      await expect.poll(async () => {
        const { time, duration, paused, seeking } = await read()
        return paused && !seeking && Math.abs(time - progress * duration) < 0.18
      }).toBe(true)
    }
    await scroll(0.5)
    await synchronized(0.5)
    expect((await stage.boundingBox())!.y).toBeLessThan(opening.y - 35)
    expect((await following.boundingBox())!.y).toBeLessThan(followingTop - 35)
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
    await expect(hero).toHaveAttribute('data-frame', 'true')
    await expect(hero.getByRole('link', { name: 'Try SkillProof Demo' })).toHaveAttribute('href', '/demo/')
    await expect(hero.getByRole('link', { name: 'Explore the Platform' })).toHaveAttribute('href', '/skillproof/')
    await expect(page.locator('.marketing-header')).toBeInViewport()
    await page.screenshot({ path: info.outputPath('final.png') })
    await following.scrollIntoViewIfNeeded()
    await expect(following).toBeInViewport()
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width)
    expect(errors).toEqual([])
  })
}

test('reduced motion keeps the poster, visible screenshots and both actions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const mediaRequests: string[] = []
  page.on('request', request => { if (request.url().endsWith('/scroll-hero.mp4')) mediaRequests.push(request.url()) })
  await page.goto('/')
  const hero = page.locator('[data-scroll-hero]')
  await expect(hero).toHaveAttribute('data-scrub', 'false')
  await expect(page.locator('.bento-tile img').last()).toHaveCSS('clip-path', 'none')
  await expect(page.locator('.bento-tile img').last()).toHaveCSS('opacity', '1')
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

test('a failed film returns to the poster with the same layout', async ({ page }) => {
  await page.goto('/')
  const hero = page.locator('[data-scroll-hero]')
  await expect(hero).toHaveAttribute('data-scrub', 'true')
  const height = (await hero.boundingBox())!.height
  // Use a real 404 so engines that load media outside request interception also exercise the fallback.
  await hero.locator('video').evaluate((player: HTMLVideoElement) => { player.src = '/media/missing-scroll-hero.mp4' })
  await expect(hero).toHaveAttribute('data-scrub', 'false')
  await expect(hero.locator('img')).toBeVisible()
  await expect(hero.getByRole('link', { name: 'Try SkillProof Demo' })).toBeVisible()
  expect((await hero.boundingBox())!.height).toBe(height)
})

test('resize and browser back keep the current frame synchronized', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 })
  await page.goto('/')
  const hero = page.locator('[data-scroll-hero]')
  const media = hero.locator('[data-hero-media]')
  const video = hero.locator('video')
  await page.evaluate(() => scrollTo(0, 150))
  await expect(hero).toHaveAttribute('data-frame', 'true')
  const originalTime = await video.evaluate(element => (element as HTMLVideoElement).currentTime)
  await page.setViewportSize({ width: 1920, height: 1080 })
  await expect.poll(() => video.evaluate(element => (element as HTMLVideoElement).currentTime)).toBeLessThan(originalTime - 0.5)
  await page.evaluate(() => history.scrollRestoration = 'auto')
  await page.goto('/skillproof/')
  await page.goBack()
  await expect(hero).toHaveAttribute('data-frame', 'true')
  await expect.poll(async () => {
    const travel = await media.evaluate(el => {
      const rect = el.getBoundingClientRect()
      return (document.querySelector<HTMLElement>('.marketing-header')!.offsetHeight - rect.top) / rect.height
    })
    const { time, duration } = await video.evaluate(el => {
      const film = el as HTMLVideoElement
      return { time: film.currentTime, duration: film.duration }
    })
    return Math.abs(time - travel / 0.48 * duration)
  }).toBeLessThan(0.15)
})
