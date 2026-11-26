import { rubricVersion, verifyEvidence } from './evidence.ts'
import type { EvidenceEvent } from './evidence.ts'
import { deadlines } from './simulation.ts'
import type { Workplace } from './simulation.ts'

export function evaluate(workplace: Workplace) {
  const { id, events, frozen } = workplace
  if (!frozen || !verifyEvidence(id, events, frozen)) throw new Error('Evidence integrity could not be verified.')
  const find = (action: string, deadline: number, predicate: (event: EvidenceEvent) => boolean = () => true) =>
    events.find(event => event.action === action && event.virtualSeconds <= deadline && predicate(event))
  const urgent = find('task', deadlines.outage, event => {
    const task = event.after as Workplace['tasks'][number]
    return task.incident === 'outage' && task.priority === 'urgent'
  })
  const assigned = find('task', deadlines.outage, event => {
    const task = event.after as Workplace['tasks'][number]
    return task.incident === 'outage' && task.assignee === 'developer' && task.due <= deadlines.outage
  })
  const handoff = find('handoff-acknowledged', deadlines.outage)
  const plan = find('plan-confirmed', deadlines.demo)
  const addressed = (event: EvidenceEvent, recipient: string) =>
    (event.after as Workplace['inbox'][number]).recipient === recipient
  const client = find('email', deadlines.demo, event => addressed(event, 'client') && event.object === 'demo')
  const internal = events.find(event => event.action === 'email'
    && (event.object === 'outage' || event.object === 'budget')
    && event.virtualSeconds <= deadlines[event.object]
    && (addressed(event, 'manager') || (event.object === 'outage' ? addressed(event, 'developer') : addressed(event, 'finance'))))
  const finance = find('email', deadlines.budget, event => event.object === 'budget' && addressed(event, 'finance'))
  const hold = find('hold-confirmed', deadlines.budget)
  const result = (competency: string, checks: [string, EvidenceEvent | undefined, keyof typeof deadlines][], human = false) => {
    const criteria = checks.map(([label, event, deadline]) => ({
      label,
      met: Boolean(event),
      evidenceId: (event ?? find('deadline', deadlines[deadline], item => item.object === deadline) ?? events.at(-1)!).id,
    }))
    const count = criteria.filter(criterion => criterion.met).length
    return {
      competency,
      state: count === 2 ? (human ? 'Human review required' : 'Demonstrated') : count === 1 ? 'Partial' : 'Not demonstrated',
      criteria,
    }
  }
  return {
    runId: id, scenarioVersion: workplace.scenarioVersion, rubricVersion, integrity: frozen,
    method: 'Versioned rules check recorded workplace outcomes against inclusive deadlines. Human reviewers assess message quality.',
    competencies: [
      result('Prioritization', [['Marked outage urgent', urgent, 'outage'], ['Confirmed a viable demo plan', plan, 'demo']]),
      result('Delegation', [['Assigned a valid recovery task', assigned, 'outage'], ['Developer acknowledged the handoff', handoff, 'outage']]),
      result('Communication', [['Sent a linked client update', client, 'demo'], ['Sent a linked internal update', internal, 'budget']], true),
      result('Escalation', [['Escalated discrepancy to Finance', finance, 'budget'], ['Recorded spend hold', hold, 'budget']]),
      result('Deadline management', [['Completed recovery handoff on time', handoff, 'outage'], ['Confirmed demo plan on time', plan, 'demo']]),
    ],
    evidence: events,
  }
}

export type Report = ReturnType<typeof evaluate>
