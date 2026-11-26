import React, { useState } from 'react'
import type { FormEvent } from 'react'
import type { Verification } from '../../api/src/trustchain.ts'
import type { ApplicationView } from '../../api/src/server.ts'
import type { Run } from '../../api/src/simulation.ts'
import { request, useData, localTime } from './client.ts'
import type { Session } from './client.ts'

type Company = { id: string; name: string; status: string; mode: string; companyCanSubmit: boolean
  pending?: { name: string; commitment: string; passed: boolean | null; label: string; registration: string; taxId?: string; documents: string[] } }

export function Status({ children }: { children: string }) {
  return <span className={'status ' + children.toLowerCase().replaceAll(' ', '-')}>{children}</span>
}

export function CompanyDesk({ session }: { session: Session }) {
  const { value, error, refresh } = useData<Company>('/company', session.token)
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [failure, setFailure] = useState('')
  async function send(path: string, body: unknown) {
    setBusy(true); setFailure(''); setNote('')
    try {
      const result = await request<{ transactionHash?: string; reason?: string }>(path, session.token, body)
      setNote(result.transactionHash ? 'Confirmed transaction ' + result.transactionHash
        : result.reason ?? 'Synthetic documents submitted for verifier review.')
      refresh()
    } catch (reason) { setFailure((reason as Error).message) }
    finally { setBusy(false) }
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    void send('/company', { name: data.get('name'), registration: data.get('registration'), taxId: data.get('taxId'), documents: data.getAll('documents') })
  }
  const admin = session.role === 'admin'
  return <>
    <header className="pagehead"><div><span className="eyebrow">TrustChain</span><h1>{admin ? 'Verifier console' : 'Company onboarding'}</h1>
      <p>Synthetic documents and simulated registry checks. Registry writes in the full demo are real local blockchain transactions.</p></div></header>
    {(error || failure) && <p role="alert" className="notice danger">{error || failure}</p>}
    {note && <p role="status" className="notice">{note}</p>}
    {value && <section className="panel stack">
      <div className="line"><h2>{value.name || value.pending?.name || 'New company'}</h2><Status>{value.status}</Status></div>
      {value.name && <><div className="wrap"><span className="field-label">Company ID</span><code>{value.id}</code></div><a href={'#/verify/' + value.id}>Open public verification</a></>}
      {value.mode === 'fixture' && <p className="notice">Simulation fixture mode. Local blockchain is offline.</p>}
      {value.pending && <div className="notice stack">
        <strong>{value.pending.label}</strong>
        <p>{value.pending.passed === null ? 'Awaiting check' : value.pending.passed ? 'Passed' : 'Failed'} · {value.pending.registration}{value.pending.taxId ? ' · ' + value.pending.taxId : ''}</p>
        <p>{value.pending.documents.join(', ')}</p><code>{value.pending.commitment}</code>
        {admin && <div className="actions">
          <button className="secondary" disabled={busy} onClick={() => void send('/companies/' + value.id + '/check', { commitment: value.pending?.commitment })}>Run simulated checks</button>
          {value.pending.passed && <button disabled={busy} onClick={() => void send('/companies/' + value.id + '/status', { action: 'verify', commitment: value.pending?.commitment })}>Approve displayed commitment</button>}
        </div>}
      </div>}
      {admin && ['Verified', 'Suspended'].includes(value.status) && <div className="actions">
        <button disabled={busy} onClick={() => void send('/companies/' + value.id + '/status', { action: value.status === 'Verified' ? 'suspend' : 'reinstate' })}>{value.status === 'Verified' ? 'Suspend company' : 'Reinstate company'}</button>
        <button className="secondary danger-button" disabled={busy} onClick={() => {
          if (window.confirm('Revoke this company permanently until the demo is reset?')) void send('/companies/' + value.id + '/status', { action: 'revoke' })
        }}>Revoke company</button>
      </div>}
      {value.companyCanSubmit && <form className="stack" onSubmit={submit}>
        <div className="form-grid">
          <label>Company name<input name="name" defaultValue="Northstar Works" required /></label>
          <label>Fictional CIN/LLPIN<input name="registration" defaultValue="DEMO-CIN-001" required /></label>
          <label>Fictional GSTIN (optional)<input name="taxId" defaultValue="DEMO-GST-001" /></label>
        </div>
        <fieldset><legend>Bundled synthetic documents</legend>
          {['registration', 'tax', 'authorization'].map(id => <label className="check" key={id}><input type="checkbox" name="documents" value={id} defaultChecked />{id}</label>)}
        </fieldset><button disabled={busy}>Submit documents</button>
      </form>}
    </section>}
    {admin && <Controller session={session} />}
  </>
}

