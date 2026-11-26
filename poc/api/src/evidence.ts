import { createHash } from 'node:crypto'

export const rubricVersion = 'coordinator-rubric-v1'
export const sha256 = (bytes: string | Uint8Array) =>
  createHash('sha256').update(bytes).digest('hex')

function canonical(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value)
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']'
  const entries = Object.entries(value).filter(([, entry]) => entry !== undefined)
  entries.sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
  return '{' + entries.map(([key, entry]) => JSON.stringify(key) + ':' + canonical(entry)).join(',') + '}'
}

export interface EvidenceEvent {
  id: string
  runId: string
  actor: string
  timestamp: string
  virtualSeconds: number
  action: string
  object: string
  before: unknown
  after: unknown
  artifact: string
  scenarioVersion: string
  rubricVersion: string
  previous: string
  digest: string
}

export function appendEvidence(events: EvidenceEvent[], input: Omit<EvidenceEvent, 'id' | 'previous' | 'digest' | 'rubricVersion'>) {
  const event = structuredClone({
    ...input,
    id: `${input.runId}-E${events.length + 1}`,
    previous: events.at(-1)?.digest ?? sha256(`skillchain:evidence:v1:${input.runId}`),
    rubricVersion,
  })
  events.push({ ...event, digest: sha256(canonical(event)) })
}

export function verifyEvidence(runId: string, events: EvidenceEvent[], frozen: { head: string; count: number }) {
  if (events.length !== frozen.count) return false
  let previous = sha256(`skillchain:evidence:v1:${runId}`)
  for (const { digest, ...event } of events) {
    if (event.runId !== runId || event.previous !== previous || sha256(canonical(event)) !== digest) return false
    previous = digest
  }
  return previous === frozen.head
}
