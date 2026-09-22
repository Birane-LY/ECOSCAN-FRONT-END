import React from 'react'
import { ArrowUpRight, Check, ChevronRight, Zap } from 'lucide-react'
import { GlassCard, TickProgress } from '@/components/instruments'
import { SEED_DECISIONS } from '../constants'

// Accepte à la fois les décisions de démonstration (title/scope/value)
// et les objectifs renvoyés par l'API (nom/description/valeur_cible/unite).
function normalize(item) {
  return {
    title: item.title ?? item.nom ?? 'Sans titre',
    scope: item.scope ?? item.description ?? (item.type ? String(item.type).toLowerCase().replace(/_/g, ' ') : ''),
    impact: item.impact,
    tagColor: item.tagColor,
    value: item.value ?? (item.valeur_cible != null ? `${item.valeur_cible} ${item.unite ?? ''}`.trim() : null),
    valueLabel: item.value ? 'impact estimé' : 'cible',
  }
}

export function DecisionActions({
  decisions = SEED_DECISIONS,
  completed = [],
  streakDays = 4,
  onToggleCompleted,
  onOpenDrawer,
}) {
  const list = (Array.isArray(decisions) ? decisions : []).map(normalize)
  const safeCompleted = Array.isArray(completed) ? completed : []
  const pct = list.length ? Math.round((safeCompleted.length / list.length) * 100) : 0

  return (
    <GlassCard as="section" className="decisions">
      <div className="panel-top">
        <h2>Vos prochaines décisions</h2>
        <button className="quiet-button" onClick={() => onOpenDrawer?.('all-actions')}>
          Voir tout <ArrowUpRight size={15} />
        </button>
      </div>

      {list.length === 0 && (
        <p className="dec-empty">Aucune décision à prendre. Créez un objectif ou importez des données pour en générer.</p>
      )}

      {list.map((item, i) => {
        const done = safeCompleted.includes(i)
        return (
          <div className={`dec-row ${done ? 'done' : ''}`} key={`${item.title}-${i}`}>
            <button
              type="button"
              className="dec-check"
              aria-pressed={done}
              aria-label={`${done ? 'Rouvrir' : 'Terminer'} : ${item.title}`}
              onClick={() => onToggleCompleted?.(i)}
            >
              {done && <Check size={15} />}
            </button>
            <div className="dec-copy" onClick={() => onOpenDrawer?.(item.title)}>
              <strong>{item.title}</strong>
              {item.scope && <span>{item.scope}</span>}
            </div>
            {item.impact && <span className="chip">{item.impact}</span>}
            {item.value && (
              <div className="dec-value">
                <strong>{item.value}</strong>
                <small>{item.valueLabel}</small>
              </div>
            )}
            <ChevronRight size={17} color="var(--ink-3)" />
          </div>
        )
      })}

      <div className="dec-foot">
        <TickProgress value={pct} ticks={22} label="Décisions prises" />
        <div>
          <strong>
            {safeCompleted.length} décision{safeCompleted.length > 1 ? 's' : ''} prise{safeCompleted.length > 1 ? 's' : ''}
          </strong>
          <small>{pct} % de la liste</small>
        </div>
        <span className="chip chip-lime">
          <Zap size={13} /> Série de {streakDays} jours
        </span>
      </div>
    </GlassCard>
  )
}
