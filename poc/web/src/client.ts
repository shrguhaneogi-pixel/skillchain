import { useEffect, useState } from 'react'
import type { Role, accounts } from '../../api/src/auth.ts'

export type Session = { token: string; role: Role; account: typeof accounts[Role]; demoEpoch: number }

export async function request<T>(path: string, token?: string, body?: unknown, requestId?: string): Promise<T> {
  const headers: Record<string, string> = {}
  if (token) headers.Authorization = 'Bearer ' + token
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (requestId) headers['X-Action-Id'] = requestId
  let response: Response
  try {
    response = await fetch('/api' + path, { headers, method: body === undefined ? 'GET' : 'POST', body: JSON.stringify(body) })
  } catch { throw new Error('The local API is unavailable.') }
  if (response.status === 401 && token) window.dispatchEvent(new CustomEvent('demo-session-expired', { detail: token }))
  const data = await response.json()
  if (!response.ok) throw new Error(data.error ?? 'Request failed.')
  return data
}

export function useData<T>(path: string, token?: string, interval = 0) {
  const [revision, setRevision] = useState(0)
  const [value, setValue] = useState<T>()
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    let pending = false
    async function refresh() {
      if (!path || pending) return
      pending = true
      try {
        const data = await request<T>(path, token)
        if (active) { setValue(data); setError('') }
      } catch (failure) {
        if (active) setError((failure as Error).message)
      } finally { pending = false }
    }
    void refresh()
    const timer = interval ? window.setInterval(() => void refresh(), interval) : undefined
    return () => { active = false; window.clearInterval(timer) }
  }, [path, revision, token, interval])
  return { value, error, refresh: () => setRevision(count => count + 1) }
}

export const localTime = (epoch: number) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(epoch)
