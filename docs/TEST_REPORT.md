# SkillChain Phase 3 acceptance

Closing-pass acceptance for implementation revision `461a382` on `build/skillchain-workplace-demo`. Gate 3 is **PARTIAL / NOT READY**. Release actions are in the [Owner release checklist](OWNER_CHECKLIST.md).

## A01–A14

| ID | Status | Observed result and evidence |
|---|---|---|
| A01 Landing | PASSED | Ten sections in order at CSS widths 1440, 834 and 390. Primary CTA within the first viewport at all three sizes. Both preview choices applied the matching owner/status. [Viewport observations](evidence/phase3/a01-first-cta.json) · [Replies](evidence/phase3/3c-home.json) |
| A02 Scroll | PARTIAL | Forward/reverse, Read all incidents and the footer override worked in Chrome. Component tests verify system reduced motion and footer precedence with both messages and the closing link in static flow. The throttled interaction trace remains open. [Thresholds](evidence/phase3/hero-final.json) · [Motion tests](../tests/home-motion.test.tsx) |
| A03 Bento | PASSED | Five live-state images served from responsive WebP/AVIF. Followed all public tiles, reloaded and checked the intended fixture. Native lossless originals remain tracked under the approved partial Gate 2. [Public tile paths](evidence/phase3/a03-public-gallery.json) · [Capture manifest](CAPTURE_MANIFEST.md) |
| A04 Video | PARTIAL | Home played the 70 s silent film with English captions and transcript. The actual Home player’s media-error test exposes the interactive fallback, readable transcript and a download link to the real MP4. Native seek, audible controls and deliberately failing the browser download remain open. [Playback](evidence/phase3/3c-player.json) · [Player test](../tests/home-player.test.tsx) · [Streams](evidence/phase3/candidate-ffprobe.json) |
| A05 Branches | PASSED | All 27 engine combinations passed and Chrome completed A/A/A and B/B/B. The client communication finding showed the exact submitted reply. [A run](evidence/phase3/practice-0.json) · [B run](evidence/phase3/practice-1.json) · [Fixture tests](../tests/engine.test.ts) |
| A06 Hidden-tab timing | OPEN | OPEN (environment limitation, code-level verified). The closing managed-Chrome tab-switch probe sampled only visible states and logged no visibilitychange. Component tests pass hidden/late events, large scheduling gaps, pagehide and freeze, with manual Resume and continued timing on plain blur. [Probe](evidence/closing/a06-probe.json) · [Component tests](../tests/demo.test.tsx) · [Normal-browser checklist](OWNER_CHECKLIST.md) |
| A07 Audience and data | OPEN | Both live feedback views excluded scores and grades. Mounted storage/transport and href checks, lint and export audit passed. Public claims were checked against the implementation. The owner’s browser transmission and persistence audit remains release-blocking. [Live paths](evidence/phase3/practice-0.json) · [Claim audit](DECISIONS.md#closing-pass-claim-audit) · [Export audit](evidence/closing/export-audit.txt) |
| A08 Navigation | PASSED | 74 internal HTTP targets and the unknown-route response passed. Keyboard disclosure, Escape, skip target, heading focus, mobile modal and browser Back were observed. [Crawl](evidence/phase3/link-crawl.txt) · [Menu and keyboard](evidence/phase3/keyboard.json) · [Route focus](evidence/phase3/route-focus.json) |
| A09 Estimator | PASSED | All required valid and invalid examples, reset, credit-only output and prefilled counts passed. [Estimator run](evidence/phase3/pricing-contact.json) · [Prefill](evidence/phase3/keyboard.json) |
| A10 Contact | PARTIAL | Chrome exercised error-summary focus, review and download. Code-level encoding passed. Component tests proved rejected and unavailable clipboard handling, actionable feedback and a working text download. Browser mailto to a confirmed mailbox remains open. [Chrome request](evidence/phase3/pricing-contact.json) · [Clipboard tests](../tests/request-builder.test.tsx) · [Draft encoding](../tests/requests.test.ts) |
| A11 Policies and credential | PARTIAL | Linked draft notices and all three labelled synthetic credential states were checked. Public-claim audit confirmed local sample records and retained Draft for legal review. Hosted request inspection and legal review remain open. [Trust states](evidence/phase3/trust-fixtures.json) · [Claim audit](DECISIONS.md#closing-pass-claim-audit) |
| A12 Accessibility | PARTIAL | Reflow verified by 320 CSS px equivalent. All eleven public routes at 320×640 had no horizontal overflow and zero axe 4.14.1 violations in the closing run. Real 400% browser zoom, assistive-technology journeys, forced colours and native-resolution screenshots remain open. [320 CSS px audit](evidence/closing/a12-320-axe.json) · [Viewport screenshots](evidence/phase3/viewports/) |
| A13 Performance | PARTIAL | Three unthrottled managed Chrome baseline runs on Home, Demo and FairHire. Home recorded zero MP4 resource entries. Build gzip estimates met modern JS, initial asset, poster and video limits. Cold throttled browser runs and a hosted waterfall remain open. Field INP is pending traffic. [Baseline](evidence/phase3/lab-final.json) · [Byte estimates](evidence/phase3/transfer-budgets.txt) |
| A14 Release | BLOCKED | Production static export, TypeScript, strict ESLint and 60 tests passed in the closing run. Standalone Chromium remained blocked in Phase 3 and deployment was outside this pass. Hosted smoke tests remain open. [Closing checks](evidence/closing/verification.log) · [Browser blocker](evidence/phase3/standalone-playwright.log) · [Owner release checklist](OWNER_CHECKLIST.md) |

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

## Lab and screenshot conditions

Managed Chrome rendered all eleven public routes and the 404 at 1440×900, 834×1112, 390×844 and 320×640 CSS pixels inside a temporary same-origin frame. Evidence JPEGs use the managed browser output. Desktop and tablet images were scaled to fit its 1363×936 capture surface. They document actual responsive rendering at the stated CSS layout sizes. The named output width is the layout width.

The 390×844 lab frame recorded median LCP of 44 ms for Home, 96 ms for Demo and 52 ms for FairHire. Home's accumulated layout-shift values fell from about 0.600 to 0.006 after reserving the body margin at first paint. Demo was about 0.022 and FairHire about 0.019. The post-DOMContentLoaded long-task blocking proxy was zero in these short runs. It is not Lighthouse TBT. The runs used an unthrottled managed environment. They do not establish the specified network/CPU profile or field performance.

Console sampling showed managed browser extension errors rather than app-origin errors. The HTTP crawl checked static assets. Full standalone page-error, tracing and playback-interception runs are still blocked by the socket failure.


## Evidence inventory

All local links in the A01–A14 table and this report resolve to files or directories tracked in the checkout. The working-tree ZIP contains the same evidence. There are no ZIP-only evidence files.
