'use client'

import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { apiGet, apiPost } from '@/lib/apiClient'

const unwrap = (r) => (Array.isArray(r) ? r : r?.results ?? [])

/**
 * Création d'une recommandation à partir d'une anomalie dont l'hypothèse est
 * confirmée. Toutes les valeurs sont saisies par vous : EcoScan ne calcule ni
 * n'invente le chiffre d'économie.
 */
export function CreateRecommendationModal({ anomalie, onClose, onCreated }) {
  const [objectifs, setObjectifs] = useState([])
  const [objectif, setObjectif] = useState('')
  const [titre, setTitre] = useState(
    anomalie?.type === 'consumption_drop' ? 'Comprendre la baisse de consommation' : 'Réduire la hausse de consommation',
  )
  const [description, setDescription] = useState((anomalie?.hypothese?.texte || '').slice(0, 500))
  const [economie, setEconomie] = useState('')
  const [unite, setUnite] = useState('kWh')
  const [uniteModifiee, setUniteModifiee] = useState(false)
  const [priorite, setPriorite] = useState('MOYENNE')
  const [echeance, setEcheance] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    apiGet('/energies/objectifs/')
      .then((r) => {
        const liste = unwrap(r)
        setObjectifs(liste)
        const defaut = liste.find((o) => o.statut === 'ACTIF') || liste[0]
        if (defaut) {
          setObjectif(defaut.id)
          setUnite(defaut.unite || 'kWh')
        }
      })
      .catch((err) => setError(err.message))
  }, [])

  const changerObjectif = (id) => {
    setObjectif(id)
    const o = objectifs.find((x) => String(x.id) === String(id))
    // Même unité que l'objectif : c'est ce qui permet de faire avancer sa progression
    if (o && !uniteModifiee) setUnite(o.unite || 'kWh')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await apiPost(`/analyses/anomalies/${anomalie.id}/creer-recommandation/`, {
        objectif,
        titre,
        description,
        economie_estimee: economie,
        unite,
        priorite,
        ...(echeance ? { date_echeance: echeance } : {}),
      })
      onCreated?.()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section className="admin-modal form-modal" role="dialog" aria-modal="true" aria-labelledby="reco-title" onClick={(e) => e.stopPropagation()}>
        <div className="form-modal-head">
          <h2 id="reco-title">Nouvelle recommandation</h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Fermer">
            <X size={18} />
          </button>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          {error && <p className="form-error">{error}</p>}
          {objectifs.length === 0 && !error && (
            <p className="drawer-lead span-2">Créez d’abord un objectif : une recommandation contribue toujours à un objectif.</p>
          )}
          <label className="fld span-2">
            Objectif visé
            <select value={objectif} onChange={(e) => changerObjectif(e.target.value)} required>
              {objectifs.map((o) => (
                <option key={o.id} value={o.id}>{o.nom}</option>
              ))}
            </select>
          </label>
          <label className="fld span-2">
            Titre
            <input value={titre} onChange={(e) => setTitre(e.target.value)} required maxLength={180} />
          </label>
          <label className="fld span-2">
            Description
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required />
          </label>
          <label className="fld">
            Économie estimée
            <input type="number" min="0" step="any" value={economie} onChange={(e) => setEconomie(e.target.value)} required />
          </label>
          <label className="fld">
            Unité
            <input value={unite} onChange={(e) => { setUnite(e.target.value); setUniteModifiee(true) }} required maxLength={30} />
          </label>
          <label className="fld">
            Priorité
            <select value={priorite} onChange={(e) => setPriorite(e.target.value)}>
              <option value="BASSE">Basse</option>
              <option value="MOYENNE">Moyenne</option>
              <option value="HAUTE">Haute</option>
              <option value="CRITIQUE">Critique</option>
            </select>
          </label>
          <label className="fld">
            Échéance (facultatif)
            <input type="date" value={echeance} onChange={(e) => setEcheance(e.target.value)} />
          </label>
          <p className="drawer-lead span-2">
            L’économie est une estimation que vous fixez : EcoScan ne la calcule pas. Exprimée en FCFA, elle alimente aussi
            l’impact attendu de la mémoire stratégique.
          </p>
          <button className="primary-button span-2" type="submit" disabled={saving || !objectif}>
            {saving ? 'Création…' : 'Créer la recommandation'}
          </button>
        </form>
      </section>
    </div>
  )
}
