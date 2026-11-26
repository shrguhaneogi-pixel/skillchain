import { afterEach, expect, it } from 'vitest'
import { buildServer } from '../api/src/server.ts'

type App = Awaited<ReturnType<typeof buildServer>>
let app: App
afterEach(async () => { await app?.close() })

async function signIn(role: string) {
  const response = await app.inject({ method: 'POST', url: '/api/auth/sign-in', payload: { role } })
  return { authorization: 'Bearer ' + response.json().token }
}

it('validates roles, application uniqueness, consent, ownership, and reset generations', async () => {
  app = await buildServer()
  const hr = await signIn('hr')
  const admin = await signIn('admin')
  const applicant = await signIn('applicant')
  expect(await signIn('applicant')).not.toEqual(applicant)
  const head = '/api/applications'
  expect((await app.inject({ url: head })).statusCode).toBe(401)
  expect((await app.inject({ method: 'POST', url: head, headers: hr })).statusCode).toBe(403)
  const id = (await app.inject({ method: 'POST', url: head, headers: applicant })).json().id
  expect((await app.inject({ method: 'POST', url: head, headers: applicant })).statusCode).toBe(409)
  expect((await app.inject({ method: 'POST', url: head + '/' + id + '/run', headers: applicant, payload: { consent: false, allowance: 1 } })).statusCode).toBe(400)
  const run = await app.inject({ method: 'POST', url: head + '/' + id + '/run', headers: applicant, payload: { consent: true, allowance: 1 } })
  const controller = '/api/runs/' + run.json().id + '/controller'
  expect((await app.inject({ url: controller, headers: admin })).statusCode).toBe(200)
  expect((await app.inject({ url: controller, headers: applicant })).statusCode).toBe(403)
  expect((await app.inject({ url: head + '/strong-sample/report', headers: applicant })).statusCode).toBe(403)
  const strong = (await app.inject({ url: head + '/strong-sample/report', headers: hr })).json()
  const weak = (await app.inject({ url: head + '/weak-sample/report', headers: hr })).json()
  expect(strong.competencies.map((item: { state: string }) => item.state)).toContain('Demonstrated')
  expect(weak.competencies.every((item: { state: string }) => item.state === 'Not demonstrated')).toBe(true)
  expect(strong.competencies).toHaveLength(5)
  expect((await app.inject({ method: 'POST', url: '/api/demo/reset', headers: hr })).statusCode).toBe(403)
  expect((await app.inject({ method: 'POST', url: '/api/demo/reset', headers: admin })).statusCode).toBe(200)
  expect((await app.inject({ method: 'POST', url: head, headers: applicant })).statusCode).toBe(401)
})

it('enforces exact application and assessment launch cutoffs, and reports fixture RPC unavailability', async () => {
  let time = Date.UTC(2026, 0, 1)
  app = await buildServer({ now: () => time })
  const applicant = await signIn('applicant')
  const created = await app.inject({ method: 'POST', url: '/api/applications', headers: applicant })
  const { id, assessmentClosesAt } = created.json()
  time += 30 * 60_000
  expect((await app.inject({ method: 'POST', url: '/api/applications', headers: applicant })).json().error).toBe('Applications are closed.')
  time = assessmentClosesAt
  expect((await app.inject({ method: 'POST', url: '/api/applications/' + id + '/run', headers: applicant, payload: { consent: true, allowance: 1 } })).statusCode).toBe(409)
  const company = await app.inject({ url: '/api/vacancy', headers: applicant })
  expect((await app.inject({ url: '/api/verify/' + company.json().companyId })).statusCode).toBe(503)
})

it('requires the verifier to check the current synthetic snapshot and rejects stale approvals', async () => {
  app = await buildServer()
  const originalAdmin = await signIn('admin')
  await app.inject({ method: 'POST', url: '/api/demo/reset', headers: originalAdmin, payload: { mode: 'onboarding' } })
  const hr = await signIn('hr')
  const admin = await signIn('admin')
  const example = { name: 'Synthetic Works', registration: 'DEMO-CIN-001', documents: ['registration', 'authorization'] }
  async function submit(registration: string) {
    return (await app.inject({ method: 'POST', url: '/api/company', headers: hr, payload: { ...example, registration } })).json()
  }
  const rejected = await submit('DEMO-CIN-INVALID')
  const endpoint = '/api/companies/' + rejected.id
  const check = (headers: { authorization: string }, commitment: string) =>
    app.inject({ method: 'POST', url: endpoint + '/check', headers, payload: { commitment } })
  const approve = (commitment: string) =>
    app.inject({ method: 'POST', url: endpoint + '/status', headers: admin, payload: { action: 'verify', commitment } })
  expect((await check(hr, rejected.commitment)).statusCode).toBe(403)
  expect((await check(admin, rejected.commitment)).json().passed).toBe(false)
  expect((await approve(rejected.commitment)).statusCode).toBe(409)
  const passing = await submit(example.registration)
  expect((await check(admin, passing.commitment)).json().passed).toBe(true)
  const replacement = await submit(example.registration)
  expect((await approve(passing.commitment)).statusCode).toBe(409)
  expect((await approve(replacement.commitment)).statusCode).toBe(409)
})

it.each([2, 3])('assigns vacancy level %s on the server and enforces the opening window', async level => {
  let time = Date.UTC(2026, 0, 1)
  app = await buildServer({ now: () => time })
  const hr = await signIn('hr')
  const applicant = await signIn('applicant')
  const opens = time + 60_000
  const publish = await app.inject({ method: 'POST', url: '/api/vacancy', headers: hr, payload: {
    level, opensAt: new Date(opens).toISOString(), closesAt: new Date(opens + 60_000).toISOString(),
    assessmentClosesAt: new Date(opens + 120_000).toISOString(),
  } })
  expect(publish.statusCode).toBe(200)
  expect((await app.inject({ method: 'POST', url: '/api/applications', headers: applicant })).statusCode).toBe(409)
  time = opens
  const application = (await app.inject({ method: 'POST', url: '/api/applications', headers: applicant })).json()
  expect(application.level).toBe(level)
  const run = await app.inject({ method: 'POST', url: '/api/applications/' + application.id + '/run', headers: applicant,
    payload: { consent: true, allowance: 2, level: 1 } })
  expect(run.json().level).toBe(level)
  expect(run.json().allowance).toBe(2)
})
