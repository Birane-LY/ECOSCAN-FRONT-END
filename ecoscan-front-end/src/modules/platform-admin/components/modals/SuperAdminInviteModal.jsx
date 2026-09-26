'use client'

import React, { useState } from 'react'
import { Mail } from 'lucide-react'

export function SuperAdminInviteModal({ onSubmit, onClose }) {
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit({ nom: nom.trim(), email: email.trim() })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label className="fld span-2">
        Nom complet
        <input
          autoComplete="name"
          required
          value={nom}
          onChange={(event) => setNom(event.target.value)}
          placeholder="Nom du membre"
        />
      </label>
      <label className="fld span-2">
        Adresse e-mail
        <input
          autoComplete="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="membre@ecoscan.sn"
        />
      </label>
      <p className="span-2 drawer-lead">
        Un lien d’activation sera envoyé par e-mail. Le rôle Super Admin sera attribué automatiquement.
      </p>
      <div className="span-2 adm-actions">
        <button className="secondary-button" type="button" onClick={onClose} disabled={submitting}>
          Annuler
        </button>
        <button className="primary-button" type="submit" disabled={submitting}>
          <Mail size={16} />
          {submitting ? 'Envoi…' : 'Envoyer l’invitation'}
        </button>
      </div>
    </form>
  )
}
