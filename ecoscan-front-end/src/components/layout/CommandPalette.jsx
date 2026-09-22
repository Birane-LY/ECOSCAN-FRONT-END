'use client'

import React from 'react'
import {
  BrainCircuit,
  ChevronRight,
  Database,
  Gauge,
  MessageSquareText,
  Search,
  Settings2,
  Target,
  TrendingDown,
  Wrench,
} from 'lucide-react'

const PALETTE_OPTIONS = [
  ['overview', 'Aperçu', Gauge],
  ['analyses', 'Analyses', TrendingDown],
  ['data', 'Données', Database],
  ['goals', 'Objectifs', Target],
  ['memory', 'Mémoire stratégique', BrainCircuit],
  ['assistant', 'Ouvrir l’assistant', MessageSquareText],
  ['features', 'Outils métier', Wrench],
  ['settings', 'Paramètres', Settings2],
]

export function CommandPalette({ open, close, paletteQuery, setPaletteQuery, go }) {
  if (!open) return null

  const q = paletteQuery.trim().toLowerCase()
  const results = PALETTE_OPTIONS.filter(([, label]) => label.toLowerCase().includes(q))

  const pick = (id) => {
    go(id)
    close()
  }

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
            onKeyDown={(e) => e.key === 'Enter' && results[0] && pick(results[0][0])}
            placeholder="Rechercher une vue…"
          />
          <kbd>Échap</kbd>
        </div>

        <p>Accès rapide</p>
        {results.length === 0 && <p style={{ margin: '12px' }}>Aucune vue ne correspond à « {paletteQuery} ».</p>}
        {results.map(([id, label, Icon]) => (
          <button key={id} onClick={() => pick(id)}>
            <Icon size={17} />
            <span>{label}</span>
            <ChevronRight size={14} />
          </button>
        ))}
      </section>
    </div>
  )
}
