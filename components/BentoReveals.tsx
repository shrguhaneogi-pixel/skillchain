'use client'

import { useEffect, useRef, type ReactNode } from 'react'

export default function BentoReveals({ children }: { children: ReactNode }) {
  const grid = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (CSS.supports('view-timeline-name: --bento-image') && CSS.supports('animation-timeline: --bento-image') &&
      CSS.supports('animation-range: entry 12% entry 82%')) return
    if (!('IntersectionObserver' in window)) return

    const container = grid.current!
    const pictures = container.querySelectorAll<HTMLElement>('picture')
    const inView = new Set<HTMLElement>()
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    function update() {
      frame = 0
      const height = document.documentElement.clientHeight
      for (const picture of inView) {
        const bounds = picture.getBoundingClientRect()
        if (!bounds.height) continue
        const entry = (height - bounds.top) / Math.min(height, bounds.height)
        const progress = Math.min(1, Math.max(0, (entry - 0.12) / 0.7))
        picture.style.setProperty('--bento-reveal', String(progress))
      }
    }

    function schedule() {
      if (inView.size && !frame) frame = requestAnimationFrame(update)
    }

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const picture = entry.target as HTMLElement
        if (entry.isIntersecting) inView.add(picture)
        else inView.delete(picture)
      }
      schedule()
    })

    function sync() {
      const enabled = !reduced.matches && document.documentElement.dataset.reducedMotion !== 'true'
      if (enabled === container.hasAttribute('data-reveal-fallback')) return
      if (enabled) {
        container.dataset.revealFallback = ''
        pictures.forEach(picture => observer.observe(picture))
        window.addEventListener('scroll', schedule, { passive: true })
        window.addEventListener('resize', schedule)
      } else {
        delete container.dataset.revealFallback
        observer.disconnect()
        inView.clear()
        cancelAnimationFrame(frame)
        frame = 0
        pictures.forEach(picture => picture.style.removeProperty('--bento-reveal'))
        window.removeEventListener('scroll', schedule)
        window.removeEventListener('resize', schedule)
      }
    }

    const settings = new MutationObserver(sync)
    settings.observe(document.documentElement, { attributes: true, attributeFilter: ['data-reduced-motion'] })
    reduced.addEventListener('change', sync)
    sync()

    return () => {
      settings.disconnect()
      reduced.removeEventListener('change', sync)
      observer.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return <div ref={grid} className="bento">{children}</div>
}
