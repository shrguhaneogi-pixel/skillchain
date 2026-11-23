// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import { IncidentDesk } from '../components/HomeInteractive'

it('updates the same task for either scripted reply and resets to the first choice', () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const container = document.createElement('main')
  document.body.append(container)
  const root = createRoot(container)

  try {
    act(() => root.render(<IncidentDesk/>))
    const choices = container.querySelectorAll<HTMLButtonElement>('.reply-options button')
    const status = container.querySelector('[role=status]')!
    const fields = () => [...container.querySelectorAll('dd')].map(item => item.textContent)
    expect(fields()).toEqual(['Unassigned', 'Waiting'])
    expect(container.querySelector('a.primary')).toBeNull()

    choices[0].focus()
    act(() => choices[0].click())
    expect(fields()).toEqual(['Rahul', 'In progress'])
    expect(document.activeElement).toBe(choices[0])
    expect(status.textContent).toContain('Updated · Rahul / In progress')
    expect(container.querySelector('a.primary')?.getAttribute('href')).toBe('/demo/')

    act(() => container.querySelector<HTMLButtonElement>('.incident-task button')!.click())
    expect(fields()).toEqual(['Unassigned', 'Waiting'])
    expect(document.activeElement).toBe(choices[0])
    expect(status.textContent).toBe('')

    act(() => choices[1].click())
    expect(fields()).toEqual(['Coordinator', 'Waiting'])
    expect(status.textContent).toContain('Recovery is waiting on you.')
    expect(container.querySelectorAll('[role=status]')).toHaveLength(1)
  } finally {
    act(() => root.unmount())
    container.remove()
    vi.unstubAllGlobals()
  }
})
