import React from 'react'

/** Barre de progression segmentée (graduations). value : 0–100. */
export function TickProgress({ value = 0, ticks = 30, label }) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0))
  const lit = Math.round((pct / 100) * ticks)
  return (
    <div
      className="tp"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      {Array.from({ length: ticks }, (_, i) => (
        <i key={i} className={i < lit ? (i === lit - 1 ? 'on edge' : 'on') : ''} />
      ))}
    </div>
  )
}
