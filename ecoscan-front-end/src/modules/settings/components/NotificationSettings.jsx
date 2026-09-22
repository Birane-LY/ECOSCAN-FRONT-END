'use client'

import React from 'react'
import { GlassCard } from '@/components/instruments'
import { SettingToggle } from '@/components/ui/StatusChip'

const ROWS = [
  { key: 'alertes_email', label: 'Alertes de dépassement par email', desc: 'Un email dès qu’un seuil est franchi.' },
  { key: 'briefing_quotidien', label: 'Briefing quotidien', desc: 'Une synthèse envoyée à l’ouverture de vos journées.' },
  { key: 'detection_anomalies', label: 'Détection d’anomalies en temps réel', desc: 'Une notification immédiate lors d’un pic inhabituel.' },
  { key: 'rapport_hebdomadaire', label: 'Rapport hebdomadaire', desc: 'Le bilan du dimanche soir pour préparer la semaine.' },
]

export function NotificationSettings({ preferences, updatePreferences, setSavedToast }) {

  const handleToggle = async (key, label) => {
    try {
      await updatePreferences({ [key]: !preferences[key] })
      setSavedToast?.(`« ${label} » mis à jour`)
    } catch (err) {
      setSavedToast?.(`Erreur : ${err.message}`)
    }
  }

  if (!preferences) return <p className="drawer-lead">Chargement…</p>

  return (
    <GlassCard as="section" className="st-card">
      <header className="st-head">
        <h2>Notifications et alertes</h2>
        <p>Choisissez ce que vous recevez, et quand.</p>
      </header>
      <div className="st-rows">
        {ROWS.map(({ key, label, desc }) => (
          <div className="st-row" key={key}>
            <div>
              <strong>{label}</strong>
              <span>{desc}</span>
            </div>
            <SettingToggle label="" checked={!!preferences[key]} setChecked={() => handleToggle(key, label)} />
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
