# SkillChain acceptance report

22 November 2026. Gate 1 is **PARTIAL**. Live observations came from the managed desktop Chrome preview of the production export. Candidate and reviewer captures were repeated on application revision 1060164. The earlier timed journey and direct employer report were observed on the recovered implementation (7b29268). All three incidents use PC-FOUNDATION-01 v1.0.

| ID | Status | Evidence or outstanding work |
|---|---|---|
| A01 Landing | Blocked | Phase 3 awaits prior gates. |
| A02 Scroll | Blocked | Phase 3 awaits prior gates. |
| A03 Bento | Blocked | Phase 2 awaits Gate 1. |
| A04 Video | Blocked | Phase 2 awaits Gate 1. |
| A05 Branches | Pass | resume-unit.log lists 27 decision combinations. managed/reviewer-A and reviewer-B (.txt and .jpg) show the two real UI runs, exact client message, selected reply, consequence, task and resulting scores. |
| A06 Timing | Blocked on complete evidence | Unit checks passed at 44.999/45, 84.999/85 and 124.999/125 seconds. In Chrome, paused and resumed the desk, changed Rahul’s task to Alex, saw the original owner retained, let D2/D3 expire, restarted and reloaded to a fresh briefing. See managed/paused-after-edit and timed-expiry. Opening a second managed tab did not trigger an observable pause. A genuine hidden-document transition and a passing Playwright timing trace remain outstanding. |
| A07 Audience boundary | Blocked on complete evidence | managed/candidate-A, candidate-B, reviewer-A, reviewer-B and fairhire-direct show separate candidate/reviewer output and the independent employer fixture. Unit renderer check passed. No passing transport/storage inspection from standalone Playwright. |
| A08 Navigation | Blocked | Four Phase 1 routes built. Full public route crawl pending. |
| A09 Pricing | Blocked | Phase 3. |
| A10 Contact | Blocked | Phase 3. |
| A11 Legal and trust | Blocked | Credential viewer implemented. Draft policies and full network audit pending. |
| A12 Accessibility | Blocked | Candidate trees inspected. Cross-route automated, responsive, keyboard and human screen-reader checks pending. |
| A13 Performance | Blocked | Production lab and field metrics pending. |
| A14 Release | Blocked | Production export and typecheck succeeded. Full browser suite, media, public routes and deployment smoke tests pending. |

Paths above are relative to docs/evidence/. The Chrome screenshots are actual browser captures. The text files are snapshots of the rendered accessibility structure. System time and per-test timings can differ between the managed browser and terminal.

## Checks and local browser limitations

- npm run typecheck succeeded. npm run lint returned zero errors and three warnings (internal navigation, two config exports). npm test passed 32/32. Production build produced the four requested Phase 1 routes. Exact output is in resume-typecheck.log, resume-lint.log, resume-unit.log and resume-build.log.
- The system Chromium Playwright invocation included --no-sandbox, --disable-dev-shm-usage and --remote-debugging-pipe. It stopped before opening a page with “socket() failed: Operation not permitted (1)”. See resume-system-chromium.log. The earlier standalone attempt is preserved in gate1-browser.log.
- Installing Playwright’s matching Chromium headless shell failed with HTTP 403. Firefox and WebKit launch checks found no installed browser. See resume-browser-install.log and resume-other-engines.log. Failed browser launches are excluded from UI acceptance evidence.
- The preview supports real UI actions and screenshots. This run obtained no browser request trace proving the absence of transmitted run data. The pending assertions live in tests/e2e/gate1.spec.ts.
## Open verification items

| Item | Status | Must be closed before |
|---|---|---|
| A06 automatic pause on tab hidden, then manual resume | OPEN | Phase 3 sign-off |
| A07 run data in network payloads, URLs, localStorage, sessionStorage, IndexedDB and cookies | OPEN | Phase 3 sign-off, release-blocking |
| A07 no candidate score or grade in the DOM or accessibility tree | A/A/A and B/B/B observed through the managed Chrome tree during Gate 1. Standalone assertions were authored and remain unrun. | Phase 3 sign-off |
| Standalone Playwright and tests/e2e | BLOCKED in Gate 1 by the socket denial and matching browser download HTTP 403 | Managed Chrome evidence may substitute |
