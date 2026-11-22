import ToolTour from '@/components/ToolTour'

export default function SkillProofPage() {
  return <main id="main" className="wrap">
    <div className="page-split">
      <header className="pageintro">
        <div className="sectionline">SkillProof</div>
        <h1>What would you do with twenty minutes?</h1>
        <p className="lead">A client demo is due, the service is down, and Finance has found a discrepancy. Take the coordinator’s seat.</p>
        <a href="/demo/" className="primary">Enter the coordinator demo</a>
      </header>
      <ToolTour/>
    </div>
    <section><h2>Role library</h2>
      <div className="plans">
        <article className="card"><h3>Project Coordinator</h3><p>Playable · Foundation</p></article>
        <article className="card"><h3>Operations Associate</h3><p>Role outline</p></article>
        <article className="card"><h3>Administrative Coordinator</h3><p>Role outline</p></article>
      </div>
      <p><a href="/simulations/">Explore simulations</a></p>
    </section>
    <section><h2>Who runs the workplace?</h2>
      <div className="pair">
        <article className="card"><h3>Scenario Controller · scripted</h3><p>The scripted controller delivers the incident, applies the chosen response and records what changes.</p></article>
        <article className="card"><h3>Proposed architecture</h3>
          <ol className="architecture">
            <li><strong>Master Agent · proposed</strong> coordinates role-playing colleagues.</li>
            <li><strong>Role agents</strong> propose dialogue.</li>
            <li><strong>Scenario Controller</strong> validates permissions and alone advances timing and shared state.</li>
            <li><strong>Evidence logger</strong> records accepted actions for review.</li>
          </ol>
        </article>
      </div>
    </section>
  </main>
}
