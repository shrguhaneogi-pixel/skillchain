# SkillChain Phase 3 acceptance

Closing-pass acceptance for implementation revision `461a382` on `build/skillchain-workplace-demo`, with local Windows release checks of `d92f594` on 22 November 2026. Gate 3 is **PARTIAL / NOT READY**. [Windows release evidence](evidence/local-release/README.md) · [Owner release checklist](OWNER_CHECKLIST.md)

## A01–A14

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
| A06 hidden-tab pause | OPEN · one observed missed deadline, clean repeat pending | Observe hidden, return, manual Resume and one decision in a normal browser. |
| A07 browser-level transmission and storage proof | LOCAL PASS · hosted repeat pending | Repeat Network, URL, Application and Cookies checks on the deployed origin. |
| Lossless PNG originals for the five bento captures | STAGED | Approve the native captures and prepare the matching published assets. |
| Candidate film voiceover | OWNER ACTION | Record and re-mux per CAPTURE_MANIFEST.md, then verify audible controls. |
| Employer walkthrough | RECORDED | Finance-first and source path passed. Silent 40 s film and poster are wired to Home. |
| /skillproof#mailbox bento destination | VERIFIED | Five public tiles followed and refreshed in Chrome. |
| Candidate poster | VERIFIED | Real frame at 12.500 s, 25.3 KiB, wired to the Home player. |
| Candidate native recording | STAGED | Match the narration, cues and transcript, then verify the final media and poster. |
| GitHub push and draft PR | HELD | Publish after resolving the Vercel preview approval boundary. |
| Screen-reader journeys, artwork rights, contact mailbox/operator details, legal review | OWNER ACTION | Complete browser sign-off and owner review before release. Text masthead is the interim asset. |
| Playwright timing test | FAILED LOCALLY | Review the test’s synthetic time jump and verify the ordinary timed path. |
| Field metrics | PENDING | Measure after traffic is available. |

## Lab and screenshot conditions

Managed Chrome rendered all eleven public routes and the 404 at 1440×900, 834×1112, 390×844 and 320×640 CSS pixels inside a temporary same-origin frame. Evidence JPEGs use the managed browser output. Desktop and tablet images were scaled to fit its 1363×936 capture surface. They document actual responsive rendering at the stated CSS layout sizes. The named output width is the layout width.

The 390×844 lab frame recorded median LCP of 44 ms for Home, 96 ms for Demo and 52 ms for FairHire. Home's accumulated layout-shift values fell from about 0.600 to 0.006 after reserving the body margin at first paint. Demo was about 0.022 and FairHire about 0.019. The post-DOMContentLoaded long-task blocking proxy was zero in these short runs. It is not Lighthouse TBT. The runs used an unthrottled managed environment. They do not establish the specified network/CPU profile or field performance.

Console sampling showed managed browser extension errors rather than app-origin errors. The HTTP crawl checked static assets. Full standalone page-error, tracing and playback-interception runs are still blocked by the socket failure.


## Evidence inventory

The A01–A14 table links to evidence tracked in the checkout. Large Windows browser artifacts and the staged media are available in the local `test-results/` directory. [Windows evidence inventory](evidence/local-release/README.md)
