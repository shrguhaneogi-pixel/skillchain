import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/spectral/latin-600.css'
import '@fontsource-variable/source-sans-3'
import '@fontsource/ibm-plex-mono/latin-400.css'
import './style.css'
import type { Role } from '../../api/src/auth.ts'
import { request, useData } from './client.ts'
import type { Session } from './client.ts'
import { CompanyDesk, Verify } from './trust.tsx'
import { EvidenceReport, Recruitment } from './recruitment.tsx'
import { Office, Orientation } from './workplace.tsx'

const identities: { role: Role; name: string; description: string }[] = [
  { role: 'applicant', name: 'Mira Sen', description: 'Applicant' },
  { role: 'hr', name: 'Arun Rao', description: 'Hiring manager' },
  { role: 'admin', name: 'Isha Mehta', description: 'Platform Verifier' },
]
const storageKey = 'skillchain-poc-session'

function readSession(): Session | undefined {
  try { return JSON.parse(sessionStorage.getItem(storageKey) ?? 'null') ?? undefined }
  catch { return undefined }
}

function App() {
  const [session, setSession] = useState(readSession)
  const [path, setPath] = useState(location.hash)
  const [problem, setProblem] = useState('')
  const [busy, setBusy] = useState(false)
  const health = useData<{ status: string; mode: string }>('/health')
  const [screen, id] = path.replace(/^#\/?/, '').split('/')
  const admin = session?.role === 'admin'
  const hr = session?.role === 'hr'

  function signOut(notice = '') {
    sessionStorage.removeItem(storageKey)
    setSession(undefined)
    setProblem(notice)
    location.hash = '#/'
  }
  useEffect(() => {
    const route = () => setPath(location.hash)
    const expired = (event: Event) => {
      if ((event as CustomEvent<string>).detail === readSession()?.token) signOut('The demo session expired. Choose your account again.')
    }
    window.addEventListener('hashchange', route)
    window.addEventListener('demo-session-expired', expired)
    return () => {
      window.removeEventListener('hashchange', route)
      window.removeEventListener('demo-session-expired', expired)
    }
  }, [])

  async function signIn(role: Role) {
    setBusy(true); setProblem('')
    try {
      const next = await request<Session>('/auth/sign-in', undefined, { role })
      sessionStorage.setItem(storageKey, JSON.stringify(next))
      setSession(next)
      location.hash = role === 'admin' ? '#/company' : '#/dashboard'
    } catch (failure) { setProblem((failure as Error).message) }
    finally { setBusy(false) }
  }
  async function reset(mode: 'onboarding' | 'golden') {
    if (!session || !window.confirm('Reset the demo and sign out all three accounts?')) return
    setBusy(true); setProblem('')
    try {
      await request('/demo/reset', session.token, { mode })
      signOut(mode === 'golden' ? 'Demo reset. The seeded verified vacancy is ready.' : 'Demo reset. Sign in as HR to submit a new company.')
    } catch (failure) { setProblem((failure as Error).message) }
    finally { setBusy(false) }
  }

  let content
  if (screen === 'verify') content = <Verify key={id || 'lookup'} initial={id} />
  else if (!session) content = <div className="signin">
    <header><span className="eyebrow">Workforce assessment</span><h1>Verify the recruiter.<br />Prove the skill.</h1>
      <p>Choose a demo account to enter the recruitment and assessment workspace.</p></header>
    <div className="identity-grid">{identities.map(identity => <button className="identity" key={identity.role} disabled={busy} onClick={() => void signIn(identity.role)}>
      <span className="field-label">{identity.description}</span><strong>{identity.name}</strong><span className="identity-action">Demo sign-in <span aria-hidden="true">→</span></span>
    </button>)}</div>
    <p className="system-state">{health.value?.status === 'ready' ? 'API ready' : health.error || 'Connecting to the local API…'}{health.value ? ' · ' + (health.value.mode === 'fixture' ? 'Simulation fixture' : 'Local chain') : ''}</p>
  </div>
  else if (admin || (hr && screen === 'company')) content = <CompanyDesk session={session} />
  else if (id && screen === 'orientation' && session.role === 'applicant') content = <Orientation key={id} id={id} token={session.token} />
  else if (id && screen === 'workplace' && session.role === 'applicant') content = <Office key={id} id={id} token={session.token} />
  else if (id && screen === 'report') content = <EvidenceReport key={id} id={id} session={session} />
  else content = <Recruitment session={session} />

  return <>
    <a className="skip" href="#main-content" onClick={(event) => { event.preventDefault(); document.getElementById('main-content')?.focus() }}>Skip to content</a>
    <header className="topbar"><a className="brand" href={admin ? '#/company' : '#/dashboard'}><img className="brand-mark" src="/skillchain-shield.png" alt="" width="32" height="32" />SkillChain</a>
      <nav aria-label="Primary">
        {session && !admin && <a href="#/dashboard">Recruitment</a>}
        {(hr || admin) && <a href="#/company">{admin ? 'Verifier console' : 'Company'}</a>}
        <a href="#/verify">Public Verify</a>
      </nav>
      {session && <div className="account"><span>{session.account.name} · {session.account.label}</span><button className="secondary small" onClick={() => signOut()}>Sign out</button></div>}
    </header>
    <main id="main-content" tabIndex={-1}>
      {problem && <p role={session ? 'alert' : 'status'} className="notice">{problem}</p>}
      {content}
      {admin && screen !== 'verify' && <section className="panel stack"><h2>Demo reset</h2><p>Restore the verified baseline or start a fresh company onboarding walkthrough.</p>
        <div className="actions"><button className="secondary" disabled={busy} onClick={() => void reset('golden')}>Reset to verified baseline</button>
        <button className="secondary" disabled={busy} onClick={() => void reset('onboarding')}>Reset to fresh onboarding</button></div>
      </section>}
    </main>
    <footer>SkillChain · Team THE DEBUGGERS <span>Demo-only authentication · Synthetic data</span></footer>
  </>
}

createRoot(document.getElementById('root')!).render(<App />)
