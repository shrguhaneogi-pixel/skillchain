# SkillChain ideathon POC

## Requirement traceability

| Classification | Requirement or decision |
|---|---|
| FROM DECK | PDF p2 gives one Project Coordinator a database outage, a client demo due in 20 minutes, and a budget discrepancy. P3 defines SkillProof, evidence-led review, two-sided TrustChain, and a human hiring decision. |
| FROM DECK | P5 gives the deterministic controller authority over timing, permissions, and shared state. P8 targets a workflow with three levels and four colleagues by day 30, a human-scored trial by day 60, and an employer pilot by day 90. |
| MVP SIMPLIFICATION | One role and one vacancy. Three seeded accounts, scripted colleagues, synthetic data, a simulated registry, real local chain transactions, and in-memory API state. Build simulation and reports using a labeled pre-verified fixture. Replace fixture verification with chain-backed verification before recruitment integration. |
| INFERRED | The timing, access rules, rubric, interfaces, and design detailed below. |
| NEEDS VALIDATION | The trial and pilot assess consistency, fairness, accessibility, usefulness, and cost. No trial or pilot results are assumed. |
| MVP SIMPLIFICATION | Defer practice mode, notifications, SQLite, local LLM, Passport, candidate verification, real KYC/registry APIs, payments, more roles, employer scenario building, and W3C Verifiable Credentials. |

## Stack and repo

**MVP SIMPLIFICATION.** Create an isolated npm workspace under `poc/` with `web` (React, Vite), `api` (standalone Fastify, Zod), and `chain` (Hardhat, ethers, Solidity, OpenZeppelin). Use TypeScript, API type-only imports in web, Vitest, and Playwright. The standalone API retains state across frontend reloads. Preserve the existing Next.js demo.

**INFERRED.** Node 24 LTS, React 19.3, Vite 8.4, TypeScript 6.0, Fastify 5.12, Zod 4.6, Hardhat 3.22, ethers 6.17, Solidity 0.8.39, OpenZeppelin 5.7, and Vitest 5.1. The exact registry results are in `poc/docs/ENVIRONMENT.md`. Hardhat uses chain ID 31337.

## Demo authentication

**MVP SIMPLIFICATION.** Seed Admin/Verifier Isha Mehta, HR Arun Rao, and Applicant Mira Sen. Demo-only sign-in issues random opaque tokens. The API keeps the account, role, and current `demoEpoch` for each session. The tab stores its token in `sessionStorage`. Validate token, role, ownership, and epoch on protected requests. Reset rotates the epoch and invalidates old sessions. Stale tabs must sign in again. Admin alone controls verification, suspension, reinstatement, revocation, reset, and the Controller panel. HR submits documents and recruits. The Applicant applies and completes the run.

## Simulation

**INFERRED.** Orientation introduces the scenario, tools, rubric, and timing. The Applicant chooses 1×, 1.5×, or 2× time allowance before starting. L1 runs at 15 real seconds per virtual minute at 1×. The multiplier extends wall-clock time while preserving virtual deadlines. The three incidents arrive together. Handoff is due at minute 5, the client plan at minute 20, and finance escalation and run completion at minute 25. The Applicant can submit early.

The deterministic Master Agent owns time, queued events, dependencies, permissions, shared state, and evidence. The board edits task title, assignee, priority, and due time. The composer takes recipient, linked incident, and free text. Scripted reactions use recipient, link, and task assignment. Text remains available for human review. Admin can inspect the queue and each colleague’s scoped context in the Controller panel. Pause blocks candidate writes and freezes the clock. Pause and resume each emit an event.

| Colleague | Context and permitted action |
|---|---|
| Project Manager | Recovery outlook and fallback plan. Acknowledges a linked coordination request. |
| Developer | Outage and assigned task. Acknowledges a valid handoff and posts recovery updates. |
| Client Representative | Demo deadline and linked client emails. Acknowledges receipt. |
| Finance/Ops Officer | Discrepancy and spend hold. Acknowledges escalation and clears the hold when eligible. |

