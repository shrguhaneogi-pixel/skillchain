'use client'

import { useState } from 'react'
import { boundedInteger, estimate } from '@/lib/requests'

export default function Estimator() {
  const [candidates, setCandidates] = useState('30')
  const [runs, setRuns] = useState('1')
  const result = estimate(candidates, runs)
  const invalidCandidates = boundedInteger(candidates, 0, 10_000) === null
  const invalidRuns = boundedInteger(runs, 1, 3) === null

  return <section id="estimator" className="card">
    <h2>Plan your assessment credits.</h2>
    <div className="form-grid">
      <div>
        <label htmlFor="estimate-candidates">Expected candidates</label>
        <input id="estimate-candidates" inputMode="numeric" value={candidates} onChange={event => setCandidates(event.target.value)}
          aria-invalid={invalidCandidates} aria-describedby={invalidCandidates ? 'estimate-candidates-error' : undefined}/>
        {invalidCandidates && <small id="estimate-candidates-error" className="field-error">Enter a whole number from 0 to 10,000.</small>}
        <label htmlFor="estimate-runs">Valid assessments per candidate</label>
        <input id="estimate-runs" inputMode="numeric" value={runs} onChange={event => setRuns(event.target.value)}
          aria-invalid={invalidRuns} aria-describedby={invalidRuns ? 'estimate-runs-error' : undefined}/>
        {invalidRuns && <small id="estimate-runs-error" className="field-error">Enter a whole number from 1 to 3.</small>}
        <p>Exclude practice, abandoned runs and duplicate completions.</p>
        <button type="button" onClick={() => { setCandidates('30'); setRuns('1') }}>Reset</button>
      </div>
      <div>
        <output aria-live="polite">{result && <strong>{result.total.toLocaleString('en-IN')} estimated assessment credits.</strong>}</output>
        <p>This is a planning example. The quote will confirm credit rules and any one-time customization credits.</p>
        {result && <a className="primary" href={`/contact/?topic=standard&c=${result.c}&r=${result.r}`}>Discuss this estimate</a>}
      </div>
    </div>
  </section>
}
