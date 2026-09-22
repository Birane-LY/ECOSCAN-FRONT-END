import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { EcoMark, GlassCard } from '@/components/instruments'

export function OpportunitiesBanner({ count, onExplore }) {
  if (count === 0) return null

  return (
    <GlassCard tone="inverse" className="an-banner">
      <EcoMark size={22} />
      <div>
        <strong>
          {count} opportunité{count > 1 ? 's' : ''} attend{count > 1 ? 'ent' : ''} votre décision
        </strong>
        <span>EcoScan a croisé vos derniers imports et vos objectifs.</span>
      </div>
      <button type="button" className="primary-button" onClick={onExplore}>
        Explorer <ArrowUpRight size={16} />
      </button>
    </GlassCard>
  )
}
