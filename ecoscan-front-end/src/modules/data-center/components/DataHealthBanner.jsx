import React from 'react'
import { ShieldCheck } from 'lucide-react'

export function DataHealthBanner() {
  return (
    <section className="data-health">
      <div>
        <span className="health-icon">
          <ShieldCheck size={18} />
        </span>
        <div>
          <strong>Tout est synchronisé</strong>
          <span>3 sources actives · dernière vérification il y a 4 min</span>
        </div>
      </div>
      <div className="health-stat">
        <b>99,8%</b>
        <span>qualité des données</span>
      </div>
      <div className="health-stat">
        <b>2 144</b>
        <span>lignes ce mois</span>
      </div>
    </section>
  )
}
