import Fastify from 'fastify'
import type { FastifyRequest } from 'fastify'
import { z } from 'zod'
import { accounts, createSessions } from './auth.ts'
import type { Role } from './auth.ts'
import { createRun, workplaceAction } from './simulation.ts'
import type { Level, Run } from './simulation.ts'
import { evaluate } from './reports.ts'
import fixtures from './demo-fixtures.json' with { type: 'json' }
import { checkSnapshot, deployRegistry, opaqueCompanyId, snapshotDocuments } from './trustchain.ts'
import type { Registry, Snapshot, Status } from './trustchain.ts'

class HttpError extends Error {
  readonly statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }
}

const idParam = z.object({ id: z.string().min(1).max(80) })
const companyParam = z.object({ id: z.string().regex(/^0x[0-9a-f]{64}$/i).transform(id => id.toLowerCase()) })
const documentIds = z.enum(['registration', 'tax', 'authorization'])
const levels = z.union([z.literal(1), z.literal(2), z.literal(3)])
const companyInput = z.object({
  name: z.string().trim().min(1).max(100),
  registration: z.string().trim().min(1).max(60),
  taxId: z.string().trim().max(60).optional(),
  documents: z.array(documentIds).min(1).max(3),
})
const competency = z.enum(['Prioritization', 'Delegation', 'Communication', 'Escalation', 'Deadline management'])
const vacancyInput = z.object({
  level: levels,
  focus: z.array(competency).min(1).max(5).optional(),
  experience: z.string().trim().max(120).optional(),
  opensAt: z.iso.datetime().optional(),
  closesAt: z.iso.datetime().optional(),
  assessmentClosesAt: z.iso.datetime().optional(),
})
const decisionInput = z.object({ outcome: z.enum(['Hire', 'Do not hire']), feedback: z.string().trim().min(1).max(1500) })
const profileInput = z.object({
  summary: z.string().trim().max(250),
  links: z.array(z.url({ protocol: /^https?$/ })).max(4),
})
type Decision = z.infer<typeof decisionInput>
type Vacancy = {
  id: string; companyId: string; level: Level; opensAt: number; closesAt: number; assessmentClosesAt: number
  focus: string[]; experience: string
}
type Application = {
  id: string; owner: 'applicant'; companyId: string; level: Level; assessmentClosesAt: number
  run?: Run; consentAt?: number; decision?: Decision; sample?: string
}
type Company = z.infer<typeof companyInput> & { id: string; snapshot: Snapshot; passed: boolean | null }

