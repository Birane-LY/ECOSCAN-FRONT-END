'use client'

import React, { useState } from 'react'
import { KeyRound, X } from 'lucide-react'
import { apiPost } from '@/lib/apiClient'

export function PasswordChangeModal({ onClose, onSuccess }) {
  const [ancien, setAncien] = useState('')
  const [nouveau, setNouveau] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (nouveau !== confirmation) {
      setError('La confirmation ne correspond pas au nouveau mot de passe.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await apiPost('/changer-mot-de-passe/', { ancien_mot_de_passe: ancien, nouveau_mot_de_passe: nouveau })
      onSuccess?.()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section className="admin-modal form-modal" role="dialog" aria-modal="true" aria-labelledby="pwd-title" onClick={(e) => e.stopPropagation()}>
        <div className="form-modal-head">
          <h2 id="pwd-title">Modifier le mot de passe</h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Fermer">
            <X size={18} />
          </button>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          {error && <p className="form-error span-2" role="alert">{error}</p>}
          <label className="fld span-2">
            Mot de passe actuel
            <input type="password" autoComplete="current-password" value={ancien} onChange={(e) => setAncien(e.target.value)} required />
          </label>
          <label className="fld span-2">
            Nouveau mot de passe
            <input type="password" autoComplete="new-password" value={nouveau} onChange={(e) => setNouveau(e.target.value)} required />
          </label>
          <label className="fld span-2">
            Confirmer le nouveau mot de passe
            <input type="password" autoComplete="new-password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} required />
          </label>
          <button className="primary-button span-2" type="submit" disabled={saving}>
            <KeyRound size={16} />
            {saving ? 'Modification…' : 'Modifier le mot de passe'}
          </button>
        </form>
      </section>
    </div>
  )
}
