import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { IncidentDesk } from '@/components/HomeInteractive'
import Walkthrough from '@/components/Walkthrough'
import { canonical } from '@/lib/engine'
import './home.css'

const report = '/fairhire/#report'

const tiles = [
  ['mail', 'Inside the mailbox', 'Read the incident that starts the day.', '/skillproof/#mailbox', 'Rahul asks who owns the demo server recovery check.', 1440, 900],
  ['board', 'On the task board', 'See who owns the recovery check.', '/demo/?tool=tasks', 'The recovery check is assigned to Rahul and marked In progress.', 1200, 900],
  ['brief', 'In the role brief', 'See what a coordinator is responsible for.', '/simulations/', 'Foundation brief for the playable Project Coordinator role.', 960, 720],
  ['credential', 'On the credential record', 'Proposed TrustChain · Fictional example', '/trustchain/#credential', 'Sample employer record with a fictional verification status.', 960, 720],
  ['evidence', 'View a sample report', 'Follow a reviewer’s score back to a reply.', report, 'A sample communication finding points to the reply to Alex.', 960, 720],
] as const

const steps = [
  ['Make a decision', 'Read the incident and choose the next action.'],
  ['See what changes', 'Connect the reply to its task owner and the relevant competency.'],
  ['Review the evidence', 'A recruiter can open the evidence and discuss the candidate’s reasoning. A person makes the hiring decision.'],
] as const

const sample = canonical().events.filter(event =>
  event.incident === 0 && ['incoming', 'reply', 'consequence'].includes(event.kind))
const rowNames = ['Source message', 'Selected reply', 'Observed consequence']

function media(name: string) {
  const path = join(process.cwd(), 'public/media', name)
  const available = ['.mp4', '-poster.webp', '.en.vtt', '-transcript.txt'].every(suffix => existsSync(path + suffix))
  return {available, transcript: available ? readFileSync(path + '-transcript.txt', 'utf8').trim() : ''}
}

export default function Home() {
  return <main id="main" className="home">
    <section className="wrap home-hero" aria-labelledby="scroll-hero-title">
      <div className="hero-copy">
        <h1 id="scroll-hero-title">Experience the workplace. Prove your potential.</h1>
        <p className="lead">Practice real workplace decisions in a fictional simulation.</p>
        <div className="controlrow">
          <a className="primary" href="/demo/" aria-describedby="demo-duration">Try the simulation</a>
          <a className="secondary" href={report}>View a sample report</a>
        </div>
        <p id="demo-duration" className="home-meta">Up to 2:05 for timed decisions · No sign-up</p>
      </div>
      <Walkthrough name="scroll-hero" title="Watch the concept film" fallback="/demo/" concept {...media('scroll-hero')}/>
    </section>

    <IncidentDesk/>

    <section id="workflow" className="wrap home-section" aria-labelledby="evidence-heading">
      <header className="section-heading">
        <h2 id="evidence-heading">From decision to evidence.</h2>
        <ol className="evidence-steps">{steps.map(([title, body]) => <li key={title}>
          <h3>{title}</h3><p>{body}</p>
        </li>)}</ol>
      </header>
      <article className="evidence-record" aria-labelledby="sample-heading">
        <div className="evidence-heading">
          <div><p className="kicker">FairHire · Fictional demo data</p><h3 id="sample-heading">Candidate <span>C-017</span></h3></div>
          <a className="secondary" href={report}>View a sample report</a>
        </div>
        <dl className="evidence-rows">{sample.map((event, index) => <div key={event.id}>
          <dt>{rowNames[index]}<small>{event.time} IST · {event.actor}</small></dt>
          <dd>{event.text}</dd>
        </div>)}</dl>
        <a className="evidence-link" href={report}>View evidence</a>
      </article>
      <div id="product-screens" className="bento">{tiles.map(([name, title, caption, href, alt, width, height]) => {
        const path = '/media/bento/bento-' + name
        const sources = (format: string) => [400, 800, width].map(pixels => `${path}-${pixels}.${format} ${pixels}w`).join(', ')
        const sizes = '(min-width: 1200px) 18vw, (min-width: 768px) 30vw, 90vw'
        return <a className="bento-tile" href={href} key={name} aria-labelledby={name+'-tile-title'}>
          <figure>
            <picture><source type="image/avif" srcSet={sources('avif')} sizes={sizes}/>
              <img src={path+'-400.webp'} srcSet={sources('webp')} sizes={sizes} alt={alt}
                width={width} height={height} loading="lazy" decoding="async"/>
            </picture>
            <figcaption><h3 id={name+'-tile-title'}>{title}</h3><p>{caption}</p></figcaption>
          </figure>
        </a>
      })}</div>
    </section>

    <section id="audiences" className="wrap home-section" aria-labelledby="audience-heading">
      <header className="section-heading"><h2 id="audience-heading">Choose your path.</h2></header>
      <div className="audience-paths">
        <article><h3>Candidates</h3><p>Decide what to delegate and what to tell the client.</p>
          <a className="primary" href="/demo/">Try the simulation</a></article>
        <article><h3>Employers</h3><p>Read the candidate’s reply alongside its consequence.</p>
          <a className="secondary" href={report}>View a sample report</a>
          <a className="secondary" href="/contact/?topic=demo">Request an employer demo</a></article>
        <article><h3>Institutions</h3><p>Use the fictional exercise to discuss ownership, escalation and client communication with a cohort.</p>
          <a className="secondary" href="/contact/?topic=institution">Discuss a cohort session</a></article>
      </div>
      <div id="walkthroughs" className="pair">
        <Walkthrough name="candidate-walkthrough" title="A day inside SkillProof" fallback="/demo/"
          lead="Follow a coordinator from the first alert to the evidence behind a finding." {...media('candidate-walkthrough')}/>
        <Walkthrough name="employer-walkthrough" title="The employer’s perspective" fallback={report}
          lead="See the role setup and open the decision that supports a sample score." {...media('employer-walkthrough')}/>
      </div>
    </section>

    <section id="invitation" className="home-invite"><div className="wrap home-section">
      <h2>The client demo starts at 10:24. Your inbox is open.</h2>
      <div className="controlrow">
        <a className="primary" href="/demo/">Try the simulation</a>
        <a className="secondary" href="/contact/?topic=demo">Request an employer demo</a>
      </div>
      <p><a id="privacy-overview" href="/privacy/#privacy-overview">Demo data is fictional</a>, and <a id="funding" href="/pricing/#estimator"><span id="estimator">candidates are never charged to apply or complete employer-requested assessments</span></a>.</p>
    </div></section>
  </main>
}
