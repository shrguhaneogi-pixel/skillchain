'use client'

import { useRef, useState, type KeyboardEvent } from 'react'
import { MailboxMessage, MailboxThreads } from './Mailbox'

const tools = ['Mailbox', 'Tasks', 'Calendar', 'Budget'] as const

export default function ToolTour() {
  const [current, choose] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  function nav(event: KeyboardEvent) {
    const offset = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (!offset && event.key !== 'Home' && event.key !== 'End') return
    event.preventDefault()
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tools.length - 1
      : (current + offset + tools.length) % tools.length
    choose(next)
    tabs.current[next]?.focus()
  }

  return <section id="mailbox" className="card">
    <div className="kicker">Fictional demo data · Scripted demo</div>
    <div role="tablist" aria-label="Inspect work tools" className="tool-tabs" onKeyDown={nav}>
      {tools.map((tool, index) => <button type="button" role="tab" aria-selected={current === index}
        aria-controls="tool-preview" id={'tour-' + index} key={tool} tabIndex={current === index ? 0 : -1}
        onClick={() => choose(index)} ref={element => { tabs.current[index] = element }}>{tool}</button>)}
    </div>
    <div id="tool-preview" role="tabpanel" aria-labelledby={'tour-' + current} tabIndex={0}>
      {current === 0 && <div className="mailgrid"><MailboxThreads visible={[0, -1]} read={[0]} selected={0}/>
        <article className="thread"><MailboxMessage index={0}/></article></div>}
      {current === 1 && <div className="thread"><h2>Recovery check</h2><p>Unassigned / Waiting</p></div>}
      {current === 2 && <div className="thread"><h2>Calendar</h2><p>10:24–10:44 IST · Client demo</p><p>Diya Roy · Demonstrate the release to the client.</p></div>}
      {current === 3 && <div className="thread"><h2>Budget sheet</h2><dl><div><dt>Approved amount</dt><dd>₹18,000</dd></div>
        <div><dt>Draft amount</dt><dd>₹22,000</dd></div><div><dt>Difference</dt><dd>₹4,000</dd></div></dl></div>}
    </div>
  </section>
}
