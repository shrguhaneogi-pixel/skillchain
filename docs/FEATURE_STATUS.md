# SkillChain feature status

The homepage overhaul is on `design/homepage-overhaul`. Release is **NOT READY**.

## Implemented and verified

The local production export serves eleven public routes and a 404. Verified navigation, estimate calculations, public capture links, the in-browser contact review and download, and 320 CSS px reflow. The legal notices are drafts. The confirmed mailbox and operator details remain owner inputs.

## Simulated demo functionality

The Project Coordinator practice uses three scripted decisions, timed and self-paced modes, in-memory task changes and traceable evidence. Candidate feedback and the fictional reviewer view are separate. FairHire serves the fixed C-017 sample. TrustChain shows local fictional records without external lookup or registry writes.

## Media produced

Five genuine capture states with responsive WebP and AVIF files, candidate and employer silent walkthroughs, real recorded posters, English captions and transcripts. The present PNGs are JPEG derivatives. The capture script produces replacement lossless originals and native-resolution recordings for owner verification.

## Future capabilities

TrustChain identity and qualification checks and any blockchain reference are **proposed**. The Master Agent and coordinated role agents are **proposed**. Authentication, PostgreSQL persistence, employer payments and live feedback for real assessments are **proposed**.

## A01–A14

| ID | Status | Observed result and evidence |
|---|---|---|
| A01 Landing | PASSED | Chrome observed five sections in the approved order, the full primary CTA in the first viewport from 320 through 1440 px, and zero entrance overlays or video requests on untouched Home. [Viewport measurements](evidence/overhaul/browser.json) |
| A02 Incident preview | PASSED | The static incident desk replaced the retired scroll sequence. Keyboard assignment showed Rahul / In progress. Holding showed Coordinator / Waiting. Focus stayed on the selected reply, reset worked, and each result changed a single polite status region. Both motion settings were checked. [Reply results](evidence/overhaul/browser.json) · [Four widths](evidence/overhaul/playwright-final.log) |
| A03 Captures | PASSED | All five genuine capture links retained visible title names in server HTML and in the hydrated accessibility tree. Each destination loaded and showed its fixture after reload. [Names and destination results](evidence/overhaul/browser.json) |
| A04 Video | PARTIAL | The three silent recordings started through intentional activation and exposed native controls, English captions and transcripts. Chrome verified candidate seek, blocked-video fallback and downloadable MP4 markup. The earlier narration owner action remains open. [Player results](evidence/overhaul/browser.json) · [Seek and fallback](evidence/overhaul/playwright-final.log) |
| A05 Branches | PASSED | All 27 engine combinations passed and Chrome completed A/A/A and B/B/B. The client communication finding showed the exact submitted reply. [A run](evidence/phase3/practice-0.json) · [B run](evidence/phase3/practice-1.json) · [Fixture tests](../tests/engine.test.ts) |
| A06 Hidden-tab timing | OPEN | A real Chrome tab switch returned to the pause dialog with Rahul’s reply window already closed. The attached probe did not log a hidden event. A clean browser repeat and exact resume evidence remain open. [Windows release evidence](evidence/local-release/README.md) |
| A07 Audience and data | PARTIAL | Both fictional runs passed the local Chrome Network, URL, Local Storage, Session Storage, IndexedDB and cookie checks. Board edits, feedback, reviewer view and source detail were included. Hosted repeat remains open. [Windows release evidence](evidence/local-release/README.md) |
| A08 Navigation | PASSED | Chrome exercised desktop disclosure, Escape, current-page state, route heading focus, browser Back, skip focus and the mobile dialog by keyboard. All 13 legacy Home IDs resolved, and the 77-path crawl and labelled 404 passed. [Navigation results](evidence/overhaul/browser.json) · [Crawl](evidence/overhaul/crawl.log) |
| A09 Estimator | PASSED | Pricing displayed all valid and invalid cases, including empty, decimal, candidate limit and invalid run limits. Reset restored 30 × 1 and the Contact handoff displayed the matching prefilled counts. [Estimator results](evidence/overhaul/browser.json) |
| A10 Contact | PARTIAL | Chrome exercised error-summary focus, review and download. Code-level encoding passed. Component tests proved rejected and unavailable clipboard handling, actionable feedback and a working text download. Browser mailto to a confirmed mailbox remains open. [Chrome request](evidence/phase3/pricing-contact.json) · [Clipboard tests](../tests/request-builder.test.tsx) · [Draft encoding](../tests/requests.test.ts) |
| A11 Policies and credential | PARTIAL | Linked draft notices and all three labelled synthetic credential states were checked. Public-claim audit confirmed local sample records and retained Draft for legal review. Hosted request inspection and legal review remain open. [Trust states](evidence/phase3/trust-fixtures.json) · [Claim audit](DECISIONS.md#closing-pass-claim-audit) |
| A12 Accessibility | PARTIAL | Axe reported zero violations on Home at 1440 and 390 px for both server HTML and the hydrated DOM. Chrome checked reflow to 320 px and both replies by keyboard at four widths. The prior zoom and forced-colors evidence remains recorded. NVDA speech and Firefox owner verification remain open. [Home audit](evidence/overhaul/browser.json) · [Earlier zoom evidence](evidence/local-release/README.md) |
| A13 Performance | PARTIAL | Chrome measured Home within the 350 KiB critical transfer, 150 KiB route JavaScript and 90 KiB poster budgets on the gzip-enabled local export. The earlier throttled lab failure stays open for retest. Hosted and field performance remain open. [Transfer data](evidence/overhaul/transfer.json) · [Earlier lab result](evidence/local-release/README.md) |
| A14 Release | BLOCKED | The production export, strict ESLint and TypeScript passed. All 59 unit and component tests passed with a timeout override. Local browser evidence and archives are ready for handoff. A06, A07 and owner approval still block release. [Build and browser evidence](evidence/overhaul/README.md) · [Owner checklist](OWNER_CHECKLIST.md) |

## Homepage overhaul acceptance

| ID | Status | Observed result and evidence |
|---|---|---|
| O1 | PASSED | Chrome measured the complete hero CTA in the first viewport at 1440, 834 and 390 px. Untouched Home had zero entrance overlays, video elements or MP4 requests. [Viewport and request results](evidence/overhaul/browser.json) |
| O2 | PARTIAL | Both replies updated Owner and Status, showed “Updated” and preserved keyboard focus. Reset restored the initial task. Each reply changed one polite live region. OS reduced motion and the footer override suppressed the 300 ms highlight. Spoken announcements remain open for the owner’s screen reader run. [Task results](evidence/overhaul/browser.json) · [Four-width keyboard checks](evidence/overhaul/playwright-final.log) |
| O3 | PASSED | Five sections appeared in order. The app, component and test search returned no old CTA labels. The two contextual labels requested in the brief are “Start the full simulation” and “View evidence”. [Section order](evidence/overhaul/browser.json) · [Copy ledger](DECISIONS.md#copy-ledger) |
| O4 | PASSED | The same five genuine captures retained their five destinations. Chrome reloaded each and found its fixture. Axe and the accessibility tree verified the title names before and after hydration. [Audit and reload results](evidence/overhaul/browser.json) |
| O5 | PASSED | Play and View evidence were the only targets. The native pointer remained available. Chrome verified the exclusions for selectable evidence text, both reduced-motion settings, touch, forms and the demo route. The hover trace recorded zero layout shifts or long tasks. [Cursor results](evidence/overhaul/browser.json) · [Play screenshot](evidence/overhaul/cursor-play-1440x900.jpg) |
| O6 | PASSED | The crawl passed 77 HTTP paths, fragments, query paths and the 404. All 13 Home IDs were verified in Chrome. Nine estimator input pairs, Reset, Contact prefill and the relocated Privacy accordion passed. [Crawl](evidence/overhaul/crawl.log) · [Browser results](evidence/overhaul/browser.json) |
| O7 | PASSED | Axe found zero violations at desktop and 390 px. Home had zero horizontal overflow at 320 px. White on navy was 15.57:1, white on the crimson choice 6.32:1 and the cursor label 15.57:1. [Axe and reflow](evidence/overhaul/browser.json) · [Contrast](evidence/overhaul/transfer.json) |
| O8 | PARTIAL | A01, A02, A03, A08 and A09 were rerun. A04 has local player coverage. A12 retains open NVDA and Firefox checks. Home passed the three local transfer budgets for A13. Broader performance and owner release checks remain open. [Evidence and manual checks](evidence/overhaul/README.md) |
| O9 | PASSED | TypeScript and production build passed. Strict ESLint returned zero errors and warnings. The full unit suite passed 59 of 59 with a 120-second test timeout override for the baseline privacy test timeout. [TypeScript](evidence/overhaul/typecheck.log) · [ESLint](evidence/overhaul/lint.log) · [Vitest](evidence/overhaul/unit.log) · [Build](evidence/overhaul/build.log) |
| O10 | PASSED | All four before and after screenshot pairs have the requested viewport dimensions. The before export included the entrance from the initial checkout. [Screenshot pairs](evidence/overhaul/README.md) |

**Release status: NOT READY.** See the [owner checklist and release blockers](OWNER_CHECKLIST.md).
