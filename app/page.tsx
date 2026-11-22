import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { AudienceSelector, IncidentDesk, PrivacyDisclosures, ReplyExcerpt } from '@/components/HomeInteractive'
import Estimator from '@/components/Estimator'
import Walkthrough from '@/components/Walkthrough'

const tiles = [
  ['mail', 'Inside the mailbox', 'Read the incident that starts the day.', '/skillproof/#mailbox', 'Rahul asks who owns the demo server recovery check.', 1440, 900],
  ['board', 'On the task board', 'See who owns the recovery check.', '/demo/?tool=tasks', 'The recovery check is assigned to Rahul and marked In progress.', 1200, 900],
  ['brief', 'In the role brief', 'See what a coordinator is responsible for.', '/simulations/', 'Foundation brief for the playable Project Coordinator role.', 960, 720],
  ['credential', 'On the credential record', 'Inspect a fictional employer check.', '/trustchain/#credential', 'Sample employer record with a fictional verification status.', 960, 720],
  ['evidence', 'Behind a finding', 'Follow a reviewer’s score back to a reply.', '/fairhire/#report', 'A sample communication finding points to the reply to Alex.', 960, 720],
] as const

const workflow = [
  ['TrustChain / Establish context.', 'The proposed service checks the parties involved and explains what will be shared. Inspect a fictional verification record.'],
  ['SkillProof / Do the work.', 'Read the incident, choose the next action and see how your coworkers respond.'],
  ['Evidence review / Trace the decision.', 'Connect the reply to its task owner and the relevant competency.'],
  ['FairHire / Ask a better question.', 'A recruiter can open the evidence and discuss the candidate’s reasoning. A person makes the hiring decision.'],
]

function media(name: string) {
  const path = join(process.cwd(), 'public/media', name + '-walkthrough')
  const available = ['.mp4', '-poster.webp', '.en.vtt', '-transcript.txt'].every(suffix => existsSync(path + suffix))
  return {available, transcript: available ? readFileSync(path + '-transcript.txt', 'utf8').trim() : ''}
}

export default function Home() {
  const candidate = media('candidate')
  const employer = media('employer')
  return <main id="main" className="home">
    <IncidentDesk/>
    <section id="gap" className="wrap home-section home-split">
      <div><h2>What happens after the interview?</h2>
        <p>A résumé lists the projects you worked on. An interview gives you time to explain one. A work sample lets someone see the moment you choose what to do first.</p></div>
      <dl className="gap-lines"><div><dt>Résumé</dt><dd>Coordinated a release.</dd></div>
        <div><dt>Interview</dt><dd>Explained a difficult handoff.</dd></div>
        <div><dt>Work sample</dt><dd><a href="#preview">Assigned Rahul to recovery and agreed the next update.</a></dd></div></dl>
    </section>
    <ReplyExcerpt/>
    <section id="product-screens" className="wrap home-section">
      <h2>Follow the work through five screens.</h2><p>Open a desk, a role brief or a report and inspect the details yourself.</p>
      <div className="bento">{tiles.map(([name, title, caption, href, alt, width, height]) => {
        const path = '/media/bento/bento-' + name
        const sources = (format: string) => [400, 800, width].map(pixels => `${path}-${pixels}.${format} ${pixels}w`).join(', ')
        const sizes = '(min-width: 1200px) 42vw, (min-width: 768px) 45vw, 92vw'
        return <a className="bento-tile" href={href} key={name}><figure>
          <picture><source type="image/avif" srcSet={sources('avif')} sizes={sizes}/>
            <img src={path+'-400.webp'} srcSet={sources('webp')} sizes={sizes} alt={alt}
              width={width} height={height} loading="lazy" decoding="async"/>
          </picture>
          <figcaption><h3>{title}</h3><p>{caption}</p></figcaption>
        </figure></a>
      })}</div>
    </section>
    <section id="workflow" className="wrap home-section">
      <h2>From a work sample to a hiring conversation.</h2>
      <ol className="workflow">{workflow.map(([title, body]) => <li className="card" key={title}>
        <details open><summary>{title}</summary><p>{body}</p></details>
      </li>)}</ol>
      <div className="controlrow"><a href="/trustchain/#credential">Inspect the sample record</a><a href="/demo/">Try the decision</a><a href="/fairhire/#report">Read a sample report</a></div>
    </section>
    <section id="walkthroughs" className="wrap home-section">
      <h2>Watch the same incident from both desks.</h2>
      <div className="pair"><Walkthrough name="candidate" title="A day inside SkillProof"
        lead="Follow a coordinator from the first alert to the evidence behind a finding." fallback="/demo/" {...candidate}/>
        {employer.available && <Walkthrough name="employer" title="The employer’s perspective"
          lead="See the role setup and open the decision that supports a sample score." fallback="/fairhire/#report" {...employer}/>}
      </div>
    </section>
    <AudienceSelector/>
    <section id="funding" className="wrap home-section">
      <h2>Employers fund the assessment.</h2><p>Candidates are never charged to apply or complete employer-requested assessments. The public demonstration is free to explore.</p>
      <div className="pair"><article className="card"><h3>Standard subscription</h3><p>Plan access to the employer role library and assessment credits.</p></article>
        <article className="card"><h3>Professional customization</h3><p>Discuss a workplace scenario and rubric tailored to your team.</p></article></div>
      <Estimator/><p><a className="secondary" href="/pricing/">Compare plans</a></p>
    </section>
    <PrivacyDisclosures/>
    <section id="invitation" className="home-invite"><div className="wrap home-section">
      <h2>The client demo starts at 10:24. Your inbox is open.</h2>
      <p>Step into the coordinator’s role, or bring us a role your team hires for.</p>
      <div className="controlrow"><a className="primary" href="/demo/">Experience a simulation</a>
        <a className="secondary" href="/contact/?topic=demo">Request an employer demo</a></div>
    </div></section>
  </main>
}
