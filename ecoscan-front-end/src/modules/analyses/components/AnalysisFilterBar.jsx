import React from 'react'
import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react'
import { ANALYSIS_FILTERS } from '../constants'

const SORT_OPTIONS = [
  { key: 'date_desc', label: 'Plus récentes' },
  { key: 'date_asc', label: 'Plus anciennes' },
  { key: 'score_desc', label: 'Meilleur score' },
]

/** Onglets métriques : chaque filtre affiche son effectif (comme les onglets de l'image 8). */
export function AnalysisFilterBar({ currentFilter, onSelectFilter, sortKey, onSelectSort, counts = {} }) {
  const cycleSort = () => {
    const idx = SORT_OPTIONS.findIndex((s) => s.key === sortKey)
    onSelectSort(SORT_OPTIONS[(idx + 1) % SORT_OPTIONS.length].key)
  }
  const current = SORT_OPTIONS.find((s) => s.key === sortKey) || SORT_OPTIONS[0]

  return (
    <div className="an-bar">
      <div className="mtabs glass" role="tablist" aria-label="Filtrer les analyses">
        {ANALYSIS_FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            role="tab"
            aria-selected={currentFilter === filter}
            className={`mtab ${currentFilter === filter ? 'on' : ''}`}
            onClick={() => onSelectFilter(filter)}
          >
            <span>{filter}</span>
            <strong>{counts[filter] ?? 0}</strong>
          </button>
        ))}
      </div>
      <button type="button" className="secondary-button" onClick={cycleSort}>
        {sortKey === 'date_asc' ? <ArrowUpAZ size={16} /> : <ArrowDownAZ size={16} />}
        {current.label}
      </button>
    </div>
  )
}
