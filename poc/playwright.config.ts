import { existsSync } from 'node:fs'
import { defineConfig } from '@playwright/test'

const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
export default defineConfig({
  testDir: './tests/browser',
  workers: 1,
  timeout: 65_000,
  use: {
    baseURL: 'http://127.0.0.1:5173',
    actionTimeout: 10_000,
    launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || (existsSync(chrome) ? chrome : undefined) },
  },
  webServer: {
    command: process.env.SKILLCHAIN_SMOKE_ONLY === '1' ? 'npm run dev' : 'npm run demo',
    url: 'http://127.0.0.1:5173/api/health',
    timeout: 60_000,
    reuseExistingServer: false,
  },
})
