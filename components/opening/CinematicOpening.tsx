import { crimsonPattern, fleuron, ivoryArtwork, mandala, sideFlourishes } from './artwork'
import { debuggersOutline, debuggersViewBox, skillChainOutline, skillChainViewBox } from './wordmarks'

const progressLabel = 'LOADING'

const markup = `
<div class="cinematic-opening" role="dialog" aria-modal="true" aria-label="SkillChain opening" data-cinematic-opening data-opening-phase="cover">
  <div class="opening-panel opening-upper" data-opening-panel="upper">
    ${ivoryArtwork}
    ${sideFlourishes}
    <div class="opening-brand">
      <span class="opening-readable">THE DEBUGGERS PRESENTS</span>
      <svg class="opening-debuggers" viewBox="${debuggersViewBox}" aria-hidden="true" focusable="false">${debuggersOutline}</svg>
      <span class="opening-presents" aria-hidden="true">PRESENTS</span>
      ${fleuron}
      <div class="opening-lockup">
        <span class="opening-readable">SkillChain</span>
        <svg class="opening-wordmark" viewBox="${skillChainViewBox}" preserveAspectRatio="none" aria-hidden="true" focusable="false">${skillChainOutline}</svg>
        <img class="opening-shield" src="/brand/skillchain-shield.png" alt="" aria-hidden="true" loading="lazy" width="128" height="128">
      </div>
    </div>
  </div>
  <div class="opening-panel opening-lower" data-opening-panel="lower" aria-hidden="true">
    ${crimsonPattern}
    ${mandala}
    <div class="opening-progress">
      <div class="opening-progress-label">${progressLabel}<span data-opening-percent>0%</span></div>
      <div class="opening-track"><span></span></div>
    </div>
  </div>
  <button class="opening-skip" type="button">Skip intro</button>
</div>`

export default function CinematicOpening() {
  // React owns the host. The inline controller owns the transient contents.
  return <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: markup }}/>
}
