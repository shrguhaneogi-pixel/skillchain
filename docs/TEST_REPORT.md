# SkillChain acceptance report

22 November 2026. Gate 1 is **PARTIAL** and the owner approved Phase 2. Gate 2 is **PARTIAL**. Live observations came from the managed desktop Chrome preview of the production export. Candidate and reviewer captures were repeated on application revision 1060164. The earlier timed journey and direct employer report were observed on the recovered implementation (7b29268). All three incidents use PC-FOUNDATION-01 v1.0.

| ID | Status | Evidence or outstanding work |
|---|---|---|
| A01 Landing | Blocked | Phase 3 awaits prior gates. |
| A02 Scroll | Blocked | Phase 3 awaits prior gates. |
| A03 Bento | Partial | Five genuine JPEG captures with exact-size PNG derivatives and WebP/AVIF variants passed visual review and byte checks. True lossless originals are pending. Four destinations worked on reload. The /skillproof#mailbox route returns 404 until Phase 3, and the public tile crawl remains pending. |
| A04 Video | Media QA passed, public integration pending | Candidate MP4 is 70 s, 1920 × 1080 at 30 fps, with silent AAC. Chrome test player played to the end, sought to 35 s, toggled mute, displayed English captions, opened the transcript and returned HTTP 404 for the deliberately missing download. Source frames were 1362 × 766. The employer closing link and public player are pending. |
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
| A06 automatic pause on tab hidden, then manual resume | **OPEN.** In managed Chrome, started a timed run, pressed Ctrl+Page Up, confirmed the adjacent tab was foregrounded, then returned with Ctrl+Page Down. The timer went from 45 to 37 seconds and no Resume dialog appeared. The browser did not expose its visibility lifecycle to the test. The result did not establish automatic pause. | Phase 3 sign-off |
| A07 run data in network payloads, URLs, localStorage, sessionStorage, IndexedDB and cookies | **BLOCKED** for a complete inspection. The managed browser blocked DevTools. The managed evaluation surface returned undefined for storage access. Before/after URLs for observed A/A/A and B/B/B stayed on /demo/ without query or fragment data. Network payloads, browser storage and cookies remain unverified. | Phase 3 sign-off, release-blocking |
| A07 no candidate score or grade in DOM or accessibility tree | **VERIFIED** for both live A/A/A and B/B/B candidate result views. The rendered main content and native accessibility tree contain Strengths and Areas to practise. A negative text assertion on both saved observations found no scores, grades, ranks or percentiles. Direct FairHire showed C-017 when refreshed. | Closed for these scenarios |
| Standalone Playwright and tests/e2e | **BLOCKED.** The local Chromium retry failed at socket creation. The matching browser install previously returned HTTP 403. | Managed Chrome evidence may substitute where it covers the same check |


### Manual browser checks

1. Open the production export at /demo/ in a fresh private Chrome or Firefox window. Start Timed practice, note the remaining time, switch to another tab for at least 50 seconds and return. Expect “Simulation paused” and a stable countdown until you explicitly select Resume. Record the elapsed wall time, countdown before and after, and the dialog.
2. In a browser that permits DevTools on the production origin, open Network with Preserve log, and note the Application panel entries for local storage, session storage, IndexedDB and cookies before starting. Clear the Network table once static assets have finished loading. Run each scenario through candidate feedback, reviewer view and a source link. Inspect all requests, including Fetch/XHR, beacons and WebSocket messages. Check method, URL, query, request payload and cookies. Compare all Application panel entries and the address bar after each run. Verify there were no run-derived network or storage changes. Repeat on the final hosted origin before sign-off.


## Phase 2 evidence

Files are in `docs/evidence/phase2/`. Run the isolated player QA by copying `player-qa.html` to `out/media-qa/index.html` after a build and serving the production export. It tests the media and failure path before building the public player.

- `a03-deep-links.json` records the four available intended destinations and their selected states after reload.
- `a04-player.json` records the completed playback, cue at 35 seconds, mute changes, loaded transcript and failed-download result.
- `candidate-timeline.json`, `candidate-ffprobe.json` and `media-checks.log` record actual operator actions, stream metadata, validated sizes and English cue bounds.
- The fixture suite returned 34/34. TypeScript and strict ESLint passed. See `docs/evidence/phase2-*.log`.
