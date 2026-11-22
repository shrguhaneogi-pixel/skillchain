# SkillChain build progress

## Phase 1 recovery · 22 November 2026

Resumed build/skillchain-workplace-demo at 1ce288d with the simulation, product routes, npm lockfile and tests present as uncommitted files. The stash was empty. Preserved the original main README and recorded this browser-only work on the feature branch. The managed preview serves the static export. The npm typecheck, lint and all 32 fixture/component checks were rerun against the recovered implementation. See docs/evidence/resume-*.log.

Live testing exposed a hard-coded C-017 heading on personal runs. The reviewer now labels a personal run “Your practice run” and retains “Candidate C-017” on the canonical sample. Browser coverage includes both labels, a negative candidate accessibility-tree check, runtime transport and storage assertions, real skip and restart controls, and reload during active play.

## Gate 1 decision · PARTIAL

A05 passed with the 27-path matrix and both real UI paths. A06 and A07 have real interaction evidence but are blocked on the remaining browser checks. See docs/TEST_REPORT.md and docs/evidence/managed/. The export builds four Phase 1 routes. Phase 2 requires approval to proceed on partial evidence or completion of the remaining checks.

The source and QA evidence are committed locally on the existing feature branch. Automatic approval review rejected the push to github.com/shrguhaneogi-pixel/skillchain because explicit authorization for that destination and branch publication was missing. Opening a PR depends on an authorized push.

Owner decisions still needed before release include artwork rights, monitored contact mailbox and operator details, legal review of the shipped data flow, human voiceover and screen-reader journeys.

## Phase 2 · 22 November 2026

The owner approved media capture on a partial Gate 1. Fixed the three ESLint warnings and added two server-render regression assertions for the practice and direct FairHire headings. ESLint with a zero-warning threshold and both regression checks passed.


## Open verification items

| Item | Status | Must be closed before |
|---|---|---|
| A06 automatic pause on tab hidden, then manual resume | **OPEN.** In managed Chrome, started a timed run, pressed Ctrl+Page Up, confirmed the adjacent tab was foregrounded, then returned with Ctrl+Page Down. The timer went from 45 to 37 seconds and no Resume dialog appeared. The browser did not expose its visibility lifecycle to the test. The result did not establish automatic pause. | Phase 3 sign-off |
| A07 run data in network payloads, URLs, localStorage, sessionStorage, IndexedDB and cookies | **BLOCKED** for a complete inspection. The managed browser blocked DevTools. The managed evaluation surface returned undefined for storage access. Before/after URLs for observed A/A/A and B/B/B stayed on /demo/ without query or fragment data. Network payloads, browser storage and cookies remain unverified. | Phase 3 sign-off, release-blocking |
| A07 no candidate score or grade in DOM or accessibility tree | **VERIFIED** for both live A/A/A and B/B/B candidate result views. The rendered main content and native accessibility tree contain Strengths and Areas to practise. A negative text assertion on both saved observations found no scores, grades, ranks or percentiles. Direct FairHire showed C-017 when refreshed. | Closed for these scenarios |
| Standalone Playwright and tests/e2e | **BLOCKED.** The local Chromium retry failed at socket creation. The matching browser install previously returned HTTP 403. | Managed Chrome evidence may substitute where it covers the same check |


## Gate 2 decision · PARTIAL

The candidate recording, poster, English VTT and transcript are complete. The five live bento states have review masters and compressed variants within budget. The managed browser returned JPEG only, and the DevTools PNG capture command was blocked. The PNG derivatives preserve the decoded JPEG pixels and cannot replace a true lossless capture. The candidate clip is encoded at 1920 × 1080 from a 1362 × 766 capture. A03 still needs the live public tiles and the /skillproof#mailbox destination. A04 passed in a player fixture and awaits public integration. The employer film awaits the missing Request employer demo link from the approved shot sheet.

Phase 3 awaits owner approval. Until public media acceptance, use the approved “Explore the interactive walkthrough” link to /demo/ for the candidate and /fairhire/#report for the employer when a media slot needs a fallback. See `docs/TEST_REPORT.md` for manual checks. Voiceover remains an owner action.

## GitHub owner action

The single authorized push targeted `shrguhaneogi-pixel/skillchain` and failed with `fatal: could not read Username for 'https://github.com': terminal prompts disabled`. The draft PR awaits the branch push. From the current checkout, run:

```sh
gh auth login --hostname github.com --git-protocol https --web
gh auth setup-git --hostname github.com
git push -u origin refs/heads/build/skillchain-workplace-demo:refs/heads/build/skillchain-workplace-demo
gh pr create --repo shrguhaneogi-pixel/skillchain --head build/skillchain-workplace-demo --base main --draft --title 'SkillChain workplace demo and Phase 2 media' --body-file - <<'PR'
[Acceptance report](https://github.com/shrguhaneogi-pixel/skillchain/blob/build/skillchain-workplace-demo/docs/TEST_REPORT.md) · [Progress log](https://github.com/shrguhaneogi-pixel/skillchain/blob/build/skillchain-workplace-demo/docs/PROGRESS.md)

Phase 2 includes the real candidate walkthrough and five captured fixture states.

Open items include A06 hidden-tab pause, A07 browser network and storage verification, standalone Playwright, lossless bento originals, public media integration and employer walkthrough.
PR
```

## Phase 3a · Shell and simple routes

Completed the sticky marketing header, disclosure, mobile menu, footer, motion override, route focus and 404. Added pricing, contact, about and draft Terms and Privacy. Contact defaults to copy and download until a confirmed mailbox is configured.

Phase 2 revision 77f35c2 was archived and verified before implementation. Work continues on the local feature branch. GitHub publication and the draft PR are owner actions using the commands above.

A06 reproduced as a code defect with a late visibility event and a separate long scheduling gap. The original component advanced through deadlines before pausing. With the revised clock, the hidden interval preserves the last elapsed timestamp and the first deadline still accepts the run at 44.999 seconds exactly. A07 static lint guard and two mounted full runs with forbidden browser APIs throw-stubbed passed. Real browser checks remain separate. TypeScript, strict ESLint and 48 affected tests passed.

## Phase 3b · Product routes

Added SkillProof's shared fixture mailbox, keyboard-operable tool tour, role library and labelled proposed architecture. Added the closing employer request link and mobile catalogue controls. Managed Chrome verified all five approved destinations on reload, the Finance-first ordering, exact finance source, restored focus and the request link. Recorded the 40-second employer film from the working site with a real frame for the poster and synchronized captions. The local Playwright capture script is documented in the README. Native-resolution recordings and lossless PNG originals await an unrestricted browser. Seven affected component and privacy tests, TypeScript and strict ESLint passed.

## Phase 3c · Landing page

Added the ten-section landing page, scroll thresholds and static fallbacks, stateless-to-navigation reply excerpt, responsive genuine bento assets and both walkthrough players. Affected tests passed (13) with strict ESLint, TypeScript and a production build. Chrome observed both preview outcomes, released the incident sequence with Read all incidents, and played the candidate clip to 70 seconds with English captions showing. The transcript expanded in the integrated player. Native scrubber seek did not register during the managed run. The isolated Phase 2 player had previously verified seek. A04 stays PARTIAL because the released recording has no audio stream and the full download-failure path remains unverified in the final player.

The candidate poster is the recorded split inbox frame at 12.500 s, 25,908 bytes, wired to the player. The media guard checks that the static page renders no active video source before intent. The production audit found 14 HTML documents and 31 bundles with no external script tags or known tracker markers. Untouched Home network measurement still needs a browser request inspection.
