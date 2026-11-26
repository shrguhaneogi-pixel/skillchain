export const colleagues = {
  manager: { name: 'Project Manager', scope: 'Recovery outlook, fallback, coordination' },
  developer: { name: 'Developer', scope: 'Outage, recovery assignment, recovery ETA' },
  client: { name: 'Client Representative', scope: 'Demo deadline and client updates' },
  finance: { name: 'Finance / Ops Officer', scope: 'Discrepancy, spend hold and finance clearance' },
} as const

export type Colleague = keyof typeof colleagues
export type Intent = 'handoff' | 'recovered' | 'coordinate' | 'client-update' | 'escalation' | 'clearance' | 'unlinked'
type Context = { intent: Intent; eta?: number }

export interface AgentProvider {
  respond(colleague: Colleague, context: Context): string
}

export const scriptedProvider: AgentProvider = {
  respond(colleague, { intent, eta }) {
    switch (colleague) {
      case 'developer':
        if (intent === 'handoff') return `I own database recovery. Current ETA: scenario minute ${Math.ceil((eta ?? 0) / 60)}.`
        if (intent === 'recovered') return 'Recovery checks passed. The database is available for the demo.'
        return 'I can confirm an ETA once the recovery task has a clear owner and due time.'
      case 'manager':
        return intent === 'coordinate'
          ? 'Coordination acknowledged. The no-cost fallback is available if recovery slips.'
          : 'Please link the issue so I can coordinate the appropriate work.'
      case 'client':
        return intent === 'client-update' ? 'Update received. Please confirm the plan before the demo.' : 'Please link this update to the client demo.'
      case 'finance':
        if (intent === 'escalation') return 'I have the discrepancy. Keep paid spend on hold while I review it.'
        if (intent === 'clearance') return 'Review complete. The spend hold can be lifted.'
        return 'Please link your request to the budget discrepancy.'
    }
  },
}

export function routeToColleague(provider: AgentProvider, colleague: Colleague, intent: Intent, eta?: number) {
  return provider.respond(colleague, { intent, ...(colleague === 'developer' && eta !== undefined && { eta }) })
}
