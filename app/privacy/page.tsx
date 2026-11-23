import Policy, { type PolicySection } from '@/components/Policy'

const sections: PolicySection[] = [
  [
    "public-demo",
    "Public demo",
    "The exercise uses fictional people and preset replies. Your browser holds the choices, task changes and evidence for the current run in memory. Exit and clear the run, or reload the page, to remove it. The example report on FairHire is a separate fictional sample. Your run is not sent to a recruiter."
  ],
  [
    "what-the-workspace-records",
    "What the workspace records",
    "The exercise records the selected reply, its scenario time, resulting task changes and any manual board changes. It uses these to show how a reviewer can trace a finding. The prototype does not ask for identity documents, recordings, biometrics or wallet details. The hosting service may process ordinary request information such as IP addresses and request times when serving the site."
  ],
  [
    "requests-to-the-team",
    "Requests to the team",
    "The contact form prepares a request on your device. Copying or downloading creates a copy you control. Opening the draft passes the details to your chosen email application. Sending it shares them with the destination shown in that draft. The team uses received details to address the request. Avoid including private candidate information."
  ],
  [
    "employer-requested-assessments",
    "Employer-requested assessments",
    "Before a real assessment, the proposed service would show who requested it, the purpose, activities recorded, recipients, how long records are retained and how to request support, correction or withdrawal. Optional qualification checks would have a separate choice. In the planned workflow the employer reviews job-relevant evidence and scores. Candidates receive strengths and improvement areas, normally within 2–3 business days."
  ],
  [
    "verification-and-your-choices",
    "Verification and your choices",
    "Verification records on this site are examples. The viewer makes no identity, qualification or blockchain enquiries. You may leave the demo at any time. Contact the team about a concern or correction using the Privacy or correction topic."
  ]
]

export default function Page() {
  return <Policy title="How your information is used" sections={sections} crossLink="Terms">
    <section id="privacy-overview">
      <h2>Know what gets recorded.</h2>
      <details><summary>What does this demo remember?</summary><p>Your replies and task changes stay in this browser’s memory for the current run. Exit and clear it or reload to remove them.</p></details>
      <details><summary>Who sees which report?</summary><p>In the proposed assessment workflow, recruiters review scores and the decisions behind them. Candidates receive strengths and improvement areas. In the public demo, the recruiter lens is a separately labelled illustration.</p></details>
      <details><summary>What is verified?</summary><p>The credential viewer contains fictional examples. Before a real check, the service would explain the purpose, recipient and choices. Qualification verification would be optional.</p></details>
      <div className="controlrow"><a className="secondary" href="/privacy/">Read the privacy notice</a><a className="secondary" href="/trustchain/">Explore TrustChain</a></div>
    </section>
  </Policy>
}
