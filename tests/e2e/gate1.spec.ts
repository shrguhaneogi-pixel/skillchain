import { expect, test, type Page } from '@playwright/test'

async function startPractice(page: Page, selfPaced = false) {
  await page.goto('/demo/')
  if (selfPaced) await page.getByLabel('Self-paced', { exact: true }).check()
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Start simulation' }).click()
}

for (const path of ['A', 'B']) {
  test('real UI ' + [path, path, path].join('/'), async ({ page }, info) => {
    await startPractice(page, true)
    const calls: string[] = []
    page.on('request', request => {
      if (request.method() !== 'GET' || request.postData() ||
          ['xhr', 'fetch', 'ping', 'eventsource'].includes(request.resourceType())) {
        calls.push(request.method() + ' ' + request.url())
      }
    })
    page.on('websocket', socket => calls.push(socket.url()))
    for (const [i, sender] of ['Rahul Kapoor', 'Alex Morgan', 'Meera Sen'].entries()) {
      if (i) await page.getByRole('button', { name: new RegExp(sender) }).click()
      await page.getByRole('radio').nth(path === 'A' ? 0 : 1).check()
      await page.getByRole('button', { name: 'Send reply', exact: true }).click()
    }
    await page.getByRole('button', { name: 'Finish simulation' }).click()
    const feedback = page.getByTestId('candidate-feedback')
    await expect(feedback.getByRole('heading')).toHaveText(['Strengths', 'Areas to practise'])
    expect(await page.locator('main').ariaSnapshot()).not.toMatch(/score|\/2|percentile|rank|grade/i)
    await page.screenshot({ path: info.outputPath('candidate.png') })
    await page.getByRole('button', { name: 'Explore fictional recruiter view' }).click()
    await expect(page.getByRole('heading', { name: 'Your practice run' })).toBeVisible()
    await expect(page.locator('.finding b')).toHaveText(
      path === 'A' ? ['2/2', '2/2', '2/2'] : ['1/2', '0/2', '0/2'])
    await page.getByRole('button', { name: 'View source for Client communication' }).click()
    await expect(page.locator('.source')).toContainText(path === 'A' ? 'name Rahul' : 'recovery promise')
    await page.screenshot({ path: info.outputPath('reviewer.png') })
    expect(new URL(page.url()).search + new URL(page.url()).hash).toBe('')
    expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0])
    expect(calls).toEqual([])
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
  await page.clock.fastForward(126000)
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