export async function buildServer(options: { registry?: Registry; now?: () => number } = {}) {
  const app = Fastify({ logger: false, bodyLimit: 16_384 })
  const sessions = createSessions()
  const now = options.now ?? Date.now
  const registry = options.registry
  const seedInput = companyInput.parse(fixtures.company)
  const seed: Company = { ...seedInput, id: opaqueCompanyId(), snapshot: snapshotDocuments(seedInput.documents), passed: true }
  if (registry) {
    await registry.change(seed.id, 'verify', seed.snapshot.commitment)
    await registry.captureBaseline()
  }
  let company = seed
  let pending: Company | undefined
  let applications: Application[] = []
  let vacancy: Vacancy | undefined
  let profile: z.infer<typeof profileInput> | undefined
  let resetting = false
  let unavailable = false
  let writeQueue = Promise.resolve()

  function defaultVacancy(): Vacancy {
    const current = now()
    return { id: 'project-coordinator', companyId: company.id, level: 1,
      opensAt: current, closesAt: current + 30 * 60_000, assessmentClosesAt: current + 45 * 60_000,
      focus: [...competency.options], experience: 'Early career · 0–2 years' }
  }

  function setup(mode: 'golden' | 'onboarding') {
    company = mode === 'golden' ? seed : { ...seed, id: opaqueCompanyId(), name: '', registration: '', documents: [], passed: false }
    pending = undefined
    profile = undefined
    vacancy = mode === 'golden' ? defaultVacancy() : undefined
    applications = []
    if (mode !== 'golden') return
    for (const sample of fixtures.completedRuns) {
      const start = now()
      const run = createRun(1, 1, start)
      for (const action of sample.actions) {
        const rejected = run.act(workplaceAction.parse(action), start)
        if (rejected) throw new Error('Invalid completed run fixture: ' + rejected)
      }
      run.submit(start)
      applications.push({ id: sample.id, owner: 'applicant',
        companyId: seed.id, level: 1, assessmentClosesAt: start, run, sample: sample.label })
    }
  }
  setup('golden')

  function authorize(request: FastifyRequest, ...roles: Role[]) {
    const session = sessions.get(request.headers.authorization)
    if (!session) throw new HttpError(401, 'Sign in again to continue.')
    if (!roles.includes(session.role)) throw new HttpError(403, 'This demo role cannot perform that action.')
    return session.role
  }
  function write<T>(request: FastifyRequest, roles: Role[], work: () => T | Promise<T>, reset = false) {
    const result = writeQueue.then(async () => {
      authorize(request, ...roles)
      if (unavailable && !reset) throw new HttpError(503, 'The demo needs a successful reset.')
      return work()
    })
    writeQueue = result.then(() => undefined, () => undefined)
    return result
  }

  async function chainResult<T>(read: (chain: Registry) => Promise<T>) {
    if (!registry || unavailable || resetting) throw new HttpError(503, 'Local TrustChain is unavailable.')
    try { return await read(registry) }
    catch (error) {
      if (error instanceof HttpError) throw error
      throw new HttpError(503, 'Local TrustChain did not respond. Try again.')
    }
  }

  function organizationStatus(id: string): Promise<Status> {
    if (!registry && id === seed.id && !unavailable) return Promise.resolve('Verified')
    return chainResult(chain => chain.readStatus(id))
  }
  async function requireVerifiedOrganization(id: string) {
    const status = await organizationStatus(id)
    if (status !== 'Verified') throw new HttpError(409, `Organization is ${status.toLowerCase()}. Recruiting action blocked.`)
  }

  function getApplication(id: string, role: Role) {
    const application = applications.find(item => item.id === id)
    if (!application) throw new HttpError(404, 'Application not found.')
    if ((role === 'applicant' && (application.owner !== role || application.sample))
      || (role === 'hr' && application.companyId !== company.id)) throw new HttpError(403, 'Application belongs to another workspace.')
    return application
  }
  function getRun(id: string, role: 'applicant' | 'admin') {
    const application = applications.find(item => item.run?.id === id)
    if (!application?.run) throw new HttpError(404, 'Assessment not found.')
    if (role === 'applicant' && (application.owner !== role || application.sample)) throw new HttpError(403, 'Assessment belongs to another workspace.')
    return application.run
  }
  function applicationView(item: Application) {
    return {
      id: item.id, name: accounts.applicant.name, level: item.level, runId: item.run?.id,
      completed: Boolean(item.run?.view(now()).frozen), consentAt: item.consentAt,
      assessmentClosesAt: item.assessmentClosesAt, decision: item.decision, sample: item.sample,
    }
  }

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof z.ZodError) return reply.code(400).send({ error: error.issues[0]?.message ?? 'Invalid input.' })
    if (error instanceof HttpError) return reply.code(error.statusCode).send({ error: error.message })
    if (typeof error === 'object' && error && 'statusCode' in error && typeof error.statusCode === 'number' && error.statusCode < 500) {
      return reply.code(error.statusCode).send({ error: 'Invalid request.' })
    }
    console.error(error)
    return reply.code(500).send({ error: 'The demo could not complete this request.' })
  })
  app.get('/api/health', async () => ({ status: 'ready', mode: registry ? 'local-chain' : 'fixture' }))
  app.post('/api/auth/sign-in', async request => {
    if (resetting) throw new HttpError(503, 'The demo is resetting.')
    return sessions.signIn(z.object({ role: z.enum(['admin', 'hr', 'applicant']) }).parse(request.body).role)
  })
  app.post('/api/demo/reset', async request => write(request, ['admin'], async () => {
    const { mode } = z.object({ mode: z.enum(['golden', 'onboarding']).default('golden') }).parse(request.body ?? {})
    resetting = true
    try {
      await registry?.reset()
      setup(mode)
      unavailable = false
      return { demoEpoch: sessions.reset() }
    } catch {
      unavailable = true
      throw new HttpError(503, 'Could not reset local chain. Restart the demo to recover.')
    } finally { resetting = false }
  }, true))

  app.get('/api/company', async request => {
    const role = authorize(request, 'admin', 'hr')
    const submission = pending
    const status = company.name ? await organizationStatus(company.id) : 'Unregistered'
    return {
      id: company.id, name: company.name, status, mode: registry ? 'local-chain' : 'fixture',
      pending: submission && { id: submission.id, name: submission.name, registration: submission.registration,
        taxId: submission.taxId, documents: submission.documents, commitment: submission.snapshot.commitment,
        passed: submission.passed, label: 'SIMULATED registry and representative authorization check' },
      companyCanSubmit: status === 'Unregistered' && role === 'hr',
    }
  })
  app.post('/api/company', async request => write(request, ['hr'], async () => {
    if (company.name) throw new HttpError(409, 'This organization already has a confirmed record.')
    const input = companyInput.parse(request.body)
    pending = { ...input, id: company.id, passed: null, snapshot: snapshotDocuments(input.documents) }
    return { id: pending.id, commitment: pending.snapshot.commitment }
  }))
  app.post('/api/companies/:id/check', async request => write(request, ['admin'], () => {
    const { id } = companyParam.parse(request.params)
    const { commitment } = z.object({ commitment: z.string() }).parse(request.body)
    if (!pending || pending.id !== id || pending.snapshot.commitment !== commitment) throw new HttpError(409, 'Review the current document snapshot.')
    pending.passed = pending.registration === 'DEMO-CIN-001' && (!pending.taxId || pending.taxId === 'DEMO-GST-001')
      && pending.documents.includes('registration') && pending.documents.includes('authorization')
    return { passed: pending.passed, reason: pending.passed ? 'Fictional identifiers and authorization matched the bundled fixtures.'
      : 'A fictional identifier or required registration or authorization fixture did not match.' }
  }))
  app.post('/api/companies/:id/status', async request => write(request, ['admin'], async () => {
    const { id } = companyParam.parse(request.params)
    const { action, commitment } = z.object({
      action: z.enum(['verify', 'suspend', 'reinstate', 'revoke']), commitment: z.string().optional(),
    }).parse(request.body)
    if (id !== company.id) throw new HttpError(404, 'Organization not found.')
    if (action === 'verify' && (!pending?.passed || pending.snapshot.commitment !== commitment)) {
      throw new HttpError(409, 'Approve the current commitment after a passing simulated check.')
    }
    const transactionHash = await chainResult(async chain => {
      const status = await chain.readStatus(id)
      const allowed = action === 'verify' ? status === 'Unregistered'
        : action === 'suspend' ? status === 'Verified'
        : action === 'reinstate' ? status === 'Suspended'
        : status === 'Verified' || status === 'Suspended'
      if (!allowed) throw new HttpError(409, 'That verification transition is unavailable.')
      return chain.change(id, action, commitment)
    })
    if (action === 'verify' && pending) {
      company = pending
      pending = undefined
    }
    return { transactionHash }
  }))
  app.get('/api/verify/:id', async request => {
    const { id } = companyParam.parse(request.params)
    const record = await chainResult(chain => chain.read(id))
    if (!record) throw new HttpError(404, 'Company ID has no record on the local chain.')
    return record
  })
  app.post('/api/verify/:id/recheck', async request => {
    const { id } = companyParam.parse(request.params)
    const { variant } = z.object({ variant: z.enum(['original', 'altered']) }).parse(request.body)
    const current = id === seed.id ? seed : id === company.id && company.name ? company : undefined
    if (!current) throw new HttpError(404, 'Synthetic document snapshot unavailable.')
    const record = await chainResult(chain => chain.read(id))
    if (!record) throw new HttpError(404, 'Company ID has no record on the local chain.')
    return checkSnapshot(current.snapshot, variant === 'altered', record.commitment)
  })

  app.get('/api/profile', async request => {
    authorize(request, 'applicant')
    return profile ?? { summary: '', links: [] }
  })
  app.post('/api/profile', async request => write(request, ['applicant'], () => {
    profile = profileInput.parse(request.body)
    return profile
  }))
  app.get('/api/vacancy', async request => {
    authorize(request, 'applicant', 'hr')
    const organization = company.name ? await organizationStatus(company.id) : 'Unregistered'
    const wall = now()
    const status = !vacancy ? 'Draft' : wall >= vacancy.closesAt || organization === 'Revoked' ? 'Closed'
      : organization === 'Suspended' ? 'Paused' : (wall < vacancy.opensAt ? 'Scheduled' : 'Open')
    return { status, organization, companyId: company.id, companyName: company.name, vacancy, title: 'Project Coordinator' }
  })
  app.post('/api/vacancy', async request => write(request, ['hr'], async () => {
    const input = vacancyInput.parse(request.body)
    await requireVerifiedOrganization(company.id)
    if (applications.some(item => !item.sample)) throw new HttpError(409, 'Assessment conditions are fixed after the first application.')
    const base = vacancy ?? defaultVacancy()
    const opensAt = input.opensAt ? Date.parse(input.opensAt) : base.opensAt
    const closesAt = input.closesAt ? Date.parse(input.closesAt) : base.closesAt
    const assessmentClosesAt = input.assessmentClosesAt ? Date.parse(input.assessmentClosesAt) : base.assessmentClosesAt
    if (opensAt >= closesAt || closesAt <= now() || closesAt > assessmentClosesAt) throw new HttpError(400, 'Set application dates before the assessment cutoff.')
    vacancy = { ...base, ...input, opensAt, closesAt, assessmentClosesAt }
    return vacancy
  }))
  app.get('/api/applications', async request => {
    const role = authorize(request, 'admin', 'hr', 'applicant')
    return applications.filter(item => role === 'applicant' ? item.owner === role && !item.sample
      : item.companyId === company.id).map(applicationView)
  })
  app.post('/api/applications', async request => write(request, ['applicant'], async () => {
    await requireVerifiedOrganization(company.id)
    if (!vacancy || now() < vacancy.opensAt || now() >= vacancy.closesAt) throw new HttpError(409, 'Applications are closed.')
    if (applications.some(item => !item.sample && item.owner === 'applicant' && item.companyId === company.id)) throw new HttpError(409, 'You already applied.')
    const item: Application = { id: 'project-coordinator-application', owner: 'applicant', companyId: company.id,
      level: vacancy.level, assessmentClosesAt: vacancy.assessmentClosesAt }
    applications.push(item)
    return applicationView(item)
  }))
  app.post('/api/applications/:id/run', async request => write(request, ['applicant'], async () => {
    const { id } = idParam.parse(request.params)
    const item = getApplication(id, 'applicant')
    if (!item.run) {
      await requireVerifiedOrganization(item.companyId)
      if (now() >= item.assessmentClosesAt) throw new HttpError(409, 'The assessment launch window has closed.')
      const { allowance } = z.object({ consent: z.literal(true), allowance: z.union([z.literal(1), z.literal(1.5), z.literal(2)]) }).parse(request.body)
      item.consentAt = now()
      item.run = createRun(item.level, allowance, item.consentAt)
    }
    return item.run.view(now())
  }))
  app.get('/api/runs/:id', async request => {
    authorize(request, 'applicant')
    return getRun(idParam.parse(request.params).id, 'applicant').view(now())
  })
  app.post('/api/runs/:id/actions', async request => write(request, ['applicant'], () => {
    const run = getRun(idParam.parse(request.params).id, 'applicant')
    const requestId = z.string().max(80).optional().parse(request.headers['x-action-id'])
    const error = run.act(workplaceAction.parse(request.body), now(), requestId)
    if (error) throw new HttpError(409, error)
    return run.view(now())
  }))
  app.post('/api/runs/:id/finish', async request => write(request, ['applicant'], () => {
    const run = getRun(idParam.parse(request.params).id, 'applicant')
    const error = run.submit(now())
    if (error) throw new HttpError(409, error)
    return run.view(now())
  }))
  app.get('/api/runs/:id/controller', async request => {
    authorize(request, 'admin')
    return getRun(idParam.parse(request.params).id, 'admin').controller(now())
  })
  app.post('/api/runs/:id/clock', async request => write(request, ['admin'], () => {
    const run = getRun(idParam.parse(request.params).id, 'admin')
    const error = run.changeClock(now(), z.object({ pause: z.boolean() }).parse(request.body).pause)
    if (error) throw new HttpError(409, error)
    return run.controller(now())
  }))
  app.get('/api/applications/:id/report', async request => {
    const role = authorize(request, 'hr', 'applicant')
    const application = getApplication(idParam.parse(request.params).id, role)
    const view = application.run?.view(now())
    if (!view?.frozen) throw new HttpError(409, 'Complete the assessment to generate a report.')
    return { ...evaluate(view), application: applicationView(application) }
  })
  app.post('/api/applications/:id/decision', async request => write(request, ['hr'], async () => {
    const application = getApplication(idParam.parse(request.params).id, 'hr')
    await requireVerifiedOrganization(application.companyId)
    if (!application.run?.view(now()).frozen || application.sample) throw new HttpError(409, 'A completed live application is required.')
    application.decision = decisionInput.parse(request.body)
    return applicationView(application)
  }))
  return app
}

export type ApplicationView = {
  id: string; name: string; level: Level; runId?: string; completed: boolean; consentAt?: number
  assessmentClosesAt: number; decision?: Decision; sample?: string
}
export type VacancyView = {
  status: string; organization: Status; companyId: string; companyName: string; vacancy?: Vacancy; title: string
}

if (import.meta.main) {
  const registry = process.env.SKILLCHAIN_FIXTURE === '1' ? undefined : await deployRegistry()
  const app = await buildServer({ registry })
  await app.listen({ host: '127.0.0.1', port: 4310 })
  console.log('SkillChain API ready on http://127.0.0.1:4310')
}
