import React from 'react'
import { BigNumber, DotBars, EcoMark, GlassCard } from '@/components/instruments'

export function BriefingCard({
  title = 'Vous êtes sur la bonne voie.',
  description = 'Votre consommation a baissé de 14,2 % cette semaine. C’est votre meilleure performance depuis le début du trimestre.',
  savedEnergy = '2 840',
  savedEnergyUnit = 'kWh',
  co2Saved = '1,2',
  co2Unit = 't',
  badgeText = 'À jour',
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
        <DotBars values={[3, 4, 4, 6, 5, 4, 3]} label="Tendance de la semaine" />
      </div>
    </GlassCard>
  )
}
