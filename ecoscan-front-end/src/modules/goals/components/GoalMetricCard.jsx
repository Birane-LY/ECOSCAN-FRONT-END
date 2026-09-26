'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { apiPatch, apiPost } from '@/lib/apiClient'
import { BigNumber, GlassCard, TickProgress } from '@/components/instruments'
import { useRecommandationsParObjectif } from '@/modules/goals/hooks/useRecommandationsParObjectif'
import { RecommendationActions } from '@/modules/goals/components/RecommendationActions'

const FIABILITE = { moyenne: 'fiabilité moyenne', faible: 'fiabilité faible' }
const SOURCE = { factures: 'factures', woyofal: 'relevés Woyofal' }
const fmt = (v) => Number(v).toLocaleString('fr-FR', { maximumFractionDigits: 2 })

export function GoalMetricCard({ objectif, mesure, onChanged }) {
  const [expanded, setExpanded] = useState(false)
  const { recommandations, loading, error } = useRecommandationsParObjectif(expanded ? objectif.id : null)
  const [decidingId, setDecidingId] = useState(null)
  const [actionsOuvertes, setActionsOuvertes] = useState(null)
  const [activation, setActivation] = useState(false)

  const value = objectif.valeur_cible
    ? Math.min(100, Math.round((objectif.progression_actuelle / objectif.valeur_cible) * 100))
    : 0

  const handleDecider = async (id) => {
    setDecidingId(id)
    try {
      await apiPost(`/analyses/recommandations/${id}/marquer-comme-decidee/`)
      onChanged?.() // la progression déclarée vient de changer côté back
    } catch (err) {
      console.error('Décision impossible :', err)
    } finally {
      setDecidingId(null)
    }
  }

  // Un objectif naît en BROUILLON et n'était activable nulle part : rien n'était suivi ni mesuré.
  const handleActiver = async () => {
    setActivation(true)
    try {
      await apiPatch(`/energies/objectifs/${objectif.id}/`, { statut: 'ACTIF' })
      onChanged?.()
    } catch (err) {
      console.error('Activation impossible :', err)
    } finally {
      setActivation(false)
    }
  }

  return (
    <GlassCard as="article" className="gl-card">
      <h3>{objectif.nom}</h3>
      {objectif.statut === 'BROUILLON' && (
        <div>
          <span className="chip">Brouillon</span>{' '}
          <button className="secondary-button" disabled={activation} onClick={handleActiver}>
            {activation ? '…' : 'Activer l’objectif'}
          </button>
        </div>
      )}
      <BigNumber value={String(value)} unit="%" />
      <TickProgress value={value} ticks={26} label={`Progression déclarée : ${objectif.nom}`} />
      <small className="gl-meta">
        Déclarée : {fmt(objectif.progression_actuelle)} {objectif.unite} sur une cible de {fmt(objectif.valeur_cible)} {objectif.unite}
        {' '}(économies estimées des recommandations décidées)
      </small>

      {/* Progression MESURÉE : calculée sur les données réelles, jamais mélangée à la déclarée */}
      {mesure && (
        <small className="gl-meta" style={{ display: 'block', marginTop: 6 }}>
          {mesure.mesuree != null ? (
            <>
              Mesurée : {fmt(mesure.mesuree)} {objectif.unite}
              {' '}({SOURCE[mesure.source] || mesure.source}, {FIABILITE[mesure.fiabilite] || mesure.fiabilite}). {mesure.detail}
            </>
          ) : (
            <>Mesure indisponible : {mesure.raison}</>
          )}
        </small>
      )}

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
            <p className="drawer-lead">
              Aucune recommandation liée à cet objectif. Confirmez une hypothèse dans Analyses pour en créer une.
            </p>
          )}
          {recommandations.map((r) => (
            <div key={r.id} className="gl-reco">
              <div>
                <strong>{r.titre}</strong>
                <small>{r.description}</small>
                <span className="chip">{r.statut}</span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {r.statut !== 'DECIDEE' && (
                  <button className="secondary-button" disabled={decidingId === r.id} onClick={() => handleDecider(r.id)}>
                    {decidingId === r.id ? '…' : 'Marquer comme décidée'}
                  </button>
                )}
                <button className="quiet-button" onClick={() => setActionsOuvertes((cur) => (cur === r.id ? null : r.id))}>
                  {actionsOuvertes === r.id ? 'Masquer les actions' : 'Actions'}
                </button>
              </div>
              {actionsOuvertes === r.id && <RecommendationActions recommandationId={r.id} onChanged={onChanged} />}
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  )
}
