'use client'

import React, { useState } from 'react'
import { Send } from 'lucide-react'
import { GlassCard } from '@/components/instruments'
import { AdminHeading } from './AdminHeading'
import apiClient from '@/lib/apiClient'

export function RemindersView({ orgs, notify, openModal }) {
  const [sent, setSent] = useState([])
  const [subject, setSubject] = useState('')
  const [channel, setChannel] = useState('Email')
  const pendingCount = orgs.filter((o) => o.status !== 'Actif').length

  const sendReminder = async (org) => {
    try {
      await apiClient.post('/billing/reminders/send/', { org_id: org.id })
      setSent((prev) => [...prev, org.id])
      notify(`Relance envoyée à ${org.name}`)
    } catch {
      notify('Erreur lors de l’envoi de la relance')
    }
  }

  const createCampaign = async () => {
    if (!subject) return
    try {
      await apiClient.post('/billing/reminders/campaign/', { subject, channel })
      notify('Notification/Campagne enregistrée')
      setSubject('')
    } catch {
      notify('Erreur lors de l’enregistrement de la campagne')
    }
  }

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
          <h2>{pendingCount} organisations requièrent votre attention</h2>
          <p>Les messages sont personnalisés selon le plan et la date d’échéance.</p>
        </div>
      </GlassCard>

      <GlassCard as="article" className="adm-panel">
        <div className="panel-top">
          <h2>Relances prioritaires</h2>
        </div>

        <div className="adm-list">
          {orgs.slice(0, 5).map((o) => (
            <div className="adm-list-row" key={o.id}>
              <div>
                <strong>{o.name}</strong>
                <span>{o.status === 'À valider' ? 'Validation requise' : `Statut : ${o.status}`}</span>
              </div>
              <button type="button" className="secondary-button" onClick={() => sendReminder(o)}>
                {sent.includes(o.id) ? 'Envoyée' : 'Envoyer'}
              </button>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard as="article" className="adm-panel">
        <h2>Nouvelle notification</h2>
        <div className="adm-compose">
          <select className="st-select" value={channel} onChange={(e) => setChannel(e.target.value)} aria-label="Canal">
            <option>Email</option>
            <option>Notification in-app</option>
          </select>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Objet de la relance" aria-label="Objet de la relance" />
          <button type="button" className="primary-button" onClick={createCampaign}>
            <Send size={15} />
            Enregistrer
          </button>
        </div>
      </GlassCard>
    </>
  )
}