# Verification

The POC was verified with Node 24.19.0 and Chrome on Windows. Browser and contract tests ran with local loopback access.

| Command | Observed result |
|---|---|
| `npm ci --no-audit --no-fund --prefer-offline` | Clean lockfile install succeeded. |
| `npm run typecheck` | TypeScript checks passed. |
| `npm run build` | Vite build completed and bundled the local fonts and brand asset. |
| `npm test` | 14 tests passed across the simulation, API, and local Solidity suites. |
| `npm run test:e2e` | Two browser tests passed. The full three-session scenario took 16.4 seconds. |

The contract suite uses mined transactions to verify unauthorized and duplicate writes, invalid transitions, versions, events, terminal revocation, suspension enforcement, RPC outage, and two synchronized resets. The simulation and API suites cover permission and ownership checks, assessment windows, difficulty assignment, consent, inclusive deadlines, evidence integrity and reproducibility, retry deduplication, and stale snapshot approval.

The browser run exercised synthetic submission, separate verifier approval, both document re-checks, vacancy publication, application, orientation, refresh, workspace actions, pause and resume, report citation, human feedback, suspension, a rejected republish, and reset. The smoke test confirmed the API proxy, keyboard focus, mobile reflow at 390 px, and local font loading. Browser traffic did not connect directly to Hardhat RPC.
