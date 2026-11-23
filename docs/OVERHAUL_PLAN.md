# Homepage overhaul plan

| Pass | Scope | Files |
| --- | --- | --- |
| 1 | Five sections, click-to-play concept film, one scripted reply, moved consent, legacy anchors and shared CTA labels | `app/page.tsx`, `components/HomeInteractive.tsx`, `components/Walkthrough.tsx`, `app/privacy/page.tsx`, `components/Policy.tsx`, `app/pricing/page.tsx`, `components/MarketingShell.tsx`, public CTA call sites, media captions and transcript, affected tests |
| 2 | Responsive workspace, ruled evidence, static named captures, shared control and navigation styles | `app/globals.css`, `app/home.css`, `app/page.tsx`, `components/MarketingShell.tsx`, affected browser tests |
| 3 | Scoped cursor, browser verification, evidence and handoff | `components/HomeCursor.tsx`, `app/home.css`, browser tests, `docs/evidence/overhaul/`, acceptance tables and release artifacts |

Base is `156e4a6`, matching the local and remote-tracking feature refs. Direct GitHub ref lookup failed DNS. GitHub Compare confirmed the current remote feature head is identical to `156e4a6` with zero commits ahead or behind. The supplied checkout opened on `main`, where the parchment entrance and newer Linked Orb commits appear after the feature branch. The selected feature base has a static masthead shield, a scroll-scrubbed film, the shared Linked Orb, an embedded incident scene followed by a separate reply preview, and an estimator on both Home and Pricing.

Homepage anchors are retained at their nearest surviving sections. `#funding` and `#estimator` on Home lead to the estimator on Pricing. `#privacy-overview` on Home leads to the relocated disclosures on Privacy.

## Backlog

- FairHire evidence-first layout
- TrustChain credential-as-record layout
- Simulation selector badges
- Demo onboarding merge
- Contact examples
- Phone inbox list-to-detail layout
