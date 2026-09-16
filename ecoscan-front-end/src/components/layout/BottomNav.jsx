'use client'

import React, { useState } from 'react'
import {
  Camera,
  FileSpreadsheet,
  Gauge,
  MoreHorizontal,
  Settings2,
  Sparkles,
  Target,
  TrendingDown,
  Wrench,
} from 'lucide-react'

const MORE_LINKS = [
  { id: 'data', label: 'Données', icon: FileSpreadsheet },
  { id: 'goals', label: 'Objectifs', icon: Target },
  { id: 'features', label: 'Outils métier', icon: Wrench },
  { id: 'settings', label: 'Paramètres', icon: Settings2 },
]

export function BottomNav({ view, go, onCapture }) {
  const [moreOpen, setMoreOpen] = useState(false)

  const handleGo = (id) => {
    setMoreOpen(false)
    go(id)
  }

  return (
    <>
      <nav className="bottom-nav" aria-label="Navigation mobile">
        <button
          className={view === 'overview' ? 'active' : ''}
          onClick={() => handleGo('overview')}
        >
          <Gauge size={17} />
          <span>Accueil</span>
        </button>

        <button
          className={view === 'analyses' ? 'active' : ''}
          onClick={() => handleGo('analyses')}
        >
          <TrendingDown size={17} />
          <span>Analyses</span>
        </button>

        <button
          className="capture-nav-button"
          aria-label="Capturer une facture ou une consommation"
          onClick={onCapture}
        >
          <Camera size={21} />
          <span>Capturer</span>
        </button>

        <button
          className={view === 'assistant' ? 'active' : ''}
          onClick={() => handleGo('assistant')}
        >
          <Sparkles size={17} />
          <span>Assistant</span>
        </button>

        <button
          className={moreOpen ? 'active' : ''}
          aria-label="Ouvrir les autres écrans"
          onClick={() => setMoreOpen((value) => !value)}
        >
          <MoreHorizontal size={19} />
          <span>Plus</span>
        </button>
      </nav>

      {moreOpen && (
        <div className="mobile-more-menu" role="menu">
          <p>Autres espaces</p>
          {MORE_LINKS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => handleGo(id)}>
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      )}
    </>
  )
}