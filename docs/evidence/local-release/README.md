# Windows release check, 22 November 2026

Tested `d92f594` on `build/skillchain-workplace-demo` against the production export at `http://127.0.0.1:3100/`. Node 24.19.0, npm 11.17.0, Chrome 157.0.8103.80, Playwright 1.65.1, and FFmpeg 9.1. The build used the text masthead and an empty contact recipient. The checks used fictional inputs. Release status is **NOT READY**.

## Practice and browser checks

- **A06** stays open. Playwright tab activation sampled only `visible`. A keyboard switch to `about:blank` in a normal Chrome window showed 38 seconds as the demo tab was left. On return, the dialog said “Simulation paused,” but Rahul’s thread already showed “Decision window closed without a reply.” The attached browser probe recorded no genuine hidden event, and the Windows computer-use session ended before an uninstrumented repeat or a post-resume History check. The run did not meet the acceptance criteria.
- **A07** passed locally. A/A/A and B/B/B each used a fresh browser context and included a board edit, candidate feedback, reviewer view, source detail and return to the finding. With cache disabled, each run made two same-origin SVG requests and zero other requests. No payload, socket events, or cookie headers appeared. The `/demo/` URL stayed fixed, the links contained ordinary destinations, and FairHire opened C-017. Local Storage, Session Storage, IndexedDB and cookies were empty before and after each run. Repeat on the hosted origin. [Browser audit results](a07-local.json)
- **Untouched Home** passed locally. Chrome recorded only first-party requests with no media request or video bytes transferred before interaction. The five bento destinations also survived refresh at the expected states in Playwright.
- **A04** remains partial. The published candidate video played, its native media element sought to 35 seconds, and the English text track toggled off and on via browser APIs. The transcript opened. DevTools Protocol request blocking stopped player playback and left the transcript and the interactive link available. Chrome’s download still completed, so the deliberate download failure was not demonstrated. Audible mute and unmute require the candidate narration.
- **A12** remains partial. At real 400% page zoom in Chrome for Testing 159.0.8154.6 in a 1280 px window, all 11 routes and the practice inbox, board, feedback, and source views had matching 314 px client and scroll widths. The keyboard journey submitted replies, updated the board, and returned focus from a source to its finding. The same journey worked under Chrome’s forced-colors emulation. Playwright captured full-page PNGs at all four required layouts. NVDA with Firefox and system-level forced-colors checks were not completed. [Zoom and focus observations](a12-zoom-forced.json)

## Cold mobile lab

Lighthouse 13.6.0 ran three cold passes each in Chrome 157.0.8103.80 at 412 × 823 CSS px with 4× CPU slowdown, 150 ms RTT, 1.6 Mbps down and 0.75 Mbps up. Each run used a fresh Chrome profile and Lighthouse’s reset. The budgets are LCP ≤2.5 s, CLS ≤0.1 and TBT ≤200 ms. Home and Demo exceeded LCP, and all routes exceeded TBT. No Home MP4 transferred. Field INP awaits traffic. [All nine runs and applied settings](lab-summary.json)

| Route | Median LCP | Median CLS | Median TBT |
|---|---:|---:|---:|
| Home | 3.79 s | 0.046 | 2,879 ms |
| Demo | 3.35 s | 0.002 | 3,277 ms |
| FairHire | 1.75 s | 0.005 | 1,860 ms |

The separate 1440 × 900 desktop trace used the same CPU and network limits to exercise the sticky hero. It recorded steps 0–3 and back to 0 and both reply outcomes, In progress and Waiting. The trace and waterfall are `home-hero-trace.json` and `home-hero.har` in the local evidence directory. [Hero observations](home-hero-observations.json)

## Build and automated checks

`npm ci`, `npm run build`, `npm run typecheck`, and `npm run lint -- --max-warnings=0` completed. The release build succeeded after rerunning outside the filesystem sandbox, which had denied a generated `.next` directory write. All 60 unit and component tests passed with `--maxWorkers=2 --testTimeout=30000`. The default 5-second test timeout was exceeded by the privacy lint test on two runs. The HTTP crawl checked 74 paths including the custom 404. The export audit inspected 14 HTML files and 33 JavaScript files.

Playwright passed nine of ten tests, including all four native PNG layouts, the A/A/A and B/B/B flows and player playback. The fake-clock timing test jumped by 126 seconds in one operation, which opened “Simulation paused.” It then timed out waiting for “Finish simulation.” The [test](../../../tests/e2e/gate1.spec.ts) and [timing code](../../../components/Demo.tsx) document the two behaviors involved.

## Staged media

The documented `.ts` capture command fails under the package’s CommonJS setting on Node 24. An identical `.mts` copy ran the capture without changing the source script. The five genuine PNG originals match the manifest’s fictional states. FFprobe confirmed both native 1920 × 1080 recordings are H.264 at 30 fps. The candidate is 69.967 seconds and 1,210,097 bytes. The employer recording is 40 seconds and 762,168 bytes. The captures include posters and action timelines. Final candidate audio, cue and transcript synchronization, and publication remain pending. [Capture manifest](capture-manifest.json)

## Publication and owner inputs

GitHub’s `main` exists, and the named feature branch and a matching draft PR were absent in the remote checks. A Vercel-connected branch push can create a preview, so publication was held at the approval boundary. The monitored contact mailbox, operator details, candidate narration, and legal sign-off remain owner inputs. The optional artwork was disabled for this build.

Raw browser evidence and logs are under `test-results/release-browser/`, `test-results/release-e2e/`, and `test-results/release-tools/` in the local checkout. The nine waterfalls and the performance traces are in `test-results/release-lab/`. The unpublished captures are in `test-results/media/`.
