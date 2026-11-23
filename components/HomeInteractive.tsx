'use client'

import { useRef, useState } from 'react'
import { incidents, reduce, start } from '@/lib/engine'

const incident = incidents[0]
const initialRun = start('Self-paced')

export function IncidentDesk() {
  const [answer, setAnswer] = useState<'A' | 'B' | null>(null)
  const firstChoice = useRef<HTMLButtonElement>(null)
  const task = (answer ? reduce(initialRun, {type:'reply', i:0, answer, at:0}) : initialRun).tasks[0]!
  const outcome = answer === 'A'
    ? 'Rahul owns the recovery check. Alex now has an owner to name in the client update.'
    : 'Recovery is waiting on you. Alex still needs an owner for the client update.'

  return <section id="incident-desk" className="incident-desk" aria-labelledby="incident-heading">
    <div className="wrap home-section">
      <header id="gap" className="section-heading">
        <p className="kicker">Scripted preview · Fictional demo data</p>
        <h2 id="incident-heading">Step into the incident desk.</h2>
        <p>A work sample lets someone see the moment you choose what to do first.</p>
      </header>
      <div id="preview" className="incident-layout">
        <article className="incident-inbox" aria-labelledby="preview-heading">
          <p className="kicker">Project Coordinator / Simulation 01</p>
          <h3 id="preview-heading">Rahul is waiting for a reply.</h3>
          <div className="incident-message">
            <p><strong>{incident.sender}</strong> · {incident.role} <small>{incident.time} IST</small></p>
            <p>{incident.question}</p>
          </div>
          <div className="reply-options">{incident.choices.map((option, index) => {
            const choice = index === 0 ? 'A' : 'B'
            return <button key={option} ref={index === 0 ? firstChoice : undefined} type="button"
              aria-pressed={answer === choice} onClick={() => setAnswer(choice)}>{option}</button>
          })}</div>
        </article>
        <article className="incident-task" aria-labelledby="task-heading">
          <p className="kicker">Task board</p>
          <h3 id="task-heading">{incident.task}</h3>
          <dl key={answer ?? 'initial'} data-updated={answer !== null} className="task-fields">
            <div><dt>Owner</dt><dd>{task.owner}</dd></div>
            <div><dt>Status</dt><dd>{task.status}</dd></div>
          </dl>
          <p className="preview-result" role="status" aria-atomic="true">
            {answer && <><strong>Updated</strong>{' · '}{task.owner} / {task.status}. {outcome}</>}
          </p>
          {answer && <div className="controlrow">
            <a className="primary" href="/demo/">Start the full simulation</a>
            <button type="button" onClick={() => {
              setAnswer(null)
              firstChoice.current?.focus()
            }}>Try the other reply</button>
          </div>}
        </article>
      </div>
    </div>
  </section>
}
