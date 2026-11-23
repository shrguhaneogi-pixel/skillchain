# Homepage overhaul progress

## Done and verified

- Created `design/homepage-overhaul` at the local feature revision `156e4a6`.
- Baseline TypeScript passed. ESLint CLI exited cleanly. Vitest reported 59 passed and 1 timed-out demo privacy test across 9 files.
- Pass 1 implemented the five sections, static masthead, intent-only media, scripted task preview, legacy anchors, CTA migration and consent move. All four affected component tests passed. The static production export and 77-path link crawl passed.
- Captured the four before screenshots from the supplied export. Measured both real-time automated A/A/A paths. [Baseline and timing](evidence/overhaul/baseline.md)
- Pass 2 applied the navy incident desk, ruled evidence, named static capture links, navigation chevron and common pricing baselines. Chrome passed both replies and reduced-motion keyboard operation at 1440, 834, 390 and 320 px. The CTA, film and five capture reloads passed. [Nine browser checks](evidence/overhaul/playwright-pass2.log)
- Pass 3 added the cursor to Play and View evidence. Chrome confirmed the native pointer, touch and reduced-motion exclusions, and zero layout shifts or long tasks during cursor interaction. The final export passed the browser assertions, 77-path crawl and gzip transfer budgets. Axe found zero violations on Home at 1440 and 390 px before and after hydration. [Browser results](evidence/overhaul/browser.json) · [Transfer measurements](evidence/overhaul/transfer.json)
- TypeScript, strict ESLint and the production build passed. Vitest passed 59 of 59 with the privacy test timeout override. The affected Playwright suites passed 15 of 15 and the final mobile masthead polish was checked in the browser and screenshot run. [Checks and screenshots](evidence/overhaul/README.md)

## In progress

- None for the local overhaul.

## Blocked

- The managed browser timed out attaching to the public preview and connecting to localhost. Repository Playwright is the fallback.
- The first Playwright CLI run cleared its ignored default `test-results` directory, including local tools and previous output. Tracked evidence and screenshots were preserved. Follow-up runs use `--output=test-results/overhaul-run` and installed Chrome.
- The branch is published. Preview verification, deployment and final approval remain owner actions.
- Release is **NOT READY**. A06, hosted A07, NVDA with Firefox and the remaining owner checks are open. The release retest exceeded the TBT budget. [Current release evidence and manual steps](evidence/release-prep/README.md)

## Next

- Review the published branch and close the remaining acceptance items. [Build progress](PROGRESS.md) · [Release preparation evidence](evidence/release-prep/README.md)
