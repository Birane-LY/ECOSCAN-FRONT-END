'use client'

import React from 'react'
import { Bell } from 'lucide-react'
import { SettingToggle } from '@/components/ui'
import { usePreferences } from '@/modules/settings/hooks/usePreferences'

const ROWS = [
  { key: 'alertes_email', label: 'Alertes de dépassement par email', desc: "Recevez immédiatement un email lorsqu'un seuil est franchi." },
  { key: 'briefing_quotidien', label: 'Briefing quotidien matinal', desc: "Synthèse récapitulative envoyée à l'heure d'ouverture." },
  { key: 'detection_anomalies', label: "Détection d'anomalies en temps réel", desc: "Notification instantanée lors d'un pic inhabituel." },
  { key: 'rapport_hebdomadaire', label: 'Rapport hebdomadaire consolidé', desc: 'Bilan complet du dimanche soir pour préparer la semaine.' },
]

export function NotificationSettings({ setSavedToast }) {
  const { preferences, loading, error, updatePreferences } = usePreferences()

  const handleToggle = async (key, label) => {
    try {
      await updatePreferences({ [key]: !preferences[key] })
      setSavedToast?.(`Préférence "${label}" mise à jour`)
    } catch (err) {
      setSavedToast?.(`Erreur : ${err.message}`)
    }
  }

  if (loading) return <p className="drawer-lead">Chargement…</p>
  if (error) return <p className="drawer-lead">Erreur : {error}</p>

  return (
    <div className="settings-section">
      <div className="section-head">
        <Bell size={18} />
        <div>
          <h3>Notifications & Alertes</h3>
          <p>Choisissez les canaux et la fréquence de réception de vos synthèses.</p>
        </div>
      </div>
      <div className="settings-list-rows">
        {ROWS.map(({ key, label, desc }) => (
          <div className="setting-row" key={key}>
            <div>
              <strong>{label}</strong>
              <span>{desc}</span>
            </div>
            <SettingToggle label="" checked={preferences[key]} setChecked={() => handleToggle(key, label)} />
          </div>
        ))}
      </div>
    </div>
  )
}