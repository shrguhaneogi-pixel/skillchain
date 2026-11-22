# Browser sign-off

Use a normal Chrome or Firefox window where DevTools is allowed. Serve the production export as described in the README. Repeat the checks against the hosted release before approving publication. [Ordered release checklist](OWNER_CHECKLIST.md)

## A06 · Hidden-tab pause

1. Open /demo/, acknowledge the scripted exercise and start Timed practice. Note the countdown. Before the first deadline, switch to an unrelated tab in the same window using the mouse.
2. Leave the demo hidden for at least 50 seconds. Return. **Pass** if “Simulation paused” is visible, the countdown is still at the pre-switch second (allowing the fraction of a second spent switching), and no missed-deadline entry appeared. **Fail** if the timer ran, an incident timed out, or the page resumed by itself.
3. Select Resume once. **Pass** if the countdown resumes from the frozen position, Rahul accepts a reply still within its boundary, and History has one decision with a matching consequence. **Fail** if time jumps, the choice window is lost, or an action appears twice.
4. Repeat using browser minimization and restore if available. When diagnosing a failure, log visibility events in the Console before starting:

```js
document.addEventListener('visibilitychange', () => console.info(document.visibilityState, performance.now()))
```

A normal browser should log hidden and then visible. The closing managed-Chrome probe recorded only visible states across a tab switch, with no visibilitychange event. It observed the demo running when back in view. This is an environment limitation for that probe. The mounted component passes hidden and delayed transitions, pagehide and freeze, and continues running on ordinary window blur.

## A07 · Network, URLs and persistence

Start in a fresh private window to avoid previous site data. Use only the fictional fixture controls.

| Panel | Before and after procedure | Pass or fail |
|---|---|---|
| Network | Open DevTools → Network. Enable Preserve log and Disable cache. Reload /demo/, wait for initial assets, then clear the list. Complete A/A/A, read feedback, enter the reviewer lens, open a source and leave the demo. Repeat B/B/B after refresh. Inspect All, Fetch/XHR, WS and Other. Open each new entry and review Headers, Payload, request cookies and WS Messages where present. | **Pass:** no practice-run requests or transmitted run choice, score, ID, owner change or evidence. Same-origin page/assets may load when you explicitly navigate. **Fail:** any run-derived request, payload, beacon or message. |
| Address and links | Observe the address before Start, after each reply and on both results views. In Elements inspect anchors on those views. Open FairHire separately. | **Pass:** unchanged /demo/ address, links contain only destinations, and FairHire still opens the C-017 fixture. **Fail:** a run value appears in a path, query, hash or link. |
| Application → Local Storage and Session Storage | Select the serving origin and record the keys before Start. Refresh each pane after each full run. | **Pass:** no new or changed run data. **Fail:** a new or changed run-derived key or value. |
| Application → IndexedDB | Expand the serving origin before Start and refresh the database list after both runs. | **Pass:** no run-related database, object store or record. **Fail:** any practice data appears. |
| Application → Cookies | Select the serving origin and record names and values before Start and after both runs. In Network, inspect Cookie and Set-Cookie headers on same-origin requests. | **Pass:** no new or modified cookie contains run data, and the app does not send run data in a cookie. **Fail:** any practice value appears. |

Keep a written pass/fail result for each row. Repeat once with a manual board edit. Code-level isolation evidence is in tests/demo.test.tsx, tests/demo-privacy.test.ts and the export audit. Browser-level claims about transmission and persistence await this run.

## Home media, accessibility and performance

1. Clear Network on Home, enable Disable cache, reload and wait without interacting. Filter for `mp4` or Media. **Pass** if there are zero video requests and zero transferred video bytes. Select Play and expect requests only for the selected recording, with English captions and a working transcript.
2. Try end-to-end candidate playback, midpoint seek and captions. Use DevTools request blocking for the candidate MP4, then try Play and Download video. Expect the player failure notice, transcript and interactive fallback. Test audible mute/unmute after the owner supplies narration.
3. Use NVDA with Firefox or VoiceOver with Safari. At 200% and 400%, verify the skip link, headings, menu focus, dialog pause/resume, tool tabs, candidate feedback, reviewer source focus and captions.
4. Run three cold mobile Lighthouse tests each on Home, demo and FairHire with 4× CPU slowdown, 1.6 Mb/s and 150 ms RTT. Record browser version, median LCP, CLS, TBT, network bytes and video requests. Capture a Performance trace while scrolling through the hero and choosing both replies. In the managed baseline the preview and local browser conditions differed from this profile, so the release lab remains open. Field INP awaits traffic.
