import React from 'react'
import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react'
import { ANALYSIS_FILTERS } from '../constants'

const SORT_OPTIONS = [
  { key: 'date_desc', label: 'Plus récentes' },
  { key: 'date_asc', label: 'Plus anciennes' },
  { key: 'score_desc', label: 'Meilleur score' },
]

export function AnalysisFilterBar({ currentFilter, onSelectFilter, sortKey, onSelectSort }) {
  const cycleSort = () => {
    const idx = SORT_OPTIONS.findIndex((s) => s.key === sortKey)
    onSelectSort(SORT_OPTIONS[(idx + 1) % SORT_OPTIONS.length].key)
  }
  const current = SORT_OPTIONS.find((s) => s.key === sortKey) || SORT_OPTIONS[0]

  return (
    <div className="view-toolbar">
      <div className="segmented">
        {ANALYSIS_FILTERS.map((filter) => (
          <button key={filter} className={currentFilter === filter ? 'selected' : ''} onClick={() => onSelectFilter(filter)}>
            {filter}
          </button>
        ))}
      </div>
      <button className="quiet-button" onClick={cycleSort}>
        {sortKey === 'date_asc' ? <ArrowUpAZ size={14} /> : <ArrowDownAZ size={14} />}
        Trier : {current.label}
      </button>
    </div>
  )
}