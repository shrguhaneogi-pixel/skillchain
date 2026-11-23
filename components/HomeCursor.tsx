'use client'

import { useEffect, useRef } from 'react'

export default function HomeCursor() {
  const overlayRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const overlay = overlayRef.current
    const label = labelRef.current
    const home = overlay?.closest('main')
    if (!overlay || !label || !home) return

    const fineHover = matchMedia('(hover: hover) and (pointer: fine)')
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const root = document.documentElement
    const controls = '[data-home-cursor-target]'
    const fields = 'form, input, select, textarea, [contenteditable]'
    let target: HTMLElement | null = null
    let x = 0
    let y = 0
    let frame = 0

    function enabled() {
      return fineHover.matches && !reduced.matches && root.dataset.reducedMotion !== 'true'
    }

    function hide() {
      cancelAnimationFrame(frame)
      frame = 0
      target = null
      overlay!.hidden = true
    }

    function paint() {
      frame = 0
      if (!target?.contains(document.elementFromPoint(x, y)) || !enabled()) {
        hide()
        return
      }
      overlay!.style.transform = `translate3d(${x}px, ${y}px, 0)`
      overlay!.dataset.labelSide = x > window.innerWidth - 128 ? 'left' : 'right'
      overlay!.hidden = false
    }

    function schedule() {
      if (target && !frame) frame = requestAnimationFrame(paint)
    }

    function move(event: PointerEvent) {
      const origin = event.target
      if (!enabled() || event.pointerType !== 'mouse' || !(origin instanceof Element) ||
          origin.closest(fields) || window.getSelection()?.isCollapsed === false) {
        hide()
        return
      }
      const next = origin.closest<HTMLElement>(controls)
      if (!next) {
        hide()
        return
      }
      if (next !== target) {
        target = next
        label!.textContent = next.textContent?.trim() ?? ''
      }
      x = event.clientX
      y = event.clientY
      schedule()
    }

    function leave(event: PointerEvent) {
      if (!(event.relatedTarget instanceof Node) || !target?.contains(event.relatedTarget)) hide()
    }

    const preference = new MutationObserver(hide)
    preference.observe(root, { attributes: true, attributeFilter: ['data-reduced-motion'] })
    fineHover.addEventListener('change', hide)
    reduced.addEventListener('change', hide)
    home.addEventListener('pointermove', move)
    home.addEventListener('pointerout', leave)
    home.addEventListener('pointercancel', hide)
    window.addEventListener('scroll', schedule, { capture: true, passive: true })
    window.addEventListener('blur', hide)

    return () => {
      hide()
      preference.disconnect()
      fineHover.removeEventListener('change', hide)
      reduced.removeEventListener('change', hide)
      home.removeEventListener('pointermove', move)
      home.removeEventListener('pointerout', leave)
      home.removeEventListener('pointercancel', hide)
      window.removeEventListener('scroll', schedule, true)
      window.removeEventListener('blur', hide)
    }
  }, [])

  return <div ref={overlayRef} className="home-cursor" data-home-cursor aria-hidden="true" hidden>
    <span ref={labelRef} className="home-cursor-label"/>
  </div>
}
