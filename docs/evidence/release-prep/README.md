# Release preparation

23 November 2026 · `design/homepage-overhaul` · **NOT READY**

GitHub confirmed the branch publication. Merge commit `0afa6fa` incorporates the verified `main` tip `877a8c4`. The merge tree matches the reviewed overhaul at `db0986f` because the overlapping changes all belonged to the retired entrance, scrolling hero and shared cursor. Release preparation then adjusted the narrow Home hero to keep its action rows stable while the control font loads. [Published branch](https://github.com/shrguhaneogi-pixel/skillchain/tree/design/homepage-overhaul) · [Compare for review](https://github.com/shrguhaneogi-pixel/skillchain/compare/main...design/homepage-overhaul?expand=1)

## Browser gates

- **A06 remains open.** Twice, installed Chrome 157 did not mark the automated practice tab hidden. The second run had Playwright focus emulation and background throttling overrides disabled. The timer regression exercises manual pause, time spent paused, regularly ticking expiry, task history and restart. A native tab switch and manual resume still need observation. [Visibility probes](hidden-tab.json) · [Manual A06 steps](../../BROWSER_VERIFICATION.md#a06--hidden-tab-pause)
- **A07 passed locally.** A/A/A and B/B/B each exercised a task edit, candidate feedback, the reviewer lens and source detail. Each run made three first-party image GETs. The address, Local Storage, Session Storage, IndexedDB and cookies stayed unchanged. The candidate origin still needs the hosted repeat. [Browser audit](browser-data.json)
- The public `skillchain-iota.vercel.app` origin responded successfully and served the older entrance when inspected. GitHub showed a successful Vercel check for `db0986f`. That status and the public URL do not establish the hosted acceptance of this candidate. [Vercel check](https://vercel.com/shrguhaneogi-pixels-projects/skillchain/9seWKsxKdxjpUS7Wy8ubPQbobo8Z)

TypeScript, strict ESLint, the production export, 59 Vitest tests, all 20 Playwright tests and the 77-path crawl passed. The final A07 address checks were rerun on both result paths. [Command and test results](checks.json)

## Performance

Three cold Chrome runs per route used 4× CPU slowdown, 1.6 Mbps download and 150 ms RTT. Lighthouse identified the arrival of Source Sans as the trigger for Home’s layout shift. The narrow hero now keeps the actions on separate rows during the font swap. The mobile browser test holds back the font and checks the two rows before and after it loads.

| Route | Median LCP | Median CLS | Median TBT |
| --- | --- | --- | --- |
| Home before the fix | 1.81 s | 0.130 | 863 ms |
| Home after the fix | 2.00 s | 0.002 | 1,079 ms |
| Demo | 1.13 s | 0.021 | 547 ms |
| FairHire | 1.42 s | 0.000 | 688 ms |

The post-fix Home median passed the 2.5 s LCP and 0.1 CLS targets. TBT exceeded the 200 ms limit on every route. Demo and FairHire were measured on the integrated tree. The later change affects only Home. Full lab traces and waterfalls are in the local `test-results/release-lab*` outputs. The hosted interaction trace and field INP remain open. [Initial runs](lab-baseline.json) · [Home retest](lab-home-retest.json) · [Local transfer](transfer.json)

## Remaining approval work

1. Run A06 in a normal foreground browser and A07 on the approved hosted preview. Confirm the preview shows the five-section Home before the hosted audit. [Browser sign-off](../../BROWSER_VERIFICATION.md)
2. Finish the cold lab performance gate and capture the hosted waterfall and interaction trace. Run NVDA with Firefox, including both Home replies, and complete the audible walkthrough check once the owner-approved narration is available. [Acceptance report](../../TEST_REPORT.md)
3. Confirm the monitored contact mailbox, operator details and applicable artwork rights. Obtain legal approval for the actual hosted data flow. Complete the hosted smoke tests before the release decision. [Owner checklist](../../OWNER_CHECKLIST.md)
