export default function AboutPage() {
  return <main id="main" className="wrap">
    <div className="page-split">
      <header><h1>A first job asks for experience. Where can you show it?</h1>
        <p className="lead">SkillChain began with a question about early-career hiring in India. What could an employer learn by seeing a graduate handle a difficult twenty minutes at work?</p>
        <a className="primary" href="/demo/">Walk through a work sample</a>
      </header>
      <section className="card"><h2>Where the project stands</h2>
        <details><summary>Design the work sample</summary><p>The ideathon scenario follows three linked decisions during a threatened client demo.</p></details>
        <details><summary>Prototype the coordinator role</summary><p>The scripted build lets a candidate answer workplace messages and inspect what changed.</p></details>
        <details><summary>Validate with people who do the job</summary><p>A future trial would invite candidates and reviewers to assess how the brief and findings work in practice.</p></details>
      </section>
    </div>
    <section><h2>For institutions</h2><p>Use fictional runs in placement preparation to discuss ownership, escalation and client communication with a cohort.</p></section>
  </main>
}
