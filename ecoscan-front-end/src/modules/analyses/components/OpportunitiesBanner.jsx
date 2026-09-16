import React from 'react'
import { ArrowUpRight, Sparkles } from 'lucide-react'

export function OpportunitiesBanner({ count, onExplore }) {
  if (count === 0) return null 

  return (
    <section className="insight-banner">
      <Sparkles size={19} />
      <div>
        <strong>{count} opportunité{count > 1 ? 's' : ''} attend{count > 1 ? 'ent' : ''} votre décision</strong>
        <span>EcoScan a croisé vos derniers imports et vos objectifs.</span>
      </div>
      <button className="text-button" onClick={onExplore}>
        Explorer <ArrowUpRight size={14} />
      </button>
    </section>
  )
}