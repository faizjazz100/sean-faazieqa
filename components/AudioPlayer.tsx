'use client'

import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

const VIDEO_ID = 'FoCG-WNsZio'

export default function AudioPlayer() {
  const playerRef = useRef<any>(null)
  const [muted, setMuted] = useState(true)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    function initPlayer() {
      playerRef.current = new window.YT.Player('yt-player', {
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 1,
          mute: 1,
          loop: 1,
          playlist: VIDEO_ID,
          controls: 0,
          rel: 0,
          iv_load_policy: 3,
          disablekb: 1,
        },
        events: {
          onReady: () => setReady(true),
        },
      })
    }

    if (window.YT && window.YT.Player) {
      initPlayer()
    } else {
      window.onYouTubeIframeAPIReady = initPlayer
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(tag)
      }
    }
  }, [])

  function toggleMute() {
    const player = playerRef.current
    if (!player) return
    if (muted) {
      player.unMute()
      player.setVolume(40)
      setMuted(false)
    } else {
      player.mute()
      setMuted(true)
    }
  }

  return (
    <>
      {/* Hidden YouTube player */}
      <div style={{ position: 'fixed', top: -9999, left: -9999, width: 1, height: 1, pointerEvents: 'none' }}>
        <div id="yt-player" />
      </div>

      {/* Mute/unmute button */}
      <button
        onClick={toggleMute}
        className={`audio-btn${!ready ? ' audio-btn-loading' : ''}`}
        disabled={!ready}
        aria-label={muted ? 'Unmute music' : 'Mute music'}
      >
        {muted ? (
          <>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
            <span className="audio-btn-label">Unmute</span>
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
            <span className="audio-btn-label">Music</span>
          </>
        )}
      </button>
    </>
  )
}
