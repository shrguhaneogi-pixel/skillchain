# SkillChain

Team DEBUGGERS · Skills-first recruitment · Stage 1 foundation

Three real Supabase email/password accounts share a Next.js application. The platform admin sees the employer register. HR sees its own organization and separate representative verification state. Applicants can save or clear two optional profile links. Database policies isolate the roles, and link changes add an audit event.

## Run the local demo

Use Node.js 22.12+ (Node 24 was used for this build), npm and Docker with its engine running. Run the following from this directory. All services run locally; the demo uses no AI API, blockchain wallet or cloud account.

~~~sh
npm ci
npx supabase start
npx supabase migration up --local
npx supabase status
~~~

On a clean project, start may already have applied the migration. Copy .env.example to .env.local (PowerShell: Copy-Item .env.example .env.local). Enter the values shown by your own local instance.

| Variable | Value to supply |
| --- | --- |
| NEXT_PUBLIC_SUPABASE_URL | The local **Project URL** or **API URL**, normally http://127.0.0.1:54321. |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | The displayed **Publishable** key. Older local stacks may use the **anon** key. |
| SUPABASE_SERVICE_ROLE_KEY | The local **Secret** or legacy **service_role** key. Used only by the local seed CLI; omit from deployed Next.js environments. |
| SKILLCHAIN_DEMO_PASSWORD | Choose a demo-only password of at least 12 characters. The seed uses it for the three synthetic accounts. |
| SKILLCHAIN_SHOW_DEMO_ACCOUNTS | Set true for email shortcuts on the sign-in page. A shortcut never grants access. |

~~~sh
npm run seed:demo
npm run dev
~~~

Open **http://localhost:3000**. Sign out between roles or use separate browser profiles. The seed may be rerun on this dedicated local database. It resets the three reserved accounts' passwords to the configured value and preserves existing organization states and applicant links. Keep these synthetic addresses reserved for fixtures.

| Email | Workspace | What to check |
| --- | --- | --- |
| admin@skillchain.example | Platform Admin | Banyan Fieldworks and Delta Loom Studio appear in the register with pending review. |
| hr@skillchain.example | Authorized HR | Only Banyan Fieldworks appears. Employer and representative review are both pending. |
| applicant@skillchain.example | Applicant | Save an HTTPS portfolio link, reload, inspect the activity entry and clear the link. |

Try /workspace/admin while signed in as the applicant, then sign out and open it again. The first visit returns to the applicant workspace; the second requires sign-in. A signed-in account without an assigned membership gets an access-pending screen.

## Checks

~~~sh
npm run typecheck
npm run lint
npm test
npm run build
npx playwright install chromium --only-shell
npm run test:e2e
~~~

Vitest applies the real migration to disposable PostgreSQL-compatible PGlite databases and tests row isolation and constraints. Playwright exercises the production web app against the locally seeded Auth and database services. It starts Next.js on port 3000 if the app is not already running. An existing local Chromium binary can be selected with PLAYWRIGHT_CHROMIUM_EXECUTABLE. For an isolated run, stop the dev server before the production test. Browser tests use the synthetic applicant account, restore its original links, and leave the corresponding audit history.

For a hosted Supabase development project, apply the migration and provision Auth users, memberships and an applicant profile through trusted admin tooling. Disable public signup for this invitation-only scope. Set only the public project URL and publishable key on the web host, serve over HTTPS, and leave demo email shortcuts disabled. The local fixture script intentionally targets loopback. No remote deployment is required for this stage.

## Project map

- app/ and components/ — sign-in, server actions, responsive dashboards and shared UI.
- proxy.ts and lib/ — session rotation, trusted membership resolution, role guards, validation and domain types.
- supabase/ — local stack configuration, Stage 1 schema, grants, RLS and audit trigger.
- scripts/seed-demo.mjs — idempotent local fixture provisioning using Supabase's Auth admin API.
- tests/ — SQL policy, validation and browser coverage.
- SPEC.md — foundation criteria and eight future MVP acceptance tests.
- ARCHITECTURE.md — execution boundaries, remaining relations, proposed ABI and recovery design.
- TASKS.md — staged backlog and the exact next implementation task.

Employer registration, private document uploads, ledger attestations, job posting, simulations, scoring and HR hiring decisions are scheduled in Stages 2–4. All visible seed records are fictional. The repository contains no paid AI integration.

## Verified in this handoff

The production build, TypeScript, ESLint, 16 Vitest checks and 7 Playwright integration checks passed. The browser run used a local Chromium headless shell with real Supabase Auth, PostgREST and PostgreSQL. It covered all three roles, a valid unassigned account, failed login, sign-out, direct API access and mobile dark-mode profile editing. The seed was run twice. Docker was unavailable in the build workspace, so the services were started as local binaries; the Docker CLI bootstrap is provided for your machine.
