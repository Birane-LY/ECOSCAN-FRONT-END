'use client'

import React, { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader' 
import { AnalysisCard } from './AnalysisCard'
import { AnalysisFilterBar } from './AnalysisFilterBar'
import { OpportunitiesBanner } from './OpportunitiesBanner'
import { useAnalysesData } from '../hooks/useAnalysesData'
import { useRecommandations } from '../hooks/useRecommandations'

export function AnalysesView({ setDrawer }) {
  const { analyses, loading, error } = useAnalysesData()
  const { recommandations } = useRecommandations()
  const [filter, setFilter] = useState('Toutes')
  const [sortKey, setSortKey] = useState('date_desc')

  const counts = useMemo(
    () => ({
      Toutes: analyses.length,
      'Prêtes': analyses.filter((a) => a.status === 'Prêt').length,
      'En revue': analyses.filter((a) => a.status !== 'Prêt').length,
    }),
    [analyses],
  )

  const visibleAnalyses = useMemo(
    () =>
      analyses
        .filter((item) => filter === 'Toutes' || (filter === 'Prêtes' ? item.status === 'Prêt' : item.status === 'En revue'))
        .sort((a, b) => {
          if (sortKey === 'score_desc') return b.score - a.score
          const diff = new Date(a.dateRaw) - new Date(b.dateRaw)
          return sortKey === 'date_asc' ? diff : -diff
        }),
    [analyses, filter, sortKey],
  )

  return (
    <div className="an">
      <PageHeader
        title="Analyses"
        subtitle="Transformez vos données en décisions qui avancent."
        action={
          <button className="primary-button" onClick={() => setDrawer('new-analysis')}>
            <Plus size={17} />
            Nouvelle analyse
          </button>
        }
      />

      <AnalysisFilterBar
        currentFilter={filter}
        onSelectFilter={setFilter}
        sortKey={sortKey}
        onSelectSort={setSortKey}
        counts={counts}
      />

      {loading && <p className="drawer-lead">Chargement des analyses…</p>}
      {error && <p className="drawer-lead">Erreur : {error}</p>}
      {!loading && !error && visibleAnalyses.length === 0 && (
        <p className="drawer-lead">
          Aucune analyse dans cette vue. Importez une source de données pour en générer.
        </p>
      )}

      <section className="an-grid">
        {visibleAnalyses.map((analysis) => (
          <AnalysisCard key={analysis.id} analysis={analysis} onClick={() => setDrawer(analysis.id)} />
        ))}
      </section>

      <OpportunitiesBanner count={recommandations.length} onExplore={() => setDrawer('opportunities')} />
    </div>
  )
}
