// @vitest-environment happy-dom
import { act, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import Demo from '../components/Demo'
import { incidents } from '../lib/engine'

const push = vi.hoisted(() => vi.fn())
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }))

let root: ReturnType<typeof createRoot>
let container: HTMLDivElement
let now: number
let hidden: boolean

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] })
  now = 0
  hidden = false
  vi.spyOn(document, 'hidden', 'get').mockImplementation(() => hidden)
  push.mockClear()
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function click(selector: string, text?: string) {
  const matches = Array.from(container.querySelectorAll<HTMLElement>(selector))
  const element = text ? matches.find(item => item.textContent?.includes(text)) : matches[0]
  expect(element, text ?? selector).toBeDefined()
  act(() => element!.click())
}

function begin(mode: 'Timed practice' | 'Self-paced') {
  act(() => root.render(createElement(Demo, { now: () => now })))
  click('label', mode)
  click('input[type=checkbox]')
  click('button', 'Start simulation')
}

function tick(at: number) {
  now = at
  act(() => vi.advanceTimersByTime(150))
}

function visibility(value: boolean) {
  hidden = value
  act(() => document.dispatchEvent(new Event('visibilitychange')))
}

it('excludes hidden time, resumes at the exact deadline boundary, and records one reply', () => {
  begin('Timed practice')
  for (let at = 1500; at < 44_999; at += 1500) tick(at)
  tick(44_999)
  expect(container.textContent).toContain('Practice time remaining · 1s')
  now = 51_200
  visibility(true)
  expect(container.querySelector('dialog[open]')?.textContent).toContain('Simulation paused')
  tick(150_000)
  visibility(false)
  expect(container.querySelector('dialog[open]')?.textContent).toContain('Resume')
  expect(container.textContent).toContain('Practice time remaining · 1s')
  click('button', 'Resume')
  click('label', incidents[0].choices[0])
  click('button', 'Send reply')
  click('button', 'History')
  expect(container.textContent?.split(incidents[0].choices[0])).toHaveLength(2)
  expect(container.textContent).not.toMatch(/No reply|Insufficient evidence/i)
})

it('requires manual resume after an abnormal scheduling gap without a visibility event', () => {
  begin('Timed practice')
  tick(1200)
  const before = container.querySelector('.deskhead')?.textContent
  tick(46_000)
  expect(container.querySelector('dialog[open]')?.textContent).toContain('Resume')
  expect(container.querySelector('.deskhead')?.textContent).toBe(before)
  click('button', 'Resume')
  tick(46_150)
  expect(container.querySelector('dialog[open]')).toBeNull()
  expect(container.querySelector('input[name=reply]')).toBeTruthy()
})

it.each([0, 1] as const)('runs a full preset path (%s) without transport, storage, or address leakage', choice => {
  const forbidden = vi.fn(() => { throw Error('Unexpected browser transport or storage access') })
  for (const name of ['fetch', 'XMLHttpRequest', 'WebSocket']) vi.stubGlobal(name, forbidden)
  for (const name of ['localStorage', 'sessionStorage'] as const) vi.spyOn(window, name, 'get').mockImplementation(forbidden)
  vi.stubGlobal('indexedDB', new Proxy({}, { get: forbidden }))
  vi.spyOn(document, 'cookie', 'get').mockImplementation(forbidden)
  vi.spyOn(document, 'cookie', 'set').mockImplementation(forbidden)
  vi.spyOn(navigator, 'sendBeacon').mockImplementation(forbidden)
  const startingAddress = location.href
  const inspectLinks = () => {
    expect(location.href).toBe(startingAddress)
    for (const link of container.querySelectorAll('a')) {
      const url = new URL(link.href)
      expect(url.pathname).toMatch(/^\/(?:privacy\/|terms\/|about\/|contact\/)?$/)
      expect(url.search).toBe('')
      expect(url.hash).toBe('')
    }
  }
  begin('Self-paced')
  inspectLinks()
  incidents.forEach((incident, index) => {
    if (index) click('button', incident.sender)
    click('label', incident.choices[choice])
    click('button', 'Send reply')
    inspectLinks()
  })
  click('button', 'Finish simulation')
  expect(container.querySelector('[data-testid=candidate-feedback]')?.textContent).not.toMatch(/score|grade|[012]\/2/i)
  inspectLinks()
  click('button', 'Explore fictional recruiter view')
  expect(container.textContent).toContain('Your practice run')
  expect(container.querySelectorAll('.finding')).toHaveLength(3)
  inspectLinks()
  expect(push).not.toHaveBeenCalled()
  expect(forbidden).not.toHaveBeenCalled()
})
