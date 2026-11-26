# SkillChain POC

- Build the local judging POC in `poc/` with npm workspaces `web`, `api`, and `chain`. Preserve the existing Next.js demo.
- Follow PLAN.md and TASKS.md. Build simulation and evidence first, then TrustChain, then recruitment integration.
- Use synthetic fixtures, three seeded demo accounts, scripted colleagues, and a labeled simulated registry. Use real transactions on local Hardhat.
- Keep authorization, simulation state, and evidence on the API. The browser reads TrustChain through the API. Keep Hardhat RPC on loopback.
- Use type-only imports from API to web. Self-host fonts. Use no database, paid service, real identity integration, or production secrets.
- Start with the environment check. Verify direct dependencies and plugins with `npm view`. Use `npm install` to create the lockfile, then use `npm ci`.
- From `poc/`, run `npm run typecheck`, `npm test`, and `npm run test:e2e` once those commands exist. Use `npm run demo` for the completed local stack.
- Report observed results. Label fixtures, simulated checks, and real transactions accurately.
