'use client'

import React, { useState } from 'react'
import { Check, Sparkles, X } from 'lucide-react'
import { useHypotheses } from '@/modules/memory/hooks/useHypotheses'

export function HypothesisReviewBanner({onConfirmed}) {
  const { hypotheses, confirmer, rejeter } = useHypotheses()
  const [busyId, setBusyId] = useState(null)
  const [confianceParHypothese, setConfianceParHypothese] = useState({})

  if (hypotheses.length === 0) return null

   const handleConfirmer = async (id) => {
    const confiance = confianceParHypothese[id] ?? 0.7
    setBusyId(id)
    try {
      await confirmer(id, confiance)
      onConfirmed?.()
    } finally {
      setBusyId(null)
    }
  }

  const handleRejeter = async (id) => {
    setBusyId(id)
    try { await rejeter(id) } finally { setBusyId(null) }
  }

  return (
    <div className="insight-banner" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Sparkles size={18} />
        <strong>{hypotheses.length} hypothèse{hypotheses.length > 1 ? 's' : ''} générée{hypotheses.length > 1 ? 's' : ''} par l'IA, en attente de votre validation</strong>
      </div>

      {hypotheses.map((h) => (
        <div key={h.id} className="owner-row" style={{ alignItems: 'flex-start' }}>
          <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <small style={{ lineHeight: 1.5 }}>{h.texte}</small>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--muted-foreground)' }}>
              Confiance que vous accordez à cette hypothèse :
              <select
                value={confianceParHypothese[h.id] ?? 0.7}
                onChange={(e) => setConfianceParHypothese((c) => ({ ...c, [h.id]: Number(e.target.value) }))}
              >
                <option value={0.9}>Élevée</option>
                <option value={0.7}>Moyenne</option>
                <option value={0.4}>Faible</option>
              </select>
            </label>
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="row-action" disabled={busyId === h.id} onClick={() => handleConfirmer(h.id)}>
              <Check size={13} /> Confirmer
            </button>
            <button className="row-action" style={{ color: 'var(--copper)' }} disabled={busyId === h.id} onClick={() => handleRejeter(h.id)}>
              <X size={13} /> Rejeter
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}