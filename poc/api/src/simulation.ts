import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { colleagues, routeToColleague, scriptedProvider } from './agents.ts'
import type { AgentProvider, Colleague, Intent } from './agents.ts'
import { appendEvidence } from './evidence.ts'
import type { EvidenceEvent } from './evidence.ts'
import scenarios from './scenarios.json' with { type: 'json' }

export const deadlines = { outage: 300, demo: 1200, budget: 1500 } as const
const incident = z.enum(['outage', 'demo', 'budget'])
const colleague = z.enum(['manager', 'developer', 'client', 'finance'])
const taskFields = {
  title: z.string().trim().min(1).max(120),
  incident,
  assignee: z.enum(['applicant', 'manager', 'developer', 'client', 'finance', 'unassigned']),
  priority: z.enum(['normal', 'high', 'urgent']),
  due: z.number().int().min(0).max(1500),
}
export const workplaceAction = z.discriminatedUnion('type', [
  z.object({ type: z.literal('task'), id: z.string().max(80).optional(), ...taskFields }),
  z.object({ type: z.literal('email'), recipient: colleague, incident, body: z.string().trim().min(1).max(2000) }),
  z.object({ type: z.literal('plan'), plan: z.enum(['recovery', 'no-cost', 'paid']) }),
  z.object({ type: z.literal('hold') }),
])

export type Action = z.infer<typeof workplaceAction>
export type Level = 1 | 2 | 3
export type Allowance = 1 | 1.5 | 2
type Incident = keyof typeof deadlines
type Task = Pick<Extract<Action, { type: 'task' }>, 'title' | 'incident' | 'assignee' | 'priority' | 'due'> & { id: string }
type Message = { id: string; sender: Colleague | 'applicant'; recipient: Colleague | 'applicant'; incident: Incident; text: string; at: number }
type Scheduled = { kind: 'handoff' | 'recovered' | 'clearance'; at: number; taskId?: string }

