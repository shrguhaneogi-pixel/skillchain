'use client'

import { useEffect, useRef, useState } from 'react'
import { incidents, reduce, start } from '@/lib/engine'

export function IncidentDesk({ embedded = false }: { embedded?: boolean }) {
  const stage = useRef<HTMLElement>(null)
  const scene = useRef<HTMLDivElement>(null)
  const [readAll, setReadAll] = useState(false)
  const [sticky, setSticky] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!stage.current || !scene.current || readAll || embedded) return
    const container = stage.current
    const content = scene.current
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const size = matchMedia('(min-width: 1200px) and (min-height: 700px)')
    let frame = 0
    const update = () => {
      const canStick = size.matches && !reduced.matches &&
        document.documentElement.dataset.reducedMotion !== 'true' &&
        content.offsetHeight + 72 < window.innerHeight
      setSticky(canStick)
      if (!canStick) { setStep(3); return }
      const travel = Math.max(window.innerHeight * 0.5, container.offsetHeight - content.offsetHeight)
      const progress = (72 - container.getBoundingClientRect().top) / travel
      setStep(progress >= .85 ? 3 : progress >= .55 ? 2 : progress >= .25 ? 1 : 0)
    }
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update) }
    const layout = new ResizeObserver(schedule)
    const preference = new MutationObserver(schedule)
    layout.observe(content)
    preference.observe(document.documentElement, {attributes:true,attributeFilter:['data-reduced-motion']})
    reduced.addEventListener('change', schedule)
    size.addEventListener('change', schedule)
    window.addEventListener('scroll', schedule, {passive:true})
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      layout.disconnect()
      preference.disconnect()
      reduced.removeEventListener('change', schedule)
      size.removeEventListener('change', schedule)
      window.removeEventListener('scroll', schedule)
    }
  }, [readAll, embedded])

  return <section ref={stage} id="incident-desk" className="hero-stage" data-sticky={sticky && !readAll} data-step={step}>
    <div className="hero-scene wrap" ref={scene}>
      <header>
        {embedded ? <h2>Step into the incident desk.</h2> : <>
          <p className="kicker">WORKPLACE READINESS, REIMAGINED</p>
          <h1>Your résumé tells a story. Your decisions prove it.</h1>
        </>}
        <p className="lead">Enter a realistic workplace simulation. Show how you set priorities, keep a client informed and help a team recover when the plan changes.</p>
        {!embedded && <div className="controlrow"><a className="primary" href="/demo/">Experience a simulation</a>
          <a className="secondary" href="/skillproof/">Explore SkillProof</a></div>}
      </header>
      <div className="incident-pane">
        <div className="incident-pane-head">PROJECT COORDINATOR / SIMULATION 01 · Scripted preview</div>
        <div className="incident-body">
          <article className="incident-rahul"><p className="kicker">10:04 IST · <span>Incident active</span></p>
            <h2>Rahul Kapoor · Senior Developer</h2><p>“The demo server is unresponsive. I can run a recovery check. Who owns it?”</p></article>
          <article className="incident-alex"><p className="kicker">10:05 IST</p>
            <h2>Alex Morgan · Project Manager</h2><p>“The client demo is at 10:24. What can I tell them now?”</p></article>
          <p className="incident-end"><a href="#preview">Your decision changes what happens next.</a></p>
          <button type="button" onClick={() => {setReadAll(true);setStep(3)}} aria-pressed={readAll}>Read all incidents</button>
        </div>
      </div>
    </div>
  </section>
}

export function ReplyExcerpt() {
  const [answer, setAnswer] = useState<'A' | 'B' | null>(null)
  const task = answer ? reduce(start('Self-paced'), {type:'reply',i:0,answer,at:0}).tasks[0] : null
  return <section id="preview" className="wrap home-section">
    <div className="home-split">
      <div><h2>Rahul is waiting for a reply.</h2>
        <p>The client demo starts in twenty minutes. Who should take the recovery check? Choose a reply to see what changes on the task board.</p>
        <p className="kicker">One scripted decision · no sign-up.</p>
        <div className="reply-options">{incidents[0].choices.map((option, index) => <button key={option} type="button"
          aria-pressed={answer === (index === 0 ? 'A' : 'B')} onClick={() => setAnswer(index === 0 ? 'A' : 'B')}>{option}</button>)}</div>
      </div>
      <div className="card excerpt-card">
        <div className="kicker">Scripted demo</div>
        <div aria-live="polite">
          {task && <><p>{answer === 'A'
            ? 'Rahul owns the recovery check. Alex now has an owner to name in the client update.'
            : 'Recovery is waiting on you. Alex still needs an owner for the client update.'}</p>
            <p className="taskcard">Recovery check · {task.owner} / {task.status}</p></>}
        </div>
        <div className="controlrow">{task && <button type="button" onClick={() => setAnswer(null)}>Try the other reply</button>}
          <a className="primary" href="/demo/">Start the full simulation</a></div>
      </div>
    </div>
  </section>
}

const audiences = [
  ['Candidates', 'Show how you work.', 'Decide what to delegate and what to tell the client. In an employer-requested assessment, your feedback covers strengths and areas to practise, normally within 2–3 business days.', 'Try the demo', '/demo/'],
  ['Recruiters', 'Bring the decision into the interview.', 'Read the candidate’s reply alongside its consequence. Use the evidence to ask how they weighed the trade-off.', 'Inspect the sample report', '/fairhire/#report'],
  ['Institutions', 'Turn a placement session into a working day.', 'Use the fictional exercise to discuss ownership, escalation and client communication with a cohort.', 'Discuss a cohort session', '/contact/?topic=institution'],
]

export function AudienceSelector() {
  const [index, setIndex] = useState(0)
  const [, heading, body, label, href] = audiences[index]
  return <section id="audiences" className="wrap home-section">
    <h2>What would you like to see?</h2>
    <div className="controlrow" aria-label="Audience">{audiences.map(([name], i) => <button key={name}
      type="button" aria-pressed={i === index} aria-controls="audience-content" onClick={() => setIndex(i)}>{name}</button>)}</div>
    <article id="audience-content" className="card"><h3>{heading}</h3><p>{body}</p><a className="primary" href={href}>{label}</a></article>
  </section>
}

export function PrivacyDisclosures() {
  const first = useRef<HTMLDetailsElement>(null)
  useEffect(() => {
    const media = matchMedia('(min-width: 1200px)')
    if (first.current) first.current.open = media.matches
  }, [])
  return <section id="privacy-overview" className="wrap home-section">
    <h2>Know what gets recorded.</h2>
    <details ref={first}><summary>What does this demo remember?</summary><p>Your replies and task changes stay in this browser’s memory for the current run. Exit and clear it or reload to remove them.</p></details>
    <details><summary>Who sees which report?</summary><p>In the proposed assessment workflow, recruiters review scores and the decisions behind them. Candidates receive strengths and improvement areas. In the public demo, the recruiter lens is a separately labelled illustration.</p></details>
    <details><summary>What is verified?</summary><p>The credential viewer contains fictional examples. Before a real check, the service would explain the purpose, recipient and choices. Qualification verification would be optional.</p></details>
    <div className="controlrow"><a className="secondary" href="/privacy/">Read the privacy notice</a><a className="secondary" href="/trustchain/">Explore TrustChain</a></div>
  </section>
}
