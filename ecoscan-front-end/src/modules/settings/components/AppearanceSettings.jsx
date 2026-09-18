'use client'

import React from 'react'
import { Moon, Palette, Sun } from 'lucide-react'
import { usePreferences } from '@/modules/settings/hooks/usePreferences'

export function AppearanceSettings({ setSavedToast }) {
  const { preferences, loading, error, updatePreferences } = usePreferences()

  const handleUpdate = async (patch, label) => {
    try {
      await updatePreferences(patch)
      setSavedToast?.(label)
    } catch (err) {
      setSavedToast?.(`Erreur : ${err.message}`)
    }
  }

  if (loading) return <p className="drawer-lead">Chargement…</p>
  if (error) return <p className="drawer-lead">Erreur : {error}</p>

  return (
    <div className="settings-section">
      <div className="section-head">
        <Palette size={18} />
        <div>
          <h3>Apparence & Interface</h3>
          <p>Personnalisez le contraste, les densités d'affichage et les tons.</p>
        </div>
      </div>
      <div className="settings-list-rows">
        <div className="setting-row">
          <div>
            <strong>Thème visuel</strong>
            <span>Mode sombre optimisé pour les écrans de contrôle ou mode clair.</span>
          </div>
          <div className="theme-toggle-group">
            <button
              type="button"
              className={`theme-btn ${preferences.theme === 'SOMBRE' ? 'active' : ''}`}
              onClick={() => handleUpdate({ theme: 'SOMBRE' }, 'Thème changé en sombre')}
            >
              <Moon size={14} />Sombre
            </button>
            <button
              type="button"
              className={`theme-btn ${preferences.theme === 'CLAIR' ? 'active' : ''}`}
              onClick={() => handleUpdate({ theme: 'CLAIR' }, 'Thème changé en clair')}
            >
              <Sun size={14} />Clair
            </button>
          </div>
        </div>

        <div className="setting-row">
          <div>
            <strong>Densité des tableaux</strong>
            <span>Espacement des lignes dans les listes de données et historiques.</span>
          </div>
          <select
            value={preferences.densite}
            onChange={(e) => handleUpdate({ densite: e.target.value }, 'Densité mise à jour')}
          >
            <option value="COMPACTE">Compacte</option>
            <option value="CONFORTABLE">Confortable (défaut)</option>
            <option value="AEREE">Aérée</option>
          </select>
        </div>

        <div className="setting-row">
          <div>
            <strong>Couleur d'accent énergétique</strong>
            <span>Palette utilisée pour les courbes et les alertes positives.</span>
          </div>
          <select
            value={preferences.accent}
            onChange={(e) => handleUpdate({ accent: e.target.value }, 'Accent mis à jour')}
          >
            <option value="GREEN">Émeraude Solaire (Standard)</option>
            <option value="CYAN">Cyan Électrique</option>
            <option value="AMBER">Ambre Vigilance</option>
          </select>
        </div>
      </div>
    </div>
  )
}