export function createRun(level: Level, allowance: Allowance, now: number, owner = 'applicant', provider: AgentProvider = scriptedProvider) {
  const runId = randomUUID()
  const scenario = scenarios[level]
  const events: EvidenceEvent[] = []
  const queue: Scheduled[] = []
  const actionKeys = new Set<string>()
  const tasks: Task[] = [
    { id: 'recovery', title: 'Coordinate database recovery', incident: 'outage', assignee: 'unassigned', priority: 'normal', due: deadlines.outage },
    { id: 'demo', title: 'Confirm client demo plan', incident: 'demo', assignee: 'applicant', priority: 'normal', due: deadlines.demo },
    { id: 'budget', title: 'Review budget discrepancy', incident: 'budget', assignee: 'applicant', priority: 'normal', due: deadlines.budget },
  ]
  const inbox: Message[] = [
    { id: 'initial-1', sender: 'developer', recipient: 'applicant', incident: 'outage', text: 'The production database is unavailable. I need an assigned recovery task.', at: 0 },
    { id: 'initial-2', sender: 'client', recipient: 'applicant', incident: 'demo', text: 'Our demo is in 20 minutes. Please confirm the plan.', at: 0 },
    { id: 'initial-3', sender: 'finance', recipient: 'applicant', incident: 'budget', text: 'The vendor draft does not match the approved budget. Paid fallback is on hold.', at: 0 },
    { id: 'initial-4', sender: 'manager', recipient: 'applicant', incident: 'demo', text: 'Coordinate a fallback if recovery will miss the demo.', at: 0 },
  ]
  const state = { hold: true, managerAcknowledged: false, financeAsked: false, recovered: false, recoveryEta: null as number | null, acknowledged: null as string | null, plan: null as string | null }
  let pausedAt: number | null = null
  let pausedTotal = 0
  let frozen: { head: string; count: number; at: number } | undefined
  const passedDeadlines = new Set<Incident>()

  function clock(wall: number) {
    return Math.max(0, ((pausedAt ?? wall) - now - pausedTotal) / (250 * allowance))
  }

  function record(actor: string, action: string, object: string, before: unknown, after: unknown, wall: number, at: number, artifact = object) {
    appendEvidence(events, { runId, actor, timestamp: new Date(wall).toISOString(), virtualSeconds: at, action, object, before, after, artifact, scenarioVersion: scenario.version })
  }

  function reply(sender: Colleague, linked: Incident, intent: Intent, wall: number, at: number, eta?: number) {
    const message: Message = { id: `message-${inbox.length + 1}`, sender, recipient: 'applicant', incident: linked, text: routeToColleague(provider, sender, intent, eta), at }
    inbox.push(message)
    record(sender, 'agent-reply', linked, null, message, wall, at, message.id)
  }

  function validHandoff(task?: Task) {
    return task?.incident === 'outage' && task.assignee === 'developer' && task.due <= deadlines.outage
  }

  function process(item: Scheduled, wall: number) {
    if (item.kind === 'handoff') {
      if (!validHandoff(tasks.find(task => task.id === item.taskId)) || state.acknowledged) return
      state.acknowledged = item.taskId ?? null
      state.recoveryEta = item.at + scenario.recoverySeconds
      record('developer', 'handoff-acknowledged', item.taskId ?? 'outage', null, { eta: state.recoveryEta }, wall, item.at)
      reply('developer', 'outage', 'handoff', wall, item.at, state.recoveryEta)
      queue.push({ kind: 'recovered', at: state.recoveryEta })
    } else if (item.kind === 'recovered') {
      state.recovered = true
      record('controller', 'recovery-complete', 'outage', false, true, wall, item.at)
      reply('developer', 'outage', 'recovered', wall, item.at)
    } else if (state.hold) {
      state.hold = false
      record('finance', 'spend-cleared', 'budget', true, false, wall, item.at)
      reply('finance', 'budget', 'clearance', wall, item.at)
    }
  }

  function finish(wall: number, at: number, actor: string) {
    if (frozen) return
    record(actor, 'finalized', runId, null, { completedAt: at }, wall, at)
    frozen = { head: events.at(-1)!.digest, count: events.length, at }
    queue.length = 0
  }

  function advance(wall: number) {
    const elapsed = clock(wall)
    const at = Math.min(deadlines.budget, elapsed)
    if (frozen || pausedAt !== null) return frozen?.at ?? at
    const expired = elapsed > deadlines.budget
    const due = Object.entries(deadlines)
      .filter(([name, deadline]) => !passedDeadlines.has(name as Incident) && deadline < elapsed)
      .map(([name, deadline]) => ({ incident: name as Incident, at: deadline }))
    while (true) {
      queue.sort((a, b) => a.at - b.at)
      const next = queue[0]
      if (due[0] && (!next || due[0].at < next.at)) {
        const boundary = due.shift()!
        passedDeadlines.add(boundary.incident)
        record('controller', 'deadline', boundary.incident, null, { deadline: boundary.at }, wall, boundary.at)
      } else if (next && next.at <= at) {
        process(queue.shift()!, wall)
      } else break
    }
    if (expired) finish(wall, deadlines.budget, 'controller')
    return at
  }

  function queueFinance(at: number) {
    if (state.financeAsked && state.hold && (!scenario.financeRequiresManager || state.managerAcknowledged)
      && !queue.some(item => item.kind === 'clearance')) queue.push({ kind: 'clearance', at: at + 60 })
  }

  record('controller', 'started', runId, null, { level, allowance, consent: true }, now, 0)
  return {
    id: runId, owner, level,
    view(wall: number) {
      const at = Math.floor(advance(wall))
      return structuredClone({ id: runId, level, allowance, at, paused: pausedAt !== null, frozen, tasks, inbox, state, events, deadlines, scenarioVersion: scenario.version })
    },
    controller(wall: number) {
      const at = Math.floor(advance(wall))
      return structuredClone({ id: runId, at, paused: pausedAt !== null, finished: Boolean(frozen), queue,
        contexts: {
          manager: { ...colleagues.manager, recoveryEta: state.recoveryEta, plan: state.plan },
          developer: { ...colleagues.developer, tasks: tasks.filter(task => task.assignee === 'developer') },
          client: { ...colleagues.client, deadline: deadlines.demo, updates: inbox.filter(message => message.recipient === 'client').length },
          finance: { ...colleagues.finance, hold: state.hold, escalated: state.financeAsked },
        },
      })
    },
    changeClock(wall: number, pause: boolean) {
      const at = advance(wall)
      if (frozen) return 'Assessment is finished.'
      if (pause === (pausedAt !== null)) return
      if (pause) pausedAt = wall
      else {
        pausedTotal += wall - pausedAt!
        pausedAt = null
      }
      record('admin', pause ? 'paused' : 'resumed', runId, !pause, pause, wall, at)
    },
    act(action: Action, wall: number, requestId?: string) {
      if (requestId && actionKeys.has(requestId)) return
      const at = advance(wall)
      if (frozen || pausedAt !== null) return frozen ? 'Assessment is finished.' : 'The controller paused this assessment.'
      if (action.type === 'task') {
        const index = tasks.findIndex(task => task.id === action.id)
        if (action.id && index === -1) return 'Task is unavailable.'
        const before = tasks[index] ?? null
        if (before && before.incident !== action.incident) return 'An existing task keeps its incident link.'
        const task = { id: action.id ?? randomUUID(), title: action.title, incident: action.incident, assignee: action.assignee, priority: action.priority, due: action.due }
        if (index >= 0) tasks[index] = task
        else tasks.push(task)
        record(owner, 'task', task.id, before, task, wall, at)
        if (validHandoff(task) && !state.acknowledged && !queue.some(item => item.kind === 'handoff' && item.taskId === task.id)) {
          queue.push({ kind: 'handoff', taskId: task.id, at: Math.max(at, scenario.acknowledgementFloor) })
        }
      } else if (action.type === 'email') {
        const message: Message = { id: `message-${inbox.length + 1}`, sender: 'applicant', recipient: action.recipient, incident: action.incident, text: action.body, at }
        inbox.push(message)
        record(owner, 'email', action.incident, null, message, wall, at, message.id)
        let intent: Intent = 'unlinked'
        if (action.recipient === 'manager') {
          state.managerAcknowledged = true
          intent = 'coordinate'
        } else if (action.recipient === 'client' && action.incident === 'demo') intent = 'client-update'
        else if (action.recipient === 'finance' && action.incident === 'budget') {
          state.financeAsked = true
          intent = 'escalation'
        }
        reply(action.recipient, action.incident, intent, wall, at)
        queueFinance(at)
      } else if (action.type === 'hold') {
        if (!state.hold) return 'Finance has already cleared this hold.'
        record(owner, 'hold-confirmed', 'budget', state.hold, true, wall, at)
      } else {
        if (action.plan === 'paid' && state.hold) return 'Finance clearance is required for a paid fallback.'
        if (action.plan === 'recovery' && (state.recoveryEta === null || state.recoveryEta > deadlines.demo)) return 'The recovery ETA must support the demo.'
        record(owner, 'plan-confirmed', 'demo', state.plan, action.plan, wall, at)
        state.plan = action.plan
      }
      if (requestId) actionKeys.add(requestId)
      advance(wall)
    },
    submit(wall: number) {
      const at = advance(wall)
      if (pausedAt !== null) return 'Resume the assessment before submitting.'
      finish(wall, at, owner)
    },
  }
}

export type Run = ReturnType<typeof createRun>
export type Workplace = ReturnType<Run['view']>
