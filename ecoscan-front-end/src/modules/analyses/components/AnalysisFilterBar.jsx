import React from 'react'
import { ChevronDown } from 'lucide-react'
import { ANALYSIS_FILTERS } from '../constants'

export function AnalysisFilterBar({ currentFilter, onSelectFilter }) {
  return (
    <div className="view-toolbar">
      <div className="segmented">
        {ANALYSIS_FILTERS.map((filter) => (
          <button
            key={filter}
            className={currentFilter === filter ? 'selected' : ''}
            onClick={() => onSelectFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
      <button className="quiet-button">
        Trier par <ChevronDown size={14} />
      </button>
    </div>
  )
}
