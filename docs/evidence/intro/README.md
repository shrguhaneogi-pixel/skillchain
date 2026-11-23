# Cinematic opening evidence

## Visual comparison

The reference and the built frame are both 1332 × 667. The build was captured at 56% on the actual timeline. The comparison preserves both images at native size. The title alignment, shield position, 58/42 seam and progress position follow the reference. The original line art, visible Skip control, lighter gold and phone stack are deliberate variations. The unchanged 128-pixel shield is softer when enlarged on desktop.

| View | Cover | Progress |
| --- | --- | --- |
| Desktop, 1332 × 667 | [First frame](initial-desktop.png) | [56%](progress-desktop.png) |
| Mobile, 390 × 844 | [First frame](initial-mobile.png) | [56%](progress-mobile.png) |

[Reference next to build](reference-vs-build.png) · [Revealed homepage](revealed-home.png) · [Measured bounds and console output](frames.json)

## Browser and lifecycle checks

Installed Chrome 157 exercised the production static export. The opening ran for 3.01–3.03 s in the measurement runs. The panel geometry, real opposite transforms, 100% label, cleared inert and scroll lock, initial Skip focus order and direct CTA activation were verified. The native Chromium accessibility tree excluded the Home heading while the cover was active. The browser run also covers session refresh and history, direct routes and hashes, storage denial, keyboard and touch, blocked framework scripts, both reduced-motion paths, animation timeout and JavaScript disabled.

TypeScript, ESLint with zero warnings, the production build, the 77-path route crawl, 74 unit and component tests, and all 51 Playwright tests passed. Vitest used a longer timeout for the existing baseline privacy-lint test. Axe found zero cover violations on desktop and mobile. Chrome measured a 44 px high Skip button and the requested 3 px ring with a 2 px offset. [Command results](checks.json) · [Cover accessibility](interaction.json)

The viewport cases include all requested fixed sizes, a 683 × 384 CSS viewport corresponding to 1366 × 768 at 200% layout zoom, and a 390 × 300 short viewport. The reduced viewport sizes were browser emulations. Native browser zoom, a live device with a software keyboard and a real background tab transition were not observed. The hidden-tab handler was exercised with a synthetic visibility event in Chrome. [Browser results](checks.json)

## Cost and timing

The intro contributes **11,848 bytes gzip** for the markup with outlined art, scoped stylesheet and both inline scripts. The scripts account for **1,216 bytes**. These use independent gzip compression as a conservative asset estimate. The full transfer figures below use Chrome Resource Timing and include the counted inline JavaScript in the route JavaScript total.

| Budget | Measured | Change from previous Home export |
| --- | --- | --- |
| Critical transfer ≤350 KiB | 316.8 KiB | +24.1 KiB |
| Route JavaScript ≤150 KiB | 144.8 KiB | +1.2 KiB |
| Intro assets ≤40 KiB gzip | 11.6 KiB | First introduction on this base |
| Intro JavaScript ≤4 KiB gzip | 1.2 KiB | First introduction on this base |

Three fresh Chrome contexts per viewport and state used the same gzip-enabled local export with no network or CPU throttle. The hero poster remained the LCP element in all runs. The first-session cover and the bypass both requested zero MP4s and only same-origin resources.

| Viewport | Median LCP, cover | Median LCP, bypass | Median CLS, cover | Median CLS, bypass |
| --- | --- | --- | --- | --- |
| 1440 × 900 | 276 ms | 212 ms | 0.0104 | 0.0046 |
| 390 × 844 | 228 ms | 180 ms | 0.0077 | 0.0037 |

These are local measurements. The cover's visible time differs from browser LCP because the page renders underneath. The two measured Skip activations removed the overlay in 6.7 ms with the mouse and 15.6 ms with emulated touch. Chrome's Event Timing durations were 64 ms and 88 ms, respectively. Field INP was not measured. [Raw timings, transfer and resource counts](performance.json) · [Dismissal latency](interaction.json)

## Owner checks

1. In a normal browser at native 200% page zoom, open Home in a fresh tab session. Verify every line and Skip fit, then press Tab and Enter. Repeat on a physical phone in portrait and landscape with the available viewport shortened by browser chrome or the keyboard.
2. While the opening is active in a normal foreground browser, switch to another tab and return. Confirm the cover is gone and the next Tab reaches Skip to content. Verify the opening name and text once with the owner's screen reader and browser.
3. Confirm the rights to distribute the provided reference image if it will be shared outside this review. Review the optional one-sentence session-flag disclosure in the decision log. [Artwork, colours and privacy decisions](../../DECISIONS.md#cinematic-opening)
