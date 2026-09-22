'use client'

import React, { useMemo } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { DotNumeral, GlassCard, RangeBars } from '@/components/instruments'

export function InsightCard({
  title = 'Analyse des tendances',
  description = 'Aucune donnée suffisante pour analyser la tendance.',
  buttonText = 'Explorer la tendance',
  share = '0',
  barsData = [],
  highlightIndex,
  onExplore,
}) {
  // Détermine automatiquement l'index de la valeur maximale si aucun n'est fourni
  const computedHighlightIndex = useMemo(() => {
    if (typeof highlightIndex === 'number') return highlightIndex
    if (!barsData || barsData.length === 0) return -1
    
    return barsData.reduce(
      (best, item, index) => (item.value > (barsData[best]?.value || 0) ? index : best),
      0
    )
  }, [barsData, highlightIndex])

  const hasData = Array.isArray(barsData) && barsData.length > 0

  return (
    <GlassCard as="article" className="insight">
      <div className="insight-top">
        <h3>{title}</h3>
        <DotNumeral size={54} className="dotnum">
          {share}
        </DotNumeral>
      </div>
      <p>{description}</p>
      
      {hasData && (
        <div className="insight-bars">
          <RangeBars 
            data={barsData} 
            compact 
            highlight={computedHighlightIndex >= 0 ? computedHighlightIndex : undefined} 
            unit="%" 
          />
        </div>
      )}

      <button 
        type="button"
        className="quiet-button" 
        onClick={() => onExplore?.(title)} 
        style={{ alignSelf: 'flex-start' }}
      >
        {buttonText} <ArrowUpRight size={15} />
      </button>
    </GlassCard>
  )
}