import {defineConfig} from 'vitest/config'
export default defineConfig({test:{include:['tests/**/*.test.{ts,tsx}']},resolve:{alias:{'@':new URL('.',import.meta.url).pathname}}})
