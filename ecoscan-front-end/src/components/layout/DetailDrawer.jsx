'use client'

import React from 'react'
import { Check, ChevronDown, MoreHorizontal, Sparkles, X } from 'lucide-react'

export function DetailDrawer({ type, close, complete }) {
  if (!type) return null

  const title =
    type === 'new-analysis'
      ? 'Nouvelle analyse'
      : type === 'opportunities'
      ? 'Opportunités détectées'
      : type === 'all-actions'
      ? 'Toutes vos décisions'
      : type

  return (
    <div className="drawer-backdrop" onClick={close}>
      <aside
        className="detail-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-head">
          <button className="icon-button" onClick={close} aria-label="Fermer">
            <X />
          </button>
          <span className="eyebrow">DÉTAIL</span>
          <button className="icon-button">
            <MoreHorizontal size={17} />
          </button>
        </div>

        <div className="drawer-content">
          <div className="drawer-icon">
            <Sparkles size={21} />
          </div>
          <h2 id="drawer-title">{title}</h2>
          <p className="drawer-lead">
            Une recommandation contextualisée par vos données, vos objectifs et votre
            rythme d’équipe.
          </p>

          <div className="drawer-metrics">
            <div>
              <span>Impact estimé</span>
              <strong>−12%</strong>
            </div>
            <div>
              <span>Économie</span>
              <strong>1 240 kWh</strong>
            </div>
          </div>

          <div className="drawer-section">
            <p className="eyebrow">POURQUOI MAINTENANT</p>
            <p>
              Le jeudi concentre 32% de vos pics d’intensité. Décaler ce cycle de 90
              minutes permet de réduire la demande sans modifier la production.
            </p>
          </div>

          <div className="owner-row">
            <div className="profile-avatar">CM</div>
            <span>
              <strong>Camille Martin</strong>
              <small>Responsable de la décision</small>
            </span>
            <ChevronDown size={15} />
          </div>
        </div>

        <div className="drawer-footer">
          <button className="secondary-button" onClick={close}>
            Plus tard
          </button>
          <button className="primary-button" onClick={complete}>
            <Check size={16} />
            Marquer comme décidé
          </button>
        </div>
      </aside>
    </div>
  )
}
