'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { apiPost } from '@/lib/apiClient'
import { BigNumber, GlassCard, TickProgress } from '@/components/instruments'
import { useRecommandationsParObjectif } from '@/modules/goals/hooks/useRecommandationsParObjectif'

export function GoalMetricCard({ objectif, onChanged }) {
  const [expanded, setExpanded] = useState(false)
  const { recommandations, loading, error } = useRecommandationsParObjectif(expanded ? objectif.id : null)
  const [decidingId, setDecidingId] = useState(null)

  const value = objectif.valeur_cible
    ? Math.min(100, Math.round((objectif.progression_actuelle / objectif.valeur_cible) * 100))
    : 0

  const handleDecider = async (id) => {
    setDecidingId(id)
    try {
      await apiPost(`/analyses/recommandations/${id}/marquer-comme-decidee/`)
      onChanged?.() // la progression vient de changer côté back
    } finally {
      setDecidingId(null)
    }
  }

  return (
    <GlassCard as="article" className="gl-card">
      <h3>{objectif.nom}</h3>
      <BigNumber value={String(value)} unit="%" />
      <TickProgress value={value} ticks={26} label={`Progression : ${objectif.nom}`} />
      <small className="gl-meta">
        {objectif.progression_actuelle} {objectif.unite} sur une cible de {objectif.valeur_cible} {objectif.unite}
      </small>

      <button className="quiet-button gl-toggle" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}>
        {expanded ? (
          <>
            Masquer les recommandations <ChevronUp size={14} />
          </>
        ) : (
          <>
            Voir les recommandations liées <ChevronDown size={14} />
          </>
        )}
      </button>

      {expanded && (
        <div className="gl-recos">
          {loading && <p className="drawer-lead">Chargement…</p>}
          {error && <p className="drawer-lead">Erreur : {error}</p>}
          {!loading && !error && recommandations.length === 0 && (
            <p className="drawer-lead">Aucune recommandation liée à cet objectif pour le moment.</p>
          )}
          {recommandations.map((r) => (
            <div key={r.id} className="gl-reco">
              <div>
                <strong>{r.titre}</strong>
                <small>{r.description}</small>
                <span className="chip">{r.statut}</span>
              </div>
              {r.statut !== 'DECIDEE' && (
                <button className="secondary-button" disabled={decidingId === r.id} onClick={() => handleDecider(r.id)}>
                  {decidingId === r.id ? '…' : 'Suivre'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  )
}
