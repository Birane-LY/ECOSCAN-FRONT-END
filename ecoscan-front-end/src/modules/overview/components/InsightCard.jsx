import React from 'react'
import { ArrowUpRight, Leaf } from 'lucide-react'

export function InsightCard({
  kicker = "INSIGHT DE L’IA",
  title = "Le jeudi est votre journée clé.",
  description = "Les pics entre 14h et 17h représentent 32% de votre consommation hebdomadaire.",
  buttonText = "Explorer la tendance",
  onExplore
}) {
  return (
    <article className="insight-card">
      <div className="insight-orbit">
        <div className="orbit-core">
          <Leaf size={20} />
        </div>
        <i />
        <i />
        <i />
      </div>
      <div>
        <p className="card-kicker">{kicker}</p>
        <h3>{title}</h3>
        {/* Texte en couleur claire pour assurer la lisibilité sur fond sombre */}
        <p style={{ color: '#e2e8f0' }}>{description}</p>
        <button
          className="text-button"
          onClick={() => onExplore?.(title)}
        >
          {buttonText} <ArrowUpRight size={14} />
        </button>
      </div>
    </article>
  )
}