// @vitest-environment happy-dom
import { act, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import RequestBuilder from '../components/RequestBuilder'

let container: HTMLDivElement
let root: ReturnType<typeof createRoot>

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function fill(id: string, prototype: typeof HTMLInputElement.prototype | typeof HTMLTextAreaElement.prototype, text: string) {
  const field = container.querySelector(id)!
  act(() => {
    Object.getOwnPropertyDescriptor(prototype, 'value')!.set!.call(field, text)
    field.dispatchEvent(new Event('input', { bubbles: true }))
  })
}

function click(label: string) {
  const button = [...container.querySelectorAll('button')].find(item => item.textContent === label)
  expect(button).toBeDefined()
  button!.click()
}

it.each(['permission rejected', 'clipboard unavailable'])('keeps the request downloadable when %s', async condition => {
  const write = vi.fn().mockRejectedValue(new DOMException('Permission denied', 'NotAllowedError'))
  vi.spyOn(navigator, 'clipboard', 'get').mockReturnValue(condition === 'clipboard unavailable'
    ? undefined as unknown as Clipboard
    : {writeText: write} as unknown as Clipboard)
  const createUrl = vi.spyOn(URL, 'createObjectURL')
  const download = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
    expect(this.download).toBe('skillchain-request.txt')
    expect(this.href).toMatch(/^blob:/)
  })

  act(() => root.render(createElement(RequestBuilder)))
  fill('#request-email', HTMLInputElement.prototype, 'fixture@example.com')
  fill('#request-message', HTMLTextAreaElement.prototype, 'Please share the scripted role brief.')
  act(() => container.querySelector<HTMLInputElement>('#request-include')!.click())
  act(() => click('Review request'))
  await act(async () => click('Copy request'))

  expect(container.querySelector('[role=status]')?.textContent)
    .toBe('Copy is unavailable. Select the request text above to copy it.')
  expect(container.textContent).not.toContain('Request copied.')
  expect(container.querySelector('pre')?.getAttribute('tabindex')).toBe('0')
  expect(write).toHaveBeenCalledTimes(condition === 'clipboard unavailable' ? 0 : 1)

  act(() => click('Download request (.txt)'))
  expect(download).toHaveBeenCalledOnce()
  const blob = createUrl.mock.calls[0][0] as Blob
  expect(blob.type).toBe('text/plain;charset=utf-8')
  await expect(blob.text()).resolves.toContain('Please share the scripted role brief.')
})
