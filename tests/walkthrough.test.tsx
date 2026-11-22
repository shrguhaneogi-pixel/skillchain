import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it } from 'vitest'
import Walkthrough from '../components/Walkthrough'

const props = {
  name: 'candidate', title: 'A day inside SkillProof', lead: 'Follow a coordinator.',
  transcript: 'First message.\n\nThen a reply.', fallback: '/demo/',
}

it('does not render network-active video sources before user intent', () => {
  const page = renderToStaticMarkup(createElement(Walkthrough, { ...props, available: true }))
  expect(page).toContain('This clip is silent and captioned.')
  expect(page).toContain('candidate-walkthrough-poster.webp')
  expect(page).not.toMatch(/<video\b|<source\b|<track\b|(?:src|rel)="[^"]*\.mp4/)
  expect(page).toContain('Read transcript')
})

it('shows an interactive fallback if the recording is unavailable', () => {
  const page = renderToStaticMarkup(createElement(Walkthrough, { ...props, available: false }))
  expect(page).toContain('href="/demo/"')
  expect(page).toContain('Explore the interactive walkthrough')
  expect(page).not.toContain('.mp4')
})
