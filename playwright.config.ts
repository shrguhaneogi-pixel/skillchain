import {defineConfig} from '@playwright/test'
export default defineConfig({testDir:'tests/e2e',timeout:45000,workers:2,use:{baseURL:process.env.PLAYWRIGHT_BASE_URL||'http://localhost:3000',trace:'on',launchOptions:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE}:{}},reporter:'list'})
