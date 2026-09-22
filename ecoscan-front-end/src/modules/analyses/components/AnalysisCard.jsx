import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { ArcGauge } from '@/components/instruments'
import { StatusChip } from '@/components/ui/StatusChip'

export function AnalysisCard({ analysis, onClick }) {
  const { title, type, status, date, score } = analysis

  return (
    <button type="button" className="an-card glass" onClick={onClick}>
      <div className="an-top">
        <StatusChip status={status} />
        <span className="hc-arrow" aria-hidden="true">
          <ArrowUpRight size={14} />
        </span>
      </div>
      <strong className="an-title">{title}</strong>
      <span className="an-meta">
        {type}, {date}
      </span>
      <div className="an-gauge">
        <ArcGauge value={score} unit="/100" label="Score de confiance" size={200} />
      </div>
    </button>
  )
}
