import { describe, expect, it } from 'vitest'
import { createRun } from '../api/src/simulation.ts'
import type { Action } from '../api/src/simulation.ts'
import { evaluate } from '../api/src/reports.ts'
import { verifyEvidence } from '../api/src/evidence.ts'
import { checkSnapshot, snapshotDocuments } from '../api/src/trustchain.ts'

const base = Date.UTC(2026, 0, 1)
const recovery: Action = { type: 'task', id: 'recovery', title: 'Restore database', incident: 'outage', assignee: 'developer', priority: 'urgent', due: 300 }
const finance: Action = { type: 'email', recipient: 'finance', incident: 'budget', body: 'Please reconcile this.' }
const client: Action = { type: 'email', recipient: 'client', incident: 'demo', body: 'I will send an update soon.' }

describe('deterministic workplace and evidence', () => {
  it.each([[299.996, 'Demonstrated'], [300, 'Demonstrated'], [300.004, 'Not demonstrated']] as const)(
    'evaluates a recovery handoff at second %s', (second, state) => {
      const run = createRun(1, 1, base)
      const wall = base + second * 250
      run.act(recovery, wall)
      run.submit(wall)
      expect(evaluate(run.view(wall)).competencies[1].state).toBe(state)
    },
  )
  it('deduplicates retries, freezes evidence, and verifies the chain against a pinned head', () => {
    const run = createRun(1, 1, base)
    run.act(recovery, base, 'edit-1')
    run.act({ ...recovery, title: 'ignored retry' }, base, 'edit-1')
    run.act(client, base)
    run.act(finance, base)
    run.act({ type: 'hold' }, base)
    run.act({ type: 'plan', plan: 'no-cost' }, base)
    run.submit(base)
    const view = run.view(base)
    expect(view.tasks[0].title).toBe('Restore database')
    expect(view.events.filter(event => event.action === 'task')).toHaveLength(1)
    expect(run.act(client, base + 250)).toBe('Assessment is finished.')
    expect(evaluate(view)).toEqual(evaluate(run.view(base + 1000)))
    expect(evaluate(view).competencies[2].state).toBe('Human review required')
    const changed = structuredClone(view.events)
    changed[1].actor = 'changed'
    for (const events of [changed, view.events.slice(0, -1), [...view.events].reverse()]) {
      expect(verifyEvidence(view.id, events, view.frozen!)).toBe(false)
    }
  })
  it('requires the level-two timing and level-three approval dependency', () => {
    const level2 = createRun(2, 1, base)
    level2.act(recovery, base)
    expect(level2.view(base + 29_750).state.acknowledged).toBeNull()
    expect(level2.view(base + 30_000).state.acknowledged).toBe('recovery')
    const level3 = createRun(3, 1, base)
    level3.act(finance, base)
    expect(level3.view(base + 30_000).state.hold).toBe(true)
    level3.act({ type: 'email', recipient: 'manager', incident: 'demo', body: 'Please coordinate with Finance.' }, base + 30_000)
    expect(level3.view(base + 45_000).state.hold).toBe(false)
  })
  it('uses only structured inputs for scripted replies and allows alternative plans', () => {
    const a = createRun(1, 1, base)
    const b = createRun(1, 1, base)
    a.act(client, base)
    b.act({ ...client, body: 'A different free-text message.' }, base)
    expect(a.view(base).inbox.at(-1)?.text).toEqual(b.view(base).inbox.at(-1)?.text)
    a.act({ type: 'plan', plan: 'no-cost' }, base)
    b.act(recovery, base)
    b.act({ type: 'plan', plan: 'recovery' }, base)
    expect(a.view(base).state.plan).toBe('no-cost')
    expect(b.view(base).state.plan).toBe('recovery')
  })
  it('pauses virtual time, extends the allowance, and finalizes after inclusive end', () => {
    const run = createRun(1, 2, base)
    run.changeClock(base + 20_000, true)
    expect(run.view(base + 40_000).at).toBe(40)
    expect(run.act(recovery, base + 40_000)).toMatch(/paused/)
    run.changeClock(base + 40_000, false)
    expect(run.view(base + 50_000).at).toBe(60)
    expect(run.view(base + 770_000).frozen).toBeUndefined()
    expect(run.view(base + 770_001).frozen?.at).toBe(1500)
    expect(run.view(base + 800_000).events.filter(event => event.action === 'finalized')).toHaveLength(1)
  })
})

it('canonically hashes salted fixture manifests and detects the altered copy', () => {
  const a = snapshotDocuments(['registration', 'authorization'], '0'.repeat(64))
  const b = snapshotDocuments(['authorization', 'registration'], a.salt)
  expect(a.commitment).toEqual(b.commitment)
  expect(a.commitment).not.toEqual(snapshotDocuments(['authorization', 'registration']).commitment)
  expect(checkSnapshot(a, false, a.commitment).matches).toBe(true)
  expect(checkSnapshot(a, true, a.commitment).matches).toBe(false)
  expect(checkSnapshot(a, false, a.commitment).matches).toBe(true)
})
