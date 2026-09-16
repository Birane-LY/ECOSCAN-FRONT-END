'use client'

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/ui'
import { AnalysisCard } from './AnalysisCard'
import { AnalysisFilterBar } from './AnalysisFilterBar'
import { OpportunitiesBanner } from './OpportunitiesBanner'
import { useAnalysesData } from '../hooks/useAnalysesData'
import { useRecommandations } from '../hooks/useRecommandations'

export function AnalysesView({ setDrawer }) {
  const { analyses, loading, error } = useAnalysesData()
  const { recommandations } = useRecommandations()
  const [filter, setFilter] = useState('Toutes')

  const visibleAnalyses = analyses.filter((item) => {
    if (filter === 'Toutes') return true
    if (filter === 'Prêtes') return item.status === 'Prêt'
    if (filter === 'En revue') return item.status === 'En revue'
    return true
  })

  return (
    <>
      <PageHeader eyebrow="BIBLIOTHÈQUE D’INTELLIGENCE" title="Analyses"
        subtitle="Transformez vos données en décisions qui avancent."
        action={<button className="primary-button" onClick={() => setDrawer('new-analysis')}><Plus size={17} />Nouvelle analyse</button>} />

      <AnalysisFilterBar currentFilter={filter} onSelectFilter={setFilter} />

      {loading && <p className="muted-line">Chargement des analyses…</p>}
      {error && <p className="muted-line">Erreur : {error}</p>}

      <section className="analysis-grid">
        {visibleAnalyses.map((analysis) => (
          <AnalysisCard key={analysis.id} analysis={analysis} onClick={() => setDrawer(analysis.id)} />
        ))}
      </section>

      <OpportunitiesBanner count={recommandations.length} onExplore={() => setDrawer('opportunities')} />
    </>
  )
}