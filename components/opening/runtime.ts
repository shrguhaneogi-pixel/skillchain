import { getIntroFrame, introSessionKey, shouldPlayIntro } from '@/lib/cinematicIntro'

// Both entry points are serializable and receive their dependencies explicitly.
function markFirstPage(key: string, eligible: typeof shouldPlayIntro) {
  const html = document.documentElement
  try {
    const seen = sessionStorage.getItem(key) === '1'
    if (!seen) sessionStorage.setItem(key, '1')
    const reduced = html.dataset.reducedMotion === 'true' || matchMedia('(prefers-reduced-motion: reduce)').matches
    if (eligible(location.pathname, location.hash, seen, reduced)) html.setAttribute('data-opening-active', '')
  } catch {
    // Storage may be blocked. Keep the page directly usable in that case.
  }
}

function runOpening(frame: typeof getIntroFrame) {
  const html = document.documentElement
  const overlay = document.querySelector<HTMLElement>('[data-cinematic-opening]')
  const application = document.getElementById('skillchain-app')
  if (!html.hasAttribute('data-opening-active') || !overlay || !application || document.hidden) {
    html.removeAttribute('data-opening-active')
    overlay?.remove()
    return
  }

  const start = document.getElementById('opening-document-start')
  const percentage = overlay.querySelector<HTMLElement>('[data-opening-percent]')!
  const lowerPanel = overlay.querySelector('[data-opening-panel="lower"]')
  const skip = overlay.querySelector('button')!
  const motion = matchMedia('(prefers-reduced-motion: reduce)')
  const listeners = new AbortController()
  const options = { signal: listeners.signal }
  let nextFrame = 0
  let openTimer = 0
  let fallbackTimer = 0

  function finish(restoreFocus = true) {
    if (listeners.signal.aborted) return
    listeners.abort()
    observer.disconnect()
    cancelAnimationFrame(nextFrame)
    clearTimeout(openTimer)
    clearTimeout(fallbackTimer)
    application!.inert = false
    overlay!.remove()
    html.removeAttribute('data-opening-active')
    html.removeAttribute('data-opening-locked')
    html.style.removeProperty('--opening-gutter')
    if (restoreFocus) start?.focus({ preventScroll: true })
  }

  function preferenceChanged() {
    if (motion.matches || html.dataset.reducedMotion === 'true') finish()
  }

  const observer = new MutationObserver(preferenceChanged)
  observer.observe(html, { attributes: true, attributeFilter: ['data-reduced-motion'] })
  html.style.setProperty('--opening-gutter', Math.max(0, innerWidth - html.clientWidth) + 'px')
  html.setAttribute('data-opening-locked', '')
  application.inert = true
  skip.addEventListener('click', () => finish(), options)
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault()
      finish()
    }
  }, options)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) finish(false)
  }, options)
  window.addEventListener('pagehide', () => finish(false), options)
  window.addEventListener('popstate', () => finish(false), options)
  window.addEventListener('hashchange', () => finish(false), options)
  motion.addEventListener('change', preferenceChanged, options)
  overlay.addEventListener('animationend', event => {
    if (event.target === lowerPanel) finish()
  }, options)

  // Keep a painted 0% cover before the first percentage update.
  nextFrame = requestAnimationFrame(startedAt => {
    overlay.dataset.openingPhase = 'progress'
    const updatePercentage = (now: number) => {
      const { progress, phase } = frame(now - startedAt)
      const value = Math.floor(progress * 100) + '%'
      if (percentage.textContent !== value) percentage.textContent = value
      if (phase === 'progress' || phase === 'cover') nextFrame = requestAnimationFrame(updatePercentage)
      else if (overlay.dataset.openingPhase === 'progress') overlay.dataset.openingPhase = 'hold'
    }
    nextFrame = requestAnimationFrame(updatePercentage)
    openTimer = window.setTimeout(() => {
      cancelAnimationFrame(nextFrame)
      percentage.textContent = '100%'
      overlay.dataset.openingPhase = 'open'
    }, 1900)
  })
  fallbackTimer = window.setTimeout(finish, 3180)
  preferenceChanged()
}

export const openingBootstrap = `(${markFirstPage.toString()})(${JSON.stringify(introSessionKey)},${shouldPlayIntro.toString()});`
export const openingRuntime = `(${runOpening.toString()})(${getIntroFrame.toString()});`
