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
      await apiPost('/changer-mot-de-passe/', {
        ancien_mot_de_passe: ancien,
        nouveau_mot_de_passe: nouveau,
      })
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
      <section className="admin-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <small>SÉCURITÉ</small>
            <h2>Modifier le mot de passe</h2>
          </div>
          <button onClick={onClose} aria-label="Fermer"><X /></button>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          {error && <p style={{ color: 'var(--copper)', fontSize: 11 }}>{error}</p>}
          <label>
            Mot de passe actuel
            <input type="password" value={ancien} onChange={(e) => setAncien(e.target.value)} required />
          </label>
          <label>
            Nouveau mot de passe
            <input type="password" value={nouveau} onChange={(e) => setNouveau(e.target.value)} required />
          </label>
          <label>
            Confirmer le nouveau mot de passe
            <input type="password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} required />
          </label>
          <button className="primary-button" type="submit" disabled={saving}>
            <KeyRound size={15} />{saving ? 'Modification…' : 'Modifier le mot de passe'}
          </button>
        </form>
      </section>
    </div>
  )
}