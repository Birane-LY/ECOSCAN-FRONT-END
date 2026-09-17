'use client'

import React from 'react'
import { PageHeader } from '@/components/ui'
import { GoalHero } from '@/modules/goals/components/GoalHero'
import { GoalMetricCard } from '@/modules/goals/components/GoalMetricCard'
import { MilestoneBanner } from '@/modules/goals/components/MilestoneBanner'
import { useGoalsData } from '../hooks/useGoalsData'

export function GoalsView() {
  const { objectifs, loading, error, updateObjectif } = useGoalsData()
  const actifs = objectifs.filter((o) => o.statut === 'ACTIF')
  const hero = [...actifs].sort((a, b) => new Date(a.date_fin) - new Date(b.date_fin))[0]
  const globalProgress = actifs.length
    ? Math.round(actifs.reduce((sum, o) => sum + (o.progression_actuelle / o.valeur_cible) * 100, 0) / actifs.length)
    : 0

  return (
    <>
      <PageHeader eyebrow="TRAJECTOIRE DE PERFORMANCE" title="Objectifs" subtitle="Pilotez vos engagements avec une trajectoire qui respire." />

      {loading && <p className="drawer-lead">Chargement…</p>}
      {error && <p className="drawer-lead">Erreur : {error}</p>}

      <GoalHero objectif={hero} onUpdateTarget={updateObjectif} />

      <div className="goal-grid">
        {objectifs.map((o) => (
          <GoalMetricCard
            key={o.id}
            name={o.nom}
            value={Math.min(100, Math.round((o.progression_actuelle / o.valeur_cible) * 100))}
            amount={`${o.progression_actuelle} ${o.unite}`}
          />
        ))}
      </div>

      <MilestoneBanner goal={globalProgress} />
    </>
  )
}