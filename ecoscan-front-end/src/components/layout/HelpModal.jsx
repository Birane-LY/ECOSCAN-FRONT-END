'use client'

import React from 'react'
import { CircleHelp, MessageSquareText, X } from 'lucide-react'

export function HelpModal({ open, close, goAssistant }) {
  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={close}>
      <section
        className="help-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" aria-label="Fermer" onClick={close}>
          <X />
        </button>
        <div className="help-orb">
          <CircleHelp size={24} />
        </div>
        <p className="eyebrow">CENTRE DE RESSOURCES</p>
        <h2 id="help-title">Besoin d’un coup de main ?</h2>
        <p>
          Explorez les guides de pilotage ou demandez à l’équipe EcoScan de vous
          accompagner.
        </p>
        <button
          className="primary-button"
          onClick={() => {
            close()
            goAssistant()
          }}
        >
          Parler à EcoScan IA <MessageSquareText size={15} />
        </button>
        <button className="secondary-button" onClick={close}>
          Voir les guides
        </button>
      </section>
    </div>
  )
}
