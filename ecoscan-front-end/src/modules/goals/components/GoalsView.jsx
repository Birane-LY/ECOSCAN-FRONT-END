'use client'

import React from 'react'
import { PageHeader } from '@/components/ui'
import { GoalHero } from '@/modules/goals/components/GoalHero'
import { GoalMetricCard } from '@/modules/goals/components/GoalMetricCard'
import { MilestoneBanner } from '@/modules/goals/components/MilestoneBanner'
import { useGoalsData } from '../hooks/useGoalsData'

export function GoalsView() {
  const { objectifs, loading, error } = useGoalsData()
  const actifs = objectifs.filter((o) => o.statut === 'ACTIF')
  const globalProgress = actifs.length
    ? Math.round(actifs.reduce((sum, o) => sum + (o.progression_actuelle / o.valeur_cible) * 100, 0) / actifs.length)
    : 0

  return (
    <>
      <PageHeader eyebrow="TRAJECTOIRE DE PERFORMANCE" title="Objectifs"
        subtitle="Pilotez vos engagements avec une trajectoire qui respire." />

      {loading && <p className="muted-line">Chargement…</p>}
      {error && <p className="muted-line">Erreur : {error}</p>}

      <GoalHero goal={globalProgress} />

      <div className="goal-grid">
        {objectifs.map((o) => (
          <GoalMetricCard
            key={o.id}
            name={o.nom}
            value={Math.round((o.progression_actuelle / o.valeur_cible) * 100)}
            amount={`${o.progression_actuelle} ${o.unite}`}
          />
        ))}
      </div>

      <MilestoneBanner goal={globalProgress} />
    </>
  )
}