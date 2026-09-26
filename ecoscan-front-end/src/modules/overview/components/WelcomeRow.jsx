import React from 'react'
import { Plus, SlidersHorizontal } from 'lucide-react'

export function WelcomeRow({ userName = '', currentDate, editMode, onToggleEditMode, onOpenUpload }) {
  const displayDate =
    currentDate ||
    new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <section className="ov-welcome">
      <div>
        <p className="ov-date">
          <span className="live-dot" aria-hidden="true" />
          {String(displayDate).toLowerCase()}
        </p>
        <h1>{userName ? `Bonjour ${userName}` : 'Bonjour'}</h1>
        <p className="sub">Voici ce qui mérite votre attention aujourd’hui.</p>
      </div>
      <div className="ov-actions">
        <button type="button" className="secondary-button" onClick={onToggleEditMode}>
          <SlidersHorizontal size={16} />
          {editMode ? 'Terminer' : 'Personnaliser'}
        </button>
        <button type="button" className="primary-button" onClick={onOpenUpload}>
          <Plus size={17} />
          Importer des données
        </button>
      </div>
    </section>
  )
}