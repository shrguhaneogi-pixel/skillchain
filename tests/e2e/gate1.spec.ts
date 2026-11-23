import { expect, test, type Page } from '@playwright/test'

async function openBriefing(page: Page, selfPaced = false) {
  await page.goto('/demo/')
  if (selfPaced) await page.getByLabel('Self-paced', { exact: true }).check()
  await page.getByRole('checkbox').check()
}

async function startPractice(page: Page, selfPaced = false) {
  await openBriefing(page, selfPaced)
  await page.getByRole('button', { name: 'Start simulation' }).click()
}

async function browserStorage(page: Page) {
  return page.evaluate(async () => ({
    local: Object.entries(localStorage).sort(),
    session: Object.entries(sessionStorage).sort(),
    indexed: (await indexedDB.databases()).sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '')),
  }))
}

for (const path of ['A', 'B']) {
  test('real UI ' + [path, path, path].join('/'), async ({ page, context }, info) => {
    await openBriefing(page, true)
    await page.waitForLoadState('networkidle')
    const initialUrl = page.url()
    const origin = new URL(initialUrl).origin
    const before = await browserStorage(page)
    const cookies = await context.cookies(origin)
    const calls: { method: string; type: string; pathname: string; firstParty: boolean; staticAsset: boolean }[] = []
    const sockets: string[] = []
    const cookieWrites: Promise<boolean>[] = []
    page.on('request', request => {
      const url = new URL(request.url())
      calls.push({
        method: request.method(),
        type: request.resourceType(),
        pathname: url.pathname,
        firstParty: url.origin === origin,
        staticAsset: !url.search && !request.postData() &&
          /^\/(?:_next\/static|brand|fonts|media)\//.test(url.pathname),
      })
    })
    page.on('response', response => {
      cookieWrites.push(response.headerValue('set-cookie').then(value => value !== null))
    })
    page.on('websocket', socket => sockets.push(new URL(socket.url()).origin))
    const urlsDuringRun = [page.url()]
    await page.getByRole('button', { name: 'Start simulation' }).click()
    for (const [i, sender] of ['Rahul Kapoor', 'Alex Morgan', 'Meera Sen'].entries()) {
      if (i) await page.getByRole('button', { name: new RegExp(sender) }).click()
      await page.getByRole('radio').nth(path === 'A' ? 0 : 1).check()
      await page.getByRole('button', { name: 'Send reply', exact: true }).click()
      urlsDuringRun.push(page.url())
      if (i === 0) {
        await page.getByRole('button', { name: 'Tasks', exact: true }).click()
        await page.getByRole('button', { name: 'Edit task', exact: true }).click()
        await page.getByLabel('Change owner').selectOption('Alex')
        await page.getByRole('button', { name: 'Save change' }).click()
        await expect(page.locator('.taskcard').filter({ hasText: 'Recovery check' })).toContainText('Current board: Alex')
        urlsDuringRun.push(page.url())
        await page.getByRole('button', { name: 'Inbox', exact: true }).click()
      }
    }
    await page.getByRole('button', { name: 'Finish simulation' }).click()
    const feedback = page.getByTestId('candidate-feedback')
    await expect(feedback.getByRole('heading')).toHaveText(['Strengths', 'Areas to practise'])
    urlsDuringRun.push(page.url())
    expect(await page.locator('main').ariaSnapshot()).not.toMatch(/score|\/2|percentile|rank|grade/i)
    await page.screenshot({ path: info.outputPath('candidate.png') })
    await page.getByRole('button', { name: 'Explore fictional recruiter view' }).click()
    await expect(page.getByRole('heading', { name: 'Your practice run' })).toBeVisible()
    urlsDuringRun.push(page.url())
    await expect(page.locator('.finding b')).toHaveText(
      path === 'A' ? ['2/2', '2/2', '2/2'] : ['1/2', '0/2', '0/2'])
    await page.getByRole('button', { name: 'View source for Client communication' }).click()
    await expect(page.locator('.source')).toContainText(path === 'A' ? 'name Rahul' : 'recovery promise')
    await page.screenshot({ path: info.outputPath('reviewer.png') })
    urlsDuringRun.push(page.url())
    await page.waitForLoadState('networkidle')
    const after = await browserStorage(page)
    const unchanged = {
      localStorage: JSON.stringify(after.local) === JSON.stringify(before.local),
      sessionStorage: JSON.stringify(after.session) === JSON.stringify(before.session),
      indexedDB: JSON.stringify(after.indexed) === JSON.stringify(before.indexed),
      cookies: JSON.stringify(await context.cookies(origin)) === JSON.stringify(cookies),
    }
    const setCookieResponses = (await Promise.all(cookieWrites)).filter(Boolean).length
    const unexpected = calls.filter(call => call.method !== 'GET' || !call.firstParty || !call.staticAsset ||
      ['xhr', 'fetch', 'ping', 'eventsource'].includes(call.type))
    await info.attach('browser data audit', {
      contentType: 'application/json',
      body: JSON.stringify({ path, origin, urlsDuringRun, unchanged, calls, sockets, setCookieResponses }, null, 2),
    })
    expect(new Set(urlsDuringRun)).toEqual(new Set([initialUrl]))
    expect(new URL(initialUrl).search + new URL(initialUrl).hash).toBe('')
    expect(unchanged).toEqual({ localStorage: true, sessionStorage: true, indexedDB: true, cookies: true })
    expect(unexpected).toEqual([])
    expect(sockets).toEqual([])
    expect(setCookieResponses).toBe(0)
    await page.goto('/fairhire/#report')
    await expect(page.getByRole('heading', { name: 'Candidate C-017' })).toBeVisible()
    await expect(page.locator('.finding b')).toHaveText(['2/2', '2/2', '2/2'])
  })
}

