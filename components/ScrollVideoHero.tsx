'use client'

import { useEffect, useRef } from 'react'
import styles from './ScrollVideoHero.module.css'

const film = '/media/scroll-hero.mp4'
const poster = '/media/scroll-hero-poster.webp'

export default function ScrollVideoHero() {
  const section = useRef<HTMLElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const track = section.current!
    const stage = viewport.current!
    const player = video.current!
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let enabled = false
    let failed = false

    function update() {
      frame = 0
      if (!enabled) return
      const inset = parseFloat(getComputedStyle(stage).top) || 0
      const distance = track.offsetHeight - stage.offsetHeight
      if (distance <= 0) return
      const progress = Math.min(1, Math.max(0, (inset - track.getBoundingClientRect().top) / distance))
      track.dataset.ending = String(progress >= 0.85)

      // Keep the opening frame available without transferring video on an untouched Home.
      if (!player.hasAttribute('src') && progress > 0.002) player.src = film
      if (player.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || player.seeking || !Number.isFinite(player.duration)) return

      // Avoid seeking past the last displayable frame. A completed seek reads the latest scroll position.
      const target = Math.min(progress * player.duration, Math.max(0, player.duration - 0.05))
      if (Math.abs(player.currentTime - target) > 0.02) player.currentTime = target
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
        delete track.dataset.ending
        delete track.dataset.frame
        if (player.hasAttribute('src')) {
          player.removeAttribute('src')
          player.load()
        }
      }
      schedule()
    }

    function showFrame() {
      if (!enabled) return
      track.dataset.frame = 'true'
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
    reduced.addEventListener('change', syncPreference)
    player.addEventListener('loadedmetadata', schedule)
    player.addEventListener('loadeddata', showFrame)
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
      player.removeEventListener('loadeddata', showFrame)
      player.removeEventListener('seeked', schedule)
      player.removeEventListener('error', fallback)
      window.removeEventListener('scroll', schedule)
    }
  }, [])

  return <section ref={section} className={styles.track} aria-labelledby="scroll-hero-title" data-scroll-hero>
    <div ref={viewport} className={styles.viewport}>
      <div className={styles.screen} aria-hidden="true">
        <img src={poster} alt="" width={1280} height={720} fetchPriority="high"/>
        <video ref={video} muted playsInline preload="auto" aria-hidden="true"/>
      </div>
      <div className={styles.caption}>
        <div>
          <h1 id="scroll-hero-title">Experience the workplace. Prove your potential.</h1>
          <p>Practice real workplace decisions in a fictional simulation.</p>
        </div>
        <div className={styles.actions}>
          <a href="/demo/" className="primary">Try SkillProof Demo</a>
          <a href="/skillproof/" className="secondary">Explore the Platform</a>
        </div>
      </div>
    </div>
  </section>
}