**MVP SIMPLIFICATION.** L2 delays Developer acknowledgement until minute 2. L3 requires the PM’s acknowledgement before Finance can clear the spend hold. Both use the same L1 tools and rubric. Cut standalone chat, calendar, and incident-tracker screens, custom level screens, and text interpretation by agents. Keep incident links, deadlines, and timeline in the office desktop.

## Evidence and scoring

**INFERRED.** Record an event for each accepted action, clock control, and consequential system outcome. Capture ID, real timestamp, virtual time, actor, action, object, before and after values, and scenario and rubric versions. Serialize per-run changes. Hash canonical UTF-8 event data in fixed field order with SHA-256 and the preceding digest, beginning at a run-specific genesis. Freeze head digest and event count at completion. Reports verify both against the retained sequence.

A valid handoff assigns the outage-linked recovery task to the Developer and sets a due time no later than the scenario handoff deadline. It is complete when the controller records the Developer’s acknowledgement. The client plan is viable when it records either a sufficiently early recovery ETA or a fallback with the needed approvals. The disputed budget holds paid fallback until Finance clears the hold. A no-cost fallback remains available.

| Competency | Checks |
|---|---|
| Prioritization | Outage marked urgent by handoff deadline and viable client plan recorded by demo deadline. |
| Delegation | Valid Developer assignment with due time and acknowledgement by handoff deadline. |
| Communication | Client email linked to the demo by minute 20 and internal coordination email linked to outage or budget by its respective deadline. Check recipient, incident link, and send time. A reviewer reads the body for clarity and usefulness. |
| Escalation | Budget-linked email to Finance/Ops and spend hold recorded before clearance, both by finance deadline. |
| Deadline management | Recovery handoff completed and client plan confirmed by their respective deadlines. |

Use **Demonstrated**, **Partial**, or **Not demonstrated** for two, one, or zero qualifying outcomes. For communication, two qualifying emails yield **Human review required**. One yields **Partial** and zero yields **Not demonstrated**. Score outcomes within inclusive deadlines. At-deadline actions qualify before the controller records the deadline outcome. Cite evidence IDs and deadline or finalization events for missing outcomes. Seed strong and weak completed runs. Show rubric version, method, strengths, gaps, and no composite score. HR makes and records the decision.

## TrustChain and recruitment

**MVP SIMPLIFICATION.** HR submits synthetic company details and bundled documents. Snapshot exact bytes at submission, generate a random 32-byte salt, and build a canonical UTF-8 manifest with fixed key order: schema version, salt, and entries sorted by unique ASCII document IDs with SHA-256 byte digests. Hash the manifest with SHA-256. Admin runs labeled **SIMULATED** registry and authorization checks on the submitted snapshot, then approves the displayed commitment. A changed snapshot invalidates the earlier check.

| Location | Data |
|---|---|
| API memory | Company details, document bytes, salt, manifest, check result, sessions, recruitment records, and evidence. |
| Local chain | Opaque company ID, commitment, status, version, verifier address, block timestamp, and indexed change events. |

**INFERRED.** An OpenZeppelin Ownable registry accepts writes from the API-held local verifier signer. Allow Unregistered → Verified, Verified ↔ Suspended, and Verified or Suspended → Revoked. Revoked is terminal. Start at version 1 and increment per accepted transition. Wait for confirmations. Verify uses the API to read status, commitment, history, latest event transaction hash, and network. Distinguish an unknown ID from RPC failure. Keep RPC loopback-only and absent from browser configuration.

**Re-check documents** compares the on-chain commitment with the recomputed hash for the original bytes or a labeled one-byte-altered copy, using the same salt. Show Match or Mismatch. The check leaves the submitted snapshot and chain state untouched.

**INFERRED.** HR sets difficulty, competency focus, experience, application window, and assessment launch cutoff for the vacancy. Default application close is 30 minutes after reset. Apply once before close. Centralize live chain checks in `requireVerifiedOrganization()` for publishing, applications, new run starts, and hiring decisions. Fail closed on RPC errors. Suspension pauses an open vacancy and displays an applicant banner. Active runs can finish and reports and feedback remain readable. Reinstatement resumes a paused vacancy before close. Revocation closes it permanently.

