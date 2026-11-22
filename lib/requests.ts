export const topics = {
  demo: 'Employer demo',
  standard: 'Standard subscription',
  custom: 'Custom scenario',
  institution: 'Institution',
  privacy: 'Privacy or correction',
} as const

export type Topic = keyof typeof topics

export function boundedInteger(value: string | null, min: number, max: number) {
  if (!value || !/^\d+$/.test(value)) return null
  const count = Number(value)
  return Number.isSafeInteger(count) && count >= min && count <= max ? count : null
}

export function estimate(candidates: string | null, runs: string | null) {
  const c = boundedInteger(candidates, 0, 10_000)
  const r = boundedInteger(runs, 1, 3)
  return c === null || r === null ? null : { c, r, total: c * r }
}

export function selectedTopic(value: string | null): Topic {
  return value && Object.hasOwn(topics, value) ? value as Topic : 'demo'
}

export type RequestFields = { topic: Topic; email: string; organisation: string; message: string; include: boolean }

export function validEmail(value: string) {
  return value.length <= 254 && /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(value)
}

export function requestErrors(fields: RequestFields) {
  const errors: Partial<Record<keyof RequestFields, string>> = {}
  if (!validEmail(fields.email.trim())) errors.email = 'Enter a valid reply email address (up to 254 characters).'
  if (fields.organisation.trim().length > 100) errors.organisation = 'Enter up to 100 characters.'
  if (fields.message.trim().length < 10 || fields.message.trim().length > 1500) errors.message = 'Enter a message of 10–1,500 characters.'
  if (!fields.include) errors.include = 'Confirm that you want these details in your request.'
  return errors
}

export function prepareRequest(fields: RequestFields, counts: ReturnType<typeof estimate>) {
  const subject = 'SkillChain · ' + topics[fields.topic]
  const body = [
    'Topic: ' + topics[fields.topic],
    'Reply email: ' + fields.email.trim(),
    fields.organisation.trim() ? 'Organisation: ' + fields.organisation.trim() : '',
    counts && fields.topic === 'standard' ? `Planning estimate: ${counts.c} candidates × ${counts.r} runs = ${counts.total} credits` : '',
    '',
    fields.message.trim(),
  ].filter((line, index) => Boolean(line) || index === 4).join('\n')
  return { subject, body }
}

export function mailDraft(recipient: string, request: ReturnType<typeof prepareRequest>) {
  return 'mailto:' + encodeURIComponent(recipient).replace('%40', '@') +
    '?subject=' + encodeURIComponent(request.subject) + '&body=' + encodeURIComponent(request.body)
}
