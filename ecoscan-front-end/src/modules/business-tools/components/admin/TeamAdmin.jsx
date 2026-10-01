'use client'

import React, { useState } from 'react'
import { Ban, Check, Trash2 } from 'lucide-react'
import { StatusChip } from '@/components/ui/StatusChip'
import { useTeamMembers } from '@/modules/business-tools/hooks/useTeamMembers'

export function TeamAdmin() {
  const { membres, loading, error, inviter, definirAcces, supprimer } = useTeamMembers()
  const [email, setEmail] = useState('')
  const [nom, setNom] = useState('')
  const [role, setRole] = useState('UTILISATEUR_ORGANISATION')
  const [inviting, setInviting] = useState(false)
  const [inviteError, setInviteError] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [actionId, setActionId] = useState(null)

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

  const handleAccess = async (member) => {
    setActionId(member.id)
    setActionError(null)
    try {
      await definirAcces(member.id, !member.actif)
    } catch (err) {
      setActionError(err.message || 'Impossible de modifier cet accès.')
    } finally {
      setActionId(null)
    }
  }

  const handleDelete = async (member) => {
    if (!window.confirm(`Supprimer définitivement le compte de ${member.nom} (${member.email}) ? Cette action est irréversible.`)) return
    setActionId(member.id)
    setActionError(null)
    try {
      await supprimer(member.id)
    } catch (err) {
      setActionError(err.message || 'Impossible de supprimer ce membre.')
    } finally {
      setActionId(null)
    }
  }

  return (
    <>
      <div className="ad-head">
        <h2>Les bonnes personnes autour des bonnes décisions.</h2>
      </div>

      {loading && <p className="drawer-lead">Chargement…</p>}
      {error && <p className="drawer-lead">Erreur : {error}</p>}
      {actionError && <p className="form-error" role="alert">{actionError}</p>}

      <div className="ad-list">
        {membres.map((m) => (
          <div className="ad-row ad-member-row" key={m.id}>
            <span className="ad-avatar">{(m.nom || m.email || '?').split(' ').map((x) => x[0]).join('').slice(0, 2).toUpperCase()}</span>
            <div>
              <strong>{m.nom}</strong>
              <small>{m.email} · {m.role}</small>
            </div>
            <StatusChip status={m.actif ? 'Actif' : m.invitation_en_attente ? 'Invitation en attente' : 'Accès suspendu'} />
            <div className="ad-member-actions">
              {!m.invitation_en_attente && (
                <button
                  type="button"
                  className="quiet-button"
                  disabled={actionId === m.id}
                  onClick={() => handleAccess(m)}
                  aria-label={m.actif ? `Désactiver l'accès de ${m.nom}` : `Activer l'accès de ${m.nom}`}
                >
                  {m.actif ? <Ban size={15} /> : <Check size={15} />}
                  {m.actif ? 'Désactiver' : 'Activer'}
                </button>
              )}
              <button
                type="button"
                className="icon-button ad-delete-button"
                disabled={actionId === m.id}
                onClick={() => handleDelete(m)}
                aria-label={`Supprimer ${m.nom}`}
              >
                <Trash2 size={15} />
              </button>
            </div>
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
