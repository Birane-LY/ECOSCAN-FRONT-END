'use client'

import React, { useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { StatusChip } from '@/components/ui/StatusChip'
import { useTeamMembers } from '@/modules/business-tools/hooks/useTeamMembers'

export function TeamAdmin() {
  const { membres, loading, error, inviter } = useTeamMembers()
  const [email, setEmail] = useState('')
  const [nom, setNom] = useState('')
  const [role, setRole] = useState('UTILISATEUR_ORGANISATION')
  const [inviting, setInviting] = useState(false)
  const [inviteError, setInviteError] = useState(null)

  const handleInviteSubmit = async (e) => {
    e.preventDefault()
    setInviting(true)
    setInviteError(null)
    try {
      await inviter({ nom, email, role })
      setNom('')
      setEmail('')
    } catch (err) {
      setInviteError(err.message)
    } finally {
      setInviting(false)
    }
  }

  return (
    <>
      <div className="ad-head">
        <h2>Les bonnes personnes autour des bonnes décisions.</h2>
      </div>

      {loading && <p className="drawer-lead">Chargement…</p>}
      {error && <p className="drawer-lead">Erreur : {error}</p>}

      <div className="ad-list">
        {membres.map((m) => (
          <div className="ad-row" key={m.id}>
            <span className="ad-avatar">{m.nom.split(' ').map((x) => x[0]).join('').slice(0, 2).toUpperCase()}</span>
            <div>
              <strong>{m.nom}</strong>
              <small>{m.role}</small>
            </div>
            <StatusChip status={m.actif ? 'Actif' : 'Invitation en attente'} />
            <button className="icon-button" aria-label={`Actions pour ${m.nom}`}>
              <MoreHorizontal size={16} />
            </button>
          </div>
        ))}
      </div>

      <form className="ad-invite" onSubmit={handleInviteSubmit}>
        <h3>Inviter un membre</h3>
        {inviteError && <p className="form-error">{inviteError}</p>}
        <div>
          <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom complet" aria-label="Nom complet" required />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@entreprise.com" aria-label="Adresse e-mail" type="email" required />
          <select value={role} onChange={(e) => setRole(e.target.value)} aria-label="Rôle">
            <option value="UTILISATEUR_ORGANISATION">Opérations</option>
            <option value="CONSULTANT">Lecture seule</option>
          </select>
          <button className="primary-button" type="submit" disabled={inviting}>
            {inviting ? '…' : 'Envoyer'}
          </button>
        </div>
      </form>
    </>
  )
}
