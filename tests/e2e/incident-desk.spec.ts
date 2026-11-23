import { expect, test } from './home-fixture'

const viewports = [[1440, 900], [834, 1112], [390, 844], [320, 640]]

for (const [width, height] of viewports) {
  test(`both replies update the task and leave keyboard focus in place at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/#preview')
    const desk = page.locator('#preview')
    const inbox = desk.locator('.incident-inbox')
    const task = desk.locator('.incident-task')
    const fields = task.locator('dd')
    const status = task.getByRole('status')
    const assign = inbox.getByRole('button', { name: 'Assign Rahul and ask for a checkpoint' })
    const hold = inbox.getByRole('button', { name: 'Hold while I investigate' })
    const reset = task.getByRole('button', { name: 'Try the other reply' })

    const inboxBox = (await inbox.boundingBox())!
    const taskBox = (await task.boundingBox())!
    if (width >= 768) {
      expect(taskBox.y).toBe(inboxBox.y)
      expect(taskBox.x).toBeGreaterThanOrEqual(inboxBox.x + inboxBox.width)
    } else {
      expect(taskBox.y).toBeGreaterThanOrEqual(inboxBox.y + inboxBox.height)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
    await expect(fields).toHaveText(['Unassigned', 'Waiting'])

    await assign.press('Enter')
    await expect(assign).toBeFocused()
    await expect(assign).toHaveAttribute('aria-pressed', 'true')
    await expect(assign).toHaveCSS('background-color', 'rgb(184, 35, 50)')
    await expect(assign).toHaveCSS('color', 'rgb(255, 255, 255)')
    await expect(fields).toHaveText(['Rahul', 'In progress'])
    await expect(status).toContainText('Updated · Rahul / In progress')
    await expect(task.locator('.task-fields')).toHaveCSS('animation-name', 'none')
    await expect(task.getByRole('link', { name: 'Start the full simulation' })).toHaveAttribute('href', '/demo/')

    await reset.press('Enter')
    await expect(assign).toBeFocused()
    await expect(fields).toHaveText(['Unassigned', 'Waiting'])
    await expect(status).toBeEmpty()

    await assign.press('Tab')
    await expect(hold).toBeFocused()
    await hold.press('Space')
    await expect(hold).toBeFocused()
    await expect(fields).toHaveText(['Coordinator', 'Waiting'])
    await expect(status).toContainText('Updated · Coordinator / Waiting. Recovery is waiting on you.')
    await expect(task.getByRole('status')).toHaveCount(1)
  })
}
