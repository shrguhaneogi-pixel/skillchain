import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import CinematicOpening from '../components/opening/CinematicOpening'
import { getIntroFrame, introSessionKey, shouldPlayIntro } from '../lib/cinematicIntro'

describe('opening timeline', () => {
  it.each([
    [0, 'cover', 0, 0],
    [1700, 'hold', 1, 0],
    [1900, 'open', 1, 0],
    [3000, 'done', 1, 1],
  ])('sets the exact frame at %i ms', (time, phase, progress, panelOffset) => {
    expect(getIntroFrame(time)).toEqual({ phase, progress, panelOffset })
  })

  it('eases to 100% and opens symmetrically', () => {
    expect(getIntroFrame(419).progress).toBeCloseTo(.57, 2)
    expect(getIntroFrame(850).progress).toBeGreaterThan(.5)
    expect(getIntroFrame(1699).progress).toBeLessThan(1)
    expect(getIntroFrame(2175).panelOffset).toBeLessThan(.14)
    expect(getIntroFrame(2450).panelOffset).toBeCloseTo(.5, 4)
    expect(getIntroFrame(2725).panelOffset).toBeGreaterThan(.86)
  })
})

describe('first document policy', () => {
  it.each([
    ['first Home load', '/', '', false, false, true],
    ['direct demo load', '/demo', '', false, false, false],
    ['direct pricing load', '/pricing/', '', false, false, false],
    ['deep link', '/', '#preview', false, false, false],
    ['refresh', '/', '', true, false, false],
    ['Back, Forward or a Home link after the first document', '/', '', true, false, false],
    ['OS or footer motion preference', '/', '', false, true, false],
    ['new tab session', '/', '', false, false, true],
  ])('%s', (_scenario, path, hash, seen, reduced, expected) => {
    expect(shouldPlayIntro(path, hash, seen, reduced)).toBe(expected)
  })

  it('retains the existing tab-session key', () => {
    expect(introSessionKey).toBe('skillchain.parchment-entered')
  })
})

it('renders the first cover state and a silent, accessible Skip action', () => {
  const html = renderToStaticMarkup(<CinematicOpening/>)
  expect(html).toContain('role="dialog" aria-modal="true" aria-label="SkillChain opening"')
  expect(html).toContain('data-opening-phase="cover"')
  expect(html).toContain('>SkillChain</span>')
  expect(html).toContain('data-opening-percent>0%</span>')
  expect(html).toContain('<button class="opening-skip" type="button">Skip intro</button>')
  expect(html).not.toContain('aria-live')
})
