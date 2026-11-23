# Cinematic opening plan

## Verified starting point

`feature/cinematic-opening` starts at `564107b`, the published release-preparation tip. GitHub confirmed the newer remote `main` commit has the same file tree. The checked-out branch has no entrance. `ParchmentDustIntro.tsx`, its CSS module, `lib/parchmentDust.ts` and `tests/e2e/parchment-intro.spec.ts` are present in the historical `877a8c4` tree and already absent from this branch. `MarketingShell.tsx`, `Shield.tsx` and `public/brand/` are present.

Baseline TypeScript and ESLint CLI passed, with zero lint warnings. Vitest reported **58 passed, one timed out** across nine files. The demo privacy lint test exceeded its existing five-second timeout.

## Historical entrance

The root layout set `data-parchment-ready` in a blocking script and copied the `skillchain.parchment-entered` session flag to HTML. A Home-only client component used `usePathname`, a layout effect and the same session key. A visit to another route did not consume the intro. It set the flag when the user skipped or finished. The component focused Enter, made its sibling inert and handled Escape. Finish focused the Home heading. OS and footer reduced motion selected a short fade after activation. Without JavaScript, the pre-paint attribute was absent and the entrance stayed hidden. The current footer keeps its override in `MarketingShell` and mirrors it on `html.dataset.reducedMotion`.

## Implementation units

1. Save the owner's reference under `design-reference/`, sample its pixels and outline OFL display glyphs. Author all patterns, flourishes, arch, fleuron and mandala in `components/opening/`. Keep only the licenses and static outlines from the fonts in the repository.
2. Add scoped styles, a pre-paint gate and a small browser controller. Keep the static introduction outside the application root and keep React out of its transient DOM. Reuse the historical session key. Keep `app/page.tsx`, the homepage CTA, the footer and the demo code intact. No additional deletions are needed.
3. Add pure timeline and first-visit tests and browser tests for actual timing, geometry, keyboard, skipping, lifecycle and no JavaScript. Preset the flag for existing homepage tests that exercise the underlying page. Compare the reference and screenshots, measure the export, document observed limitations and package the final commit.

## Risks

Static export, temporary inert state and pre-paint mutations need browser hydration verification. The fixed cover may become the LCP element. Measure the cover and bypass under the same conditions, including transfer and layout shift. Keep the reference and all screenshots outside `public/` and the build output. Keep the existing shield unchanged and reuse its existing site URL.

## Verification and handoff

Implementation commit `a855509` passed TypeScript, strict ESLint, the static export, 74 unit and component tests, 51 Playwright checks and the 77-path crawl. Chrome recorded the reference frames, native accessibility tree, opposite curtain transforms and direct CTA activation after dismissal. The reference and raw font sources are absent from the export. The comparison, measured budgets, timing and owner follow-up steps are in [intro evidence](evidence/intro/README.md).
