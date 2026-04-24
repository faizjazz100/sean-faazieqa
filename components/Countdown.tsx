'use client'

import { useEffect, useState } from 'react'

const TARGET = new Date('2026-09-26T19:00:00+08:00').getTime()

function calc() {
  const diff = Math.max(0, TARGET - Date.now())
  return {
    d: Math.floor(diff / 86_400_000),
    h: Math.floor((diff % 86_400_000) / 3_600_000),
    m: Math.floor((diff % 3_600_000) / 60_000),
    s: Math.floor((diff % 60_000) / 1_000),
  }
}

export default function Countdown() {
  const [t, setT] = useState<ReturnType<typeof calc> | null>(null)

  useEffect(() => {
    setT(calc())
    const id = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(id)
  }, [])

  const cells = [
    { val: t?.d ?? null, lbl: 'Days',    pad: 3 },
    { val: t?.h ?? null, lbl: 'Hours',   pad: 2 },
    { val: t?.m ?? null, lbl: 'Minutes', pad: 2 },
    { val: t?.s ?? null, lbl: 'Seconds', pad: 2 },
  ]

  return (
    <section className="countdown">
      <div className="cd-eyebrow">Counting the days</div>
      <div className="cd-grid">
        {cells.map(({ val, lbl, pad }) => (
          <div key={lbl} className="cd-cell">
            <div className="cd-num">
              {val === null ? '—' : String(val).padStart(pad, '0')}
            </div>
            <div className="cd-lbl">{lbl}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