test('timing, pause, missed windows, task history and restart', async ({ page }) => {
  await page.clock.install()
  await startPractice(page)
  await page.getByRole('button', { name: 'Pause', exact: true }).click()
  await page.clock.fastForward(150000)
  await page.getByRole('button', { name: 'Resume' }).click()
  await page.getByRole('radio').first().check()
  await page.getByRole('button', { name: 'Send reply' }).click()
  await page.getByRole('button', { name: 'Tasks', exact: true }).click()
  await page.getByRole('button', { name: 'Edit task' }).click()
  await page.getByLabel('Change owner').selectOption('Alex')
  await page.getByRole('button', { name: 'Save change' }).click()
  await expect(page.locator('.taskcard').filter({ hasText: 'Recovery check' })).toContainText('At decision: Rahul')
  // Advance active time through regular ticks. A single jump models a sleeping
  // tab, which the demo intentionally pauses.
  await page.clock.runFor(126000)
  await page.getByRole('button', { name: 'Finish simulation' }).click()
  await page.getByRole('button', { name: 'Explore fictional recruiter view' }).click()
  await expect(page.locator('.finding b')).toHaveText(['2/2', 'Insufficient evidence', 'Insufficient evidence'])
  await page.getByRole('button', { name: 'Play again', exact: true }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Play again' }).click()
  await expect(page.getByRole('checkbox')).not.toBeChecked()
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Start simulation' }).click()
  await page.reload()
  await expect(page.getByRole('button', { name: 'Start simulation' })).toBeDisabled()
})

test('self-paced skip keeps the missing observations distinct', async ({ page }) => {
  await startPractice(page, true)
  await page.getByRole('button', { name: 'Continue without a reply' }).click()
  await page.getByRole('button', { name: /Alex Morgan/ }).click()
  await page.getByRole('radio').first().check()
  await page.getByRole('button', { name: 'Send reply' }).click()
  await page.getByRole('button', { name: /Meera Sen/ }).click()
  await page.getByRole('button', { name: 'Continue without a reply' }).click()
  await page.getByRole('button', { name: 'Finish simulation' }).click()
  await page.getByRole('button', { name: 'Explore fictional recruiter view' }).click()
  await expect(page.locator('.finding b')).toHaveText(['Insufficient evidence', '2/2', 'Insufficient evidence'])
})
