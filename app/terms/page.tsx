import Policy, { type PolicySection } from '@/components/Policy'

const sections: PolicySection[] = [
  [
    "using-the-demonstration",
    "Using the demonstration",
    "SkillChain offers a fictional workplace exercise for exploring how a work sample can be reviewed. You can try it without an account. Choose the example responses supplied and use only fictional information in the exercise."
  ],
  [
    "participation-and-charges",
    "Participation and charges",
    "Candidates are never charged to apply or to complete an employer-requested assessment. The public demonstration is free to explore. It does not publish jobs. Employers interested in subscriptions, assessment credits or customization can request written terms before purchasing."
  ],
  [
    "reports-and-decisions",
    "Reports and decisions",
    "Example scores describe actions in this particular scripted exercise. They are provided for illustration. An employer remains responsible for its hiring decisions. A demonstration result does not confer a qualification, credential, job offer or entitlement to work."
  ],
  [
    "responsible-use",
    "Responsible use",
    "Use the public demo for practice and evaluation. Keep other people’s personal details out of it. Do not submit the fictional report as an actual employment or identity record, or disrupt another visitor’s access."
  ],
  [
    "questions-and-revisions",
    "Questions and revisions",
    "Use Contact and select Privacy or correction to raise a concern with the team. The team will publish reviewed terms and identify the operator before inviting real assessment participants. Review the Privacy notice for how the preview handles data."
  ]
]

export default function Page() {
  return <Policy title="Terms of use" sections={sections} crossLink="Privacy"/>
}
