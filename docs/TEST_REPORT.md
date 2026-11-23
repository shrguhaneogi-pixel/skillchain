# SkillChain acceptance

Homepage overhaul acceptance for `design/homepage-overhaul`, based on the verified `156e4a6` feature revision. Release is **NOT READY**. Untouched acceptance items retain their earlier evidence. [Current browser evidence](evidence/overhaul/README.md) · [Owner release checklist](OWNER_CHECKLIST.md)

## A01–A14

| ID | Status | Observed result and evidence |
|---|---|---|
| A01 Landing | PASSED | Chrome observed five sections in the approved order, the full primary CTA in the first viewport from 320 through 1440 px, and zero entrance overlays or video requests on untouched Home. [Viewport measurements](evidence/overhaul/browser.json) |
| A02 Incident preview | PASSED | The static incident desk replaced the retired scroll sequence. Keyboard assignment showed Rahul / In progress. Holding showed Coordinator / Waiting. Focus stayed on the selected reply, reset worked, and each result changed a single polite status region. Both motion settings were checked. [Reply results](evidence/overhaul/browser.json) · [Four widths](evidence/overhaul/playwright-final.log) |
| A03 Captures | PASSED | All five genuine capture links retained visible title names in server HTML and in the hydrated accessibility tree. Each destination loaded and showed its fixture after reload. [Names and destination results](evidence/overhaul/browser.json) |
| A04 Video | PARTIAL | Chrome exercised the silent candidate recording, both caption states, midpoint seek, deliberate playback failure, retained transcript and completed download. The concept and employer players have local intent-only playback evidence. Owner-approved narration and audible controls remain open. [Current checks](evidence/release-prep/checks.json) · [Player evidence](evidence/overhaul/browser.json) |
| A05 Branches | PASSED | All 27 engine combinations passed and Chrome completed A/A/A and B/B/B. The client communication finding showed the exact submitted reply. [A run](evidence/phase3/practice-0.json) · [B run](evidence/phase3/practice-1.json) · [Fixture tests](../tests/engine.test.ts) |
| A06 Hidden-tab timing | OPEN | Two Chrome attempts showed no hidden visibility state, even with automation focus emulation disabled. The local timer regression passed. A native foreground tab switch and manual resume still need observation. [Visibility probes](evidence/release-prep/hidden-tab.json) |
| A07 Audience and data | PARTIAL | Both full practice paths and board edits received only three first-party image GETs each. URL, Local Storage, Session Storage, IndexedDB and cookies stayed unchanged. Hosted repeat against the approved candidate remains open. [Local data audit](evidence/release-prep/browser-data.json) |
| A08 Navigation | PASSED | Chrome exercised desktop disclosure, Escape, current-page state, route heading focus, browser Back, skip focus and the mobile dialog by keyboard. All 13 legacy Home IDs resolved, and the 77-path crawl and labelled 404 passed. [Navigation results](evidence/overhaul/browser.json) · [Crawl](evidence/overhaul/crawl.log) |
| A09 Estimator | PASSED | Pricing displayed all valid and invalid cases, including empty, decimal, candidate limit and invalid run limits. Reset restored 30 × 1 and the Contact handoff displayed the matching prefilled counts. [Estimator results](evidence/overhaul/browser.json) |
| A10 Contact | PARTIAL | Chrome exercised error-summary focus, review and download. Code-level encoding passed. Component tests proved rejected and unavailable clipboard handling, actionable feedback and a working text download. Browser mailto to a confirmed mailbox remains open. [Chrome request](evidence/phase3/pricing-contact.json) · [Clipboard tests](../tests/request-builder.test.tsx) · [Draft encoding](../tests/requests.test.ts) |
| A11 Policies and credential | PARTIAL | Linked draft notices and all three labelled synthetic credential states were checked. Public-claim audit confirmed local sample records and retained Draft for legal review. Hosted request inspection and legal review remain open. [Trust states](evidence/phase3/trust-fixtures.json) · [Claim audit](DECISIONS.md#closing-pass-claim-audit) |
| A12 Accessibility | PARTIAL | Axe reported zero violations on Home at 1440 and 390 px for both server HTML and the hydrated DOM. Chrome checked reflow to 320 px and both replies by keyboard at four widths. The prior zoom and forced-colors evidence remains recorded. NVDA speech and Firefox owner verification remain open. [Home audit](evidence/overhaul/browser.json) · [Earlier zoom evidence](evidence/local-release/README.md) |
| A13 Performance | FAILED | Home’s median CLS improved from 0.130 to 0.002. Median TBT was 1,079 ms on Home, 547 ms on Demo and 688 ms on FairHire against the 200 ms budget. Home’s three local transfer budgets passed. Hosted performance, field INP and the interaction trace remain open. [Performance evidence](evidence/release-prep/README.md#performance) |
| A14 Release | BLOCKED | The release candidate is published on the feature branch. A06, hosted A07, performance, assistive technology, media, contact, legal and owner approval stay open. [Current evidence and handoff](evidence/release-prep/README.md) · [Owner checklist](OWNER_CHECKLIST.md) |

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
| O8 | PARTIAL | The homepage checks and local transfer budgets passed. The broader cold mobile performance retest exceeded its TBT budget. Hosted verification, NVDA with Firefox and the owner release gates remain open. [Homepage evidence](evidence/overhaul/README.md) · [Release retest](evidence/release-prep/README.md#performance) |
| O9 | PASSED | TypeScript, strict ESLint and the production build passed. Vitest passed 59 of 59 with the 120-second timeout override and the full Playwright suite passed 20 of 20. [Latest release checks](evidence/release-prep/checks.json) |
| O10 | PASSED | All four before and after screenshot pairs have the requested viewport dimensions. The before export included the entrance from the initial checkout. [Screenshot pairs](evidence/overhaul/README.md) |

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
