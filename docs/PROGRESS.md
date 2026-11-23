# SkillChain build progress

## Current status

- **Published release candidate** on `design/homepage-overhaul`. Merge commit `0afa6fa` integrates `main` at `877a8c4` with the verified homepage overhaul tree. [Published branch](https://github.com/shrguhaneogi-pixel/skillchain/tree/design/homepage-overhaul)
- **Release status** remains **NOT READY**. See [current acceptance results](TEST_REPORT.md), [release preparation evidence](evidence/release-prep/README.md) and the [owner release checklist](OWNER_CHECKLIST.md).

## Phase 1 recovery · 22 November 2026 (historical)

Resumed build/skillchain-workplace-demo at 1ce288d with the simulation, product routes, npm lockfile and tests present as uncommitted files. The stash was empty. Preserved the original main README and recorded this browser-only work on the feature branch. The managed preview serves the static export. The npm typecheck, lint and all 32 fixture/component checks were rerun against the recovered implementation. See docs/evidence/resume-*.log.

Live testing exposed a hard-coded C-017 heading on personal runs. The reviewer now labels a personal run “Your practice run” and retains “Candidate C-017” on the canonical sample. Browser coverage includes both labels, a negative candidate accessibility-tree check, runtime transport and storage assertions, real skip and restart controls, and reload during active play.

## Gate 1 decision · PARTIAL (historical)

A05 passed with the 27-path matrix and both real UI paths. A06 and A07 have real interaction evidence but are blocked on the remaining browser checks. See docs/TEST_REPORT.md and docs/evidence/managed/. The export builds four Phase 1 routes. Phase 2 requires approval to proceed on partial evidence or completion of the remaining checks.

The source and QA evidence are committed locally on the existing feature branch. Automatic approval review rejected the push to github.com/shrguhaneogi-pixel/skillchain because explicit authorization for that destination and branch publication was missing. Opening a PR depends on an authorized push.

Owner decisions still needed before release include artwork rights, monitored contact mailbox and operator details, legal review of the shipped data flow, human voiceover and screen-reader journeys.

## Phase 2 · 22 November 2026 (historical)

The owner approved media capture on a partial Gate 1. Fixed the three ESLint warnings and added two server-render regression assertions for the practice and direct FairHire headings. ESLint with a zero-warning threshold and both regression checks passed.


## Gate 2 decision · PARTIAL (historical)

The candidate recording, poster, English VTT and transcript are complete. The five live bento states have review masters and compressed variants within budget. The managed browser returned JPEG only, and the DevTools PNG capture command was blocked. The PNG derivatives preserve the decoded JPEG pixels and cannot replace a true lossless capture. The candidate clip is encoded at 1920 × 1080 from a 1362 × 766 capture. A03 still needs the live public tiles and the /skillproof#mailbox destination. A04 passed in a player fixture and awaits public integration. The employer film awaits the missing Request employer demo link from the approved shot sheet.

The owner subsequently approved Phase 3 with the open capture items. Until public media acceptance, use the approved “Explore the interactive walkthrough” link to /demo/ for the candidate and /fairhire/#report for the employer when a media slot needs a fallback. See `docs/TEST_REPORT.md` for manual checks. Voiceover remains an owner action.

## GitHub owner action (historical)

The prior authorized push failed because the executor had no GitHub HTTPS credentials. The owner commands now live in [OWNER_CHECKLIST.md](OWNER_CHECKLIST.md).

## Phase 3a · Shell and simple routes (historical)

Completed the sticky marketing header, disclosure, mobile menu, footer, motion override, route focus and 404. Added pricing, contact, about and draft Terms and Privacy. Contact defaults to copy and download until a confirmed mailbox is configured.

Phase 2 revision 77f35c2 was archived and verified before implementation. Work continues on the local feature branch. GitHub publication and the draft PR are owner actions using the commands above.

A06 reproduced as a code defect with a late visibility event and a separate long scheduling gap. The original component advanced through deadlines before pausing. With the revised clock, the hidden interval preserves the last elapsed timestamp and the first deadline still accepts the run at 44.999 seconds exactly. A07 static lint guard and two mounted full runs with forbidden browser APIs throw-stubbed passed. Real browser checks remain separate. TypeScript, strict ESLint and 48 affected tests passed.

## Phase 3b · Product routes (historical)

Added SkillProof's shared fixture mailbox, keyboard-operable tool tour, role library and labelled proposed architecture. Added the closing employer request link and mobile catalogue controls. Managed Chrome verified all five approved destinations on reload, the Finance-first ordering, exact finance source, restored focus and the request link. Recorded the 40-second employer film from the working site with a real frame for the poster and synchronized captions. The local Playwright capture script is documented in the README. Native-resolution recordings and lossless PNG originals await an unrestricted browser. Seven affected component and privacy tests, TypeScript and strict ESLint passed.

## Phase 3c · Landing page (historical)

Added the ten-section landing page, scroll thresholds and static fallbacks, stateless-to-navigation reply excerpt, responsive genuine bento assets and both walkthrough players. Affected tests passed (13) with strict ESLint, TypeScript and a production build. Chrome observed both preview outcomes, released the incident sequence with Read all incidents, and played the candidate clip to 70 seconds with English captions showing. The transcript expanded in the integrated player. Native scrubber seek did not register during the managed run. The isolated Phase 2 player had previously verified seek. A04 stays PARTIAL because the released recording has no audio stream and the full download-failure path remains unverified in the final player.

The candidate poster is the recorded split inbox frame at 12.500 s, 25,908 bytes, wired to the player. The media guard checks that the static page renders no active video source before intent. The production audit found 14 HTML documents and 31 bundles with no external script tags or known tracker markers. Untouched Home network measurement still needs a browser request inspection.

## Phase 3d · Quality and delivery (historical)

TypeScript, ESLint with zero errors and warnings, 52 tests and the eleven-route production build passed. Browser evidence covers all four CSS layouts, both simulation paths, public tile reloads, the candidate player's English captions, formula examples and navigation focus. The Chrome socket denial blocked standalone Playwright. Fixed the media play label, duplicate catalogue landmark naming and an initial stylesheet-related body shift. Manual action steps are in [BROWSER_VERIFICATION.md](BROWSER_VERIFICATION.md).

## Closing pass

Component regressions passed for lifecycle pause and resume, both clipboard failure modes, the Home player’s media error and the OS and footer motion settings. The managed Chrome probe recorded visible state across the tab switch. The 320 CSS px check covered all eleven public routes with zero axe violations and no horizontal overflow. The public-claim audit restored the approved Privacy sentence and confirmed the source and export have no analytics integration. TypeScript, ESLint with zero warnings and errors, 60 tests, the build and the export audit passed.

## Gate 3 decision

### A01–A14

| ID | Status | Observed result and evidence |
|---|---|---|
| A01 Landing | PASSED | Ten sections in order at CSS widths 1440, 834 and 390. Primary CTA within the first viewport at all three sizes. Both preview choices applied the matching owner/status. [Viewport observations](evidence/phase3/a01-first-cta.json) · [Replies](evidence/phase3/3c-home.json) |
| A02 Scroll | PASSED | Forward and reverse Home hero transitions and both reply outcomes were recorded in a throttled Chrome trace with a matching waterfall. Read all incidents, the footer override and reduced motion were verified in the closing pass. [Windows release evidence](evidence/local-release/README.md) |
| A03 Bento | PASSED | All five fixture destinations survived refresh. New lossless originals were captured and checked against the manifest. They are staged for media review. [Windows release evidence](evidence/local-release/README.md) |
| A04 Video | PARTIAL | Chrome verified 35-second seek and English caption toggling through the native media APIs. Blocking the MP4 exposed the interactive fallback and transcript. The browser download still succeeded. Audible controls await narration. [Windows release evidence](evidence/local-release/README.md) |
| A05 Branches | PASSED | All 27 engine combinations passed and Chrome completed A/A/A and B/B/B. The client communication finding showed the exact submitted reply. [A run](evidence/phase3/practice-0.json) · [B run](evidence/phase3/practice-1.json) · [Fixture tests](../tests/engine.test.ts) |
| A06 Hidden-tab timing | OPEN | A real Chrome tab switch returned to the pause dialog with Rahul’s reply window already closed. The attached probe did not log a hidden event. A clean browser repeat and exact resume evidence remain open. [Windows release evidence](evidence/local-release/README.md) |
| A07 Audience and data | PARTIAL | Both fictional runs passed the local Chrome Network, URL, Local Storage, Session Storage, IndexedDB and cookie checks. Board edits, feedback, reviewer view and source detail were included. Hosted repeat remains open. [Windows release evidence](evidence/local-release/README.md) |
| A08 Navigation | PASSED | 74 internal HTTP targets and the unknown-route response passed. Keyboard disclosure, Escape, skip target, heading focus, mobile modal and browser Back were observed. [Crawl](evidence/phase3/link-crawl.txt) · [Menu and keyboard](evidence/phase3/keyboard.json) · [Route focus](evidence/phase3/route-focus.json) |
| A09 Estimator | PASSED | All required valid and invalid examples, reset, credit-only output and prefilled counts passed. [Estimator run](evidence/phase3/pricing-contact.json) · [Prefill](evidence/phase3/keyboard.json) |
| A10 Contact | PARTIAL | Chrome exercised error-summary focus, review and download. Code-level encoding passed. Component tests proved rejected and unavailable clipboard handling, actionable feedback and a working text download. Browser mailto to a confirmed mailbox remains open. [Chrome request](evidence/phase3/pricing-contact.json) · [Clipboard tests](../tests/request-builder.test.tsx) · [Draft encoding](../tests/requests.test.ts) |
| A11 Policies and credential | PARTIAL | Linked draft notices and all three labelled synthetic credential states were checked. Public-claim audit confirmed local sample records and retained Draft for legal review. Hosted request inspection and legal review remain open. [Trust states](evidence/phase3/trust-fixtures.json) · [Claim audit](DECISIONS.md#closing-pass-claim-audit) |
| A12 Accessibility | PARTIAL | Real 400% zoom in a 1280 px Chrome window had no horizontal overflow across the public routes and demo journey. Keyboard interactions and focus restoration passed at that zoom and with forced-colors emulation. Full-resolution PNGs were captured at all four layouts. NVDA with Firefox remains open. [Windows release evidence](evidence/local-release/README.md) |
| A13 Performance | FAILED | Three cold Chrome runs per route at 4× CPU slowdown, 1.6 Mbps down and 150 ms RTT. Median LCP / CLS / TBT were Home 3.79 s / 0.046 / 2879 ms, Demo 3.35 s / 0.002 / 3277 ms, FairHire 1.75 s / 0.005 / 1860 ms. The local lab exceeded the release budgets. Field INP is pending traffic. [Windows release evidence](evidence/local-release/README.md) |
| A14 Release | BLOCKED | Windows build, TypeScript, strict ESLint, export audit and 74-path crawl passed. All 60 unit and component tests passed with a 30-second timeout override. Playwright passed 9 of 10. The timing test paused after a simulated clock jump and timed out waiting to finish. Hosted checks and approval remain open. [Windows release evidence](evidence/local-release/README.md) |

## Open verification items

| Item | Status | Closes by |
|---|---|---|
| A06 hidden-tab pause | OPEN · environment limitation, code-level verified | Observe hidden, return, manual Resume and one decision in a normal browser. |
| A07 browser-level transmission and storage proof | OPEN · release-blocking | Run the owner Network, URL, Application and Cookies checks. |
| Lossless PNG originals for the five bento captures | OPEN | Run scripts/capture-media.ts locally and verify native capture framing. |
| Candidate film voiceover | OWNER ACTION | Record and re-mux per CAPTURE_MANIFEST.md, then verify audible controls. |
| Employer walkthrough | RECORDED | Finance-first and source path passed. Silent 40 s film and poster are wired to Home. |
| /skillproof#mailbox bento destination | VERIFIED | Five public tiles followed and refreshed in Chrome. |
| Candidate poster | VERIFIED | Real frame at 12.500 s, 25.3 KiB, wired to the Home player. |
| Candidate source frames 1362 × 766 | DISCLOSED | Re-record at native 1920 × 1080 with the capture script. |
| GitHub push and draft PR | OWNER ACTION | Use step 1 in OWNER_CHECKLIST.md. |
| Screen-reader journeys, artwork rights, contact mailbox/operator details, legal review | OWNER ACTION | Complete browser sign-off and owner review before release. Text masthead is the interim asset. |
| Standalone Playwright, full-resolution screenshot run and prescribed lab profile | BLOCKED | Run on a local browser with Chromium launch and DevTools access. |
| Field metrics | PENDING | Measure after traffic is available. |

## Release status

**NOT READY** for public release. Follow the release-blocking items table in [OWNER_CHECKLIST.md](OWNER_CHECKLIST.md). A06 and A07 still need a normal browser. The working tree has only local commits from this pass.
