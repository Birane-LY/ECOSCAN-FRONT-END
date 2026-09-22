'use client'

import React, { useState } from 'react'
import {
  BrainCircuit,
  Camera,
  FileSpreadsheet,
  Gauge,
  MessageSquareText,
  MoreHorizontal,
  Settings2,
  Target,
  TrendingDown,
  Wrench,
} from 'lucide-react'

const MORE_LINKS = [
  { id: 'data', label: 'Données', icon: FileSpreadsheet },
  { id: 'goals', label: 'Objectifs', icon: Target },
  { id: 'memory', label: 'Mémoire', icon: BrainCircuit },
  { id: 'features', label: 'Outils métier', icon: Wrench },
  { id: 'settings', label: 'Paramètres', icon: Settings2 },
]

export function BottomNav({ view, go, onCapture }) {
  const [moreOpen, setMoreOpen] = useState(false)

  const handleGo = (id) => {
    setMoreOpen(false)
    go(id)
  }
  const moreActive = MORE_LINKS.some((l) => l.id === view)

  return (
    <div data-silent>
      <nav className="eco-bottomnav glass" aria-label="Navigation mobile">
        <button type="button" className={view === 'overview' ? 'active' : ''} onClick={() => handleGo('overview')}>
          <Gauge size={20} />
          <span>Aperçu</span>
        </button>
        <button type="button" className={view === 'analyses' ? 'active' : ''} onClick={() => handleGo('analyses')}>
          <TrendingDown size={20} />
          <span>Analyses</span>
        </button>
        <button
          type="button"
          className="capture-nav-button"
          aria-label="Capturer une facture ou un compteur"
          onClick={onCapture}
        >
          <Camera size={24} />
          <span>Capturer</span>
        </button>
        <button type="button" className={view === 'assistant' ? 'active' : ''} onClick={() => handleGo('assistant')}>
          <MessageSquareText size={20} />
          <span>Assistant</span>
        </button>
        <button
          type="button"
          className={moreOpen || moreActive ? 'active' : ''}
          aria-label="Ouvrir les autres écrans"
          onClick={() => setMoreOpen((v) => !v)}
        >
          <MoreHorizontal size={20} />
          <span>Plus</span>
        </button>
      </nav>

      {moreOpen && (
        <div className="mobile-more-menu" role="menu">
          <p>Autres espaces</p>
          {MORE_LINKS.map(({ id, label, icon: Icon }) => (
            <button key={id} type="button" role="menuitem" onClick={() => handleGo(id)}>
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
