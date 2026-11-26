# SkillChain POC implementation checklist

All tasks below are must-have. The POC scope and deferred work are in PLAN.md.

| Phase | Priority | Task | Acceptance criterion |
|---|---|---|---|
| P0 Environment and scaffold | Must-have | ☑ Check Node, npm, Git, loopback ports, and registry access. | Record installed tool versions and required port availability. Record the selected stable version, engines, and peer requirements from npm view for each direct dependency and plugin. Previous registry attempts returned ENOTFOUND. Resolve or record registry access before scaffold. |
| P0 | Must-have | ☑ Create the three-package workspace. | npm install creates the lockfile. A clean npm ci and workspace type-check succeed. The existing demo is untouched. |
| P0 | Must-have | ☑ Add an early browser-to-API smoke test. | Playwright opens the Vite app and asserts a live Fastify health response through the proxy. |
| P0 | Must-have | ☑ Add demo-only sign-in and epoch enforcement. | All three seeded accounts get random tokens. Invalid tokens and roles fail. Tokens from the previous epoch cannot write. |
| P1 Simulation | Must-have | ☑ Add an entry point using the pre-verified company fixture. | The Applicant can start a run without TrustChain or final recruitment. The seed is visibly labeled. |
| P1 | Must-have | ☑ Add orientation, server clock, and time allowance. | All three allowances preserve virtual deadlines while changing real duration. Refresh preserves the run clock. |
| P1 | Must-have | ☑ Add task-board actions. | Title, assignee, priority, and due edits persist and leave scenario deadlines intact. |
| P1 | Must-have | ☑ Add email and colleague permissions. | Recipient, incident link, and assignment determine scripted reactions. Changing only the body produces the same scripted result. Private context stays role-scoped. |
| P1 | Must-have | ☑ Add the L2 and L3 fixture twists. | L2 delays Developer acknowledgement. L3 gates Finance clearance on PM acknowledgement. Both use the L1 UI. |
| P1 | Must-have | ☑ Add Controller visibility and logged pause/resume. | Admin can inspect the queue and individual context. Pause freezes clock and candidate writes. Both controls emit events. |
| P2 Evidence and report | Must-have | ☑ Hash-chain the evidence. | Required fields are present. Edited, reordered, and truncated sequences fail against the frozen head and event count. |
| P2 | Must-have | ☑ Score the five competencies. | Boundary tests cover just before, exactly at, and just after a deadline. Message text remains human-review evidence. |
| P2 | Must-have | ☑ Render the report with strong and weak seed runs. | Both reports cite evidence for each result, surface strengths and gaps, and display no composite headline. |
| P3 TrustChain | Must-have | ☑ Snapshot synthetic documents and compute a salted commitment. | Reordering preserves the digest for the same salt. Changing one byte or the salt changes it. A stale expected commitment cannot be approved. |
| P3 | Must-have | ☑ Build and test the registry. | Tests cover unauthorized writes, duplicate registration, invalid transitions, terminal Revoked, versions, and emitted events. |
| P3 | Must-have | ☑ Wire HR submission and Admin verification. | Passing and failing simulated checks are labeled. Only Admin approves or changes status. The UI reports confirmed transactions. |
| P3 | Must-have | ☑ Add public Verify through the API. | The page reports network, commitment, status, transaction hash, and history. Browser requests never target Hardhat RPC. |
| P3 | Must-have | ☑ Add the tamper check. | The original fixture matches and the altered copy mismatches. Re-checking does not change the submitted snapshot or chain history. |
| P4 Recruitment | Must-have | ☑ Add vacancy difficulty, close time, and apply-once. | HR’s chosen level starts the corresponding run. A duplicate or an application at or after close fails. |
| P4 | Must-have | ☑ Centralize chain enforcement and show suspension. | A suspended company cannot publish, receive applications, start new runs, or record decisions. Applicants see the banner. Active runs can finish. Reinstatement, revocation, and RPC failure follow PLAN.md. |
| P4 | Must-have | ☑ Add HR decision and Applicant feedback. | Owning, verified HR can record a human decision for a completed report. The Applicant can read their feedback. |
| P5 Demo readiness | Must-have | ☑ Add the one-command runner and synchronized reset. | Two successive resets restore API and chain fixtures, refresh close time, and reject old tokens. |
| P5 | Must-have | ☑ Apply the ledger design and self-host fonts. | The eight screens show visible focus and status labels. Fonts load without external requests. |
| P5 | Must-have | ☑ Test and rehearse the three-minute golden path. | Three browser sessions reach every checkpoint within three minutes. Keep the automated smoke and full-flow results. |
