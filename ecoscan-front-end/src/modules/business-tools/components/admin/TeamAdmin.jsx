'use client'

import React, { useState } from 'react'
import { MoreHorizontal, Plus } from 'lucide-react'
import { useTeamMembers } from '@/modules/business-tools/hooks/useTeamMembers'

export function TeamAdmin({ setDrawer }) {
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
      setNom(''); setEmail('')
    } catch (err) {
      setInviteError(err.message)
    } finally {
      setInviting(false)
    }
  }

  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="eyebrow">ÉQUIPE & RÔLES</p>
          <h2>Les bonnes personnes autour des bonnes décisions.</h2>
        </div>
      </div>

      {loading && <p className="drawer-lead">Chargement…</p>}
      {error && <p className="drawer-lead">Erreur : {error}</p>}

      <div className="member-list">
        {membres.map((m) => (
          <div className="member-row" key={m.id}>
            <div className="profile-avatar">{m.nom.split(' ').map((x) => x[0]).join('').toUpperCase()}</div>
            <span>
              <strong>{m.nom}</strong>
              <small>{m.role}</small>
            </span>
            <span className={`status-chip ${m.actif ? 'ready' : ''}`}>{m.actif ? 'Actif' : 'Invitation en attente'}</span>
            <button className="icon-button"><MoreHorizontal size={16} /></button>
          </div>
        ))}
      </div>

      <form className="invite-form" onSubmit={handleInviteSubmit}>
        <p className="eyebrow">INVITATION RAPIDE</p>
        {inviteError && <p style={{ color: 'var(--copper)', fontSize: 11 }}>{inviteError}</p>}
        <div>
          <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom complet" required />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@entreprise.com" type="email" required />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="UTILISATEUR_ORGANISATION">Opérations</option>
            <option value="CONSULTANT">Lecture seule</option>
          </select>
          <button className="secondary-button" type="submit" disabled={inviting}>
            {inviting ? '…' : 'Envoyer'}
          </button>
        </div>
      </form>
    </>
  )
}