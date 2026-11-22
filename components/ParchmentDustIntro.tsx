'use client'

import { useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { dissolveParchment, parchmentSessionKey } from '@/lib/parchmentDust'
import styles from './ParchmentDustIntro.module.css'

export default function ParchmentDustIntro({ children }: { children: ReactNode }) {
  const home = usePathname() === '/'
  const [complete, setComplete] = useState(false)
  const [phase, setPhase] = useState<'idle' | 'dust' | 'fade'>('idle')
  const site = useRef<HTMLDivElement>(null)
  const enter = useRef<HTMLButtonElement>(null)
  const logo = useRef<HTMLImageElement>(null)
  const overlay = useRef<HTMLDivElement>(null)
  const sheet = useRef<HTMLCanvasElement>(null)
  const dust = useRef<HTMLCanvasElement>(null)
  const started = useRef(false)
  const stop = useRef<() => void>(undefined)
  const open = home && !complete

  useLayoutEffect(() => {
    if (!open) return
    try {
      if (sessionStorage.getItem(parchmentSessionKey) === '1') {
        setComplete(true)
        return
      }
    } catch { /* The entrance remains dismissible in this tab without storage. */ }
    document.documentElement.dataset.parchmentReady = ''
    const content = site.current!
    content.inert = true
    enter.current?.focus({ preventScroll: true })
    return () => {
      content.inert = false
      stop.current?.()
      stop.current = undefined
      started.current = false
    }
  }, [open])

  function finish() {
    stop.current?.()
    stop.current = undefined
    try { sessionStorage.setItem(parchmentSessionKey, '1') } catch { /* In-memory state still lasts across routes. */ }
    document.documentElement.dataset.parchmentSeen = ''
    if (site.current) site.current.inert = false
    const heading = site.current?.querySelector<HTMLElement>('main h1')
    heading?.setAttribute('tabindex', '-1')
    heading?.focus({ preventScroll: true })
    setComplete(true)
  }

  function start(event: MouseEvent<HTMLButtonElement>) {
    if (started.current) return
    started.current = true
    const bounds = overlay.current!.getBoundingClientRect()
    const origin = event.detail === 0
      ? { x: bounds.width / 2, y: bounds.height / 2 }
      : { x: event.clientX - bounds.x, y: event.clientY - bounds.y }

    if (!matchMedia('(prefers-reduced-motion: reduce)').matches && document.documentElement.dataset.reducedMotion !== 'true') {
      const release = dissolveParchment(sheet.current!, dust.current!, logo.current!,
        Array.from(overlay.current!.querySelectorAll<HTMLElement>('[data-parchment-label]')), origin, finish)
      if (release) {
        setPhase('dust')
        window.addEventListener('resize', finish, { once: true })
        stop.current = () => { window.removeEventListener('resize', finish); release() }
        return
      }
    }

    setPhase('fade')
    const fade = window.setTimeout(finish, 150)
    stop.current = () => window.clearTimeout(fade)
  }

  return <>
    {open && <div ref={overlay} className={styles.overlay} data-parchment-intro data-phase={phase} data-cursor="native"
      role="region" aria-label="SkillChain entrance" onKeyDown={event => { if (event.key === 'Escape') finish() }}>
      <button ref={enter} type="button" className={styles.enter} aria-label="Enter SkillChain" onClick={start}>
        <img ref={logo} className={styles.logo} src="/brand/skillchain-shield.png" alt="" width={128} height={128} fetchPriority="high"/>
        <span className={styles.hint}>
          <span className={styles.mouse} data-parchment-label>Click anywhere to enter</span>
          <span className={styles.touch} data-parchment-label>Tap anywhere to enter</span>
        </span>
      </button>
      <button type="button" className={styles.skip} onClick={finish}><span data-parchment-label>Skip intro</span></button>
      <canvas ref={sheet} className={styles.canvas} data-parchment-sheet aria-hidden="true"/>
      <canvas ref={dust} className={styles.canvas} data-parchment-dust aria-hidden="true"/>
    </div>}
    <div ref={site} data-parchment-content>{children}</div>
  </>
}
