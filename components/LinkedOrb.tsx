'use client'

import { useEffect, useRef } from 'react'
import styles from './LinkedOrb.module.css'

const nativeCursor = 'input, textarea, select, [role="textbox"], [contenteditable]:not([contenteditable="false"]), video[controls], dialog, [data-cursor="native"]'
const magnetic = 'button:not(:disabled), a:is(.primary,.secondary), [data-cursor="magnetic"]'

export default function LinkedOrb() {
  const orb = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = orb.current!
    const root = document.documentElement
    const mouse = matchMedia('(any-hover: hover) and (any-pointer: fine)')
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const forced = matchMedia('(forced-colors: active)')
    let pointer: { x: number; y: number } | undefined
    let x = 0
    let y = 0
    let active = false
    let frame = 0
    let pressedAt = 0
    let releaseTimer = 0

    function hide() {
      pointer = undefined
      active = false
      cancelAnimationFrame(frame)
      frame = 0
      root.removeAttribute('data-linked-cursor-active')
      cursor.removeAttribute('data-visible')
      window.clearTimeout(releaseTimer)
      cursor.removeAttribute('data-pressed')
    }

    function allowed() {
      return mouse.matches && !reduced.matches && !forced.matches && root.dataset.reducedMotion !== 'true'
    }

    function draw() {
      frame = 0
      if (!pointer || !allowed()) { hide(); return }
      const target = document.elementFromPoint(pointer.x, pointer.y)
      if (!target || target.closest(nativeCursor) || document.querySelector('dialog:modal')) { hide(); return }

      const tile = target.closest('[data-cursor="view"]')
      const button = tile ? null : target.closest(magnetic)
      let toX = pointer.x
      let toY = pointer.y
      if (button) {
        const rect = button.getBoundingClientRect()
        const pull = (offset: number) => Math.max(-5, Math.min(5, offset * 0.22))
        toX += pull(rect.x + rect.width / 2 - toX)
        toY += pull(rect.y + rect.height / 2 - toY)
      }

      x = active ? x + (toX - x) * 0.55 : toX
      y = active ? y + (toY - y) * 0.55 : toY
      const remaining = Math.hypot(toX - x, toY - y)
      if (remaining > 16) {
        x = toX + (x - toX) * 16 / remaining
        y = toY + (y - toY) * 16 / remaining
      }
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`
      const mode = tile ? 'view' : button ? 'magnetic' : 'default'
      const tone = target.closest('[data-cursor-tone="dark"]') ? 'dark' : 'light'
      if (tile) cursor.style.setProperty('--badge-offset', pointer.x > innerWidth - 75 ? '-40px' : '40px')
      if (cursor.dataset.mode !== mode) cursor.dataset.mode = mode
      if (cursor.dataset.tone !== tone) cursor.dataset.tone = tone
      if (!active) {
        active = true
        cursor.dataset.visible = ''
        root.dataset.linkedCursorActive = ''
      }
      if (Math.abs(toX - x) + Math.abs(toY - y) > 0.15) schedule()
    }

    function schedule() {
      if (pointer && !frame) frame = requestAnimationFrame(draw)
    }

    function move(event: PointerEvent) {
      if (event.pointerType !== 'mouse' || !allowed() || (event.target as Element | null)?.closest(nativeCursor)) {
        hide()
        return
      }
      pointer = { x: event.clientX, y: event.clientY }
      schedule()
    }

    function press(event: PointerEvent) {
      if (!active || event.pointerType !== 'mouse' || event.button !== 0) return
      window.clearTimeout(releaseTimer)
      pressedAt = performance.now()
      cursor.dataset.pressed = ''
    }

    function release(event: PointerEvent) {
      if (event.pointerType !== 'mouse' || event.button !== 0 || !cursor.hasAttribute('data-pressed')) return
      releaseTimer = window.setTimeout(() => cursor.removeAttribute('data-pressed'), Math.max(0, 85 - (performance.now() - pressedAt)))
    }
    function preference() { if (!allowed()) hide() }

    const settings = new MutationObserver(preference)
    settings.observe(root, { attributes: true, attributeFilter: ['data-reduced-motion'] })
    for (const query of [mouse, reduced, forced]) query.addEventListener('change', preference)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', press, { passive: true })
    window.addEventListener('pointerup', release, { passive: true })
    window.addEventListener('pointercancel', hide)
    window.addEventListener('scroll', schedule, { capture: true, passive: true })
    window.addEventListener('blur', hide)
    window.addEventListener('keydown', hide)
    window.addEventListener('resize', schedule)
    root.addEventListener('pointerleave', hide)

    return () => {
      hide()
      settings.disconnect()
      for (const query of [mouse, reduced, forced]) query.removeEventListener('change', preference)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', press)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', hide)
      window.removeEventListener('scroll', schedule, true)
      window.removeEventListener('blur', hide)
      window.removeEventListener('keydown', hide)
      window.removeEventListener('resize', schedule)
      root.removeEventListener('pointerleave', hide)
    }
  }, [])

  return <div ref={orb} className={styles.cursor} data-linked-orb aria-hidden="true">
    <div className={styles.glyph}>
      <span className={styles.links}/>
      <span className={styles.center}/>
      <span className={styles.badge}>VIEW</span>
    </div>
  </div>
}
