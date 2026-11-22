import { ESLint } from 'eslint'
import { expect, it } from 'vitest'

it('rejects transport, browser persistence and analytics references in demo code', async () => {
  const samples = [
    'localStorage.length', 'sessionStorage.length', 'indexedDB.open("test")', 'document.cookie',
    'fetch("/")', 'new XMLHttpRequest()', 'navigator.sendBeacon("/")', 'new WebSocket("ws://localhost")',
    'window["localStorage"]', 'import analytics from "@vercel/analytics"',
  ]
  const linter = new ESLint()
  for (const sample of samples) {
    const [result] = await linter.lintText(sample, { filePath: 'components/Demo.tsx' })
    expect(result.messages.some(message => message.severity === 2 && message.ruleId?.startsWith('no-restricted')), sample).toBe(true)
  }
})
