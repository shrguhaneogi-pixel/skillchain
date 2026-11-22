// @vitest-environment happy-dom
import { readFileSync } from 'node:fs'
import { act, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import { IncidentDesk } from '../components/HomeInteractive'
import MarketingShell from '../components/MarketingShell'

vi.mock('next/navigation', () => ({usePathname: () => '/'}))

it.each([true, false])('renders a static incident desk with system reduced motion set to %s after the applicable preference', async systemReduced => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const media = vi.fn((query: string) => Object.assign(new EventTarget(), {
    media: query, matches: query === '(prefers-reduced-motion: reduce)' ? systemReduced : true,
  }))
  vi.stubGlobal('matchMedia', media)
  vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(900)
  vi.useFakeTimers({toFake:['requestAnimationFrame','cancelAnimationFrame']})
  const styles = document.createElement('style')
  styles.textContent = readFileSync('app/globals.css', 'utf8').replace(/^@import[^\n]+\n/, '')
  document.head.append(styles)
  const container = document.createElement('main')
  container.className = 'home'
  document.body.append(container)
  const root = createRoot(container)

  const flushFrame = async () => {
    await act(async () => {
      await Promise.resolve()
      await vi.advanceTimersByTimeAsync(50)
    })
  }

  try {
    act(() => root.render(createElement(MarketingShell, { children: createElement(IncidentDesk) })))
    await flushFrame()
    const stage = container.querySelector<HTMLElement>('.hero-stage')!
    const scene = stage.querySelector<HTMLElement>('.hero-scene')!
    const toggle = [...container.querySelectorAll('button')].find(b => b.textContent === 'Reduce motion')!
    expect(media).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')
    if (!systemReduced) {
      expect(stage.dataset.sticky).toBe('true')
      act(() => toggle.click())
      await flushFrame()
      expect(toggle.getAttribute('aria-pressed')).toBe('true')
      expect(document.documentElement.dataset.reducedMotion).toBe('true')
    }
    expect(stage.dataset.sticky).toBe('false')
    expect(stage.dataset.step).toBe('3')
    expect(getComputedStyle(scene).position).not.toBe('sticky')
    const rows = [stage.querySelector<HTMLElement>('.incident-rahul')!, stage.querySelector<HTMLElement>('.incident-alex')!]
    for (const row of rows) {
      expect(row.hidden).toBe(false)
      expect(row.getAttribute('aria-hidden')).toBeNull()
      expect(getComputedStyle(row).display).not.toBe('none')
      expect(getComputedStyle(row).opacity).not.toBe('0')
      expect(['', 'none']).toContain(getComputedStyle(row).transitionProperty)
      expect(['', 'none']).toContain(getComputedStyle(row).animationName)
    }
    expect(rows[0].textContent).toContain('The demo server is unresponsive.')
    expect(rows[1].textContent).toContain('The client demo is at 10:24.')
    const closing = stage.querySelector('.incident-end a')!
    expect(closing.textContent).toBe('Your decision changes what happens next.')
    expect(closing.getAttribute('href')).toBe('#preview')
    expect(getComputedStyle(closing.parentElement!).opacity).not.toBe('0')
    if (!systemReduced) act(() => toggle.click())
  } finally {
    act(() => root.unmount())
    delete document.documentElement.dataset.reducedMotion
    container.remove()
    styles.remove()
    vi.useRealTimers()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  }
})
