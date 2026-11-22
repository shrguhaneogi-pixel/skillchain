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

| Item | Status | Closes by |
|---|---|---|
| A06 hidden-tab pause | OPEN · code-level verified | Observe hidden, return, manual Resume and one decision in a normal browser. |
| A07 browser-level transmission and storage proof | OPEN · release-blocking | Run the owner Network, URL, Application and Cookies checks. |
| Lossless PNG originals for the five bento captures | OPEN | Run scripts/capture-media.ts locally and verify native capture framing. |
| Candidate film voiceover | OWNER ACTION | Record and re-mux per CAPTURE_MANIFEST.md, then verify audible controls. |
| Employer walkthrough | RECORDED | Finance-first and source path passed. Silent 40 s film and poster are wired to Home. |
| /skillproof#mailbox bento destination | VERIFIED | Five public tiles followed and refreshed in Chrome. |
| Candidate poster | VERIFIED | Real frame at 12.500 s, 25.3 KiB, wired to the Home player. |
| Candidate source frames 1362 × 766 | DISCLOSED | Re-record at native 1920 × 1080 with the capture script. |
| GitHub push and draft PR | OWNER ACTION | Use the feature-branch commands in PROGRESS.md. |
| Screen-reader journeys, artwork rights, contact mailbox/operator details, legal review | OWNER ACTION | Complete browser sign-off and owner review before release. Text masthead is the interim asset. |
| Standalone Playwright, full-resolution screenshot run and prescribed lab profile | BLOCKED | Run on a local browser with Chromium launch and DevTools access. |
| Field metrics | PENDING | Measure after traffic is available. |

## Gate 2 decision · PARTIAL

The candidate recording, poster, English VTT and transcript are complete. The five live bento states have review masters and compressed variants within budget. The managed browser returned JPEG only, and the DevTools PNG capture command was blocked. The PNG derivatives preserve the decoded JPEG pixels and cannot replace a true lossless capture. The candidate clip is encoded at 1920 × 1080 from a 1362 × 766 capture. A03 still needs the live public tiles and the /skillproof#mailbox destination. A04 passed in a player fixture and awaits public integration. The employer film awaits the missing Request employer demo link from the approved shot sheet.

The owner subsequently approved Phase 3 with the open capture items. Until public media acceptance, use the approved “Explore the interactive walkthrough” link to /demo/ for the candidate and /fairhire/#report for the employer when a media slot needs a fallback. See `docs/TEST_REPORT.md` for manual checks. Voiceover remains an owner action.

## GitHub owner action

The single authorized push targeted `shrguhaneogi-pixel/skillchain` and failed with `fatal: could not read Username for 'https://github.com': terminal prompts disabled`. The draft PR awaits the branch push. From the current checkout, run:

