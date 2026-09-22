'use client'

import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { BigNumber, EnergyCore, GlassCard, TickProgress } from '@/components/instruments'

/**
 * Héros de la vue d'ensemble : 100% dynamique.
 * Ne contient aucune valeur en dur.
 */
export function HeroPanel({ score, delta, consumption, objective, savings, selectedPoint }) {
  // Récupération des valeurs passées en props (aucun fallback fictif)
  const scoreVal = Number(score ?? 0)
  const deltaVal = delta ?? '—'

  const cValue = consumption?.value ?? '0'
  const cUnit = consumption?.unit ?? 'kWh'
  const cTrend = consumption?.trend ?? '—'
  const cNote = consumption?.note ?? ''

  const oValue = Number(objective?.value ?? 0)
  const oNote = objective?.note ?? ''

  const sValue = savings?.value ?? '0'
  const sUnit = savings?.unit ?? 'kWh'
  const sNote = savings?.note ?? ''

  const isOkTrend = cTrend.includes('↓') || cTrend.startsWith('-')

  return (
    <section className="hero" aria-label="Synthèse énergétique">
      <div className="hero-visual">
        <EnergyCore score={scoreVal} delta={deltaVal} />
      </div>

      {/* Consommation totale */}
      <GlassCard as="article" className="hero-card" data-pos="tl" style={{ '--d': '1.55s' }}>
        <div className="hc-head">
          <span className="hc-label">Consommation totale</span>
          <span className="hc-arrow" aria-hidden="true">
            <ArrowUpRight size={14} />
          </span>
        </div>
        <BigNumber value={cValue} unit={cUnit} />
        {cTrend !== '—' && (
          <div className="hc-row">
            <span className={`chip ${isOkTrend ? 'chip-ok' : 'chip-warn'}`}>
              {cTrend}
            </span>
          </div>
        )}
        {cNote && <span className="hc-sub">{cNote}</span>}
      </GlassCard>

      {/* Objectif mensuel */}
      <GlassCard as="article" className="hero-card" data-pos="bl" style={{ '--d': '1.7s' }}>
        <div className="hc-head">
          <span className="hc-label">Objectif mensuel</span>
          <span className="hc-arrow" aria-hidden="true">
            <ArrowUpRight size={14} />
          </span>
        </div>
        <BigNumber value={String(oValue)} unit="%" />
        <TickProgress value={oValue} ticks={26} label="Progression de l’objectif mensuel" />
        {oNote && <span className="hc-sub">{oNote}</span>}
      </GlassCard>

      {/* Énergie économisée */}
      <GlassCard as="article" className="hero-card" data-pos="tr" style={{ '--d': '1.85s' }}>
        <div className="hc-head">
          <span className="hc-label">Énergie économisée</span>
          <span className="hc-arrow" aria-hidden="true">
            <ArrowUpRight size={14} />
          </span>
        </div>
        <BigNumber value={sValue} unit={sUnit} />
        {sNote && <span className="hc-sub">{sNote}</span>}
      </GlassCard>

      {/* Point sélectionné */}
      <GlassCard as="article" className="hero-card" data-pos="br" style={{ '--d': '2s' }}>
        <div className="hc-head">
          <span className="hc-label">Point sélectionné</span>
          <span className="hc-arrow" aria-hidden="true">
            <ArrowUpRight size={14} />
          </span>
        </div>
        <h3 className="hc-title">{selectedPoint?.label || 'Aucun point choisi'}</h3>
        <span className="hc-sub">
          {selectedPoint?.detail || 'Survolez ou cliquez sur une barre du graphique pour l’examiner.'}
        </span>
      </GlassCard>
    </section>
  )
}