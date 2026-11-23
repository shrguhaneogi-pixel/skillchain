# SkillChain owner release checklist

The current release status is **NOT READY**. Run the steps in order. Record dates, browser version, results and links to evidence in the acceptance report. Use fictional inputs throughout testing.

The 23 November 2026 release preparation refreshed the local evidence for the homepage overhaul. Use the published `design/homepage-overhaul` branch for the remaining checks. [Release preparation evidence](evidence/release-prep/README.md)

### 1. Publish the feature branch

- [x] Publish `design/homepage-overhaul` to `shrguhaneogi-pixel/skillchain` and verify GitHub's head matches the intended revision. The feature branch includes the verified `main` tip without restoring the retired entrance and cursors. [Published branch](https://github.com/shrguhaneogi-pixel/skillchain/tree/design/homepage-overhaul)
- [ ] Open a draft PR with `design/homepage-overhaul` as the head and `main` as the base. Include the acceptance report and the current **NOT READY** status in the description. [Compare the branch](https://github.com/shrguhaneogi-pixel/skillchain/compare/main...design/homepage-overhaul?expand=1)

### 2. A06 — Observe a real hidden-tab pause

- [ ] Serve the export using the README. Open `/demo/` in normal Chrome or Firefox. Acknowledge the fictional exercise, select **Timed practice** (self-paced off) and start. Note the countdown immediately before switching to another tab in the same window. Stay there at least 50 seconds. Return, confirm **Simulation paused** and the exact frozen countdown from the hide time, then select **Resume** manually. Complete one decision and open History.

  **Pass** if background time never reduces the countdown, there is no missed-deadline entry, and the reply produces exactly one decision and consequence. **Fail** if the browser confirms a hidden transition but the timer advances, the dialog is absent, or the action duplicates. See [browser diagnosis steps](BROWSER_VERIFICATION.md#a06--hidden-tab-pause).

### 3. A07 — Inspect both full practice runs

- [ ] In a clean private window open DevTools. Do the checks below before and after an A/A/A run, then repeat for a B/B/B run. Include feedback, reviewer view, source detail, and a board edit. Record a result for each panel. Any request other than first-party static assets during the run is a **fail that blocks release**.

  | Panel | Record and evaluate |
  |---|---|
  | Network | Enable Preserve log and Disable cache. Let the initial same-origin assets finish, then clear the list before Start. Inspect All, Fetch/XHR, WS and Other, including URL, payload, cookies and messages. **Pass** if any new requests are limited to first-party static assets with no run values. **Fail** for any other request or exported run information. |
  | URL bar and links | Compare the address before Start, after each decision and on both results views. Inspect link destinations and open FairHire separately. **Pass** if no choice, score, ID, board change or evidence enters the URL or a link and FairHire opens C-017. **Fail** for any run-derived URL value. |
  | Application → Local Storage | Compare the serving origin’s keys and values. **Pass** if no run data appears or changes. **Fail** if it does. |
  | Application → Session Storage | Compare the serving origin’s keys and values. **Pass** if no run data appears or changes. **Fail** if it does. |
  | Application → IndexedDB | Refresh the origin’s databases and object stores after each run. **Pass** if no run-derived database, store or record appears. **Fail** if it does. |
  | Application → Cookies | Compare names and values. Check Cookie and Set-Cookie headers. **Pass** if no cookie stores or sends run data. **Fail** if one does. |

  **Pass** if both runs pass every panel. **Fail** if either run fails a panel or evidence is missing.

### 4. Verify untouched Home traffic

- [x] In DevTools Network, enable Disable cache, clear the request table, reload Home and wait for the initial load without clicking or playing anything. Inspect Media, search for `.mp4` and check every host. The local Chrome run passed. The hosted repeat is in step 12.

  **Pass** if video transfers zero bytes and only first-party hosts appear. **Fail** if video bytes transfer or any third-party host appears.

### 5. A04 — Exercise the native player

- [ ] Play the candidate video. Seek to the middle, turn English captions off and back on, and open **Read transcript**. Test audible mute and unmute after adding the real voiceover in step 8. Use DevTools request blocking for `*candidate-walkthrough.mp4*`. Reload and try Play to verify the fallback. Remove the block and verify **Download video**.

  **Pass** if native seek, audible controls and caption toggling work, and the deliberate failure leaves transcript and interactive fallback available. **Fail** if controls or fallbacks are broken. Schedule this check now and run the audible portion again after step 8 before scoring it.

### 6. A12 — Check zoom, assistive technology and forced colours

- [ ] At a 1280 px browser window set real page zoom to 400%. Check Home, the demo workflow and all public routes for content loss and horizontal scrolling. Use NVDA with Firefox or VoiceOver with Safari to navigate headings, send a reply, change the board, read feedback, enter the reviewer lens, open a source and return to its finding. Repeat the critical interactions with forced colours enabled where available. Capture full-resolution screenshots from the four required layouts.

  **Pass** if content reflows and remains understandable and operable with visible focus, correct readings and reversible focus on the source path. **Fail** for content loss, horizontal overflow, unreachable action, misleading reading or trapped/lost focus.

### 7. A13 — Run the cold mobile lab

- [ ] Record the Chrome version. Run three cold mobile passes each on Home, Demo and FairHire using **4× CPU slowdown, 1.6 Mbps down and 150 ms RTT**. Reset HTTP cache and site data between runs. Use a Lighthouse configuration or browser lab harness that records the applied throttling. Report median LCP, CLS and TBT on each route. Save a waterfall and performance trace while scrolling the Home hero and choosing both replies. Report field INP separately once traffic exists.

  **Pass** if the confirmed lab meets the handoff budgets (LCP ≤2.5 s, CLS ≤0.1 and TBT ≤200 ms) and the waterfall and interaction trace support the acceptance rows. **Fail** for unmet budgets, missing evidence or a different profile.

### 8. Upgrade media at native resolution

- [ ] Install FFmpeg with H.264 support, then start the export in a terminal from the checkout.

  ```sh
  npm ci
  npx playwright install chromium
  npm run build
  node scripts/dev.mjs --strictPort --host 127.0.0.1 --port 3000
  ```

  In a second terminal, generate lossless screenshot originals and native-resolution footage. Compare framing, labels and timing against the manifest before replacing the published files.

  ```sh
  node scripts/capture-media.ts test-results/media
  ```

  Record a WAV aligned to the candidate footage. With the new 70-second candidate recording staged under `test-results/media/`, mux the picture and actual narration as follows.

  ```sh
  ffmpeg -i test-results/media/candidate-walkthrough.mp4 -i narration.wav \
    -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 128k \
    -af 'apad=whole_dur=70' -t 70 -movflags +faststart candidate-with-voiceover.mp4
  ffprobe -v error -show_entries stream=codec_name,codec_type,width,height,avg_frame_rate:format=duration,size candidate-with-voiceover.mp4
  ```

  Compare the cue times with the actual recording timeline and first audible word of each phrase. If narration shifts uniformly, use a signed offset in seconds. This example moves the cues 350 ms later.

  ```sh
  ffmpeg -itsoffset 0.350 -i public/media/candidate-walkthrough.en.vtt \
    -map 0:s:0 -c:s webvtt -t 70 candidate-voiceover.en.vtt
  ```

  If individual phrases drift, retime each cue to the WAV in a subtitle editor. Clamp the last cue to 00:01:10.000, keep cues ordered and synchronize the transcript. Verify the published candidate MP4 against the 12 MiB budget, check English cue timing, and update the matching poster. Remove the **“This clip is silent and captioned.”** notice from the candidate player once actual audio is published. Keep the notice for any film that remains silent. Repeat step 5 with the new recording. See [capture manifest](CAPTURE_MANIFEST.md).

  **Pass** if the five originals are truly lossless, the recording is native 1920 × 1080, and the final audio, captions, poster and transcript match. **Fail** for derivative originals, upscaled footage, silent or misaligned narration, or a stale notice.

### 9. Confirm owner inputs

- [ ] Confirm wordmark rights, then set `NEXT_PUBLIC_USE_WORDMARK=true` to use the single optional masthead switch. Keep it false until rights are confirmed. Set `NEXT_PUBLIC_CONTACT_EMAIL` to the monitored team-confirmed recipient and rebuild. Use a local mail handler to inspect the prefilled recipient, subject and encoded body without sending. Record the responsible operator and correct contact details for the draft notices.

  **Pass** if the chosen masthead is authorized, operator and contact details are confirmed, and the mail handler opens the correct draft including special characters. **Fail** for uncertain rights on the enabled mark, missing operator or contact, an incorrect draft or any site dispatch claim.

### 10. Complete legal review

- [ ] Compare Terms and Privacy against the actual deployed data flow, including the site host, request handling, contact recipient, and results of step 3. Record operator approval after legal review.

  **Pass** if reviewed text accurately describes the shipped flow and handling. **Fail** if policy copy, operator details, or browser evidence is missing or inconsistent.

### 11. Deploy the static export to Vercel

- [ ] Import the authorized repository and deploy the approved revision for preview checks. Build with `npm run build` and use output directory `out`. Keep **Vercel Analytics and Speed Insights off**. Set only the confirmed build-time environment values. Promote to public release after steps 12 and 13 pass.

  **Pass** if the selected revision produces the static export, directory-index routing works, and both analytics products are off. **Fail** if the export, routing, revision or project settings differ.

### 12. Smoke-test the deployed revision

- [ ] Open and refresh `/`, `/about/`, `/contact/`, `/demo/`, `/fairhire/`, `/pricing/`, `/privacy/`, `/simulations/`, `/skillproof/`, `/terms/` and `/trustchain/`. Refresh the bento destinations `/skillproof/#mailbox`, `/demo/?tool=tasks`, `/simulations/`, `/trustchain/#credential` and `/fairhire/#report`. Verify caption and transcript files, real 404 status and page, contact/estimate deep links, and a clean app console. Repeat the browser data checks and untouched Home network check on the deployed origin.

  **Pass** if every route and intended state survives refresh, media and request paths work, the 404 is correct, and no app errors or forbidden requests appear. **Fail** if any path, asset, state, caption, contact check or console check fails.

### 13. Re-score and approve the release

- [ ] Update the matching A01–A14 tables in `PROGRESS.md`, `TEST_REPORT.md` and `FEATURE_STATUS.md` with the observed evidence and record approval.

  **Pass** if every release-blocking row is **PASSED**. Set the release status to **READY** only then. **Fail** if any release-blocking row is partial, open or blocked. Keep the status **NOT READY**.

## Release-blocking items

| Blocker | Owner | Closing step |
|---|---|---|
| A06 real hidden-tab lifecycle and exact resume | Owner, engineering if a defect reproduces | 2 |
| A07 practice data network, URL and storage audit | Owner, engineering if a check fails | 3 and 12 |
| Untouched Home transfer and first-party-only traffic | Owner | 4 and 12 |
| A04 native seek, audible controls, captions toggle and failed download | Owner | 5 and 8 |
| A12 real zoom, screen-reader journeys, forced colours and native-resolution evidence | Owner | 6 |
| A13 prescribed cold lab, waterfall and interaction trace | Owner | 7 |
| Approved media originals and native capture, plus candidate narration | Owner | 8 |
| Monitored contact mailbox, functioning mailto and operator details | Owner | 9 |
| Rights clearance for the optional masthead artwork | Owner if enabling the artwork | 9 |
| Legal sign-off | Owner | 10 |
| Hosted release and smoke tests | Owner | 11 and 12 |
| Final release decision | Owner | 13 |
