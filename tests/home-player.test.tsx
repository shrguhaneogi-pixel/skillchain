// @vitest-environment happy-dom
import { statSync } from 'node:fs'
import { join } from 'node:path'
import { act, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import Home from '../app/page'

it('offers the candidate transcript and the real MP4 when the Home player errors', () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)

  try {
    act(() => root.render(createElement(Home)))
    const candidate = container.querySelector<HTMLElement>('#candidate-video-label')!.closest('article')!
    act(() => candidate.querySelector('button')!.click())
    const video = candidate.querySelector('video')!
    expect(play).toHaveBeenCalledOnce()
    act(() => video.dispatchEvent(new Event('error')))
    const status = candidate.querySelector('[role=status]')
    expect(status?.textContent).toContain('Video playback is unavailable.')
    expect(status?.querySelector('a')?.getAttribute('href')).toBe('/demo/')

    const transcript = candidate.querySelector<HTMLDetailsElement>('details')!
    expect(transcript.querySelector('summary')?.textContent).toBe('Read transcript')
    act(() => transcript.querySelector('summary')!.click())
    expect(transcript.open).toBe(true)
    expect(transcript.textContent).toContain('A day inside SkillProof')

    const download = candidate.querySelector('a[download]')!
    expect(download.textContent).toBe('Download video')
    const href = download.getAttribute('href')
    expect(href).toBe('/media/candidate-walkthrough.mp4')
    const media = statSync(join(process.cwd(), 'public', href!))
    expect(media.isFile()).toBe(true)
    expect(media.size).toBeGreaterThan(0)
  } finally {
    act(() => root.unmount())
    container.remove()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  }
})