```sh
gh auth login --hostname github.com --git-protocol https --web
gh auth setup-git --hostname github.com
git push -u origin refs/heads/build/skillchain-workplace-demo:refs/heads/build/skillchain-workplace-demo
gh pr create --repo shrguhaneogi-pixel/skillchain --head build/skillchain-workplace-demo --base main --draft --title 'SkillChain workplace demo and Phase 2 media' --body-file - <<'PR'
[Acceptance report](https://github.com/shrguhaneogi-pixel/skillchain/blob/build/skillchain-workplace-demo/docs/TEST_REPORT.md) · [Progress log](https://github.com/shrguhaneogi-pixel/skillchain/blob/build/skillchain-workplace-demo/docs/PROGRESS.md)

The feature branch includes the eleven public routes, both real walkthroughs and Phase 3 evidence.

Open items include A06 hidden-tab pause, A07 browser network and storage verification, standalone Playwright, lossless bento originals, candidate narration and final browser/release sign-off.
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

## Phase 3d · Quality and delivery

TypeScript, ESLint with zero errors and warnings, 52 tests and the eleven-route production build passed. Browser evidence covers all four CSS layouts, both simulation paths, public tile reloads, the candidate player's English captions, formula examples and navigation focus. The Chrome socket denial blocked standalone Playwright. Fixed the media play label, duplicate catalogue landmark naming and an initial stylesheet-related body shift. Manual action steps are in [BROWSER_VERIFICATION.md](BROWSER_VERIFICATION.md).

## Gate 3 decision

## A01–A14

| ID | Status | Observed result and evidence |
|---|---|---|
| A01 Landing | PASSED | Ten sections in order at CSS widths 1440, 834 and 390. Primary CTA within the first viewport at all three sizes. Both preview choices applied the matching owner/status. [Viewport observations](evidence/phase3/a01-first-cta.json) · [Replies](evidence/phase3/3c-home.json) |
| A02 Scroll | PARTIAL | Forward step 0→2, reverse 2→0, Rahul row held within 1 px. Read all incidents released the sticky area, and the footer override persisted across route navigation with Alex visible. OS preference and throttled interaction trace remain pending. [Thresholds](evidence/phase3/hero-final.json) · [Override](evidence/phase3/reduced-and-console.json) |
| A03 Bento | PASSED | Five live-state images served from responsive WebP/AVIF. Followed all public tiles, reloaded and checked the intended fixture. Native lossless originals remain tracked under the approved partial Gate 2. [Public tile paths](evidence/phase3/a03-public-gallery.json) · [Capture manifest](CAPTURE_MANIFEST.md) |
| A04 Video | PARTIAL | Actual Home player reached 70 s, showed English captions and expanded the transcript. Both recorded posters meet the byte cap. Native seek and failed download in the final player remain unverified. Sound-control acceptance cannot be completed on a video-only recording. [Home playback](evidence/phase3/3c-player.json) · [Candidate streams](evidence/phase3/candidate-ffprobe.json) · [Employer streams](evidence/phase3/employer-ffprobe.json) |
| A05 Branches | PASSED | All 27 engine combinations passed and Chrome completed A/A/A and B/B/B. The client communication finding showed the exact submitted reply. [A run](evidence/phase3/practice-0.json) · [B run](evidence/phase3/practice-1.json) · [Fixture tests](../tests/engine.test.ts) |
| A06 Hidden-tab timing | OPEN | The old component advanced through a deadline on a late visibility event. Mounted tests passed after the fix, including fallback pause on an abnormal gap. Managed Chrome's native tab switch advanced from 45 to 9 seconds and showed no Resume. Normal-browser hidden/visible lifecycle remains a manual release check. [Original regression](evidence/phase3/a06-before.log) · [Retest](evidence/phase3/a06-return.json) · [Component cases](../tests/demo.test.tsx) |
| A07 Audience and data | OPEN | Both live feedback views excluded scores and grades. The reviewer and independent C-017 behaved as specified. The lint guard, mounted throw-stubbed sessions, href assertions and output audit passed. DevTools restrictions left browser transmission and persistence open and release-blocking. [Live paths](evidence/phase3/practice-0.json) · [Code-level tests](../tests/demo.test.tsx) · [Export audit](evidence/phase3/export-audit.txt) |
| A08 Navigation | PASSED | 74 internal HTTP targets and the unknown-route response passed. Keyboard disclosure, Escape, skip target, heading focus, mobile modal and browser Back were observed. [Crawl](evidence/phase3/link-crawl.txt) · [Menu and keyboard](evidence/phase3/keyboard.json) · [Route focus](evidence/phase3/route-focus.json) |
| A09 Estimator | PASSED | All required valid and invalid examples, reset, credit-only output and prefilled counts passed. [Estimator run](evidence/phase3/pricing-contact.json) · [Prefill](evidence/phase3/keyboard.json) |
| A10 Contact | PARTIAL | Chrome focused the error summary, reviewed special characters, confirmed the missing-recipient copy and downloaded a request. Encoding passed at code level. Clipboard failure and a live confirmed mailbox/local mail handler are outstanding. [Request run](evidence/phase3/pricing-contact.json) · [Draft encoding tests](../tests/requests.test.ts) |
| A11 Policies and credential | PARTIAL | Reviewed linked draft notices and all three labelled synthetic credential states. Browser-level request audit and owner legal review remain pending. [Trust viewer states](evidence/phase3/trust-fixtures.json) · [Policy and anchor crawl](evidence/phase3/link-crawl.txt) |
| A12 Accessibility | PARTIAL | Axe 4.14.1 found no serious or critical violations across the desktop and 390 CSS-px scans after the media label fix. Fixed a moderate duplicate catalogue landmark after the scan. All 48 route/viewport combinations reported no horizontal overflow. Keyboard evidence is recorded. Native screenshot resolution, 400% zoom and assistive-technology journeys remain open. [Desktop axe](evidence/phase3/viewports-1440.json) · [Phone axe](evidence/phase3/viewports-390.json) · [Screenshots](evidence/phase3/viewports/) |
| A13 Performance | PARTIAL | Three unthrottled managed Chrome baseline runs on Home, Demo and FairHire. Home recorded zero MP4 resource entries. Build gzip estimates met modern JS, initial asset, poster and video limits. Cold throttled browser runs and a hosted waterfall remain open. Field INP is pending traffic. [Baseline](evidence/phase3/lab-final.json) · [Byte estimates](evidence/phase3/transfer-budgets.txt) |
| A14 Release | BLOCKED | Production static export, TypeScript, strict ESLint and 52 tests passed. Standalone Chromium failed to launch and the hosted preview was outside the approved release scope. [Build log](evidence/phase3/build.log) · [Browser blocker](evidence/phase3/standalone-playwright.log) · [Browser sign-off](BROWSER_VERIFICATION.md) |

## Release status

**NOT READY** for public release. Release-blocking work is A06 real-browser hidden-tab confirmation, A07 browser transmission and storage audit, verified contact recipient and operator details, legal review, the screen-reader and 400% zoom journeys, full candidate-player sound and failure-path acceptance, the prescribed cold mobile lab and hosted smoke checks. Native lossless capture originals and native-resolution recordings remain tracked under the owner-approved partial media gate. The branch push, draft PR and Vercel deployment remain owner actions.
