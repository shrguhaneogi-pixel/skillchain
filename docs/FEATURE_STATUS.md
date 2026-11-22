# SkillChain feature status

## Implemented and verified

The local production export serves eleven public routes and a 404. Verified navigation, estimate calculations, public bento links, the in-browser contact review and download, and 320 CSS px reflow. The legal notices are drafts. The confirmed mailbox and operator details remain owner inputs.

## Simulated demo functionality

The Project Coordinator practice uses three scripted decisions, timed and self-paced modes, in-memory task changes and traceable evidence. Candidate feedback and the fictional reviewer view are separate. FairHire serves the fixed C-017 sample. TrustChain shows local fictional records without external lookup or registry writes.

## Media produced

Five genuine capture states with responsive WebP and AVIF files, candidate and employer silent walkthroughs, real recorded posters, English captions and transcripts. The present PNGs are JPEG derivatives. The capture script produces replacement lossless originals and native-resolution recordings for owner verification.

## Future capabilities

TrustChain identity and qualification checks and any blockchain reference are **proposed**. The Master Agent and coordinated role agents are **proposed**. Authentication, PostgreSQL persistence, employer payments and live feedback for real assessments are **proposed**.

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

**Release status: NOT READY.** See the [owner checklist and release blockers](OWNER_CHECKLIST.md).
