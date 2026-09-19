'use client'

import React, { useState } from 'react'
import { Send } from 'lucide-react'
import { AdminHeading } from './AdminHeading'

export function RemindersView({ orgs, notify, openModal }) {
  const [sent, setSent] = useState([])

  const pendingCount = orgs.filter((o) => o.status !== 'Actif').length + 3

  return (
    <>
      <AdminHeading
        eyebrow="CUSTOMER SUCCESS COMMAND"
        title="Centre de relances"
        subtitle="Prévenez les organisations avant un renouvellement ou un impayé."
        action={
          <button
            className="admin-primary"
            onClick={() => {
              if (openModal) openModal('reminder')
              else notify('Campagne globale programmée')
            }}
          >
            <Send size={14} />
            Programmer
          </button>
        }
      />

      <div className="reminder-hero">
        <div>
          <small>PROCHAINE VAGUE</small>
          <h2>{pendingCount} organisations à prévenir cette semaine</h2>
          <p>
            Les messages sont personnalisés selon le plan, la date d’échéance et
            l’historique de paiement.
          </p>
        </div>
        <div className="reminder-meter">
          <strong>72%</strong>
          <span>préparées</span>
        </div>
      </div>

      <article className="admin-panel">
        <div className="admin-panel-title">
          <div>
            <small>FILE D’ACTIONS</small>
            <h2>Relances prioritaires</h2>
          </div>
          <button
            className="admin-secondary"
            onClick={() => notify('Prévisualisation ouverte')}
          >
            Prévisualiser
          </button>
        </div>

        <div className="reminder-list">
          {orgs.slice(0, 3).map((o) => (
            <div className="reminder-item" key={o.id}>
              <div>
                <b>{o.name}</b>
                <span>
                  {o.status === 'À valider'
                    ? 'Validation requise'
                    : `Renouvellement · ${o.due}`}
                </span>
              </div>
              <button
                className="admin-secondary"
                onClick={() => {
                  setSent([...sent, o.name])
                  notify(`Relance envoyée à ${o.name}`)
                }}
              >
                {sent.includes(o.name) ? 'Envoyée' : 'Envoyer'}
              </button>
            </div>
          ))}
        </div>
      </article>

      <article className="admin-panel">
        <small>COMPOSITION</small>
        <h2>Nouvelle notification</h2>
        <div className="inline-compose">
          <select>
            <option>Email</option>
            <option>Notification in-app</option>
          </select>
          <input placeholder="Objet de la relance" />
          <button
            className="admin-primary"
            onClick={() => notify('Notification enregistrée')}
          >
            <Send size={13} />
            Enregistrer
          </button>
        </div>
      </article>
    </>
  )
}
