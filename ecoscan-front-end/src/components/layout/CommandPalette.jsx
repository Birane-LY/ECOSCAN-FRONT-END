'use client'

import React from 'react'
import { ChevronRight, Database, Gauge, Search, Sparkles, Target, TrendingDown } from 'lucide-react'

const PALETTE_OPTIONS = [
  ['overview', 'Vue d’ensemble', Gauge],
  ['analyses', 'Analyses', TrendingDown],
  ['data', 'Données', Database],
  ['goals', 'Objectifs', Target],
  ['assistant', 'Ouvrir l’assistant', Sparkles],
]

export function CommandPalette({
  open,
  close,
  paletteQuery,
  setPaletteQuery,
  go,
}) {
  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={close}>
      <section
        className="command-palette"
        role="dialog"
        aria-modal="true"
        aria-label="Recherche rapide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="palette-input">
          <Search size={18} />
          <input
            autoFocus
            value={paletteQuery}
            onChange={(e) => setPaletteQuery(e.target.value)}
            placeholder="Rechercher une vue, une action..."
          />
          <kbd>ESC</kbd>
        </div>

        <p>ACCÈS RAPIDE</p>
        {PALETTE_OPTIONS.map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => {
              go(id)
              close()
            }}
          >
            <Icon size={16} />
            <span>{label}</span>
            <ChevronRight size={14} />
          </button>
        ))}
      </section>
    </div>
  )
}
