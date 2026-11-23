# Homepage browser evidence

The before set shows the untouched first viewport of the supplied local export with its shield entrance. The after set shows the untouched first viewport of the production build on the overhaul branch.

| Viewport | Before | After |
| --- | --- | --- |
| 1440 × 900 | [Before](before-1440x900.jpg) | [After](after-1440x900.jpg) |
| 834 × 1112 | [Before](before-834x1112.jpg) | [After](after-834x1112.jpg) |
| 390 × 844 | [Before](before-390x844.jpg) | [After](after-390x844.jpg) |
| 320 × 640 | [Before](before-320x640.jpg) | [After](after-320x640.jpg) |

[Incident desk after assigning Rahul](incident-1440x900.jpg) · [Cursor over the Play control](cursor-play-1440x900.jpg)

The managed browser timed out on the live and localhost navigation attempts. The local evidence comes from installed Chrome controlled by Playwright. The Home audit ran axe against the hydrated DOM and against the exported HTML served with application scripts stripped. The browser report records control bounds, section order, media requests, exact task outcomes, focus, accessible names, valid and invalid estimator values, and cursor observations. [Browser results](browser.json) · [Playwright suites](playwright-final.log)

Transfer figures use Chrome Resource Timing over a loopback server serving the production export with gzip for HTML, CSS, JavaScript, SVG and text. The report includes actual transfer sizes and the total cold-load bytes, including lazy assets if Chrome requested them during the initial load. Legacy browser fallback scripts are outside the modern Chrome measurements. [Measured transfer, contrast and plan alignment](transfer.json)

## Owner verification still open

1. Follow the hidden-tab pause and hosted Network, URL, Storage, IndexedDB and Cookies checks for A06 and A07. [Owner checklist](../../OWNER_CHECKLIST.md)
2. In Firefox with NVDA, use Tab and Enter on both scripted replies. Confirm one spoken result each time, focus stays on the chosen reply and reset returns focus to the first choice. Repeat with the footer Reduce motion override and the operating-system setting. Confirm the “Updated” label stays available.
3. Run the remaining hosted, lab performance, artwork, narration, contact, operator and legal checks in the owner checklist before release. The local byte test covers the three Home transfer budgets. Hosted timings and field metrics remain open. [Owner checklist](../../OWNER_CHECKLIST.md)

To repeat the local interactive checks, build the export and serve it using the repository workflow. Run Playwright with a dedicated output directory so the default `test-results` contents are preserved.

```sh
npm run test:e2e -- tests/e2e/home-cursor.spec.ts tests/e2e/incident-desk.spec.ts tests/e2e/public.spec.ts tests/e2e/scroll-hero.spec.ts --output=test-results/overhaul-run
```
