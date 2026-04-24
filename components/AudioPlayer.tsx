'use client'

import { useEffect, useRef, useState } from 'react'

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.35
    audio.loop = true
  }, [])

  function handleClick() {
    const audio = audioRef.current
    if (!audio) return

    if (!started) {
      audio.play().then(() => {
        setStarted(true)
        setPlaying(true)
      }).catch(() => {})
      return
    }

    if (playing) {
      audio.muted = !audio.muted
      setMuted(audio.muted)
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/music/background.mp3" preload="none" />
      <button
        onClick={handleClick}
        className="audio-btn"
        aria-label={!started ? 'Play music' : muted ? 'Unmute music' : 'Mute music'}
        title={!started ? 'Play music' : muted ? 'Unmute music' : 'Mute music'}
      >
        {!started ? (
          /* Music note — invite to play */
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        ) : muted ? (
          /* Speaker off */
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          /* Speaker on */
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
        <span className="audio-btn-label">
          {!started ? 'Music' : muted ? 'Unmute' : 'Music'}
        </span>
      </button>
    </>
  )
}
