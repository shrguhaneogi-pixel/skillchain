'use client'

import { useEffect, useRef, useState } from 'react'

export default function Walkthrough({ name, title, lead, transcript, fallback, available, concept = false }: {
  name: string; title: string; lead?: string; transcript: string; fallback: string; available: boolean; concept?: boolean
}) {
  const [requested, request] = useState(false)
  const [failed, setFailed] = useState(false)
  const player = useRef<HTMLVideoElement>(null)
  const path = '/media/' + name
  const id = name.replace(/-walkthrough$/, '')
  const fallbackText = fallback.startsWith('/fairhire') ? 'View a sample report' : 'Try the simulation'

  useEffect(() => {
    if (!requested || !player.current) return
    player.current.focus()
    void player.current.play().catch(() => {})
  }, [requested])

  if (!available) return <article><h3>{title}</h3>{lead && <p>{lead}</p>}
    <a className="secondary" href={fallback}>{fallbackText}</a>
  </article>

  return <article className={concept ? 'concept-film' : 'walkthrough'}>
    {concept ? <p id={id+'-video-label'} className="film-title">{title}</p> : <h3 id={id+'-video-label'}>{title}</h3>}
    {lead && <p>{lead}</p>}
    <div className="film-frame">
      {!requested
        ? <button className="video-activate" aria-label={concept ? undefined : 'Play walkthrough: ' + title}
          aria-describedby={concept ? id+'-video-label' : undefined} data-home-cursor-target={concept || undefined}
          type="button" onClick={() => request(true)}>
          <img src={path+'-poster.webp'} alt="" width={concept ? 1280 : 960} height={concept ? 720 : 540}
            loading={concept ? 'eager' : 'lazy'}/>
          <span>{concept ? 'Play' : 'Play walkthrough'}</span>
        </button>
        : <video ref={player} controls preload="none" playsInline aria-labelledby={id+'-video-label'}
          aria-describedby={id+'-video-note'} poster={path+'-poster.webp'} onError={() => setFailed(true)}>
          <source src={path+'.mp4'} type="video/mp4" onError={() => setFailed(true)}/>
          <track kind="captions" src={path+'.en.vtt'} srcLang="en" label="English" default/>
        </video>}
    </div>
    <p id={id+'-video-note'} className="home-meta">This clip is silent and captioned.</p>
    {failed && <p role="status">Video playback is unavailable. <a href={fallback}>{fallbackText}</a>.</p>}
    <details><summary>Read transcript</summary><div className="transcript">{transcript.split(/\r?\n\r?\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div></details>
    {!concept && <a href={path+'.mp4'} download>Download video</a>}
  </article>
}
