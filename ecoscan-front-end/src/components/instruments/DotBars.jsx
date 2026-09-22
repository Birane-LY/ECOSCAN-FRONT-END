import React from 'react'

/** Colonnes de points allumés depuis le bas. values : entiers 0..rows. */
export function DotBars({ values = [3, 4, 4, 6, 5, 4, 3], rows = 6, label }) {
  return (
    <div className="db" role="img" aria-label={label}>
      {values.map((v, c) => (
        <div className="db-col" key={c}>
          {Array.from({ length: rows }, (_, r) => (
            <i key={r} className={rows - r <= v ? 'on' : ''} />
          ))}
        </div>
      ))}
    </div>
  )
}
