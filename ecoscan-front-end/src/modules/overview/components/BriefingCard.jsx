import React from 'react'
import { Sparkles } from 'lucide-react'

export function BriefingCard({
  title = "Vous êtes sur la bonne voie.",
  description = "Votre consommation a baissé de 14,2% cette semaine. C’est votre meilleure performance depuis le début du trimestre.",
  savedEnergy = "2 840",
  savedEnergyUnit = "kWh",
  co2Saved = "1,2",
  co2Unit = "t",
  badgeText = "À JOUR"
}) {
  return (
    <article className="briefing-card">
      <div className="card-kicker">
        <Sparkles size={15} />
        BRIEFING DU JOUR
        {badgeText && <span className="live-badge">{badgeText}</span>}
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="briefing-footer">
        <div className="metric">
          <span>Énergie économisée</span>
          <strong>
            {savedEnergy} <small>{savedEnergyUnit}</small>
          </strong>
        </div>
        <div className="metric">
          <span>Équivalent CO₂</span>
          <strong>
            {co2Saved} <small>{co2Unit}</small>
          </strong>
        </div>
        <div className="mini-spark">
          <span /><span /><span /><span /><span /><span /><span />
        </div>
      </div>
    </article>
  )
}