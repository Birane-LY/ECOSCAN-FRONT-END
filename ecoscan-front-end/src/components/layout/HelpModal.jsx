'use client'

import React from 'react'
import { CircleHelp, Mail, MessageSquareText, X } from 'lucide-react'
import { APP_CONFIG } from '@/lib/config'

export function HelpModal({ open, close, goAssistant }) {
  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={close}>
      <section className="help-panel mdl" role="dialog" aria-modal="true" aria-labelledby="help-title" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="icon-button mdl-close" aria-label="Fermer" onClick={close}>
          <X size={18} />
        </button>
        <span className="mdl-orb">
          <CircleHelp size={26} />
        </span>
        <h2 id="help-title">Besoin d’un coup de main ?</h2>
        <p>Posez votre question à l’assistant, ou écrivez à l’équipe EcoScan.</p>
        <div className="mdl-actions">
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              close()
              goAssistant()
            }}
          >
            <MessageSquareText size={16} /> Parler à l’assistant
          </button>
          {APP_CONFIG.supportEmail && (
            <a className="secondary-button" href={`mailto:${APP_CONFIG.supportEmail}`}>
              <Mail size={16} /> Écrire au support
            </a>
          )}
        </div>
      </section>
    </div>
  )
}
