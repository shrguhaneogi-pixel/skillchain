import { test as base } from '@playwright/test'
import { introSessionKey } from '../../lib/cinematicIntro'

export { expect } from '@playwright/test'

export const test = base.extend({
  page: async ({ page }, run) => {
    await page.addInitScript(key => sessionStorage.setItem(key, '1'), introSessionKey)
    await run(page)
  },
})
