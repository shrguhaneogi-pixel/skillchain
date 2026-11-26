import React, { useState } from 'react'
import type { FormEvent } from 'react'
import type { Action, Workplace } from '../../api/src/simulation.ts'
import type { ApplicationView } from '../../api/src/server.ts'
import { request, useData } from './client.ts'

const incidents = { outage: 'Database outage', demo: 'Client demo', budget: 'Budget discrepancy' } as const
const people = { applicant: 'Mira Sen', manager: 'Project Manager', developer: 'Developer', client: 'Client Representative', finance: 'Finance / Ops Officer', unassigned: 'Unassigned' } as const
const fmt = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`

function IncidentOptions() {
  return Object.entries(incidents).map(([id, title]) => <option key={id} value={id}>{title}</option>)
}

export function Orientation({ token, id }: { token: string; id: string }) {
  const { value, error } = useData<ApplicationView[]>('/applications', token)
  const application = value?.find(item => item.id === id)
  const [problem, setProblem] = useState('')
  const [busy, setBusy] = useState(false)
  async function begin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setProblem(''); setBusy(true)
    try {
      const run = await request<Workplace>('/applications/' + id + '/run', token, { allowance: Number(form.get('allowance')), consent: form.has('consent') })
      location.hash = '#/workplace/' + run.id
    } catch (reason) { setProblem((reason as Error).message) }
    finally { setBusy(false) }
  }
  return <><header className="pagehead"><div><span className="eyebrow">SkillProof orientation</span><h1>Project Coordinator</h1><p>Three incidents are active when your work begins.</p></div></header>
    {(error || problem) && <p role="alert" className="notice danger">{error || problem}</p>}
    <section className="panel stack"><h2>{application ? 'Assessment · Level ' + application.level : 'Assessment'}</h2>
      <ol className="briefing"><li>Use the task board to set ownership, priority, and deadlines.</li><li>Send workplace emails with the appropriate recipient and incident link.</li><li>Confirm a viable demo plan while handling recovery and the budget discrepancy.</li></ol>
      <p>Scripted colleagues react to workplace actions. Your written messages are kept with the evidence for human review.</p>
      {application && <form onSubmit={begin} className="stack">
        <label>Time allowance<select name="allowance"><option value="1">1× Standard</option><option value="1.5">1.5× Extended</option><option value="2">2× Extended</option></select></label>
        <label className="check"><input type="checkbox" name="consent" required />I consent to recording my simulation actions and messages for this demo assessment.</label>
        <button disabled={busy}>{application.runId ? 'Resume assessment' : 'Start assessment'}</button>
      </form>}
    </section></>
}

function TaskForm({ task, disabled, send }: { task?: Workplace['tasks'][number]; disabled: boolean; send: (action: Action) => Promise<boolean> }) {
  const [editing, setEditing] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const saved = await send({
      type: 'task', id: task?.id, title: String(form.get('title')),
      incident: (task?.incident ?? form.get('incident')) as keyof typeof incidents,
      assignee: form.get('assignee') as keyof typeof people,
      priority: form.get('priority') as Workplace['tasks'][number]['priority'], due: Math.round(Number(form.get('due')) * 60),
    })
    if (saved) setEditing(false)
  }
  if (!editing) return task
    ? <li className="task"><div><strong>{task.title}</strong><p>{incidents[task.incident]} · {people[task.assignee]} · Due {fmt(task.due)}</p></div>
      <div className="actions"><span className={'status ' + task.priority}>{task.priority}</span><button className="secondary small" disabled={disabled} aria-label={'Edit ' + task.title} onClick={() => setEditing(true)}>Edit</button></div></li>
    : <button className="secondary" disabled={disabled} onClick={() => setEditing(true)}>Add task</button>
  const Wrapper = task ? 'li' : 'div'
  return <Wrapper className="task-editor"><form onSubmit={submit} className="stack">
    <label>Task title<input name="title" defaultValue={task?.title} required maxLength={120} /></label>
    {!task && <label>Incident<select name="incident"><IncidentOptions /></select></label>}
    <div className="form-grid">
      <label>Assignee<select name="assignee" defaultValue={task?.assignee ?? 'unassigned'}>{Object.entries(people).map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label>
      <label>Priority<select name="priority" defaultValue={task?.priority ?? 'normal'}><option>normal</option><option>high</option><option>urgent</option></select></label>
      <label>Due (virtual minutes)<input name="due" type="number" min="0" max="25" step="any" defaultValue={(task?.due ?? 300) / 60} required /></label>
    </div>
    <div className="actions"><button disabled={disabled}>Save task</button><button type="button" className="secondary" onClick={() => setEditing(false)}>Cancel</button></div>
  </form></Wrapper>
}

export function Office({ token, id }: { token: string; id: string }) {
  const { value, error, refresh } = useData<Workplace>('/runs/' + id, token, 1000)
  const [selected, setSelected] = useState<string>()
  const [problem, setProblem] = useState('')
  const [busy, setBusy] = useState(false)
  async function update(action?: Action) {
    if (busy) return false
    setProblem(''); setBusy(true)
    try {
      await request('/runs/' + id + (action ? '/actions' : '/finish'), token, action ?? {}, action ? crypto.randomUUID() : undefined)
      refresh(); return true
    } catch (reason) { setProblem((reason as Error).message); return false }
    finally { setBusy(false) }
  }
  if (!value) return <p role={error ? 'alert' : 'status'}>{error || 'Loading the workplace…'}</p>
  const disabled = busy || value.paused || Boolean(value.frozen)
  const selectedMessage = value.inbox.find(item => item.id === selected) ?? value.inbox[0]
  return <>
    <header className="pagehead"><div><span className="eyebrow">SkillProof · Level {value.level} · Scripted colleagues</span><h1>Project Coordinator desk</h1></div>
      <div className="clock"><strong>{fmt(value.at)}</strong><span>{value.frozen ? 'Submitted' : value.paused ? 'Paused' : 'Virtual time'} · {value.allowance}× allowance</span></div></header>
    {(error || problem) && <p className="notice danger" role="alert">{error || problem}</p>}
    {value.paused && <p className="notice" role="status">The Platform Verifier paused the assessment.</p>}
    {value.frozen && <p className="notice" role="status">Assessment submitted. <a href="#/dashboard">Return to your application</a></p>}
    <div className="incidents" aria-label="Active incidents">{Object.entries(incidents).map(([key, title]) => <div key={key}><span className="field-label">Due {fmt(value.deadlines[key as keyof typeof incidents])}</span><strong>{title}</strong></div>)}</div>
    <div className="workgrid">
      <section className="panel mail"><h2>Mailbox</h2>
        <ul className="rows inbox">{[...value.inbox].reverse().map(message => <li key={message.id}><button className="message" aria-pressed={selectedMessage?.id === message.id} onClick={() => setSelected(message.id)}>
          <span>{people[message.sender]}</span><small>{incidents[message.incident]} · {fmt(message.at)}</small></button></li>)}</ul>
        {selectedMessage && <div className="message-body"><strong>{people[selectedMessage.sender]} → {people[selectedMessage.recipient]}</strong><p>{selectedMessage.text}</p></div>}
        {!value.frozen && <form className="stack compose" onSubmit={async event => {
          event.preventDefault()
          const form = event.currentTarget
          const data = new FormData(form)
          if (await update({ type: 'email', recipient: data.get('recipient') as Exclude<keyof typeof people, 'applicant' | 'unassigned'>, incident: data.get('incident') as keyof typeof incidents, body: String(data.get('body')) })) form.reset()
        }}>
          <h3>Compose email</h3><div className="form-grid">
            <label>Recipient<select name="recipient"><option value="manager">Project Manager</option><option value="developer">Developer</option><option value="client">Client Representative</option><option value="finance">Finance / Ops Officer</option></select></label>
            <label>Linked incident<select name="incident"><IncidentOptions /></select></label>
          </div><label>Message<textarea name="body" required maxLength={2000} rows={3} /></label><button disabled={disabled}>Send email</button>
        </form>}
      </section>
      <div className="stack">
        <section className="panel stack"><div className="line"><h2>Task board</h2><span>{value.tasks.length} tasks</span></div>
          <ul className="rows">{value.tasks.map(task => <TaskForm key={task.id} task={task} disabled={disabled} send={update} />)}</ul>
          {!value.frozen && <TaskForm disabled={disabled} send={update} />}
        </section>
        <section className="panel stack"><h2>Incident decisions</h2>
          <p>Database: {value.state.recovered ? 'Recovered' : value.state.recoveryEta === null ? 'Awaiting handoff' : 'Recovery ETA ' + fmt(value.state.recoveryEta)} · Spend: {value.state.hold ? 'On hold' : 'Cleared'}</p>
          <p>Client plan: {value.state.plan ?? 'Unconfirmed'}</p>
          {!value.frozen && <><form className="line" onSubmit={event => {
            event.preventDefault()
            void update({ type: 'plan', plan: new FormData(event.currentTarget).get('plan') as 'recovery' | 'no-cost' | 'paid' })
          }}><label>Demo plan<select name="plan"><option value="recovery">Use recovery ETA</option><option value="no-cost">No-cost fallback</option><option value="paid">Paid fallback</option></select></label><button disabled={disabled}>Confirm plan</button></form>
          <button className="secondary" disabled={disabled || !value.state.hold} onClick={() => void update({ type: 'hold' })}>Record spend hold</button></>}
        </section>
        <section className="panel stack"><h2>Activity timeline</h2><ol className="rows timeline">{[...value.events].reverse().map(event => <li key={event.id}><code>{fmt(event.virtualSeconds)}</code> <strong>{event.action.replaceAll('-', ' ')}</strong> <span>{event.actor}</span></li>)}</ol></section>
      </div>
    </div>
    {!value.frozen && <div className="submit-bar"><span>Submitting freezes the assessment evidence.</span><button disabled={disabled} onClick={() => void update()}>Submit assessment</button></div>}
  </>
}
