# SkillChain

The Project Coordinator demo runs entirely in the browser. Three fictional coworkers ask for a recovery owner, a client update and a decision on a vendor draft. Open the reviewer view after a run to trace each finding back to the message, reply and consequence. Direct visits to FairHire open the fixed fictional sample C-017.

## Run the demo

Use Node 22.12 or newer and npm. From the repository root run `npm ci`, then `npm run dev`. Open http://localhost:3000/demo/. The other Phase 1 routes are /simulations/, /trustchain/ and /fairhire/. The public landing and legal pages belong to a later build phase.

## Check and build

    npm run typecheck
    npm run lint
    npm test
    npm run build

The production export is in `out/`. Serve that directory with a static host that supports directory indexes. For browser tests, build first and start the export in a separate terminal:

    node scripts/dev.mjs --strictPort --host 127.0.0.1 --port 3000

In the first terminal run:

    npx playwright install chromium
    npm run test:e2e

The test runner accepts PLAYWRIGHT_BASE_URL and PLAYWRIGHT_CHROMIUM_EXECUTABLE. See .env.example for build-time settings. The Phase 1 demo requires no secrets, accounts or external services. Refreshing clears the practice run.

The handoff from the original main branch is archived in docs/ORIGINAL_README.md. See docs/PROGRESS.md for observed results and release gates.

## Re-record the media at native resolution

Install Chromium for Playwright and install FFmpeg with H.264 support. Build the site, then serve the production export in a separate terminal.

```sh
npx playwright install chromium
npm run build
node scripts/dev.mjs --strictPort --host 127.0.0.1 --port 3000
```

Run this in another terminal from the checkout using Node 22.18 or newer.

```sh
node scripts/capture-media.ts test-results/media
```

The script opens a fresh browser context for each PNG and records both approved shot lists at a native 1920 × 1080 viewport. It writes results to the designated directory. It leaves the current public files in place. Review the framing and role labels and compare the actual timing JSON with the cue and transcript text before replacing media. The existing responsive images are derived from managed Chrome JPEG captures. See [the capture manifest](docs/CAPTURE_MANIFEST.md).
