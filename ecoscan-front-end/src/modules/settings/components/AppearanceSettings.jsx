'use client'

import React from 'react'
import { GlassCard } from '@/components/instruments'

const THEMES = [
  { value: 'CLAIR', label: 'Lumière', desc: 'Verre clair, idéal en journée', cls: 'light' },
  { value: 'SOMBRE', label: 'Nuit', desc: 'Fond profond pour les salles de contrôle', cls: 'night' },
]
// Les valeurs restent celles de l'API (GREEN, CYAN, AMBER) ; seuls les libellés changent.
const ACCENTS = [
  { value: 'GREEN', label: 'Cuivre', desc: 'Standard EcoScan', color: '#ee8738' },
  { value: 'CYAN', label: 'Cyan électrique', desc: 'Plus froid, plus technique', color: '#1f91a6' },
  { value: 'AMBER', label: 'Ambre vigilance', desc: 'Chaud, très lisible', color: '#e0a323' },
]

export function AppearanceSettings({ preferences, updatePreferences, setSavedToast }) {

  const handleUpdate = async (patch, label) => {
    try {
      await updatePreferences(patch)
      setSavedToast?.(label)
    } catch (err) {
      setSavedToast?.(`Erreur : ${err.message}`)
    }
  }

  if (!preferences) return <p className="drawer-lead">Chargement…</p>

  return (
    <GlassCard as="section" className="st-card">
      <header className="st-head">
        <h2>Apparence et interface</h2>
        <p>Les changements s’appliquent tout de suite.</p>
      </header>

      <div className="st-block">
        <h3>Thème</h3>
        <div className="st-themes" role="radiogroup" aria-label="Thème visuel">
          {THEMES.map((t) => (
            <button
              key={t.value}
              type="button"
              role="radio"
              aria-checked={preferences.theme === t.value}
              className={`st-theme ${preferences.theme === t.value ? 'on' : ''}`}
              onClick={() => handleUpdate({ theme: t.value }, `Thème ${t.label.toLowerCase()} activé`)}
            >
              <span className={`st-preview ${t.cls}`} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <strong>{t.label}</strong>
              <small>{t.desc}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="st-block">
        <h3>Couleur d’accent</h3>
        <div className="st-accents" role="radiogroup" aria-label="Couleur d’accent">
          {ACCENTS.map((a) => (
            <button
              key={a.value}
              type="button"
              role="radio"
              aria-checked={preferences.accent === a.value}
              className={`st-accent ${preferences.accent === a.value ? 'on' : ''}`}
              onClick={() => handleUpdate({ accent: a.value }, `Accent ${a.label.toLowerCase()} appliqué`)}
            >
              <i style={{ background: a.color }} />
              <span>
                <strong>{a.label}</strong>
                <small>{a.desc}</small>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="st-rows">
        <div className="st-row">
          <div>
            <strong>Densité des listes</strong>
            <span>Espacement des lignes dans les listes de données et d’historique.</span>
          </div>
          <select
            className="st-select"
            value={preferences.densite}
            onChange={(e) => handleUpdate({ densite: e.target.value }, 'Densité mise à jour')}
            aria-label="Densité des listes"
          >
            <option value="COMPACTE">Compacte</option>
            <option value="CONFORTABLE">Confortable (défaut)</option>
            <option value="AEREE">Aérée</option>
          </select>
        </div>
      </div>
    </GlassCard>
  )
}
