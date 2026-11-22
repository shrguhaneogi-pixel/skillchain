import Estimator from '@/components/Estimator'
import { Intro } from '@/components/Products'

const plans = [
  ['Free exploration', 'Play the public demo and inspect a sample report. Job publishing is unavailable in the demo.', '/demo/', 'Try the demo'],
  ['Standard subscription', 'Proposed employer access to reusable scenarios, with assessment credits for valid runs.', '/contact/?topic=standard', 'Discuss standard access'],
  ['Professional customization', 'Scope a role-specific blueprint, scoring rubric and review with our team. Custom creation is quoted separately.', '/contact/?topic=custom', 'Discuss customization'],
]

export default function PricingPage() {
  return <main id="main" className="wrap">
    <Intro name="Pricing" title="Employers fund assessments. Candidates participate for free."
      lead="Explore a sample for free, plan access to the role library, or discuss a scenario built for your team."/>
    <div className="plans">{plans.map(([name, body, href, label]) => <section key={name} className="card">
      <h2>{name}</h2><p>{body}</p><a className="secondary" href={href}>{label}</a>
    </section>)}</div>
    <Estimator/>
  </main>
}
