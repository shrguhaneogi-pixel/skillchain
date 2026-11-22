# Decisions

- At base commit 163823b main contained only README.md. It named npm, but contained no manifest, lockfile, source, lint or test configuration. This branch implements the approved no-backend slice separately from the foundation described in the original README.
- Use static export for all public routes and client-only React state for the demo. The site needs no backend. The project contact and artwork switches are build-time public settings.
- Distinguish Phase 2 capture/link/player evidence from public homepage integration. Final homepage assertions must be rerun after Phase 3.
- Record silent walkthroughs with accurate captions when human narration is unavailable.

## Phase 3 verification decisions

- A delayed hidden-tab event could move the old timer across a deadline before pausing. Timed practice reads monotonic performance.now(). A gap over 2,000 ms freezes at the last processed elapsed timestamp and requires Resume. An ordinary visibility change freezes at its observed elapsed timestamp. Resume reanchors the clock at the frozen elapsed time. The engine keeps the original deadline boundaries.
- The privacy notice says the prototype has no recruiter submission action. A browser network and storage audit is required before publication. The explicit mailto handoff applies only to the separate Contact request builder.
- Use text masthead unless NEXT_PUBLIC_USE_WORDMARK is explicitly true after artwork clearance. The mobile sheet uses the native modal dialog and makes all destinations available without hover.
