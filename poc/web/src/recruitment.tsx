import React, { useState } from 'react'
import type { FormEvent } from 'react'
import type { ApplicationView, VacancyView } from '../../api/src/server.ts'
import type { Report } from '../../api/src/reports.ts'
import { localTime, request, useData } from './client.ts'
import type { Session } from './client.ts'
import { Status } from './trust.tsx'

const competencies = ['Prioritization', 'Delegation', 'Communication', 'Escalation', 'Deadline management']
const dateInput = (epoch: number) => {
  const date = new Date(epoch)
  return new Date(epoch - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16)
}

export function Recruitment({ session }: { session: Session }) {
  const { token } = session
  const day = useData<VacancyView>('/vacancy', token, 2000)
  const list = useData<ApplicationView[]>('/applications', token, 2000)
  const [problem, setProblem] = useState('')
  const [success, setSuccess] = useState('')
  const [busy, setBusy] = useState(false)
  const isHr = session.role === 'hr'
  const job = day.value
  const applications = list.value ?? []
  async function send(path: string, body: unknown, message: string) {
    setProblem(''); setSuccess(''); setBusy(true)
    try {
      await request(path, token, body)
      setSuccess(message); day.refresh(); list.refresh()
    } catch (reason) { setProblem((reason as Error).message) }
    finally { setBusy(false) }
  }
  function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const toDate = (key: string) => {
      const input = String(fields.get(key) ?? '')
      return input ? new Date(input).toISOString() : undefined
    }
    void send('/vacancy', { level: Number(fields.get('level')), focus: fields.getAll('focus'), experience: fields.get('experience'),
      opensAt: toDate('opensAt'), closesAt: toDate('closesAt'), assessmentClosesAt: toDate('assessmentClosesAt') }, 'Vacancy published.')
  }
  return <>
    <header className="pagehead"><div><span className="eyebrow">{isHr ? 'Recruitment' : 'Applicant desk'}</span><h1>{isHr ? 'Hiring desk' : 'Your application'}</h1>
    <p>Project Coordinator · {job?.companyName || 'Demo workplace'}</p></div></header>
    {(problem || day.error || list.error) && <p role="alert" className="notice danger">{problem || day.error || list.error}</p>}
    {success && <p role="status" className="notice">{success}</p>}
    {job && ['Suspended', 'Revoked'].includes(job.organization) && <p className="notice danger" role="status">Organization {job.organization.toLowerCase()}. New recruiting actions are unavailable.</p>}
    {job && <section className="panel stack">
      <div className="line"><h2>{job.title}</h2><Status>{job.status}</Status></div>
      {job.companyName && <div className="actions"><Status>{job.organization}</Status><a href={'#/verify/' + job.companyId}>Verify organization</a></div>}
      {job.vacancy && <><p>{job.vacancy.experience} · Level {job.vacancy.level}</p><p>Applications close {localTime(job.vacancy.closesAt)}. Start the assessment by {localTime(job.vacancy.assessmentClosesAt)}.</p><p>Focus: {job.vacancy.focus.join(', ')}</p></>}
      {isHr && <details open={!job.vacancy}><summary>Vacancy settings</summary><form className="stack section-gap" onSubmit={publish}>
        <div className="form-grid">
          <label>Assessment difficulty<select name="level" defaultValue={job.vacancy?.level ?? 1}><option value="1">Level 1 · Coordination</option><option value="2">Level 2 · Delayed handoff</option><option value="3">Level 3 · Approval dependency</option></select></label>
          <label>Experience expectation<input name="experience" defaultValue={job.vacancy?.experience ?? 'Early career · 0–2 years'} /></label>
        </div>
        <fieldset><legend>Competencies in focus</legend>{competencies.map(item => <label className="check" key={item}><input type="checkbox" name="focus" value={item} defaultChecked={job.vacancy?.focus.includes(item) ?? true} />{item}</label>)}</fieldset>
        <div className="form-grid">{([['opensAt', 'Applications open'], ['closesAt', 'Applications close'], ['assessmentClosesAt', 'Assessment launch cutoff']] as const).map(([name, label]) =>
          <label key={name}>{label}<input name={name} type="datetime-local" defaultValue={job.vacancy ? dateInput(job.vacancy[name]) : undefined} /></label>)}</div>
        <button disabled={busy}>{job.vacancy ? 'Publish vacancy again' : 'Publish vacancy'}</button>
      </form></details>}
      {!isHr && job.status === 'Open' && !applications.length && <button disabled={busy} onClick={() => void send('/applications', {}, 'Application submitted.')}>Apply for Project Coordinator</button>}
    </section>}
    <section className="panel stack"><h2>{isHr ? 'Applications' : 'Assessment and feedback'}</h2>
      {!applications.length && <p>{isHr ? 'No applications yet.' : 'Your assessment appears after you apply.'}</p>}
      <ul className="rows">{applications.map(item => <li key={item.id} className="stack">
        <div className="line"><strong>{item.sample || (isHr ? item.name : 'Project Coordinator assessment')}</strong><Status>{item.completed ? 'Completed' : item.runId ? 'In progress' : 'Applied'}</Status></div>
        {item.decision && <p><strong>{item.decision.outcome}</strong> · {item.decision.feedback}</p>}
        <div className="actions">
          {item.completed && <a href={'#/report/' + item.id}>Open evidence report</a>}
          {!isHr && !item.completed && item.runId && <a href={'#/workplace/' + item.runId}>Resume assessment</a>}
          {!isHr && !item.runId && job?.organization === 'Verified' && <a href={'#/orientation/' + item.id}>Open orientation</a>}
        </div>
      </li>)}</ul>
    </section>
    {!isHr && <Profile token={token} />}
  </>
}

