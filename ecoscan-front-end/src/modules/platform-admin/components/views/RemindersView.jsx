'use client'

import React, { useState } from 'react'
import { Send } from 'lucide-react'
import { GlassCard, TickProgress } from '@/components/instruments'
import { AdminHeading } from './AdminHeading'

export function RemindersView({ orgs, notify, openModal }) {
  const [sent, setSent] = useState([])
  const pendingCount = orgs.filter((o) => o.status !== 'Actif').length + 3

  return (
    <>
      <AdminHeading
        title="Centre de relances"
        subtitle="Prévenez les organisations avant un renouvellement ou un impayé."
        action={
          <button className="primary-button" onClick={() => (openModal ? openModal('reminder') : notify('Campagne globale programmée'))}>
            <Send size={16} />
            Programmer
          </button>
        }
      />

      <GlassCard as="article" tone="inverse" className="adm-hero">
        <div>
          <h2>{pendingCount} organisations à prévenir cette semaine</h2>
          <p>Les messages sont personnalisés selon le plan, la date d’échéance et l’historique de paiement.</p>
        </div>
        <div className="adm-meter">
          <TickProgress value={72} ticks={22} label="Relances préparées" />
          <strong>72 % préparées</strong>
        </div>
      </GlassCard>

      <GlassCard as="article" className="adm-panel">
        <div className="panel-top">
          <h2>Relances prioritaires</h2>
          <button type="button" className="quiet-button" onClick={() => notify('Prévisualisation ouverte')}>
            Prévisualiser
          </button>
        </div>

        <div className="adm-list">
          {orgs.slice(0, 3).map((o) => (
            <div className="adm-list-row" key={o.id}>
              <div>
                <strong>{o.name}</strong>
                <span>{o.status === 'À valider' ? 'Validation requise' : `Renouvellement, ${o.due}`}</span>
              </div>
              <button
                type="button"
                className="secondary-button"
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
      </GlassCard>

      <GlassCard as="article" className="adm-panel">
        <h2>Nouvelle notification</h2>
        <div className="adm-compose">
          <select className="st-select" aria-label="Canal">
            <option>Email</option>
            <option>Notification in-app</option>
          </select>
          <input placeholder="Objet de la relance" aria-label="Objet de la relance" />
          <button type="button" className="primary-button" onClick={() => notify('Notification enregistrée')}>
            <Send size={15} />
            Enregistrer
          </button>
        </div>
      </GlassCard>
    </>
  )
}
