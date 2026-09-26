'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { apiGet, apiPost } from '@/lib/apiClient'

const unwrap = (r) => (Array.isArray(r) ? r : r?.results ?? [])
const STATUTS = { A_FAIRE: 'À faire', EN_COURS: 'En cours', TERMINEE: 'Terminée', ANNULEE: 'Annulée' }

/**
 * Actions terrain d'une recommandation : ajout, démarrage, clôture, puis mesure de
 * l'impact RÉEL (FCFA, saisi par une personne). La mesure met à jour la mémoire
 * stratégique et l'assistant.
 */
export function RecommendationActions({ recommandationId, onChanged }) {
  const [state, setState] = useState({ loading: true, actions: [] })
  const [titre, setTitre] = useState('')
  const [impact, setImpact] = useState({})
  const [busy, setBusy] = useState(null)
  const [message, setMessage] = useState(null)

  const reload = useCallback(async () => {
    try {
      const actions = unwrap(await apiGet(`/analyses/actions/?recommandation=${recommandationId}`))
      setState({ loading: false, actions })
    } catch (err) {
      setState({ loading: false, actions: [] })
      setMessage(err.message)
    }
  }, [recommandationId])

  useEffect(() => { reload() }, [reload])

  const executer = async (cle, requete) => {
    setBusy(cle)
    setMessage(null)
    try {
      await requete()
      await reload()
      onChanged?.()
    } catch (err) {
      setMessage(err.message)
    } finally {
      setBusy(null)
    }
  }

  const ajouter = (e) => {
    e.preventDefault()
    if (!titre.trim()) return
    executer('nouvelle', async () => {
      await apiPost('/analyses/actions/', { recommandation: recommandationId, titre: titre.trim(), description: '' })
      setTitre('')
    })
  }

  return (
    <div className="gl-actions" style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
      {message && <p className="form-error">{message}</p>}
      {state.loading && <p className="drawer-lead">Chargement…</p>}
      {!state.loading && state.actions.length === 0 && (
        <p className="drawer-lead">Aucune action. Ajoutez la première étape concrète à mener.</p>
      )}

      {state.actions.map((a) => (
        <div key={a.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <strong style={{ fontSize: 12 }}>{a.titre}</strong>
            <span className="chip">{STATUTS[a.statut] || a.statut}</span>
            {a.statut === 'A_FAIRE' && (
              <button className="quiet-button" disabled={busy === a.id} onClick={() => executer(a.id, () => apiPost(`/analyses/actions/${a.id}/suivre/`))}>
                Démarrer
              </button>
            )}
            {a.statut === 'EN_COURS' && (
              <button className="quiet-button" disabled={busy === a.id} onClick={() => executer(a.id, () => apiPost(`/analyses/actions/${a.id}/cloturer/`))}>
                Clôturer
              </button>
            )}
          </div>

          {a.statut === 'TERMINEE' && a.economie_realisee_fcfa == null && (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="number" min="0" step="any" placeholder="Économie réelle (FCFA)"
                value={impact[a.id] ?? ''} aria-label="Économie réellement constatée en FCFA"
                onChange={(e) => setImpact((v) => ({ ...v, [a.id]: e.target.value }))}
              />
              <button
                className="secondary-button"
                disabled={busy === a.id || !impact[a.id]}
                onClick={() => executer(a.id, () => apiPost(`/analyses/actions/${a.id}/mesurer-impact/`, { economie_realisee_fcfa: impact[a.id] }))}
              >
                Enregistrer l’impact
              </button>
            </div>
          )}

          {a.economie_realisee_fcfa != null && (
            <small>
              Impact mesuré : {Number(a.economie_realisee_fcfa).toLocaleString('fr-FR')} FCFA
              {a.taux_realisation_impact != null && ` — ${a.taux_realisation_impact} % de l’impact attendu`}
            </small>
          )}
        </div>
      ))}

      <form onSubmit={ajouter} style={{ display: 'flex', gap: 6 }}>
        <input value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Nouvelle action à mener…" aria-label="Titre de la nouvelle action" style={{ flex: 1 }} />
        <button className="secondary-button" type="submit" disabled={busy === 'nouvelle' || !titre.trim()}>
          Ajouter
        </button>
      </form>
    </div>
  )
}