## API surface

All routes below are **INFERRED**, under `/api`. Validate request payloads with Zod.

| Method | Path | Role and purpose |
|---|---|---|
| GET | /health | Public API health for smoke test |
| POST | /auth/sign-in | Public seeded-account selection |
| POST | /demo/reset | Admin restores the baseline and rotates the epoch |
| GET, POST | /company | HR reads or submits its record. Admin reads pending submissions. |
| POST | /companies/:id/check | Admin checks the submitted synthetic snapshot |
| POST | /companies/:id/status | Admin verifies with expected commitment, suspends, reinstates, or revokes |
| GET | /verify/:id | Public chain status and history |
| POST | /verify/:id/recheck | Public original or altered fixture check |
| GET, POST | /vacancy | Applicant or HR reads. HR sets difficulty and publishes. |
| GET, POST | /applications | Scoped list. Applicant applies once. |
| POST | /applications/:id/run | Applicant owner starts or resumes |
| GET | /runs/:id | Applicant owner reads the run |
| POST | /runs/:id/actions, /runs/:id/finish | Applicant owner acts or submits |
| GET | /runs/:id/controller | Admin reads queue and colleague context |
| POST | /runs/:id/clock | Admin pauses or resumes |
| GET | /applications/:id/report | Applicant owner or owning HR reads |
| POST | /applications/:id/decision | Owning HR saves decision and feedback |

## Screens and design

**INFERRED.** Use a case-file ledger so evidence and registry entries scan clearly. Flat panels, thin borders, visible focus, text status labels, and no decorative animation. Paper #F7F3EA, navy #19283D, muted ink #526074, border #D8D0C3, and vermilion #A9362A. Self-host Spectral 32/24 px, Source Sans 3 16/14 px, and IBM Plex Mono 13 px.

| Screen | Purpose |
|---|---|
| Sign-in | Choose one of three demo accounts. |
| Company onboarding | Submit fixtures as HR or manage status in the Admin console. |
| Public Verify | Inspect chain history and compare original and altered commitments. |
| HR recruitment desk | Set difficulty, publish, and open applications. |
| Applicant vacancy and feedback | Apply, see suspension, launch or resume, read feedback. |
| Orientation | Learn the office controls and choose a time allowance. |
| Office desktop | Use mailbox, board and timeline. Admin inspects the Controller panel. |
| Evidence report | Read the rubric and causes. Owning HR records the decision. |

## Database call-out and risks

**MVP SIMPLIFICATION.** API state is lost on restart. The design has no multi-user concurrency guarantee, durable off-chain audit trail, or support beyond one process. SQLite would add durable records, uniqueness, transactional evidence writes, and backups. It stays out of this build.

**INFERRED.** The one-command runner starts a fresh local chain, deploys and verifies the seeded organization, snapshots the chain, reseeds the API, and waits for readiness. Reset gates writes, restores and refreshes the snapshot, recreates relative deadlines, and advances the epoch. Failed reset keeps writes unavailable until recovery. Install and cache tooling before judging. Rehearse roles, inclusive deadlines, RPC failure, reset, and the timed path.

## Three-minute golden path

| Time | Judge checkpoint |
|---|---|
| 0:00–0:25 | Show the seeded vacancy and its chain-backed Verified organization. |
| 0:25–0:45 | Re-check the original and altered documents. Show Match and Mismatch. |
| 0:45–1:05 | Apply, enter orientation, choose an allowance, and start L1. |
| 1:05–1:45 | Assign recovery, send a client update, and escalate the budget issue. Show the Controller queue and logged pause/resume. Submit early. |
| 1:45–2:15 | HR follows a citation from the report and records feedback. Applicant reads it. |
| 2:15–2:45 | Admin suspends the company. Show chain history, applicant banner, and rejected republish. |
| 2:45–3:00 | Reset. Show a stale tab rejected and the seeded vacancy restored. |