function Controller({ session }: { session: Session }) {
  const [id, setId] = useState('')
  const [problem, setProblem] = useState('')
  const { value: apps } = useData<ApplicationView[]>('/applications', session.token, 2000)
  const { value, error, refresh } = useData<ReturnType<Run['controller']>>(id ? '/runs/' + id + '/controller' : '', session.token, 1000)
  return <section className="panel stack">
    <h2>Controller view</h2>
    <label>Assessment<select value={id} onChange={event => setId(event.target.value)}><option value="">Select an assessment</option>{apps?.filter(app => app.runId && !app.sample).map(app => <option key={app.id} value={app.runId}>{app.name} · Level {app.level}</option>)}</select></label>
    {(error || problem) && <p role="alert">{error || problem}</p>}
    {id && value && <><div className="line"><span>Virtual clock <strong>{Math.floor(value.at / 60)}:{String(value.at % 60).padStart(2, '0')}</strong></span>
      <button disabled={value.finished} onClick={async () => {
        setProblem('')
        try { await request('/runs/' + id + '/clock', session.token, { pause: !value.paused }); refresh() }
        catch (reason) { setProblem((reason as Error).message) }
      }}>{value.paused ? 'Resume assessment' : 'Pause assessment'}</button></div>
      <h3>Event queue</h3>{value.queue.length ? <ul>{value.queue.map((event, i) => <li key={i}>{event.kind} · virtual second {event.at.toFixed(1)}</li>)}</ul> : <p>No scheduled events.</p>}
      <h3>Colleague context</h3><div className="form-grid">{Object.values(value.contexts).map(context => <details key={context.name}><summary>{context.name}</summary><p>{context.scope}</p><pre>{JSON.stringify(context, null, 2)}</pre></details>)}</div>
    </>}
  </section>
}

export function Verify({ initial = '' }: { initial?: string }) {
  const [id, setId] = useState(initial)
  const [lookup, setLookup] = useState(initial)
  const [result, setResult] = useState<{ matches: boolean; computed: string; variant: string }>()
  const [problem, setProblem] = useState('')
  const { value, error, refresh } = useData<Verification>(lookup ? '/verify/' + encodeURIComponent(lookup) : '')
  async function recheck(variant: 'original' | 'altered') {
    setProblem('')
    try { setResult(await request('/verify/' + lookup + '/recheck', undefined, { variant })) }
    catch (reason) { setProblem((reason as Error).message) }
  }
  return <>
    <header className="pagehead"><div><span className="eyebrow">TrustChain</span><h1>Public verification</h1><p>Inspect the organization’s record on the local development chain.</p></div></header>
    <form className="panel line lookup" onSubmit={event => { event.preventDefault(); setLookup(id.trim()); setResult(undefined); refresh() }}>
      <label>Company ID<input value={id} onChange={event => setId(event.target.value)} placeholder="0x…" required /></label><button>Look up company</button>
    </form>
    {(error || problem) && <p className="notice danger" role="alert">{error || problem}</p>}
    {value && !error && value.id === lookup.toLowerCase() && <>
      <section className="panel stack"><div className="line"><h2>{value.network}</h2><Status>{value.status}</Status></div>
        <dl><dt>Commitment</dt><dd><code>{value.commitment}</code></dd><dt>Latest transaction</dt><dd><code>{value.transactionHash}</code></dd><dt>Verifier</dt><dd><code>{value.verifier}</code></dd></dl>
        <h3>Verification history</h3><ul className="rows">{value.history.map(event => <li key={event.transactionHash}><div className="line"><Status>{event.status}</Status><span>Version {event.version} · {localTime(event.timestamp * 1000)}</span></div><code>{event.transactionHash}</code></li>)}</ul>
      </section>
      <section className="panel stack"><h2>Re-check documents</h2><p>Compare a synthetic snapshot with its registered commitment.</p><div className="actions">
        <button onClick={() => void recheck('original')}>Check original fixture</button><button className="secondary" onClick={() => void recheck('altered')}>Check one-byte-altered fixture</button>
        </div>{result && <div role="status" className={'notice ' + (result.matches ? '' : 'danger')}><strong>{result.matches ? 'Match' : 'Mismatch'}</strong> · {result.variant}<br /><code>{result.computed}</code></div>}
      </section>
    </>}
  </>
}
