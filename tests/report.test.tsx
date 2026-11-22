import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it } from 'vitest'
import FairHirePage from '../app/fairhire/page'
import { Report } from '../components/Report'
import { start } from '../lib/engine'

it('labels the personal reviewer report as a practice run', () => {
  const report = renderToStaticMarkup(createElement(Report, { run: start('Self-paced') }))
  expect(report).toContain('<h2>Your practice run</h2>')
  expect(report).not.toContain('C-017')
})

it('shows C-017 on the direct FairHire route', () => {
  const page = renderToStaticMarkup(createElement(FairHirePage))
  expect(page).toContain('<h2>Candidate C-017</h2>')
  expect(page).not.toContain('Your practice run')
})
