'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'
import { apiPost } from '@/lib/apiClient'
import { useOrganisation } from '@/modules/business-tools/hooks/useOrganisation'

export function CreateGoalModal({ onClose, onCreated }) {
  const { organisation } = useOrganisation()
  const [nom, setNom] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('REDUCTION_CONSOMMATION')
  const [valeurCible, setValeurCible] = useState('')
  const [unite, setUnite] = useState('kWh')
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!organisation) {
      setError('Aucune organisation associée à votre compte.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await apiPost('/energies/objectifs/', {
        organisation: organisation.id,
        nom,
        description,
        type,
        valeur_cible: Number(valeurCible),
        unite,
        date_debut: dateDebut || null,
        date_fin: dateFin || null,
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
      <section className="admin-modal form-modal" role="dialog" aria-modal="true" aria-labelledby="goal-title" onClick={(e) => e.stopPropagation()}>
        <div className="form-modal-head">
          <h2 id="goal-title">Nouvel objectif</h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Fermer">
            <X size={18} />
          </button>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          {error && <p className="form-error">{error}</p>}
          <label className="fld span-2">
            Nom
            <input value={nom} onChange={(e) => setNom(e.target.value)} required placeholder="Ex. Réduire la facture de 15 % en 2026" />
          </label>
          <label className="fld span-2">
            Description
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </label>
          <label className="fld span-2">
            Type
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="REDUCTION_CONSOMMATION">Réduction de consommation</option>
              <option value="REDUCTION_COUT">Réduction de coût</option>
              <option value="REDUCTION_EMISSIONS">Réduction d'émissions</option>
            </select>
          </label>
          <label className="fld">
            Cible
            <input type="number" value={valeurCible} onChange={(e) => setValeurCible(e.target.value)} required />
          </label>
          <label className="fld">
            Unité
            <input value={unite} onChange={(e) => setUnite(e.target.value)} required />
          </label>
          <label className="fld">
            Date de début
            <input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} />
          </label>
          <label className="fld">
            Date de fin
            <input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} />
          </label>
          <button className="primary-button span-2" type="submit" disabled={saving}>
            {saving ? 'Création…' : "Créer l'objectif"}
          </button>
        </form>
      </section>
    </div>
  )
}
