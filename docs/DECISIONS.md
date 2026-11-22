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
