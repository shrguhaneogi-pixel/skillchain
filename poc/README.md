# SkillChain local proof of concept

SkillChain lets a Platform Verifier approve a fictional organization so its hiring manager can publish a Project Coordinator assessment and review the applicant’s work. The workplace uses scripted colleagues. TrustChain issues and reads real local Solidity transactions. The external registry, accounts, and documents are synthetic.

## Run locally

From this directory, use Node 24 LTS and run:

```text
npm ci
npm run demo
```

Open [the local app](http://127.0.0.1:5173). The runner starts Hardhat on 8545, deploys the registry, verifies the seed company, starts Fastify on 4310, and starts Vite on 5173. All three listen on loopback. Stop the runner with Ctrl+C. The browser uses only Vite and its API proxy. The Solidity compiler comes from the pinned npm package, so startup needs no compiler download.

Use separate browser profiles, private windows, or Playwright contexts for the three demo roles. New browser tabs also work when opened independently. Choose Arun Rao for HR, Isha Mehta for the Platform Verifier, and Mira Sen for the Applicant.

- **Three-minute path.** Start with the seeded Verified company and vacancy. From the Verifier console, open its public record and run both document checks. Apply as Mira, accept orientation, assign recovery to the Developer, send linked client and Finance emails, record the hold, and confirm a no-cost plan. Pause and resume as Isha, then submit as Mira. As Arun, inspect a citation and record feedback. Suspend as Isha and observe the applicant banner and a rejected republish. Reset to restore the seed.
- **Fresh onboarding.** In the Verifier console choose **Reset to fresh onboarding** and sign in again. Submit the synthetic company documents as Arun. As Isha, run simulated checks and approve the displayed commitment. Then publish as Arun. Reset invalidates all existing demo sessions.

The seeded strong and weak sample reports are available in the hiring desk. The rubric keeps the five competencies from PLAN.md and assesses problem solving through the viable demo plan criterion. Evidence stays in API memory. Restarting the runner recreates local state and the seed chain. Local ledger records are for demonstration and have no external trust or identity meaning.

## Verify

Stop any running demo before browser tests. They start their own stack.

```text
npm run typecheck
npm test
npm run test:e2e
npm run build
```

Playwright uses locally installed Chrome on Windows if present. On other setups install its Chromium distribution with `npx playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to a compatible browser. The test process needs loopback access. For a simulation-only frontend/API smoke test, set `SKILLCHAIN_SMOKE_ONLY=1` and run `npm run test:e2e -- smoke.spec.ts`. `npm run dev` also starts the explicitly labeled fixture environment with chain verification disabled.

See [the architecture diagrams](docs/architecture), [dependency preflight](docs/ENVIRONMENT.md), and [verification results](docs/VERIFICATION.md).
