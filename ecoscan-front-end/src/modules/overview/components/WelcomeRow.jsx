import React from 'react'
import { Plus, SlidersHorizontal } from 'lucide-react'

export function WelcomeRow({ 
  userName = 'Camille', 
  currentDate, 
  editMode, 
  onToggleEditMode, 
  onOpenUpload 
}) {
  const displayDate = currentDate || new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).toUpperCase()

  return (
    <section className="welcome-row">
      <div>
        <p className="eyebrow">
          <span className="eyebrow-dot" />
          {displayDate}
        </p>
        <h1>
          Bonjour {userName} <span className="wave">↗</span>
        </h1>
        <p className="subtitle">Voici ce qui mérite votre attention aujourd’hui.</p>
      </div>
      <div className="welcome-actions">
        <button className="secondary-button" onClick={onToggleEditMode}>
          <SlidersHorizontal size={15} />
          {editMode ? 'Terminer' : 'Personnaliser'}
        </button>
        <button className="primary-button" onClick={onOpenUpload}>
          <Plus size={17} />
          Importer des données
        </button>
      </div>
    </section>
  )
}