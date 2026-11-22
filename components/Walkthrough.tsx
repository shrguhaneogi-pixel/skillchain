'use client'

import { useEffect, useRef, useState } from 'react'

export default function Walkthrough({ name, title, lead, transcript, fallback, available }: {
  name: string; title: string; lead: string; transcript: string; fallback: string; available: boolean
}) {
  const [requested, request] = useState(false)
  const [failed, setFailed] = useState(false)
  const player = useRef<HTMLVideoElement>(null)
  const path = '/media/' + name + '-walkthrough'

  useEffect(() => {
    if (!requested || !player.current) return
    player.current.focus()
    void player.current.play().catch(() => {})
  }, [requested])

  if (!available) return <article><h3>{title}</h3><p>{lead}</p>
    <a className="secondary" href={fallback}>Explore the interactive walkthrough</a>
  </article>

  return <article className="walkthrough"><h3 id={name+'-video-label'}>{title}</h3><p>{lead}</p>
    <p id={name+'-video-note'}>This clip is silent and captioned.</p>
    <div className="film-frame" data-cursor-tone="dark">
      {!requested
        ? <button className="video-activate" aria-label={'Play walkthrough: ' + title} type="button" onClick={() => request(true)}>
          <img src={path+'-poster.webp'} alt="" width="960" height="540" loading="lazy"/>
          <span>Play walkthrough</span>
        </button>
        : <video ref={player} controls preload="none" playsInline aria-labelledby={name+'-video-label'}
          aria-describedby={name+'-video-note'} poster={path+'-poster.webp'} onError={() => setFailed(true)}>
          <source src={path+'.mp4'} type="video/mp4" onError={() => setFailed(true)}/>
          <track kind="captions" src={path+'.en.vtt'} srcLang="en" label="English" default/>
        </video>}
    </div>
    {failed && <p role="status">Video playback is unavailable. <a href={fallback}>Explore the interactive walkthrough</a>.</p>}
    <details><summary>Read transcript</summary><div className="transcript">{transcript.split('\n\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div></details>
    <a href={path+'.mp4'} download>Download video</a>
  </article>
}
