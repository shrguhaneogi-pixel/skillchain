import { test as base } from '@playwright/test'
import { parchmentSessionKey } from '../../lib/parchmentDust'

export { expect, type Locator } from '@playwright/test'
export const test = base.extend({
  page: async ({ page }, run) => {
    await page.addInitScript(key => sessionStorage.setItem(key, '1'), parchmentSessionKey)
    await run(page)
  },
})
