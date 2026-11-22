'use client'

import { useEffect, useRef } from 'react'
import styles from './ScrollVideoHero.module.css'

const film = '/media/scroll-hero.mp4'
const poster = '/media/scroll-hero-poster.webp'

export default function ScrollVideoHero() {
  const section = useRef<HTMLElement>(null)
  const screen = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const track = section.current!
    const stage = screen.current!
    const player = video.current!
    const header = document.querySelector<HTMLElement>('.marketing-header')
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let enabled = false
    let failed = false

    function update() {
      frame = 0
      if (!enabled) return
      const { top, height } = stage.getBoundingClientRect()
      const headerHeight = header?.offsetHeight ?? 0
      if (!height || top + height <= headerHeight || top >= window.innerHeight) return
      const travel = (headerHeight - top) / height
      // Reach the closing frame while the center of the artwork is still in view.
      const progress = Math.min(1, Math.max(0, travel / 0.48))
      const exit = Math.min(1, Math.max(0, (travel - 0.24) / 0.7))
      track.style.setProperty('--hero-progress', String(progress))
      track.style.setProperty('--hero-exit', String(exit))

      // Keep untouched Home and jumps straight to later sections free of film transfers.
      if (!player.hasAttribute('src') && progress > 0.002) player.src = film
      if (player.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || player.seeking || !Number.isFinite(player.duration)) return

      // Avoid seeking past the last displayable frame. A completed seek reads the latest scroll position.
      const target = Math.min(progress * player.duration, Math.max(0, player.duration - 0.05))
      if (Math.abs(player.currentTime - target) > 0.02) {
        player.currentTime = target
      } else if (track.dataset.frame !== 'true') {
        track.dataset.frame = 'true'
      }
    }

    function schedule() {
      if (enabled && !frame) frame = requestAnimationFrame(update)
    }

    function syncPreference() {
      enabled = !failed && !reduced.matches && document.documentElement.dataset.reducedMotion !== 'true'
      track.dataset.scrub = String(enabled)
      if (!enabled) {
        cancelAnimationFrame(frame)
        frame = 0
        delete track.dataset.frame
        track.style.removeProperty('--hero-progress')
        track.style.removeProperty('--hero-exit')
        if (player.hasAttribute('src')) {
          player.removeAttribute('src')
          player.load()
        }
      }
      schedule()
    }

    function fallback() {
      failed = true
      syncPreference()
    }

    const preferences = new MutationObserver(syncPreference)
    preferences.observe(document.documentElement, { attributes: true, attributeFilter: ['data-reduced-motion'] })
    const sizing = new ResizeObserver(schedule)
    sizing.observe(stage)
    if (header) sizing.observe(header)
    reduced.addEventListener('change', syncPreference)
    player.addEventListener('loadedmetadata', schedule)
    player.addEventListener('loadeddata', schedule)
    player.addEventListener('seeked', schedule)
    player.addEventListener('error', fallback)
    window.addEventListener('scroll', schedule, { passive: true })
    syncPreference()

    return () => {
      cancelAnimationFrame(frame)
      preferences.disconnect()
      sizing.disconnect()
      reduced.removeEventListener('change', syncPreference)
      player.removeEventListener('loadedmetadata', schedule)
      player.removeEventListener('loadeddata', schedule)
      player.removeEventListener('seeked', schedule)
      player.removeEventListener('error', fallback)
      window.removeEventListener('scroll', schedule)
    }
  }, [])

  return <section ref={section} className={styles.track} aria-labelledby="scroll-hero-title" data-scroll-hero>
    <div ref={screen} className={styles.screen} aria-hidden="true" data-cursor-tone="dark" data-hero-media>
      <img src={poster} alt="" width={1280} height={720} fetchPriority="high"/>
      <video ref={video} muted playsInline preload="auto"/>
    </div>
    <div className={styles.progress} aria-hidden="true"/>
    <div className={`wrap ${styles.caption}`}>
      <div>
        <h1 id="scroll-hero-title">Experience the workplace. Prove your potential.</h1>
        <p>Practice real workplace decisions in a fictional simulation.</p>
      </div>
      <div className={styles.actions}>
        <a href="/demo/" className="primary">Try SkillProof Demo</a>
        <a href="/skillproof/" className="secondary">Explore the Platform</a>
      </div>
    </div>
  </section>
}
