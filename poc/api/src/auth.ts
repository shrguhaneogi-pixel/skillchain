import { randomBytes } from 'node:crypto'
import fixtures from './demo-fixtures.json' with { type: 'json' }

export const accounts = fixtures.accounts

export type Role = keyof typeof accounts

export function createSessions() {
  let demoEpoch = 1
  const sessions = new Map<string, { role: Role; demoEpoch: number }>()

  return {
    signIn(role: Role) {
      const token = randomBytes(32).toString('base64url')
      sessions.set(token, { role, demoEpoch })
      return { token, role, account: accounts[role], demoEpoch }
    },
    get(authorization?: string) {
      const token = authorization?.match(/^Bearer ([A-Za-z0-9_-]+)$/)?.[1]
      const session = token ? sessions.get(token) : undefined
      return session?.demoEpoch === demoEpoch ? session : undefined
    },
    reset() {
      sessions.clear()
      return ++demoEpoch
    },
  }
}
