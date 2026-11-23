export const introSessionKey = 'skillchain.parchment-entered'

export function shouldPlayIntro(path: string, hash: string, seen: boolean, reducedMotion: boolean) {
  return path === '/' && !hash && !seen && !reducedMotion
}

// Self-contained because the static entry point serializes this function into its inline script.
export function getIntroFrame(elapsedMs: number): {
  phase: 'cover' | 'progress' | 'hold' | 'open' | 'done'
  progress: number
  panelOffset: number
} {
  if (elapsedMs <= 0) return { phase: 'cover', progress: 0, panelOffset: 0 }
  if (elapsedMs < 1700) {
    return { phase: 'progress', progress: 1 - (1 - elapsedMs / 1700) ** 3, panelOffset: 0 }
  }
  if (elapsedMs < 1900) return { phase: 'hold', progress: 1, panelOffset: 0 }
  if (elapsedMs >= 3000) return { phase: 'done', progress: 1, panelOffset: 1 }

  // Invert the x component of cubic-bezier(.76, 0, .24, 1) before evaluating y.
  const x = (elapsedMs - 1900) / 1100
  if (x === 0) return { phase: 'open', progress: 1, panelOffset: 0 }
  let lower = 0
  let upper = 1
  for (let i = 0; i < 16; i++) {
    const t = (lower + upper) / 2
    const inverse = 1 - t
    const estimate = 3 * inverse ** 2 * t * .76 + 3 * inverse * t ** 2 * .24 + t ** 3
    if (estimate < x) lower = t
    else upper = t
  }
  const t = (lower + upper) / 2
  return { phase: 'open', progress: 1, panelOffset: t * t * (3 - 2 * t) }
}
