import React from 'react'
import { ArrowUpRight, Check, ChevronRight, Zap } from 'lucide-react'
import { SEED_DECISIONS } from '../constants'

export function DecisionActions({ 
  decisions = SEED_DECISIONS, 
  completed = [], 
  streakDays = 4,
  onToggleCompleted, 
  onOpenDrawer 
}) {
  const safeCompleted = Array.isArray(completed) ? completed : []
  const total = decisions.length || 1
  const percentage = Math.round((safeCompleted.length / total) * 100)

  return (
    <div className="actions-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">À FAIRE MAINTENANT</p>
          <h2>Vos prochaines décisions</h2>
        </div>
        <button className="quiet-button" onClick={() => onOpenDrawer?.('all-actions')}>
          Voir tout <ArrowUpRight size={14} />
        </button>
      </div>

      {decisions.map((item, i) => {
        const isDone = safeCompleted.includes(i)
        return (
          <div className={`action-row ${isDone ? 'done' : ''}`} key={item.title || i}>
            <button
              className="check-button"
              onClick={() => onToggleCompleted?.(i)}
              aria-label={`Terminer ${item.title}`}
            >
              {isDone ? <Check size={15} /> : <span />}
            </button>
            <div className="action-copy" onClick={() => onOpenDrawer?.(item.title)}>
              <strong>{item.title}</strong>
              <span>{item.scope}</span>
            </div>
            {item.impact && <span className={`impact-tag ${item.tagColor || ''}`}>{item.impact}</span>}
            {item.value && (
              <div className="action-value">
                <strong>{item.value}</strong>
                <span>impact estimé</span>
              </div>
            )}
            <ChevronRight size={16} />
          </div>
        )
      })}

      <div className="progress-footer">
        <div className="progress-ring">
          <strong>{percentage}%</strong>
        </div>
        <div>
          <strong>
            {safeCompleted.length} décision{safeCompleted.length > 1 ? 's' : ''} prise{safeCompleted.length > 1 ? 's' : ''}
          </strong>
          <span>Chaque action compte. Continuez votre élan.</span>
        </div>
        <span className="streak-label">
          <Zap size={13} /> Série de {streakDays} jours
        </span>
      </div>
    </div>
  )
}