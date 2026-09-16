import React from 'react'
import { Activity, ArrowUpRight } from 'lucide-react'
import { StatusChip } from '@/components/ui'

export function AnalysisCard({ analysis, onClick }) {
  const { title, type, status, date, score } = analysis

  return (
    <button className="analysis-card" onClick={onClick}>
      <div className="analysis-top">
        <span className="file-icon">
          <Activity size={17} />
        </span>
        <StatusChip status={status} />
      </div>
      <strong>{title}</strong>
      <span className="analysis-meta">
        {type} · {date}
      </span>
      <div className="analysis-bottom">
        <span>Score de confiance</span>
        <b>
          {score}
          <small>/100</small>
        </b>
        <ArrowUpRight size={15} />
      </div>
    </button>
  )
}
