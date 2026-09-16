import React from 'react'
import { Zap } from 'lucide-react'

export function MilestoneBanner({ goal }) {
  const isUnlocked = goal >= 80

  return (
    <section className="milestone">
      <div className="milestone-icon">
        <Zap size={18} />
      </div>
      <div>
        <strong>Prochain jalon : 80% de l’objectif</strong>
        <span>Encore 8 points et votre équipe débloque le badge Élan collectif.</span>
      </div>
      <span className="milestone-badge">{isUnlocked ? 'Débloqué' : 'Bientôt'}</span>
    </section>
  )
}
