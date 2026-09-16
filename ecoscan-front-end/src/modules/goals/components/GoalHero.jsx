import React from 'react'
import { ArrowUpRight } from 'lucide-react'

export function GoalHero({ goal, onIncrementGoal }) {
  return (
    <section className="goal-hero">
      <div className="goal-score">
        <div className="goal-ring">
          <strong>{goal}%</strong>
          <span>atteint</span>
        </div>
        <div>
          <p className="eyebrow">OBJECTIF NOVEMBRE</p>
          <h2>Réduire la consommation de 18%</h2>
          <p>Vous êtes en avance de 4 jours sur votre trajectoire.</p>
          <button className="text-button" onClick={onIncrementGoal}>
            Mettre à jour la cible <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
      <div className="forecast">
        <span>PRÉVISION</span>
        <strong>−20,4%</strong>
        <small>à la fin du mois</small>
        <div className="forecast-line">
          <i />
        </div>
      </div>
    </section>
  )
}
