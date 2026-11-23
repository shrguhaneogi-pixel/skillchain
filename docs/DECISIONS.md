# Decisions

- At base commit 163823b main contained only README.md. It named npm, but contained no manifest, lockfile, source, lint or test configuration. This branch implements the approved no-backend slice separately from the foundation described in the original README.
- Use static export for all public routes and client-only React state for the demo. The site needs no backend. The project contact and artwork switches are build-time public settings.
- Distinguish Phase 2 capture/link/player evidence from public homepage integration. Final homepage assertions must be rerun after Phase 3.
- Record silent walkthroughs with accurate captions when human narration is unavailable.

## Phase 3 verification decisions

- A delayed hidden-tab event could move the old timer across a deadline before pausing. Timed practice reads monotonic performance.now(). A gap over 2,000 ms freezes at the last processed elapsed timestamp and requires Resume. An ordinary visibility change freezes at its observed elapsed timestamp. Resume reanchors the clock at the frozen elapsed time. The engine keeps the original deadline boundaries.
- The privacy notice says the prototype has no recruiter submission action. A browser network and storage audit is required before publication. The explicit mailto handoff applies only to the separate Contact request builder.
- Use text masthead unless NEXT_PUBLIC_USE_WORDMARK is explicitly true after artwork clearance. The mobile sheet uses the native modal dialog and makes all destinations available without hover.

## Closing pass claim audit

| Surface | Code-level basis |
|---|---|
| Home section 09 | The practice controller keeps replies and task changes in React state and refs. Exit clears the run and reload starts a fresh briefing. The reviewer lens is labelled fictional. The text describes qualification checks and employer review as proposed. |
| Privacy | The engine records preset replies, scenario time, changes and evidence in memory. FairHire renders an independent fixture. The notice distinguishes ordinary host requests and the optional mail handoff and retains its Draft for legal review label. |
| Terms | The public exercise requires no account, charges or job publishing. Example findings are illustrative and the employer decision is outside the demo. The terms retain the Draft for legal review label. |
| Demo briefing | Acknowledgement gates the fictional exercise. The practice interface has no report submission or run persistence. The existing transport, storage and URL assertions cover both full reply paths at component level. |
| Contact | React holds draft fields. Copy writes the reviewed draft to the clipboard, download creates a local Blob, and only an explicit mailto click transfers the reviewed fields to the visitor’s email app if a recipient is set. The site has no dispatch handler or sent state. |
| TrustChain | The viewer selects among three local records. Its reference fields say Network: none and Registry write: none. It performs no external lookup. Mutual verification, qualifications and any blockchain record are proposed. The lint guard now also covers the product components. |

Changed one public sentence in Privacy, “The demo has no recruiter submission action.” The approved wording from 04-pages is restored, “Your run is not sent to a recruiter.” The browser-level transport and storage audit stays open. The repository has no Vercel Analytics or Speed Insights integration or hosting setting that enables one. Keep both products off in the Vercel project. Operator, legal and deployed-settings checks belong to release sign-off.

## Homepage overhaul

- The five-section order and the copy ledger here replace the ten-section order and verbatim-copy requirement for `05-home.md`. The scripted desk replaces the pinned incident region, its scroll thresholds and “Read all incidents”. The static masthead shield carries the brand without an entrance.
- The earlier cursor deferral is reversed for Home’s concept poster and evidence example only. The shared Linked Orb and native-pointer suppression are removed.
- Pricing retains the existing estimator as the sole implementation. Privacy receives the detailed consent accordion with the claim-audited wording preserved exactly. The old Home hashes link to the new locations.
- CTA standard applies to all equivalent links. “Start the full simulation” and “View evidence” are the explicit context-specific controls named in the overhaul brief.

### Copy ledger

| Surface | New or changed wording |
| --- | --- |
| Simulation CTAs | “Try the simulation” replaces “Try the demo”, “Try SkillProof Demo”, “Experience a simulation”, “Interactive demo”, “Try the decision”, “Walk through a work sample”, “Enter the coordinator demo”, “Start this simulation”, “Try the playable coordinator demo” and the simulation fallback instance of “Explore the interactive walkthrough”. |
| Employer CTAs | “Request an employer demo” replaces “Request a demo” and “Request employer demo”. The masthead now opens Contact with the employer demo topic set. |
| Report CTAs | “View a sample report” replaces “Read a sample report”, “Inspect the sample report”, “Behind a finding” and the reviewer fallback instance of “Explore the interactive walkthrough”. It replaces the hero’s “Explore the Platform” action with the direct report destination. |
| Hero | “Up to 2:05 for timed decisions · No sign-up”, “Watch the concept film” and “Play”. Automated A/A/A from Start to candidate feedback took 1.12 s in self-paced and 25.63 s in timed mode on the supplied pre-change export. The timed engine’s final deadline is at 125 s of active practice. |
| Concept film accessibility | Added a descriptive [transcript](../public/media/scroll-hero-transcript.txt) and [English captions](../public/media/scroll-hero.en.vtt) for the existing silent recording. |
| Incident desk | “Scripted preview · Fictional demo data”; “Project Coordinator / Simulation 01” reuses the original metadata in sentence case. “Task board”, “Owner”, “Status” and “Updated” label the shared task. “Updated · {owner} / {status}.” leads the same existing outcome text. |
| Evidence | “From decision to evidence.”, “Make a decision”, “See what changes”, “Review the evidence”, “Read the incident and choose the next action.”, “Source message”, “Selected reply”, “Observed consequence”, “View evidence”, “FairHire · Fictional demo data” and “Proposed TrustChain · Fictional example”. The C-017 values come from existing fixtures. |
| Audience and footer CTA | “Choose your path.” replaces “What would you like to see?”. “Employers” replaces “Recruiters”. Existing audience descriptions are trimmed at sentence boundaries. “Demo data is fictional, and candidates are never charged to apply or complete employer-requested assessments.” links to the moved disclosures and estimator. |

The before screenshots capture the supplied existing export, which included the entrance from the checkout’s newer starting revision. The feature head was used for the code baseline and new branch.

The concept film uses a 47,620-byte WebP from its 13.5-second closing frame. The gallery names come from the visible title links. Each card caption and the fictional-data label are linked as descriptions.
