'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Database, ShieldCheck, TrendingDown, TrendingUp, Zap } from 'lucide-react'

const STATUT_LABELS = {
  A_VERIFIER: { label: 'À vérifier', className: 'review' },
  PARTIELLEMENT_CONFIRMEE: { label: 'Partiellement confirmée', className: 'review' },
  CONFIRMEE: { label: 'Confirmée', className: 'ready' },
}

export function MemoryCard({ memoire }) {
  const [expanded, setExpanded] = useState(false)
  const statutInfo = STATUT_LABELS[memoire.statut] || { label: memoire.statut, className: '' }

  const ecart = memoire.impact_attendu_fcfa != null && memoire.impact_mesure_fcfa != null
    ? Number(memoire.impact_mesure_fcfa) - Number(memoire.impact_attendu_fcfa)
    : null

  return (
    <article className="analysis-card" style={{ cursor: 'default', textAlign: 'left' }}>
      <div className="analysis-top">
        <span className="file-icon"><Zap size={17} /></span>
        <span className={`status-chip ${statutInfo.className}`}>{statutInfo.label}</span>
      </div>

      <strong>{memoire.titre}</strong>
      <span className="analysis-meta">
        {new Date(memoire.date_creation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
      </span>

      <div className="drawer-section" style={{ marginTop: 14 }}>
        <p className="eyebrow">SIGNAL INITIAL</p>
        <p style={{ fontSize: 11, color: 'var(--foreground)', lineHeight: 1.55 }}>{memoire.signal_initial}</p>
      </div>

      {expanded && (
        <>
          {memoire.hypothese_texte && (
            <div className="drawer-section">
              <p className="eyebrow">HYPOTHÈSE CONFIRMÉE</p>
              <p style={{ fontSize: 11, color: 'var(--foreground)', lineHeight: 1.55 }}>{memoire.hypothese_texte}</p>
            </div>
          )}
          {memoire.action_texte && (
            <div className="drawer-section">
              <p className="eyebrow">ACTION MENÉE</p>
              <p style={{ fontSize: 11, color: 'var(--foreground)', lineHeight: 1.55 }}>{memoire.action_texte}</p>
            </div>
          )}
        </>
      )}

      {(memoire.impact_attendu_fcfa != null || memoire.impact_mesure_fcfa != null) && (
        <div className="drawer-metrics" style={{ margin: '14px 0' }}>
          <div>
            <span>Impact attendu</span>
            <strong>{memoire.impact_attendu_fcfa != null ? `${Number(memoire.impact_attendu_fcfa).toLocaleString('fr-FR')} FCFA` : '—'}</strong>
          </div>
          <div>
            <span>Impact mesuré</span>
            <strong>{memoire.impact_mesure_fcfa != null ? `${Number(memoire.impact_mesure_fcfa).toLocaleString('fr-FR')} FCFA` : 'Non mesuré'}</strong>
          </div>
          <div>
            <span>Taux de réalisation</span>
            <strong className={ecart != null ? (ecart >= 0 ? 'positive' : 'negative') : ''}>
              {memoire.taux_realisation != null ? `${memoire.taux_realisation}%` : '—'}
            </strong>
          </div>
        </div>
      )}

      {ecart != null && (
        <p style={{ fontSize: 10, color: ecart >= 0 ? 'var(--green)' : 'var(--copper)', display: 'flex', alignItems: 'center', gap: 5 }}>
          {ecart >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {ecart >= 0 ? 'Impact réel supérieur à la prévision' : 'Impact réel inférieur à la prévision'}
          {' '}({ecart >= 0 ? '+' : ''}{ecart.toLocaleString('fr-FR')} FCFA)
        </p>
      )}

      {memoire.sources?.length > 0 && (
        <div className="drawer-section">
          <p className="eyebrow">SOURCES</p>
          <p style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{memoire.sources.join(', ')}</p>
        </div>
      )}

      <div className="analysis-bottom" style={{ marginTop: 16 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {memoire.indexee_rag && <><Database size={12} /> Indexée dans l'assistant IA</>}
        </span>
        <button className="quiet-button" onClick={() => setExpanded((v) => !v)} style={{ marginLeft: 'auto' }}>
          {expanded ? <>Réduire <ChevronUp size={14} /></> : <>Voir le détail <ChevronDown size={14} /></>}
        </button>
      </div>
    </article>
  )
}