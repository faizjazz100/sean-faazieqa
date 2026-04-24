'use client'

import { useEffect, useRef, useState } from 'react'

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [started, setStarted] = useState(false)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const audio = new Audio('/music/background.mp3')
    audio.loop = true
    audio.volume = 0.35
    audioRef.current = audio

    // Try autoplay immediately
    audio.play().then(() => {
      setStarted(true)
    }).catch(() => {
      // Browser blocked autoplay — start on first user interaction
      const unlock = () => {
        audio.play().then(() => {
          setStarted(true)
        }).catch(() => {})
        document.removeEventListener('click', unlock)
        document.removeEventListener('touchstart', unlock)
        document.removeEventListener('keydown', unlock)
        document.removeEventListener('scroll', unlock)
      }
      document.addEventListener('click', unlock, { once: true })
      document.addEventListener('touchstart', unlock, { once: true })
      document.addEventListener('keydown', unlock, { once: true })
      document.addEventListener('scroll', unlock, { once: true })
    })

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  function handleClick() {
    const audio = audioRef.current
    if (!audio) return

    if (!started) {
      audio.play().then(() => setStarted(true)).catch(() => {})
      return
    }

    audio.muted = !audio.muted
    setMuted(audio.muted)
  }

  return (
    <button
      onClick={handleClick}
      className="audio-btn"
      aria-label={!started ? 'Play music' : muted ? 'Unmute music' : 'Mute music'}
    >
      {!started ? (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      ) : muted ? (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
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
  )
}