function Profile({ token }: { token: string }) {
  const { value, error } = useData<{ summary: string; links: string[] }>('/profile', token)
  const [message, setMessage] = useState('')
  return <details className="panel"><summary>Optional candidate profile</summary>
    {error && <p role="alert">{error}</p>}
    {value && <form className="stack section-gap" onSubmit={async event => {
      event.preventDefault()
      const form = new FormData(event.currentTarget)
      try {
        await request('/profile', token, { summary: form.get('summary'), links: String(form.get('links')).split('\n').map(link => link.trim()).filter(Boolean) })
        setMessage('Profile saved for this demo.')
      } catch (reason) { setMessage((reason as Error).message) }
    }}>
      <label>Professional summary<textarea name="summary" defaultValue={value.summary} maxLength={250} rows={2} /></label>
      <label>Professional or certificate links (one per line)<textarea name="links" defaultValue={value.links.join('\n')} rows={2} /></label>
      <button>Save profile</button>{message && <p role="status">{message}</p>}
    </form>}
  </details>
}

export function EvidenceReport({ session, id }: { session: Session; id: string }) {
  const data = useData<Report & { application: ApplicationView }>('/applications/' + id + '/report', session.token)
  const [selected, setSelected] = useState('')
  const [problem, setProblem] = useState('')
  const [saved, setSaved] = useState(false)
  const report = data.value
  const event = report?.evidence.find(item => item.id === selected)
  return <>
    <header className="pagehead"><div><span className="eyebrow">Evidence-first evaluation</span><h1>Project Coordinator report</h1><p>{report?.application.sample || report?.application.name}</p></div></header>
    {(data.error || problem) && <p role="alert" className="notice danger">{data.error || problem}</p>}
    {report && <>
      <section className="panel stack"><h2>Competency review</h2><p>{report.method}</p>
        <p><code>{report.rubricVersion}</code> · <code>{report.scenarioVersion}</code> · {report.integrity.count} verified evidence events</p>
        <ul className="rows">{report.competencies.map(item => <li className="stack" key={item.competency}>
          <div className="line"><h3>{item.competency}</h3><Status>{item.state}</Status></div>
          {item.criteria.map(criterion => <div className="line" key={criterion.label}>
            <span>{criterion.met ? 'Observed' : 'Gap'} · {criterion.label}</span><button className="secondary small" aria-label={'Inspect evidence: ' + criterion.label} onClick={() => setSelected(criterion.evidenceId)}>Evidence {criterion.evidenceId.split('-').at(-1)}</button>
          </div>)}
        </li>)}</ul>
        {event && <section className="notice stack" aria-live="polite"><h3>Evidence detail</h3><code>{event.id}</code><p>{event.actor} · {event.action.replaceAll('-', ' ')} · Virtual second {event.virtualSeconds.toFixed(1)}</p>
          <details open><summary>Recorded artifact</summary><pre>{JSON.stringify(event.after, null, 2)}</pre></details>
          <details><summary>Prior state and integrity</summary><pre>{JSON.stringify(event.before, null, 2)}</pre><code>{event.digest}</code></details></section>}
        <details><summary>Evidence timeline</summary><ul className="rows">{report.evidence.map(item => <li key={item.id}><button className="secondary small" onClick={() => setSelected(item.id)}>{item.action.replaceAll('-', ' ')} · {item.actor} · {item.virtualSeconds.toFixed(1)}s</button></li>)}</ul></details>
      </section>
      {session.role === 'hr' && !report.application.sample && <section className="panel stack"><h2>Human hiring decision</h2>
        <form className="stack" onSubmit={async event => {
          event.preventDefault(); setProblem(''); setSaved(false)
          const form = new FormData(event.currentTarget)
          try {
            await request('/applications/' + id + '/decision', session.token, { outcome: form.get('outcome'), feedback: form.get('feedback') })
            setSaved(true); data.refresh()
          } catch (reason) { setProblem((reason as Error).message) }
        }}>
          <label>Decision<select name="outcome" defaultValue={report.application.decision?.outcome}><option>Hire</option><option>Do not hire</option></select></label>
          <label>Applicant feedback<textarea name="feedback" rows={3} maxLength={1500} defaultValue={report.application.decision?.feedback} required /></label>
          <button>Save human decision</button>{saved && <p role="status">Decision and feedback saved.</p>}
        </form>
      </section>}
      {session.role === 'applicant' && report.application.decision && <section className="panel"><h2>Hiring feedback</h2><p>{report.application.decision.outcome} · {report.application.decision.feedback}</p></section>}
    </>}
  </>
}
