import React, { useId, useMemo } from 'react'

const CX = 110
const CY = 112
const rad = (d) => (d * Math.PI) / 180
const pt = (r, deg) => [CX + r * Math.cos(rad(deg)), CY + r * Math.sin(rad(deg))]

/** Jauge en demi-cercle à graduations. value : 0–100. animate : trace l'arc au montage. */
export function ArcGauge({ value = 0, unit = '%', label, size = 220, animate = false }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const v = Math.max(0, Math.min(100, Number(value) || 0))

  const ticks = useMemo(
    () =>
      Array.from({ length: 41 }, (_, i) => {
        const a = 180 + (180 * i) / 40
        const major = i % 10 === 0
        const [x1, y1] = pt(major ? 94 : 98, a)
        const [x2, y2] = pt(105, a)
        return { i, x1, y1, x2, y2, major, on: i * 2.5 <= v }
      }),
    [v],
  )

  return (
    <div className="ag" style={{ width: size, maxWidth: '100%' }}>
      <svg viewBox="0 0 220 130" role="img" aria-label={`${v} ${unit}`}>
        <defs>
          <linearGradient id={`${uid}-g`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" className="core-arc-a" />
            <stop offset="100%" className="core-arc-b" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <line key={t.i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} className={`ag-tick ${t.major ? 'major' : ''} ${t.on ? 'on' : ''}`} />
        ))}
        <path d="M 26 112 A 84 84 0 0 1 194 112" className="ag-track" />
        <path
          d="M 26 112 A 84 84 0 0 1 194 112"
          pathLength="100"
          className={`ag-arc ${animate ? 'anim' : ''}`}
          stroke={`url(#${uid}-g)`}
          style={{ '--v': v }}
        />
      </svg>
      <div className="ag-val">
        <strong>
          {v}
          <small>{unit}</small>
        </strong>
        {label && <span>{label}</span>}
      </div>
    </div>
  )
}
