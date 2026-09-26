import React from 'react'
import { BigNumber, DotBars, EcoMark, GlassCard } from '@/components/instruments'

export function BriefingCard({
  title = 'Bienvenue sur EcoScan.',
  description = 'Importez une facture ou saisissez un relevé pour recevoir votre premier briefing.',
  savedEnergy = '0',
  savedEnergyUnit = 'kWh',
  co2Saved = '0',
  co2Unit = 't',
  badgeText = '',
  trend = [],
  error,
}) {
  return (
    <GlassCard as="article" tone="inverse" className="brief">
      <div className="brief-head">
        <EcoMark size={18} />
        <span>Briefing du jour</span>
        {badgeText && <span className="chip chip-lime">{badgeText}</span>}
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      {error && <span className="brief-note">Les données se synchronisent : certains chiffres peuvent être en retard.</span>}
      <div className="brief-foot">
        <div>
          <span className="metric-label">Énergie économisée</span>
          <BigNumber value={savedEnergy} unit={savedEnergyUnit} />
        </div>
        <div>
          <span className="metric-label">Équivalent CO₂</span>
          <BigNumber value={co2Saved} unit={co2Unit} />
        </div>
        {trend.length > 0 && <DotBars values={trend} label="Tendance récente" />}
      </div>
    </GlassCard>
  )
}
