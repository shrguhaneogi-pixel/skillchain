# SkillChain Phase 3 acceptance

22 November 2026. This report covers the local production export and the final feature branch. Phase 3 implementation is complete. Release sign-off remains open.

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

## Lab and screenshot conditions

Managed Chrome rendered all eleven public routes and the 404 at 1440×900, 834×1112, 390×844 and 320×640 CSS pixels inside a temporary same-origin frame. Evidence JPEGs use the managed browser output. Desktop and tablet images were scaled to fit its 1363×936 capture surface. They document actual responsive rendering at the stated CSS layout sizes. The named output width is the layout width.

The 390×844 lab frame recorded median LCP of 44 ms for Home, 96 ms for Demo and 52 ms for FairHire. Home's accumulated layout-shift values fell from about 0.600 to 0.006 after reserving the body margin at first paint. Demo was about 0.022 and FairHire about 0.019. The post-DOMContentLoaded long-task blocking proxy was zero in these short runs. It is not Lighthouse TBT. The runs used an unthrottled managed environment. They do not establish the specified network/CPU profile or field performance.

Console sampling showed managed browser extension errors rather than app-origin errors. The HTTP crawl checked static assets. Full standalone page-error, tracing and playback-interception runs are still blocked by the socket failure.
