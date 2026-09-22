'use client'

import React, { useMemo } from 'react'
import { monthKey } from './memoryLayout'

const MONTHS = 12

/** Frise : mémoires créées par mois sur 12 mois. Un clic filtre la constellation sur ce mois. */
export function MemoryTimeline({ memoires, value, onChange }) {
  const bins = useMemo(() => {
    const now = new Date()
    const list = Array.from({ length: MONTHS }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (MONTHS - 1 - i), 1)
      return {
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        label: d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', ''),
        long: d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
        n: 0,
      }
    })
    memoires.forEach((m) => {
      const b = list.find((x) => x.key === monthKey(m.date_creation))
      if (b) b.n += 1
    })
    return list
  }, [memoires])

  const max = Math.max(1, ...bins.map((b) => b.n))

  return (
    <div className="mt" role="group" aria-label="Frise chronologique des mémoires">
      <button type="button" className={`mt-all ${value ? '' : 'on'}`} onClick={() => onChange(null)}>
        Tout
      </button>
      <div className="mt-bars">
        {bins.map((b) => (
          <button
            key={b.key}
            type="button"
            className={`mt-col ${value === b.key ? 'on' : ''}`}
            disabled={b.n === 0}
            aria-pressed={value === b.key}
            aria-label={`${b.long} : ${b.n} mémoire${b.n > 1 ? 's' : ''}`}
            onClick={() => onChange(value === b.key ? null : b.key)}
          >
            <i style={{ height: `${Math.max(6, (b.n / max) * 100)}%` }} />
            <span>{b.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
